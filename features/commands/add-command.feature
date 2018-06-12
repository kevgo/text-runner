Feature: adding new handler functions

  When developing the test harness for my documentation
  I want to have the ability to generate new handler functions
  So that I don't need to copy-and-paste code.

  - run "text-run add <step-name>" to generate a new handler function for the given block


  Scenario: adding a new step
    When running "text-run add new-step"
    Then it generates the file "text-run/new-step.js" with content:
      """
      module.exports = async function (activity) {
        console.log('This code runs inside the "new-step" block implementation.')
        console.log('I found these elements in your document:')
        console.log(activity.nodes)

        // capture content from the document
        // const content = activity.searcher.tagContent('boldtext')
        // do something with the content
        // formatter.log(content)
      }

      """
