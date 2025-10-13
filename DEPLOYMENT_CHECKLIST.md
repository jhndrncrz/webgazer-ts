# 🚀 Deployment Checklist for v0.2.0

Use this checklist to ensure everything is ready before deploying.

## ✅ Pre-Deployment

### Code & Build
- [x] All packages build successfully
  - [x] `@webgazer-ts/core` builds
  - [x] `@webgazer-ts/react` builds
- [x] Version numbers updated to 0.2.0
  - [x] Root `package.json`
  - [x] `packages/core/package.json`
  - [x] `packages/react/package.json`
- [ ] All tests pass (if you have tests)
- [ ] No linting errors
- [ ] No TypeScript errors

### Documentation
- [x] Documentation builds without errors
  - [x] VitePress builds successfully
  - [x] TypeDoc generates API docs
- [x] All documentation pages created
  - [x] Homepage
  - [x] Getting Started
  - [x] Migration Guide
  - [x] Core guides
  - [x] React guides
  - [x] API reference
- [x] All links are valid
- [x] Code examples are tested and work
- [x] Navigation and sidebar configured

### Release Materials
- [x] CHANGELOG.md created with all changes
- [x] RELEASE_GUIDE.md created
- [x] RELEASE_SUMMARY.md created
- [x] README files updated
  - [x] Root README
  - [x] Core package README
  - [x] React package README (already done)
- [x] GitHub Actions workflow configured

### Git
- [ ] All changes committed
- [ ] Working directory clean
- [ ] On correct branch (main)
- [ ] Remote is set correctly

## 🚀 Deployment Steps

### 1. Build Everything

```bash
# Build packages
pnpm build

# Build documentation
pnpm docs:build
```

- [ ] Core package built successfully
- [ ] React package built successfully
- [ ] Documentation built successfully

### 2. Git Operations

```bash
# Commit any remaining changes
git add .
git commit -m "chore: release v0.2.0"

# Create tag
git tag -a v0.2.0 -m "Release version 0.2.0"

# Push
git push origin main
git push origin v0.2.0
```

- [ ] Changes committed
- [ ] Tag created
- [ ] Pushed to GitHub

### 3. Documentation Deployment

Documentation deploys automatically via GitHub Actions.

- [ ] GitHub Actions workflow triggered
- [ ] Workflow completed successfully
- [ ] Documentation is live at https://jhndrncrz.github.io/webgazer-ts/

**Verify:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] API docs are generated
- [ ] Search works
- [ ] Examples are accessible

### 4. npm Publishing (Optional)

```bash
# Make sure you're logged in
npm whoami
# If not logged in:
npm login

# Publish core package
cd packages/core
npm publish --access public

# Publish react package
cd ../react
npm publish --access public
```

- [ ] Logged in to npm
- [ ] Core package published
- [ ] React package published

**Verify:**
- [ ] https://www.npmjs.com/package/@webgazer-ts/core shows v0.2.0
- [ ] https://www.npmjs.com/package/@webgazer-ts/react shows v0.2.0
- [ ] Packages are installable: `npm install @webgazer-ts/core@0.2.0`

### 5. GitHub Release

Create release at: https://github.com/jhndrncrz/webgazer-ts/releases/new

**Fields:**
- **Tag:** v0.2.0
- **Title:** v0.2.0 - Documentation & Privacy Improvements
- **Description:** See [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) for template

- [ ] GitHub Release created
- [ ] Release notes include breaking changes
- [ ] Links to documentation added
- [ ] CHANGELOG linked

### 6. GitHub Pages Setup

If not already enabled:

1. Go to repository Settings → Pages
2. Source: **GitHub Actions**
3. Save

- [ ] GitHub Pages enabled
- [ ] Custom domain configured (if applicable)

## ✅ Post-Deployment

### Verification

- [ ] **npm packages**
  - [ ] Core package version is 0.2.0
  - [ ] React package version is 0.2.0
  - [ ] Packages install without errors
  - [ ] Import statements work

- [ ] **Documentation**
  - [ ] Site is accessible
  - [ ] All pages load
  - [ ] Search functionality works
  - [ ] Code syntax highlighting works
  - [ ] Mobile responsive
  - [ ] Dark/light mode works

- [ ] **GitHub**
  - [ ] Release is published
  - [ ] Tag is visible
  - [ ] CHANGELOG is up to date
  - [ ] Actions workflow shows success

### Testing

Test in a fresh project:

```bash
# Create test project
mkdir test-webgazer-ts
cd test-webgazer-ts
npm init -y

# Install packages
npm install @webgazer-ts/core@0.2.0
npm install @webgazer-ts/react@0.2.0

# Test import
node -e "const webgazer = require('@webgazer-ts/core'); console.log(webgazer.default);"
```

- [ ] Packages install correctly
- [ ] Imports work
- [ ] Types are available

### Communication

- [ ] Update repository README (if needed)
- [ ] Post announcement in GitHub Discussions
- [ ] Share on social media (if applicable)
- [ ] Email stakeholders (if applicable)
- [ ] Update dependent projects

### Monitoring

Track these metrics:

- [ ] npm download stats
- [ ] GitHub stars/forks
- [ ] Issue reports
- [ ] Documentation analytics (if enabled)
- [ ] Community feedback

## 🐛 Rollback Plan

If critical issues are found:

### Option 1: Deprecate

```bash
npm deprecate @webgazer-ts/core@0.2.0 "Critical bug, use 0.1.0"
npm deprecate @webgazer-ts/react@0.2.0 "Critical bug, use 0.1.0"
```

### Option 2: Hotfix

1. Fix the issue
2. Update to 0.2.1
3. Follow release process again

### Option 3: Revert

```bash
# Revert commits
git revert <commit-hash>

# Delete tag
git tag -d v0.2.0
git push origin :refs/tags/v0.2.0

# Unpublish (within 72 hours)
npm unpublish @webgazer-ts/core@0.2.0
npm unpublish @webgazer-ts/react@0.2.0
```

## 📝 Notes

- Documentation updates automatically with each push to main
- npm packages are immutable (can't republish same version)
- Keep this checklist for future releases
- Update process based on what you learn

## 🎯 Success Criteria

Deployment is successful when:

- ✅ All packages published to npm
- ✅ Documentation is live and functional
- ✅ GitHub release is created
- ✅ No critical issues reported within 24 hours
- ✅ Users can install and use the packages
- ✅ Documentation is helpful and accurate

## 🎉 Celebration

Once everything is verified:

- [ ] 🎊 Pat yourself on the back!
- [ ] 📣 Announce the release
- [ ] 📊 Monitor metrics
- [ ] 💬 Engage with the community
- [ ] 📝 Plan for v0.3.0

---

## Quick Commands

```bash
# Complete deployment
./deploy.sh

# Or manual step-by-step:
pnpm build
pnpm docs:build
git add . && git commit -m "chore: release v0.2.0"
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main --tags
cd packages/core && npm publish --access public
cd ../react && npm publish --access public
```

---

**Last Updated:** October 13, 2025
**Version:** 0.2.0
**Status:** Ready for deployment ✅
