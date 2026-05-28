# Makers Muse 🎨

A full-stack AI-powered digital marketplace for artists and buyers to showcase, explore, and purchase creative artwork.

---

## 🌐 Live Demo

### 🔗 Website

[Makers Muse Live Demo](https://makers-muse.vercel.app)

---

# 📌 Overview

**Makers Muse** is a modern art marketplace platform built for creators and art enthusiasts.
The platform enables artists to upload and manage their artwork while buyers can browse, explore, and interact with creative digital products in a premium and responsive environment.

The project combines scalable backend architecture with a visually rich frontend experience and AI-powered assistance.

---

# ✨ Features

## 👨‍🎨 Artist Features

* Upload and manage artworks
* Cloud-based image storage with Cloudinary
* Role-based authentication
* Secure dashboard access
* Edit and delete uploaded artwork

## 🛍️ Buyer Features

* Explore artworks
* View artwork details
* Responsive and smooth UI experience
* AI-powered chatbot assistance

## 🤖 AI Integration

* Integrated AI chatbot using Gemini 1.5 Flash
* Smart user assistance using Spring AI

## 🔐 Authentication & Security

* JWT-based authentication
* Spring Security integration
* Stateless session management
* Role-based authorization (Artist / Buyer)

## ☁️ Cloud Features

* Cloudinary media storage
* Render backend deployment
* PostgreSQL cloud database
* Vercel frontend hosting

---

# 🛠️ Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios

## Backend

* Spring Boot (Java 17)
* Spring AI
* Spring Security
* JWT Authentication
* Hibernate / Spring Data JPA
* PostgreSQL
* Cloudinary SDK

## Infrastructure & Deployment

* Vercel (Frontend)
* Render (Backend)
* Render PostgreSQL
* Cloudinary

---

# 🧩 System Architecture

```text
React Frontend (Vercel)
        │
        ▼
Spring Boot REST APIs (Render)
        │
 ┌──────┴──────┐
 ▼             ▼
PostgreSQL   Cloudinary
(Render)      (Media Storage)
```

---

# 📷 Project Preview

## Homepage
</br></br>
<img width="1887" height="868" alt="Screenshot 2026-05-28 090645" src="https://github.com/user-attachments/assets/5575bbee-e6ca-4670-b1c2-aae06dcb020d" />
</br>
<img width="1915" height="869" alt="Screenshot 2026-05-28 091326" src="https://github.com/user-attachments/assets/8120c2e8-ccb9-493a-b761-045813c18884" />

<img width="1912" height="865" alt="Screenshot 2026-05-28 091514" src="https://github.com/user-attachments/assets/c33a98a6-e260-46bc-88af-0c5aca45b2d7" />
</br>
<img width="1919" height="861" alt="Screenshot 2026-05-28 093117" src="https://github.com/user-attachments/assets/66b238cb-6aa7-4ea3-a9ac-c1d804005c34" />

</br></br>



## Artist Dashboard & Artwork Showcase
</br></br>

<img width="1891" height="878" alt="Screenshot 2026-05-28 090628" src="https://github.com/user-attachments/assets/a786381d-0b31-4747-8e51-34c2a87f4a15" />
</br>

<img width="1910" height="872" alt="Screenshot 2026-05-28 091910" src="https://github.com/user-attachments/assets/55f18e5e-ccc9-4ef9-b4e7-adf4d0ac03e2" />
</br>
<img width="1913" height="853" alt="Screenshot 2026-05-28 092013" src="https://github.com/user-attachments/assets/8b95c6ba-92d6-48ae-89b8-51614883009d" />
</br></br>

---

# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have the following installed:

* Node.js (v18+)
* Java 17
* Maven
* PostgreSQL (running locally on port 5432)

---

# ⚙️ Local Development Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/makers-muse.git
cd makers-muse
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 🔑 Environment Variables

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Backend `application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/makers_muse
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your_secret_key

# Gemini AI
spring.ai.vertex.ai.gemini.project-id=your_project_id
spring.ai.vertex.ai.gemini.location=your_location

# Cloudinary
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

---

# 🔐 Authentication Flow

```text
User Login/Register
        │
        ▼
JWT Token Generated
        │
        ▼
Frontend Stores Token
        │
        ▼
Protected API Access
```

---

# 📂 Project Structure

```text
makers-muse/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
└── README.md
```

---

# 🌟 Key Highlights

* Full-stack production-ready architecture
* AI-powered assistance integration
* Premium responsive UI design
* Secure authentication system
* Cloud-based image handling
* Scalable REST API structure
* Modern deployment workflow

---

# 📈 Future Enhancements

* Payment gateway integration
* Wishlist functionality
* Real-time chat between buyers and artists
* Order tracking system
* Advanced AI artwork recommendations
* Admin dashboard analytics

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a Pull Request
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

Developed with passion using modern full-stack technologies and AI integration.

### ⭐ If you like this project, give it a star on GitHub!
