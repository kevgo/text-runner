Feature: active table tags

  When writing active blocks in a Markdown document
  I want to be able to make table tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: simple HTML table
    Given my source code contains the file "1.md" with content:
      """
      <table textrun="HelloWorld">
        <tr> <td></td> </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: HTML table with THEAD and TBODY
    Given my source code contains the file "1.md" with content:
      """
      <table textrun="HelloWorld">
        <thead>
          <tr> <td></td> </tr>
        </thead>
        <tbody>
          <tr> <td></td> </tr>
        </tbody>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: active TR tag in THEAD
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <thead>
          <tr textrun="HelloWorld"> <th></th> </tr>
          <tr> <td></td> </tr>
        </thead>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: active TR tag in TBODY
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <thead>
          <tr> <th></th> </tr>
        </thead>
        <tbody>
          <tr textrun="HelloWorld"> <td></td> </tr>
        </tbody>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: row tag in simple HTML table
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <tr textrun="HelloWorld"> <td></td> </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: HTML table cell tag
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <tr>
          <td textrun="HelloWorld">one</td>
        </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: HTML table header tag
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <tr>
          <th textrun="HelloWorld">one</th>
        </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: Markdown table
    Given my source code contains the file "1.md" with content:
      """
     | Keyboard shortcut                                  | Action                      |
     |----------------------------------------------------|-----------------------------|
     | <kbd>command</kbd>+<kbd>control</kbd>+<kbd>↓</kbd> | Toggle between .h/.m file   |
     | <kbd>command</kbd>+<kbd>shift</kbd>+<kbd>O</kbd>   | Open Quickly (fuzzy find)   |

      """
    When running text-run
