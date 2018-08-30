// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const Publications = require('../configuration/publications.js')
const { expect } = require('chai')

describe('AbsoluteFilePath', function () {
  describe('append', function () {
    it('appends the given filename to the current path', function () {
      const filePath = new AbsoluteFilePath('/one')
      const appended = filePath.append('two')
      expect(appended.unixified()).to.equal('one/two')
    })
  })

  describe('directory', function () {
    const testData = {
      'Windows file path': ['\\foo\\bar\\baz.md', 'foo/bar/'],
      'Unix file path': ['/foo/bar/baz.md', 'foo/bar/'],
      'Windows directory': ['/foo/bar/', 'foo/bar/'],
      'Unix directory': ['/foo/bar/', 'foo/bar/']
    }
    for (const testName of Object.keys(testData)) {
      it(testName, function () {
        const [input, output] = testData[testName]
        const file = new AbsoluteFilePath(input)
        expect(file.directory().value).to.equal(output)
      })
    }
  })

  describe('extName', function () {
    it('returns the file extension including dot', function () {
      const filePath = new AbsoluteFilePath('/one.md')
      expect(filePath.extName()).to.equal('.md')
    })
    it('returns an empty string for no file extensions', function () {
      const filePath = new AbsoluteFilePath('/one')
      expect(filePath.extName()).to.equal('')
    })
  })

  describe('isDirectory', function () {
    const testData = {
      'Windows file path': ['\\foo\\bar\\baz.md', false],
      'Unix file path': ['/foo/bar/baz.md', false],
      'Windows directory': ['/foo/bar/', true],
      'Unix directory': ['/foo/bar/', true]
    }
    for (const testName of Object.keys(testData)) {
      it(testName, function () {
        const [input, output] = testData[testName]
        const file = new AbsoluteFilePath(input)
        expect(file.isDirectory()).to.equal(output)
      })
    }
  })

  describe('unixified', function () {
    const testData = {
      '\\foo/bar\\baz': 'foo/bar/baz',
      '/foo/bar': 'foo/bar'
    }
    for (const input of Object.keys(testData)) {
      it(`converts ${input} to ${testData[input]}`, function () {
        const filePath = new AbsoluteFilePath(input)
        expect(filePath.unixified()).to.equal(testData[input])
      })
    }
  })

  describe('publicPath', function () {
    it('returns the unixified path if there are no publications', function () {
      const filePath = new AbsoluteFilePath('content\\1.md')
      const actual = filePath.publicPath(new Publications(), '')
      expect(actual.value).to.equal('/content/1.md')
    })

    it('adjusts the directory according to the matching publication', function () {
      const publications = Publications.fromJSON([
        {
          localPath: '/content',
          publicPath: '/',
          publicExtension: 'html'
        }
      ])
      const filePath = new AbsoluteFilePath('/content/1.md')
      const actual = filePath.publicPath(publications, '')
      expect(actual.value).to.equal('/1.html')
    })
  })
})
