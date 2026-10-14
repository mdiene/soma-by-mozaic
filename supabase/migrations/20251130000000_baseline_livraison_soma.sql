-- =============================================================================
-- BASELINE — schéma de production existant (projet Supabase « Livraison_soma »,
-- ref ndzjirmrfdeheuljjvxb), extrait en lecture seule le 2026-10-14.
--
-- Ce fichier DÉCRIT l'existant : il ne doit PAS être rejoué sur la base de
-- production (les objets y existent déjà). À marquer comme appliqué avec :
--   npx supabase migration repair --status applied 20251130000000
-- Il sert à reconstruire une base locale / une branche de test identique.
--
-- Anomalies relevées à l'extraction (corrigées dans les migrations suivantes) :
--   * Toutes les tables ont une policy « USING (true) » ouverte au rôle anon :
--     n'importe qui possédant la clé anon (publiée dans l'ancien dépôt) peut
--     lire / modifier / supprimer toutes les données.
--   * user_preferences.user_pswd stocke des mots de passe en clair.
--   * generate_bl_number_text() écrit dans public.bl_counter, table absente.
--   * update_allocation_status() référence des colonnes inexistantes
--     (deliveries.validation_status, allocations.delivered_tonnage) : fonction morte.
--   * project.tonnage_total est un smallint (max 32 767 t).
--   * Les tables paie_* et production_purchases utilisées par l'ancien front
--     n'existent pas en base.
-- =============================================================================

create extension if not exists "uuid-ossp" with schema extensions;

-- ---------------------------------------------------------------- types
create type public.allocation_status as enum ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'OVER_DELIVERED');
create type public.app_role as enum ('admin', 'dispatcher', 'field_agent', 'auditor');
create type public.delivery_status as enum ('DRAFT', 'SYNCED', 'VERIFIED', 'INVOICED', 'REJECTED');
create type public.hqse_origin_type as enum ('materiel', 'humain', 'organisationnel', 'externe');
create type public.hqse_register_type as enum ('accident', 'sante', 'danger', 'qualite', 'environnement');
create type public.hqse_severity_level as enum ('Mineure', 'Majeure', 'Critique');

-- ---------------------------------------------------------------- tables
create table public.regions (
  id uuid not null default extensions.uuid_generate_v4(),
  name varchar(100) not null,
  code varchar(10) not null,
  created_at timestamptz default now(),
  constraint regions_pkey primary key (id),
  constraint regions_code_key unique (code),
  constraint regions_name_key unique (name)
);

create table public.departments (
  id uuid not null default extensions.uuid_generate_v4(),
  region_id uuid not null,
  name varchar(100) not null,
  code varchar(10) not null,
  created_at timestamptz default now(),
  constraint departments_pkey primary key (id),
  constraint departments_region_id_code_key unique (region_id, code)
);

create table public.communes (
  id uuid not null default extensions.uuid_generate_v4(),
  department_id uuid not null,
  name varchar(100) not null,
  code varchar(10) not null,
  created_at timestamptz default now(),
  distance_mine numeric,
  constraint communes_pkey primary key (id)
);

create table public.project (
  id uuid not null default gen_random_uuid(),
  numero_marche varchar default '',
  numero_bon_disposition varchar default '',
  numero_phase smallint,
  date_mise_disposition date,
  tonnage_total smallint,
  project_visibility boolean,
  project_description text,
  export_statut boolean default false,
  constraint project_pkey primary key (id)
);

create table public.operators (
  id uuid not null default extensions.uuid_generate_v4(),
  name varchar(200) not null,
  contact_info varchar,
  created_at timestamptz default now(),
  commune_id uuid,
  operateur_coop_gie boolean,
  coop_name text,
  projet_id uuid,
  constraint operators_pkey primary key (id)
);

create table public.trucks (
  id uuid not null default extensions.uuid_generate_v4(),
  plate_number varchar(20) not null,
  capacity_tonnes numeric default 50.00,
  status varchar(20) default 'AVAILABLE',
  created_at timestamptz default now(),
  trailer_number varchar,
  owner_type boolean not null default true,
  qrcode_content text,
  updated_at date,
  chassis_camion text,
  truck_type text,
  truck_marque text,
  "Trucks_proprietaire" text,
  constraint trucks_pkey primary key (id),
  constraint trucks_plate_number_key unique (plate_number)
);

