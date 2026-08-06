# BookMyLocalService

BookMyLocalService is a full-stack local services marketplace that connects customers with trusted service providers. Users can browse services, book appointments, make secure payments, and track bookings through a modern and responsive web application.

🌐 **Live Demo:** https://bookmylocalservice-web.onrender.com/

---

## Features

### Customer
- Browse and search local services
- Book appointments
- Secure online payments with Razorpay
- Track booking status
- Manage profile and bookings

### Provider
- Provider dashboard
- Manage services
- Handle customer bookings
- Track earnings
- Manage availability

### Admin
- Manage customers and providers
- Monitor bookings
- Manage payments
- View reports and analytics

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- PostgreSQL (Neon)

### Integrations
- Razorpay
- Cloudinary
- Nodemailer
- JWT Authentication

---

## Installation

Clone the repository

```bash
git clone https://github.com/koushik369mondal/BookMyLocalService.git
cd BookMyLocalService
```

Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

Run the project

```bash
# Frontend
npm run dev

# Backend
npm run dev
```

---

## Environment Variables

Create a `.env` file in the server folder and configure:

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Frontend `.env`

```env
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
```

---

## Future Improvements

- Real-time booking updates
- Live notifications
- Customer-provider chat
- AI-based service recommendations
- Mobile application

---

## Author

**Kaushik Mandal**

GitHub: https://github.com/koushik369mondal
