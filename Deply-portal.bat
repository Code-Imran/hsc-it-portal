@echo off
setlocal enabledelayedexpansion

echo ============================================
echo         IT Portal - GitHub Deploy
echo ============================================
echo.

:: 1. Navigate to script directory
cd /d "%~dp0"

:: 2. Check if .git folder exists
if not exist ".git" (
    echo [ERROR] Not inside a Git repository root.
    pause
    exit /b 1
)

:: 3. Clear any stuck git lock files
if exist ".git\index.lock" (
    del /f ".git\index.lock"
)

:: 4. Detect current branch
set "BRANCH=main"
for /f "delims=" %%b in ('git branch --show-current') do (
    set "BRANCH=%%b"
)
echo Active Branch: %BRANCH%
echo.

:: 5. Stage, Commit, and Push
echo [1/3] Staging all files...
git add -A

echo [2/3] Committing changes...
set /p COMMIT_MSG="Enter commit message (or press ENTER for default): "
if "%COMMIT_MSG%"=="" (
    set "COMMIT_MSG=IT Portal update %date%"
)
git commit -m "%COMMIT_MSG%"

echo [3/3] Pushing to GitHub...
git push origin %BRANCH%
if errorlevel 1 (
    git push -u origin %BRANCH%
)

echo.
echo ============================================
echo Push Complete! 
echo Cloudflare will auto-deploy your changes shortly at:
echo https://it-portal.imranshaikh.workers.dev
echo ============================================
echo.
pause