Feature: marking console commands with preceding dollar signs

  Scenario: running console commands with dollar signs
    Given the source code contains a file "running-with-dollar-sign.md" with content:
      """
      <a type="shell/command">

      ```
      $ echo "hello"
      $ echo "world"
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | running-with-dollar-sign.md                           |
      | LINE     | 1                                                     |
      | MESSAGE  | running console command: echo "hello" && echo "world" |
