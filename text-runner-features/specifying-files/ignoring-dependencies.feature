Feature: ignoring dependencies

  Scenario: a code base with a node_modules folder
    Given a runnable file "creator.md"
    And a broken file "node_modules/zonk/broken.md"
    When running Text-Runner
    Then it runs 1 test
