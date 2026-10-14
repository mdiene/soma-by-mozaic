-- =============================================================================
-- PILOTAGE DU PROGRAMME SOMA — programmes, jalons, tâches, risques, indicateurs
-- (relance de la mine, campagnes de livraison, usine d'engrais, partenariats…)
-- =============================================================================

create schema if not exists pilotage;
grant usage on schema pilotage to authenticated, service_role;

create table pilotage.programmes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  nom text not null,
  description text,
  responsable_id uuid references core.profiles(id),
  date_debut date,
  date_fin_prevue date,
  budget numeric(18, 2),
  section_id uuid references finance.sections_analytiques(id),
  statut text not null default 'actif' check (statut in ('idee', 'etude', 'actif', 'en_pause', 'termine', 'abandonne')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index programmes_responsable_idx on pilotage.programmes (responsable_id);
create index programmes_section_idx on pilotage.programmes (section_id);
create trigger programmes_updated_at before update on pilotage.programmes for each row execute function core.set_updated_at();

create table pilotage.jalons (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  programme_id uuid not null references pilotage.programmes(id) on delete cascade,
  titre text not null,
  date_prevue date not null,
  date_reelle date,
  statut text not null default 'a_venir' check (statut in ('a_venir', 'atteint', 'en_retard', 'annule')),
  livrable text
);
create index jalons_programme_idx on pilotage.jalons (programme_id);

create table pilotage.taches (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  programme_id uuid not null references pilotage.programmes(id) on delete cascade,
  jalon_id uuid references pilotage.jalons(id) on delete set null,
  parent_id uuid references pilotage.taches(id) on delete cascade,
  titre text not null,
  description text,
  responsable_id uuid references core.profiles(id),
  date_debut date,
  echeance date,
  priorite smallint not null default 2 check (priorite between 1 and 4),   -- 1 = critique
  avancement_pct smallint not null default 0 check (avancement_pct between 0 and 100),
  statut text not null default 'a_faire' check (statut in ('a_faire', 'en_cours', 'bloquee', 'terminee', 'annulee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index taches_programme_idx on pilotage.taches (programme_id);
create index taches_jalon_idx on pilotage.taches (jalon_id);
create index taches_parent_idx on pilotage.taches (parent_id);
create index taches_responsable_idx on pilotage.taches (responsable_id);
create trigger taches_updated_at before update on pilotage.taches for each row execute function core.set_updated_at();

create table pilotage.risques (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  programme_id uuid not null references pilotage.programmes(id) on delete cascade,
  titre text not null,
  categorie text check (categorie in ('reglementaire', 'financier', 'technique', 'operationnel', 'hqse', 'partenariat', 'juridique', 'autre')),
  probabilite smallint not null check (probabilite between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  criticite smallint generated always as (probabilite * impact) stored,
  plan_attenuation text,
  proprietaire_id uuid references core.profiles(id),
  statut text not null default 'ouvert' check (statut in ('ouvert', 'surveille', 'maitrise', 'clos', 'survenu')),
  created_at timestamptz not null default now()
);
create index risques_programme_idx on pilotage.risques (programme_id);
create index risques_proprietaire_idx on pilotage.risques (proprietaire_id);

create table pilotage.indicateurs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  programme_id uuid references pilotage.programmes(id) on delete cascade,
  code text not null,
  libelle text not null,
  unite text,
  periodicite text not null default 'mensuelle' check (periodicite in ('journaliere', 'hebdomadaire', 'mensuelle', 'trimestrielle', 'annuelle')),
  cible numeric,
  sens_favorable text not null default 'hausse' check (sens_favorable in ('hausse', 'baisse')),
  unique (organisation_id, code)
);
create index indicateurs_programme_idx on pilotage.indicateurs (programme_id);

create table pilotage.mesures (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  indicateur_id uuid not null references pilotage.indicateurs(id) on delete cascade,
  periode date not null,
  valeur numeric not null,
  commentaire text,
  unique (indicateur_id, periode)
);

create view pilotage.v_avancement_programmes with (security_invoker = true) as
select p.id, p.organisation_id, p.code, p.nom, p.statut, p.date_fin_prevue,
       count(t.id) filter (where t.statut <> 'annulee') as nb_taches,
       count(t.id) filter (where t.statut = 'terminee') as nb_taches_terminees,
       count(t.id) filter (where t.statut not in ('terminee', 'annulee') and t.echeance < current_date) as nb_taches_en_retard,
       round(avg(t.avancement_pct) filter (where t.statut <> 'annulee'), 0) as avancement_moyen_pct,
       (select count(*) from pilotage.risques r where r.programme_id = p.id and r.statut in ('ouvert', 'surveille') and r.criticite >= 15) as nb_risques_critiques,
       (select min(j.date_prevue) from pilotage.jalons j where j.programme_id = p.id and j.statut = 'a_venir') as prochain_jalon
from pilotage.programmes p
left join pilotage.taches t on t.programme_id = p.id
group by p.id;

do $$
declare t text;
begin
  foreach t in array array['programmes', 'jalons', 'taches', 'risques', 'indicateurs', 'mesures'] loop
    perform core.appliquer_policies_standard(format('pilotage.%I', t)::regclass, null, array['direction']::core.role_app[]);
  end loop;
end $$;

-- Un responsable peut mettre à jour les tâches qui lui sont assignées.
create policy maj_responsable on pilotage.taches for update to authenticated
  using (responsable_id = auth.uid()) with check (responsable_id = auth.uid());

grant select, insert, update, delete on all tables in schema pilotage to authenticated;
grant all on all tables in schema pilotage to service_role;
