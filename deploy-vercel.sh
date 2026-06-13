#!/bin/bash

# BloodLink Vercel Frontend Deployment Script

echo "🎨 BloodLink - Vercel Frontend Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${BLUE}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}Step 1: Building Frontend${NC}"
cd frontend
npm install
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

echo -e "${BLUE}Step 2: Logging into Vercel${NC}"
vercel login

echo ""
echo -e "${BLUE}Step 3: Deploying to Vercel${NC}"
echo "Choose 'Y' for all prompts (use current settings)"
echo ""

VERCEL_OUTPUT=$(vercel --prod)
echo "$VERCEL_OUTPUT"

VERCEL_URL=$(echo "$VERCEL_OUTPUT" | grep -oP '(https://[^ ]+)' | tail -1)

echo ""
echo -e "${BLUE}Step 4: Setting Environment Variables${NC}"
echo ""
echo "You need to set REACT_APP_API_URL in Vercel:"
echo "1. Go to your Vercel project: https://vercel.com/dashboard"
echo "2. Select your BloodLink project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add new variable:"
echo "   Name: REACT_APP_API_URL"
echo "   Value: https://your-heroku-app.herokuapp.com/api"
echo ""
read -p "Press Enter once you've set the environment variable..."

echo ""
echo -e "${BLUE}Step 5: Redeploying with Environment Variables${NC}"
vercel --prod

echo ""
echo -e "${GREEN}✨ Frontend Deployment Complete!${NC}"
echo "======================================"
echo "Frontend URL: $VERCEL_URL"
echo ""
echo "Next: Deploy your backend to Heroku using deploy-heroku.sh"
echo ""
