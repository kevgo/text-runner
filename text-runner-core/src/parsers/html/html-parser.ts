import * as parse5 from "parse5"
import * as util from "util"

import * as ast from "../../ast"
import * as files from "../../filesystem/index"
import { TagMapper } from "../tag-mapper"

/** Parser converts HTML5 source into the standardized AST format. */
export class Parser {
  private readonly tagMapper: TagMapper

  constructor(tagMapper: TagMapper) {
    this.tagMapper = tagMapper
  }

  /**
   * Parse returns the standard AST for the given HTML text.
   *
   * @param file The file in which the given text happens (for error messages)
   * @param startingLine The line at which this HTML snippet is located in the source document.
   *                     This parameter helps show correct line numbers for HTML snippets
   *                     that are embedded in Markdown documents.
   */
  parse(text: string, startingLocation: files.Location): ast.NodeList {
    const htmlAst = parse5.parse(text, {
      sourceCodeLocationInfo: true,
    })
    if (!instanceOfDefaultTreeDocument(htmlAst)) {
      throw new Error("expected parse5.DefaultTreeDocument instance")
    }
    return this.standardizeDocument(htmlAst, startingLocation)
  }

  /** returns whether the given HTML node is an empty text node */
  private isEmptyTextNode(node: parse5.DefaultTreeNode): boolean {
    return instanceOfDefaultTreeTextNode(node) && node.value.trim() === ""
  }

  /** returns the subtree of the given HTML AST whose root node has the given name */
  private findChildWithName(node: parse5.DefaultTreeParentNode, name: string): parse5.DefaultTreeElement {
    for (const childNode of node.childNodes) {
      if (childNode.nodeName === name) {
        if (!instanceOfDefaultTreeElement(childNode)) {
          throw new Error("Expected DefaultTreeElement")
        }
        return childNode
      }
    }
    throw new Error(`child node '${name}' not found in AST: ${util.inspect(node)}`)
  }

  private findBodyNode(node: parse5.DefaultTreeParentNode): parse5.DefaultTreeParentNode {
    const result = this.findChildWithName(node, "body")
    if (!instanceOfParentTreeNode(result)) {
      throw new Error("Expected parent tree node")
    }
    return result
  }

  private findHTMLNode(node: parse5.DefaultTreeDocument): parse5.DefaultTreeParentNode {
    const result = this.findChildWithName(node, "html")
    if (!instanceOfParentTreeNode(result)) {
      throw new Error("Expected parent tree node")
    }
    return result
  }

  /**
   * converts the given HTML AST for an entire HTML document into the standard AST
   */
  private standardizeDocument(
    documentAst: parse5.DefaultTreeDocument,
    startingLocation: files.Location,
    startingLine = 1
  ): ast.NodeList {
    const result = new ast.NodeList()
    const htmlNode = this.findHTMLNode(documentAst)
    const bodyNode = this.findBodyNode(htmlNode)
    for (const childNode of bodyNode.childNodes) {
      result.push(...this.standardizeNode(childNode, startingLocation.withLine(startingLine)))
    }
    return result
  }

  /** converts the given HTML AST node into the standard format */
  private standardizeNode(node: parse5.DefaultTreeNode, startingLocation: files.Location): ast.NodeList {
    if (this.isEmptyTextNode(node)) {
      return new ast.NodeList()
    }
    if (instanceOfDefaultTreeTextNode(node)) {
      return this.standardizeTextNode(node, startingLocation)
    }
    if (!instanceOfDefaultTreeElement(node)) {
      throw new Error("unknown tree node: " + util.inspect(node))
    }
    if (this.tagMapper.isStandaloneTag(node.nodeName)) {
      return this.standardizeStandaloneNode(node, startingLocation)
    }
    return this.standardizeOpenCloseTag(node, startingLocation)
  }

