module.exports = async function cdWorkspace(args) {
  args.formatter.log('cd into the workspace')
  process.chdir(args.configuration.workspace)
}
