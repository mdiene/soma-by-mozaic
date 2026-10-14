-- =============================================================================
-- PRODUCTION SUR SITE — chaîne minerai brut → criblage → ensachage → livraison
--
-- Un grand livre des stocks (stock_mouvements) sert de source unique de vérité
-- pour les quantités : chaque opération (extraction, criblage, ensachage,
-- livraison, ajustement) y écrit ses mouvements, et les stocks sont la somme
-- de ces mouvements.
-- L'ensachage reste pour l'instant dans public.production (table historique).
-- =============================================================================

create schema if not exists production;
grant usage on schema production to authenticated, service_role;

create table production.produits (
  code text primary key,
  libelle text not null,
  unite text not null default 't',
  commercialisable boolean not null default false,
  ordre smallint not null default 0
);

insert into production.produits (code, libelle, commercialisable, ordre) values
  ('MINERAI_BRUT', 'Minerai de phosphate brut', false, 1),
  ('STERILE', 'Stérile (découverture)', false, 2),
  ('PHOSPHATE_CRIBLE', 'Phosphate criblé', true, 3),
  ('REFUS_CRIBLAGE', 'Refus de criblage', false, 4),
  ('PHOSPHATE_ENSACHE', 'Phosphate ensaché (sacs 50 kg)', true, 5);

create type production.motif_mouvement as enum (
  'extraction', 'criblage', 'ensachage', 'livraison', 'transfert', 'ajustement_inventaire', 'perte'
);

