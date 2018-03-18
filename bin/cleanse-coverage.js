// This script converts the coverage files created by the CLI coverage tests
// into a format that is compatible with the rest of the coverage files.

const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const path = require('path')

async function main () {
  const directories = ['.nyc_output_tests', '.nyc_output_api', '.nyc_output_text_run']
  const cliDirs = await fs.readdir('.nyc_output_cli')
  directories.concat(cliDirs)
  const results = directories.map(mergeAndCleanseDir)
  await Promise.all(results)
}

async function mergeAndCleanseDir (dir) {
  const filedata = await jsonfile.readFile(path.join(process.cwd(), dir))
  const filename = path.basename(dir)
  const result = {}
  for (let key of Object.keys(filedata)) {
    if (re.test(key)) continue
    result[key] = filedata[key]
  }

  await jsonfile.writeFile(filename, JSON.stringify(result))
}
const re = /\/dist\//

main()
