Feature: marking console commands with preceding dollar signs

  As a tutorial writer
  I want to visualize console commands in my tutorial via preceding dollar signs
  So that my readers can distinguish them from other code blocks.

  - the commands can be preceded by a dollar sign,
    which is stripped before running them


  Scenario: running console commands with dollar signs
    Given my workspace contains the file "running-with-dollar-sign.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      $ ls -a
      $ ls -a
      ```
      </a>
      """
    When executing the tutorial
    Then it prints:
      """
      running-with-dollar-sign.md:1 -- running console command: ls -a && ls -a
      .
      ..
      .
      ..
      """
    And the test passes
