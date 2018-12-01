import extractActivities from '../activity-list/extract-activities'
import extractImagesAndLinks from '../activity-list/extract-images-and-links'
import { Configuration } from '../configuration/configuration'
import getFileNames from '../finding-files/get-filenames'
import findLinkTargets from '../link-targets/find-link-targets'
import AstNode from '../parsers/ast-node'
import AstNodeList from '../parsers/ast-node-list'
import readAndParseFile from '../parsers/read-and-parse-file'

async function debugCommand(config: Configuration): Promise<Error[]> {
  const filenames = getFileNames(config)
  if (filenames.length === 0) {
    return []
  }

  console.log('AST NODES:')
  const ASTs: AstNodeList[] = await Promise.all(filenames.map(readAndParseFile))
  for (const AST of ASTs) {
    for (const node of AST) {
      console.log(
        `${node.file.platformified()}:${node.line}  ${node.type} ${showAttr(
          node
        )}`
      )
    }
  }

  console.log('\nIMAGES AND LINKS:')
  const links = extractImagesAndLinks(ASTs)
  if (links.length === 0) {
    console.log('(none)')
  } else {
    for (const link of links) {
      console.log(link)
    }
  }

  console.log('\nACTIVITIES:')
  const activities = extractActivities(ASTs, config.classPrefix)
  if (activities.length === 0) {
    console.log('(none)')
  } else {
    for (const activity of activities) {
      console.log(
        `${activity.file.platformified()}:${activity.line}  ${activity.type}`
      )
    }
  }

  console.log('\nLINK TARGETS:')
  const linkTargets = findLinkTargets(ASTs)
  for (const key of Object.keys(linkTargets.targets)) {
    console.log(key, linkTargets.targets[key])
  }

  return []
}

function showAttr(node: AstNode): string {
  if (node.type === 'text') {
    return `("${node.content.trim()}")`
  }
  const keys = Object.keys(node.attributes)
  if (keys.length === 0) {
    return ''
  }
  return `(${node.attributes.textrun})`
}

export default debugCommand
