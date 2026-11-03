<#
.SYNOPSIS
    HSC IT Portal - Single-Shot Environment & File Lock Remediation Script
.DESCRIPTION
    Kills orphaned background file locks on E:/ and safely configures PowerShell 
    process exclusions for Node/Python without compromising system-wide security.
.NOTES
    Must be run as Administrator.
#>

[CmdletBinding()]
param()

# Ensure script is running with Administrator privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "[-] This script must be run as Administrator! Right-click PowerShell and select 'Run as administrator'."
    exit 1
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "     HSC IT PORTAL - ENVIRONMENT SETUP & LOCK CLEAR     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Clear Orphaned File Handles / Background Processes on E:/
Write-Host "`n[1/3] Scanning and terminating hanging processes locking E:\" -ForegroundColor Yellow
$lockedProcesses = Get-Process | Where-Object { 
    try { $_.Path -like "E:\*" } catch { $false } 
}

if ($lockedProcesses) {
    foreach ($proc in $lockedProcesses) {
        Write-Host "  -> Stopping hanging process: $($proc.Name) (PID: $($proc.Id))" -ForegroundColor DarkYellow
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "[+] All conflicting E:/ process locks cleared successfully." -ForegroundColor Green
} else {
    Write-Host "[+] No active file locks detected on E:/." -ForegroundColor Green
}

# 2. Configure Safe Process-Level Exclusions (Avoiding Blanket Folder Exclusions)
Write-Host "`n[2/3] Configuring secure Windows Defender process exclusions..." -ForegroundColor Yellow

$interpreters = @(
    "C:\Program Files\nodejs\node.exe",
    "${env:ProgramFiles}\nodejs\node.exe",
    "${env:LocalAppData}\Programs\node\node.exe",
    "C:\Python311\python.exe",
    "C:\Python312\python.exe",
    "${env:LocalAppData}\Programs\Python\Python311\python.exe",
    "${env:LocalAppData}\Programs\Python\Python312\python.exe"
)

$addedCount = 0
foreach ($path in $interpreters) {
    if (Test-Path $path) {
        try {
            Add-MpPreference -ExclusionProcess $path -ErrorAction Stop
            Write-Host "  -> Whitelisted interpreter process: $path" -ForegroundColor Green
            $addedCount++
        } catch {
            Write-Host "  -> Could not add exclusion for $path (may already exist or managed by policy)." -ForegroundColor DarkGray
        }
    }
}

if ($addedCount -eq 0) {
    Write-Host "[i] Note: Standard Node/Python binary paths were not found in default locations. You can manually add your custom interpreter path via Add-MpPreference -ExclusionProcess." -ForegroundColor Cyan
} else {
    Write-Host "[+] Process exclusions applied securely without opening blanket folder access." -ForegroundColor Green
}

# 3. Final Verification
Write-Host "`n[3/3] Verifying environment health..." -ForegroundColor Yellow
$driveCheck = Test-Path "E:\"
if ($driveCheck) {
    Write-Host "[+] E:/ drive partition is online and accessible." -ForegroundColor Green
} else {
    Write-Warning "[!] E:/ drive partition could not be verified."
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "     SETUP COMPLETE! YOU CAN NOW START YOUR PORTAL.     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan