# Evelyn

**Evelyn** is an open-source extension that adds Reddit comments to any Dropout videos you watch. Pretty much a copy of [Karamel](https://github.com/odensc/karamel)

[Changelog](https://github.com/remotesojourner/Evelyn/blob/main/CHANGELOG.md)

_Contributions welcome! If you have any questions related to development, a bug report, or feature request - feel free to create a new issue!_

## Dev Setup

Requires **Node.js LTS** (v20+).

```bash
npm install
# set BROWSER to chrome or firefox
BROWSER=chrome npm start
```

Then load the `dist-chrome` or `dist-firefox` folder as an unpacked extension.

## Build

```bash
BROWSER=firefox npm run build
BROWSER=firefox ./package.sh
```

## Tech Stack

- **React 18** with TypeScript 5
- **Redux** + **redux-observable** (RxJS) for state management
- **React Router v6** for in-extension navigation
- **i18next** + **react-i18next** for translations
- **Webpack 5** with Sass/PostCSS
- **ESLint** with `@typescript-eslint` for linting
