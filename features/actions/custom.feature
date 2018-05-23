Feature: custom runners

  As a documentation writer
  I want to be able to define my own block actions
  So that my documentation can perform things that go beyond the built-in actions.

  - put built-in actions into a file "text-run/<action name>.js"
  - the structure of these files should match the structure of the built-in actions


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
