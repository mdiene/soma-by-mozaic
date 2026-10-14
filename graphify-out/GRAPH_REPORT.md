# Graph Report - soma-by-mozaic  (2026-10-14)

## Corpus Check
- 107 files · ~46,416 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 462 nodes · 1108 edges · 56 communities (20 shown, 36 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Utilisateurs.tsx
- Conformite.tsx
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
- devDependencies
- scripts
- Section Definitions
- SOMA by Groupe Mozaïc — consignes du projet
- Supabase Postgres Best Practices
- .oxlintrc.json
- vite.config.ts
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
- @testing-library/jest-dom
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
10. `react` - 22 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `LoginPage()`  [EXTRACTED]
  src/app/App.tsx → src/auth/LoginPage.tsx
- `AppShell()` --calls--> `Chargement()`  [EXTRACTED]
  src/app/AppShell.tsx → src/components/Etats.tsx
- `AppShell()` --calls--> `Badge()`  [EXTRACTED]
  src/app/AppShell.tsx → src/components/ui/badge.tsx
- `AppShell()` --calls--> `cn()`  [EXTRACTED]
  src/app/AppShell.tsx → src/lib/utils.ts
- `Garde()` --calls--> `Chargement()`  [EXTRACTED]
  src/app/Garde.tsx → src/components/Etats.tsx

## Import Cycles
- None detected.

## Communities (56 total, 36 thin omitted)

### Community 0 - "Utilisateurs.tsx"
Cohesion: 0.18
Nodes (51): @tanstack/react-query, Chargement(), Erreur(), Vide(), PageHeader(), Badge(), Card(), CardBody() (+43 more)

### Community 1 - "Conformite.tsx"
Cohesion: 0.12
Nodes (28): class-variance-authority, @hookform/resolvers, react, react-hook-form, zod, Formulaire, LoginPage(), schema (+20 more)

### Community 2 - "App.tsx"
Cohesion: 0.14
Nodes (24): lucide-react, react-dom, react-router-dom, @supabase/supabase-js, Accueil(), App(), ConfigurationManquante(), queryClient (+16 more)

### Community 3 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+14 more)

### Community 4 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 5 - "supabase.ts"
Cohesion: 0.11
Nodes (17): useOrganisationParDefaut(), useOrganisations(), CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+9 more)

### Community 6 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, type, version, clsx, date-fns, jsdom, oxlint (+11 more)

### Community 7 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 8 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 9 - "SOMA by Groupe Mozaïc — architecture du système d'information"
Cohesion: 0.12
Nodes (15): 1. Principes, 2. Modules et schémas, 3. Sécurité, 4. Front-end, 5. Base de données : conventions, 6. Feuille de route, 7. Mise en production des migrations, Constats sur la base existante (14/10/2026) (+7 more)

### Community 10 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 11 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, react, react-dom (+8 more)

### Community 13 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, jsdom, oxlint, supabase, tailwindcss, @tailwindcss/vite, @testing-library/jest-dom, @testing-library/react (+7 more)

### Community 14 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, db:check, db:types, dev, graph, lint, preview (+3 more)

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

### Community 19 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

## Knowledge Gaps
- **11 isolated node(s):** `date-fns`, `@testing-library/react`, `@types/node`, `@types/react`, `@types/react-dom` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 282 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `date-fns`, `@testing-library/react`, `@types/node` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Conformite.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12462462462462462 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Conformite.tsx` to `Utilisateurs.tsx`, `App.tsx`, `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13825757575757575 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._