# 💰 Personal Finance Tracker (Backend)

## 📖 Introduction

The **Personal Finance Tracker** is a backend-driven web application built using **Node.js, Express, and PostgreSQL**. It enables users to efficiently manage their finances by tracking income, expenses, and budgets, while also providing insightful reports and analytics.

This project was developed as part of a backend engineering assignment, with a strong emphasis on **API design, data integrity, scalability, and clean architecture**.

---

## 🎯 Features

### 🔐 Authentication & User Management

* User registration & login (JWT-based authentication)
* Secure password hashing
* Google OAuth login integration
* User profile management

---

### 💸 Transaction Management

* Add, edit, delete transactions
* Supports:

  * Income & expense tracking
  * Negative values (refunds)
  * Decimal precision for accurate calculations
* Each transaction includes:

  * Amount
  * Category
  * Date
  * Description

---

### 📂 Categories & Budgeting

* Create and manage expense categories
* Set budgets per category
* Track real-time budget usage
* Alerts for budget overruns

---

### 📊 Dashboard & Reports

* Financial overview:

  * Total income
  * Total expenses
  * Savings
* Monthly reports
* Income vs Expense comparisons
* Category-wise spending breakdown

---

### 🧾 Receipt Upload

* Upload receipts for transactions
* Store and retrieve receipt files
* Link receipts to transactions

---

### 💱 Multi-Currency Support

* Transactions in multiple currencies
* User-preferred currency selection
* Currency-aware reporting

---

### 📧 Notifications

* Email alerts for:

  * Budget exceeded
  * Important financial updates
* Integrated with SendGrid (or similar service)

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT, Google OAuth
* **File Handling:** Multer / Cloud Storage
* **Email Service:** SendGrid
* **Deployment:** Render / AWS / DigitalOcean

---

## 📁 Project Structure

```
project-root/
│
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── middleware/      # Auth & validation middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── config/          # DB & app configuration
│
├── uploads/             # Receipt storage
├── migrations/          # Database migrations
├── .env                 # Environment variables
├── app.js               # Express app setup
└── server.js            # Entry point
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SENDGRID_API_KEY=your_sendgrid_api_key
```

---

### 4. Run Database Migrations

```
npm run migrate
```

---

### 5. Start the Server

```
npm run dev
```

Server will run at:

```
http://localhost:5000
```

---

## 🔌 API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

### Transactions

```
POST   /api/transactions
GET    /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Categories & Budgets

```
POST   /api/categories
DELETE /api/categories/:id
POST   /api/budgets
GET    /api/budgets
```

### Reports

```
GET /api/reports/monthly
GET /api/reports/summary
```

---

## 🧪 Testing

* Tested using Postman / Thunder Client
* Covers:

  * Authentication flows
  * CRUD operations
  * Edge cases (invalid inputs, authorization errors)
  * Financial accuracy

---

## ⚠️ Key Challenges

* Handling floating-point precision for financial data
* Managing relational constraints (e.g., deleting categories with transactions)
* Designing scalable schema for multi-currency support
* Implementing secure OAuth authentication

---

## 🚀 Deployment

The application is deployed on a cloud platform.

* **Live URL: finance-tracker-api-7w45.onrender.com/index.html

---

## 🔮 Future Enhancements

* AI-powered financial insights
* Bank statement import (CSV/PDF parsing)
* Automatic categorization of transactions
* Spending anomaly detection
* Advanced analytics dashboard

---



## 👨‍💻 Author

Aryaman Jyoti Chaliha

---
