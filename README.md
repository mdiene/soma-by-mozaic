# SOMA by Groupe Mozaïc

Système d'information intégré de la Société Minière Africaine (SOMA) et du
Groupe Mozaïc. Il couvre le suivi des livraisons, la production sur site, la mine
de phosphate de Matam, la finance et la comptabilité du groupe, et le pilotage du
programme SOMA.

Refonte de [`Mozaic-delivery-2025`](https://github.com/mdiene/Mozaic-delivery-2025), sur la même base Supabase.
L'architecture, la feuille de route et les constats sur l'existant sont dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Démarrer : environnement local

Le développement se fait sur une base Supabase **locale** (Postgres, Auth et API dans Docker),
chargée avec une copie des données de production. La production n'est touchée
qu'à la bascule finale (voir `docs/ARCHITECTURE.md`, §7).

Prérequis : Node.js 20+, Git, Docker Desktop démarré, Python 3.10+ pour Graphify.

```powershell
git pull
npm run local:init     # 1re fois : copie des données de production + démarrage + migrations
npm run dev            # http://localhost:3000  — connexion : admin@soma.local / soma-local-2026
```

Au premier lancement, `local:init` demande le mot de passe de la base Supabase
(Dashboard › Settings › Database) pour **lire** les données de production. Il les
enregistre dans `supabase/seed/10_donnees_production.sql`, un fichier exclu de git.
Les mots de passe en clair de l'ancienne application sont effacés de cette copie.

| Commande | Rôle |
|---|---|
| `npm run local:init -- -Rafraichir` | recopier les données de production |
| `npm run local:init -- -SansDonnees` | base vide (référentiel + compte admin local) |
| `npm run local:reset` | rejouer migrations et données sur la base locale |
| `npm run local:types` | régénérer les types TypeScript depuis la base locale |
| `npm run local:stop` | arrêter les conteneurs |

Studio (interface de la base) : http://127.0.0.1:54323. E-mails d'authentification : http://127.0.0.1:54324.

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | contrôle TypeScript et build de production (`dist/`) |
| `npm run lint` / `npm run typecheck` / `npm test` | qualité |
| `npm run db:check` | rejoue toutes les migrations et les tests de fumée SQL sur un PostgreSQL local |
| `npm run db:types` | régénère les types depuis le projet de production (après la bascule) |
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
