# Graph Report - mozaic-delivery-2025  (2026-10-14)

## Corpus Check
- 61 files · ~89,291 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 4, (none) 1)

## Summary
- 402 nodes · 1109 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6ca7ddc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- db.ts
- App.tsx
- react
- package.json
- Allocations.tsx
- constants.ts
- components.json
- dependencies
- compilerOptions
- MASAE Delivery Tracker - Mobile Application PRD
- GlobalView.tsx
- CalculatricePaieSN
- registry.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 58 edges
2. `useAuth()` - 41 edges
3. `react` - 40 edges
4. `lucide-react` - 34 edges
5. `App()` - 28 edges
6. `db` - 28 edges
7. `AdvancedSelect()` - 23 edges
8. `Allocations()` - 20 edges
9. `compilerOptions` - 16 edges
10. `Truck` - 16 edges

## Surprising Connections (you probably didn't know these)
- `A. Dashboard & Analytics` --references--> `Region`  [INFERRED]
  web_app.md → types.ts
- `B. Allocation Management` --references--> `Project`  [INFERRED]
  web_app.md → types.ts
- `C. Logistics Dispatch (The "Bon de Livraison" Process)` --references--> `Allocation`  [INFERRED]
  web_app.md → types.ts
- `App()` --calls--> `Allocations()`  [EXTRACTED]
  App.tsx → pages/Allocations.tsx
- `App()` --calls--> `GlobalView()`  [EXTRACTED]
  App.tsx → pages/GlobalView.tsx

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "cn"
Cohesion: 0.07
Nodes (46): Badge(), badgeVariants, Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription() (+38 more)

### Community 1 - "db.ts"
Cohesion: 0.11
Nodes (45): Tab, COLORS, drawSomaHeaderOnPdf(), jspdf, jspdf-autotable, motion, recharts, db (+37 more)

### Community 2 - "App.tsx"
Cohesion: 0.12
Nodes (42): App(), ProtectedRoute(), AdvancedSelect(), AdvancedSelectProps, Option, Layout(), Sidebar(), AuthContext (+34 more)

### Community 3 - "react"
Cohesion: 0.09
Nodes (31): Header(), ProjectContext, ProjectContextType, SidebarSubmenu(), THEMES, useProject(), generatePieChartSVG(), HEX_COLORS (+23 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (29): supabase, devDependencies, tailwindcss, @tailwindcss/vite, @types/node, typescript, vite, @vitejs/plugin-react (+21 more)

### Community 5 - "Allocations.tsx"
Cohesion: 0.16
Nodes (23): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Table(), TableBody(), TableCell(), TableFooter() (+15 more)

### Community 6 - "constants.ts"
Cohesion: 0.08
Nodes (24): APP_NAME, CURRENT_USER_EMAIL, MOCK_ALLOCATIONS, MOCK_COMMUNES, MOCK_DELIVERIES, MOCK_DEPARTMENTS, MOCK_DRIVERS, MOCK_OPERATORS (+16 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, clsx, @fontsource-variable/geist, @google/genai, html5-qrcode, jspdf (+14 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 10 - "MASAE Delivery Tracker - Mobile Application PRD"
Cohesion: 0.13
Nodes (14): 1. Project Overview, 2. Technical Architecture, 3. Connectivity & Credentials, 4. Feature Specifications & Workflows, 5. Data Models (TypeScript Interfaces), 6. UX/UI Guidelines (Mobile Adaptation), 7. Development Roadmap, A. Dashboard (Home Screen) (+6 more)

### Community 11 - "GlobalView.tsx"
Cohesion: 0.19
Nodes (14): calculateNodeStats(), COLORS, Column(), ColumnProps, DriverStat, DriverStatsDashboard(), GlobalView(), LevelStats (+6 more)

## Knowledge Gaps
- **6 isolated node(s):** `@fontsource-variable/geist`, `shadcn`, `tw-animate-css`, `@types/node`, `tailwindcss` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 148 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `db.ts`, `App.tsx`, `package.json`, `Allocations.tsx`, `GlobalView.tsx`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `shadcn`, `tw-animate-css` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06939890710382514 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `cn`, `db.ts`, `App.tsx`, `package.json`, `Allocations.tsx`, `GlobalView.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10508474576271186 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12081632653061225 - nodes in this community are weakly interconnected._