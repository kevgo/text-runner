Feature: active P tags

  <p> tags are weird in the parser output
  and are not supported at this time


  Scenario: <p> htmlblocks
    Given my source code contains the file "1.md" with content:
      """
      <p>
      foo
      bar
      </p>
      """
    When running text-run
