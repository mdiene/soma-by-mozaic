-- =============================================================================
-- COMPATIBILITÉ avec les tables historiques (public.*) de l'application
-- « MASAE Delivery Tracker ».
--
-- Migration ADDITIVE : l'ancienne application continue de fonctionner. On ajoute
-- uniquement des droits pour les utilisateurs authentifiés du nouveau SI
-- (selon leur rôle) et on corrige la génération des numéros de BL.
-- La fermeture des accès anonymes se fait plus tard, à la bascule
-- (voir supabase/pending/cutover_fermeture_acces_anonymes.sql).
-- =============================================================================

-- ---------------------------------------------------------------- numéros de BL
-- generate_bl_number_text() écrivait dans public.bl_counter qui n'existait pas.
-- Les BL existants ont été numérotés côté navigateur : BL + AA + 4 chiffres
-- aléatoires. Le générateur ci-dessous reste dans ce format et saute les
-- numéros déjà pris.
create table if not exists public.bl_counter (
  year int primary key,
  last_number int not null default 0
);
alter table public.bl_counter enable row level security;

create or replace function public.generate_bl_number_text()
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_year text := to_char(current_date, 'YY');
  v_num int;
  v_bl text;
begin
  loop
    insert into public.bl_counter as c (year, last_number)
      values (v_year::int, 1)
    on conflict (year) do update set last_number = c.last_number + 1
    returning last_number into v_num;
    if v_num > 9999 then
      raise exception 'Plus de numéros de BL disponibles pour 20% (format BLAA9999).', v_year;
    end if;
    v_bl := 'BL' || v_year || lpad(v_num::text, 4, '0');
    exit when not exists (select 1 from public.deliveries d where d.bl_number = v_bl);
  end loop;
  return v_bl;
end;
$$;

-- Fonction morte (colonnes inexistantes, aucun trigger) : suppression.
drop function if exists public.update_allocation_status();

-- ---------------------------------------------------------------- droits du nouveau SI
-- Lecture : tout utilisateur rattaché à une organisation.
-- Écriture : selon le métier.
create or replace function core.poser_policies_legacy(
  p_table regclass,
  p_write core.role_app[]
) returns void language plpgsql set search_path = '' as $$
begin
  execute format('create policy si_lecture on %s for select to authenticated using (core.has_any_role())', p_table);
  execute format('create policy si_creation on %s for insert to authenticated with check (core.has_any_role(%L::core.role_app[]))', p_table, p_write);
  execute format('create policy si_modification on %s for update to authenticated using (core.has_any_role(%L::core.role_app[])) with check (core.has_any_role(%L::core.role_app[]))', p_table, p_write, p_write);
  execute format('create policy si_suppression on %s for delete to authenticated using (core.has_any_role(%L::core.role_app[]))', p_table, array['admin']::core.role_app[]);
end;
$$;
revoke execute on function core.poser_policies_legacy(regclass, core.role_app[]) from public, anon, authenticated;

do $$
declare
  t text;
  logistique core.role_app[] := array['logistique', 'direction'];
  site core.role_app[] := array['chef_site', 'logistique'];
  finance core.role_app[] := array['finance', 'comptable', 'logistique'];
  hqse core.role_app[] := array['hqse'];
  rh core.role_app[] := array['rh', 'hqse'];
begin
  foreach t in array array['regions', 'departments', 'communes', 'project', 'operators',
                           'trucks', 'drivers', 'allocations', 'deliveries'] loop
    perform core.poser_policies_legacy(format('public.%I', t)::regclass, logistique);
  end loop;
  perform core.poser_policies_legacy('public.production', site);
  perform core.poser_policies_legacy('public.payments', finance);
  foreach t in array array['admin_depenses', 'admin_categories_depense', 'admin_modes_paiement',
                           'admin_codes_analytiques'] loop
    perform core.poser_policies_legacy(format('public.%I', t)::regclass, array['finance', 'comptable']::core.role_app[]);
  end loop;
  foreach t in array array['admin_personnel', 'admin_postes'] loop
    perform core.poser_policies_legacy(format('public.%I', t)::regclass, rh);
  end loop;
  foreach t in array array['equipment_types', 'equipments', 'hqse_inspections', 'hqse_inspection_plans',
                           'hqse_non_conformities', 'hqse_corrective_actions', 'hqse_employee_allocations',
                           'hqse_safety_compliance_audits', 'hqse_tickets_signalements'] loop
    perform core.poser_policies_legacy(format('public.%I', t)::regclass, hqse);
  end loop;
  -- Les chauffeurs pointent leur arrivée (FIFO) : mise à jour du statut camion.
  create policy si_chauffeur_fifo on public.trucks for update to authenticated
    using (core.has_any_role(array['chauffeur']::core.role_app[]))
    with check (core.has_any_role(array['chauffeur']::core.role_app[]));
end $$;

-- user_preferences (mots de passe en clair) : volontairement AUCUN accès
-- pour le nouveau SI. Les comptes sont gérés par Supabase Auth + core.profiles.

grant select, insert, update, delete on
  public.regions, public.departments, public.communes, public.project, public.operators,
  public.trucks, public.drivers, public.allocations, public.deliveries, public.payments,
  public.production, public.admin_depenses, public.admin_categories_depense,
  public.admin_modes_paiement, public.admin_codes_analytiques, public.admin_personnel,
  public.admin_postes, public.equipment_types, public.equipments, public.hqse_inspections,
  public.hqse_inspection_plans, public.hqse_non_conformities, public.hqse_corrective_actions,
  public.hqse_employee_allocations, public.hqse_safety_compliance_audits,
  public.hqse_tickets_signalements
to authenticated;
grant select on public.view_bon_livraison, public.view_fin_de_cession to authenticated;
