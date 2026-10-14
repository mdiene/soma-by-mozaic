-- =============================================================================
-- RÉFÉRENTIEL INITIAL — structure uniquement (aucune donnée opérationnelle)
--   * organisations du groupe et sites
--   * plan comptable SYSCOHADA révisé (comptes principaux, commun au groupe)
--   * journaux et exercice 2026 pour la SOMA
-- Les coordonnées, NINEA, RCCM, sociétés supplémentaires, etc. se complètent
-- ensuite depuis l'application (écran Administration).
-- =============================================================================

insert into core.organisations (code, nom) values ('GROUPE_MOZAIC', 'Groupe Mozaïc');
insert into core.organisations (code, nom, forme_juridique, parent_id)
select 'SOMA', 'Société Minière Africaine', 'SA', id from core.organisations where code = 'GROUPE_MOZAIC';

insert into core.sites (organisation_id, code, nom, type, region, latitude, longitude)
select o.id, s.code, s.nom, s.type, s.region, s.lat, s.lng
from core.organisations o
cross join (values
  ('NDENDORY', 'Mine de phosphate de Ndendory', 'mine', 'Matam', null::numeric, null::numeric),
  ('AMADI_OUNARE', 'Site d''Amadi Ounare (criblage, ensachage, chargement)', 'site_ensachage', 'Matam', 15.3469, -13.0218),
  ('DAKAR', 'Siège — Dakar', 'siege', 'Dakar', null, null)
) as s(code, nom, type, region, lat, lng)
where o.code = 'SOMA';

