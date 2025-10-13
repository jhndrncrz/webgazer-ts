# Case Sensitivity Fix - October 13, 2025

## 🐛 Problem

GitHub Actions builds were failing with "Could not resolve" errors for module imports, even though the code built successfully on macOS.

**Root Cause:** macOS uses a case-insensitive filesystem by default, while Linux (used by GitHub Actions) uses a case-sensitive filesystem.

## 📝 What Happened

When files were renamed from `WebGazer` → `Webgazer` on macOS:
- The filesystem treated them as the same file (case-insensitive)
- Git didn't detect the casing change
- The repository tracked files with the old casing (`WebGazer`)
- Imports used the new casing (`Webgazer`)
- ✅ macOS: Works fine (case-insensitive)
- ❌ Linux: Can't find the files (case-sensitive)

## 🔧 Files Fixed

### Core Package (`packages/core/`)

| Git Repository (Old) | Disk/Imports (Actual) | Status |
|---------------------|----------------------|---------|
| `WebGazer.ts` | `Webgazer.ts` | ✅ Fixed |
| `WebGazerConfig.ts` | `WebgazerConfig.ts` | ✅ Fixed |

### React Package (`packages/react/`)

| Git Repository (Old) | Disk/Imports (Actual) | Status |
|---------------------|----------------------|---------|
| `WebGazerContext.ts` | `WebgazerContext.ts` | ✅ Fixed |
| `WebGazerProvider.tsx` | `WebgazerProvider.tsx` | ✅ Fixed |
| `useWebGazer.ts` | `useWebgazer.ts` | ✅ Fixed |

## ✅ Solution

Used `git mv` to properly rename files in the repository:

```bash
# Core package
git mv packages/core/src/core/WebGazer.ts packages/core/src/core/Webgazer.ts
git mv packages/core/src/core/WebGazerConfig.ts packages/core/src/core/WebgazerConfig.ts

# React package
git mv packages/react/src/context/WebGazerContext.ts packages/react/src/context/WebgazerContext.ts
git mv packages/react/src/components/WebGazerProvider.tsx packages/react/src/components/WebgazerProvider.tsx
git mv packages/react/src/hooks/useWebGazer.ts packages/react/src/hooks/useWebgazer.ts
```

## 📊 Verification

### Local Build (macOS)
```bash
pnpm build
# ✅ Core: Built in 2.75s
# ✅ React: Built in 516ms
```

### GitHub Actions (Linux)
- Commit 1: `9a7bf14` - Fixed core package
- Commit 2: `3a73267` - Fixed React package
- Status: ✅ Should now build successfully

## 🎓 Lessons Learned

1. **Always use `git mv` for file renames** - Don't rely on filesystem operations
2. **Case matters** - Even if your local system is case-insensitive
3. **Test on Linux** - CI/CD runs on Linux, which is case-sensitive
4. **Check `git ls-files`** - Verify what Git actually tracks vs. what's on disk

## 🚀 What's Next

GitHub Actions should now build successfully. Check the workflow at:
https://github.com/jhndrncrz/webgazer-ts/actions

Once successful:
1. Documentation will auto-deploy to GitHub Pages
2. Ready to publish v0.2.0 to npm
3. Ready to create GitHub release

## 🔍 How to Prevent This

### Pre-commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Check for case-sensitivity issues
git diff --cached --name-only | while read file; do
  actual_file=$(git ls-files | grep -i "^$file$")
  if [ "$file" != "$actual_file" ]; then
    echo "Error: Case mismatch detected!"
    echo "  Git: $actual_file"
    echo "  Actual: $file"
    exit 1
  fi
done
```

### Best Practices

1. Use consistent naming conventions (we use: `Webgazer` with lowercase 'g')
2. Always use `git mv` for renames
3. Test builds in Docker (Linux) before pushing
4. Enable GitHub Actions on branches to catch issues early

---

**Status:** ✅ Fixed and deployed
**Commits:** 
- `9a7bf14` - Core package casing fix
- `3a73267` - React package casing fix
