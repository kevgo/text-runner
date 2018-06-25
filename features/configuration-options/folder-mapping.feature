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
      mappings:
        /content/: /
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                             |
      | LINE     | 1                                |
      | MESSAGE  | link to local file content/2.md |


  Scenario: multiple mappings
    Given my source code contains the file "1.md" with content:
      """
      [link to 2.md](/2.md)
      [link to blog post 3.md](blog/3.md)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      mappings:
        /content/: /
        /content/posts: /blog
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      Hello!
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                            |
      | LINE     | 1                               |
      | MESSAGE  | link to local file content/2.md |
    And it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 2                                     |
      | MESSAGE  | link to local file content/posts/3.md |
