@smoke
@cli
Feature: specifying the configuration filename

  Calling via API doesn't load configuration files

  Background:
    Given the source code contains a file "text-runner-1.yml" with content:
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
    When running "text-runner --config=text-runner-1.yml"
    Then it prints:
      """
      1.md:1 -- link to local heading #foo
      """
    And it doesn't print:
      """
      2.md:1 -- link to local heading #bar
      """

  Scenario: providing a non-existing configuration filename via CLI
    When trying to run "text-runner --config=zonk.yml"
    Then the test fails with:
      | ERROR MESSAGE | cannot read configuration file "zonk.yml" |
      | EXIT CODE     | 1                                         |
