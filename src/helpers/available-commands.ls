require! {
  'fs'
  'path'
}

# returns a list of all available commands
module.exports = ->
  fs.readdir-sync path.join(__dirname, '..', 'commands')
