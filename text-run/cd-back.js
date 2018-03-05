module.exports = async function ({ formatter }) {
  if (global.cdHistory == null) throw new Error('no CD history')
  formatter.output('cd ' + global.cdHistory)
  process.chdir(global.cdHistory)
}
