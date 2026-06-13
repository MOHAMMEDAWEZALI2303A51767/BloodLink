#!/bin/bash

# BloodLink Heroku Deployment Script
# This script automates the deployment to Heroku

set -e

echo "🩸 BloodLink - Heroku Deployment Setup"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${YELLOW}⚠️  Heroku CLI is not installed${NC}"
    echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking Heroku Login${NC}"
heroku login || {
    echo -e "${YELLOW}Please login to Heroku first${NC}"
    exit 1
}

# Get app name
read -p "Enter your Heroku app name (or press Enter to create new): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo -e "${BLUE}Step 2: Creating New Heroku App${NC}"
    heroku create
    APP_NAME=$(heroku apps:info --json | grep -o '"name":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${BLUE}Step 2: Using Existing App: $APP_NAME${NC}"
    heroku git:remote -a "$APP_NAME" || {
        echo "Error: App '$APP_NAME' not found or unable to connect"
        exit 1
    }
fi

echo -e "${GREEN}✓ App: $APP_NAME${NC}"
echo ""

# Get MongoDB URI
read -p "Enter your MongoDB URI (from Atlas): " MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    echo -e "${YELLOW}⚠️  MongoDB URI is required${NC}"
    exit 1
fi

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${BLUE}Generated JWT_SECRET: ${NC}$JWT_SECRET"

echo ""
echo -e "${BLUE}Step 3: Setting Environment Variables${NC}"
heroku config:set --app "$APP_NAME" \
    MONGODB_URI="$MONGODB_URI" \
    JWT_SECRET="$JWT_SECRET" \
    NODE_ENV=production \
    PORT=5000

echo -e "${GREEN}✓ Environment variables set${NC}"
echo ""

# Set buildpack
echo -e "${BLUE}Step 4: Setting Buildpack${NC}"
heroku buildpacks:set heroku/nodejs --app "$APP_NAME"
echo -e "${GREEN}✓ Buildpack configured${NC}"
echo ""

# Deploy
echo -e "${BLUE}Step 5: Deploying to Heroku${NC}"
echo "This may take a few minutes..."
git push heroku main || git push heroku master

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""

# Show logs
echo -e "${BLUE}Step 6: Viewing Logs${NC}"
read -p "View deployment logs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    heroku logs --tail --app "$APP_NAME"
fi

echo ""
echo -e "${GREEN}✨ Deployment Summary${NC}"
echo "===================="
echo "App URL: https://$APP_NAME.herokuapp.com"
echo "API URL: https://$APP_NAME.herokuapp.com/api"
echo ""
echo "Next steps:"
echo "1. Update your frontend REACT_APP_API_URL to: https://$APP_NAME.herokuapp.com/api"
echo "2. Deploy frontend to Vercel or Netlify"
echo "3. Test the API: curl https://$APP_NAME.herokuapp.com/api/health"
echo ""
echo "Useful Heroku commands:"
echo "  heroku logs --tail --app $APP_NAME          # View logs"
echo "  heroku config --app $APP_NAME               # View variables"
echo "  heroku restart --app $APP_NAME              # Restart app"
echo "  heroku open --app $APP_NAME                 # Open in browser"
echo ""
