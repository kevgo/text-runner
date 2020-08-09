const path = require("path")

module.exports = {
  globals: {
    "text-run": path.join(__dirname, "..", "text-runner", "bin", "text-run"),
  },
}
