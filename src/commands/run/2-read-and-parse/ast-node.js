// @flow

// A node in the standardized Markdown/HTML AST
export type AstNode = {
  type: string, // markdown type of AST node
  tag: string, // HTML type of AST node
  file: string,
  line: number, // the line in the file at which this AST node occurs
  content: string, // textual content of this AST node
  attributes: { [string]: string } // the attributes of the node
}
