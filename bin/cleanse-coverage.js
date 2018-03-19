// This script converts the coverage files created by the CLI coverage tests
// into a format that is compatible with the rest of the coverage files.

const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const path = require('path')

async function main() {
  const directories = ['.nyc_output_api']
  // const directories = ['.nyc_output_tests', '.nyc_output_api', '.nyc_output_text_run']
  // directories.concat(fs.readdirSync('.nyc_output_cli'))
  await Promise.all(directories.map(mergeAndCleanseDir))
}

async function mergeAndCleanseDir(dir) {
  console.log(dir)
  let files = await fs.readdir(dir)
  files = files.map(file => path.join(dir, file))
  console.log(files)
  files.forEach(mergeAndCleanseFile)
}

async function mergeAndCleanseFile(filename) {
  const filepath = path.join(process.cwd(), filename)
  console.log('filepath:', filepath)
  const filedata = await jsonfile.readFile(filepath)
  console.log(filedata)
  const result = {}
  for (let key of Object.keys(filedata)) {
    if (re.test(key)) continue
    result[key] = filedata[key]
  }

  await jsonfile.writeFile(path.join('.nyc_output', filename), JSON.stringify(result))
}

const re = /\/dist\//

main()
