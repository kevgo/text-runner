require! {
  'ncp'
  'nitroglycerin' : N
}


module.exports = ->

  @When /^(trying to execute|executing) the "([^"]+)" example$/, timeout: 100_000, (trying, example-name, done) ->
    ncp "examples/#{example-name}" @root-dir.name, N ~>
      @execute command: 'run', ~>
        done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) the "([^"]*)" command$/, (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) "([^"]*)"$/ (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) text\-run$/ (trying, done) ->
    @execute command: 'run', cwd: @root-dir.name, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) text\-run with the arguments? "([^"]*)"$/ (trying, args, done) ->
    [command, ...args] = args.split ' '
    @execute {command, args, cwd: @root-dir.name}, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) text\-run with the "([^"]*)" formatter$/ (trying, formatter-name, done) ->
    @execute command: 'run', cwd: @root-dir.name, formatter: formatter-name, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)
