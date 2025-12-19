# Natalie Bakery 🧁✨

A high-end, full-stack Persian bakery e-commerce platform designed for luxury retail and custom celebratory cake orders. Built with a sophisticated aesthetic and robust business logic.

---

## 🏛️ Architecture & Tech Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (State Management).
- **Backend**: [Django 5](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/).
- **Database**: PostgreSQL (Production) / SQLite (Local/Development).
- **Design**: "Persian Luxury" theme using Cream (`#F5F5DC`), Gold (`#D4AF37`), and Charcoal (`#333333`) tones.

---

## 🌟 Key Features

- **Luxury Shopping Bag**: Persistent cart using Zustand and LocalStorage.
- **Custom Cake Orchestration**: Users can select flavors, fillings, and sizes for artisan cakes.
- **Smart Lead-Time Validation**: Custom cakes automatically enforce a **3-day minimum lead time** from the current date during checkout.
- **Mobile-First Design**: Fully responsive across all devices, ensuring a premium experience for mobile shoppers.
- **Admin Dashboard**: Comprehensive management of products, categories, and customer orders.

---

## 🚀 Local Installation

### 1. Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### 2. Backend Setup (Django)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "from seed import seed; seed()"  # Seed luxury menu data
python manage.py runserver
```

### 3. Frontend Setup (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

The application will be available at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Browser**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Admin Panel**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 🛠️ Deployment Configuration

The project includes a `docker-compose.yml` and `Dockerfile` for easy containerization. Simply run:

```bash
docker-compose up --build
```

---

## 📜 License

Demo project for Natalie Bakery. All rights reserved.
