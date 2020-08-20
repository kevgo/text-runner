Feature: active table tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: simple HTML table
    Given the source code contains a file "1.md" with content:
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
    Given the source code contains a file "1.md" with content:
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
    Given the source code contains a file "1.md" with content:
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
      | LINE     | 3           |
      | MESSAGE  | Hello world |

  Scenario: active TR tag in TBODY
    Given the source code contains a file "1.md" with content:
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
      | LINE     | 6           |
      | MESSAGE  | Hello world |

  Scenario: row tag in simple HTML table
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <tr textrun="HelloWorld"> <td></td> </tr>
      </table>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 2           |
      | MESSAGE  | Hello world |

  Scenario: HTML table cell tag
    Given the source code contains a file "1.md" with content:
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
      | LINE     | 3           |
      | MESSAGE  | Hello world |

  Scenario: HTML table header tag
    Given the source code contains a file "1.md" with content:
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
      | LINE     | 3           |
      | MESSAGE  | Hello world |

  Scenario: Markdown table
    Given the source code contains a file "1.md" with content:
      """
     | Keyboard shortcut                                    | Effect                        |
     | ---------------------------------------------------- | ----------------------------- |
     | <kbd>command</kbd>+<kbd>control</kbd>+<kbd>↓</kbd>  | Toggle between .h/.m file     |
     | <kbd>command</kbd>+<kbd>shift</kbd>+<kbd>O</kbd>     | Open Quickly (fuzzy find)     |

      """
    When running text-run
