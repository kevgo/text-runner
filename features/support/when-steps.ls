require! {
  'ncp'
  'nitroglycerin' : N
}


module.exports = ->

  @When /^(trying to execute|executing) the "([^"]+)" example$/, timeout: 100_000, (trying, example-name, done) ->
    ncp "examples/#{example-name}" @root-dir.name, N ~>
      @execute command: 'run', ~>
        finish trying is 'trying to execute', (@error or @exit-code), done


  @When /^(trying to run|running) "([^"]*)"$/ (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      finish trying is 'trying to run', (@error or @exit-code), done


  @When /^(trying to run|running) text\-run$/, (trying, done) ->
    @execute command: 'run', cwd: @root-dir.name, ~>
      finish trying is 'trying to run', (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the arguments? "([^"]*)"$/ (trying, options-text, done) ->
    [command, ...options] = options-text.split ' '
    @execute {command, options, cwd: @root-dir.name}, ~>
      finish trying is 'trying to run', (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the options? {([^}]*)}$/ (trying, options-text, done) ->
    options = JSON.parse("{#{options-text}}")
    @execute {command: 'run', options, cwd: @root-dir.name}, ~>
      finish trying is 'trying to run', (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the "([^"]*)" formatter$/ (trying, formatter-name, done) ->
    @execute command: 'run', cwd: @root-dir.name, options: {formatter: formatter-name}, ~>
      finish trying is 'trying to run', (@error or @exit-code), done


  @When /^(trying to run|running) the "([^"]*)" command$/, (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      finish trying is 'trying to run', (@error or @exit-code), done



function finish trying, error, done
  if trying
    done !error
  else
    done error
