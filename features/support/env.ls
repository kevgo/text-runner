require! {
  'fs'
  'path'
  'rimraf'
  'touch'
}


module.exports = ->

  @set-default-timeout 2000

  @Before ->
    rimraf.sync 'tmp'
    fs.mkdir-sync 'tmp'

    # we need to make sure there is at least an empty config file here,
    # otherwise we might find other ones in a parent directory on the machine
    touch.sync 'tmp/tut-run.yml'

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
