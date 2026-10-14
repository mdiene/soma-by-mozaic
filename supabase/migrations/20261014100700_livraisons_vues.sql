-- =============================================================================
-- LIVRAISONS — vues de restitution sur les tables historiques (public.*)
-- Les agrégats sont calculés en base : le front ne télécharge plus tous les BL
-- (l'API Supabase plafonne les réponses à 1 000 lignes).
-- security_invoker : chaque vue applique les droits de l'utilisateur.
-- =============================================================================

create schema if not exists livraisons;
grant usage on schema livraisons to authenticated, service_role;

create view livraisons.v_allocations with (security_invoker = true) as
select a.id, a.allocation_key, a.project_id, p.numero_phase, p.project_description,
       a.region_id, r.name as region, a.department_id, d.name as departement, a.commune_id, c.name as commune,
       a.operator_id, o.name as operateur, o.coop_name, o.operateur_coop_gie as est_cooperative,
       a.responsible_name as responsable, a.responsible_phone_raw as telephone_responsable,
       a.target_tonnage as tonnage_cible,
       coalesce(l.tonnage_livre, 0) as tonnage_livre,
       coalesce(l.nombre_bl, 0) as nombre_bl,
       l.derniere_livraison,
       a.status as statut,
       case when a.target_tonnage > 0 then round(100 * coalesce(l.tonnage_livre, 0) / a.target_tonnage, 1) end as taux_pct
from public.allocations a
left join public.project p on p.id = a.project_id
left join public.regions r on r.id = a.region_id
left join public.departments d on d.id = a.department_id
left join public.communes c on c.id = a.commune_id
left join public.operators o on o.id = a.operator_id
left join (
  select allocation_id, sum(tonnage_loaded) as tonnage_livre, count(*) as nombre_bl, max(delivery_date) as derniere_livraison
  from public.deliveries group by allocation_id
) l on l.allocation_id = a.id;

create view livraisons.v_avancement_projets with (security_invoker = true) as
select p.id as project_id, p.numero_phase, p.numero_marche, p.numero_bon_disposition, p.project_description,
       p.date_mise_disposition, p.project_visibility as visible,
       p.tonnage_total as tonnage_mis_a_disposition,
       coalesce(sum(va.tonnage_cible), 0) as tonnage_alloue,
       coalesce(sum(va.tonnage_livre), 0) as tonnage_livre,
       coalesce(sum(va.nombre_bl), 0) as nombre_bl,
       count(va.id) as nombre_allocations,
       count(va.id) filter (where va.statut in ('COMPLETED', 'CLOSED', 'OVER_DELIVERED')) as allocations_soldees,
       max(va.derniere_livraison) as derniere_livraison
from public.project p
left join livraisons.v_allocations va on va.project_id = p.id
group by p.id;

create view livraisons.v_avancement_regions with (security_invoker = true) as
select project_id, numero_phase, region_id, region,
       sum(tonnage_cible) as tonnage_cible,
       sum(tonnage_livre) as tonnage_livre,
       sum(nombre_bl) as nombre_bl
from livraisons.v_allocations
group by project_id, numero_phase, region_id, region;

create view livraisons.v_livraisons_journalieres with (security_invoker = true) as
select (d.delivery_date at time zone 'Africa/Dakar')::date as jour, a.project_id,
       count(*) as nombre_bl,
       sum(d.tonnage_loaded) as tonnage
from public.deliveries d
join public.allocations a on a.id = d.allocation_id
where d.delivery_date is not null
group by 1, 2;

create view livraisons.v_bons with (security_invoker = true) as
select d.id, d.bl_number, d.delivery_date, d.tonnage_loaded, d.declaration_code,
       a.id as allocation_id, a.allocation_key, a.project_id, p.numero_phase,
       r.name as region, c.name as commune, o.name as operateur,
       t.plate_number as immatriculation, t.owner_type as camion_interne, t."Trucks_proprietaire" as transporteur,
       dr.name as chauffeur,
       coalesce(pay.road_fees, 0) + coalesce(pay.personal_fees, 0) + coalesce(pay.other_fees, 0)
         + coalesce(pay.overweigh_fees, 0) + coalesce(pay.fuel_cost, 0)
         + coalesce(pay.loading_cost, 0) + coalesce(pay.unloading_cost, 0) as frais_total
from public.deliveries d
join public.allocations a on a.id = d.allocation_id
left join public.project p on p.id = a.project_id
left join public.regions r on r.id = a.region_id
left join public.communes c on c.id = a.commune_id
left join public.operators o on o.id = a.operator_id
left join public.trucks t on t.id = d.truck_id
left join public.drivers dr on dr.id = d.driver_id
left join lateral (
  select sum(road_fees) as road_fees, sum(personal_fees) as personal_fees, sum(other_fees) as other_fees,
         sum(overweigh_fees) as overweigh_fees, sum(fuel_cost) as fuel_cost,
         sum(loading_cost) as loading_cost, sum(unloading_cost) as unloading_cost
  from public.payments pm where pm.delivery_id = d.id
) pay on true;

grant select on all tables in schema livraisons to authenticated;
grant select on all tables in schema livraisons to service_role;
