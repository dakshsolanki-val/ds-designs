/* ============================================
   DS DESIGNS — Admin Panel Logic
   ============================================ */

/* ---- State ---- */
let allProjects   = [];
let editingId     = null;     // null = adding new
let currentImages = [];       // array of {url, isNew}
let coverIndex    = 0;
let dashboardInitialized = false;

/* ---- DOM helpers ---- */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

/* ---- Toast notifications ---- */
let _toastTimer;
function toast(msg, type = 'success'){
  const t = $('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---- Spinner helpers ---- */
function setBtnLoading(btn, loading){
  if(loading){
    btn.disabled = true;
    btn._label = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Saving…`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._label || btn.innerHTML;
  }
}

/* ============================================
   AUTH
   ============================================ */
function showLogin(){ show($('screen-login')); hide($('screen-dashboard')); }
function showDashboard(user){
  hide($('screen-login'));
  show($('screen-dashboard'));
  $('admin-user-email').textContent = user.email;
  if (!dashboardInitialized) {
    dashboardInitialized = true;
    loadProjects();
  }
}

$('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email    = $('login-email').value.trim();
  const password = $('login-password').value;
  const btn      = $('btn-login');
  const errEl    = $('login-error');
  errEl.textContent = '';
  setBtnLoading(btn, true);
  try {
    if(!SUPABASE_CONFIGURED) throw new Error('Supabase is not yet configured. Fill in your URL and key in js/supabase-config.js first.');
    await DB.auth.signIn(email, password);
  } catch(err){
    errEl.textContent = err.message || 'Login failed.';
    setBtnLoading(btn, false);
  }
});

$('btn-signout').addEventListener('click', async () => {
  await DB.auth.signOut();
  showLogin();
});

/* Listen for auth state changes */
DB.auth.onStateChange(user => {
  if(user) showDashboard(user);
  else     showLogin();
});

/* On first load, check existing session */
(async () => {
  const user = await DB.auth.getUser();
  if(user) showDashboard(user);
  else     showLogin();
})();

/* ============================================
   PROJECT LIST
   ============================================ */
async function loadProjects(){
  allProjects = await DB.getProjects();
  renderSidebar(allProjects);
  renderWelcomeStats();
  showView('welcome');
}

function renderSidebar(projects){
  const list = $('project-list');
  if(!projects.length){
    list.innerHTML = `<p style="padding:1.2rem;font-size:0.82rem;color:#5a5550;">No projects yet. Add your first one.</p>`;
    return;
  }
  list.innerHTML = projects.map(p => `
    <div class="project-list-item" data-id="${p.id}" onclick="openEdit('${p.id}')">
      <img class="thumb" src="${p.cover || 'images/hero.svg'}" alt="${p.title}" onerror="this.src='images/hero.svg'">
      <div class="info">
        <div class="name">${p.title}</div>
        <div class="cat">${p.category} · ${p.year}</div>
      </div>
    </div>`).join('');
}

function renderWelcomeStats(){
  $('stat-total').textContent = allProjects.length;
  $('stat-res').textContent   = allProjects.filter(p => p.category === 'Residential').length;
  $('stat-com').textContent   = allProjects.filter(p => p.category === 'Commercial').length;
  $('stat-int').textContent   = allProjects.filter(p => p.category === 'Interiors').length;
}

/* Sidebar search */
$('sidebar-search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  renderSidebar(allProjects.filter(p =>
    p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  ));
});

/* ============================================
   VIEWS
   ============================================ */
function showView(name){
  $$('.admin-view').forEach(el => el.classList.add('hidden'));
  let viewId = 'view-welcome';
  if(name === 'form') viewId = 'view-form';
  if(name === 'inquiries') viewId = 'view-inquiries';
  show($(viewId));
}

async function openInquiriesView(){
  showView('inquiries');
  setActiveSidebar(null);
  await loadInquiries();
}

async function loadInquiries(){
  if(!SUPABASE_CONFIGURED){
    toast('Supabase is not configured.', 'error');
    return;
  }
  try {
    const inquiries = await DB.getContactInquiries();
    renderInquiries(inquiries);
  } catch(err){
    toast('Failed to load inquiries: ' + err.message, 'error');
  }
}

function renderInquiries(inquiries){
  const tbody = $('inquiries-body');
  const empty = $('inquiries-empty');
  
  if(!inquiries.length){
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  tbody.innerHTML = inquiries.map(inq => {
    const date = new Date(inq.created_at).toLocaleDateString() + ' ' + new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const preview = String(inq.message || '').replace(/\s+/g, ' ').trim();
    const previewText = preview ? preview.slice(0, 140) + (preview.length > 140 ? '…' : '') : '—';
    return `
      <tr class="inquiry-row" style="border-bottom: 1px solid #eee; cursor:pointer;"
          data-id="${inq.id}"
          data-name="${escapeHtml(inq.name)}"
          data-email="${escapeHtml(inq.email)}"
          data-phone="${escapeHtml(inq.phone || '')}"
          data-project-type="${escapeHtml(inq.project_type || '')}"
          data-message="${escapeHtml(inq.message || '')}"
          onclick="openInquiryDetailFromRow(this)">
        <td style="padding:0.8rem;">${escapeHtml(inq.name)}</td>
        <td style="padding:0.8rem;">${escapeHtml(inq.email)}</td>
        <td style="padding:0.8rem;">${escapeHtml(inq.project_type || '—')}</td>
        <td class="inquiry-message-cell" style="padding:0.8rem;">${escapeHtml(previewText)}</td>
        <td style="padding:0.8rem; font-size:0.8rem; color:#666;">${date}</td>
        <td style="padding:0.8rem; text-align:center;">
          <button class="btn btn-danger" type="button" onclick="event.stopPropagation(); deleteInquiryFromRow(this)" data-id="${inq.id}" data-name="${escapeHtml(inq.name)}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(text = ''){
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openInquiryDetailFromRow(row){
  showInquiryDetail(
    row.dataset.id,
    row.dataset.name || '',
    row.dataset.email || '',
    row.dataset.phone || '',
    row.dataset.projectType || row.dataset.projectType || '',
    row.dataset.message || ''
  );
}

function deleteInquiryFromRow(button){
  deleteInquiry(button.dataset.id, button.dataset.name || '');
}

function showInquiryDetail(id, name, email, phone, projectType, message){
  const html = `
    <div style="padding:1.5rem;">
      <h3 style="margin-bottom:1rem;">Inquiry Details</h3>
      <div style="line-height:1.8;">
        <div><strong>Name:</strong> ${escapeHtml(name)}</div>
        <div><strong>Email:</strong> ${escapeHtml(email)}</div>
        <div><strong>Phone:</strong> ${phone ? escapeHtml(phone) : '—'}</div>
        <div><strong>Project Type:</strong> ${projectType ? escapeHtml(projectType) : '—'}</div>
        <div style="margin-top:1rem;"><strong>Message:</strong></div>
        <div style="background:#f5f3f0; padding:1rem; border-radius:4px; white-space:pre-wrap; word-break:break-word;">${escapeHtml(message)}</div>
      </div>
      <div style="margin-top:1.5rem; display:flex; gap:0.5rem;">
        <button class="btn" onclick="closeModal()">Close</button>
        <button class="btn btn-danger" onclick="deleteInquiry(${id}, '${name.replace(/'/g, "\\'")}'); closeModal();">Delete this inquiry</button>
      </div>
    </div>
  `;
  showModalContent(html);
}

function showModalContent(html){
  let modal = $('inquiry-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'inquiry-modal';
    modal.classList.add('modal-overlay');
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box">
      ${html}
    </div>
  `;
  modal.classList.remove('hidden');
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });
}

function closeModal(){
  const modal = $('inquiry-modal');
  if(modal) modal.classList.add('hidden');
}

async function deleteInquiry(id, name){
  if(!confirm(`Delete inquiry from ${name}? This cannot be undone.`)) return;
  try {
    await DB.deleteContactInquiry(id);
    toast('Inquiry deleted.');
    loadInquiries();
  } catch(err){
    toast('Failed to delete: ' + err.message, 'error');
  }
}


function openNew(){
  editingId     = null;
  currentImages = [];
  coverIndex    = 0;
  showView('form');
  $('form-eyebrow').textContent = 'New Project';
  $('form-title-heading').textContent = 'Add a new project';
  hide($('btn-delete-project'));
  resetForm();
  setActiveSidebar(null);
}

function openEdit(id){
  const p = allProjects.find(p => p.id === id);
  if(!p) return;
  editingId     = id;
  currentImages = p.images.map(url => ({ url, isNew: false }));
  coverIndex    = 0;
  showView('form');
  $('form-eyebrow').textContent     = 'Edit Project';
  $('form-title-heading').textContent = `Editing: ${p.title}`;
  show($('btn-delete-project'));
  populateForm(p);
  setActiveSidebar(id);
  renderImageGrid();
}

function setActiveSidebar(id){
  $$('.project-list-item').forEach(el => el.classList.remove('active'));
  if(id){
    const el = document.querySelector(`.project-list-item[data-id="${id}"]`);
    if(el){ el.classList.add('active'); el.scrollIntoView({ block:'nearest' }); }
  }
}

$('btn-new-project').addEventListener('click', openNew);
$('btn-sidebar-responses').addEventListener('click', () => {
  setActiveSidebar(null);
  openInquiriesView();
});
$('btn-cancel-form').addEventListener('click', () => {
  showView('welcome');
  setActiveSidebar(null);
});

/* Contact Inquiries */
$('btn-view-inquiries').addEventListener('click', openInquiriesView);
$('btn-back-inquiries').addEventListener('click', () => {
  showView('welcome');
  setActiveSidebar(null);
});



/* ============================================
   FORM — populate / reset
   ============================================ */
function populateForm(p){
  $('f-id').value       = p.id;
  $('f-title').value    = p.title;
  $('f-category').value = p.category;
  $('f-year').value     = p.year;
  $('f-location').value = p.location;
  $('f-brief').value    = p.brief;

  // Story paragraphs
  const container = $('story-paragraphs');
  container.innerHTML = '';
  const paras = p.story.length ? p.story : [''];
  paras.forEach(text => addStoryPara(text));

  // Specs
  $('f-area').value     = p.specs.area;
  $('f-duration').value = p.specs.duration;
  $('f-scope').value    = p.specs.scope;
}

function resetForm(){
  $('f-id').value       = '';
  $('f-title').value    = '';
  $('f-category').value = 'Residential';
  $('f-year').value     = new Date().getFullYear();
  $('f-location').value = '';
  $('f-brief').value    = '';
  $('f-area').value     = '';
  $('f-duration').value = '';
  $('f-scope').value    = '';

  const container = $('story-paragraphs');
  container.innerHTML = '';
  addStoryPara('');
  renderImageGrid();
}

/* Auto-generate ID from title when adding new */
$('f-title').addEventListener('input', () => {
  if(!editingId){
    $('f-id').value = slugify($('f-title').value);
  }
});

function slugify(t){
  return t.toLowerCase().trim()
    .replace(/[^\w\s-]/g,'')
    .replace(/[\s_]+/g,'-')
    .replace(/-+/g,'-');
}

/* ============================================
   STORY PARAGRAPHS
   ============================================ */
function addStoryPara(text = ''){
  const container = $('story-paragraphs');
  const div = document.createElement('div');
  div.className = 'story-para';
  div.innerHTML = `
    <textarea rows="3" placeholder="Write this paragraph of the story…">${escHtml(text)}</textarea>
    <button type="button" class="btn-remove-para" title="Remove paragraph" onclick="this.closest('.story-para').remove()">×</button>`;
  container.appendChild(div);
}
function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

$('btn-add-para').addEventListener('click', () => addStoryPara());

function getStoryParagraphs(){
  return [...$$('#story-paragraphs textarea')]
    .map(t => t.value.trim())
    .filter(Boolean);
}

/* ============================================
   IMAGE UPLOAD
   ============================================ */
const uploadInput = $('image-upload-input');

// Drag-and-drop on the zone
const zone = $('upload-zone');
zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => {
  e.preventDefault();
  zone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
uploadInput.addEventListener('change', () => handleFiles(uploadInput.files));

async function handleFiles(files){
  if(!files.length) return;
  if(!SUPABASE_CONFIGURED){
    toast('Connect Supabase first to upload images.', 'error');
    return;
  }
  const progress = $('upload-progress');
  const projectId = $('f-id').value || 'new-project';
  const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
  progress.textContent = `Uploading ${arr.length} image${arr.length>1?'s':''}…`;

  for(const file of arr){
    try {
      const url = await DB.uploadImage(file, projectId);
      currentImages.push({ url, isNew: true });
    } catch(err){
      toast(`Upload failed: ${err.message}`, 'error');
    }
  }
  progress.textContent = '';
  uploadInput.value = '';
  renderImageGrid();
}

function renderImageGrid(){
  const grid = $('image-preview-grid');
  if(!currentImages.length){
    grid.innerHTML = '<p style="color:var(--ink-soft);font-size:0.85rem;grid-column:1/-1;">No images yet. Upload some above.</p>';
    return;
  }
  grid.innerHTML = currentImages.map((img, i) => `
    <div class="image-preview-item">
      <img src="${img.url}" alt="Project image ${i+1}" onerror="this.src='images/hero.svg'">
      ${i === coverIndex ? '<span class="cover-badge">Cover</span>' : `<button type="button" class="btn-set-cover" onclick="setCover(${i})">Set as cover</button>`}
      <button type="button" class="btn-remove-img" onclick="removeImage(${i})" title="Remove">×</button>
    </div>`).join('');
}

function setCover(i){ coverIndex = i; renderImageGrid(); }
function removeImage(i){
  currentImages.splice(i, 1);
  if(coverIndex >= currentImages.length) coverIndex = 0;
  renderImageGrid();
}

/* ============================================
   SAVE PROJECT
   ============================================ */
$('btn-save-project').addEventListener('click', saveProject);

async function saveProject(){
  const btn    = $('btn-save-project');
  const title  = $('f-title').value.trim();
  const id     = $('f-id').value.trim();
  if(!title || !id){ toast('Title and ID are required.', 'error'); return; }
  if(!SUPABASE_CONFIGURED){ toast('Connect Supabase to save projects.', 'error'); return; }

  setBtnLoading(btn, true);
  try {
    const imageUrls = currentImages.map(img => img.url);
    const coverUrl  = imageUrls[coverIndex] || imageUrls[0] || '';

    const data = {
      id:       id,
      title:    title,
      category: $('f-category').value,
      year:     parseInt($('f-year').value),
      location: $('f-location').value.trim(),
      brief:    $('f-brief').value.trim(),
      story:    getStoryParagraphs(),
      cover:    coverUrl,
      images:   imageUrls,
      specs: {
        area:     $('f-area').value.trim(),
        duration: $('f-duration').value.trim(),
        scope:    $('f-scope').value.trim()
      },
      sort_order: editingId
        ? (allProjects.find(p => p.id === editingId)?.sort_order || 0)
        : allProjects.length
    };

    if(editingId){
      await DB.updateProject(editingId, data);
      toast('Project updated.');
    } else {
      await DB.createProject(data);
      toast('Project added.');
    }
    await loadProjects();
    showView('welcome');
  } catch(err){
    toast(err.message || 'Save failed.', 'error');
  } finally {
    setBtnLoading(btn, false);
  }
}

/* ============================================
   DELETE PROJECT
   ============================================ */
$('btn-delete-project').addEventListener('click', () => {
  if(!editingId) return;
  const p = allProjects.find(p => p.id === editingId);
  $('delete-project-name').textContent = p?.title || editingId;
  show($('delete-modal'));
});

$('btn-confirm-delete').addEventListener('click', async () => {
  hide($('delete-modal'));
  const btn = $('btn-delete-project');
  setBtnLoading(btn, true);
  try {
    await DB.deleteProject(editingId);
    toast('Project deleted.');
    editingId = null;
    await loadProjects();
    showView('welcome');
  } catch(err){
    toast(err.message || 'Delete failed.', 'error');
  } finally {
    setBtnLoading(btn, false);
  }
});

$('btn-cancel-delete').addEventListener('click', () => hide($('delete-modal')));

