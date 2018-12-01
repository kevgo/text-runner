import chalk from 'chalk'
import fs from 'fs-extra'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import AstNodeList from '../parsers/ast-node-list'
import parseMarkdown from '../parsers/markdown/parse-markdown'

export default (async function(
  filename: AbsoluteFilePath
): Promise<AstNodeList> {
  const content = (await fs.readFile(filename.value, {
    encoding: 'utf8'
  })).trim()
  if (content.length === 0) {
    console.log(chalk.magenta('found empty file ' + filename.platformified()))
  }
  return parseMarkdown(content, filename)
})
