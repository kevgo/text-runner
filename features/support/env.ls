require! {
  'end-child-processes'
  'fs-extra' : fs
  'glob'
  'path'
  'rimraf'
  'shelljs/global'
  'tmp'
  'touch'
  'wait' : {wait}
}


module.exports = ->

  @set-default-timeout 3000


  @Before ->
    @root-dir = tmp.dir-sync unsafe-cleanup: yes


  @After (scenario, done) ->
    end-child-processes ~>
      if scenario.is-failed!
        console.log "\ntest artifacts are located in #{@root-dir.name}"
        done!
      else
        wait 1, ~>
          @root-dir.remove-callback!
          done!


  @Before tags: ['@verbose'], ->
    @verbose = on


  @After tags: ['@verbose'], ->
    @verbose = off


  @Before tags: ['@debug'], ->
    @debug = on
    @verbose = on


  @After tags: ['@debug'], ->
    @debug = off
    @verbose = off
