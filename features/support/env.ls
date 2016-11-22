require! {
  'end-child-processes'
  'fs-extra' : fs
  'glob'
  'path'
  'rimraf'
  'shelljs/global'
  'tmp'
  'touch'
}


module.exports = ->

  @set-default-timeout 2000


  @Before ->
    @root-dir = tmp.dir-sync unsafe-cleanup: yes


  @After (scenario, done) ->
    if scenario.is-failed!
      console.log "\ntest artifacts are located in #{@root-dir.name}"
    else
      @root-dir.remove-callback!
    end-child-processes done


  @Before tags: ['@verbose'], ->
    @verbose = on


  @After tags: ['@verbose'], ->
    @verbose = off


  @Before tags: ['@debug'], ->
    @debug = on


  @After tags: ['@debug'], ->
    @debug = off
