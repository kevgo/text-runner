Feature: running console commands

  Scenario: entering simple text into the console
    Given the source code contains a file "create-echo-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**echo.js** with content:

      ```
      const readline = require("readline")
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      })

      rl.question("Your input", (answer) => {
        console.log("You entered:", answer)
        rl.close()
        process.exit()
      })
      ```
      """
    And the source code contains a file "enter-input.md" with content:
      """
      <a type="shell/command-with-input">

      Run `node echo.js` and enter:

      <table>
        <tr>
          <td>123</td>
        </tr>
      </table>

      </a>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | enter-input.md                        |
      | LINE     | 1                                     |
      | MESSAGE  | running console command: node echo.js |
    And it prints:
      """
      You entered: 123
      """

  Scenario: entering complex text into the console
    Given the source code contains a file "create-input-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**input.js** with content:

      ```
      const readline = require("readline")
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      })

      rl.question("Name of the service to add\n", (service) => {
        rl.question("Description\n", (description) => {
          console.log(`service: ${service}, description: ${description}!`)
          rl.close()
          process.exit()
        })
      })
      ```
      """
    And the source code contains a file "enter-input.md" with content:
      """
      <a type="shell/command-with-input">

      Run `node input.js` and enter:

      <table>
        <tr>
          <th>When you see this</th>
          <th>then you enter</th>
        </tr>
        <tr>
          <td>Name of the service to add</td>
          <td>html-server</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>serves the HTML UI</td>
        </tr>
      </table>

      </a>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | enter-input.md                         |
      | LINE     | 1                                      |
      | MESSAGE  | running console command: node input.js |
    And it prints:
      """
      service: html-server, description: serves the HTML UI
      """
