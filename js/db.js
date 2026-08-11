/* ============================================
   DS DESIGNS — Database Layer (db.js)
   All Supabase interactions go through this file.
   Falls back to static PROJECTS data if Supabase
   is not yet configured.
   ============================================ */

// Initialise Supabase client (or null if not configured)
const _sb = SUPABASE_CONFIGURED
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { storage: window.sessionStorage }
    })
  : null;

/* ---- Shape converters ---------------------------------- */

function _dbToProject(row) {
  return {
    id:       row.id,
    title:    row.title,
    category: row.category,
    year:     row.year,
    location: row.location,
    brief:    row.brief || '',
    story:    Array.isArray(row.story) ? row.story : [],
    cover:    row.cover_url || '',
    images:   Array.isArray(row.image_urls) ? row.image_urls : [],
    specs: {
      area:     row.specs_area     || '',
      duration: row.specs_duration || '',
      scope:    row.specs_scope    || ''
    },
    featured:   row.featured    || false,
    sort_order: row.sort_order  || 0
  };
}

function _projectToDb(p) {
  return {
    id:           p.id,
    title:        p.title,
    category:     p.category,
    year:         parseInt(p.year),
    location:     p.location,
    brief:        p.brief,
    story:        p.story,
    cover_url:    p.cover,
    image_urls:   p.images,
    specs_area:     p.specs?.area     || '',
    specs_duration: p.specs?.duration || '',
    specs_scope:    p.specs?.scope    || '',
    featured:     p.featured    || false,
    sort_order:   p.sort_order  || 0
  };
}

/* ---- Slug helper --------------------------------------- */
function slugify(text) {
  return text.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

/* ======================================================
   PUBLIC API — use `DB.xxx()` everywhere
   ====================================================== */
const DB = {

  /* Returns true when Supabase is active */
  isLive() { return !!_sb; },

  /* ---- Projects ---------------------------------------- */

  async getProjects() {
    if (!_sb) return [...PROJECTS].map(p => ({ ...p }));
    const { data, error } = await _sb
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { console.error('DB.getProjects:', error); return [...PROJECTS]; }
    return data.map(_dbToProject);
  },

  async getProject(id) {
    if (!_sb) return PROJECTS.find(p => p.id === id) || null;
    const { data, error } = await _sb
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error('DB.getProject:', error); return null; }
    return _dbToProject(data);
  },

  async createProject(p) {
    if (!_sb) throw new Error('Supabase not configured');
    if (!p.id) p.id = slugify(p.title);
    const { data, error } = await _sb
      .from('projects')
      .insert([_projectToDb(p)])
      .select()
      .single();
    if (error) throw error;
    return _dbToProject(data);
  },

  async updateProject(id, p) {
    if (!_sb) throw new Error('Supabase not configured');
    const { data, error } = await _sb
      .from('projects')
      .update(_projectToDb({ ...p, id }))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return _dbToProject(data);
  },

  async deleteProject(id) {
    if (!_sb) throw new Error('Supabase not configured');
    const { error } = await _sb.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  /* ---- Contact Inquiries -------------------------------- */

  async createContactInquiry(data) {
    if (!_sb) throw new Error('Supabase not configured');
    const payload = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      project_type: data.projectType || '',
      message: data.message || '',
      source: data.source || 'DS Designs website'
    };

    const { data: result, error } = await _sb
      .from('contact_inquiries')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getContactInquiries() {
    if (!_sb) throw new Error('Supabase not configured');
    const { data, error } = await _sb
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async deleteContactInquiry(id) {
    if (!_sb) throw new Error('Supabase not configured');
    const { error } = await _sb
      .from('contact_inquiries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  /* ---- Image Storage ----------------------------------- */

  async uploadImage(file, projectId) {
    if (!_sb) throw new Error('Supabase not configured');
    const ext  = file.name.split('.').pop().toLowerCase();
    const name = `${projectId}/${Date.now()}.${ext}`;
    
    // Normalize MIME type for JPG files
    let contentType = file.type;
    if ((ext === 'jpg' || ext === 'jpeg') && contentType === 'image/jpg') {
      contentType = 'image/jpeg';
    }
    
    const { error } = await _sb.storage
      .from('project-images')
      .upload(name, file, { upsert: false, contentType: contentType });
    if (error) throw error;
    const { data: pub } = _sb.storage.from('project-images').getPublicUrl(name);
    return pub.publicUrl;
  },

  async deleteImageByUrl(url) {
    if (!_sb) return;
    // Extract storage path from the public URL
    const marker = '/project-images/';
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    await _sb.storage.from('project-images').remove([path]);
  },

  /* ---- Auth ------------------------------------------- */

  auth: {
    async signIn(email, password) {
      if (!_sb) throw new Error('Supabase not configured');
      const { data, error } = await _sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    async signOut() {
      if (!_sb) return;
      await _sb.auth.signOut();
    },
    async getUser() {
      if (!_sb) return null;
      const { data } = await _sb.auth.getUser();
      return data?.user || null;
    },
    onStateChange(callback) {
      if (!_sb) return;
      _sb.auth.onAuthStateChange((_event, session) => callback(session?.user || null));
    }
  }
};
