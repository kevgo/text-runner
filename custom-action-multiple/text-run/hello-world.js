module.exports = {
  hello: (action) => {
    action.log("Hello World!")
  },
  morning: (action) => {
    action.log("Good morning")
  },
  evening: (action) => {
    action.log("Good evening")
  },
}
