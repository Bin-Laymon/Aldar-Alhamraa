diff --git a/README.md b/README.md
index 8f5039e27b061f4c7c39f6b2d26823df8cdff1c8..0bddc7604ffe7ec13233f9c4b32f39c3abe988d1 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,183 @@
-# Aldar-Alhamraa
-Online Creative Book Shop
+# Al Dar Al Hamraa (الدار الحمراء) — MVP
+
+Production-minded digital storytelling marketplace where writers sell designed PDF stories and readers purchase secure, watermarked downloads.
+
+## 1) Architecture Decisions (Step-by-step)
+
+1. **Backend-first, modular Express architecture**
+   - Chosen for fast MVP delivery and clean separation (`controllers`, `routes`, `services`, `middleware`, `models`, `utils`).
+2. **PostgreSQL with SQL migrations**
+   - Explicit schema keeps control over finance-related models (commissions, payouts, transactions).
+3. **JWT auth + RBAC**
+   - Lightweight and API-friendly for Reader / Writer / Admin role-based flows.
+4. **Local private storage with S3-ready abstraction**
+   - Files are stored outside public web root in `storage/` and accessed via service layer to ease S3 migration.
+5. **Mockable Stripe payments**
+   - `PAYMENT_MODE=mock` enables local MVP operation; switch to Stripe live by env only.
+6. **Secure download design**
+   - Expiring JWT download links + max 3 downloads/order + watermark generation per buyer.
+7. **Minimal bilingual UI**
+   - Dark theme + red accent + RTL/LTR toggling for Arabic/English.
+
+---
+
+## 2) Tech Stack
+
+- **Backend:** Node.js + Express
+- **Database:** PostgreSQL
+- **Auth:** JWT + bcrypt
+- **Payments:** Stripe (mock/live mode)
+- **PDF:** `pdf-lib` watermarking
+- **Uploads:** Multer
+- **Security:** Helmet, rate limiting, protected storage paths
+
+---
+
+## 3) Project Structure
+
+```text
+.
+├── database
+│   ├── migrations
+│   │   └── 001_init.sql
+│   └── seeds
+│       └── 001_seed.sql
+├── public
+│   ├── app.js
+│   ├── index.html
+│   └── styles.css
+├── src
+│   ├── config
+│   ├── controllers
+│   ├── middleware
+│   ├── models
+│   ├── routes
+│   ├── scripts
+│   ├── services
+│   ├── utils
+│   ├── app.js
+│   └── server.js
+├── storage
+│   ├── covers
+│   ├── downloads
+│   └── stories
+└── .env.example
+```
+
+---
+
+## 4) Database Models
+
+- `users` (Admin/Writer/Reader + suspension)
+- `stories` (metadata, pricing, status, featured, popularity)
+- `orders` (purchase + commission split + download count)
+- `transactions` (payment records)
+- `commissions` (admin-managed commission settings)
+- `payouts` (writer payout lifecycle)
+- `reviews` (bonus rating/comments)
+
+---
+
+## 5) API Overview
+
+### Auth
+- `POST /api/auth/register`
+- `POST /api/auth/login`
+
+### Stories
+- `GET /api/stories` (filter: category, maxPrice, sort)
+- `GET /api/stories/:id`
+- `POST /api/stories/writer` (writer upload PDF + cover)
+- `PATCH /api/stories/writer/:id`
+- `DELETE /api/stories/writer/:id`
+- `GET /api/stories/writer/mine/all`
+- `POST /api/stories/:id/reviews`
+
+### Orders & Downloads
+- `POST /api/orders/purchase`
+- `GET /api/orders/mine`
+- `POST /api/orders/:orderId/download-link`
+- `GET /api/orders/download/:token`
+
+### Writer
+- `GET /api/writer/dashboard`
+
+### Admin
+- `GET /api/admin/summary`
+- `PATCH /api/admin/stories/:id/moderate`
+- `POST /api/admin/commission`
+- `GET /api/admin/users`
+- `PATCH /api/admin/users/:id/suspend`
+- `PATCH /api/admin/payouts/:id/approve`
+
+---
+
+## 6) Local Setup
+
+1. **Install dependencies**
+   ```bash
+   npm install
+   ```
+2. **Create env file**
+   ```bash
+   cp .env.example .env
+   ```
+3. **Create PostgreSQL DB** (example)
+   ```sql
+   CREATE DATABASE aldar_alhamraa;
+   ```
+4. **Run migrations and seed**
+   ```bash
+   npm run db:migrate
+   npm run db:seed
+   ```
+5. **Start app**
+   ```bash
+   npm run dev
+   ```
+   (uses Node.js built-in watch mode, so no global `nodemon` is required)
+6. Open: `http://localhost:4000`
+
+Seed users (password for all: `Password123!`):
+- admin@aldar.com (admin)
+- writer@aldar.com (writer)
+- reader@aldar.com (reader)
+
+---
+
+## 7) Security Notes
+
+- Files stored under `storage/`, not publicly accessible.
+- Download links are signed + expiring.
+- Max `3` downloads per purchase (`MAX_DOWNLOADS_PER_PURCHASE`).
+- JWT auth enforced on sensitive routes.
+- Rate limiting + Helmet headers enabled.
+
+---
+
+## 8) Deploy Guide (Production-minded MVP)
+
+1. Deploy API server on Render/Railway/Fly/EC2.
+2. Use managed PostgreSQL (Neon/Supabase/RDS).
+3. Set strong env secrets (`JWT_SECRET`, `DOWNLOAD_TOKEN_SECRET`).
+4. Use Stripe live keys and webhook validation.
+5. Move storage service implementation from local FS to S3 bucket.
+6. Put reverse proxy (Nginx) and HTTPS in front of app.
+7. Add centralized logs and monitoring.
+
+---
+
+## 9) Future Enhancements
+
+- Stripe webhook-based async payment confirmations.
+- S3 pre-signed URLs and background watermark jobs.
+- Advanced analytics dashboard.
+- Search, tags, and recommendation engine.
+- Automated payout batching.
+
+
+### Troubleshooting in restricted environments
+
+If `npm install` fails with `403 Forbidden` against `registry.npmjs.org`, your environment likely blocks outbound npm access. In that case:
+- run the project in an environment with npm registry access, or
+- configure your approved internal registry mirror before installing dependencies.
