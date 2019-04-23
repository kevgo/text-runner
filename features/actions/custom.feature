Feature: custom runners

  As a documentation writer
  I want to be able to define my own actions
  So that my documentation can perform things that go beyond the built-in functionality.

  - put custom actions into a file "text-run/<action name>.js"
  - the file must export a Javascript function


  Scenario Outline: various forms of runners
    When executing the "custom-action-<TYPE>" example
    Then it signals:
      | FILENAME | custom-action.md |
      | LINE     | 3                |
      | MESSAGE  | Hello world      |

    Examples:
      | TYPE     |
      | async    |
      | callback |
      | promise  |
      | sync     |
