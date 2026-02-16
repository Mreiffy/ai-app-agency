#!/bin/bash
# GitHub Setup Script for AI App Agency
# Usage: ./setup-github.sh <github-username> <repo-name>

USERNAME=$1
REPO_NAME=${2:-"ai-app-agency"}

if [ -z "$USERNAME" ]; then
    echo "Usage: ./setup-github.sh <github-username> [repo-name]"
    echo "Example: ./setup-github.sh johndoe my-agency"
    exit 1
fi

echo "🏭 AI App Agency - GitHub Setup"
echo "================================"
echo ""
echo "This will:"
echo "1. Create GitHub repo: $USERNAME/$REPO_NAME"
echo "2. Push agency code to GitHub"
echo "3. Set up Vercel deployment"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found"
    echo "Installing..."
    
    # Try to install
    if command -v apt &> /dev/null; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        apt update && apt install gh -y
    elif command -v brew &> /dev/null; then
        brew install gh
    else
        echo "❌ Cannot install gh automatically"
        echo "Please install from: https://cli.github.com/"
        exit 1
    fi
fi

# Check authentication
echo "🔑 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub:"
    gh auth login
fi

# Create repo
echo "📦 Creating GitHub repository..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo ""
echo "✅ GitHub repository created!"
echo "🌐 https://github.com/$USERNAME/$REPO_NAME"
echo ""

# Now deploy to Vercel
echo "🚀 Setting up Vercel deployment..."
echo ""
echo "To deploy to Vercel:"
echo "1. Go to https://vercel.com/new"
echo "2. Import GitHub repo: $USERNAME/$REPO_NAME"
echo "3. Framework: Other"
echo "4. Root Directory: dashboard"
echo "5. Deploy!"
echo ""
echo "Or use Vercel CLI:"
echo "  npm i -g vercel"
echo "  cd /data/.openclaw/workspace/agency"
echo "  vercel --prod"
