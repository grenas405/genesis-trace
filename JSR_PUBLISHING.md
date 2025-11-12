# JSR Publishing Guide for @pedromdominguez/genesis-trace

This document explains how to publish updates of the genesis-trace library to JSR (JavaScript Registry).

## Prerequisites

1. **JSR Account**: Create an account at https://jsr.io
2. **GitHub Repository**: Ensure the repository is public and accessible
3. **Permissions**: You need publish access to the `@pedromdominguez` scope on JSR

## File Structure for JSR

The following files configure JSR publishing:

### deno.json

Contains package metadata and configuration:

```json
{
  "name": "@pedromdominguez/genesis-trace",
  "version": "1.0.0",
  "description": "...",
  "author": "Pedro M. Dominguez",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/grenas405/genesis-trace"
  },
  "exports": "./mod.ts"
}
```

### jsr.json

Specifies what to include/exclude in the published package:

```json
{
  "name": "@pedromdominguez/genesis-trace",
  "version": "1.0.0",
  "exports": "./mod.ts",
  "publish": {
    "include": [
      "mod.ts",
      "core/**/*.ts",
      "components/**/*.ts",
      "adapters/**/*.ts",
      "themes/**/*.ts",
      "plugins/**/*.ts",
      "interfaces/**/*.ts",
      "utils/**/*.ts",
      "README.md",
      "LICENSE"
    ],
    "exclude": [
      "examples/**",
      "introspection/**",
      "test.ts",
      "**/*.test.ts",
      "logs/**"
    ]
  }
}
```

## Publishing Methods

### Method 1: Automatic via GitHub Actions (Recommended)

The workflow is triggered when you push a version tag:

```bash
# 1. Update version in both deno.json and jsr.json
#    Example: Change "version": "1.0.0" to "version": "1.0.1"

# 2. Commit the version changes
git add deno.json jsr.json
git commit -m "Bump version to 1.0.1"

# 3. Create and push the tag
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

The GitHub Action (`.github/workflows/publish.yml`) will:
- Checkout the code
- Set up Deno
- Run tests (if they pass)
- Publish to JSR
- Create release notes

### Method 2: Manual Publishing

If you need to publish manually:

```bash
# 1. Ensure you're in the genesis-trace directory
cd utils/genesis-trace

# 2. Update versions in deno.json and jsr.json

# 3. Test the package locally
deno task test

# 4. Check formatting and linting
deno fmt --check
deno lint

# 5. Dry run to verify everything
deno publish --dry-run

# 6. Authenticate with JSR (first time only)
deno auth login jsr

# 7. Publish to JSR
deno publish
```

### Method 3: Manual Trigger via GitHub UI

You can manually trigger the publish workflow:

1. Go to the repository on GitHub
2. Navigate to Actions → Publish to JSR
3. Click "Run workflow"
4. Select the branch
5. (Optional) Enter a version number
6. Click "Run workflow"

## Version Management

### Semantic Versioning

Follow semantic versioning (semver) for all releases:

- **MAJOR** (x.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.x.0): New features, backwards-compatible
- **PATCH** (0.0.x): Bug fixes, backwards-compatible

### Version Checklist

Before publishing a new version:

- [ ] Update `version` in `deno.json`
- [ ] Update `version` in `jsr.json`
- [ ] Update CHANGELOG.md (if exists)
- [ ] Commit version changes
- [ ] Create git tag (format: `v1.0.0`)
- [ ] Push tag to trigger publish

### Version Examples

```bash
# Patch release (bug fixes)
v1.0.0 → v1.0.1

# Minor release (new features)
v1.0.1 → v1.1.0

# Major release (breaking changes)
v1.1.0 → v2.0.0

# Pre-release versions
v1.0.0-alpha.1
v1.0.0-beta.1
v1.0.0-rc.1
```

## What Gets Published

### Included Files

Based on `jsr.json` configuration:

- ✅ All TypeScript source files in `core/`, `components/`, `adapters/`, etc.
- ✅ `mod.ts` (main export file)
- ✅ `README.md`
- ✅ `LICENSE`

### Excluded Files

- ❌ Examples (`examples/**`)
- ❌ Tests (`test.ts`, `**/*.test.ts`)
- ❌ Introspection demos
- ❌ Log files
- ❌ Git files (`.git`, `.gitignore`)
- ❌ Editor configs (`.vscode`, etc.)

## Verifying Published Package

After publishing, verify the package:

### 1. Check JSR Website

Visit: https://jsr.io/@pedromdominguez/genesis-trace

Verify:
- Version number is correct
- README displays properly
- All exports are listed
- Documentation is generated

### 2. Test Import

Create a test file:

```typescript
// test-import.ts
import { ConsoleStyler, Logger } from "jsr:@pedromdominguez/genesis-trace@1.0.1";

