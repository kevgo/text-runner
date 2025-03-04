# Built-in Actions

Text-Runner automatically verifies the static structure of your documentation,
in particular that local images point to existing files and local links point to
existing files or directories.

By default, Text-Runner checks only links and images pointing to local files and
directories. Use the `--online` switch to add checking links pointing to the
internet. Please note that this will slow down your documentation test suite and
make it more flaky.

### Publications

If you use static site generators like [Jekyll](https://jekyllrb.com),
[Gatsby](https://www.gatsbyjs.com), or [Docusaurus](https://v2.docusaurus.io) to
transpile the Markdown to HTML, the links used in Markdown might not match the
location of the linked files. In these situations, you can describe how your
site generator maps links using the `publications` section inside Text-Runner's
configuration file.

As an example, let's say you use a static site generator for your blog. The
source code contains blog posts as Markdown files inside the `content/posts/`
folder. The website shows the blog posts as HTML files at the `/blog` path. Here
is the publication that explains Text-Runner that for example the file
`content/posts/welcome.md` gets mapped to the URL path `/blog/welcome.html`:

```yml
publications:
  - localPath: /content/posts
    publicPath: /blog
    publicExtension: .html
```

More examples at the
[end-to-end test for publications](https://github.com/kevgo/text-runner/blob/main/text-runner-features/configuration-options/publications.feature)

<hr>

Read more about:

- writing your own [user-defined actions](user-defined-actions.md)
- use [external actions](external-actions.md)
