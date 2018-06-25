Feature: Folder Mapping

  When verifying content transpiled together with Javascript
  I want to provide mappings from local folders to public URLs
  So that Text-Runner understands the structure of the public links correctly.


  Background:
    Given my source code contains the file "content/2.md" with content:
      """
      # hello
      """


  Scenario: mapping a folder to a different URL
    Given my source code contains the file "1.md" with content:
      """
      [link to 2.md](/2.md)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      urls:
        - content: '/'
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                            |
      | LINE     | 1                               |
      | MESSAGE  | link to local file content/2.md |
