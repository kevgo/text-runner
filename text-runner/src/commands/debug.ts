import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { ExecuteResult } from "../runners/execute-result"
import { loadConfiguration } from "../configuration/load-configuration"

export async function debugCommand(cmdlineArgs: UserProvidedConfiguration): Promise<ExecuteResult> {
  const config = await loadConfiguration(cmdlineArgs)

  const typeEntry = Object.entries(cmdlineArgs.debugSwitches || {}).filter((e: any) => e[1])[0]
  if (!typeEntry) {
    console.log(`
Please tell me what to debug. I can print these things:

--activities: active regions
--ast: AST nodes
--images: embedded images
--links: embedded links
--linkTargets: linkable elements

Example: text-run debug --images foo.md
`)
    process.exit(1)
  }
  const type = typeEntry[0]
  if (!cmdlineArgs.files) {
    console.log("Please tell me which file to debug\n")
    console.log(`Example: text-run debug --${type} foo.md`)
    process.exit(1)
  }
  process.exit(2)
  const filenames = await getFileNames(config)
  if (filenames.length === 0) {
    return ExecuteResult.empty()
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

  return ExecuteResult.empty()
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
