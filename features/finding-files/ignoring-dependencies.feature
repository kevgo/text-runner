Feature: ignoring dependencies

  As a user working in a language that installs external dependencies into the workspace
  I want TextRunner to ignore documentation for that code automatically
  So that I don't get false positive errors for broken documentation of code that I don't own.

  - "node_modules" is ignored by default


  Scenario: a code base with a node_modules folder
    Given a runnable file "creator.md"
    And a broken file "node_modules/zonk/broken.md"
    When running text-run
    Then it runs 1 test
