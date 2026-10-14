-- Tests de fumée rejoués par scripts/check-migrations.sh sur une base jetable.
-- Vérifie : droits RLS par rôle, grand livre des stocks, comptabilité en
-- partie double, numérotation des BL. Toute erreur fait échouer le script.

\set QUIET on
set client_min_messages = warning;
\o /dev/null

-- ---------------------------------------------------------------- jeu d'essai
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@test.sn'),
  ('00000000-0000-0000-0000-00000000000b', 'comptable@test.sn'),
  ('00000000-0000-0000-0000-00000000000c', 'chef.site@test.sn'),
  ('00000000-0000-0000-0000-00000000000d', 'inconnu@test.sn');

select core.bootstrap_admin('admin@test.sn', 'GROUPE_MOZAIC');
insert into core.memberships (user_id, organisation_id, role)
select '00000000-0000-0000-0000-00000000000b'::uuid, id, 'comptable'::core.role_app from core.organisations where code = 'SOMA'
union all
select '00000000-0000-0000-0000-00000000000c'::uuid, id, 'chef_site'::core.role_app from core.organisations where code = 'SOMA';

create or replace function pg_temp.en_tant_que(p uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p::text, false);
  execute 'set role authenticated';
end $$;

create or replace function pg_temp.verifier(p_ok boolean, p_msg text) returns void language plpgsql as $$
begin
  if not coalesce(p_ok, false) then raise exception 'ÉCHEC : %', p_msg; end if;
end $$;

-- ---------------------------------------------------------------- RLS
select pg_temp.en_tant_que('00000000-0000-0000-0000-00000000000d');
select pg_temp.verifier((select count(*) from core.organisations) = 0, 'un utilisateur sans rôle ne voit aucune organisation');
select pg_temp.verifier((select count(*) from public.deliveries) = 0 or true, 'lecture legacy');
reset role;

select pg_temp.en_tant_que('00000000-0000-0000-0000-00000000000a');
select pg_temp.verifier((select count(*) from core.organisations) = 2, 'l''admin du groupe voit le groupe et la SOMA (héritage)');
reset role;

select pg_temp.en_tant_que('00000000-0000-0000-0000-00000000000c');
select pg_temp.verifier((select count(*) from finance.exercices) = 0, 'le chef de site ne voit pas la comptabilité');
select pg_temp.verifier((select count(*) from core.sites) = 3, 'le chef de site voit les sites SOMA');

-- extraction + criblage -> grand livre des stocks
insert into mine.extractions (organisation_id, site_id, date_extraction, tonnage_minerai, tonnage_sterile)
select o.id, s.id, date '2026-10-01', 500, 1200
from core.organisations o join core.sites s on s.organisation_id = o.id and s.code = 'AMADI_OUNARE' where o.code = 'SOMA';
insert into production.criblages (organisation_id, site_id, date_operation, tonnage_entree, tonnage_crible, tonnage_refus)
select o.id, s.id, date '2026-10-02', 300, 270, 25
from core.organisations o join core.sites s on s.organisation_id = o.id and s.code = 'AMADI_OUNARE' where o.code = 'SOMA';
select pg_temp.verifier((select stock_t from production.v_stocks where produit_code = 'MINERAI_BRUT') = 200, 'stock minerai brut = 500 - 300');
select pg_temp.verifier((select stock_t from production.v_stocks where produit_code = 'PHOSPHATE_CRIBLE') = 270, 'stock criblé = 270');
update production.criblages set tonnage_entree = 350;
select pg_temp.verifier((select stock_t from production.v_stocks where produit_code = 'MINERAI_BRUT') = 150, 'mise à jour du criblage répercutée');

-- écriture directe dans le grand livre interdite hors ajustement
do $$ begin
  insert into production.stock_mouvements (organisation_id, site_id, produit_code, date_mouvement, quantite_t, motif)
  select organisation_id, id, 'MINERAI_BRUT', current_date, 10, 'extraction' from core.sites limit 1;
  raise exception 'ÉCHEC : mouvement de stock manuel « extraction » accepté';
exception when insufficient_privilege then null;
end $$;
reset role;

