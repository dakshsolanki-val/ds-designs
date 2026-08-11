-- ============================================
-- DS DESIGNS — Supabase Schema
-- Paste this entire file into the Supabase
-- SQL Editor and click "Run".
-- ============================================

-- 1. PROJECTS TABLE
-- -------------------------------------------------
create table if not exists projects (
  id            text        primary key,
  title         text        not null,
  category      text        not null check (category in ('Residential','Commercial','Interiors')),
  year          integer     not null,
  location      text        not null default '',
  brief         text        not null default '',
  story         jsonb       not null default '[]',
  cover_url     text        not null default '',
  image_urls    jsonb       not null default '[]',
  specs_area    text        not null default '',
  specs_duration text       not null default '',
  specs_scope   text        not null default '',
  featured      boolean     not null default false,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists site_content (
  key          text        primary key,
  content      jsonb       not null default '{}',
  updated_at   timestamptz not null default now()
);

create table if not exists contact_inquiries (
  id            bigint generated always as identity primary key,
  name          text        not null default '',
  email         text        not null default '',
  phone         text        not null default '',
  project_type  text        not null default '',
  message       text        not null default '',
  source        text        not null default 'DS Designs website',
  created_at    timestamptz not null default now()
);

-- Auto-update updated_at on every save
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

drop trigger if exists trg_site_content_updated_at on site_content;
create trigger trg_site_content_updated_at
  before update on site_content
  for each row execute function set_updated_at();


-- 2. ROW LEVEL SECURITY
-- -------------------------------------------------
alter table projects enable row level security;
alter table site_content enable row level security;
alter table contact_inquiries enable row level security;

-- Anyone can read projects (the public website)
drop policy if exists "Public can read projects" on projects;
create policy "Public can read projects"
  on projects for select
  using (true);

drop policy if exists "Public can read site content" on site_content;
create policy "Public can read site content"
  on site_content for select
  using (true);

-- Only logged-in admins can create / update / delete
drop policy if exists "Admins can manage projects" on projects;
create policy "Admins can manage projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins can manage site content" on site_content;
create policy "Admins can manage site content"
  on site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Visitors can submit contact inquiries from the site
drop policy if exists "Anyone can submit contact inquiries" on contact_inquiries;
create policy "Anyone can submit contact inquiries"
  on contact_inquiries for insert
  to anon
  with check (true);

-- Only authenticated admins can read inquiries
 drop policy if exists "Admins can view contact inquiries" on contact_inquiries;
create policy "Admins can view contact inquiries"
  on contact_inquiries for select
  using (auth.role() = 'authenticated');


-- 3. STORAGE BUCKET FOR IMAGES
-- -------------------------------------------------
-- Create the bucket (public = images are accessible without auth)
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Anyone can view images
drop policy if exists "Public can view images" on storage.objects;
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Only admins can upload
drop policy if exists "Admins can upload images" on storage.objects;
create policy "Admins can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'project-images'
    and auth.role() = 'authenticated'
  );

-- Only admins can delete
drop policy if exists "Admins can delete images" on storage.objects;
create policy "Admins can delete images"
  on storage.objects for delete
  using (
    bucket_id = 'project-images'
    and auth.role() = 'authenticated'
  );


-- 4. (OPTIONAL) SEED WITH SAMPLE PROJECTS
-- -------------------------------------------------
-- Un-comment this block to pre-populate the database
-- with the 6 sample projects from the static site.
-- You can delete them later from the admin panel.

/*
insert into projects (id, title, category, year, location, brief, story, cover_url, image_urls, specs_area, specs_duration, specs_scope, sort_order) values
(
  'lantern-house', 'The Lantern House', 'Residential', 2024,
  'Bhavnagar, Gujarat',
  'A family home built around a single courtyard of light.',
  '["The clients asked for a house that didn''t feel like it was hiding from the sun. We did the opposite: a double-height light well runs through the centre of the plan.","Materials stay quiet on purpose — local stone, lime-washed walls, teak detailing — so the light itself becomes the main material of the house.","The brief was a house that feels calm even when it''s full of people. Six months after handover, the family still eats breakfast in the courtyard every day."]',
  '', '[]', '3,800 sq.ft', '14 months', 'Architecture + Interiors', 0
),
(
  'meridian-offices', 'Meridian Offices', 'Commercial', 2023,
  'Ahmedabad, Gujarat',
  'A workplace designed around how the team actually moves through a day.',
  '["Before drawing a single wall, we spent two weeks observing how the existing team worked.","The result favours a spine of informal meeting nooks over a wall of closed cabins. Daylight was prioritised over headcount-per-square-foot.","We treated acoustics as seriously as aesthetics: every open zone is paired with a quieter counterpart within ten steps."]',
  '', '[]', '9,200 sq.ft', '10 months', 'Architecture + Workplace Strategy', 1
),
(
  'birch-stone-apartment', 'Birch & Stone Apartment', 'Interiors', 2024,
  'Surat, Gujarat',
  'An interior fit-out for a young family upgrading from their first home.',
  '["We kept the bones honest and let texture do the work: limewash, cane, brushed brass, raw oak.","The clients'' one firm request was no two rooms should feel like they were designed by different people.","Storage was the real design problem here. Half the budget for joinery went into things you can''t see."]',
  '', '[]', '1,650 sq.ft', '5 months', 'Interior Design', 2
)
on conflict (id) do nothing;
*/

  