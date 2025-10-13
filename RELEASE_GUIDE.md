# Release Guide v0.2.0

This guide walks you through deploying version 0.2.0 of Webgazer.ts.

## 📋 Pre-Release Checklist

- [x] Version numbers updated to 0.2.0
  - [x] Root package.json
  - [x] packages/core/package.json
  - [x] packages/react/package.json
- [x] CHANGELOG.md created with all changes
- [x] Documentation website created
- [x] Packages build successfully
- [x] README updated with documentation links
- [ ] All tests passing (if you have tests)
- [ ] Git repository clean (no uncommitted changes)

## 🚀 Deployment Steps

### Step 1: Commit and Tag

```bash
# Add all changes
git add .

# Commit with version message
git commit -m "chore: release v0.2.0

- Add comprehensive documentation website
- Change default data persistence to false (privacy-first)
- Update all package versions to 0.2.0
- Add CHANGELOG
- Improve TypeScript types"

# Create version tag
git tag -a v0.2.0 -m "Release version 0.2.0"

# Push commits
git push origin main

# Push tags
git push origin v0.2.0
```

### Step 2: Build Documentation

The documentation will build automatically via GitHub Actions when you push to main.

**Manual build (optional):**
```bash
# Build documentation locally
pnpm docs:build

# Preview before deploying
pnpm docs:preview
```

### Step 3: Publish to npm

#### Option A: Publish Both Packages

```bash
# Make sure you're logged in to npm
npm login

# Publish core package
cd packages/core
npm publish --access public

# Publish react package
cd ../react
npm publish --access public
```

#### Option B: Publish Using Changesets (Recommended)

If you want to use changesets for better release management:

```bash
# Install changesets
pnpm add -D -w @changesets/cli

# Initialize changesets
pnpm changeset init

# Create a changeset
pnpm changeset
# Select: @webgazer-ts/core and @webgazer-ts/react
# Version bump type: minor
# Summary: Add documentation website and privacy improvements

# Version packages
pnpm changeset version

# Publish packages
pnpm changeset publish
```

### Step 4: Create GitHub Release

1. Go to https://github.com/jhndrncrz/webgazer-ts/releases
2. Click "Draft a new release"
3. Fill in the release form:

**Tag:** `v0.2.0`

**Title:** `v0.2.0 - Documentation & Privacy Improvements`

**Description:**
```markdown
## 🎉 What's New in v0.2.0

### Major Features

- **📚 Complete Documentation Website** - Built with VitePress
  - Comprehensive guides for Core and React packages
  - Auto-generated API documentation
  - Interactive examples
  - [View Documentation →](https://jhndrncrz.github.io/webgazer-ts/)

- **🔒 Privacy-First Default** - `saveDataAcrossSessions` now defaults to `false`
  - Users must explicitly opt-in to data persistence
  - Aligns with GDPR and privacy best practices

### Improvements

- Enhanced TypeScript definitions
- Optimized bundle sizes (Core: ~15KB gzipped, React: ~8KB gzipped)
- Better error handling and user feedback
- Improved mouse event handling
- Tree-shaking support

### Breaking Changes

⚠️ **Default Data Persistence Changed**

If you rely on automatic calibration data persistence, explicitly enable it:

\`\`\`typescript
webgazer.saveDataAcrossSessions(true).begin();
\`\`\`

### Documentation

- [📖 Getting Started](https://jhndrncrz.github.io/webgazer-ts/guide/getting-started)
- [🔧 Core API Reference](https://jhndrncrz.github.io/webgazer-ts/api/core/)
- [⚛️ React API Reference](https://jhndrncrz.github.io/webgazer-ts/api/react/)
- [🔄 Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration)

### Full Changelog

See [CHANGELOG.md](https://github.com/jhndrncrz/webgazer-ts/blob/main/CHANGELOG.md) for complete details.

---

**Installation:**

\`\`\`bash
npm install @webgazer-ts/core@0.2.0
# or
npm install @webgazer-ts/react@0.2.0
\`\`\`
```

4. Click "Publish release"

### Step 5: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: **GitHub Actions**
3. The documentation will automatically deploy from the `.github/workflows/docs.yml` workflow

### Step 6: Verify Deployment

Check that everything is working:

- [ ] npm packages published
  - [ ] https://www.npmjs.com/package/@webgazer-ts/core
  - [ ] https://www.npmjs.com/package/@webgazer-ts/react
- [ ] GitHub release created
  - [ ] https://github.com/jhndrncrz/webgazer-ts/releases/tag/v0.2.0
- [ ] Documentation deployed
  - [ ] https://jhndrncrz.github.io/webgazer-ts/
  - [ ] Navigation works
  - [ ] API docs generated correctly
  - [ ] Examples load properly

### Step 7: Announce

Share the release:

- [ ] Update project README with latest version
- [ ] Post on GitHub Discussions
- [ ] Share on social media (if applicable)
- [ ] Update any related projects/dependencies

## 🔧 Post-Release

### Update Version Badges

If you use shields.io badges, they should auto-update. Verify:

- npm version badge shows 0.2.0
- Documentation badge is green

### Monitor Issues

Watch for any issues reported after release:
- Check npm download stats
- Monitor GitHub issues
- Respond to questions in Discussions

## 🐛 Rollback Procedure

If critical issues are found:

### Option 1: Deprecate Version

```bash
npm deprecate @webgazer-ts/core@0.2.0 "Critical bug, use 0.1.0 instead"
npm deprecate @webgazer-ts/react@0.2.0 "Critical bug, use 0.1.0 instead"
```

### Option 2: Publish Hotfix

```bash
# Fix the issue
# Update to 0.2.1
# Follow release process again
```

## 📊 Release Metrics

Track these metrics post-release:

- npm downloads per week
- GitHub stars/forks
- Documentation page views (if analytics enabled)
- Issue reports
- Community engagement

## 🔄 Continuous Deployment (Future)

For future releases, consider setting up:

1. **Semantic Release**
   ```bash
   pnpm add -D semantic-release
   ```

2. **Automated Publishing**
   - GitHub Actions workflow for npm publish
   - Automated changelog generation
   - Version bumping based on commits

3. **Preview Deployments**
   - Deploy docs PRs to preview URLs
   - Test changes before merging

## 📝 Notes

- Always test packages locally before publishing
- Keep CHANGELOG.md updated
- Document breaking changes clearly
- Communicate with users about major changes
- Maintain backward compatibility when possible

## 🎯 Next Release (0.3.0)

Future improvements to consider:
- Performance benchmarks
- More examples
- Video tutorials
- Improved mobile support
- Additional regression models
- Better error messages
- Accessibility improvements

---

## Quick Commands Reference

```bash
# Build everything
pnpm build

# Build docs
pnpm docs:build

# Commit and tag
git commit -m "chore: release v0.2.0"
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main --tags

# Publish packages
cd packages/core && npm publish --access public
cd ../react && npm publish --access public

# Verify
npm view @webgazer-ts/core version
npm view @webgazer-ts/react version
```

## Support

If you encounter issues during deployment:

- Check GitHub Actions logs
- Verify npm credentials
- Ensure Git remote is set correctly
- Contact maintainers if needed

---

**Good luck with the release! 🚀**
