# Library Management System – Backend API

A Node.js + Express REST API that powers a library’s core operations: cataloguing authors and books, tracking loans, and managing patrons – all secured with email‑verified sign‑ups and strict role‑based access control.

---

## ✨ Key Features

| Domain             | What you can do                                                     | Roles permitted                |
| ------------------ | ------------------------------------------------------------------- | ------------------------------ |
| **Authentication** | • Email‑verified signup  <br>• JWT login  <br>• Refresh‑token ready | Everyone                       |
| **Authors**        | CRUD authors                                                        | `librarian`, `admin`           |
| **Books**          | CRUD books  <br>Attach author & category                            | `librarian`, `admin`           |
| **Categories**     | CRUD categories                                                     | `librarian`, `admin`           |
| **Borrowers**      | CRUD patrons / members                                              | `librarian`, `admin`           |
| **Loans**          | • Issue / return book  <br>• Due‑date tracking                      | `librarian`, `admin`           |
| **Catalog Browse** | List & filter authors, books, categories                            | `member` + authenticated roles |

---

## 🚀 Tech Stack

* **Runtime:** Node.js 18 +
* **Framework:** Express 4
* **DB:** MongoDB (Mongoose ODM)
* **Auth:** JWT (+ refresh ready), bcrypt, email verification
* **Mail:** nodemailer + nodemailer‑express‑handlebars
* **Dev tools:** ESLint, Nodemon

---

## 📦 Getting Started

```bash
git clone https://github.com/<your‑org>/library‑management‑system.git
cd library‑management‑system
npm install
cp .env.example .env    # then fill in your own values
npm run dev             # nodemon index.js
```

### Required Environment Variables

| Key                       | Example                                                | Purpose                      |
| ------------------------- | ------------------------------------------------------ | ---------------------------- |
| `PORT`                    | 5000                                                   | Server port                  |
| `MONGO_URI`               | mongodb://localhost:27017/library                      | Mongo connection             |
| `JWT_SECRET`              | super‑long‑jwt‑secret                                  | Signs session tokens         |
| `JWT_EXPIRE`              | 1h                                                     | Token TTL                    |
| `EMAIL_TOKEN_SECRET`      | super‑long‑random‑string                               | Signs verification links     |
| `CLIENT_URL`              | [http://localhost:5000](http://localhost:5000)         | Base used inside email links |
| `SMTP_HOST`/`SMTP_PORT`   | smtp.gmail.com / 587                                   | Mail server                  |
| `SMTP_USER` / `SMTP_PASS` | [user@example.com](mailto:user@example.com) / \*\*\*\* | Auth for SMTP                |

> **Tip:** Generate secrets on mac/linux with `openssl rand -hex 32` or in Node with `crypto.randomBytes(32).toString('hex')`.

---

## 🛣️ API Reference (Core Routes)

### Auth

| Method & Route                 | Body                              | Role           | Notes                                                              |
| ------------------------------ | --------------------------------- | -------------- | ------------------------------------------------------------------ |
| `POST /api/auth/signup`        | `{ name, email, password, role }` | ⬚              | Sends verification e‑mail – user **not** stored until link clicked |
| `GET  /api/auth/verify/:token` | –                                 | ⬚              | Creates user → `isVerified:true`                                   |
| `POST /api/auth/login`         | `{ email, password }`             | Verified users | Returns JWT                                                        |

### Library Resources

| Entity     | Base path         | Read (member)      | Write (librarian/admin)     |
| ---------- | ----------------- | ------------------ | --------------------------- |
| Authors    | `/api/authors`    | `GET /` `GET /:id` | `POST` `PUT` `DELETE`     |
| Books      | `/api/books`      | `GET /` `GET /:id` | `POST` `PUT` `DELETE`     |
| Categories | `/api/categories` | `GET /` `GET /:id` | `POST` `PUT` `DELETE`     |
| Borrowers  | `/api/borrowers`  | –                  | full CRUD                   |
| Loans      | `/api/loans`      | `GET /`            | `POST issue` `PATCH return` |

> Full swagger / Postman collection lives in `/docs` (import into Postman for quick testing).

---

## 🔐 Role Matrix

| Operation                    | admin | librarian | member |
| ---------------------------- | ----- | --------- | ------ |
| View books & authors         | ✅     | ✅         | ✅      |
| Create / edit / delete books | ✅     | ✅         | ❌      |
| Manage loans                 | ✅     | ✅         | ❌      |
| Manage users & roles         | ✅     | ❌         | ❌      |

---

## 🖥️ Project Structure

```
src/
├─ config/          # DB, mail, auth secrets
├─ controllers/     # route handlers
├─ models/          # Mongoose schemes
├─ routes/          # express.Router modules
├─ middlewares/     # auth, roleGuard, errorHandler
├─ views/emails/    # Handlebars templates
└─ utils/           # helpers
```

---

## 🛠️ Scripts

| Command         | Purpose                       |
| --------------- | ----------------------------- |
| `npm run dev`   | Start dev server with nodemon |
| `npm test`      | Run Mocha & Chai test suite   |
| `npm run lint`  | ESLint                        |
| `npm run build` | Compile (if using TS)         |

---

## 🤝 Contributing

PRs are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/awesome`)
3. Commit your changes (`git commit -m 'feat: add awesome feature'`)
4. Push to the branch (`git push origin feat/awesome`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
