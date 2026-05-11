create table if not exists public.cases (
  id text primary key,
  title text not null,
  doctor text not null,
  category text not null,
  subcategory text not null default 'General',
  tags text[] not null default '{}',
  timeline text,
  summary text,
  before_image text not null,
  after_image text not null,
  consent boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases
add column if not exists subcategory text not null default 'General';

create index if not exists cases_doctor_idx on public.cases (doctor);
create index if not exists cases_category_idx on public.cases (category);
create index if not exists cases_subcategory_idx on public.cases (subcategory);
create index if not exists cases_featured_idx on public.cases (featured);

alter table public.cases enable row level security;

drop policy if exists "Public can read cases" on public.cases;
drop policy if exists "Authenticated admins can read all cases" on public.cases;
drop policy if exists "Authenticated admins can manage cases" on public.cases;

create policy "Public can read cases"
on public.cases
for select
to anon, authenticated
using (consent = true);

create policy "Authenticated admins can read all cases"
on public.cases
for select
to authenticated
using (true);

create policy "Authenticated admins can manage cases"
on public.cases
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('case-images', 'case-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read case images" on storage.objects;
drop policy if exists "Authenticated admins can upload case images" on storage.objects;
drop policy if exists "Authenticated admins can update case images" on storage.objects;
drop policy if exists "Authenticated admins can delete case images" on storage.objects;

create policy "Public can read case images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'case-images');

create policy "Authenticated admins can upload case images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'case-images');

create policy "Authenticated admins can update case images"
on storage.objects
for update
to authenticated
using (bucket_id = 'case-images')
with check (bucket_id = 'case-images');

create policy "Authenticated admins can delete case images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'case-images');
