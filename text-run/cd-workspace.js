module.exports = async function cdWorkspace(args) {
  args.formatter.log('cd into the workspace')
  console.log(args)
  process.chdir(args.configuration.workspace)
}
