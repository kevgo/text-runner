require! {
  'fs'
  'glob'
  'path'
  'rimraf'
  'shelljs/global'
  'touch'
}


module.exports = ->

  @set-default-timeout 2000


  @Before ->
    rimraf.sync 'test-dir'
    fs.mkdir-sync 'test-dir'

    # we need to make sure there is at least an empty config file here,
    # otherwise we might find other ones in a parent directory on the machine
    touch.sync 'test-dir/tut-run.yml'


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


  @register-handler 'AfterFeatures', (features) ->
    delete-all-tmp-folders!



function delete-all-tmp-folders
  for tmp-dir in glob.sync '*/**/test-dir/', ignore: ['test-dir/**', '**/node_modules/**']
    rm '-rf' tmp-dir
