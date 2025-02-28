@cli
Feature: Default file

  Scenario: a default filename is set
    Given the source code contains a file "root.md" with content:
      """
      link to [our guides](guide)
      """
    And the source code contains a file "guide/start.md" with content:
      """
      Subfolder content
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "defaultFile": "start.md"
      }
      """
    When running Text-Runner
    Then it prints:
      """
      root.md:1 -- link to local file guide/start.md
      """


  Scenario: no default filename is set
    Given the source code contains a file "root.md" with content:
      """
      link to [our guides](guide)
      """
    And the source code contains a file "guide/index.md" with content:
      """
      Subfolder content
      """
    When running Text-Runner
    Then it prints:
      """
      root.md:1 -- link to local directory guide
      """


  Scenario: publication with default file
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
    Given the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/guide/",
            "publicPath": "/blog",
            "publicExtension": ""
          }
        ],
        "defaultFile": "index.md"
      }
      """
    When running Text-Runner
    Then it prints:
      """
      root.md:1 -- link to local file guide/index.md
      """


  Scenario: relative link from default file to other file in same folder
    Given the source code contains a file "content/guides/index.md" with content:
      """
      [relative link to Go guide](go.md)
      """
    And the source code contains a file "content/guides/go.md" with content:
      """
      Go guide
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content",
            "publicPath": "/",
            "publicExtension": ""
          }
        ],
        "defaultFile": "index.md"
      """
    When running Text-Runner
    Then it prints:
      """
      content/guides/index.md:1 -- link to local file content/guides/go.md
      """
