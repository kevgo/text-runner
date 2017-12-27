// @flow

const {cyan, magenta, red} = require('chalk')
const fs = require('fs')
const path = require('path')
const request = require('request')

// Checks for broken hyperlinks
module.exports = function (params: {filename: string, formatter: Formatter, nodes: AstNodeList, configuration: Configuration}, done: DoneFunction) {
  params.formatter.start(`checking image`)
  const node = params.nodes[0]
  if (node.src == null || node.src === '') {
    params.formatter.error('image tag without source')
    done(new Error('1'))
    return
  }
  // $FlowFixMe
  const imagePath = path.join(path.dirname(params.filename), node.src)
  params.formatter.refine(`checking image ${cyan(imagePath)}`)
  if (isRemoteImage(node)) {
    checkRemoteImage(node, params.formatter, params.configuration, done)
  } else {
    checkLocalImage(imagePath, params.formatter, done)
  }
}

function checkLocalImage (imagePath: string, formatter: Formatter, done: DoneFunction) {
  fs.stat(path.join(process.cwd(), imagePath), (err, stats) => {
    if (err) {
      formatter.error(`image ${red(imagePath)} does not exist`)
      done(new Error(1))
    } else {
      formatter.success(`image ${cyan(imagePath)} exists`)
      done()
    }
  })
}

function checkRemoteImage (node: AstNode, formatter: Formatter, configuration: Configuration, done: DoneFunction) {
  if (configuration.get('fast')) {
    // $FlowFixMe
    formatter.skip(`skipping external image ${node.src}`)
    done()
    return
  }

  request({url: node.src, timeout: 2000}, (err, response) => {
    var error: ?ErrnoError = null
    if (err && err.code === 'ENOTFOUND') {
      formatter.warning(`image ${magenta(node.src)} does not exist`)
    } else if (response && response.statusCode === 404) {
      formatter.warning(`image ${magenta(node.src)} does not exist`)
    } else if (err && err.message === 'ESOCKETTIMEDOUT') {
      formatter.warning(`image ${magenta(node.src)} timed out`)
    } else if (err) {
      error = err
    } else {
      formatter.success(`image ${cyan(node.src)} exists`)
    }
    done(error)
  })
}

function isRemoteImage (node: AstNode): boolean {
  if (node.src != null) {
    // $FlowFixMe
    return node.src.startsWith('//') || node.src.startsWith('http://') || node.src.startsWith('https://')
  } else {
    return false
  }
}

function isImageWithoutSrc (node: AstNode): boolean {
  return !node.src
}