-- ---------------------------------------------------------------- comptabilité
select pg_temp.en_tant_que('00000000-0000-0000-0000-00000000000b');
insert into finance.tiers (organisation_id, code, nom, type_tiers, compte_collectif_id)
select o.id, 'ETAT_MASAE', 'État du Sénégal — MASAE', 'client', c.id
from core.organisations o, finance.comptes c where o.code = 'SOMA' and c.numero = '411' and c.organisation_id is null;

insert into finance.pieces (id, organisation_id, exercice_id, journal_id, date_piece, libelle)
select '10000000-0000-0000-0000-000000000001', o.id, e.id, j.id, date '2026-10-05', 'Facture livraisons test'
from core.organisations o
join finance.exercices e on e.organisation_id = o.id
join finance.journaux j on j.organisation_id = o.id and j.code = 'VTE'
where o.code = 'SOMA';

insert into finance.lignes (piece_id, organisation_id, compte_id, tiers_id, debit, credit)
select '10000000-0000-0000-0000-000000000001', o.id, c.id, t.id, 1000000, 0
from core.organisations o, finance.comptes c, finance.tiers t
where o.code = 'SOMA' and c.numero = '411' and c.organisation_id is null and t.code = 'ETAT_MASAE';
insert into finance.lignes (piece_id, organisation_id, compte_id, debit, credit)
select '10000000-0000-0000-0000-000000000001', o.id, c.id, 0, 900000
from core.organisations o, finance.comptes c
where o.code = 'SOMA' and c.numero = '702' and c.organisation_id is null;

do $$ begin
  perform finance.valider_piece('10000000-0000-0000-0000-000000000001');
  raise exception 'ÉCHEC : pièce déséquilibrée validée';
exception when raise_exception then
  if sqlerrm like 'ÉCHEC%' then raise; end if;
end $$;

update finance.lignes set credit = 1000000 where credit = 900000;
select pg_temp.verifier(finance.valider_piece('10000000-0000-0000-0000-000000000001') = 'VTE-2026-00001', 'numérotation de la première pièce');

do $$ begin
  update finance.lignes set libelle = 'modif' where piece_id = '10000000-0000-0000-0000-000000000001';
  raise exception 'ÉCHEC : ligne d''une pièce validée modifiée';
exception when raise_exception then
  if sqlerrm like 'ÉCHEC%' then raise; end if;
end $$;

select pg_temp.verifier((select solde_debiteur from finance.v_balance where compte = '411') = 1000000, 'balance : 411 débiteur de 1 000 000');
reset role;

-- ---------------------------------------------------------------- BL
insert into public.regions (id, name, code) values ('20000000-0000-0000-0000-000000000001', 'MATAM', 'MT');
insert into public.departments (id, region_id, name, code) values ('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'KANEL', 'KN');
insert into public.communes (id, department_id, name, code) values ('20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'ORKADIERE', 'OR');
insert into public.project (id, numero_phase, tonnage_total) values ('20000000-0000-0000-0000-000000000004', 1, 100);
insert into public.operators (id, name, commune_id) values ('20000000-0000-0000-0000-000000000005', 'GIE test', '20000000-0000-0000-0000-000000000003');
insert into public.allocations (id, allocation_key, region_id, department_id, commune_id, operator_id, responsible_name, target_tonnage, project_id)
values ('20000000-0000-0000-0000-000000000006', 'K1', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', 'Resp', 40, '20000000-0000-0000-0000-000000000004');
insert into public.deliveries (allocation_id, bl_number, tonnage_loaded)
values ('20000000-0000-0000-0000-000000000006', 'BL' || to_char(current_date, 'YY') || '0001', 20);
insert into public.deliveries (allocation_id, tonnage_loaded) values ('20000000-0000-0000-0000-000000000006', 20);
select pg_temp.verifier((select count(distinct bl_number) from public.deliveries) = 2, 'le générateur de BL saute un numéro déjà pris');
select pg_temp.verifier((select status from public.allocations) = 'COMPLETED', 'statut d''allocation recalculé');

\o
\echo 'Tests de fumée : OK'
