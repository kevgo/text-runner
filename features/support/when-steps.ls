require! {
  'ncp'
  'nitroglycerin' : N
}


module.exports = ->

  @When /^(trying to execute|executing) the "([^"]+)" example$/, timeout: 100_000, (trying-text, example-name, done) ->
    expect-error = determine-expect-error trying-text
    ncp "examples/#{example-name}" @root-dir.name, N ~>
      @execute {command: 'run', expect-error}, ~>
        finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) "([^"]*)"$/ (trying-text, command, done) ->
    expect-error = determine-expect-error trying-text
    @execute {command, cwd: @root-dir.name, expect-error}, ~>
      finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) text\-run$/, (trying-text, done) ->
    expect-error = determine-expect-error trying-text
    @execute {command: 'run', cwd: @root-dir.name, expect-error}, ~>
      finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the arguments? "([^"]*)"$/ (trying-text, options-text, done) ->
    expect-error = determine-expect-error trying-text
    [command, ...options] = options-text.split ' '
    @execute {command, options, cwd: @root-dir.name, expect-error}, ~>
      finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the arguments? {([^}]*)}$/ (trying-text, args-text, done) ->
    expect-error = determine-expect-error trying-text
    args = JSON.parse("{#{args-text}}")
    args.command = 'run'
    args.cwd = @root-dir.name
    args.expect-error = expect-error
    @execute args, ~>
      finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) text\-run with the "([^"]*)" formatter$/ (trying-text, formatter-name, done) ->
    expect-error = determine-expect-error trying-text
    @execute {command: 'run', cwd: @root-dir.name, options: {formatter: formatter-name}, expect-error}, ~>
      finish expect-error, (@error or @exit-code), done


  @When /^(trying to run|running) the "([^"]*)" command$/, (trying-text, command, done) ->
    expect-error = determine-expect-error trying-text
    @execute {command, cwd: @root-dir.name, expect-error}, ~>
      finish expect-error, (@error or @exit-code), done



function determine-expect-error trying-text
  switch
  | trying-text is 'running'    =>  return no
  | trying-text is 'executing'  =>  return no
  | otherwise                   =>  return yes


function finish trying, error, done
  if trying
    done !error
  else
    done error
