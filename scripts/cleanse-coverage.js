// This script converts the coverage files created by the CLI coverage tests
// into a format that is compatible with the rest of the coverage files.

const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const path = require('path')
const { promisify } = require('util')
const readjson = promisify(jsonfile.readFile)
const writejson = promisify(jsonfile.writeFile)

async function main () {
  let directories = ['.nyc_output_api']
  // const directories = ['.nyc_output_tests', '.nyc_output_api', '.nyc_output_text_run']
  let cliDirs = fs.readdirSync('.nyc_output_cli')
  cliDirs = cliDirs.map(dir => path.join('.nyc_output_cli', dir))
  directories = directories.concat(cliDirs)
  await Promise.all(directories.map(mergeAndCleanseDir))
}

async function mergeAndCleanseDir (dir) {
  let files = await fs.readdir(dir)
  const mergeFile = mergeAndCleanseFile.bind(this, dir)
  files.forEach(mergeFile)
}

async function mergeAndCleanseFile (dir, filename) {
  const filepath = path.join(process.cwd(), dir, filename)
  const filedata = await readjson(filepath)
  if (Object.keys(filedata).length === 0) return
  const result = {}
  for (let key of Object.keys(filedata)) {
    if (re.test(key)) continue
    result[key] = filedata[key]
  }

  const writepath = path.join('.nyc_output', filename)
  console.log('wrote file:', writepath)
  await writejson(writepath, JSON.stringify(result))
}

const re = /\/dist\//

main()
