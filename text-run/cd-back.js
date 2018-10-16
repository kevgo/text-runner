module.exports = async function(args) {
  if (global.cdHistory == null) throw new Error("no CD history")
  args.formatter.log("cd " + global.cdHistory)
  process.chdir(global.cdHistory)
}
