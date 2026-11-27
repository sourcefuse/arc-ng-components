# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.2.0](https://github.com/sourcefuse/arc-ng-components/compare/@sourceloop/ai-assistant-client@0.1.0...@sourceloop/ai-assistant-client@0.2.0) (2026-11-27)

### Bug Fixes

- **deps:** address review feedback on ai-assistant lockfiles and scripts ([083c1d6](https://github.com/sourcefuse/arc-ng-components/commit/083c1d641c146c0151009d17687579e647045b29)), closes [#93](https://github.com/sourcefuse/arc-ng-components/issues/93)

### Features

- **ai-assistant:** migrate ai-assistant to angular 22 and fix vantage vulnerabilities ([22c8d59](https://github.com/sourcefuse/arc-ng-components/commit/22c8d598cedf73a3088aaec687dafa9b83b754f4)), closes [#93](https://github.com/sourcefuse/arc-ng-components/issues/93)
- **sandbox:** add ai-assistant sandbox example in package ([#22](https://github.com/sourcefuse/arc-ng-components/issues/22)) ([cfa4d20](https://github.com/sourcefuse/arc-ng-components/commit/cfa4d20bc9fc4fa93dbaf31b6a68ebe9a9f326ee))

### BREAKING CHANGES

- **ai-assistant:** @sourceloop/ai-assistant-client now requires angular 22
  (@angular/core, common, cdk and elements ^22.2.6) and @angular/material 22.
  Apps that style dialogs through .mat-dialog-container need the mdc dialog
  classes or tokens instead.

# 0.1.0 (2025-03-13)

### Features

- **ai-assistant:** add ai-assistant library ([#21](https://github.com/sourcefuse/arc-ng-components/issues/21)) ([26597b3](https://github.com/sourcefuse/arc-ng-components/commit/26597b3f5dc219075473503fd15c7494ea665553))
