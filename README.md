# SOMA by Groupe Mozaïc

Système d'information intégré de la Société Minière Africaine (SOMA) et du
Groupe Mozaïc. Il couvre le suivi des livraisons, la production sur site, la mine
de phosphate de Matam, la finance et la comptabilité du groupe, et le pilotage du
programme SOMA.

Refonte de [`Mozaic-delivery-2025`](https://github.com/mdiene/Mozaic-delivery-2025), sur la même base Supabase.
L'architecture, la feuille de route et les constats sur l'existant sont dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Démarrer (Windows, macOS, Linux)

Prérequis : Node.js 20 ou plus récent, Git, et Python 3.10+ pour Graphify.

```bash
git clone https://github.com/mdiene/soma-by-mozaic.git
cd soma-by-mozaic
npm install
copy .env.example .env.local      # Windows (sous macOS/Linux : cp)
# renseigner VITE_SUPABASE_ANON_KEY (Dashboard Supabase › Settings › API)
npm run dev                        # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | contrôle TypeScript et build de production (`dist/`) |
| `npm run lint` / `npm run typecheck` / `npm test` | qualité |
| `npm run db:check` | rejoue toutes les migrations et les tests de fumée SQL sur un PostgreSQL local |
| `npm run db:types` | régénère `src/lib/database.types.ts` depuis le projet Supabase |
| `npm run graph` | met à jour le graphe de connaissances du code (Graphify) |

## Base de données

Les migrations sont dans `supabase/migrations/`, une par module :

| Fichier | Contenu |
|---|---|
| `20251130000000_baseline_livraison_soma.sql` | schéma existant, à **marquer comme appliqué** sur la production et à ne jamais rejouer |
| `20261014100000_core.sql` | sociétés, sites, profils, rôles, fonctions RLS, audit |
| `20261014100100_legacy_compat.sql` | accès des utilisateurs authentifiés aux tables historiques, correctif des numéros de BL |
| `20261014100200_production.sql` | grand livre des stocks, criblage, achats de site |
| `20261014100300_mine.sql` | titres, obligations, courriers, fronts, extraction, engins, analyses |
| `20261014100400_finance.sql` | comptabilité SYSCOHADA, contrats, factures, trésorerie, budgets |
| `20261014100500_pilotage.sql` | programmes, jalons, tâches, risques, indicateurs |
| `20261014100600_referentiel_initial.sql` | Groupe Mozaïc, SOMA, sites, plan comptable, journaux, exercice 2026 |
| `20261014100700_livraisons_vues.sql` | vues d'avancement des livraisons |

`supabase/pending/` contient la migration de **bascule**, qui ferme l'accès
anonyme. Elle n'est à appliquer qu'à l'arrêt de l'ancienne application.
La procédure de mise en production est décrite dans `docs/ARCHITECTURE.md`, §7.

## Outillage Claude Code

Le dépôt embarque sa configuration Claude Code :

* `.claude/skills/` : skills **Supabase**, **Postgres best practices** et **Graphify** ;
* `CLAUDE.md` : conventions du projet et règles d'usage du graphe ;
* `graphify-out/` : graphe de connaissances du code (`GRAPH_REPORT.md`, `graph.html`).

Une fois le dépôt cloné, sur votre poste :

```bash
pip install graphifyy                 # CLI Graphify (puis : graphify claude install)
```

Ensuite, dans Claude Code, installez **ECC** (Everything Claude Code) :

```text
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

Les règles ECC (`common`, `typescript`, `react`, `web`) s'ajoutent dans `~/.claude/rules/`.
La procédure est dans le README d'ECC.
