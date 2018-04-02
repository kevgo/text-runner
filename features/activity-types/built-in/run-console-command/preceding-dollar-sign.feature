Feature: marking console commands with preceding dollar signs

  As a documentation writer
  I want to visualize console commands in my documentation via preceding dollar signs
  So that my readers can distinguish them from other code blocks.

  - the commands can be preceded by a dollar sign,
    which is stripped before running them


  Scenario: running console commands with dollar signs
    Given my source code contains the file "running-with-dollar-sign.md" with content:
      """
      <a textrun="run-console-command">
      ```
      $ echo "hello"
      $ echo "world"
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | running-with-dollar-sign.md                           |
      | LINE     | 6                                                     |
      | MESSAGE  | running console command: echo "hello" && echo "world" |
