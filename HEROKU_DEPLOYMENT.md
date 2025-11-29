# 🚀 Heroku Deployment Guide - Hotel Booking Management System

## 📋 Prerequisites

### ✅ Already Done:
- [x] Backend JAR built: `target/hotel-booking-system-0.0.1-SNAPSHOT.jar`
- [x] Frontend built: `frontend/build`
- [x] JWT Secret generated: `cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c=`
- [x] Procfile created (with correct PORT configuration)
- [x] system.properties created (Java 17 specified)
- [x] Code pushed to GitHub

### 📥 Install Heroku CLI:

**Windows:**
1. Download: https://cli-assets.heroku.com/heroku-x64.exe
2. Run the installer
3. Restart PowerShell
4. Verify: `heroku --version`

---

## 🚀 Step-by-Step Deployment

### Step 1: Login to Heroku
```bash
heroku login
# Press any key to open browser and login
```

### Step 2: Create Heroku App
```bash
# Create app (Heroku will assign a random name)
heroku create

# Or create with custom name
heroku create your-hotel-booking-app
```

### Step 3: Set Environment Variables
```bash
# Set JWT Secret (CRITICAL!)
heroku config:set JWT_SECRET="cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c="

# Verify it's set
heroku config
```

### Step 4: Deploy to Heroku
```bash
# Make sure all files are committed
git add Procfile system.properties
git commit -m "Add Heroku deployment files"

# Deploy!
git push heroku main

# If you're on a different branch:
git push heroku your-branch:main
```

### Step 5: Scale Dyno (if needed)
```bash
# Ensure at least 1 web dyno is running
heroku ps:scale web=1
```

### Step 6: Open Your App
```bash
# Open in browser
heroku open

# Or visit: https://your-app-name.herokuapp.com
```

### Step 7: Check Logs (if issues)
```bash
# View live logs
heroku logs --tail

# View recent logs
heroku logs --num 200
```

---

## 📍 Your App Endpoints (After Deployment)

Replace `your-app-name` with your actual Heroku app name:

- **API Base:** `https://your-app-name.herokuapp.com`
- **Health Check:** `https://your-app-name.herokuapp.com/actuator/health`
- **Swagger UI:** `https://your-app-name.herokuapp.com/swagger-ui.html`
- **Hotels API:** `https://your-app-name.herokuapp.com/api/hotels`
- **Login:** `https://your-app-name.herokuapp.com/api/auth/login`

---

## 🎯 Complete Deployment Commands (Copy-Paste)

```bash
# 1. Login
heroku login

# 2. Create app
heroku create hotel-booking-system-2025

# 3. Set JWT Secret
heroku config:set JWT_SECRET="cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c="

# 4. Commit deployment files (if not already)
git add Procfile system.properties
git commit -m "Add Heroku deployment configuration"

# 5. Deploy
git push heroku main

# 6. Open app
heroku open

# 7. View logs
heroku logs --tail
```

---

## 🌐 Frontend Deployment (After Backend is Live)

### Option 1: Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=build

# Follow prompts to:
# 1. Create new site or connect existing
# 2. Authorize Netlify
# 3. Site will be live at: https://your-site.netlify.app
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Site will be live at: https://your-site.vercel.app
```

### Option 3: Heroku Static Site
```bash
# Create new Heroku app for frontend
heroku create your-hotel-booking-frontend

# Add static site buildpack
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static

# Create static.json in frontend folder
echo '{"root": "build/"}' > frontend/static.json

# Deploy frontend
cd frontend
git init
git add .
git commit -m "Initial frontend"
heroku git:remote -a your-hotel-booking-frontend
git push heroku main
```

---

## ⚙️ Update Frontend API URL

After backend is deployed, update frontend to point to Heroku backend:

**Create `frontend/.env.production`:**
```bash
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

**Rebuild frontend:**
```bash
cd frontend
npm run build
```

**Redeploy frontend** with the new build.

