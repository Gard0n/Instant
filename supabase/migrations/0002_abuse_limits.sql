-- Limite anti-abus : un event public sans compte peut être spammé si le lien fuite.
-- On borde le nombre de photos par event et la taille max par fichier, côté serveur
-- (le client compresse déjà avant upload, mais rien n'empêche un appel API direct).

create or replace function public.enforce_photo_limit_per_event()
returns trigger as $$
begin
  if (select count(*) from public.photos where event_id = new.event_id) >= 2000 then
    raise exception 'Nombre maximum de photos atteint pour cet événement';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger photos_enforce_limit
  before insert on public.photos
  for each row execute function public.enforce_photo_limit_per_event();

-- 10 Mo max par fichier (une photo compressée côté client pèse quelques centaines de Ko)
update storage.buckets set file_size_limit = 10485760 where id = 'event-photos';
