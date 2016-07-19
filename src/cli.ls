require! {
  'chalk' : {red}
  './tutorial-runner' : TutorialRunner
}


runner = new TutorialRunner
  ..on 'error', (err) -> console.log red err
  ..on 'fail', -> process.exit 1
  ..run process.cwd!