  /** converts the given HTML tag with open and closing tag into the standard format */
  private standardizeOpenCloseTag(node: parse5.DefaultTreeElement, startingLocation: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    const attributes = standardizeHTMLAttributes(node.attrs)

    // store the opening node
    let startLine = startingLocation.line
    if (node.sourceCodeLocation) {
      startLine += node.sourceCodeLocation.startLine - 1
    } else {
      const parentNode = node.parentNode as parse5.DefaultTreeElement
      if (parentNode.sourceCodeLocation) {
        startLine += parentNode.sourceCodeLocation.startLine
      }
    }
    result.push(
      new ast.Node({
        attributes,
        content: "",
        location: startingLocation.withLine(startLine),
        tag: node.tagName as ast.NodeTag,
        type: this.tagMapper.openingTypeForTag(node.tagName as ast.NodeTag, attributes),
      })
    )

    // store the child nodes in between the opening and closing node
    for (const childNode of node.childNodes) {
      const standardizedChildNodes = this.standardizeNode(childNode, startingLocation)
      result.push(...standardizedChildNodes)
    }

    // store the closing node
    let endLine: number
    if (node.sourceCodeLocation) {
      endLine = node.sourceCodeLocation.endLine + startingLocation.line - 1
    } else if (node.parentNode && instanceOfDefaultTreeElement(node.parentNode) && node.parentNode.sourceCodeLocation) {
      endLine = node.parentNode.sourceCodeLocation.endLine + startingLocation.line - 1
    } else {
      throw new Error(`cannot determine end line for node ${node}`)
    }
    if (!node.sourceCodeLocation || (node.sourceCodeLocation && node.sourceCodeLocation.endTag)) {
      const tag = ("/" + node.tagName) as ast.NodeTag
      result.push(
        new ast.Node({
          attributes: {},
          content: "",
          location: startingLocation.withLine(endLine),
          tag,
          type: this.tagMapper.typeForTag(tag, attributes),
        })
      )
    }
    return result
  }

  /** converts the given HTML standalone node into the standard format */
  private standardizeStandaloneNode(node: parse5.DefaultTreeElement, startingLocation: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    const attributes = standardizeHTMLAttributes(node.attrs)
    result.push(
      new ast.Node({
        attributes,
        content: "",
        location: startingLocation.withLine((node.sourceCodeLocation?.startLine || 0) + startingLocation.line - 1),
        tag: node.tagName as ast.NodeTag,
        type: this.tagMapper.typeForTag(node.tagName as ast.NodeTag, attributes),
      })
    )
    return result
  }

  /** converts the given HTML text node into the standard format */
  private standardizeTextNode(node: parse5.DefaultTreeTextNode, startingLocation: files.Location): ast.NodeList {
    const result = new ast.NodeList()
    if (node.value !== "\n") {
      result.push(
        new ast.Node({
          attributes: {},
          content: node.value.trim(),
          location: startingLocation.withLine((node.sourceCodeLocation?.startLine ?? 0) + startingLocation.line - 1),
          tag: "",
          type: "text",
        })
      )
    }
    return result
  }
}

function instanceOfDefaultTreeDocument(object: any): object is parse5.DefaultTreeDocument {
  return "childNodes" in object
}

function instanceOfDefaultTreeTextNode(object: any): object is parse5.DefaultTreeTextNode {
  return object.nodeName === "#text"
}

function instanceOfParentTreeNode(object: any): object is parse5.DefaultTreeParentNode {
  return !!object.childNodes
}

function instanceOfDefaultTreeElement(object: any): object is parse5.DefaultTreeElement {
  return !!object.nodeName && !!object.tagName && !!object.attrs
}

/** converts the given HTML AST node attributes into the standard AST format */
export function standardizeHTMLAttributes(attrs: parse5.Attribute[]): ast.NodeAttributes {
  const result: ast.NodeAttributes = {}
  if (attrs) {
    for (const attr of attrs) {
      result[attr.name] = attr.value
    }
  }
  return result
}
