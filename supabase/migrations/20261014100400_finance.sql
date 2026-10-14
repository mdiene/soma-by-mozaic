-- =============================================================================
-- FINANCE ET COMPTABILITÉ DU GROUPE — référentiel SYSCOHADA révisé, multi-sociétés
--
--   exercices, plan comptable (commun au groupe + comptes propres à une société),
--   journaux, tiers, sections analytiques (programmes, sites…),
--   pièces et lignes d'écriture (partie double, pièces validées immuables),
--   contrats de vente (programmes de livraison) liés aux phases historiques,
--   factures, règlements, comptes bancaires et relevés, budgets.
-- Montants en numeric(18,2), devise de tenue XOF (FCFA).
-- =============================================================================

create schema if not exists finance;
grant usage on schema finance to authenticated, service_role;

-- ---------------------------------------------------------------- exercices
create table finance.exercices (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,                       -- ex. '2026'
  date_debut date not null,
  date_fin date not null,
  statut text not null default 'ouvert' check (statut in ('ouvert', 'en_cloture', 'clos')),
  created_at timestamptz not null default now(),
  unique (organisation_id, code),
  check (date_fin > date_debut)
);

-- ---------------------------------------------------------------- plan comptable
create table finance.comptes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references core.organisations(id) on delete restrict,  -- NULL = plan commun
  numero text not null check (numero ~ '^[1-9][0-9]{1,11}$'),
  libelle text not null,
  classe smallint generated always as (substr(numero, 1, 1)::smallint) stored,
  collectif boolean not null default false,  -- 401, 411… : exige un tiers
  lettrable boolean not null default false,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  constraint comptes_numero_unique unique nulls not distinct (organisation_id, numero)
);
create index comptes_org_idx on finance.comptes (organisation_id);

-- ---------------------------------------------------------------- journaux
create table finance.journaux (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  libelle text not null,
  type_journal text not null check (type_journal in ('achats', 'ventes', 'banque', 'caisse', 'paie', 'operations_diverses', 'a_nouveaux')),
  compte_contrepartie_id uuid references finance.comptes(id),
  actif boolean not null default true,
  unique (organisation_id, code)
);
create index journaux_contrepartie_idx on finance.journaux (compte_contrepartie_id);

-- ---------------------------------------------------------------- tiers
create table finance.tiers (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  nom text not null,
  type_tiers text not null check (type_tiers in ('client', 'fournisseur', 'client_fournisseur', 'salarie', 'associe', 'etat', 'autre')),
  compte_collectif_id uuid references finance.comptes(id),
  ninea text,
  rccm text,
  adresse text,
  telephone text,
  email text,
  pays char(2) not null default 'SN',
  delai_paiement_jours int not null default 30 check (delai_paiement_jours >= 0),
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index tiers_collectif_idx on finance.tiers (compte_collectif_id);

-- ---------------------------------------------------------------- analytique
create table finance.sections_analytiques (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  axe text not null check (axe in ('programme', 'site', 'activite', 'projet')),
  code text not null,
  libelle text not null,
  site_id uuid references core.sites(id),
  actif boolean not null default true,
  unique (organisation_id, axe, code)
);
create index sections_site_idx on finance.sections_analytiques (site_id);

-- ---------------------------------------------------------------- écritures
create table finance.pieces (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  exercice_id uuid not null references finance.exercices(id) on delete restrict,
  journal_id uuid not null references finance.journaux(id) on delete restrict,
  numero text,                                 -- attribué à la validation : <JOURNAL>-<AAAA>-<00001>
  date_piece date not null,
  libelle text not null,
  reference_externe text,                      -- n° facture fournisseur, chèque, quittance…
  statut text not null default 'brouillon' check (statut in ('brouillon', 'validee', 'annulee')),
  source_module text,                          -- 'finance.factures', 'production.achats_site'…
  source_id uuid,
  valide_le timestamptz,
  valide_par uuid references core.profiles(id),
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id),
  unique (organisation_id, numero)
);
create index pieces_org_date_idx on finance.pieces (organisation_id, date_piece);
create index pieces_exercice_idx on finance.pieces (exercice_id);
create index pieces_journal_idx on finance.pieces (journal_id);
create index pieces_source_idx on finance.pieces (source_module, source_id);

