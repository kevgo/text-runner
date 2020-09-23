@api
Feature: checking embedded HTML images

  Scenario: existing local HTML image with relative path
    Given the source code contains a file "1.md" with content:
      """
      <img src="images/watermelon.gif">
      """
    And the workspace contains an image "images/watermelon.gif"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                    |
      | 1.md     | 1    | check-image | image images/watermelon.gif |


  Scenario: existing local HTML image with absolute path
    Given the source code contains a file "documentation/1.md" with content:
      """
      <img src="/documentation/images/watermelon.gif">
      """
    And the workspace contains an image "documentation/images/watermelon.gif"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME           | LINE | ACTION      | ACTIVITY                                   |
      | documentation/1.md | 1    | check-image | image /documentation/images/watermelon.gif |


  Scenario: existing local HTML image on page in subfolder
    Given the source code contains a file "documentation/1.md" with content:
      """
      <img src="watermelon.gif">
      """
    And the workspace contains an image "documentation/watermelon.gif"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME           | LINE | ACTION      | ACTIVITY             |
      | documentation/1.md | 1    | check-image | image watermelon.gif |


  Scenario: non-existing local HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="zonk.gif">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY       | STATUS | ERROR TYPE | ERROR MESSAGE                 |
      | 1.md     | 1    | check-image | image zonk.gif | failed | UserError  | image zonk.gif does not exist |


  @online
  Scenario: existing remote HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                                                                |
      | 1.md     | 1    | check-image | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png |


  @online
  Scenario: non-existing remote HTML image
    Given the source code contains a file "1.md" with content:
      """
      <img src="http://google.com/onetuhoenzonk.png">
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, online: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                  | STATUS | ERROR TYPE | ERROR MESSAGE                                            |
      | 1.md     | 1    | check-image | image http://google.com/onetuhoenzonk.png | failed | UserError  | image http://google.com/onetuhoenzonk.png does not exist |


  Scenario: HTML image tag without source
    Given the source code contains a file "1.md" with content:
      """
      <img src="">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY    | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | check-image | Check image | failed | UserError  | image tag without source |
