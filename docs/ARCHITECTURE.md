# SOMA by Groupe Mozaïc — architecture du système d'information

Ce document décrit la refonte de l'application « MASAE Delivery Tracker »
(dépôt `mdiene/Mozaic-delivery-2025`) en un progiciel intégré pour la
Société Minière Africaine (SOMA) et le Groupe Mozaïc. Le périmètre couvre les
livraisons, la production sur site, la mine de phosphate de Matam, la finance
et la comptabilité du groupe, puis le pilotage du programme SOMA.

## 1. Principes

| Principe | Mise en œuvre |
|---|---|
| Une seule base | Le projet Supabase existant `Livraison_soma` (ref `ndzjirmrfdeheuljjvxb`) reste la base de production. |
| Pas de rupture | L'ancienne application garde ses tables (`public.*`). Les nouveaux modules vivent dans des schémas dédiés. On bascule module par module. |
| Sécurité en base | Supabase Auth remplace la connexion maison. Chaque table est protégée par des policies RLS selon le rôle et la société de l'utilisateur. |
| Multi-sociétés | Chaque donnée porte un `organisation_id`. Un rôle détenu sur « Groupe Mozaïc » couvre toutes les filiales. |
| Données traçables | Stocks tenus en grand livre de mouvements, écritures comptables validées immuables, journal d'audit sur les tables sensibles. |
| Calculs côté base | Agrégats, soldes et taux sont calculés dans des vues SQL (`security_invoker`), jamais en téléchargeant tous les BL dans le navigateur. |

## 2. Modules et schémas

| Module | Schéma | Contenu | Phase |
|---|---|---|---|
| Socle | `core` | organisations, sites, profils, rôles par société, numérotation, documents, audit | 0 |
| Livraisons | `public` (historique) + `livraisons` (vues) | phases/mises à disposition, opérateurs, allocations, BL, camions, chauffeurs, frais de transport | 1 |
| Production sur site | `production` | grand livre des stocks, criblage, achats et dépenses de site ; ensachage (historique `public.production`) | 1 |
| Mine de Matam | `mine` | titres miniers, obligations (redevances, taxe superficiaire, droits fixes, rapports, EIES), courriers administratifs, fronts, extraction, engins et pointages, analyses de laboratoire | 2 |
| Finance & comptabilité | `finance` | exercices, plan SYSCOHADA, journaux, tiers, analytique, pièces et lignes (partie double), contrats de vente, factures, règlements, banques et relevés, budgets | 2 |
| Pilotage | `pilotage` | programmes, jalons, tâches, risques, indicateurs | 2 |
| HQSE | `public.hqse_*` (historique) | équipements, inspections, non-conformités, actions correctives, dotations EPI, signalements | 3 |
| RH & paie | à créer (`rh`) | personnel, contrats, rubriques, bulletins (IPRES, CSS, IR, TRIMF) | 3 |

### Flux physique et stocks

```
extraction (mine.extractions) ──► MINERAI_BRUT + STERILE
criblage (production.criblages) ─► −MINERAI_BRUT, +PHOSPHATE_CRIBLE, +REFUS_CRIBLAGE
ensachage (public.production) ───► PHOSPHATE_ENSACHE         (phase 1 : à brancher)
livraison (public.deliveries) ───► −PHOSPHATE_ENSACHE        (phase 1 : à brancher)
```

Chaque opération écrit ses mouvements dans `production.stock_mouvements`
(par trigger). Le stock est la somme des mouvements (`production.v_stocks`).
Seuls les ajustements d'inventaire se saisissent à la main.

### Flux financier

```
contrat de vente (programme) ─┬─ phases de livraison rattachées (finance.contrat_projets)
                              └─ BL livrés ─► CA livré théorique (finance.v_execution_contrats)
facture ─► pièce comptable (journal VTE) ─► validation (équilibre, exercice ouvert, numérotation continue)
règlement ─► pièce de banque ─► rapprochement avec le relevé (finance.releves_bancaires)
```

Une pièce validée est figée (triggers). Toute correction passe par une
contre-écriture. La balance et le grand livre ne lisent que les pièces
validées.

## 3. Sécurité

