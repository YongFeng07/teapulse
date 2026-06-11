# 🚀 TeaPulse — Setup Guide

## Why menu/locations show empty
The database needs to be set up. Run these commands once:

```
npm run db:push    ← creates all tables
npm run db:seed    ← fills with sample data
```

---

## Full setup (step by step)

### 1. Install Node.js
Download from https://nodejs.org — pick LTS version

### 2. Open the project folder
In VS Code → File → Open Folder → select `teapulse-unified`

Open Terminal (Ctrl + `)

### 3. Create .env.local file
Create a new file called `.env.local` in the teapulse-unified folder:

```
DATABASE_URL="postgresql://neondb_owner:npg_61avCSIdmEnk@ep-restless-boat-aoahphcl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="teapulse-secret-change-this-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run each command separately

```
npm install
```
Wait for it to finish (2-3 mins first time)

```
npm run db:push
```
Creates database tables (you'll see "Your database is now in sync")

```
npm run db:seed
```
Adds sample drinks, stores, reviews (you'll see "Done! Login: demo@teapulse.com")

```
npm run dev
```
Starts the server

### 5. Open in browser
Go to: http://localhost:3000

---

## Login accounts
| Role  | Email | Password |
|-------|-------|----------|
| Demo user | demo@teapulse.com | password123 |
| Admin | admin@teapulse.com | admin123 |

---

## Troubleshooting

**"Could not read package.json"**
→ You're in the wrong folder. Type: `cd teapulse-unified`

**Register says "Registration failed"**  
→ Run `npm run db:push` first

**Menu shows empty / No drinks found**  
→ Run `npm run db:seed`

**Images not loading**  
→ Normal — images come from Pexels CDN, need internet

**Port 3000 already in use**
→ Stop other servers or use: `npm run dev -- --port 3001`
