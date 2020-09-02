@smoke
Feature: checking embedded Markdown images

  Scenario: existing local Markdown image with relative path
    Given the source code contains a file "1.md" with content:
      """
      ![Alt text](watermelon.gif "watermelon")
      """
    And the workspace contains an image "watermelon.gif"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY             |
      | 1.md     | 1    | check-image | image watermelon.gif |

  Scenario: existing local Markdown image with absolute path
    Given the source code contains a file "documentation/1.md" with content:
      """
      ![Alt text](/documentation/images/watermelon.gif "watermelon")
      """
    And the workspace contains an image "documentation/images/watermelon.gif"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME           | LINE | ACTION      | ACTIVITY                                   |
      | documentation/1.md | 1    | check-image | image /documentation/images/watermelon.gif |

  Scenario: non-existing local Markdown image
    Given the source code contains a file "1.md" with content:
      """
      ![Alt text](zonk.gif "watermelon")
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY       | STATUS | ERROR TYPE | ERROR MESSAGE                 |
      | 1.md     | 1    | check-image | image zonk.gif | failed | User Error | image zonk.gif does not exist |

  @online
  Scenario: existing remote Markdown image
    Given the source code contains a file "1.md" with content:
      """
      ![Alt text](http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png "google logo")
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                                                                |
      | 1.md     | 1    | check-image | image http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png |

  @online
  Scenario: non-existing remote Markdown image
    Given the source code contains a file "1.md" with content:
      """
      ![Alt text](http://google.com/onetuhoenzonk.png "zonk")
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY                                  | STATUS | ERROR TYPE | ERROR MESSAGE                                            |
      | 1.md     | 1    | check-image | image http://google.com/onetuhoenzonk.png | failed | User Error | image http://google.com/onetuhoenzonk.png does not exist |

  Scenario: Markdown image tag without source
    Given the source code contains a file "1.md" with content:
      """
      ![Alt text]()
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      | ACTIVITY    | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | check-image | Check image | failed | User Error | image tag without source |
