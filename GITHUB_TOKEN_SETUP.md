# GitHub Token Setup for VPS

## Option 1: Personal Access Token (Recommended)

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Name it: `AI Agency VPS`
4. Expiration: 90 days
5. Scopes: Select these:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
6. Click **Generate token**
7. **COPY THE TOKEN** (you won't see it again)

Then run:
```bash
cd /data/.openclaw/workspace/agency
git remote set-url origin https://Mreiffy:YOUR_TOKEN@github.com/Mreiffy/ai-app-agency.git
git push -u origin main
```

## Option 2: SSH Key (More Secure)

Your SSH key already exists at `/data/.ssh/id_ed25519.pub`

1. Copy the public key:
```bash
cat /data/.ssh/id_ed25519.pub
```

2. Go to https://github.com/settings/keys
3. Click **New SSH key**
4. Title: `Hostinger VPS`
5. Paste the key
6. Click **Add SSH key**

Then run:
```bash
cd /data/.openclaw/workspace/agency
git remote set-url origin git@github.com:Mreiffy/ai-app-agency.git
git push -u origin main
```

## Option 3: GitHub CLI Web Login

```bash
gh auth login
# Select HTTPS, then web browser login
```

Then push normally.

---

**After pushing, I can deploy to Vercel automatically.**
