import * as util from "util"
import { extractActivities } from "../activities/extract-activities"
import { extractImagesAndLinks } from "../activities/extract-images-and-links"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { UserError } from "../errors/user-error"
import { trimAllLineEnds } from "../helpers/trim-all-line-ends"
import * as events from "events"
import { Command } from "./command"
import { Configuration, PartialConfiguration } from "../configuration/configuration"
import { backfillDefaults } from "../configuration/backfill-defaults"

export type DebugSubcommand = "activities" | "ast" | "images" | "links" | "linkTargets"

export class DebugCommand extends events.EventEmitter implements Command {
  userConfig: PartialConfiguration
  subcommand: DebugSubcommand | undefined

  constructor(userConfig: PartialConfiguration, subcommand: DebugSubcommand | undefined) {
    super()
    this.userConfig = userConfig
    this.subcommand = subcommand
  }

  async execute(): Promise<void> {
    const config = backfillDefaults(this.userConfig)
    const filenames = await getFileNames(config)
    if (filenames.length !== 1) {
      const guidance = `Please tell me which file to debug

Example: text-run debug --${this.subcommand} foo.md`
      throw new UserError("no files specified", guidance)
    }
    const guidance = `possible subcommands are:
--activities: active regions
--ast: AST nodes
--images: embedded images
--links: embedded links
--link-targets: document anchors to link to

Example: text-run debug --images foo.md`
    const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)
    switch (this.subcommand) {
      case "activities":
        return debugActivities(ASTs, config)
      case "ast":
        return debugASTNodes(ASTs)
      case "images":
        return debugImages(ASTs)
      case "links":
        return debugLinks(ASTs)
      case "linkTargets":
        return debugLinkTargets(ASTs)
      case undefined:
        throw new UserError("missing debug sub-command", guidance)
      default:
        throw new UserError(`unknown debug sub-command: ${this.subcommand}`, guidance)
    }
  }
}

function debugActivities(ASTs: AstNodeList[], config: Configuration) {
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
  const images = extractImagesAndLinks(ASTs).filter(al => al.actionName === "check-image")
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
  const links = extractImagesAndLinks(ASTs).filter(al => al.actionName === "check-link")
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
