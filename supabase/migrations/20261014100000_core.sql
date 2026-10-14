-- =============================================================================
-- CORE — socle commun du SI SOMA by Groupe Mozaïc
--   * organisations (groupe, filiales) et sites
--   * profils utilisateurs liés à Supabase Auth, rôles par organisation
--   * fonctions d'autorisation utilisées par toutes les policies RLS
--   * journal d'audit, numérotation des pièces, aide à la pose des policies
-- =============================================================================

create schema if not exists core;
grant usage on schema core to authenticated, service_role;

-- ---------------------------------------------------------------- types
create type core.role_app as enum (
  'admin',        -- administration complète
  'direction',    -- lecture transverse + validation
  'finance',      -- trésorerie, facturation, budgets
  'comptable',    -- saisie et validation comptable
  'logistique',   -- allocations, BL, flotte, FIFO
  'chef_site',    -- production et opérations sur site
  'mine',         -- exploitation minière, conformité des titres
  'hqse',         -- hygiène, qualité, sécurité, environnement
  'rh',           -- personnel et paie
  'chauffeur',    -- accès FIFO / ses propres livraisons
  'lecteur'       -- lecture seule
);

-- ---------------------------------------------------------------- tables
create table core.organisations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  forme_juridique text,
  ninea text,
  rccm text,
  adresse text,
  parent_id uuid references core.organisations(id) on delete restrict,
  devise char(3) not null default 'XOF',
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organisations_code_format check (code ~ '^[A-Z0-9_]{2,20}$')
);
create index organisations_parent_idx on core.organisations (parent_id);

create table core.sites (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  nom text not null,
  type text not null check (type in ('mine', 'usine', 'site_ensachage', 'depot', 'siege', 'autre')),
  region text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index sites_organisation_idx on core.sites (organisation_id);

create table core.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nom_complet text,
  telephone text,
  actif boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table core.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.profiles(id) on delete cascade,
  organisation_id uuid not null references core.organisations(id) on delete cascade,
  role core.role_app not null,
  created_at timestamptz not null default now(),
  created_by uuid references core.profiles(id),
  unique (user_id, organisation_id, role)
);
create index memberships_user_idx on core.memberships (user_id);
create index memberships_org_idx on core.memberships (organisation_id);

-- Compteurs de numérotation (pièces comptables, factures, BL, courriers…)
create table core.numerotations (
  organisation_id uuid not null references core.organisations(id) on delete cascade,
  code text not null,
  annee int not null,
  dernier int not null default 0,
  primary key (organisation_id, code, annee)
);

create table core.audit_log (
  id bigint generated always as identity primary key,
  schema_name text not null,
  table_name text not null,
  record_id text,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  user_id uuid default auth.uid(),
  at timestamptz not null default now()
);
create index audit_log_record_idx on core.audit_log (schema_name, table_name, record_id);
create index audit_log_at_idx on core.audit_log (at desc);

-- Pièces jointes (fichiers dans Storage, bucket « documents »), rattachables
-- à n'importe quel enregistrement d'un module.
create table core.documents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  entite text not null,          -- ex. 'mine.courriers'
  entite_id uuid not null,
  nom_fichier text not null,
  storage_path text not null,
  mime_type text,
  taille_octets bigint,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index documents_entite_idx on core.documents (entite, entite_id);
create index documents_organisation_idx on core.documents (organisation_id);

-- ---------------------------------------------------------------- fonctions utilitaires
create or replace function core.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger organisations_updated_at before update on core.organisations
  for each row execute function core.set_updated_at();
create trigger profiles_updated_at before update on core.profiles
  for each row execute function core.set_updated_at();

-- Organisation + toutes ses ancêtres (un rôle tenu au niveau du groupe
-- s'applique à toutes les filiales).
create or replace function core.organisation_ancetres(p_org uuid)
returns setof uuid language sql stable set search_path = '' as $$
  with recursive chaine as (
    select o.id, o.parent_id from core.organisations o where o.id = p_org
    union all
    select o.id, o.parent_id from core.organisations o join chaine c on o.id = c.parent_id
  )
  select id from chaine;
$$;

-- Vrai si l'utilisateur courant détient l'un des rôles demandés sur
-- l'organisation (ou sur une organisation parente). 'admin' passe toujours.
-- p_roles NULL = n'importe quel rôle (simple appartenance).
create or replace function core.has_role(p_org uuid, p_roles core.role_app[] default null)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from core.memberships m
    where m.user_id = auth.uid()
      and m.organisation_id in (select core.organisation_ancetres(p_org))
      and (p_roles is null or m.role = 'admin' or m.role = any (p_roles))
  );
$$;

-- Même chose sans organisation précise (tables historiques sans organisation_id).
create or replace function core.has_any_role(p_roles core.role_app[] default null)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from core.memberships m
    where m.user_id = auth.uid()
      and (p_roles is null or m.role = 'admin' or m.role = any (p_roles))
  );
$$;

create or replace function core.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from core.memberships m where m.user_id = auth.uid() and m.role = 'admin');
$$;

-- Numéro suivant, sans trou, verrouillé par ligne. Ex. ('…', 'FAC', 2026) -> 1, 2, 3…
create or replace function core.prochain_numero(p_org uuid, p_code text, p_annee int)
returns int language plpgsql security definer set search_path = '' as $$
declare
  v int;
begin
  if auth.uid() is not null and not core.has_role(p_org) then
    raise exception 'Numérotation refusée : aucun rôle sur cette organisation.';
  end if;
  insert into core.numerotations as n (organisation_id, code, annee, dernier)
  values (p_org, p_code, p_annee, 1)
  on conflict (organisation_id, code, annee)
    do update set dernier = n.dernier + 1
  returning dernier into v;
  return v;
