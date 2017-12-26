// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const jsYaml = require('js-yaml')
const {minimum} = require('prelude-ls')

module.exports = function (params: {configuration: Configuration, formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  params.formatter.start('determining minimum supported NodeJS version')

  const documentedVersion = parseInt(params.searcher.nodeContent({type: 'text'}, ({nodes, content}) => {
    if (!content) return 'no text given'
    if (content + 0 === NaN) return 'given Node version is not a number'
  }))
  params.formatter.refine(`determining whether minimum supported NodeJS version is ${cyan(documentedVersion)}`)

  getSupportedVersion((err, supportedVersion) => {
    if (err) {
      params.formatter.error(err)
      done(err)
      return
    }
    if (supportedVersion === documentedVersion) {
      params.formatter.success(`requires at least Node ${cyan(supportedVersion)}`)
      done()
      return
    }
    if (supportedVersion !== documentedVersion) {
      params.formatter.error(`documented minimum Node version is ${cyan(documentedVersion)}, should be ${cyan(supportedVersion)}`)
      done(new Error('1'))
    }
  })
}

function getSupportedVersion (done) {
  loadYmlFile('.travis.yml', (err, content) => {
    if (err) {
      done(err)
      return
    }
    if (content == null) {
      done(new Error('.travis.yml'))
      return
    }
    const minimumVersion = parseInt(minimum(content.node_js))
    if (minimumVersion === NaN) {
      done(new Error('listed version is not a number'))
      return
    }
    done(null, minimumVersion)
  })
}

function loadYmlFile (filename: string, done) {
  fs.readFile(filename, {encoding: 'utf8'}, (err: ?ErrnoError, fileContent: string) => {
    if (err) {
      done(err)
      return
    }
    try {
      done(null, jsYaml.safeLoad(fileContent))
    } catch (e) {
      done(e)
    }
  })
}
