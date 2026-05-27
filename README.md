# Makers Muse — Art Marketplace

> A production-ready, two-sided art marketplace connecting **Artists** (sellers) and **Customers** (buyers).

## Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | React 18 · Vite · TypeScript · Tailwind CSS v3     |
| Routing     | React Router v6                                     |
| HTTP Client | Axios with JWT interceptor                          |
| Icons       | Lucide React                                        |
| Backend     | Spring Boot 3 (Java 17)                             |
| Security    | Spring Security · Stateless JWT (jjwt 0.12)        |
| Database    | PostgreSQL with Spring Data JPA                     |
| File Store  | AWS S3 SDK v2 (private high-res + public thumbnails)|
| Payments    | Stripe Java SDK (Checkout Sessions + Webhooks)      |
| Thumbnails  | Thumbnailator (server-side compression)             |

---

## Project Structure

```
makers-muse/
├── backend/                    # Spring Boot Maven project
│   ├── pom.xml
│   ├── .env.example
│   └── src/main/
│       ├── java/com/makersmuse/
│       │   ├── config/         # Security, CORS, S3, Stripe configs
│       │   ├── controller/     # Auth, Artwork, Order, Webhook
│       │   ├── dto/            # Request/Response DTOs
│       │   ├── entity/         # JPA Entities (5)
│       │   ├── enums/          # Role, ArtCategory (20), LicenseType, PaymentStatus
│       │   ├── exception/      # Global exception handler (RFC 7807)
│       │   ├── repository/     # Spring Data repositories
│       │   ├── security/       # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       │   └── service/        # S3Service, StripeService, Auth, Artwork, Order
│       └── resources/
│           └── application.yml
└── frontend/                   # Vite + React + TypeScript
    ├── src/
    │   ├── api/                # axiosClient.ts (JWT interceptor)
    │   ├── components/         # Navbar, ArtCard, CategoryFilter, PriceRangeSlider,
    │   │                       #   CartDrawer, ArtUploadForm
    │   ├── context/            # AuthContext, CartContext (with localStorage)
    │   ├── pages/              # Home, Gallery, ArtworkDetail, ArtistDashboard,
    │   │                       #   Login, Register, OrderSuccess
    │   ├── services/           # authService, artworkService, orderService
    │   └── types/              # Shared TypeScript types + 20 art categories
    └── index.html
```

---

## Quick Start

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+, npm 9+
- PostgreSQL 14+
- AWS account (or MinIO for local dev)
- Stripe account (test mode)

### 1. Database
```sql
CREATE DATABASE makersmuse;
```

### 2. Backend
```bash
cd backend

# Copy env template and fill in your values
cp .env.example .env

# Export env vars (PowerShell)
$env:DB_URL = "jdbc:postgresql://localhost:5432/makersmuse"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "yourpassword"
$env:JWT_SECRET = "$(openssl rand -base64 32)"
$env:AWS_REGION = "us-east-1"
$env:AWS_ACCESS_KEY_ID = "..."
$env:AWS_SECRET_ACCESS_KEY = "..."
$env:AWS_S3_PUBLIC_BUCKET = "makersmuse-thumbnails-public"
$env:AWS_S3_PRIVATE_BUCKET = "makersmuse-highres-private"
$env:STRIPE_API_KEY = "sk_test_..."
$env:STRIPE_WEBHOOK_SECRET = "whsec_..."

mvn spring-boot:run
# Starts on http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Opens http://localhost:5173
```

### 4. Stripe Webhook (local dev)
```bash
stripe listen --forward-to localhost:8080/api/webhook/stripe
```

---

## API Endpoints

### Auth
| Method | Path               | Auth    | Description        |
|--------|--------------------|---------|--------------------|
| POST   | /api/auth/register | Public  | Register user      |
| POST   | /api/auth/login    | Public  | Login, get JWT     |

### Artworks
| Method | Path                  | Auth          | Description                |
|--------|-----------------------|---------------|----------------------------|
| GET    | /api/artworks         | Public        | Search with filters        |
| GET    | /api/artworks/{id}    | Public        | Get artwork details        |
| GET    | /api/artworks/my      | ROLE_ARTIST   | Artist's own artworks      |
| POST   | /api/artworks         | ROLE_ARTIST   | Upload artwork (multipart) |
| DELETE | /api/artworks/{id}    | ROLE_ARTIST   | Soft-delete artwork        |

### Orders
| Method | Path                              | Auth           | Description                    |
|--------|-----------------------------------|----------------|--------------------------------|
| POST   | /api/orders/checkout              | ROLE_CUSTOMER  | Create Stripe Checkout Session |
| GET    | /api/orders/my                    | ROLE_CUSTOMER  | List my orders                 |
| GET    | /api/orders/{id}/download/{item}  | ROLE_CUSTOMER  | Get presigned download URL     |

### Webhooks
| Method | Path                  | Auth   | Description           |
|--------|-----------------------|--------|-----------------------|
| POST   | /api/webhook/stripe   | Public | Stripe event handler  |

---

## Art Categories (All 20)

`OIL_PAINTING` · `WATERCOLOR` · `DIGITAL_ILLUSTRATION` · `THREE_D_RENDER` · `ABSTRACT_ART` ·
`PHOTOGRAPHY` · `PIXEL_ART` · `POP_ART` · `SCULPTURE_CERAMICS` · `TYPOGRAPHY_CALLIGRAPHY` ·
`CONCEPT_ART` · `VECTOR_GRAPHICS` · `MINIMALIST_ART` · `ANIME_MANGA` · `CYBERPUNK_SCIFI` ·
`FANTASY_ART` · `STREET_ART_GRAFFITI` · `AI_GENERATED_ART` · `TEXTURES_PATTERNS` · `MIXED_MEDIA`

---

## Security Notes

- **JWT**: Use a strong 256-bit base64 secret in production. Rotate periodically.
- **S3**: Public bucket should have ACL enabled. Private bucket must be fully private.
- **Stripe Webhooks**: Always verify `Stripe-Signature` header (already implemented).
- **CORS**: Set `CORS_ALLOWED_ORIGINS` to your production domain only.
- **Passwords**: BCrypt with strength 12 (adjust for hardware).

---

## Production Deployment Notes

1. Change `ddl-auto: update` → `validate` and use Flyway/Liquibase migrations
2. Set `show-sql: false` in `application.yml`
3. Use a secrets manager (AWS Secrets Manager, Vault) instead of raw env vars
4. Enable HTTPS (TLS termination at load balancer or via Caddy/nginx)
5. Configure CloudFront in front of your public S3 bucket for CDN caching
