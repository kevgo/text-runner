require! {
  'end-child-processes'
  'fs-extra' : fs
  'glob'
  'path'
  'rimraf'
  'shelljs/global'
  'tmp'
  'wait' : {wait}
}


module.exports = ->

  @set-default-timeout 5000


  @Before ->
    @root-dir = tmp.dir-sync unsafe-cleanup: yes


  @After (scenario, done) ->
    end-child-processes ~>
      if scenario.is-failed!
        console.log "\n\n", "Failing scenario:", scenario.get-name!
        console.log "\n", scenario.get-exception!
        console.log "\ntest artifacts are located in", @root-dir.name
        done!
      else
        wait 1, ~>
          try
            @root-dir.remove-callback!
          catch
            console.log e
          finally
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
