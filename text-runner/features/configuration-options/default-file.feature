Feature: Default file

  When checking the links for a web site
  I want to publish the default file for a folder without the filename
  So that I can support URL-friendly links.


  Scenario: a default filename is set
    Given the source code contains a file "root.md" with content:
      """
      link to [our guides](guide)
      """
    And the source code contains a file "guide/index.md" with content:
      """
      Subfolder content
      """
    And the configuration file:
      """
      defaultFile: 'index.md'
      """
    When running text-run
    Then it signals:
      | FILENAME | root.md                           |
      | LINE     | 1                                 |
      | MESSAGE  | link to local file guide/index.md |


  Scenario: default behavior
    Given the source code contains a file "root.md" with content:
      """
      link to [our guides](guide)
      """
    And the source code contains a file "guide/index.md" with content:
      """
      Subfolder content
      """
    When running text-run
    Then it signals:
      | FILENAME | root.md                       |
      | LINE     | 1                             |
      | MESSAGE  | link to local directory guide |

  Scenario: combination with publication settings
    Given the source code contains a file "root.md" with content:
      """
      link to [our guides](guide)
      """
    And the source code contains a file "guide/index.md" with content:
      """
      Subfolder content
      """
    Given the source code contains a file "root.md" with content:
      """
      link to [posts](/blog/)
      """
    And the configuration file:
      """
      publications:
        - localPath: /guide/
          publicPath: /blog
          publicExtension: ''
      defaultFile: 'index.md'
      """
    When running text-run
    Then it signals:
      | FILENAME | root.md                           |
      | LINE     | 1                                 |
      | MESSAGE  | link to local file guide/index.md |

  Scenario: relative link from default file to other file in same folder
    Given the source code contains a file "content/guides/index.md" with content:
      """
      [relative link to Go guide](go.md)
      """
    And the source code contains a file "content/guides/go.md" with content:
      """
      Go guide
      """
    And the source code contains a file "text-run.yml" with content:
      """
      publications:
        - localPath: /content
          publicPath: /
          publicExtension: ''
      defaultFile: index.md
      """
    When running text-run
    And it signals:
      | FILENAME | content/guides/index.md                 |
      | LINE     | 1                                       |
      | MESSAGE  | link to local file content/guides/go.md |
