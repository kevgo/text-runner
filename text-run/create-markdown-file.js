// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

/* eslint no-irregular-whitespace: 0 */

const fs = require('fs')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const markdown = args.nodes.textInNodeOfType('fence').replace(/​/g, '')
  fs.writeFileSync(path.join(args.configuration.workspace, '1.md'), markdown)
}
