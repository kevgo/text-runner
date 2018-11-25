import { expect } from 'chai'
import Publications from '../configuration/publications'
import AbsoluteFilePath from './absolute-file-path'

describe('AbsoluteFilePath', function() {
  describe('append', function() {
    it('appends the given filename to the current path', function() {
      const filePath = new AbsoluteFilePath('/one')
      const appended = filePath.append('two')
      expect(appended.unixified()).to.equal('one/two')
    })
  })

  describe('directory', function() {
    const testData = {
      'Unix directory': ['/foo/bar/', 'foo/bar/'],
      'Unix file path': ['/foo/bar/baz.md', 'foo/bar/'],
      'Windows directory': ['/foo/bar/', 'foo/bar/'],
      'Windows file path': ['\\foo\\bar\\baz.md', 'foo/bar/']
    }
    for (const testName of Object.keys(testData)) {
      it(testName, function() {
        const [input, output] = testData[testName]
        const file = new AbsoluteFilePath(input)
        expect(file.directory().value).to.equal(output)
      })
    }
  })

  describe('extName', function() {
    it('returns the file extension including dot', function() {
      const filePath = new AbsoluteFilePath('/one.md')
      expect(filePath.extName()).to.equal('.md')
    })
    it('returns an empty string for no file extensions', function() {
      const filePath = new AbsoluteFilePath('/one')
      expect(filePath.extName()).to.equal('')
    })
  })

  describe('isDirectory', function() {
    const testData = {
      'Unix directory': ['/foo/bar/', true],
      'Unix file path': ['/foo/bar/baz.md', false],
      'Windows directory': ['/foo/bar/', true],
      'Windows file path': ['\\foo\\bar\\baz.md', false]
    }
    for (const testName of Object.keys(testData)) {
      it(testName, function() {
        const [input, output] = testData[testName]
        const file = new AbsoluteFilePath(input)
        expect(file.isDirectory()).to.equal(output)
      })
    }
  })

  describe('unixified', function() {
    const testData = {
      '/foo/bar': 'foo/bar',
      '\\foo/bar\\baz': 'foo/bar/baz'
    }
    for (const input of Object.keys(testData)) {
      it(`converts ${input} to ${testData[input]}`, function() {
        const filePath = new AbsoluteFilePath(input)
        expect(filePath.unixified()).to.equal(testData[input])
      })
    }
  })

  describe('publicPath', function() {
    it('returns the unixified path if there are no publications', function() {
      const filePath = new AbsoluteFilePath('content\\1.md')
      const actual = filePath.publicPath(new Publications())
      expect(actual.value).to.equal('/content/1.md')
    })

    it('adjusts the directory according to the matching publication', function() {
      const publications = Publications.fromJSON([
        {
          localPath: '/content',
          publicExtension: 'html',
          publicPath: '/'
        }
      ])
      const filePath = new AbsoluteFilePath('/content/1.md')
      const actual = filePath.publicPath(publications)
      expect(actual.value).to.equal('/1.html')
    })
  })
})
