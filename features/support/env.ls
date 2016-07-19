module.exports = ->

  @set-default-timeout 500


  @Before tags: ['@verbose'], ->
    @verbose = on

  @After tags: ['@verbose'], ->
    @verbose = off

  @Before tags: ['@debug'], ->
    @debug = on

  @After tags: ['@debug'], ->
    @debug = off
