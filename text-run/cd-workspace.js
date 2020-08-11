module.exports = async function cdWorkspace(args) {
  args.log("cd into the workspace")
  process.chdir(args.configuration.workspace)
}
