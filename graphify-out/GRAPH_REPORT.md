# Graph Report - soma-by-mozaic  (2026-10-14)

## Corpus Check
- 112 files · ~49,571 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 527 nodes · 1176 edges · 56 communities (20 shown, 36 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4e189844`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Conformite.tsx
- 2. Core Modules & Features
- App.tsx
- compilerOptions
- Changelog
- supabase.ts
- package.json
- Supabase
- Changelog
- SOMA by Groupe Mozaïc — architecture du système d'information
- compilerOptions
- Writing Guidelines for Postgres References
- dependencies
- Communities (14 total, 2 thin omitted)
- scripts
- Section Definitions
- SOMA by Groupe Mozaïc — consignes du projet
- Supabase Postgres Best Practices
- .oxlintrc.json
- AI Coding Assistant Instructions for MASAE Delivery Tracker
- tsconfig.json
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md
- check-migrations.sh
- gen-types-local.sh

## God Nodes (most connected - your core abstractions)
1. `Chargement()` - 29 edges
2. `Card()` - 29 edges
3. `verifier()` - 28 edges
4. `Vide()` - 27 edges
5. `PageHeader()` - 25 edges
6. `Table()` - 24 edges
7. `Th()` - 24 edges
8. `Td()` - 24 edges
9. `Erreur()` - 23 edges
10. `cn()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Suggested Questions` --references--> `cn()`  [INFERRED]
  docs/reference-ancienne-app/GRAPH_REPORT.md → src/lib/utils.ts
- `Surprising Connections (you probably didn't know these)` --references--> `App()`  [INFERRED]
  docs/reference-ancienne-app/GRAPH_REPORT.md → src/app/App.tsx
- `God Nodes (most connected - your core abstractions)` --references--> `Allocations()`  [INFERRED]
  docs/reference-ancienne-app/GRAPH_REPORT.md → src/modules/livraisons/Allocations.tsx
- `Surprising Connections (you probably didn't know these)` --references--> `Allocations()`  [INFERRED]
  docs/reference-ancienne-app/GRAPH_REPORT.md → src/modules/livraisons/Allocations.tsx
- `God Nodes (most connected - your core abstractions)` --references--> `App()`  [INFERRED]
  docs/reference-ancienne-app/GRAPH_REPORT.md → src/app/App.tsx

## Import Cycles
- None detected.

## Communities (56 total, 36 thin omitted)

### Community 0 - "Conformite.tsx"
Cohesion: 0.15
Nodes (61): @tanstack/react-query, Chargement(), Erreur(), Vide(), PageHeader(), Badge(), Card(), CardBody() (+53 more)

### Community 1 - "2. Core Modules & Features"
Cohesion: 0.08
Nodes (24): 1. Project Overview, 2.1. Dashboard & Analytics, 2.2. Global View (Network Visualization), 2.3. Fleet & Logistics Management, 2.4. Production Tracking, 2.5. Allocations & Deliveries, 2.6. HQSE (Health, Quality, Safety, Environment), 2.7. Expenses & Accounting (+16 more)

### Community 2 - "App.tsx"
Cohesion: 0.10
Nodes (41): God Nodes (most connected - your core abstractions), @hookform/resolvers, lucide-react, react, react-hook-form, react-router-dom, @supabase/supabase-js, zod (+33 more)

### Community 3 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+14 more)

### Community 4 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 5 - "supabase.ts"
Cohesion: 0.14
Nodes (14): CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables (+6 more)

### Community 6 - "package.json"
Cohesion: 0.04
Nodes (43): devDependencies, jsdom, oxlint, supabase, tailwindcss, @tailwindcss/vite, @testing-library/jest-dom, @testing-library/react (+35 more)

### Community 7 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 8 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 9 - "SOMA by Groupe Mozaïc — architecture du système d'information"
Cohesion: 0.12
Nodes (15): 1. Principes, 2. Modules et schémas, 3. Sécurité, 4. Front-end, 5. Base de données : conventions, 6. Feuille de route, 7. Environnement de développement et bascule, Constats sur la base existante (14/10/2026) (+7 more)

### Community 10 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 11 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, react, react-dom (+8 more)

### Community 13 - "Communities (14 total, 2 thin omitted)"
Cohesion: 0.09
Nodes (22): Communities (14 total, 2 thin omitted), Community 0 - "cn", Community 10 - "MASAE Delivery Tracker - Mobile Application PRD", Community 11 - "GlobalView.tsx", Community 1 - "db.ts", Community 2 - "App.tsx", Community 3 - "react", Community 4 - "package.json" (+14 more)

### Community 14 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, db:check, db:types, dev, graph, lint, local:init (+7 more)

### Community 15 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 16 - "SOMA by Groupe Mozaïc — consignes du projet"
Cohesion: 0.25
Nodes (7): graphify, Langue, Organisation du front, Pile, Règles impératives, SOMA by Groupe Mozaïc — consignes du projet, Vérifications avant de rendre la main

### Community 17 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 18 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 19 - "AI Coding Assistant Instructions for MASAE Delivery Tracker"
Cohesion: 0.22
Nodes (8): 1. Design System & UI Consistency, 2. Business Logic Rules, 3. Database & Services (`services/db.ts`), 4. Google Gemini API Implementation, 5. Export & Printing, AI Coding Assistant Instructions for MASAE Delivery Tracker, Logistics & Expenses, Production Module (Ensachage)

## Knowledge Gaps
- **11 isolated node(s):** `date-fns`, `@testing-library/react`, `@types/node`, `@types/react`, `@types/react-dom` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 335 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graph Report - mozaic-delivery-2025  (2026-10-14)` connect `Communities (14 total, 2 thin omitted)` to `App.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `date-fns`, `@testing-library/react`, `@types/node` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Conformite.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14888123924268504 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App.tsx` to `Conformite.tsx`, `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `2. Core Modules & Features` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09675324675324676 - nodes in this community are weakly interconnected._