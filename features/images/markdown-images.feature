Feature: checking embedded Markdown images

  When writing documentation
  I want to be able to use Markdown image tags
  So that I can add images easily to the document without having to also learn HTML.

  - local images must exist
  - missing remote images cause a warning


  Scenario: existing local Markdown image with relative path
    Given my source code contains the file "1.md" with content:
      """
      ![Alt text](watermelon.gif "watermelon")
      """
    And my workspace contains an image "watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                 |
      | LINE     | 1                    |
      | MESSAGE  | image watermelon.gif |


  Scenario: existing local Markdown image with absolute path
    Given my source code contains the file "documentation/1.md" with content:
      """
      ![Alt text](/documentation/images/watermelon.gif "watermelon")
      """
    And my workspace contains an image "documentation/images/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | documentation/1.md                         |
      | LINE     | 1                                          |
      | MESSAGE  | image /documentation/images/watermelon.gif |


  Scenario: non-existing local Markdown image
    Given my source code contains the file "1.md" with content:
      """
      ![Alt text](zonk.gif "watermelon")
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                          |
      | LINE          | 1                             |
      | ERROR MESSAGE | image zonk.gif does not exist |
      | EXIT CODE     | 1                             |


  @online
  Scenario: existing remote Markdown image
    Given my source code contains the file "1.md" with content:
      """
      ![Alt text](http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png "google logo")
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                                    |
      | LINE     | 1                                                                                       |
      | MESSAGE  | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png |


  @online
  Scenario: non-existing remote Markdown image
    Given my source code contains the file "1.md" with content:
      """
      ![Alt text](http://google.com/onetuhoenzonk.png "zonk")
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | WARNING  | image http://google.com/onetuhoenzonk.png does not exist |


  Scenario: Markdown image tag without source
    Given my source code contains the file "1.md" with content:
      """
      ![Alt text]()
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | image tag without source |
      | EXIT CODE     | 1                        |
