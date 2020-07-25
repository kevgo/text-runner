Feature: TypeScript Actions

  When writing custom Text-Runner Actions
  I want to have autocomplete and type-checking support
  So that I can use the complex Text-Runner API easily and correctly.

  Scenario: an action is written in TypeScript
    When executing the "custom-action-typescript" example
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 3           |
      | MESSAGE  | Hello world |
