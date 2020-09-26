@api
Feature: active table tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: simple HTML table
    Given the source code contains a file "1.md" with content:
      """
      <table type="HelloWorld">
        <tr> <td></td> </tr>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |

  Scenario: HTML table with THEAD and TBODY
    Given the source code contains a file "1.md" with content:
      """
      <table type="HelloWorld">
        <thead>
          <tr> <td></td> </tr>
        </thead>
        <tbody>
          <tr> <td></td> </tr>
        </tbody>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |

  Scenario: active TR tag in THEAD
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <thead>
          <tr type="HelloWorld"> <th></th> </tr>
          <tr> <td></td> </tr>
        </thead>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 3    | hello-world |

  Scenario: active TR tag in TBODY
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <thead>
          <tr> <th></th> </tr>
        </thead>
        <tbody>
          <tr type="HelloWorld"> <td></td> </tr>
        </tbody>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 6    | hello-world |

  Scenario: row tag in simple HTML table
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <tr type="HelloWorld"> <td></td> </tr>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 2    | hello-world |

  Scenario: HTML table cell tag
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <tr>
          <td type="HelloWorld">one</td>
        </tr>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 3    | hello-world |

  Scenario: HTML table header tag
    Given the source code contains a file "1.md" with content:
      """
      <table>
        <tr>
          <th type="HelloWorld">one</th>
        </tr>
      </table>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 3    | hello-world |
