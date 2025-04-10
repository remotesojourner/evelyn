# Evelyn

**Evelyn** is an open-source extension that adds Reddit comments to any Dropout videos you watch. Pretty much a copy of [Karamel](https://github.com/odensc/karamel)

[Changelog](https://github.com/remotesojourner/Evelyn/blob/main/CHANGELOG.md)

_Contributions welcome! If you have any questions related to development, a bug report, or feature request - feel free to create a new issue!_

## Dev Setup

Requires **node v8** currently as we use some older libraries.

```bash
npm install
# set BROWSER to chrome or firefox
BROWSER=chrome npm start
```

Then load the `dist` folder as an unpacked extension.

## Build

```bash
BROWSER=firefox npm run build
BROWSER=firefox ./package.sh
```
