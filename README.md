# **README.md — Courtify (GC3 Final Project)**

**Courtify — "Book. Play. Repeat."**
A sports facility booking platform that allows users to browse courts, check availability, and manage reservations easily and securely.
Built as part of **GC3 Final Integration Project**.

---

# 📘 **1. Business Concept Summary**

Courtify solves a common frustration among players: **finding and reserving courts without hassle**. Many facilities still rely on walk-ins, text messages, or uncoordinated Facebook pages — leading to double bookings, delays, and confusion. Courtify provides a **centralized, real-time booking platform** designed specifically for the Philippine market.

### **Key Value Points**

* Verified real-time availability across partnered facilities
* Instant booking confirmation
* Mobile-friendly interface
* Local payment gateways (GCash, PayMaya)
* Smart filtering (court type, distance, indoor/outdoor, rating)
* Vendor dashboard for facility owners


---

# 🛠 **2. Tech Stack**

## **Frontend**

* HTML, CSS, JavaScript
* Deployed via Vercel / Netlify (static hosting)

## **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose ORM)
* Multer (image upload)
* JWT (authentication)
* CORS
* Deployed on Render / Railway

---

# 📂 **3. Folder Structure**

### **Frontend**

```
/
  index.html
  style.css
  server.js
  package.json
```

### **Backend**

```
/controllers
/middleware
/models
/routes
package.json
package-lock.json
README.md
```

---

# ⚙️ **4. Setup & Run Instructions**

## **Frontend (Local)**

```bash
cd frontend
open index.html
```

## **Frontend (Deploy)**

1. Push repo to GitHub
2. Deploy on Vercel:

   * "Add New Project"
   * Select repo
   * Build: none
   * Output: `/`
3. Done.

link: gc-3frontend.vercel.app 
   
---

## **Backend (Local)**

Create `.env`:

```
MONGODB_URI=yourCluster
JWT_SECRET=yourSecret
PORT=5000
```

Install + run:

```bash
cd backend
npm install
npm start
```

## **Backend (Deploy on Render)**

1. Connect GitHub repo
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables
5. Deploy

link: https://gc3backend.onrender.com 

---

# 🧵 **5. API Documentation**

## **Auth**

### **POST /api/auth/signup**

Creates a new user.

### **POST /api/auth/login**

Returns token + user info.

---

## **Places**

### **POST /api/places**

(Create place — requires image upload)

### **GET /api/places/:id**

(Get single place)

### **GET /api/places/user/:uid**

(Get all places created by a user)

### **PATCH /api/places/:id**

(Update place)

### **DELETE /api/places/:id**

(Delete place)

---

# 🎯 **6. Implemented Features (Aligned with GC1 → GC3 Roadmap)**

* User signup/login
* Secure token-based authentication
* Add / view / update / delete sports facilities
* Image upload via Multer
* MongoDB data persistence
* Basic frontend interface for booking flow
* Connected frontend ↔ backend API

---

# 📈 **7. Before / After Performance Improvements**

| Before                                   | After                              |
| ---------------------------------------- | ---------------------------------- |
| Server crashed due to bcrypt hook errors | Cleaned auth flow + stable hashing |
| Uploads folder bloated repo              | Implemented `.gitignore` rule      |
| No deployment pipeline                   | Fully deployed backend + frontend  |
| CORS blocking frontend                   | Proper CORS middleware configured  |

---

# ⚠️ **8. Known Issues & Limitations**

* No real-time concurrency booking logic yet
* No payment gateway integration implemented
* Static frontend (not a full framework UI)
* Vendor dashboard basic
* Limited user roles (admin/vendor split optional)

---

# 🗄 **9. Database Export / Seed Script**

(Optional)
A seed script can be added if needed.
Currently, users and places must be added manually.


---

# 🌐 **10. Deployment Links**

(To be filled once you deploy)

**Frontend:**
`https://<your-frontend>.vercel.app`

**Backend:**
`https://<your-backend>.onrender.com`

---

# ✔️ **11. GitHub Repositories**

Frontend: [https://github.com/ongbianca/GC3frontend](https://github.com/ongbianca/GC3frontend)
Backend: [https://github.com/ongbianca/GC3backend](https://github.com/ongbianca/GC3backend)
