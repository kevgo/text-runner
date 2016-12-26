Feature: checking embedded images

  As a documentation writer
  I want to know whether embedded images work
  So that I can add images to the text of my documentation.

  - embedded images must point to an existing image file
  - local images must exist
  - missing remote images cause a warning


  Scenario: existing local HTML image
    Given my workspace contains the file "1.md" with the content:
      """
      <img src="images/watermelon.gif">
      """
    And my workspace contains an image "images/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                               |
      | LINE     | 1                                  |
      | MESSAGE  | image images/watermelon.gif exists |


  Scenario: existing local HTML image on page in subfolder
    Given my workspace contains the file "documentation/1.md" with the content:
      """
      <img src="watermelon.gif">
      """
    And my workspace contains an image "documentation/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | documentation/1.md                        |
      | LINE     | 1                                         |
      | MESSAGE  | image documentation/watermelon.gif exists |


  Scenario: existing local Markdown image
    Given my workspace contains the file "1.md" with the content:
      """
      ![Alt text](watermelon.gif "watermelon")
      """
    And my workspace contains an image "watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                        |
      | LINE     | 1                           |
      | MESSAGE  | image watermelon.gif exists |


  Scenario: non-existing local HTML image
    Given my workspace contains the file "1.md" with the content:
      """
      <img src="zonk.gif">
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                          |
      | LINE          | 1                             |
      | ERROR MESSAGE | image zonk.gif does not exist |
      | EXIT CODE     | 1                             |


  Scenario: non-existing local Markdown image
    Given my workspace contains the file "1.md" with the content:
      """
      ![Alt text](zonk.gif "watermelon")
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                          |
      | LINE          | 1                             |
      | ERROR MESSAGE | image zonk.gif does not exist |
      | EXIT CODE     | 1                             |


  Scenario: existing remote HTML image
    Given my workspace contains the file "1.md" with the content:
      """
      <img src="http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                                           |
      | LINE     | 1                                                                                              |
      | MESSAGE  | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png exists |


  Scenario: existing remote Markdown image
    Given my workspace contains the file "1.md" with the content:
      """
      ![Alt text](http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png "google logo")
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                                           |
      | LINE     | 1                                                                                              |
      | MESSAGE  | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png exists |


  Scenario: non-existing remote HTML image
    Given my workspace contains the file "1.md" with the content:
      """
      <img src="http://google.com/onetuhoenzonk.png">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | WARNING  | image http://google.com/onetuhoenzonk.png does not exist |


  Scenario: non-existing remote Markdown image
    Given my workspace contains the file "1.md" with the content:
      """
      ![Alt text](http://google.com/onetuhoenzonk.png "zonk")
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | WARNING  | image http://google.com/onetuhoenzonk.png does not exist |


  Scenario: HTML image tag without source
    Given my workspace contains the file "1.md" with the content:
      """
      <img src="">
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | image tag without source |
      | EXIT CODE     | 1                        |

  Scenario: Markdown image tag without source
    Given my workspace contains the file "1.md" with the content:
      """
      ![Alt text]()
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | image tag without source |
      | EXIT CODE     | 1                        |
