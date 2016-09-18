Feature: running console commands

  As a tutorial writer
  I want my users to be able to enter text into the console
  So that they can interact with the commands they run.

  - optionally there can be an HTML table that defines input into the commands
  - if the table has exactly one column, it contains the input to enter
  - the ENTER key is pressed automatically for the user at the end of each input field
  - Only content in TD cells is used. TH cells are considered labels and ignored.
  - if the table has more than one column,
    the first column contains console output to wait for,
    and the last column contains the text to enter.
    Other columns are ignored.


  Scenario: entering text into the console
    Given my workspace contains the file "enter-input.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      $ read foo
      $ echo $foo
      ```
      <table>
        <tr>
          <td>123</td>
        </tr>
      </table>

      </a>
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | enter-input.md                                 |
      | LINE     | 1-12                                           |
      | MESSAGE  | running console command: read foo && echo $foo |
    And the test passes


  Scenario: entering text into the console
    Given my workspace contains the file "enter-input.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      $ echo Name of the service to add
      $ read service_name
      $ echo Description
      $ read description
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
          <td>serves the HTML UI of the Todo app</td>
        </tr>
      </table>

      </a>
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | enter-input.md                                                                                                        |
      | LINE     | 1-23                                                                                                                  |
      | MESSAGE  | running console command: echo Name of the service to add && read service_name && echo Description && read description |
    And the test passes
