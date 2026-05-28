# Makers Muse 🎨

Makers Muse is a premium, two-sided art marketplace connecting talented artists with art collectors and enthusiasts. It provides a platform for artists to showcase their portfolios, sell original physical artworks, and offer digital licenses, while giving buyers a seamless, curated shopping experience.

![Makers Muse Gallery](frontend/public/hero-gallery.png)

## 🌟 Key Features

### For Artists
*   **Artist Dashboard**: Dedicated portal to manage portfolios, track sales, and monitor earnings.
*   **Artwork Management**: Upload high-resolution artworks with automatic thumbnail generation.
*   **Flexible Licensing**: Sell physical originals or offer digital usage licenses.
*   **Cloud Storage**: Permanent, secure image hosting via Cloudinary.

### For Buyers
*   **Curated Gallery**: Browse artworks by category (Watercolor, Portrait, Photography, etc.) with advanced filtering.
*   **Shopping Cart & Checkout**: Seamless purchasing flow for both physical and digital art.
*   **Order Tracking**: Dedicated buyer dashboard to view past purchases and download digital assets.
*   **Reviews & Ratings**: Leave feedback on purchased artworks to help the community.

## 💻 Technology Stack

### Frontend
*   **React (Vite)**: Lightning-fast frontend build tool and library.
*   **Tailwind CSS**: Utility-first CSS framework for a premium, responsive, and custom-styled UI.
*   **React Router**: Client-side routing for smooth, SPA navigation.
*   **Axios**: Promise-based HTTP client for API interactions.

### Backend
*   **Spring Boot (Java 17)**: Robust backend framework for RESTful APIs.
*   **Spring Security & JWT**: Stateless, token-based authentication and role-based access control (Artist vs. Buyer).
*   **PostgreSQL**: Relational database for structured, transactional data storage.
*   **Hibernate / Spring Data JPA**: Object-Relational Mapping (ORM) for efficient database interactions.
*   **Cloudinary SDK**: Integrated cloud storage for high-performance image delivery and transformation.

### Infrastructure & Deployment
*   **Frontend Hosting**: Vercel
*   **Backend Hosting**: Render
*   **Database**: Render PostgreSQL
*   **Media Storage**: Cloudinary

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+)
*   Java 17
*   Maven
*   PostgreSQL running locally (port 5432)

### 1. Database Setup
Create a local PostgreSQL database named `makersmuse`:
```sql
CREATE DATABASE makersmuse;
```

### 2. Backend Setup
Navigate to the backend directory and configure your environment:
```bash
cd backend
```
Create a `.env` file in the `backend` root and add your credentials:
```env
DB_URL=jdbc:postgresql://localhost:5432/makersmuse
DB_USERNAME=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_that_is_long_enough

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the Spring Boot application:
```bash
mvn spring-boot:run
```
*The backend will start on `http://localhost:8080`.*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

## 🔒 Authentication Roles
The platform utilizes two primary roles:
1.  `ROLE_ARTIST`: Can upload art, manage their portfolio, and view sales.
2.  `ROLE_CUSTOMER`: Can browse, purchase art, leave reviews, and download digital assets.

---
*Built with ❤️ for the creative community.*
