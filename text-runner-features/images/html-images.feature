Feature: checking embedded HTML images

  Scenario: existing local HTML image with relative path
    Given the source code contains a file "1.md" with content:
      """
      <img src="images/watermelon.gif">
      """
    And the workspace contains an image "images/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                        |
      | LINE     | 1                           |
      | MESSAGE  | image images/watermelon.gif |


  Scenario: existing local HTML image with absolute path
    Given the source code contains a file "documentation/1.md" with content:
      """
      <img src="/documentation/images/watermelon.gif">
      """
    And the workspace contains an image "documentation/images/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | documentation/1.md                         |
      | LINE     | 1                                          |
      | MESSAGE  | image /documentation/images/watermelon.gif |


  Scenario: existing local HTML image on page in subfolder
    Given the source code contains a file "documentation/1.md" with content:
      """
      <img src="watermelon.gif">
      """
    And the workspace contains an image "documentation/watermelon.gif"
    When running text-run
    Then it signals:
      | FILENAME | documentation/1.md   |
      | LINE     | 1                    |
      | MESSAGE  | image watermelon.gif |


  Scenario: non-existing local HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="zonk.gif">
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                          |
      | LINE          | 1                             |
      | ERROR MESSAGE | image zonk.gif does not exist |
      | EXIT CODE     | 1                             |


  @online
  Scenario: existing remote HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                                                    |
      | LINE     | 1                                                                                       |
      | MESSAGE  | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png |


  @online
  Scenario: non-existing remote HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="http://google.com/onetuhoenzonk.png">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | MESSAGE  | image http://google.com/onetuhoenzonk.png                |
      | OUTPUT   | image http://google.com/onetuhoenzonk.png does not exist |


  Scenario: HTML image tag without source
    Given the source code contains a file "1.md" with content:
      """
      <img src="">
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | image tag without source |
      | EXIT CODE     | 1                        |