create table public.drivers (
  id uuid not null default extensions.uuid_generate_v4(),
  name varchar(200) not null,
  phone_normalized varchar(20),
  license_number varchar(50),
  status varchar(20) default 'ACTIVE',
  created_at timestamptz default now(),
  truck_id uuid,
  constraint drivers_pkey primary key (id),
  constraint drivers_license_number_key unique (license_number),
  constraint drivers_phone_normalized_key unique (phone_normalized)
);

create table public.allocations (
  id uuid not null default extensions.uuid_generate_v4(),
  allocation_key varchar(200) not null,
  region_id uuid not null,
  department_id uuid not null,
  commune_id uuid not null,
  operator_id uuid not null,
  responsible_name varchar(200) not null,
  responsible_phone_raw varchar(50),
  responsible_phone_normalized varchar(20),
  target_tonnage numeric not null,
  status public.allocation_status default 'OPEN',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  project_id uuid,
  constraint allocations_pkey primary key (id),
  constraint allocations_allocation_key_key unique (allocation_key),
  constraint allocations_target_tonnage_check check (target_tonnage > 0)
);

create table public.deliveries (
  id uuid not null default extensions.uuid_generate_v4(),
  allocation_id uuid not null,
  bl_number varchar(50),
  truck_id uuid,
  driver_id uuid,
  tonnage_loaded numeric not null,
  delivery_date timestamptz,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  payments_id uuid,
  declaration_code text,
  constraint deliveries_pkey primary key (id),
  constraint deliveries_bl_number_key unique (bl_number),
  constraint deliveries_tonnage_loaded_check check (tonnage_loaded > 0)
);

create table public.payments (
  id uuid not null default extensions.uuid_generate_v4(),
  truck_id uuid not null,
  delivery_id uuid not null,
  road_fees numeric default 0,
  personal_fees numeric default 0,
  other_fees numeric default 0,
  other_fees_label text,
  overweigh_fees numeric default 0,
  fuel_quantity numeric default 0,
  fuel_cost numeric default 0,
  date_updated timestamptz default now(),
  created_at timestamptz default now(),
  loading_cost numeric,
  unloading_cost numeric,
  constraint payments_pkey primary key (id)
);

create table public.production (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null,
  production_date date not null default current_date,
  bags_deployed integer not null,
  bags_filled_50kg integer not null,
  tonnage numeric,
  total_amount numeric default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre_elements numeric,
  equipe_couture numeric,
  is_accounted boolean default false,
  constraint production_pkey primary key (id),
  constraint production_bags_deployed_check check (bags_deployed >= 0),
  constraint production_bags_filled_50kg_check check (bags_filled_50kg >= 0),
  constraint production_total_amount_check check (total_amount >= 0)
);

create table public.user_preferences (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  user_email text,
  theme_mode text not null default 'light',
  theme_color text not null default '''Default''::text',
  theme_name text not null default '''Default''::text',
  sidebar_pinned boolean not null default false,
  language text not null default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_right_level numeric,
  user_pswd text,
  user_statut boolean default false,
  constraint user_preferences_pkey primary key (id),
  constraint user_preferences_user_email_key unique (user_email),
  constraint user_preferences_user_unique unique (user_id),
  constraint user_preferences_theme_mode_check check (theme_mode = any (array['light', 'dark']))
);

create table public.admin_postes (
  id_poste uuid not null default gen_random_uuid(),
  titre_poste varchar(100) not null,
  categorie_poste varchar(100),
  constraint admin_postes_pkey primary key (id_poste)
);

create table public.admin_personnel (
  id_personnel uuid not null default gen_random_uuid(),
  nom varchar(100) not null,
  prenom varchar(100),
  id_poste uuid,
  telephone varchar(20),
  user_preference_id uuid,
  constraint admin_personnel_pkey primary key (id_personnel)
);

create table public.admin_categories_depense (
  id_categorie uuid not null default gen_random_uuid(),
  nom_categorie varchar(100) not null,
  constraint admin_categories_depense_pkey primary key (id_categorie)
);

create table public.admin_modes_paiement (
  id_mode uuid not null default gen_random_uuid(),
  nom_mode varchar(50) not null,
  constraint admin_modes_paiement_pkey primary key (id_mode)
);

create table public.admin_codes_analytiques (
  id_code uuid not null default gen_random_uuid(),
  code varchar(50),
  description text,
  constraint admin_codes_analytiques_pkey primary key (id_code),
  constraint admin_codes_analytiques_code_key unique (code)
);