---

## 🔧 Heroku Configuration Files

### Procfile (Already Created ✅)
```
web: java -Dserver.port=$PORT -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar
```
- Tells Heroku how to start your app
- `$PORT` is provided by Heroku dynamically

### system.properties (Already Created ✅)
```
java.runtime.version=17
maven.version=3.9.6
```
- Specifies Java version for Heroku
- Ensures correct Maven version

---

## 🐛 Troubleshooting

### Issue: "Application Error" or "H10 error"
```bash
# Check logs
heroku logs --tail

# Common fixes:
# 1. Verify JWT_SECRET is set
heroku config

# 2. Restart dynos
heroku restart

# 3. Check if web dyno is running
heroku ps
```

### Issue: Build Fails
```bash
# Check build logs
heroku logs --tail | grep "BUILD"

# Common fixes:
# 1. Ensure Java 17 in system.properties
# 2. Verify pom.xml is valid
# 3. Make sure JAR is being built correctly
```

### Issue: Database Connection
- **H2 database** is already configured (no external DB needed!)
- Data will reset on dyno restart (expected with H2)
- For persistence, upgrade to Heroku Postgres (optional)

### Issue: CORS Errors
```bash
# Update SecurityConfig.java CORS to allow Heroku domains
# Then redeploy:
git add .
git commit -m "Update CORS for production"
git push heroku main
```

---

## 📊 Monitor Your App

### View App Info
```bash
heroku info
```

### View Config Vars
```bash
heroku config
```

### View Dyno Usage
```bash
heroku ps
```

### View App Logs
```bash
# Live logs
heroku logs --tail

# Specific number of lines
heroku logs -n 500

# Filter by dyno
heroku logs --source app
```

---

## 💰 Heroku Free Tier Limits

- **550-1000 free dyno hours/month** (enough for hobby projects)
- **Sleeps after 30 min inactivity** (wakes on request in ~10 seconds)
- **Custom domain** available (free)
- **SSL certificate** included (free)

### Keep App Awake (Optional)
Use services like:
- **UptimeRobot** (free): Pings your app every 5 minutes
- **Kaffeine**: http://kaffeine.herokuapp.com

---

## 🎯 Verification Checklist

After deployment, verify:
- [ ] App URL loads: `heroku open`
- [ ] Health check works: `https://your-app.herokuapp.com/actuator/health`
- [ ] Swagger UI accessible: `https://your-app.herokuapp.com/swagger-ui.html`
- [ ] Can login: Test `POST /api/auth/login`
- [ ] Hotels API works: `GET /api/hotels`
- [ ] No errors in logs: `heroku logs --tail`

---

## 🚀 Quick Deploy Script

Save this as `deploy-heroku.sh` (Git Bash) or `deploy-heroku.ps1` (PowerShell):

**PowerShell version:**
```powershell
# deploy-heroku.ps1
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Cyan

# Login
heroku login

# Create app (if not exists)
$appName = Read-Host "Enter app name (or press Enter for random)"
if ($appName) {
    heroku create $appName
} else {
    heroku create
}

# Set JWT Secret
heroku config:set JWT_SECRET="cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c="

# Deploy
git push heroku main

# Open app
heroku open

Write-Host "✅ Deployment complete!" -ForegroundColor Green
```

Run: `.\deploy-heroku.ps1`

---

## 📞 Support

- **Heroku Docs:** https://devcenter.heroku.com
- **Heroku Status:** https://status.heroku.com
- **Support:** https://help.heroku.com

---

## 🎉 Success!

Your Hotel Booking Management System is now live on Heroku! 🎊

**Next Steps:**
1. Share your app URL with users
2. Deploy frontend to Netlify/Vercel
3. Update frontend to point to Heroku backend
4. Test all features end-to-end
5. Monitor logs and performance

**Your JWT Secret (save this):**
```
JWT_SECRET=cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c=
```

---

*Happy Deploying! 🚀*
