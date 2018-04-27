// @flow

const parseMarkdown = require('./parse-markdown.js')
const { expect } = require('chai')

describe('parseMarkdown', function () {
  it('extracts Markdown headings', function () {
    const markdown = `
## Hello
This is text.`
    expect(parseMarkdown(markdown.trim(), 'README.md')).to.eql([
      {
        type: 'heading_open',
        tag: 'h2',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: 'Hello',
        attributes: {}
      },
      {
        type: 'heading_close',
        tag: '/h2',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 2,
        content: '',
        attributes: {}
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 2,
        content: 'This is text.',
        attributes: {}
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 2,
        content: '',
        attributes: {}
      }
    ])
  })

  it('extracts HTML headings', function () {
    const markdown = `
<h1 textrun="foo">Hello</h1>
This is text.`
    expect(parseMarkdown(markdown.trim(), 'README.md')).to.eql([
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'heading_open',
        tag: 'h1',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: 'Hello',
        attributes: {}
      },
      {
        type: 'heading_close',
        tag: '/h1',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 2,
        content: 'This is text.',
        attributes: {}
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 2,
        content: '',
        attributes: {}
      }
    ])
  })

  it('extracts HTML images', function () {
    const markdown = `
<img src="foo.png" width="100" height="200" alt="foo in a bar">`
    expect(parseMarkdown(markdown.trim(), 'README.md')).to.eql([
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'image',
        tag: 'img',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          src: 'foo.png',
          width: '100',
          height: '200',
          alt: 'foo in a bar'
        }
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      }
    ])
  })

  it('extracts Markdown images', function () {
    const markdown = `![foo bar](foo.png "hover text")`
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'image',
        tag: 'img',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          src: 'foo.png',
          alt: 'foo bar'
        }
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      }
    ])
  })

  it('extracts Markdown code blocks', function () {
    const markdown = 'This is a `code block`!'
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: 'This is a ',
        attributes: {}
      },
      {
        type: 'code',
        tag: 'code',
        file: 'README.md',
        line: 1,
        content: 'code block',
        attributes: {}
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: '!',
        attributes: {}
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      }
    ])
  })

  it('extracts HTML code blocks', function () {
    const markdown = 'This is a <code textrun="foo">code block</code>!'
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'paragraph_open',
        tag: 'p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: 'This is a ',
        attributes: {}
      },
      {
        type: 'code_open',
        tag: 'code',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: 'code block',
        attributes: {}
      },
      {
        type: 'code_close',
        tag: '/code',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        tag: '',
        file: 'README.md',
        line: 1,
        content: '!',
        attributes: {}
      },
      {
        type: 'paragraph_close',
        tag: '/p',
        file: 'README.md',
        line: 1,
        content: '',
        attributes: {}
      }
    ])
  })
})
