#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up the Data Marketplace Frontend...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm could not be found. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Check if .env file exists, create from example if not
if [ ! -f .env ]; then
    echo -e "${YELLOW}.env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please update the .env file with your own values, especially the Pinata JWT token.${NC}"
fi

echo -e "${GREEN}Setup complete! You can now run the development server with:${NC}"
echo -e "${GREEN}npm run dev${NC}"