create table public.admin_depenses (
  id_depense uuid not null default gen_random_uuid(),
  date_operation date not null,
  libelle varchar(255) not null,
  montant numeric not null,
  id_categorie uuid,
  id_mode_paiement uuid,
  id_code_analytique uuid,
  id_responsable uuid,
  reference_piece varchar(100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  id_user uuid,
  depense_en_attente boolean default false,
  constraint admin_depenses_pkey primary key (id_depense),
  constraint admin_depenses_montant_check check (montant >= 0)
);

create table public.equipment_types (
  id uuid not null default gen_random_uuid(),
  label varchar(100) not null,
  code varchar(20) not null,
  description text,
  icon_name varchar(50),
  is_regulatory_subject boolean not null default true,
  default_frequency_days integer,
  created_at timestamptz not null default now(),
  constraint equipment_types_pkey primary key (id),
  constraint equipment_types_code_key unique (code)
);

create table public.equipments (
  id uuid not null default gen_random_uuid(),
  ref_code varchar(50) not null,
  name varchar(255) not null,
  category varchar(100),
  serial_number varchar(100),
  location varchar(255),
  commissioning_date date,
  status varchar(50) not null default 'Actif',
  responsible_user_id uuid,
  created_at timestamptz not null default now(),
  type_id uuid,
  "Affectation_equipements" uuid,
  quantite_dispo numeric default 0,
  constraint equipments_pkey primary key (id),
  constraint equipments_ref_code_key unique (ref_code)
);

create table public.hqse_inspections (
  id uuid not null default gen_random_uuid(),
  equipment_id uuid,
  inspector_name varchar(255),
  inspection_date date not null,
  verdict varchar(20),
  report text,
  comments text,
  created_at timestamptz not null default now(),
  id_employe uuid,
  constraint hqse_inspections_pkey primary key (id),
  constraint hqse_inspections_verdict_check check (verdict in ('OK', 'NON-CONFORME'))
);

create table public.hqse_inspection_plans (
  id uuid not null default gen_random_uuid(),
  equipment_id uuid,
  inspection_type varchar(100) not null,
  frequency_days integer not null,
  last_inspection_date date,
  next_due_date date,
  constraint hqse_inspection_plans_pkey primary key (id),
  constraint hqse_inspection_plans_frequency_days_check check (frequency_days > 0)
);

create table public.hqse_non_conformities (
  id uuid not null default gen_random_uuid(),
  inspection_id uuid,
  equipment_id uuid,
  description text not null,
  severity varchar(20),
  status varchar(50) not null default 'Ouvert',
  declared_at timestamptz not null default now(),
  constraint hqse_non_conformities_pkey primary key (id),
  constraint hqse_non_conformities_severity_check check (severity in ('Mineure', 'Majeure', 'Critique'))
);

create table public.hqse_corrective_actions (
  id uuid not null default gen_random_uuid(),
  nc_id uuid,
  action_plan text not null,
  assigned_to uuid,
  target_date date,
  completion_date date,
  status varchar(50) not null default 'A faire',
  constraint hqse_corrective_actions_pkey primary key (id)
);

create table public.hqse_employee_allocations (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  equipment_id uuid not null,
  quantity_allocated integer not null default 1,
  allocation_date date not null default current_date,
  expected_renewal_date date,
  condition_at_allocation varchar(50) default 'Neuf',
  is_returned boolean default false,
  return_date date,
  comments text,
  created_at timestamptz not null default now(),
  constraint hqse_employee_allocations_pkey primary key (id),
  constraint check_quantity_positive check (quantity_allocated > 0)
);

create table public.hqse_safety_compliance_audits (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  auditor_id uuid not null,
  audit_date timestamptz not null default now(),
  equipment_id uuid,
  number_of_items integer not null default 1,
  is_usage_respected boolean not null default true,
  observation_notes text,
  has_loss_occurred boolean not null default false,
  has_deteriorated_equipment boolean not null default false,
  corrective_action_required text,
  created_at timestamptz not null default now(),
  sanction_type text,
  constraint hqse_safety_compliance_audits_pkey primary key (id)
);

create table public.hqse_tickets_signalements (
  id uuid not null default gen_random_uuid(),
  register public.hqse_register_type not null,
  origin public.hqse_origin_type not null,
  equipment_id uuid,
  employee_concerned_id uuid,
  event_date timestamptz not null default now(),
  severity public.hqse_severity_level not null default 'Mineure',
  reason_description text not null,
  measures_to_take text,
  status varchar(50) not null default 'Nouveau',
  reported_by uuid not null,
  created_at timestamptz not null default now(),
  constraint hqse_tickets_signalements_pkey primary key (id)
);

-- ---------------------------------------------------------------- clés étrangères
alter table public.departments add constraint departments_region_id_fkey foreign key (region_id) references public.regions(id) on delete cascade;
alter table public.communes add constraint communes_department_id_fkey foreign key (department_id) references public.departments(id) on delete cascade;
alter table public.operators add constraint operators_commune_id_fkey foreign key (commune_id) references public.communes(id) on delete set null;
alter table public.operators add constraint operators_projet_id_fkey foreign key (projet_id) references public.project(id);
alter table public.drivers add constraint drivers_truck_id_fkey foreign key (truck_id) references public.trucks(id);
alter table public.allocations add constraint allocations_commune_id_fkey foreign key (commune_id) references public.communes(id);
alter table public.allocations add constraint allocations_department_id_fkey foreign key (department_id) references public.departments(id);
alter table public.allocations add constraint allocations_operator_id_fkey foreign key (operator_id) references public.operators(id);
alter table public.allocations add constraint allocations_project_id_fkey foreign key (project_id) references public.project(id);
alter table public.allocations add constraint allocations_region_id_fkey foreign key (region_id) references public.regions(id);
alter table public.deliveries add constraint deliveries_allocation_id_fkey foreign key (allocation_id) references public.allocations(id) on delete restrict;
alter table public.deliveries add constraint deliveries_driver_id_fkey foreign key (driver_id) references public.drivers(id);
alter table public.deliveries add constraint deliveries_truck_id_fkey foreign key (truck_id) references public.trucks(id);
alter table public.deliveries add constraint deliveries_payments_id_fkey foreign key (payments_id) references public.payments(id) on delete set null;
alter table public.payments add constraint payments_delivery_id_fkey foreign key (delivery_id) references public.deliveries(id) on delete cascade;
alter table public.payments add constraint payments_truck_id_fkey foreign key (truck_id) references public.trucks(id) on delete cascade;
alter table public.production add constraint production_project_id_fkey foreign key (project_id) references public.project(id) on delete restrict;
alter table public.admin_personnel add constraint admin_personnel_id_poste_fkey foreign key (id_poste) references public.admin_postes(id_poste) on delete set null;
alter table public.admin_personnel add constraint admin_personnel_user_preference_id_fkey foreign key (user_preference_id) references public.user_preferences(user_id);
alter table public.admin_depenses add constraint admin_depenses_id_categorie_fkey foreign key (id_categorie) references public.admin_categories_depense(id_categorie) on delete set null;
alter table public.admin_depenses add constraint admin_depenses_id_code_analytique_fkey foreign key (id_code_analytique) references public.admin_codes_analytiques(id_code) on delete set null;
alter table public.admin_depenses add constraint admin_depenses_id_mode_paiement_fkey foreign key (id_mode_paiement) references public.admin_modes_paiement(id_mode) on delete set null;
alter table public.admin_depenses add constraint admin_depenses_id_responsable_fkey foreign key (id_responsable) references public.admin_personnel(id_personnel) on delete set null;
alter table public.admin_depenses add constraint fk_admin_depenses_user_preferences foreign key (id_user) references public.user_preferences(id) on update cascade on delete set null;
alter table public.equipments add constraint fk_equipments_responsible_user foreign key (responsible_user_id) references public.admin_personnel(id_personnel);
alter table public.equipments add constraint fk_equipments_type_id foreign key (type_id) references public.equipment_types(id);
alter table public.hqse_inspections add constraint hqse_inspections_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_inspections add constraint hqse_inspections_id_employe_fkey foreign key (id_employe) references public.admin_personnel(id_personnel);
alter table public.hqse_inspection_plans add constraint hqse_inspection_plans_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_non_conformities add constraint hqse_non_conformities_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_non_conformities add constraint hqse_non_conformities_inspection_id_fkey foreign key (inspection_id) references public.hqse_inspections(id);
alter table public.hqse_corrective_actions add constraint fk_corrective_actions_assigned_to foreign key (assigned_to) references public.admin_personnel(id_personnel);
alter table public.hqse_corrective_actions add constraint hqse_corrective_actions_nc_id_fkey foreign key (nc_id) references public.hqse_non_conformities(id);
alter table public.hqse_employee_allocations add constraint fk_allocation_employee foreign key (employee_id) references public.admin_personnel(id_personnel);
alter table public.hqse_employee_allocations add constraint hqse_employee_allocations_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_safety_compliance_audits add constraint hqse_safety_compliance_audits_auditor_id_fkey foreign key (auditor_id) references public.user_preferences(id);
alter table public.hqse_safety_compliance_audits add constraint hqse_safety_compliance_audits_employee_id_fkey foreign key (employee_id) references public.admin_personnel(id_personnel);
alter table public.hqse_safety_compliance_audits add constraint hqse_safety_compliance_audits_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_tickets_signalements add constraint hqse_tickets_signalements_employee_concerned_id_fkey foreign key (employee_concerned_id) references public.admin_personnel(id_personnel);
alter table public.hqse_tickets_signalements add constraint hqse_tickets_signalements_equipment_id_fkey foreign key (equipment_id) references public.equipments(id);
alter table public.hqse_tickets_signalements add constraint hqse_tickets_signalements_reported_by_fkey foreign key (reported_by) references public.user_preferences(id);

-- ---------------------------------------------------------------- index
create index idx_allocations_status on public.allocations (status) where status in ('OPEN', 'IN_PROGRESS');
create index idx_allocations_key on public.allocations (allocation_key);
create index idx_allocations_phone on public.allocations (responsible_phone_normalized);
create index idx_deliveries_allocation on public.deliveries (allocation_id);
create index idx_deliveries_bl on public.deliveries (bl_number);
create index idx_communes_department_id on public.communes (department_id);
create index idx_operators_name on public.operators (name);
create index user_preferences_user_id_idx on public.user_preferences (user_id);
create index admin_depenses_id_responsable_idx on public.admin_depenses (id_responsable);
create index admin_depenses_id_code_analytique_idx on public.admin_depenses (id_code_analytique);
create index admin_depenses_id_categorie_idx on public.admin_depenses (id_categorie);
create index admin_depenses_id_mode_paiement_idx on public.admin_depenses (id_mode_paiement);
create index admin_depenses_date_operation_idx on public.admin_depenses (date_operation);
create index idx_equipments_responsible_user on public.equipments (responsible_user_id);
create index idx_hqse_corrective_actions_nc_id on public.hqse_corrective_actions (nc_id);
create index idx_hqse_nonconformities_inspection_id on public.hqse_non_conformities (inspection_id);
create index idx_hqse_nonconformities_equipment_id on public.hqse_non_conformities (equipment_id);
create index idx_hqse_inspections_equipment_id on public.hqse_inspections (equipment_id);
create index idx_hqse_inspection_plans_equipment_id on public.hqse_inspection_plans (equipment_id);
create index idx_hqse_allocations_employee_id on public.hqse_employee_allocations (employee_id);
create index idx_hqse_allocations_equipment_type on public.hqse_employee_allocations (equipment_id);
create index idx_hqse_signalements_employee on public.hqse_tickets_signalements (employee_concerned_id);

-- ---------------------------------------------------------------- fonctions
create or replace function public.normalize_phone_number(phone text)
returns text language sql immutable as $$
  select nullif(regexp_replace(coalesce(phone, ''), '[^\d]', '', 'g'), '');
$$;

create or replace function public.tonnes_to_bags(tonnes numeric)
returns integer language sql immutable as $$
  select greatest(0, round(coalesce(tonnes, 0) * 20))::integer;
$$;

create or replace function public.set_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- NB : dépend de public.bl_counter, absente en production (voir en-tête).
create or replace function public.generate_bl_number_text()
returns text language plpgsql as $$
declare
  next_num integer;
  current_year text;
begin
  current_year := to_char(current_date, 'YY');
  insert into public.bl_counter (year, last_number)
    values ((current_year)::integer, 1)
  on conflict (year) do update
    set last_number = public.bl_counter.last_number + 1
  returning last_number into next_num;
  return 'BL' || current_year || lpad(next_num::text, 4, '0');
end;
$$;

create or replace function public.set_bl_number_trigger()
returns trigger language plpgsql as $$
begin
  if new.bl_number is null or new.bl_number = '' then
    new.bl_number := public.generate_bl_number_text();
  end if;
  return new;
end;
$$;

create or replace function public.recalc_allocation_status_for_id(allocation_uuid uuid)
returns void language plpgsql security definer as $$
declare
  total_loaded numeric := 0;
  target numeric := 0;
  new_status allocation_status;
  current_status allocation_status;
begin
  select target_tonnage, status into target, current_status
    from public.allocations where id = allocation_uuid for update;
  if not found then
    return;
  end if;

  select coalesce(sum(tonnage_loaded), 0) into total_loaded
    from public.deliveries where allocation_id = allocation_uuid;

  if total_loaded = 0 then
    new_status := 'OPEN';
  elsif total_loaded < target then
    new_status := 'IN_PROGRESS';
  elsif total_loaded = target then
    new_status := 'COMPLETED';
  else
    new_status := 'OVER_DELIVERED';
  end if;

  if new_status is distinct from current_status then
    update public.allocations set status = new_status where id = allocation_uuid;
  end if;
end;
$$;

create or replace function public.deliveries_recalc_allocation_status_trigger()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    perform public.recalc_allocation_status_for_id(new.allocation_id);
    return new;
  elsif tg_op = 'UPDATE' then
    if new.allocation_id is distinct from old.allocation_id and old.allocation_id is not null then
      perform public.recalc_allocation_status_for_id(old.allocation_id);
    end if;
    perform public.recalc_allocation_status_for_id(new.allocation_id);
    return new;
  elsif tg_op = 'DELETE' then
    if old.allocation_id is not null then
      perform public.recalc_allocation_status_for_id(old.allocation_id);
    end if;
    return old;
  end if;
  return null;
end;
$$;

-- update_allocation_status() existe en production mais est morte (colonnes
-- inexistantes) et n'est attachée à aucun trigger : volontairement non reprise.

-- ---------------------------------------------------------------- triggers
create trigger trg_set_bl_number before insert on public.deliveries
  for each row execute function public.set_bl_number_trigger();
create trigger trg_set_updated_at_allocations before update on public.allocations
  for each row execute function public.set_updated_at_column();
create trigger trg_set_updated_at_deliveries before update on public.deliveries
  for each row execute function public.set_updated_at_column();
create trigger deliveries_recalc_allocation_status after insert or delete or update on public.deliveries
  for each row execute function public.deliveries_recalc_allocation_status_trigger();

-- ---------------------------------------------------------------- vues
create or replace view public.view_bon_livraison as
select del.bl_number, del.tonnage_loaded, del.delivery_date,
       a.allocation_key, a.target_tonnage,
       o.name as operator_name, o.coop_name as operator_coop_name, o.contact_info as operator_contact_info,
       c.name as commune, d.name as department, r.name as region,
       p.numero_bon_disposition as project_num_bon, p.numero_phase,
       t.plate_number as truck_plate_number, t.trailer_number as truck_trailer_number,
       dr.name as driver_name
from public.deliveries del
join public.allocations a on del.allocation_id = a.id
left join public.operators o on a.operator_id = o.id
left join public.communes c on a.commune_id = c.id
left join public.departments d on a.department_id = d.id
left join public.regions r on a.region_id = r.id
left join public.project p on a.project_id = p.id
left join public.trucks t on del.truck_id = t.id
left join public.drivers dr on del.driver_id = dr.id;

create or replace view public.view_fin_de_cession as
select r.name as region, d.name as department, c.name as commune,
       o.name as operator_name, o.coop_name as operator_coop_name, o.contact_info as operator_contact_info,
       p.numero_phase as project_phase,
       count(distinct del.id) as deliveries_count,
       sum(del.tonnage_loaded) as total_tonnage
from public.deliveries del
join public.allocations a on del.allocation_id = a.id
left join public.project p on a.project_id = p.id
left join public.operators o on a.operator_id = o.id
left join public.communes c on a.commune_id = c.id
left join public.departments d on a.department_id = d.id
left join public.regions r on a.region_id = r.id
group by r.name, d.name, c.name, o.name, o.coop_name, o.contact_info, p.numero_phase;

-- ---------------------------------------------------------------- RLS (état réel, ouvert)
do $$
declare t text;
begin
  foreach t in array array[
    'regions','departments','communes','project','operators','trucks','drivers',
    'allocations','deliveries','payments','production','user_preferences',
    'admin_postes','admin_personnel','admin_categories_depense','admin_modes_paiement',
    'admin_codes_analytiques','admin_depenses','equipment_types','equipments',
    'hqse_inspections','hqse_inspection_plans','hqse_non_conformities',
    'hqse_corrective_actions','hqse_employee_allocations',
    'hqse_safety_compliance_audits','hqse_tickets_signalements']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "legacy_full_access" on public.%I for all using (true) with check (true)', t);
  end loop;
end $$;
