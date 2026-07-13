-- ============================================
-- EVENTS
-- ============================================
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  reveal_at    timestamptz not null,
  filter_style text not null default 'natural'
                 check (filter_style in ('warm', 'bw', 'natural')),
  owner_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index idx_events_reveal_at on public.events(reveal_at);

-- ============================================
-- PHOTOS
-- ============================================
create table public.photos (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  storage_path text not null,
  guest_name   text,
  created_at   timestamptz not null default now()
);

create index idx_photos_event_id on public.photos(event_id);

-- ============================================
-- STORAGE BUCKET (privé)
-- ============================================
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', false);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.events enable row level security;
alter table public.photos enable row level security;

-- EVENTS ------------------------------------------------

-- Tout le monde peut lire les métadonnées d'un event
-- (nom, reveal_at, filter_style) : nécessaire pour l'écran verrouillé + countdown
create policy "events_select_public"
  on public.events for select
  using (true);

-- Seul un utilisateur (anonyme) connecté peut créer un event, et uniquement pour lui-même
create policy "events_insert_own"
  on public.events for insert
  to authenticated
  with check (owner_id = auth.uid());

-- PHOTOS ------------------------------------------------

-- N'importe qui (invité, sans session) peut uploader une photo
create policy "photos_insert_public"
  on public.photos for insert
  with check (true);

-- Les photos ne sont lisibles que si reveal_at est passé (côté serveur, via now())
-- OU si le lecteur est le owner de l'event (organisateur)
create policy "photos_select_after_reveal_or_owner"
  on public.photos for select
  using (
    exists (
      select 1 from public.events e
      where e.id = photos.event_id
        and (e.reveal_at <= now() or e.owner_id = auth.uid())
    )
  );

-- STORAGE OBJECTS -----------------------------------------
-- Convention de chemin : event-photos/{event_id}/{photo_id}.jpg

create policy "storage_insert_public"
  on storage.objects for insert
  with check (bucket_id = 'event-photos');

create policy "storage_select_after_reveal_or_owner"
  on storage.objects for select
  using (
    bucket_id = 'event-photos'
    and exists (
      select 1 from public.events e
      -- storage.objects.name must be qualified: the `events` table also has
      -- a `name` column, and unqualified `name` resolves to the inner scope.
      where e.id::text = (storage.foldername(storage.objects.name))[1]
        and (e.reveal_at <= now() or e.owner_id = auth.uid())
    )
  );