-- ---------------------------------------------------------------- plan comptable (commun)
insert into finance.comptes (organisation_id, numero, libelle, collectif, lettrable) values
  (null, '101', 'Capital social', false, false),
  (null, '111', 'Réserve légale', false, false),
  (null, '118', 'Autres réserves', false, false),
  (null, '121', 'Report à nouveau créditeur', false, false),
  (null, '129', 'Report à nouveau débiteur', false, false),
  (null, '131', 'Résultat net : bénéfice', false, false),
  (null, '139', 'Résultat net : perte', false, false),
  (null, '162', 'Emprunts et dettes auprès des établissements de crédit', false, false),
  (null, '191', 'Provisions pour litiges', false, false),
  (null, '213', 'Logiciels et sites internet', false, false),
  (null, '218', 'Autres droits et valeurs incorporels', false, false),
  (null, '225', 'Terrains de carrières et de gisements', false, false),
  (null, '231', 'Bâtiments industriels, agricoles, administratifs et commerciaux sur sol propre', false, false),
  (null, '241', 'Matériel et outillage industriel et commercial', false, false),
  (null, '244', 'Matériel et mobilier', false, false),
  (null, '245', 'Matériel de transport', false, false),
  (null, '2841', 'Amortissements du matériel et outillage industriel et commercial', false, false),
  (null, '2845', 'Amortissements du matériel de transport', false, false),
  (null, '321', 'Matières premières', false, false),
  (null, '331', 'Matières consommables', false, false),
  (null, '335', 'Emballages', false, false),
  (null, '361', 'Produits finis', false, false),
  (null, '371', 'Produits intermédiaires', false, false),
  (null, '401', 'Fournisseurs, dettes en compte', true, true),
  (null, '408', 'Fournisseurs, factures non parvenues', false, false),
  (null, '409', 'Fournisseurs débiteurs (avances et acomptes versés)', true, true),
  (null, '411', 'Clients', true, true),
  (null, '418', 'Clients, produits à recevoir', false, false),
  (null, '419', 'Clients créditeurs (avances et acomptes reçus)', true, true),
  (null, '421', 'Personnel, avances et acomptes', true, true),
  (null, '422', 'Personnel, rémunérations dues', true, true),
  (null, '431', 'Sécurité sociale', false, true),
  (null, '432', 'Caisses de retraite', false, true),
  (null, '441', 'État, impôt sur les bénéfices', false, true),
  (null, '442', 'État, autres impôts et taxes', false, true),
  (null, '443', 'État, TVA facturée', false, false),
  (null, '445', 'État, TVA récupérable', false, false),
  (null, '447', 'État, impôts retenus à la source', false, true),
  (null, '462', 'Associés, comptes courants', true, true),
  (null, '471', 'Débiteurs et créditeurs divers', false, true),
  (null, '476', 'Charges constatées d''avance', false, false),
  (null, '477', 'Produits constatés d''avance', false, false),
  (null, '521', 'Banques locales', false, true),
  (null, '571', 'Caisse siège social', false, false),
  (null, '585', 'Virements de fonds', false, true),
  (null, '602', 'Achats de matières premières et fournitures liées', false, false),
  (null, '604', 'Achats stockés de matières et fournitures consommables', false, false),
  (null, '605', 'Autres achats', false, false),
  (null, '608', 'Achats d''emballages', false, false),
  (null, '612', 'Transports sur ventes', false, false),
  (null, '614', 'Transports du personnel', false, false),
  (null, '618', 'Autres frais de transport', false, false),
  (null, '622', 'Locations et charges locatives', false, false),
  (null, '624', 'Entretien, réparations, remise en état et maintenance', false, false),
  (null, '625', 'Primes d''assurance', false, false),
  (null, '628', 'Frais de télécommunications', false, false),
  (null, '631', 'Frais bancaires', false, false),
  (null, '632', 'Rémunérations d''intermédiaires et de conseils', false, false),
  (null, '637', 'Rémunérations de personnel extérieur à l''entité', false, false),
  (null, '638', 'Autres charges externes', false, false),
  (null, '641', 'Impôts et taxes directs', false, false),
  (null, '6418', 'Autres impôts et taxes directs (redevances minières, taxe superficiaire)', false, false),
  (null, '646', 'Droits d''enregistrement', false, false),
  (null, '647', 'Pénalités, amendes fiscales', false, false),
  (null, '658', 'Charges diverses', false, false),
  (null, '661', 'Rémunérations directes versées au personnel national', false, false),
  (null, '663', 'Indemnités forfaitaires versées au personnel', false, false),
  (null, '664', 'Charges sociales', false, false),
  (null, '671', 'Intérêts des emprunts', false, false),
  (null, '681', 'Dotations aux amortissements d''exploitation', false, false),
  (null, '691', 'Dotations aux provisions d''exploitation', false, false),
  (null, '702', 'Ventes de produits finis', false, false),
  (null, '703', 'Ventes de produits intermédiaires', false, false),
  (null, '704', 'Ventes de produits résiduels', false, false),
  (null, '706', 'Services vendus', false, false),
  (null, '707', 'Produits accessoires', false, false),
  (null, '71', 'Subventions d''exploitation', false, false),
  (null, '736', 'Variations des stocks de produits finis', false, false),
  (null, '758', 'Produits divers', false, false),
  (null, '771', 'Intérêts de prêts et créances diverses', false, false),
  (null, '891', 'Impôts sur les bénéfices de l''exercice', false, false);

-- ---------------------------------------------------------------- SOMA : journaux, exercice
insert into finance.journaux (organisation_id, code, libelle, type_journal, compte_contrepartie_id)
select o.id, j.code, j.libelle, j.type_journal,
       (select c.id from finance.comptes c where c.organisation_id is null and c.numero = j.contrepartie)
from core.organisations o
cross join (values
  ('ACH', 'Achats', 'achats', null::text),
  ('VTE', 'Ventes', 'ventes', null),
  ('BQ1', 'Banque principale', 'banque', '521'),
  ('CAI', 'Caisse', 'caisse', '571'),
  ('PAI', 'Paie', 'paie', null),
  ('OD', 'Opérations diverses', 'operations_diverses', null),
  ('AN', 'À-nouveaux', 'a_nouveaux', null)
) as j(code, libelle, type_journal, contrepartie)
where o.code = 'SOMA';

insert into finance.exercices (organisation_id, code, date_debut, date_fin)
select id, '2026', date '2026-01-01', date '2026-12-31' from core.organisations where code = 'SOMA';

insert into finance.sections_analytiques (organisation_id, axe, code, libelle, site_id)
select o.id, 'site', s.code, s.nom, s.id
from core.organisations o join core.sites s on s.organisation_id = o.id
where o.code = 'SOMA';
