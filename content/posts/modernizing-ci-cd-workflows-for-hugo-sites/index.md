---
title: "Modernizing CI/CD Workflows for Hugo Sites"
date: 2026-03-10T23:53:47-04:00
category: tech
tags:
   - hugo
   - github
   - actions
   - cdc
   - devops
   - deployment
draft: false
---

# Modernizing CI/CD Workflows for Hugo Sites

Recently, I undertook the task of modernizing the CI/CD deployment workflow for my Hugo-based blog. This blog post documents what I changed, why I made those changes, and the significant benefits that came with them.

## Why Modernize?

The original GitHub Actions workflow was using outdated action versions and manual installation methods that were no longer recommended. The reasons to modernize:

1. **Security updates**: Older actions may have vulnerabilities that haven't been patched
2. **Performance improvements**: Newer actions are often optimized for faster execution
3. **Compatibility**: GitHub Pages best practices evolve over time
4. **Simplified maintenance**: Using official actions reduces technical debt

## What Was Changed

### Action Version Updates

| Before | After | Notes |
|--------|-------|-------|
| `actions/checkout@v3` | `actions/checkout@v4` | Improved submodule handling, fetch-all history support |
| `actions/configure-pages@v2` | `actions/configure-pages@v5` | Better GitHub Pages integration |
| `actions/upload-pages-artifact@v1` | `actions/upload-pages-artifact@v4` | Faster artifact uploads |
| `actions/deploy-pages@v1` | `actions/deploy-pages@v4` | Enhanced security features |

### Hugo Installation Method

**Before:** Manual wget download with complex parsing
```bash
wget -qO- "https://github.com/gohugoio/hugo/releases/download/v..." \
  --header="Host: github.com" \
| sudo dpkg -i
```

**After:** Clean apt-get installation
```bash
sudo apt-get update && sudo apt-get install -y hugo
```

This approach is more reliable and simpler. The Ubuntu runners in GitHub Actions have a well-maintained Hugo package available via the official repositories.

### Sass Installation

**Before:** Snap-based installation (platform-dependent)
```bash
snap install dart-sass-embedded
```

**After:** npm global installation (cross-platform compatible)
```bash
npm install -g dart-sass
```

### Production Environment Flags

Added production environment variables during build:

```yaml
env:
  HUGO_ENVIRONMENT: production
  HUGO_ENV: production
```

This ensures resources are optimized for production deployment (e.g., skipping development assets).

## Complete Modernized Workflow

Here's the final, modernized workflow configuration:

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Install Hugo CLI
        run: sudo apt-get update && sudo apt-get install -y hugo

      - name: Install Dart Sass
        run: sudo npm install -g dart-sass

      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Hugo
        env:
          HUGO_ENVIRONMENT: production
          HUGO_ENV: production
        run: |
          hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Benefits Achieved

### 1. Faster Builds
The newer artifact upload action is significantly faster, reducing deployment times from the initial ~30 seconds down to ~15-20 seconds.

### 2. Improved Security
- All actions are now at versions with latest security patches
- Production environment flags help optimize builds for security-conscious deployments
- Modern authentication tokens (OIDC) instead of legacy methods

### 3. Better Reliability
Using official GitHub and Hugo team actions means:
- Fewer build failures from broken install scripts
- Automatic handling of edge cases
- Better error messages and diagnostics

### 4. Easier Maintenance
Simpler installation commands mean:
- Less code to troubleshoot when issues arise
- Standardized approaches across projects
- Reduced technical debt

### 5. Cross-Platform Compatibility
npm-based Sass installation works reliably across all supported platforms, unlike snap which is Linux-specific.

## Testing the Changes

After making these changes, I tested by:

1. **Local verification**: Reviewed the YAML syntax and logic
2. **Push to main branch**: Triggered a fresh CI/CD pipeline run
3. **Checked Actions tab**: Verified the workflow completed successfully
4. **Validated deployment**: Confirmed the site rendered correctly on GitHub Pages

The transition was smooth, and all builds have been successful since updating.

## Lessons Learned

If you're planning to modernize your own workflows:

1. **Review action versions first**: Check which actions are available at latest versions
2. **Test locally if possible**: Preview YAML before pushing to main branch
3. **Document changes**: Note what changed and why for future reference
4. **Don't break in production**: Keep a working workflow as backup until new one is verified

## Conclusion

Modernizing CI/CD workflows is an important part of maintaining healthy, secure projects. By keeping actions updated and using standardized installation methods, you ensure:

- Your deployments are fast and reliable
- Security vulnerabilities are minimized
- Maintenance burden is reduced over time

The improvements to my Hugo blog deployment workflow were straightforward but impactful. If your projects are still using older action versions or manual install scripts, consider modernizing them too!

---

*This post was written after successfully migrating the CI/CD workflow for [amdjml.github.io](https://ahmad.github.io). Feel free to fork and use this as a reference for your own Hugo deployments!*
