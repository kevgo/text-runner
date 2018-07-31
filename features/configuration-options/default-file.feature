Feature: Default file

  When checking the links for a web site
  I want to publish the default file for a folder without the filename
  So that I can support URL-friendly links.


  Background:
    Given my source code contains the file "root.md" with content:
      """
      link to [subfolder](2)
      """
    And my source code contains the file "2/index.md" with content:
      """
      Subfolder content
      """

  Scenario: a default filename is set
    Given the configuration file:
      """
      defaultFile: 'index.md'
      """
    When running text-run
    Then it signals:
      | FILENAME | root.md                       |
      | LINE     | 1                             |
      | MESSAGE  | link to local file 2/index.md |

  Scenario: default behavior
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | root.md            |
      | LINE          | 1                               |
      | ERROR MESSAGE | directory foo not found         |
      | EXIT CODE     | 1                               |
