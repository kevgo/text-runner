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
        type: 'h2',
        filepath: 'README.md',
        line: 1,
        content: 'Hello',
        attributes: {}
      },
      {
        type: 'text',
        filepath: 'README.md',
        line: 2,
        content: 'This is text.',
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
        type: 'h1',
        filepath: 'README.md',
        line: 1,
        content: 'Hello',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        filepath: 'README.md',
        line: 1, // Note: Remark doesn't give us line numbers here
        content: 'This is text.',
        attributes: {}
      }
    ])
  })

  it('extracts HTML images', function () {
    const markdown = `
<img src="foo.png" width="100" height="200" alt="foo in a bar">`
    expect(parseMarkdown(markdown.trim(), 'README.md')).to.eql([
      {
        type: 'image',
        filepath: 'README.md',
        line: 1,
        content: '',
        html: '<img src="foo.png" width="100" height="200" alt="foo in a bar">',
        attributes: {
          src: 'foo.png',
          width: '100',
          height: '200',
          alt: 'foo in a bar'
        }
      }
    ])
  })

  it('extracts Markdown images', function () {
    const markdown = `![foo bar](foo.png "hover text")`
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'image',
        filepath: 'README.md',
        line: 1,
        content: '',
        attributes: {
          src: 'foo.png'
        }
      }
    ])
  })

  it('extracts Markdown code blocks', function () {
    const markdown = 'This is a `code block`!'
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'text',
        filepath: 'README.md',
        line: 1,
        content: 'This is a ',
        attributes: {}
      },
      {
        type: 'code',
        filepath: 'README.md',
        line: 1,
        content: 'code block',
        attributes: {}
      },
      {
        type: 'text',
        filepath: 'README.md',
        line: 1,
        content: '!',
        attributes: {}
      }
    ])
  })

  it('extracts HTML code blocks', function () {
    const markdown = 'This is a <code textrun="foo">code block</code>!'
    expect(parseMarkdown(markdown, 'README.md')).to.eql([
      {
        type: 'text',
        filepath: 'README.md',
        line: 1,
        content: 'This is a ',
        attributes: {}
      },
      {
        type: 'code',
        filepath: 'README.md',
        line: 1,
        content: 'code block',
        attributes: {
          textrun: 'foo'
        }
      },
      {
        type: 'text',
        filepath: 'README.md',
        line: 1,
        content: '!',
        attributes: {}
      }
    ])
  })
})
