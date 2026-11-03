<#
  dev.ps1 - one-command launcher for the HSC IT Portal (Astro)

  Usage (from the project folder, in PowerShell):
    .\dev.ps1               # normal start (fast)
    .\dev.ps1 -Clean        # clear caches first, then start
    .\dev.ps1 -Reinstall    # delete node_modules, reinstall, then start
    .\dev.ps1 -Build        # run a production build to check it works

  If scripts are blocked, run this once:
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>

param(
    [switch]$Clean,
    [switch]$Reinstall,
    [switch]$Build
)

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    !!  $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "    XX  $msg" -ForegroundColor Red; exit 1 }

# Always run from the folder this script lives in (handles spaces in the path).
# $PSScriptRoot is empty if the code was pasted into the console, so fall back to the current folder.
$Root = if ($PSScriptRoot) { $PSScriptRoot } elseif ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { (Get-Location).Path }
Set-Location -LiteralPath $Root

# 1. Pre-flight: Node, npm, project files
Step "Checking environment"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail "Node.js not found. Install the LTS version from https://nodejs.org" }
if (-not (Get-Command npm  -ErrorAction SilentlyContinue)) { Fail "npm not found. Reinstall Node.js." }
if (-not (Test-Path 'package.json'))       { Fail "package.json not found. Run this script from the project root." }
if (-not (Test-Path 'astro.config.mjs'))   { Fail "astro.config.mjs not found." }

$nodeVer = (node -v).TrimStart('v')
Ok "Node $nodeVer, npm $(npm -v)"
if ([int]($nodeVer.Split('.')[0]) -lt 20) { Warn "Node 20+ is recommended for current Astro versions." }

if ($Root -match '\s') {
    Warn "Project path contains a space: $Root"
    Warn "Dev mode works around this, but moving the folder to e.g. E:\dev\it-portal is safest."
}

# 2. Config sanity checks
Step "Checking astro.config.mjs"
$config = Get-Content 'astro.config.mjs' -Raw
$pkg    = Get-Content 'package.json' -Raw

if ($config -notmatch "process\.argv\.includes\('dev'\)") {
    Warn "Config does not skip the Cloudflare adapter in dev. 'astro dev' may crash on Windows (miniflare-CacheObject)."
} else { Ok "Cloudflare adapter is skipped in dev" }

if ($pkg -match '@tailwindcss/vite' -and $config -notmatch 'tailwindcss\(\)') {
    Warn "Tailwind plugin is installed but not registered in astro.config.mjs -> the page will look unstyled."
} elseif ($pkg -match '@tailwindcss/vite') { Ok "Tailwind plugin registered" }

# 3. Optional cleanup
if ($Reinstall) {
    Step "Full reinstall"
    Remove-Item -Recurse -Force node_modules, .astro, .wrangler, dist -ErrorAction SilentlyContinue
    npm install
    if ($LASTEXITCODE -ne 0) { Fail "npm install failed." }
    Ok "Dependencies reinstalled"
}
elseif ($Clean) {
    Step "Clearing caches"
    Remove-Item -Recurse -Force 'node_modules\.vite', '.astro', '.wrangler' -ErrorAction SilentlyContinue
    Ok "Caches cleared"
}

# 4. Install dependencies only when needed
Step "Checking dependencies"
$needInstall = -not (Test-Path 'node_modules')
if (-not $needInstall -and (Test-Path 'package-lock.json')) {
    if ((Get-Item 'package.json').LastWriteTime -gt (Get-Item 'node_modules').LastWriteTime) { $needInstall = $true }
}
if ($needInstall) {
    Warn "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { Fail "npm install failed." }
}
Ok "Dependencies ready"

# 5. Validate every JSON data file so bad edits are caught with a clear message
Step "Validating JSON data files"
$bad = 0
$jsonFiles = Get-ChildItem -Path 'src\data' -Recurse -Filter *.json -ErrorAction SilentlyContinue
foreach ($f in $jsonFiles) {
    try {
        Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null
        Ok $f.Name
    } catch {
        $bad++
        Write-Host "    XX  $($f.FullName)" -ForegroundColor Red
        Write-Host "        $($_.Exception.Message)" -ForegroundColor Red
    }
}
if ($bad -gt 0) { Fail "$bad JSON file(s) are invalid. Fix them (usually a missing comma, quote, or bracket) and re-run." }

# 6. Free the dev port if a stale server is holding it
$port = 4321
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Warn "Port $port is in use (PID $($conn.OwningProcess)). Stopping the old process."
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 7. Run
if ($Build) {
    Step "Running production build"
    npm run build
    if ($LASTEXITCODE -ne 0) { Fail "Build failed. See the errors above." }
    Ok "Build succeeded (output in .\dist)"
    exit 0
}

Step "Starting dev server -> http://localhost:$port/  (Ctrl+C to stop)"
Start-Process "http://localhost:$port/"
npm run dev
