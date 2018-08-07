// @flow

describe('AbsoluteFilePath', function() {
  describe('unixifyPath', function() {
    const testData = {
      '\\foo/bar\\baz': '/foo/bar/baz',
      '/foo/bar': '/foo/bar'
    }
    for (const [input, output] of testData) {
      it(`converts ${input} to ${output}`, function() {
        const filePath = new AbsoluteFilePath(input)
        expect(filePath.unixifyPath()).to.equal(output)
      })
    }
  })

  describe('publicLink', function() {
    it('returns the public url path for this file path', function() {
      const publications = Publications.scaffold([
        {
          filePath: '/content',
          urlPath: '/',
          urlExtension: '.html'
        }
      ])
      const filePath = new AbsoluteFilePath('/1')
      const actual = filePath.publicLink(publications, 'html')
      expect(actual).to.equal('/1.html')
    })
  })
})
