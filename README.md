# M-Play

An Angular Material music-discovery app with a shared preview player, search, and a browser-persisted liked-songs library.

## Run locally

Run `npm install` and `npm start`, then open `http://localhost:4200/`. Run `npm test -- --watch=false --browsers=ChromeHeadless` for unit tests or `npm run build` for a production build.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Music catalog

Search and browse use Apple's public iTunes Search API; no API key is required. Playback is limited to the preview audio URLs returned by that API, typically around 30 seconds per track. This app does not provide full-song streaming, user accounts, or cloud-synced playlists. Liked tracks and the selected color theme are stored in the current browser's local storage.
