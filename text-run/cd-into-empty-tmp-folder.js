const fs = require("fs-extra")
const os = require("os")
const path = require("path")
const uuid = require("uuid/v4")

module.exports = async function cdIntoEmptyTmpFolder(args) {
  const newFolder = path.join(os.tmpdir(), uuid())
  await fs.mkdir(newFolder)
  args.formatter.log("cd " + newFolder)
  process.chdir(newFolder)
}
