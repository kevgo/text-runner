module.exports = async function (args) {
  const packageDefinition = require("../package.json")
  if (packageDefinition.private === undefined) {
    throw new Error("this codebase is not a Yarn workspace")
  }
}