create table production.stock_mouvements (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  site_id uuid not null references core.sites(id) on delete restrict,
  produit_code text not null references production.produits(code),
  date_mouvement date not null,
  quantite_t numeric(14, 3) not null check (quantite_t <> 0),  -- + entrée, - sortie
  motif production.motif_mouvement not null,
  source_table text,
  source_id uuid,
  note text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index stock_mouvements_stock_idx on production.stock_mouvements (site_id, produit_code, date_mouvement);
create index stock_mouvements_source_idx on production.stock_mouvements (source_table, source_id);
create index stock_mouvements_org_idx on production.stock_mouvements (organisation_id);

-- Remplace les mouvements générés par une opération source (appelé par les triggers).
create or replace function production.ecrire_mouvements(
  p_source_table text, p_source_id uuid, p_org uuid, p_site uuid, p_date date,
  p_motif production.motif_mouvement, p_lignes jsonb  -- [{"produit": "...", "quantite": 12.5}, …]
) returns void language plpgsql security definer set search_path = '' as $$
declare
  l jsonb;
begin
  delete from production.stock_mouvements where source_table = p_source_table and source_id = p_source_id;
  if p_lignes is null then
    return;
  end if;
  for l in select * from jsonb_array_elements(p_lignes) loop
    if coalesce((l ->> 'quantite')::numeric, 0) <> 0 then
      insert into production.stock_mouvements
        (organisation_id, site_id, produit_code, date_mouvement, quantite_t, motif, source_table, source_id)
      values (p_org, p_site, l ->> 'produit', p_date, (l ->> 'quantite')::numeric, p_motif, p_source_table, p_source_id);
    end if;
  end loop;
end;
$$;
revoke execute on function production.ecrire_mouvements(text, uuid, uuid, uuid, date, production.motif_mouvement, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------- criblage
create table production.criblages (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  site_id uuid not null references core.sites(id) on delete restrict,
  date_operation date not null,
  poste text not null default 'jour' check (poste in ('jour', 'nuit')),
  engin_id uuid,                                   -- FK posée dans la migration mine
  tonnage_entree numeric(12, 3) not null check (tonnage_entree >= 0),
  tonnage_crible numeric(12, 3) not null check (tonnage_crible >= 0),
  tonnage_refus numeric(12, 3) not null default 0 check (tonnage_refus >= 0),
  heures_marche numeric(6, 2) check (heures_marche >= 0),
  carburant_l numeric(10, 2) check (carburant_l >= 0),
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id),
  constraint criblage_bilan check (tonnage_crible + tonnage_refus <= tonnage_entree * 1.02)
);
create index criblages_site_date_idx on production.criblages (site_id, date_operation);
create index criblages_org_idx on production.criblages (organisation_id);

create or replace function production.criblages_stock()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform production.ecrire_mouvements('production.criblages', old.id, old.organisation_id, old.site_id, old.date_operation, 'criblage', null);
    return old;
  end if;
  perform production.ecrire_mouvements('production.criblages', new.id, new.organisation_id, new.site_id, new.date_operation, 'criblage',
    jsonb_build_array(
      jsonb_build_object('produit', 'MINERAI_BRUT', 'quantite', -new.tonnage_entree),
      jsonb_build_object('produit', 'PHOSPHATE_CRIBLE', 'quantite', new.tonnage_crible),
      jsonb_build_object('produit', 'REFUS_CRIBLAGE', 'quantite', new.tonnage_refus)));
  return new;
end;
$$;
create trigger criblages_stock after insert or update or delete on production.criblages
  for each row execute function production.criblages_stock();

-- ---------------------------------------------------------------- achats et dépenses de site
-- (remplace la table production_purchases utilisée par l'ancien front mais jamais créée)
create type production.categorie_achat as enum (
  'INTRANTS', 'CARBURANT_SITE', 'MAINTENANCE', 'RESTAURATION', 'MAIN_OEUVRE', 'LOCATION_ENGINS', 'DIVERS'
);

create table production.achats_site (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  site_id uuid not null references core.sites(id) on delete restrict,
  date_achat date not null,
  categorie production.categorie_achat not null,
  libelle text not null,
  quantite numeric(12, 3) not null default 1 check (quantite > 0),
  unite text,
  prix_unitaire numeric(16, 2) not null check (prix_unitaire >= 0),
  montant numeric(18, 2) generated always as (round(quantite * prix_unitaire, 2)) stored,
  fournisseur text,
  mode_paiement text,
  reference_piece text,
  project_id uuid references public.project(id),   -- programme / phase de livraison concerné
  comptabilise boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index achats_site_site_date_idx on production.achats_site (site_id, date_achat);
create index achats_site_org_idx on production.achats_site (organisation_id);
create index achats_site_project_idx on production.achats_site (project_id);

-- ---------------------------------------------------------------- vues
create view production.v_stocks with (security_invoker = true) as
select m.organisation_id, m.site_id, s.nom as site_nom, m.produit_code, p.libelle as produit_libelle,
       sum(m.quantite_t) as stock_t,
       max(m.date_mouvement) as dernier_mouvement
from production.stock_mouvements m
join core.sites s on s.id = m.site_id
join production.produits p on p.code = m.produit_code
group by m.organisation_id, m.site_id, s.nom, m.produit_code, p.libelle;

create view production.v_stock_journalier with (security_invoker = true) as
select organisation_id, site_id, produit_code, date_mouvement,
       sum(quantite_t) filter (where quantite_t > 0) as entrees_t,
       -sum(quantite_t) filter (where quantite_t < 0) as sorties_t,
       sum(sum(quantite_t)) over (partition by site_id, produit_code order by date_mouvement) as stock_fin_t
from production.stock_mouvements
group by organisation_id, site_id, produit_code, date_mouvement;

-- ---------------------------------------------------------------- RLS
alter table production.produits enable row level security;
create policy lecture on production.produits for select to authenticated using (core.has_any_role());
create policy gestion on production.produits for all to authenticated using (core.is_admin()) with check (core.is_admin());

-- Le grand livre des stocks n'est écrit que par les triggers, sauf ajustements d'inventaire.
alter table production.stock_mouvements enable row level security;
create policy lecture on production.stock_mouvements for select to authenticated using (core.has_role(organisation_id));
create policy ajustement on production.stock_mouvements for insert to authenticated
  with check (motif in ('ajustement_inventaire', 'perte', 'transfert') and source_table is null
              and core.has_role(organisation_id, array['chef_site', 'direction']::core.role_app[]));

select core.appliquer_policies_standard('production.criblages', null, array['chef_site', 'mine']::core.role_app[]);
select core.appliquer_policies_standard('production.achats_site', null, array['chef_site', 'finance', 'comptable']::core.role_app[]);

grant select on all tables in schema production to authenticated;
grant insert, update, delete on production.criblages, production.achats_site to authenticated;
grant insert on production.stock_mouvements to authenticated;
grant all on all tables in schema production to service_role;
