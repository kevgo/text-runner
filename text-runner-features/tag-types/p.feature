@api
Feature: active P tags

  Scenario: <p> htmlblocks
    Given the source code contains a file "1.md" with content:
      """
      <p>
      foo
      bar
      </p>
      """
    When running Text-Runner
