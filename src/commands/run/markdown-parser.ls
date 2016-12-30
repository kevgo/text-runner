require! {
  'remarkable' : Remarkable
}
debug = require('debug')('text-runner:markdown-parser')



# Parses Markdown files into a standardized AST with this format:
# [
#   * line
#     type
#     content
#   * line
#     ...
# ]
class MarkdownParser

  ->
    @markdown-parser = new Remarkable 'full', html: on


  parse: (markdown-text) ->
    @markdown-parser.parse markdown-text, {}
      |> @_standardize-ast


  _html-image-tag-src: (node) ->
    matches = node.content.match /<img.*src="([^"]*)".*>/
    matches[1]


  # Returns whether this AST node represents an HTML tag
  _is-html-image-tag: (node) ->
    node.type is 'htmltag' and /<img [^>]*src=".*?".*?>/.test node.content




  _standardize-ast: (ast, line = 0, result = [], heading = null) ->
    modifiers = []
    for node in ast
      debug "found node: #{node}"
      node-line = if node.lines?.length > 0 then node.lines[0] + 1 else line
      switch

        case node.type is 'em_open'
          modifiers.push 'emphasized'

        case node.type is 'em_close'
          modifiers.splice modifiers.index-of('emphasized'), 1

        case node.type is 'strong_open'
          modifiers.push 'strong'

        case node.type is 'strong_close'
          modifiers.splice modifiers.index-of('strong'), 1

        case node.type is 'heading_open'
          heading = lines: node.lines, text: ''

        case node.type is 'heading_close'
          result.push line: heading.lines[*-1], type: 'heading', content: heading.text, level: node.h-level
          heading = null

        case @_is-html-image-tag node
          result.push line: node-line, type: 'image', src: @_html-image-tag-src node

        case node.type is 'image'
          result.push line: node-line, type: 'image', src: node.src

        case heading and node.type is 'text'
          heading.text += node.content

        case <[ code fence htmlblock htmltag link_open text ]>.index-of(node.type) > -1
          result.push line: node-line, type: "#{modifiers.sort!.join!}#{node.type}", content: (node.content or node.href)

      if node.children
        @_standardize-ast node.children, node-line, result, heading

    result



module.exports = MarkdownParser
