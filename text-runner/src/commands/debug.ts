import * as util from "util"
import { extractActivities } from "../activity-list/extract-activities"
import { extractImagesAndLinks } from "../activity-list/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { ExecuteResult } from "../runners/execute-result"
import { loadConfiguration } from "../configuration/load-configuration"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { UserError } from "../errors/user-error"
import { trimAllLineEnds } from "../helpers/trim-all-line-ends"

export async function debugCommand(cmdlineArgs: UserProvidedConfiguration): Promise<ExecuteResult> {
  const config = await loadConfiguration(cmdlineArgs)

  const typeEntry = Object.entries(cmdlineArgs.debugSwitches || {}).filter((e: any) => e[1])[0]
  if (!typeEntry) {
    const guidance = `Please tell me what to debug. I can print these things:

--activities: active regions
--ast: AST nodes
--images: embedded images
--links: embedded links
--link-targets: document anchors to link to

Example: text-run debug --images foo.md`
    throw new UserError("missing data type", guidance)
  }
  const type = typeEntry[0]
  const filenames = await getFileNames(config)
  if (filenames.length !== 1) {
    const guidance = `Please tell me which file to debug

Example: text-run debug --${type} foo.md`
    throw new UserError("no files specified", guidance)
  }
  const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

  switch (type) {
    case "activities":
      debugActivities(ASTs, config)
      break
    case "ast":
      debugASTNodes(ASTs)
      break
    case "images":
      debugImages(ASTs)
      break
    case "links":
      debugLinks(ASTs)
      break
    case "linkTargets":
      debugLinkTargets(ASTs)
      break
    default:
      throw new UserError("unknown debug sub-command: " + type)
  }
  return ExecuteResult.empty()
}

function debugActivities(ASTs: AstNodeList[], config: UserProvidedConfiguration) {
  console.log("\nACTIVITIES:")
  const activities = extractActivities(ASTs, config.regionMarker || "type")
  if (activities.length === 0) {
    console.log("(none)")
  } else {
    for (const activity of activities) {
      console.log(`${activity.file.platformified()}:${activity.line}  ${activity.actionName}`)
    }
  }
}

function debugASTNodes(ASTs: AstNodeList[]) {
  console.log("AST NODES:")
  for (const AST of ASTs) {
    for (const node of AST) {
      console.log(`${node.file.platformified()}:${node.line}  ${node.type} ${showAttr(node)}`)
    }
  }
}

function debugImages(ASTs: AstNodeList[]) {
  console.log("\nIMAGES:")
  const images = extractImagesAndLinks(ASTs).filter((al) => al.actionName === "check-image")
  if (images.length === 0) {
    console.log("(none)")
    return
  }
  for (const image of images) {
    image.document = new AstNodeList()
    console.log(trimAllLineEnds(util.inspect(image, false, Infinity)))
  }
}

function debugLinks(ASTs: AstNodeList[]) {
  console.log("\nLINKS:")
  const links = extractImagesAndLinks(ASTs).filter((al) => al.actionName === "check-link")
  if (links.length === 0) {
    console.log("(none)")
    return
  }
  for (const image of links) {
    image.document = new AstNodeList()
    console.log(trimAllLineEnds(util.inspect(image, false, Infinity)))
  }
}

function debugLinkTargets(ASTs: AstNodeList[]) {
  console.log("\nLINK TARGETS:")
  const linkTargets = findLinkTargets(ASTs)
  for (const key of Object.keys(linkTargets.targets)) {
    console.log(key, linkTargets.targets[key])
  }
}

function showAttr(node: AstNode): string {
  if (node.type === "text") {
    return `("${node.content.trim()}")`
  }
  const keys = Object.keys(node.attributes)
  if (keys.length === 0) {
    return ""
  }
  return `(${node.attributes.type})`
}