create table finance.lignes (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references finance.pieces(id) on delete cascade,
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  ordre smallint not null default 0,
  compte_id uuid not null references finance.comptes(id) on delete restrict,
  tiers_id uuid references finance.tiers(id) on delete restrict,
  section_id uuid references finance.sections_analytiques(id) on delete restrict,
  libelle text,
  debit numeric(18, 2) not null default 0 check (debit >= 0),
  credit numeric(18, 2) not null default 0 check (credit >= 0),
  lettrage text,
  echeance date,
  constraint ligne_un_seul_sens check ((debit = 0) <> (credit = 0))
);
create index lignes_piece_idx on finance.lignes (piece_id);
create index lignes_compte_idx on finance.lignes (compte_id);
create index lignes_tiers_idx on finance.lignes (tiers_id);
create index lignes_section_idx on finance.lignes (section_id);
create index lignes_org_idx on finance.lignes (organisation_id);

-- Une ligne hérite de l'organisation de sa pièce ; les pièces validées sont figées.
create or replace function finance.lignes_controle()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_statut text;
  v_org uuid;
begin
  select p.statut, p.organisation_id into v_statut, v_org
    from finance.pieces p where p.id = coalesce(new.piece_id, old.piece_id);
  if v_statut <> 'brouillon' then
    raise exception 'La pièce est % : ses lignes ne peuvent plus être modifiées (passer une contre-écriture).', v_statut;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  new.organisation_id := v_org;
  return new;
end;
$$;
create trigger lignes_controle before insert or update or delete on finance.lignes
  for each row execute function finance.lignes_controle();

create or replace function finance.pieces_controle()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    if old.statut <> 'brouillon' then
      raise exception 'Une pièce validée ne peut pas être supprimée.';
    end if;
    return old;
  end if;
  if old.statut = 'validee' then
    raise exception 'Une pièce validée est figée : passer une contre-écriture.';
  end if;
  if old.statut = 'annulee' then
    raise exception 'Une pièce annulée est figée.';
  end if;
  if old.statut = 'brouillon' and new.statut = 'validee' and current_setting('finance.validation_en_cours', true) is distinct from 'on' then
    raise exception 'Utiliser finance.valider_piece() pour valider une pièce.';
  end if;
  return new;
end;
$$;
create trigger pieces_controle before update or delete on finance.pieces
  for each row execute function finance.pieces_controle();
create trigger pieces_audit after insert or update or delete on finance.pieces
  for each row execute function core.audit_trigger();

-- Validation : équilibre, au moins 2 lignes, exercice ouvert, date dans
-- l'exercice, tiers présent sur les comptes collectifs ; numérotation continue.
create or replace function finance.valider_piece(p_piece uuid)
returns text language plpgsql set search_path = '' as $$
declare
  p finance.pieces;
  e finance.exercices;
  j finance.journaux;
  v_debit numeric;
  v_credit numeric;
  v_nb int;
  v_sans_tiers int;
  v_numero text;
begin
  select * into p from finance.pieces where id = p_piece for update;
  if not found then raise exception 'Pièce introuvable.'; end if;
  if not core.has_role(p.organisation_id, array['comptable', 'finance']::core.role_app[]) then
    raise exception 'Droits insuffisants pour valider une pièce.';
  end if;
  if p.statut <> 'brouillon' then raise exception 'Pièce déjà %.', p.statut; end if;

  select * into e from finance.exercices where id = p.exercice_id;
  if e.statut <> 'ouvert' then raise exception 'Exercice % non ouvert.', e.code; end if;
  if p.date_piece not between e.date_debut and e.date_fin then
    raise exception 'Date % hors de l''exercice %.', p.date_piece, e.code;
  end if;

  select count(*), coalesce(sum(debit), 0), coalesce(sum(credit), 0)
    into v_nb, v_debit, v_credit from finance.lignes where piece_id = p_piece;
  if v_nb < 2 then raise exception 'Une pièce doit comporter au moins deux lignes.'; end if;
  if v_debit <> v_credit then
    raise exception 'Pièce déséquilibrée : débit % / crédit %.', v_debit, v_credit;
  end if;

  select count(*) into v_sans_tiers
    from finance.lignes l join finance.comptes c on c.id = l.compte_id
    where l.piece_id = p_piece and c.collectif and l.tiers_id is null;
  if v_sans_tiers > 0 then raise exception 'Tiers obligatoire sur les comptes collectifs.'; end if;

  select * into j from finance.journaux where id = p.journal_id;
  v_numero := j.code || '-' || to_char(p.date_piece, 'YYYY') || '-'
              || lpad(core.prochain_numero(p.organisation_id, 'PIECE_' || j.code, extract(year from p.date_piece)::int)::text, 5, '0');

  perform set_config('finance.validation_en_cours', 'on', true);
  update finance.pieces
     set statut = 'validee', numero = v_numero, valide_le = now(), valide_par = auth.uid()
   where id = p_piece;
  perform set_config('finance.validation_en_cours', 'off', true);
  return v_numero;
