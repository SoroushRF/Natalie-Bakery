# Natalie Bakery - Local Start Script

Write-Host "--- Starting Natalie Bakery Local Setup ---" -ForegroundColor Yellow

# 1. Backend Setup
Write-Host "`n[1/3] Setting up Backend (Django)..." -ForegroundColor Cyan
Set-Location backend

# Select the best Python version (3.14 is currently broken with Django Admin)
$pythonPath = "python"
if (Test-Path "C:\Users\sorou\AppData\Local\Programs\Python\Python311\python.exe") {
    $pythonPath = "C:\Users\sorou\AppData\Local\Programs\Python\Python311\python.exe"
    Write-Host "Using Python 3.11 (Stable)..." -ForegroundColor Gray
}

# If venv exists but is the wrong version, or doesn't exist, recreate it
if (Test-Path venv) {
    $currentVenvVersion = & ".\venv\Scripts\python.exe" --version 2>&1
    if ($currentVenvVersion -match "3.14") {
        Write-Host "Detected Python 3.14 venv. Recreating with stable 3.11 to fix Admin Panel crashes..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force venv
    }
}

if (-not (Test-Path venv)) {
    Write-Host "Creating Virtual Environment..." -ForegroundColor Gray
    & $pythonPath -m venv venv
}

Write-Host "Installing Dependencies & Migrating..." -ForegroundColor Gray
.\venv\Scripts\Activate.ps1
python -m pip install -q -r requirements.txt
python manage.py migrate
python manage.py shell -c "from seed import seed; seed()"

# Start Django in a NEW window so it stays alive and you can see errors
Write-Host "Launching Django Server in new window..." -ForegroundColor Gray
Start-Process "powershell.exe" -ArgumentList "-NoExit -Command `".\venv\Scripts\Activate.ps1; python manage.py runserver 127.0.0.1:8000`""
Set-Location ..

# 2. Frontend Setup
Write-Host "`n[2/3] Setting up Frontend (Next.js)..." -ForegroundColor Cyan
Set-Location frontend

Write-Host "Installing NPM Packages..." -ForegroundColor Gray
npm install --quiet

# Start Next.js in a NEW window
Write-Host "Launching Next.js Dev Server in new window..." -ForegroundColor Gray
Start-Process "powershell.exe" -ArgumentList "-NoExit -Command `"npm run dev`""
Set-Location ..

Write-Host "`n[3/3] Success! App is launching..." -ForegroundColor Green
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor White
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "NOTE: If the site doesn't load immediately, wait a few seconds for the new windows to finish starting up." -ForegroundColor Yellow

# Open the browser
Start-Process "http://localhost:3000"
