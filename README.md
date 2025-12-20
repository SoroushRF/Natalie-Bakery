
# 🧁 Natalie Bakery

<p align="center">
  <strong>Artisan Persian Delights • Elegant E-Commerce • Bespoke Celebrations</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.dot.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Django-5.0+-092E20?style=for-the-badge&logo=django" alt="Django" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## ✨ Overview

**Natalie Bakery** is a high-end, full-stack e-commerce platform meticulously crafted for luxury retail and custom celebratory cake orders. Inspired by the rich traditions of Persian baking, the application merges a sophisticated "Persian Luxury" aesthetic with robust business logic to provide a seamless, premium shopping experience.

### 🎨 Design Philosophy
The UI is defined by a curated palette that evokes elegance and warmth:
*   **Cream** (`#F5F5DC`) - For a soft, inviting canvas.
*   **Gold** (`#D4AF37`) - Representing the artisan quality of the products.
*   **Charcoal** (`#333333`) - Providing modern contrast and readability.

---

## 🌟 Key Features

-   **🛍️ Luxury Shopping Bag**: A persistent, high-performance cart powered by **Zustand** and synchronized with LocalStorage for a frictionless checkout flow.
-   **🎂 Custom Cake Orchestrator**: A specialized interface allowing users to personalize flavors, fillings, and sizes for artisan cakes.
-   **📅 Smart Lead-Time Validation**: Intelligent business logic that enforces a **3-day minimum lead time** for custom orders, ensuring quality control for the bakers.
-   **📱 Mobile-First Excellence**: Fully responsive design that maintains a premium "boutique" feel across all screen sizes.
-   **🔐 Administrative Suite**: A comprehensive dashboard for managing the luxury menu, inventory categories, and tracking customer orders.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Framework**: Django 5 + Django REST Framework (DRF)
- **Database**: PostgreSQL (Production) / SQLite (Dev)
- **Containerization**: Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SoroushRF/Natalie-Bakery.git
cd Natalie-Bakery
```

### 2. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "from seed import seed; seed()"  # Seed the luxury menu
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🐳 Docker Deployment

For a streamlined production-ready environment:

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```text
Natalie-Bakery/
├── backend/            # Django REST Framework API
│   ├── api/            # Business logic & Endpoints
│   ├── core/           # Project settings
│   └── seed.py         # Initial luxury data populator
├── frontend/           # Next.js 14 Application
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # Atomic UI components
│   │   ├── store/      # Zustand state management
│   │   └── utils/      # Helpers & Validations
├── docker-compose.yml  # Multi-container orchestration
└── run_local.ps1       # Automated local startup script
```

---

## 📜 License

Demo project for **Natalie Bakery**. All rights reserved. Built by [SoroushRF](https://github.com/SoroushRF).