end;
$$;

-- ---------------------------------------------------------------- contrats de vente / programmes
create table finance.contrats (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  client_id uuid not null references finance.tiers(id) on delete restrict,
  code text not null,
  intitule text not null,                     -- ex. 'Programme Sénégal 2025-2026'
  reference_marche text,
  produit_code text references production.produits(code),
  tonnage_contractuel numeric(14, 3) check (tonnage_contractuel >= 0),
  prix_unitaire_t numeric(16, 2) check (prix_unitaire_t >= 0),
  devise char(3) not null default 'XOF',
  date_debut date,
  date_fin date,
  section_id uuid references finance.sections_analytiques(id),
  statut text not null default 'actif' check (statut in ('negociation', 'actif', 'suspendu', 'termine', 'resilie')),
  notes text,
  created_at timestamptz not null default now(),
  unique (organisation_id, code)
);
create index contrats_client_idx on finance.contrats (client_id);
create index contrats_section_idx on finance.contrats (section_id);

-- Rattachement des phases de livraison historiques (public.project) à un contrat.
create table finance.contrat_projets (
  contrat_id uuid not null references finance.contrats(id) on delete cascade,
  project_id uuid not null references public.project(id) on delete restrict,
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  primary key (contrat_id, project_id)
);
create index contrat_projets_project_idx on finance.contrat_projets (project_id);

