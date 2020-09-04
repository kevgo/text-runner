Feature: failing on empty directory

  Scenario: running inside an empty directory
    When calling Text-Runner
    Then it executes with this warning:
      """
      no Markdown files found
      """
