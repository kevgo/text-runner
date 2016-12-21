# trims the leading dollar from the given command
module.exports = function trim-dollar text
  text.replace /^\$?\s*/, ''
