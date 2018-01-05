// @flow

export type AstNode = {
  line?: number,       // the line in the file at which this AST node occurs
  type?: string,       // type of AST node
  content?: string,   // textual content of this AST node
  src?: string,       //
  level?: number      // nesting level of this AST node
}
