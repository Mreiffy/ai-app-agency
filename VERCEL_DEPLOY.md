# 🚀 Deploy Agency to Vercel

## Quick Setup

Your AI App Agency is ready to deploy! Here's how to get it online with Vercel:

---

## Step 1: GitHub Setup

### Option A: Using GitHub CLI (Fastest)

```bash
cd /data/.openclaw/workspace/agency

# Login to GitHub
gh auth login
# - Select: GitHub.com
# - Select: HTTPS
# - Select: Login with web browser
# - Follow browser authentication

# Create repo and push
gh repo create ai-app-agency --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup

1. Go to https://github.com/new
2. Repository name: `ai-app-agency`
3. Make it **Public**
4. **Don't** initialize with README
5. Click **Create repository**
6. Copy the push commands:

```bash
cd /data/.openclaw/workspace/agency
git remote add origin https://github.com/YOUR_USERNAME/ai-app-agency.git
git branch -M main
git push -u origin main
```

---

## Step 2: Vercel Deployment

### Option A: Vercel Web Interface (Easiest)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `ai-app-agency` repo
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `dashboard`
   - **Build Command:** (leave empty)
   - **Output Directory:** `./`
5. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
cd /data/.openclaw/workspace/agency
vercel login

# Deploy
vercel --prod
# - Set up and deploy? Yes
# - Which scope? [your account]
# - Link to existing project? No
# - Project name? ai-app-agency
# - Directory? ./dashboard
```

---

## Step 3: Access Your Dashboard

Once deployed, you'll get:
- **Production URL:** `https://ai-app-agency.vercel.app`
- **Custom Domain:** (can add later)

---

## What Gets Deployed?

The dashboard includes:
- ✅ Visual Software Factory interface
- ✅ 6 Agent status cards (live)
- ✅ Factory floor visualization
- ✅ Live activity stream
- ✅ Progress tracking
- ✅ Terminal output
- ✅ Cost monitoring

---

## Auto-Deployment

With GitHub + Vercel:
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Updates live instantly

Example:
```bash
cd /data/.openclaw/workspace/agency
git add .
git commit -m "Updated dashboard"
git push
# Vercel auto-deploys!
```

---

## Custom Domain (Optional)

1. Buy domain (e.g., agency.yourname.com)
2. Vercel Dashboard → Project → Settings → Domains
3. Add domain
4. Update DNS records as instructed

---

## Current Status

✅ Git repo initialized  
✅ All files committed  
⬜ GitHub repo creation needed  
⬜ Vercel deployment needed  

---

## Need Help?

Run the setup helper:
```bash
cd /data/.openclaw/workspace/agency
./setup-github YOUR_GITHUB_USERNAME
```

Or do it manually following steps above.

---

**Ready to go live?** 🚀
