Feature: adding new actions

  Scenario: adding a new step via CLI
    When running "text-run scaffold new-step"
    Then it creates the file "text-run/new-step.js" with content:
      """
      module.exports = async function (action) {
        console.log('This code runs inside the "new-step" region implementation.')
        console.log('I found these elements in your document:')
        console.log(action.region)

        // capture content from the document
        // const content = activity.searcher.tagContent('boldtext')
        // do something with the content
        // action.log(content)
      }

      """

  Scenario: adding a new step via API
    When calling "textRunner.scaffoldCommand('new-step', sourceDir)"
    Then it creates the file "text-run/new-step.js" with content:
      """
      module.exports = async function (action) {
        console.log('This code runs inside the "new-step" region implementation.')
        console.log('I found these elements in your document:')
        console.log(action.region)

        // capture content from the document
        // const content = activity.searcher.tagContent('boldtext')
        // do something with the content
        // action.log(content)
      }

      """
