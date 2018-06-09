Feature: active table tags

  When writing active blocks in a Markdown document
  I want to be able to make table tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: table tag
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


  Scenario: table row tag
    Given my source code contains the file "1.md" with content:
      """
      <table>
        <tr textrun="HelloWorld">
          <td></td>
        </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: table cell tag
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


  Scenario: table header tag
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
