# SOMA by Groupe Mozaïc — consignes du projet

Système d'information intégré de la SOMA (Société Minière Africaine) : livraisons,
production sur site, mine de phosphate de Matam, finance et comptabilité du groupe, pilotage.
Lire `docs/ARCHITECTURE.md` avant tout changement de structure.

## Langue
Interface, noms de tables et colonnes, messages et documentation : **français**. Code (mots-clés, bibliothèques) en anglais.

## Pile
React 19 + Vite + TypeScript strict + Tailwind 4 + TanStack Query + React Router + react-hook-form/zod + Recharts.
Supabase (Postgres 17, Auth, RLS). Projet de production : `ndzjirmrfdeheuljjvxb` (« Livraison_soma »).

## Règles impératives
- **Cible actuelle : la base Supabase LOCALE** (`npm run local:init`, `npm run local:reset`). La production n'est modifiée qu'à la bascule finale, sur décision explicite de l'utilisateur.
- **Ne jamais modifier la base de production directement.** Toute évolution passe par une migration dans `supabase/migrations/`, validée par `npm run db:check`, puis appliquée par l'utilisateur.
- Le fichier `20251130000000_baseline_livraison_soma.sql` décrit l'existant : ne pas le modifier, ne pas le rejouer en production.
- Les tables historiques `public.*` sont encore utilisées par l'ancienne application : migrations **additives** uniquement jusqu'à la bascule (`supabase/pending/`).
- Toute nouvelle table métier : colonne `organisation_id`, RLS via `core.appliquer_policies_standard()`, index sur chaque clé étrangère, vues en `security_invoker = true`.
- Aucune clé, aucun mot de passe dans le code : variables `VITE_*` dans `.env.local` (ignoré par git).
- Écritures comptables validées immuables ; stocks uniquement via `production.stock_mouvements` (triggers).
- Montants en FCFA `numeric(18,2)`, tonnages `numeric(…,3)` ; formatage via `src/lib/format.ts`.

## Organisation du front
- `src/app/modules.ts` : registre des modules (pages, rôles, phase) → menu et routes.
- `src/modules/<module>/` : pages et hooks de données d'un module.
- `src/lib/supabase.ts` : `db.<schéma>()` typé ; pas d'embed PostgREST entre schémas (joindre dans une vue SQL).
- Après un changement de schéma : `npm run db:types` (ou `scripts/gen-types-local.sh`).

## Vérifications avant de rendre la main
`npm run typecheck && npm run lint && npm test && npm run build && npm run db:check`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
