const fs = require("fs-extra")
const os = require("os")
const path = require("path")
const uuid = require("uuid")

module.exports = async function cdIntoEmptyTmpFolder(args) {
  const newFolder = path.join(os.tmpdir(), uuid.v4())
  await fs.mkdir(newFolder)
  args.log("cd " + newFolder)
  process.chdir(newFolder)
}
