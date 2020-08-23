@skipWindows
Feature: running console commands

  Scenario: entering simple text into the console
    Given the source code contains a file "enter-input.md" with content:
      """
      <a type="shell/exec-with-input">

      ```
      $ read foo
      $ echo You entered: $foo xxx
      ```

      <table>
        <tr>
          <td>123</td>
        </tr>
      </table>

      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | enter-input.md                                              |
      | LINE     | 1                                                           |
      | MESSAGE  | running console command: read foo && echo You entered: $foo |
    And it prints:
      """
      You entered: 123
      """

  Scenario: entering complex text into the console
    Given the source code contains a file "enter-input.md" with content:
      """
      <a type="shell/exec-with-input">

      ```
      $ echo "Name of the service to add"
      $ read service_name
      $ echo Description
      $ read description
      $ echo "service: $service_name, description: $description"
      ```

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
    When running text-run
    Then it signals:
      | FILENAME | enter-input.md                                                                                                                                                                      |
      | LINE     | 1                                                                                                                                                                                   |
      | MESSAGE  | running console command: echo "Name of the service to add" && read service_name && echo Description && read description && echo "service: $service_name, description: $description" |
    And it prints:
      """
      service: html-server, description: serves the HTML UI
      """
