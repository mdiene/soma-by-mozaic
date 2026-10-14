-- =============================================================================
-- MINE DE PHOSPHATE DE MATAM — titres miniers et conformité, exploitation,
-- engins, qualité du minerai.
--
--   titres          : permis / autorisations (périmètre, arrêté, échéances)
--   obligations     : redevances, taxe superficiaire, droits fixes, rapports
--                     trimestriels/annuels, EIES… avec échéance et paiement
--   courriers       : correspondance administrative (mises en demeure, PV de
--                     contrôle, demandes de moratoire, quittances…)
--   fronts          : fronts / fosses d'extraction
--   extractions     : production journalière (minerai, stérile) → stocks
--   engins          : parc d'engins et pointages (heures, carburant, pannes)
--   analyses        : analyses de laboratoire (P2O5, CaO, humidité…)
-- =============================================================================

create schema if not exists mine;
grant usage on schema mine to authenticated, service_role;

-- ---------------------------------------------------------------- titres miniers
create table mine.titres (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  intitule text not null,
  type_titre text not null check (type_titre in (
    'permis_exploitation', 'permis_petite_mine', 'permis_recherche', 'autorisation_exploitation_carriere', 'autre')),
  substance text not null default 'phosphate',
  reference_acte text,                 -- ex. n° d'arrêté ministériel
  date_acte date,
  date_notification date,
  date_expiration date,
  superficie_km2 numeric(12, 4),
  localisation text,
  perimetre_geojson jsonb,
  statut text not null default 'actif' check (statut in ('demande', 'actif', 'suspendu', 'en_renouvellement', 'expire', 'retire')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index titres_org_idx on mine.titres (organisation_id);
create trigger titres_updated_at before update on mine.titres for each row execute function core.set_updated_at();

-- ---------------------------------------------------------------- obligations réglementaires et fiscales
create type mine.type_obligation as enum (
  'redevance_miniere', 'taxe_superficiaire', 'droits_fixes', 'rapport_trimestriel', 'rapport_annuel',
  'eies', 'pges_suivi', 'plan_rehabilitation', 'declaration_production', 'autre'
);
create type mine.statut_obligation as enum (
  'a_venir', 'due', 'deposee', 'payee', 'partiellement_payee', 'contestee', 'moratoire', 'annulee'
);

create table mine.obligations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  titre_id uuid references mine.titres(id) on delete restrict,
  type_obligation mine.type_obligation not null,
  libelle text not null,
  periode_debut date,
  periode_fin date,
  echeance date,
  montant_du numeric(18, 2) check (montant_du >= 0),
  montant_paye numeric(18, 2) not null default 0 check (montant_paye >= 0),
  date_paiement date,
  reference_paiement text,             -- ex. n° de quittance du Trésor
  base_calcul jsonb,                   -- ex. {"tonnage": 17000, "prix_t": 50000, "taux": 0.05}
  statut mine.statut_obligation not null default 'a_venir',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint obligations_periode check (periode_fin is null or periode_debut is null or periode_fin >= periode_debut)
);
create index obligations_org_idx on mine.obligations (organisation_id);
create index obligations_titre_idx on mine.obligations (titre_id);
create index obligations_echeance_idx on mine.obligations (echeance) where statut not in ('payee', 'annulee', 'deposee');
create trigger obligations_updated_at before update on mine.obligations for each row execute function core.set_updated_at();
create trigger obligations_audit after insert or update or delete on mine.obligations for each row execute function core.audit_trigger();

-- ---------------------------------------------------------------- correspondance administrative
create table mine.courriers (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  titre_id uuid references mine.titres(id) on delete set null,
  obligation_id uuid references mine.obligations(id) on delete set null,
  sens text not null check (sens in ('entrant', 'sortant')),
  reference text,
  date_courrier date not null,
  expediteur text,
  destinataire text,
  objet text not null,
  nature text not null default 'autre' check (nature in (
    'mise_en_demeure', 'pv_controle', 'notification', 'arrete', 'demande', 'reponse',
    'demande_moratoire', 'quittance', 'rapport', 'autre')),
  date_limite_reponse date,
  statut text not null default 'ouvert' check (statut in ('ouvert', 'en_cours', 'repondu', 'clos')),
  reponse_a uuid references mine.courriers(id) on delete set null,
  resume text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index courriers_org_idx on mine.courriers (organisation_id);
create index courriers_titre_idx on mine.courriers (titre_id);
create index courriers_obligation_idx on mine.courriers (obligation_id);
create index courriers_reponse_a_idx on mine.courriers (reponse_a);
create index courriers_ouverts_idx on mine.courriers (date_limite_reponse) where statut in ('ouvert', 'en_cours');

-- ---------------------------------------------------------------- fronts d'extraction
create table mine.fronts (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  titre_id uuid references mine.titres(id) on delete restrict,
  site_id uuid references core.sites(id) on delete restrict,
  code text not null,
  nom text,
  geojson jsonb,
  reserves_estimees_t numeric(14, 2),
  teneur_p2o5_moy_pct numeric(5, 2) check (teneur_p2o5_moy_pct between 0 and 100),
  ratio_decouverture numeric(8, 3),     -- t de stérile par t de minerai
  statut text not null default 'actif' check (statut in ('projet', 'actif', 'suspendu', 'epuise', 'rehabilite')),
  created_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index fronts_titre_idx on mine.fronts (titre_id);
create index fronts_site_idx on mine.fronts (site_id);

-- ---------------------------------------------------------------- engins
create table mine.engins (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  site_id uuid references core.sites(id) on delete set null,
  code text not null,
  type_engin text not null check (type_engin in (
    'pelle_hydraulique', 'chargeuse', 'bulldozer', 'tombereau', 'camion_benne', 'cribleuse',
    'concasseur', 'groupe_electrogene', 'citerne', 'vehicule_leger', 'autre')),
  marque text,
  modele text,
  immatriculation text,
  numero_serie text,
  regime text not null default 'propriete' check (regime in ('propriete', 'location', 'sous_traitance')),
  prestataire text,
  cout_horaire numeric(12, 2),
  compteur_heures numeric(10, 1),
  statut text not null default 'disponible' check (statut in ('disponible', 'en_service', 'en_panne', 'en_maintenance', 'reforme')),
  created_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index engins_site_idx on mine.engins (site_id);

alter table production.criblages
  add constraint criblages_engin_id_fkey foreign key (engin_id) references mine.engins(id) on delete set null;
create index criblages_engin_idx on production.criblages (engin_id);

create table mine.pointages_engins (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  engin_id uuid not null references mine.engins(id) on delete restrict,
  date_pointage date not null,
  poste text not null default 'jour' check (poste in ('jour', 'nuit')),
  heures_marche numeric(5, 2) not null default 0 check (heures_marche between 0 and 24),
  heures_panne numeric(5, 2) not null default 0 check (heures_panne between 0 and 24),
  compteur_fin numeric(10, 1),
  carburant_l numeric(10, 2) not null default 0 check (carburant_l >= 0),
  operateur text,
  observations text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id),
  unique (engin_id, date_pointage, poste)
);
create index pointages_org_idx on mine.pointages_engins (organisation_id);
create index pointages_date_idx on mine.pointages_engins (date_pointage);

-- ---------------------------------------------------------------- extraction journalière
create table mine.extractions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  site_id uuid not null references core.sites(id) on delete restrict,
  front_id uuid references mine.fronts(id) on delete restrict,
  date_extraction date not null,
  poste text not null default 'jour' check (poste in ('jour', 'nuit')),
  tonnage_minerai numeric(12, 3) not null default 0 check (tonnage_minerai >= 0),
  tonnage_sterile numeric(12, 3) not null default 0 check (tonnage_sterile >= 0),
  nb_voyages int check (nb_voyages >= 0),
  methode_mesure text check (methode_mesure in ('pesage', 'comptage_voyages', 'topographie', 'estimation')),
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index extractions_site_date_idx on mine.extractions (site_id, date_extraction);
create index extractions_front_idx on mine.extractions (front_id);
create index extractions_org_idx on mine.extractions (organisation_id);

create or replace function mine.extractions_stock()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform production.ecrire_mouvements('mine.extractions', old.id, old.organisation_id, old.site_id, old.date_extraction, 'extraction', null);
    return old;
  end if;
  perform production.ecrire_mouvements('mine.extractions', new.id, new.organisation_id, new.site_id, new.date_extraction, 'extraction',
    jsonb_build_array(
      jsonb_build_object('produit', 'MINERAI_BRUT', 'quantite', new.tonnage_minerai),
      jsonb_build_object('produit', 'STERILE', 'quantite', new.tonnage_sterile)));
  return new;
end;
$$;
create trigger extractions_stock after insert or update or delete on mine.extractions
  for each row execute function mine.extractions_stock();

-- ---------------------------------------------------------------- analyses de laboratoire
create table mine.analyses (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  front_id uuid references mine.fronts(id) on delete set null,
  produit_code text references production.produits(code),
  reference_echantillon text not null,
  date_prelevement date not null,
  laboratoire text,
  p2o5_pct numeric(5, 2) check (p2o5_pct between 0 and 100),
  cao_pct numeric(5, 2) check (cao_pct between 0 and 100),
  humidite_pct numeric(5, 2) check (humidite_pct between 0 and 100),
  granulometrie text,
  autres_resultats jsonb,
  conforme boolean,
  created_at timestamptz not null default now(),
  unique (organisation_id, reference_echantillon)
);
create index analyses_front_idx on mine.analyses (front_id);

-- ---------------------------------------------------------------- vues
create view mine.v_obligations_suivi with (security_invoker = true) as
select o.*,
       t.code as titre_code,
       greatest(coalesce(o.montant_du, 0) - o.montant_paye, 0) as reste_a_payer,
       case
         when o.statut in ('payee', 'deposee', 'annulee') then 'soldee'
         when o.echeance is null then 'sans_echeance'
         when o.echeance < current_date then 'en_retard'
         when o.echeance <= current_date + 30 then 'echeance_proche'
         else 'a_jour'
       end as alerte,
       case when o.echeance < current_date and o.statut not in ('payee', 'deposee', 'annulee')
            then current_date - o.echeance end as jours_de_retard
from mine.obligations o
left join mine.titres t on t.id = o.titre_id;

create view mine.v_production_mensuelle with (security_invoker = true) as
select organisation_id, site_id, date_trunc('month', date_extraction)::date as mois,
       sum(tonnage_minerai) as minerai_t,
       sum(tonnage_sterile) as sterile_t,
       case when sum(tonnage_minerai) > 0 then round(sum(tonnage_sterile) / sum(tonnage_minerai), 3) end as ratio_decouverture
from mine.extractions
group by organisation_id, site_id, date_trunc('month', date_extraction);

create view mine.v_disponibilite_engins with (security_invoker = true) as
select p.organisation_id, p.engin_id, e.code, e.type_engin, date_trunc('month', p.date_pointage)::date as mois,
       sum(p.heures_marche) as heures_marche,
       sum(p.heures_panne) as heures_panne,
       sum(p.carburant_l) as carburant_l,
       case when sum(p.heures_marche) > 0 then round(sum(p.carburant_l) / sum(p.heures_marche), 2) end as conso_l_par_h,
       case when sum(p.heures_marche + p.heures_panne) > 0
            then round(100 * sum(p.heures_marche) / sum(p.heures_marche + p.heures_panne), 1) end as disponibilite_pct
from mine.pointages_engins p
join mine.engins e on e.id = p.engin_id
group by p.organisation_id, p.engin_id, e.code, e.type_engin, date_trunc('month', p.date_pointage);

-- ---------------------------------------------------------------- RLS
select core.appliquer_policies_standard('mine.titres', null, array['mine', 'direction']::core.role_app[]);
select core.appliquer_policies_standard('mine.obligations', null, array['mine', 'direction', 'finance']::core.role_app[]);
select core.appliquer_policies_standard('mine.courriers', null, array['mine', 'direction']::core.role_app[]);
select core.appliquer_policies_standard('mine.fronts', null, array['mine', 'chef_site']::core.role_app[]);
select core.appliquer_policies_standard('mine.engins', null, array['mine', 'chef_site']::core.role_app[]);
select core.appliquer_policies_standard('mine.pointages_engins', null, array['mine', 'chef_site']::core.role_app[]);
select core.appliquer_policies_standard('mine.extractions', null, array['mine', 'chef_site']::core.role_app[]);
select core.appliquer_policies_standard('mine.analyses', null, array['mine', 'chef_site', 'hqse']::core.role_app[]);

grant select, insert, update, delete on all tables in schema mine to authenticated;
grant all on all tables in schema mine to service_role;
