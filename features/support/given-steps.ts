import { Given } from 'cucumber'
import fs from 'fs-extra'
import mkdirp from 'mkdirp'
import path from 'path'
import { cp } from 'shelljs'

Given('a broken file {string}', async function(filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== '.') {
    mkdirp.sync(path.join(this.rootDir, subdir))
  }
  await fs.writeFile(
    path.join(this.rootDir, filePath),
    `
      <a href="missing">
      </a>
      `
  )
})

Given('a runnable file {string}', async function(filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== '.') {
    const subdirPath = path.join(this.rootDir, subdir)
    let subdirExists = false
    try {
      await fs.stat(subdirPath)
      subdirExists = true
    } catch (e) {
      // nothing to do here
    }
    if (!subdirExists) {
      await fs.mkdir(subdirPath)
    }
  }
  await fs.writeFile(
    path.join(this.rootDir, filePath),
    '<a textrun="verify-workspace-contains-directory">`.`</a>'
  )
})

Given(
  'I am in a directory that contains documentation without a configuration file',
  async function() {
    await fs.writeFile(
      path.join(this.rootDir, '1.md'),
      '<code textrun="cd">.</code>'
    )
  }
)

Given('I am in a directory that contains the {string} example', async function(
  exampleName
) {
  await fs.copy(
    path.join('documentation', 'examples', exampleName),
    this.rootDir
  )
})

Given(
  'I am in a directory that contains the {string} example with the configuration file:',
  async function(exampleName, configFileContent) {
    await fs.copy(
      path.join('documentation', 'examples', exampleName),
      this.rootDir
    )
    await fs.writeFile(
      path.join(this.rootDir, 'text-run.yml'),
      configFileContent
    )
  }
)

Given(
  /^I am in a directory that contains the "([^"]*)" example(?: without a configuration file)$/,
  async function(exampleName) {
    await fs.copy(
      path.join('documentation', 'examples', exampleName),
      this.rootDir
    )
  }
)

Given('my source code contains the directory {string}', function(dirName) {
  mkdirp.sync(path.join(this.rootDir, dirName))
})

Given('my source code contains the file {string}', async function(fileName) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, fileName), 'content')
})

Given('my source code contains the file {string} with content:', async function(
  fileName,
  content
) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, fileName), content)
})

Given('my workspace contains the file {string}', async function(fileName) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, 'tmp', fileName), 'content')
})

Given(
  'my workspace contains a file {string} with content {string}',
  async function(fileName, content) {
    mkdirp.sync(path.join(this.rootDir, 'tmp', path.dirname(fileName)))
    await fs.writeFile(path.join(this.rootDir, 'tmp', fileName), content)
  }
)

Given('my workspace contains testable documentation', async function() {
  await fs.writeFile(
    path.join(this.rootDir, '1.md'),
    `
<a textrun="run-console-command">
\`\`\`
echo "Hello world"
\`\`\`
</a>
    `
  )
})

Given('my workspace contains the HelloWorld activity', async function() {
  mkdirp.sync(path.join(this.rootDir, 'text-run'))
  await fs.writeFile(
    path.join(this.rootDir, 'text-run', 'hello-world.js'),
    `
    module.exports = function ({formatter}) { formatter.log('Hello World!') }`
  )
})

Given('my workspace contains the file {string} with content:', async function(
  fileName,
  content
) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', path.dirname(fileName)))
  await fs.writeFile(path.join(this.rootDir, 'tmp', fileName), content)
})

Given('my text-run configuration contains:', async function(text) {
  await fs.appendFile(path.join(this.rootDir, 'text-run.yml'), `\n${text}`)
})

Given('my workspace contains a directory {string}', function(dir) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', dir))
})

Given('my workspace contains an empty file {string}', async function(fileName) {
  await fs.writeFile(path.join(this.rootDir, fileName), '')
})

Given('my workspace contains an image {string}', function(imageName) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(imageName)))
  cp(
    path.join(__dirname, path.basename(imageName)),
    path.join(this.rootDir, imageName)
  )
})

Given('the configuration file:', async function(content) {
  await fs.writeFile(path.join(this.rootDir, 'text-run.yml'), content)
})