end;
$$;
revoke execute on function core.prochain_numero(uuid, text, int) from public;
grant execute on function core.prochain_numero(uuid, text, int) to authenticated, service_role;

-- Journal d'audit générique : à attacher aux tables sensibles.
create or replace function core.audit_trigger()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into core.audit_log (schema_name, table_name, record_id, action, old_data, new_data)
  values (
    tg_table_schema, tg_table_name,
    coalesce(
      case when tg_op = 'DELETE' then to_jsonb(old) ->> 'id' else to_jsonb(new) ->> 'id' end,
      null),
    tg_op,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

-- Profil créé automatiquement à l'inscription / invitation Supabase Auth.
create or replace function core.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into core.profiles (id, email, nom_complet)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function core.handle_new_user();

-- Premier administrateur : à exécuter une seule fois depuis l'éditeur SQL
-- (rôle postgres) après avoir invité l'utilisateur dans Supabase Auth.
--   select core.bootstrap_admin('prenom.nom@exemple.sn', 'GROUPE_MOZAIC');
create or replace function core.bootstrap_admin(p_email text, p_org_code text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid;
  v_org uuid;
begin
  select id into v_user from auth.users where lower(email) = lower(p_email);
  if v_user is null then
    raise exception 'Utilisateur % introuvable dans auth.users : invitez-le d''abord.', p_email;
  end if;
  select id into v_org from core.organisations where code = p_org_code;
  if v_org is null then
    raise exception 'Organisation % introuvable.', p_org_code;
  end if;
  insert into core.profiles (id, email) values (v_user, p_email) on conflict (id) do nothing;
  insert into core.memberships (user_id, organisation_id, role)
  values (v_user, v_org, 'admin') on conflict do nothing;
end;
$$;
revoke execute on function core.bootstrap_admin(text, text) from public, anon, authenticated;

-- Pose des 4 policies standard sur une table portant une colonne organisation_id.
--   p_read  : rôles autorisés en lecture (NULL = tout membre de l'organisation)
--   p_write : rôles autorisés en écriture (admin toujours inclus)
create or replace function core.appliquer_policies_standard(
  p_table regclass,
  p_read core.role_app[],
  p_write core.role_app[]
) returns void language plpgsql set search_path = '' as $$
declare
  v_read text := case when p_read is null then 'null' else quote_literal(p_read::text) || '::core.role_app[]' end;
  v_write text := quote_literal(p_write::text) || '::core.role_app[]';
begin
  execute format('alter table %s enable row level security', p_table);
  execute format('create policy lecture on %s for select to authenticated using (core.has_role(organisation_id, %s))', p_table, v_read);
  execute format('create policy creation on %s for insert to authenticated with check (core.has_role(organisation_id, %s))', p_table, v_write);
  execute format('create policy modification on %s for update to authenticated using (core.has_role(organisation_id, %s)) with check (core.has_role(organisation_id, %s))', p_table, v_write, v_write);
  execute format('create policy suppression on %s for delete to authenticated using (core.has_role(organisation_id, %s))', p_table, v_write);
end;
$$;
revoke execute on function core.appliquer_policies_standard(regclass, core.role_app[], core.role_app[]) from public, anon, authenticated;

-- ---------------------------------------------------------------- RLS du socle
alter table core.organisations enable row level security;
alter table core.sites enable row level security;
alter table core.profiles enable row level security;
alter table core.memberships enable row level security;
alter table core.numerotations enable row level security;
alter table core.audit_log enable row level security;

-- Une organisation est visible par ses membres et par les membres de ses filiales.
create or replace function core.peut_voir_organisation(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select core.has_role(p_org)
      or exists (select 1 from core.organisations enfant
                 where enfant.parent_id = p_org and core.has_role(enfant.id));
$$;

create policy lecture on core.organisations for select to authenticated
  using (core.peut_voir_organisation(id));
create policy gestion on core.organisations for all to authenticated
  using (core.is_admin()) with check (core.is_admin());

create policy lecture on core.sites for select to authenticated using (core.has_role(organisation_id));
create policy gestion on core.sites for all to authenticated
  using (core.has_role(organisation_id, array['admin']::core.role_app[]))
  with check (core.has_role(organisation_id, array['admin']::core.role_app[]));

create policy lecture on core.profiles for select to authenticated
  using (id = auth.uid() or core.has_any_role(array['admin', 'direction', 'rh']::core.role_app[]));
create policy maj_soi on core.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy gestion on core.profiles for all to authenticated
  using (core.is_admin()) with check (core.is_admin());

create policy lecture on core.memberships for select to authenticated
  using (user_id = auth.uid() or core.has_role(organisation_id, array['admin']::core.role_app[]));
create policy gestion on core.memberships for all to authenticated
  using (core.has_role(organisation_id, array['admin']::core.role_app[]))
  with check (core.has_role(organisation_id, array['admin']::core.role_app[]));

create policy lecture on core.audit_log for select to authenticated
  using (core.has_any_role(array['admin', 'direction']::core.role_app[]));

select core.appliquer_policies_standard('core.documents', null, array['admin', 'direction', 'finance', 'comptable', 'logistique', 'chef_site', 'mine', 'hqse', 'rh']::core.role_app[]);

grant select, insert, update, delete on all tables in schema core to authenticated;
grant all on all tables in schema core to service_role;
revoke insert, update, delete on core.audit_log, core.numerotations from authenticated;
