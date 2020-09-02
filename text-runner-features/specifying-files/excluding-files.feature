Feature: excluding files

  Background:
    Given a runnable file "readme.md"
    And a runnable file "foo/1.md"
    And a runnable file "bar/2.md"

  Scenario: excluding via config file
    Given the configuration file:
      """
      exclude: 'foo'
      """
    When running Text-Runner
    Then it runs only the tests in:
      | readme.md |
      | bar/2.md  |

  Scenario: excluding via CLI
    When running "text-run --exclude foo"
    Then it runs only the tests in:
      | readme.md |
      | bar/2.md  |