const logger = new Logger({ level: "info" });
logger.info("Testing JSR import!");

ConsoleStyler.logSuccess("Package imported successfully!");
```

Run it:

```bash
deno run test-import.ts
```

### 3. Check with deno.land

JSR packages are also available via deno.land/x cache:

```bash
deno info jsr:@pedromdominguez/genesis-trace
```

## Troubleshooting

### Authentication Issues

```bash
# Clear auth and re-login
rm -rf ~/.deno/auth
deno auth login jsr
```

### Publish Fails: "Module not found"

- Check that all imports use relative paths correctly
- Verify `exports` in deno.json points to valid file
- Ensure all imported files are in the `include` list

### Publish Fails: "Invalid version"

- Version must follow semver: `MAJOR.MINOR.PATCH`
- Version must be higher than current published version
- No leading zeros (❌ `01.0.0`, ✅ `1.0.0`)

### Publish Fails: "Type checking errors"

```bash
# Check for TypeScript errors
deno check mod.ts

# Check all files
deno check --all
```

### GitHub Action Fails

1. Check the Actions tab for error logs
2. Verify GitHub Actions is enabled for the repo
3. Ensure the workflow file is valid YAML
4. Check that the repository has proper permissions

### Package Shows Old Version

JSR caching may delay updates. Clear cache:

```bash
deno cache --reload jsr:@pedromdominguez/genesis-trace
```

## Best Practices

### Before Publishing

1. **Run tests**: `deno task test`
2. **Format code**: `deno fmt`
3. **Lint code**: `deno lint`
4. **Type check**: `deno check mod.ts`
5. **Dry run**: `deno publish --dry-run`

### Documentation

- Keep README.md up to date with examples
- Document breaking changes in commit messages
- Use clear commit messages (e.g., "feat: add progress bar", "fix: color reset")

### Security

- Review all code before publishing
- Don't include sensitive data (API keys, tokens)
- Keep dependencies minimal and audited
- Use `--allow-dirty` only when necessary

## CI/CD Workflow Details

### Publish Workflow

File: `.github/workflows/publish.yml`

**Triggers**:
- Push of tags matching `v*` pattern
- Manual dispatch via GitHub UI

**Steps**:
1. Checkout code
2. Setup Deno environment
3. Run tests (soft fail)
4. Publish to JSR
5. Create release summary

### CI Workflow

File: `.github/workflows/ci.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Tests**:
- Format checking
- Linting
- Type checking
- Test suite
- Dry-run publish

**Matrix**:
- Ubuntu, macOS, Windows
- Latest stable Deno

## Package Consumers

Once published, users can import the package in three ways:

### 1. Direct JSR Import

```typescript
import { ConsoleStyler } from "jsr:@pedromdominguez/genesis-trace@1.0.0";
```

### 2. Import Map (Recommended)

In `deno.json`:

```json
{
  "imports": {
    "@console": "jsr:@pedromdominguez/genesis-trace@^1.0.0"
  }
}
```

Then in code:

```typescript
import { ConsoleStyler } from "@console";
```

### 3. Via npm (for Node.js projects)

JSR packages can also be used in Node.js via npx:

```bash
npx jsr install @pedromdominguez/genesis-trace
```

## Maintenance Schedule

### Regular Updates

- **Monthly**: Dependency updates, security patches
- **Quarterly**: Feature releases
- **As needed**: Critical bug fixes

### End of Life

When deprecating versions:

1. Announce in README
2. Create migration guide
3. Support old version for 6 months
4. Archive old documentation

## Support

For issues with JSR publishing:

- JSR Documentation: https://jsr.io/docs
- JSR Discord: https://discord.gg/deno
- GitHub Issues: Create an issue in the repository

## Quick Reference

```bash
# Update version and publish
vim deno.json jsr.json          # Update version
git add deno.json jsr.json
git commit -m "Bump version to 1.x.x"
git tag v1.x.x
git push origin main v1.x.x

# Manual publish
deno publish --dry-run          # Test
deno publish                    # Publish

# Verify
deno info jsr:@pedromdominguez/genesis-trace
deno run -E jsr:@pedromdominguez/genesis-trace/examples/basic.ts
```

---

**Last Updated**: 2025-11-11
**Current Version**: 1.0.0
**Maintainer**: Pedro M. Dominguez (@pedromdominguez on JSR / @grenas405 on GitHub)
