import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { Configuration } from "../configuration/types/configuration"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { ActivityResult } from "../activity-list/types/activity-result"

export async function debugCommand(config: Configuration): Promise<ActivityResult[]> {
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    return []
  }

  console.log("AST NODES:")
  const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)
  for (const AST of ASTs) {
    for (const node of AST) {
      console.log(`${node.file.platformified()}:${node.line}  ${node.type} ${showAttr(node)}`)
    }
  }

  console.log("\nIMAGES AND LINKS:")
  const links = extractImagesAndLinks(ASTs)
  if (links.length === 0) {
    console.log("(none)")
  } else {
    for (const link of links) {
      console.log(link)
    }
  }

  console.log("\nACTIVITIES:")
  const activities = extractActivities(ASTs, config.regionMarker)
  if (activities.length === 0) {
    console.log("(none)")
  } else {
    for (const activity of activities) {
      console.log(`${activity.file.platformified()}:${activity.line}  ${activity.actionName}`)
    }
  }

  console.log("\nLINK TARGETS:")
  const linkTargets = findLinkTargets(ASTs)
  for (const key of Object.keys(linkTargets.targets)) {
    console.log(key, linkTargets.targets[key])
  }

  return []
}

function showAttr(node: AstNode): string {
  if (node.type === "text") {
    return `("${node.content.trim()}")`
  }
  const keys = Object.keys(node.attributes)
  if (keys.length === 0) {
    return ""
  }
  return `(${node.attributes.textrun})`
}
