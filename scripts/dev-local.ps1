<#
  Environnement de developpement LOCAL du SI SOMA (Windows / PowerShell).

  - demarre Supabase en local (Postgres + Auth + API) dans Docker Desktop ;
  - copie, une seule fois, les donnees de la production (lecture seule) dans
    supabase/seed/10_donnees_production.sql (fichier ignore par git) ;
  - rejoue toutes les migrations puis les seeds (db reset) ;
  - ecrit .env.local pour que l'application pointe sur la base locale.

  La base de production n'est JAMAIS modifiee par ce script.

  Usage :  npm run local:init                 (premiere fois)
           npm run local:init -- -Rafraichir  (recopier les donnees de production)
           npm run local:init -- -SansDonnees (base vide + compte admin local)
#>
param(
  [switch]$SansDonnees,
  [switch]$Rafraichir
)
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
$ProjetProduction = 'ndzjirmrfdeheuljjvxb'
$FichierDonnees = 'supabase/seed/10_donnees_production.sql'

function Etape($texte) { Write-Host "`n==> $texte" -ForegroundColor Cyan }
function Executer([string]$commande) {
  Write-Host "    $commande" -ForegroundColor DarkGray
  Invoke-Expression $commande
  if ($LASTEXITCODE -ne 0) { throw "Echec : $commande" }
}

Etape 'Verification de Docker Desktop'
docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop doit etre demarre avant de lancer ce script.' }

if (-not (Test-Path 'node_modules')) {
  Etape 'Installation des dependances npm'
  Executer 'npm install'
}

if ($SansDonnees) {
  if (Test-Path $FichierDonnees) { Rename-Item $FichierDonnees "$FichierDonnees.desactive" -Force }
} elseif ($Rafraichir -or -not (Test-Path $FichierDonnees)) {
  Etape 'Copie des donnees de production (lecture seule)'
  Write-Host '    Le mot de passe de la base Supabase (Dashboard > Settings > Database) vous sera demande.'
  npx supabase projects list *> $null
  if ($LASTEXITCODE -ne 0) { Executer 'npx supabase login' }
  Executer "npx supabase link --project-ref $ProjetProduction"
  Executer "npx supabase db dump --linked --data-only --schema public -f $FichierDonnees"
} else {
  Write-Host "`n    Copie de production deja presente : $FichierDonnees (option -Rafraichir pour la renouveler)"
}

Etape 'Demarrage de Supabase en local (le premier lancement telecharge les images Docker)'
Executer 'npx supabase start'

Etape 'Migrations + donnees (db reset sur la base LOCALE)'
Executer 'npx supabase db reset --local'

Etape 'Ecriture de .env.local'
$statut = npx supabase status -o env
$valeurs = @{}
foreach ($ligne in $statut) {
  if ($ligne -match '^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$') { $valeurs[$Matches[1]] = $Matches[2] }
}
$url = $valeurs['API_URL']
$cle = if ($valeurs['ANON_KEY']) { $valeurs['ANON_KEY'] } else { $valeurs['PUBLISHABLE_KEY'] }
if (-not $url -or -not $cle) { throw 'Impossible de lire API_URL / ANON_KEY dans "supabase status".' }
@(
  '# Genere par scripts/dev-local.ps1 : base Supabase LOCALE',
  "VITE_SUPABASE_URL=$url",
  "VITE_SUPABASE_ANON_KEY=$cle"
) | Set-Content -Encoding utf8 '.env.local'

Write-Host "`nEnvironnement local pret." -ForegroundColor Green
Write-Host '  Application   : npm run dev  ->  http://localhost:3000'
Write-Host '  Connexion     : admin@soma.local / soma-local-2026'
Write-Host '  Studio (BDD)  : http://127.0.0.1:54323'
Write-Host '  Mails (Auth)  : http://127.0.0.1:54324'
Write-Host '  Arret         : npm run local:stop'
