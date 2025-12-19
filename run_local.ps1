# Natalie Bakery - Local Start Script

Write-Host "--- Starting Natalie Bakery Local Setup ---" -ForegroundColor Gold

# 1. Backend Setup
Write-Host "`n[1/3] Setting up Backend (Django)..." -ForegroundColor Cyan
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "from seed import seed; seed()"
Start-Process "python" -ArgumentList "manage.py runserver" -NoNewWindow
cd ..

# 2. Frontend Setup
Write-Host "`n[2/3] Setting up Frontend (Next.js)..." -ForegroundColor Cyan
cd frontend
npm install
Start-Process "npm" -ArgumentList "run dev" -NoNewWindow
cd ..

Write-Host "`n[3/3] Success! App is launching..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor White

# Open the browser
Start-Process "http://localhost:3000"
