@skipWindows
Feature: running console commands

  As a documentation writer
  I want my users to be able to enter text into the console
  So that they can interact with the commands they run.

  - Optionally there can be an HTML table within the "runConsoleCommand" block
    that defines input into the commands.
  - If the table has exactly one column, it contains the input to enter.
  - If the table has more than one column, the first column contains
    console output to wait for, and the last column contains the text to enter.
    All other columns are ignored.
  - The ENTER key is pressed automatically for the user at the end of each input field.
  - Only content in TD cells is used. TH cells are considered labels and ignored.


  Scenario: entering simple text into the console
    Given my source code contains the file "enter-input.md" with content:
      """
      <a textrun="run-console-command">
      ```
      $ read foo
      $ echo You entered: $foo
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
      | LINE     | 12                                                          |
      | MESSAGE  | running console command: read foo && echo You entered: $foo |
    And it prints:
      """
      You entered: 123
      """


  Scenario: entering complex text into the console
    Given my source code contains the file "enter-input.md" with content:
      """
      <a textrun="run-console-command">
      ```
      $ echo "Name of the service to add"
      $ read service_name
      $ echo Description
      $ read description
      $ echo "service: $service_name, desciption: $description"
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
      | FILENAME | enter-input.md                                                                                                                                                                     |
      | LINE     | 24                                                                                                                                                                                 |
      | MESSAGE  | running console command: echo "Name of the service to add" && read service_name && echo Description && read description && echo "service: $service_name, desciption: $description" |
    And it prints:
      """
      service: html-server, desciption: serves the HTML UI
      """
