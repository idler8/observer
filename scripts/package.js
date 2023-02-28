const fs = require('fs');
const path = require('path');
const version = (process.env.GITHUB_REF || 'v0.0.1-0').replace("refs/tags/", "");
const corePackageTarget = path.resolve(__dirname, '../packages/observer/libs/rollup/package.json')
fs.writeFileSync(corePackageTarget, JSON.stringify({
  name: "@idler8/observer",
  version: version,
  main: "./index.js",
}))
const formReactPackageTarget = path.resolve(__dirname, '../packages/form-react/libs/rollup/package.json')
fs.writeFileSync(formReactPackageTarget, JSON.stringify({
  name: "@idler8/form-react",
  version: version,
  main: "./index.js",
  "dependencies": {
    "@idler8/observer": "~" + version
  },
}))