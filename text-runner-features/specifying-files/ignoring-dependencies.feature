Feature: ignoring dependencies

  Scenario: a code base with a node_modules folder
    Given a runnable file "creator.md"
    And a broken file "node_modules/foo/broken.md"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME   |
      | creator.md |