* **Authentification** : Supabase Auth, sur invitation uniquement (inscription publique désactivée).
* **Rôles** (`core.role_app`) : admin, direction, finance, comptable, logistique, chef_site, mine, hqse, rh, chauffeur, lecteur. Un rôle s'attribue par société (`core.memberships`).
* **Autorisation** : `core.has_role(organisation_id, rôles[])` dans chaque policy. `core.appliquer_policies_standard()` pose les 4 policies (lecture, création, modification, suppression) d'une table métier.
* **Tables historiques** : la migration `legacy_compat` ajoute des droits pour les utilisateurs authentifiés sans retirer l'accès anonyme dont dépend encore l'ancienne application.
* **Bascule** : `supabase/pending/cutover_fermeture_acces_anonymes.sql` retire tout accès anonyme, passe les vues historiques en `security_invoker` et supprime les mots de passe en clair. Avant de l'appliquer, régénérer la clé anon : elle a été publiée dans le dépôt public de l'ancienne version.

### Constats sur la base existante (14/10/2026)

* Les 27 tables étaient en accès total pour le rôle `anon` (`USING (true)`), et la clé anon est publiée dans `render.yaml` et `web_app.md` de l'ancien dépôt public.
* `user_preferences.user_pswd` contient des mots de passe en clair.
* `generate_bl_number_text()` écrivait dans une table `bl_counter` absente (corrigé, format BL conservé).
* `project.tonnage_total` est un `smallint` (32 767 t maximum).
* Les tables `paie_*` et `production_purchases` utilisées par l'ancien front n'ont jamais été créées.

## 4. Front-end

* React 19, Vite, TypeScript strict, Tailwind CSS 4, TanStack Query, React Router, react-hook-form + zod, Recharts.
* Un registre de modules (`src/app/modules.ts`) déclare pour chaque module ses pages, son icône, ses rôles et sa phase. Le menu et les routes en découlent.
* Chaque page est chargée à la demande (`lazy`).
* Accès aux données : `db.<schéma>().from(...)`, typé par `src/lib/database.types.ts`. PostgREST n'embarque pas de relations entre schémas : on joint côté vue SQL ou par un second appel.
* Identité visuelle : barres orange, or et vert et bleu nuit, reprises du bon de livraison SOMA.

## 5. Base de données : conventions

* Une migration par module dans `supabase/migrations/`. On la rejoue localement avec `npm run db:check` (PostgreSQL sans Docker, avec un stub minimal des objets Supabase) avant tout `db push`.
* Le fichier `20251130000000_baseline_livraison_soma.sql` décrit la base existante. Il faut le **marquer comme appliqué** sur la production, jamais le rejouer.
* Les noms sont en français, en `snake_case`. Montants en `numeric(18,2)` en FCFA (XOF), tonnages en `numeric(…,3)`.
* Toute clé étrangère a son index, et toute vue est en `security_invoker = true`.

## 6. Feuille de route

| Phase | Contenu | Livrable de fin de phase |
|---|---|---|
| **0 — Fondations** (fait) | dépôt, outillage Claude Code, schéma de référence, socle `core`, migrations de tous les modules, application (connexion, menu par rôle, écrans de consultation) | ce dépôt |
| **1 — Livraisons & site** | saisie allocations, BL (génération PDF au format SOMA), FIFO camions par QR code, flotte, frais de transport ; ensachage, criblage, achats de site ; branchement ensachage et livraisons sur le grand livre des stocks ; invitation des utilisateurs ; **bascule** et fermeture de l'accès anonyme | ancienne application arrêtée |
| **2 — Mine, finance, pilotage** | registre des titres et des obligations avec alertes d'échéance, courriers ; saisie de l'extraction, des pointages d'engins et des analyses ; tiers, contrats, factures, règlements, saisie et validation d'écritures, génération automatique des écritures (factures, achats, paie), rapprochement bancaire, budgets ; programmes, jalons, tâches et risques | conformité et comptabilité tenues dans le SI |
| **3 — HQSE, RH, consolidation** | HQSE repris de l'existant ; RH et paie sénégalaise ; états financiers SYSCOHADA (bilan, compte de résultat) ; consolidation du groupe ; mode hors-ligne (PWA) pour le site et les chauffeurs | SI complet du groupe |

## 7. Mise en production des migrations

1. `npx supabase link --project-ref ndzjirmrfdeheuljjvxb`
2. `npx supabase migration repair --status applied 20251130000000` pour marquer le schéma existant comme appliqué.
3. `npm run db:check` pour rejouer toutes les migrations en local.
4. `npx supabase db push` pour appliquer les migrations du 14/10/2026 (purement additives : l'ancienne application continue de fonctionner).
5. Dashboard › Settings › API › *Exposed schemas* : ajouter `core, livraisons, production, mine, finance, pilotage`.
6. Dashboard › Authentication : désactiver les inscriptions publiques, puis inviter le premier utilisateur.
7. Éditeur SQL : `select core.bootstrap_admin('email@domaine', 'GROUPE_MOZAIC');`
8. `npm run db:types` pour régénérer les types depuis la base réelle.
