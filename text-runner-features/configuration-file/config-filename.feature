@smoke
Feature: specifying the configuration filename

  Background:
    Given the source code contains a file "text-run-1.yml" with content:
      """
      files: 1.md
      """
    And the source code contains a file "1.md" with content:
      """
      [link](#foo)
      # Foo
      """
    And the source code contains a file "2.md" with content:
      """
      [link](#bar)
      # Bar
      """

  Scenario: providing a configuration filename via CLI
    When running "text-run --config text-run-1.yml"
    Then it prints:
      """
      1.md:1 -- link to local heading #foo
      """
    And it doesn't print:
      """
      2.md:1 -- link to local heading #bar
      """

  Scenario: providing a configuration filename via API
    When calling "textRunner.runCommand({config: 'text-run-1.yml', sourceDir})"
    Then it executes only this action:
      | FILENAME | 1.md         |
      | LINE     | 1            |
      | ACTION   | hello-world  |
      | OUTPUT   | Hello World! |

  Scenario: providing a non-existing configuration filename via CLI
    When trying to run "text-run --config zonk.yml"
    Then the test fails with:
      | ERROR MESSAGE | configuration file zonk.yml not found |
      | EXIT CODE     | 1                                     |
