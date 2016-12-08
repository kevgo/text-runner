@clionly
Feature: verifying links to external websites

  As a tutorial writer
  I want to know whether links to external websites still work
  So that I can point my readers to further reading.

  - dead links pointing to external websites cause a warning


  Scenario: correct external link
    Given my workspace contains the file "1.md" with the content:
      """
      A [working external link](http://google.com)
      """
    When running "tut-run 1.md"
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 1                                          |
      | WARNING  | working external link to http://google.com |


  Scenario: broken external link
    Given my workspace contains the file "1.md" with the content:
      """
      A [broken external link](http://oeanuthaoenuthoaeu.com)
      """
    When running "tut-run 1.md"
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | WARNING  | external website http://oeanuthaoenuthoaeu.com not found |

