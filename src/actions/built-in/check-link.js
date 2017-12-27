// @flow

const {cyan, magenta, red} = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const request = require('request')


// Checks for broken hyperlinks
module.exports = function (params: {filename: string, formatter: Formatter, nodes: AstNodeList, linkTargets: LinkTargetList, configuration: Configuration}, done: DoneFunction) {
  const target = params.nodes[0].content
  if (target == null || target === '') {
    params.formatter.error('link without target')
    done(new Error('1'))
    return
  }
  params.formatter.start(`checking link to ${cyan(target)}`)
  if (isLinkToAnchorInSameFile(target)) {
    checkLinkToAnchorInSameFile(params.filename, target, params.linkTargets, params.formatter, done)
  } else if (isLinkToAnchorInOtherFile(target)) {
    checkLinkToAnchorInOtherFile(params.filename, target, params.linkTargets, params.formatter, done)
  } else if (isExternalLink(target)) {
    checkExternalLink(target, params.formatter, params.configuration, done)
  } else {
    checkLinkToFilesystem(params.filename, target, params.formatter, done)
  }
}

function checkExternalLink (target: string, formatter: Formatter, configuration: Configuration, done: DoneFunction) {
  if (configuration.get('fast')) {
    formatter.skip(`skipping link to external website ${target}`)
    done()
    return
  }

  request({url: target, timeout: 4000}, (err, response) => {
    if (err && err.code === 'ENOTFOUND') {
      formatter.warning(`link to non-existing external website ${red(target)}`)
    } else if (response && response.statusCode === 404) {
      formatter.warning(`link to non-existing external website ${red(target)}`)
    } else if (err && err.message === 'ESOCKETTIMEDOUT') {
      formatter.warning(`link to ${magenta(target)} timed out`)
    } else if (err && err.message.startsWith("Hostname/IP doesn't match certificate's altnames")) {
      formatter.warning(`Link to ${magenta(target)} has error: #{err.message}`)
    } else if (err != null) {
      formatter.warning(`error while checking link to ${magenta(target)}: ${err}`)
    } else {
      formatter.success(`link to external website ${cyan(target)}`)
    }
    done()
  })
}

function checkLinkToFilesystem (filename: string, target: string, formatter: Formatter, done: DoneFunction) {
  target = path.join(path.dirname(filename), target)
  fs.stat(target, (err, stats) => {
    if (err != null) {
      formatter.error(`link to non-existing local file ${red(target)}`)
    } else if (stats.isDirectory()) {
      formatter.success(`link to local directory ${cyan(target)}`)
    } else {
      formatter.success(`link to local file ${cyan(target)}`)
    }
    done(err)
  })
}

function checkLinkToAnchorInSameFile (filename: string, target: string, linkTargets: LinkTargetList, formatter: Formatter, done: DoneFunction) {
  const targetEntry = linkTargets[filename].filter((linkTarget) => linkTarget.name === target.substr(1))[0]
  if (!targetEntry) {
    formatter.error(`link to non-existing local anchor ${red(target)}`)
    return done(new Error('1'))
  } else if (targetEntry.type === 'heading') {
    formatter.success(`link to local heading ${cyan(targetEntry.text)}`)
  } else {
    formatter.success(`link to #${cyan(targetEntry.name)}`)
  }
  done()
}

function checkLinkToAnchorInOtherFile (filename: string, target: string, linkTargets: LinkTargetList, formatter: Formatter, done: DoneFunction) {
  var [targetFilename, targetAnchor] = target.split('#')
  targetFilename = decodeURI(targetFilename)
  if (!linkTargets[targetFilename]) {
    formatter.error(`link to anchor #${cyan(targetAnchor)} in non-existing file ${red(targetFilename)}`)
  }
  const targetEntry = (linkTargets[targetFilename] || []).filter((linkTarget) => linkTarget.name === targetAnchor)[0]
  if (!targetEntry) {
    formatter.error(`link to non-existing anchor #${red(targetAnchor)} in ${cyan(targetFilename)}`)
  }

  if (targetEntry.type === 'heading') {
    formatter.success(`link to heading ${cyan(targetEntry.text)} in ${cyan(targetFilename)}`)
  } else {
    formatter.success(`link to ${cyan(targetFilename)}#${cyan(targetAnchor)}`)
  }
  done()
}

function isExternalLink (target: string): boolean {
  return target.startsWith('//') || target.startsWith('http://') || target.startsWith('https://')
}

function isLinkToAnchorInOtherFile (target: string): boolean {
  if ((target.match(/#/g) || []).length !== 1) {
    return false
  } else if (/^https?:\/\//.test(target)) {
    return false
  } else {
    return true
  }
}

function isLinkToAnchorInSameFile (target: string): boolean {
  return target.startsWith('#')
}

function isLinkWithoutTarget (target): boolean {
  return !target
}