-- ---------------------------------------------------------------- factures et règlements
create table finance.factures (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  sens text not null check (sens in ('vente', 'achat')),
  tiers_id uuid not null references finance.tiers(id) on delete restrict,
  contrat_id uuid references finance.contrats(id) on delete set null,
  numero text,                                 -- ventes : attribué à l'émission ; achats : n° fournisseur
  date_facture date not null,
  date_echeance date,
  objet text,
  montant_ht numeric(18, 2) not null default 0,
  montant_tva numeric(18, 2) not null default 0,
  montant_ttc numeric(18, 2) generated always as (montant_ht + montant_tva) stored,
  exoneration_tva text,                        -- ex. motif d'exonération
  devise char(3) not null default 'XOF',
  statut text not null default 'brouillon' check (statut in ('brouillon', 'emise', 'partiellement_reglee', 'reglee', 'annulee')),
  piece_id uuid references finance.pieces(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index factures_tiers_idx on finance.factures (tiers_id);
create index factures_contrat_idx on finance.factures (contrat_id);
create index factures_piece_idx on finance.factures (piece_id);
create index factures_org_date_idx on finance.factures (organisation_id, date_facture);
create unique index factures_numero_vente_uniq on finance.factures (organisation_id, numero) where sens = 'vente' and numero is not null;
create trigger factures_audit after insert or update or delete on finance.factures
  for each row execute function core.audit_trigger();

create table finance.facture_lignes (
  id uuid primary key default gen_random_uuid(),
  facture_id uuid not null references finance.factures(id) on delete cascade,
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  ordre smallint not null default 0,
  designation text not null,
  quantite numeric(14, 3) not null default 1,
  unite text,
  prix_unitaire numeric(16, 2) not null default 0,
  taux_tva numeric(5, 2) not null default 0 check (taux_tva between 0 and 100),
  montant_ht numeric(18, 2) generated always as (round(quantite * prix_unitaire, 2)) stored,
  compte_id uuid references finance.comptes(id),
  section_id uuid references finance.sections_analytiques(id),
  delivery_id uuid references public.deliveries(id) on delete set null   -- BL facturé
);
create index facture_lignes_facture_idx on finance.facture_lignes (facture_id);
create index facture_lignes_compte_idx on finance.facture_lignes (compte_id);
create index facture_lignes_section_idx on finance.facture_lignes (section_id);
create index facture_lignes_delivery_idx on finance.facture_lignes (delivery_id);

-- ---------------------------------------------------------------- trésorerie
create table finance.comptes_bancaires (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  code text not null,
  banque text not null,
  intitule text not null,
  numero_compte text,
  iban text,
  devise char(3) not null default 'XOF',
  compte_id uuid references finance.comptes(id),          -- 521…
  journal_id uuid references finance.journaux(id),
  solde_initial numeric(18, 2) not null default 0,
  date_solde_initial date,
  actif boolean not null default true,
  unique (organisation_id, code)
);
create index comptes_bancaires_compte_idx on finance.comptes_bancaires (compte_id);
create index comptes_bancaires_journal_idx on finance.comptes_bancaires (journal_id);

create table finance.reglements (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  facture_id uuid not null references finance.factures(id) on delete restrict,
  compte_bancaire_id uuid references finance.comptes_bancaires(id),
  date_reglement date not null,
  montant numeric(18, 2) not null check (montant > 0),
  mode text not null check (mode in ('virement', 'cheque', 'especes', 'mobile_money', 'compensation', 'autre')),
  reference text,
  piece_id uuid references finance.pieces(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references core.profiles(id)
);
create index reglements_facture_idx on finance.reglements (facture_id);
create index reglements_banque_idx on finance.reglements (compte_bancaire_id);
create index reglements_piece_idx on finance.reglements (piece_id);

create table finance.releves_bancaires (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  compte_bancaire_id uuid not null references finance.comptes_bancaires(id) on delete restrict,
  date_operation date not null,
  date_valeur date,
  libelle text not null,
  montant numeric(18, 2) not null check (montant <> 0),   -- + crédit banque, - débit
  reference text,
  ligne_id uuid references finance.lignes(id) on delete set null,   -- rapprochement
  reglement_id uuid references finance.reglements(id) on delete set null,
  importe_le timestamptz not null default now()
);
create index releves_compte_date_idx on finance.releves_bancaires (compte_bancaire_id, date_operation);
create index releves_ligne_idx on finance.releves_bancaires (ligne_id);
create index releves_reglement_idx on finance.releves_bancaires (reglement_id);

-- ---------------------------------------------------------------- budgets
create table finance.budgets (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references core.organisations(id) on delete restrict,
  exercice_id uuid not null references finance.exercices(id) on delete restrict,
  section_id uuid references finance.sections_analytiques(id),
  compte_id uuid not null references finance.comptes(id),
  mois smallint check (mois between 1 and 12),          -- NULL = annuel
  montant numeric(18, 2) not null,
  commentaire text
);
create index budgets_exercice_idx on finance.budgets (exercice_id);
create index budgets_section_idx on finance.budgets (section_id);
create index budgets_compte_idx on finance.budgets (compte_id);
create unique index budgets_uniq on finance.budgets (exercice_id, coalesce(section_id, '00000000-0000-0000-0000-000000000000'::uuid), compte_id, coalesce(mois, 0));

-- ---------------------------------------------------------------- vues de restitution
create view finance.v_grand_livre with (security_invoker = true) as
select l.organisation_id, p.exercice_id, p.date_piece, p.numero, j.code as journal,
       c.numero as compte, c.libelle as compte_libelle, t.code as tiers_code, t.nom as tiers_nom,
       s.code as section, coalesce(l.libelle, p.libelle) as libelle, l.debit, l.credit, l.lettrage,
       sum(l.debit - l.credit) over (partition by l.organisation_id, p.exercice_id, l.compte_id
                                      order by p.date_piece, p.numero, l.ordre, l.id) as solde_progressif
from finance.lignes l
join finance.pieces p on p.id = l.piece_id and p.statut = 'validee'
join finance.journaux j on j.id = p.journal_id
join finance.comptes c on c.id = l.compte_id
left join finance.tiers t on t.id = l.tiers_id
left join finance.sections_analytiques s on s.id = l.section_id;

create view finance.v_balance with (security_invoker = true) as
select l.organisation_id, p.exercice_id, c.classe, c.numero as compte, c.libelle,
       sum(l.debit) as total_debit, sum(l.credit) as total_credit,
       greatest(sum(l.debit) - sum(l.credit), 0) as solde_debiteur,
       greatest(sum(l.credit) - sum(l.debit), 0) as solde_crediteur
from finance.lignes l
join finance.pieces p on p.id = l.piece_id and p.statut = 'validee'
join finance.comptes c on c.id = l.compte_id
group by l.organisation_id, p.exercice_id, c.classe, c.numero, c.libelle;

create view finance.v_factures_soldes with (security_invoker = true) as
select f.*, t.nom as tiers_nom,
       coalesce(r.regle, 0) as montant_regle,
       f.montant_ttc - coalesce(r.regle, 0) as reste_du,
       case when f.statut in ('emise', 'partiellement_reglee') and f.date_echeance < current_date
            then current_date - f.date_echeance end as jours_de_retard
from finance.factures f
join finance.tiers t on t.id = f.tiers_id
left join (select facture_id, sum(montant) as regle from finance.reglements group by facture_id) r on r.facture_id = f.id;

-- Exécution des contrats : tonnage livré (BL historiques) vs contractuel, chiffre d'affaires théorique.
create view finance.v_execution_contrats with (security_invoker = true) as
select k.id as contrat_id, k.organisation_id, k.code, k.intitule, t.nom as client,
       k.tonnage_contractuel, k.prix_unitaire_t,
       coalesce(sum(d.tonnage_loaded), 0) as tonnage_livre,
       count(d.id) as nombre_bl,
       round(coalesce(sum(d.tonnage_loaded), 0) * coalesce(k.prix_unitaire_t, 0), 2) as ca_livre_theorique,
       case when k.tonnage_contractuel > 0
            then round(100 * coalesce(sum(d.tonnage_loaded), 0) / k.tonnage_contractuel, 1) end as taux_execution_pct
from finance.contrats k
join finance.tiers t on t.id = k.client_id
left join finance.contrat_projets cp on cp.contrat_id = k.id
left join public.allocations a on a.project_id = cp.project_id
left join public.deliveries d on d.allocation_id = a.id
group by k.id, k.organisation_id, k.code, k.intitule, t.nom, k.tonnage_contractuel, k.prix_unitaire_t;

create view finance.v_budget_realise with (security_invoker = true) as
with realise as (
  select l.organisation_id, p.exercice_id, l.section_id, l.compte_id, sum(l.debit - l.credit) as montant
  from finance.lignes l join finance.pieces p on p.id = l.piece_id and p.statut = 'validee'
  group by l.organisation_id, p.exercice_id, l.section_id, l.compte_id
), prevu as (
  select organisation_id, exercice_id, section_id, compte_id, sum(montant) as montant
  from finance.budgets group by organisation_id, exercice_id, section_id, compte_id
)
select coalesce(b.organisation_id, r.organisation_id) as organisation_id,
       coalesce(b.exercice_id, r.exercice_id) as exercice_id,
       coalesce(b.section_id, r.section_id) as section_id,
       coalesce(b.compte_id, r.compte_id) as compte_id,
       c.numero as compte, c.libelle as compte_libelle,
       coalesce(b.montant, 0) as budget, coalesce(r.montant, 0) as realise,
       coalesce(r.montant, 0) - coalesce(b.montant, 0) as ecart
from prevu b
full join realise r on r.organisation_id = b.organisation_id and r.exercice_id = b.exercice_id
  and r.compte_id = b.compte_id and r.section_id is not distinct from b.section_id
join finance.comptes c on c.id = coalesce(b.compte_id, r.compte_id);

-- ---------------------------------------------------------------- RLS
-- Lecture réservée aux métiers financiers ; écriture : comptable / finance.
do $$
declare
  lecteurs core.role_app[] := array['direction', 'finance', 'comptable'];
  t text;
begin
  foreach t in array array['exercices', 'journaux', 'sections_analytiques', 'budgets'] loop
    perform core.appliquer_policies_standard(format('finance.%I', t)::regclass, lecteurs, array['comptable', 'finance']::core.role_app[]);
  end loop;
  foreach t in array array['tiers', 'contrats', 'contrat_projets', 'factures', 'facture_lignes', 'reglements',
                           'comptes_bancaires', 'releves_bancaires', 'pieces', 'lignes'] loop
    perform core.appliquer_policies_standard(format('finance.%I', t)::regclass, lecteurs, array['comptable', 'finance']::core.role_app[]);
  end loop;
end $$;

-- Plan comptable : le plan commun (organisation_id NULL) est lisible par tous les
-- membres et géré par les administrateurs.
alter table finance.comptes enable row level security;
create policy lecture on finance.comptes for select to authenticated
  using (case when organisation_id is null then core.has_any_role() else core.has_role(organisation_id) end);
create policy gestion_commun on finance.comptes for all to authenticated
  using (organisation_id is null and core.is_admin())
  with check (organisation_id is null and core.is_admin());
create policy gestion_societe on finance.comptes for all to authenticated
  using (organisation_id is not null and core.has_role(organisation_id, array['comptable']::core.role_app[]))
  with check (organisation_id is not null and core.has_role(organisation_id, array['comptable']::core.role_app[]));

grant select, insert, update, delete on all tables in schema finance to authenticated;
grant all on all tables in schema finance to service_role;
grant execute on function finance.valider_piece(uuid) to authenticated;
