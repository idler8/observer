const fs = require('fs');
const path = require('path');
const version = (process.env.GITHUB_REF || 'v0.0.1-0').replace("refs/tags/", "");
function makePackageFile(project, packageJson) {
  const npmPublishDir = path.resolve(__dirname, '../packages/' + project + '/libs/rollup')
  fs.writeFileSync(path.resolve(npmPublishDir, 'package.json'), JSON.stringify({
    name: "@idler8/" + project,
    version: version,
    main: "./index.js",
    author: {
      name: "闲人",
      email: 'code@idler8.com'
    },
    homepage: "https://github.com/idler8/observer",
    repository: {
      "type": "git",
      "url": "https://github.com/idler8/observer"
    },
    ...packageJson
  }))
  fs.writeFileSync(path.resolve(npmPublishDir, 'README.md'), `
  ## 该项目来自Github Actions自动构建
  更多说明请查看[Github仓库]("https://github.com/idler8/observer")
  `)
}
makePackageFile('observer', {
  keywords: [
    "observer",
    "events",
    "listener"
  ],
})
makePackageFile('form-react', {
  keywords: [
    "observer",
    "react",
    "form",
    "field",
    "input"
  ],
  dependencies: {
    "@idler8/observer": "~" + version
  },
})