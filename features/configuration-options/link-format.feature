Feature: Link formats

  When compiling Markdown to public HTML
  I want that URLs to Markdown files are valid without their extension
  So that my public URLs can follow the URL friendly format.

  - when the "link-format" option is set to "direct",
    links to ".md" files must have the ".md" extension
  - when the "link-format" option is set to "url-friendly",
    links to ".md" files must omit the ".md" extension
  - when the "link-format" option is set to "html",
    links to ".md" files must have the ".html" extension


  Background:
    Given my source code contains the file "2.md" with content:
      """
      # hello
      """


  Scenario Outline:
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
      | OPTION | LINK |
      | direct | 2.md |

