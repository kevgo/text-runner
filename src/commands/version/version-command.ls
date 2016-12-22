require! {
  '../../../package.json' : {version}
}


class VersionCommand

  ->

  run: (done) ->
    console.log "Tutorial Runner v#{version}"
    done!


module.exports = VersionCommand
