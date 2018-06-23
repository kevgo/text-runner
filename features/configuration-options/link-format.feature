Feature: Link formats

  When compiling Markdown to public HTML
  I want that URLs to local Markdown files are in web formats instead of Markdown
  So that the public can consume my documentation like a normal web page.


  Background:
    Given my source code contains the file "2.md" with content:
      """
      # hello
      """


  Scenario Outline: command-line switch
    Given my source code contains the file "1.md" with content:
      """
      [link to 2.md](<LINK>)
      """
    When running "text-run --link-format <OPTION>"
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 1                       |
      | MESSAGE  | link to local file 2.md |

    Examples:
      | OPTION       | LINK   |
      | direct       | 2.md   |
      | html         | 2.html |
      | url-friendly | 2      |


  Scenario Outline: configuration file setting
    Given my source code contains the file "1.md" with content:
      """
      [link to 2.md](<LINK>)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      linkFormat: <LINK>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 1                       |
      | MESSAGE  | link to local file 2.md |

    Examples:
      | OPTION       | LINK   |
      | direct       | 2.md   |
      | html         | 2.html |
      | url-friendly | 2      |

