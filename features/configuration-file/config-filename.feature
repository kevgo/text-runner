Feature: specifying the configuration filename

  When working on a repo that contains public content and internal documentation for it
  I want to be able to specific which configuration file to use
  So that I can test several directories separately with different configuration options.


  Scenario: providing a configuration filename
    Given my source code contains the file "text-run-1.yml" with content:
      """
      files: 1.md
      """
    And my source code contains the file "1.md" with content:
      """
      [link](#foo)
      # Foo
      """
    And my source code contains the file "2.md" with content:
      """
      [link](#bar)
      # Bar
      """

    When running "text-run --config text-run-1.yml"
    Then it prints:
      """
      1.md:1 -- link to local heading #foo
      """
    And it doesn't print:
      """
      2.md:1 -- link to local heading #bar
      """

  Scenario: providing a non-existing configuration filename
    When trying to run "text-run --config zonk.yml"
    Then the test fails with:
      | ERROR MESSAGE | configuration file zonk.yml not found |
      | EXIT CODE     | 1                                     |

