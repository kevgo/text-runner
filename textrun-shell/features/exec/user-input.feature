Feature: running console commands

  Scenario: entering simple text into the console
    Given the source code contains a file "create-echo-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**echo.js** with content:

      ```
      import * as readline from "readline"
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
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME              | LINE | ACTION                   | ACTIVITY                              | OUTPUT                     |
      | create-echo-server.md | 1    | workspace/new-file       | create file echo.js                   | create file echo.js        |
      | enter-input.md        | 1    | shell/command-with-input | running console command: node echo.js | Your inputYou entered: 123 |

  Scenario: entering complex text into the console
    Given the source code contains a file "create-input-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**input.js** with content:

      ```
      import * as readline from "node:readline"
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
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME               | LINE | ACTION                   | ACTIVITY                               | OUTPUT                                                                                          |
      | create-input-server.md | 1    | workspace/new-file       | create file input.js                   | create file input.js                                                                            |
      | enter-input.md         | 1    | shell/command-with-input | running console command: node input.js | Name of the service to add\nDescription\nservice: html-server, description: serves the HTML UI! |

  Scenario: provide the command to run via an attribute
    Given the source code contains a file "create-echo-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**echo.js** with content:

      ```
      import * as readline from "readline"
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
      <a type="shell/command-with-input" command="node echo.js">

      Now enter this:

      <table>
        <tr>
          <td>123</td>
        </tr>
      </table>

      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME              | LINE | ACTION                   | ACTIVITY                              | OUTPUT                     |
      | create-echo-server.md | 1    | workspace/new-file       | create file echo.js                   | create file echo.js        |
      | enter-input.md        | 1    | shell/command-with-input | running console command: node echo.js | Your inputYou entered: 123 |
