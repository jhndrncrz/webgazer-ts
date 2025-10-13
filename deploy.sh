#!/bin/bash

# Webgazer.ts v0.2.0 Deployment Script
# This script automates the release process

set -e  # Exit on error

echo "🚀 Webgazer.ts v0.2.0 Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Check if version is 0.2.0
VERSION=$(node -p "require('./package.json').version")
if [ "$VERSION" != "0.2.0" ]; then
    echo -e "${YELLOW}Warning: Current version is $VERSION, expected 0.2.0${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📋 Pre-flight Checks"
echo "-------------------"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    git status -s
    read -p "Commit changes first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✓ Changes committed${NC}"
    fi
fi

# Build packages
echo ""
echo "🔨 Building packages..."
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Packages built successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Build documentation
echo ""
echo "📚 Building documentation..."
pnpm docs:build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Documentation built successfully${NC}"
else
    echo -e "${RED}✗ Documentation build failed${NC}"
    exit 1
fi

# Git operations
echo ""
echo "📦 Git Operations"
echo "----------------"

# Check if tag exists
if git rev-parse v0.2.0 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Tag v0.2.0 already exists${NC}"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d v0.2.0
        git push origin :refs/tags/v0.2.0 2>/dev/null || true
        echo -e "${GREEN}✓ Old tag deleted${NC}"
    fi
fi

# Create tag
echo "Creating tag v0.2.0..."
git tag -a v0.2.0 -m "Release version 0.2.0

Major Features:
- Complete documentation website
- Privacy-first default (saveDataAcrossSessions: false)
- Enhanced TypeScript types
- Optimized bundle sizes

See CHANGELOG.md for full details."

echo -e "${GREEN}✓ Tag created${NC}"

# Push
echo ""
read -p "Push to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to origin..."
    git push origin main
    git push origin v0.2.0
    echo -e "${GREEN}✓ Pushed to GitHub${NC}"
    echo ""
    echo "📄 Documentation will be deployed automatically via GitHub Actions"
    echo "   Check: https://github.com/jhndrncrz/webgazer-ts/actions"
fi

# npm publish
echo ""
read -p "Publish to npm? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Publishing to npm..."
    
    # Check if logged in
    if ! npm whoami > /dev/null 2>&1; then
        echo "Not logged in to npm. Please log in:"
        npm login
    fi
    
    # Publish core
    echo ""
    echo "Publishing @webgazer-ts/core..."
    cd packages/core
    npm publish --access public
    cd ../..
    echo -e "${GREEN}✓ @webgazer-ts/core published${NC}"
    
    # Publish react
    echo ""
    echo "Publishing @webgazer-ts/react..."
    cd packages/react
    npm publish --access public
    cd ../..
    echo -e "${GREEN}✓ @webgazer-ts/react published${NC}"
fi

# Summary
echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo ""
echo "📦 Packages:"
echo "   - @webgazer-ts/core@0.2.0"
echo "   - @webgazer-ts/react@0.2.0"
echo ""
echo "📚 Documentation:"
echo "   - https://jhndrncrz.github.io/webgazer-ts/"
echo ""
echo "🔗 GitHub:"
echo "   - Release: https://github.com/jhndrncrz/webgazer-ts/releases/tag/v0.2.0"
echo "   - Repo: https://github.com/jhndrncrz/webgazer-ts"
echo ""
echo "🎯 Next Steps:"
echo "   1. Create GitHub Release with release notes"
echo "   2. Verify documentation is live"
echo "   3. Check npm packages are available"
echo "   4. Announce the release!"
echo ""
echo "📝 Don't forget to:"
echo "   - Update project README if needed"
echo "   - Share on social media"
echo "   - Monitor for issues"
echo ""
echo -e "${GREEN}🎉 Congratulations on releasing v0.2.0!${NC}"
