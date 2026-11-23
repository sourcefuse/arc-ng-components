# AiAssistantExample

Example Angular 22 app that opens the AI assistant from `@sourceloop/ai-assistant-client`.

The sandbox uses the local build of the library (`file:../../packages/ai-assistant/projects/ai-assistant-lib/dist`), not the npm package, so changes to the library can be tried here before they are published.

## Requirements

- Node.js ^22.22.3, ^24.15.0 or >=26 (Angular 22 requirement)
- npm

## Setup

1. Build the library:

   ```bash
   cd ../../packages/ai-assistant
   npm ci
   npm run build-library
   ```

2. Install the sandbox:

   ```bash
   cd ../../sandbox/ai-assistant-example
   npm ci
   ```

3. Set the SSE URL of your AI service in `src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     sseUrl: 'https://your-api-url.com/ai',
   };
   ```

After changing the library, run `npm run build-library` again and restart `ng serve`.

## Development server

Run `npm start` (or `ng serve`) and open `http://localhost:4200/`. Click "Open Assistify" to open the assistant.

## Build

Run `ng build`. The output goes to `dist/`.

## Running unit tests

Run `ng test` to execute the unit tests with [Karma](https://karma-runner.github.io).

## Further help

See the library README in `packages/ai-assistant` for configuration, the SSE payload and the chunk types the assistant understands.
