Feature: defining global binaries

  Scenario: calling a local tool as if it were installed globally
    When executing the "global-tool" example
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 1                       |
      | MESSAGE  | running console command |
