require! {
  '../../../package.json' : {version}
}


class VersionCommand

  ->

  run: (done) ->
    console.log "TextRunner v#{version}"
    done!


module.exports = VersionCommand
