require! {
  'fs'
  'rimraf'
}


module.exports = ->

  @set-default-timeout 500

  @Before ->
    rimraf.sync 'tmp'
    fs.mkdir-sync 'tmp'

  @Before tags: ['@verbose'], ->
    @verbose = on

  @After tags: ['@verbose'], ->
    @verbose = off

  @Before tags: ['@debug'], ->
    @debug = on

  @After tags: ['@debug'], ->
    @debug = off
