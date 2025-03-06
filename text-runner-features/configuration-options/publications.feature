@cli
Feature: Folder Mapping

  Background:
    Given the source code contains a file "content/2.md" with content:
      """
      # hello
      """


  Scenario: mapping a folder to a different URL
    Given the source code contains a file "1.md" with content:
      """
      [link to 2.md](2)
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
        ]
      }
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to local file content/2.md
      """


  Scenario: relative link to remapped folder
    Given the source code contains a file "1.md" with content:
      """
      [relative link to blog post 3](blog/3.html)
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content/posts",
            "publicPath": "/blog",
            "publicExtension": ".html"
          }
        ]
      }
      """
    And the source code contains a file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to local file content/posts/3.md
      """


  Scenario: relative link to anchor in remapped folder
    Given the source code contains a file "1.md" with content:
      """
      [relative link to blog post 3](blog/3.html#welcome)
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content/posts",
            "publicPath": "/blog",
            "publicExtension": ".html"
          }
        ]
      }
      """
    And the source code contains a file "content/posts/3.md" with content:
      """
      # Welcome
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to heading content/posts/3.md#welcome
      """


  Scenario: absolute link to remapped folder
    Given the source code contains a file "1.md" with content:
      """
      [relative link to blog post 3](/blog/3.html)
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content/posts",
            "publicPath": "/blog",
            "publicExtension": ".html"
          }
        ]
      }
      """
    And the source code contains a file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to local file content/posts/3.md
      """


  Scenario: absolute link to anchor in remapped folder
    Given the source code contains a file "1.md" with content:
      """
      [relative link to blog post 3](/blog/3.html#welcome)
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content/posts",
            "publicPath": "/blog",
            "publicExtension": ".html"
          }
        ]
      }
      """
    And the source code contains a file "content/posts/3.md" with content:
      """
      # Welcome
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to heading content/posts/3.md#welcome
      """


  Scenario: multiple mappings
    Given the source code contains a file "1.md" with content:
      """
      [link to hello in 2.md](/2#hello)
      [link to blog post 3.md](/blog/3.html)
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/content",
            "publicPath": "/",
            "publicExtension": ""
          },
          {
            "localPath": "/content/posts",
            "publicPath": "/blog",
            "publicExtension": ".html"
          }
        ]
      }
      """
    And the source code contains a file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- link to heading content/2.md#hello
      1.md:2 -- link to local file content/posts/3.md
      """


  Scenario: relative links within a publicized folder
    Given the source code contains a file "posts/1.md" with content:
      """
      [link to hello in 2.md](2#hello)
      """
    And the source code contains a file "posts/2.md" with content:
      """
      # Hello
      """
    And the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "publications": [
          {
            "localPath": "/posts",
            "publicPath": "/blog",
            "publicExtension": ""
          }
        ]
      }
      """
    When running Text-Runner
    Then it prints:
      """
      posts/1.md:1 -- link to heading posts/2.md#hello
      """
