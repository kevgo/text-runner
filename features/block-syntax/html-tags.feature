Feature: support for more HTML tags

  When writing active blocks in a Markdown document
  I want to be able to make a variety of HTML tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: blockquote tag
    Given my source code contains the file "1.md" with content:
      """
      <blockquote textrun="HelloWorld">hello</blockquote>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: bullet list tag
    Given my source code contains the file "1.md" with content:
      """
      <ul textrun="HelloWorld">
        <li>one</li>
      </ul>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: code tag
    Given my source code contains the file "1.md" with content:
      """
      <code textrun="HelloWorld">foo</code>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: em tag
    Given my source code contains the file "1.md" with content:
      """
      <em textrun="HelloWorld">foo</em>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: pre tag
    Given my source code contains the file "1.md" with content:
      """
      <pre textrun="HelloWorld">
      foo
      </pre>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  Scenario: H1 tag
    Given my source code contains the file "1.md" with content:
      """
      <h1 textrun="HelloWorld">hello</h1>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |


  # Scenario: P tag
  #   Given my source code contains the file "1.md" with content:
  #     """
  #     <p textrun="HelloWorld">
  #
  #     hello
  #
  #     </p>
  #     """
  #   When running text-run
  #   Then it signals:
  #     | FILENAME | 1.md        |
  #     | LINE     | 1           |
  #     | MESSAGE  | Hello world |
