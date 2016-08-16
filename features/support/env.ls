require! {
  'fs'
  'path'
  'rimraf'
}


module.exports = ->

  @set-default-timeout 2000

  @Before ->
    rimraf.sync 'tmp'
    fs.mkdir-sync 'tmp'

  @After ->
    process.chdir path.join __dirname, '..', '..'

  @Before tags: ['@verbose'], ->
    @verbose = on

  @After tags: ['@verbose'], ->
    @verbose = off

  @Before tags: ['@debug'], ->
    @debug = on

  @After tags: ['@debug'], ->
    @debug = off
