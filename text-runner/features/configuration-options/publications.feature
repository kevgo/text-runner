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
      [link to 2.md](2)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content
          publicPath: /
          publicExtension: ''
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                            |
      | LINE     | 1                               |
      | MESSAGE  | link to local file content/2.md |


  Scenario: relative link to remapped folder
    Given my source code contains the file "1.md" with content:
      """
      [relative link to blog post 3](blog/3.html)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content/posts
          publicPath: /blog
          publicExtension: .html
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 1                                     |
      | MESSAGE  | link to local file content/posts/3.md |

  Scenario: relative link to anchor in remapped folder
    Given my source code contains the file "1.md" with content:
      """
      [relative link to blog post 3](blog/3.html#welcome)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content/posts
          publicPath: /blog
          publicExtension: .html
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      # Welcome
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 1                                          |
      | MESSAGE  | link to heading content/posts/3.md#welcome |

  Scenario: absolute link to remapped folder
    Given my source code contains the file "1.md" with content:
      """
      [relative link to blog post 3](/blog/3.html)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content/posts
          publicPath: /blog
          publicExtension: .html
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 1                                     |
      | MESSAGE  | link to local file content/posts/3.md |

  Scenario: absolute link to anchor in remapped folder
    Given my source code contains the file "1.md" with content:
      """
      [relative link to blog post 3](/blog/3.html#welcome)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content/posts
          publicPath: /blog
          publicExtension: .html
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      # Welcome
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                       |
      | LINE     | 1                                          |
      | MESSAGE  | link to heading content/posts/3.md#welcome |

  Scenario: multiple mappings
    Given my source code contains the file "1.md" with content:
      """
      [link to hello in 2.md](/2#hello)
      [link to blog post 3.md](/blog/3.html)
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /content
          publicPath: /
          publicExtension: ''
        - localPath: /content/posts
          publicPath: /blog
          publicExtension: .html
      """
    And my source code contains the file "content/posts/3.md" with content:
      """
      Yo!
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                               |
      | LINE     | 1                                  |
      | MESSAGE  | link to heading content/2.md#hello |
    And it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 2                                     |
      | MESSAGE  | link to local file content/posts/3.md |

  Scenario: relative links within a publicized folder
    Given my source code contains the file "posts/1.md" with content:
      """
      [link to hello in 2.md](2#hello)
      """
    And my source code contains the file "posts/2.md" with content:
      """
      # Hello
      """
    And my source code contains the file "text-run.yml" with content:
      """
      publications:
        - localPath: /posts
          publicPath: /blog
          publicExtension: ''
      """
    When running text-run
    Then it signals:
      | FILENAME | posts/1.md                       |
      | LINE     | 1                                |
      | MESSAGE  | link to heading posts/2.md#hello |
