// @flow

// A node in the standardized Markdown/HTML AST
export type AstNode = {
  filepath: string,
  line: number, // the line in the file at which this AST node occurs
  type: string, // type of AST node
  html?: string, // HTML serialization of this node
  content: string, // textual content of this AST node
  attributes?: { [string]: string } // the attributes of the node
}
