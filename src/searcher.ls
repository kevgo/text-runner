require! {
  'prelude-ls' : {filter}
}


class Searcher

  ({@file-path, @start-line, @end-line, @nodes, @formatter}) ->


  node-content: (query, error-checker) ~>
    nodes = @nodes |> filter (.type is query.type)
    content = nodes[0]?.content
    if error = error-checker? {nodes, content}
      throw new Error error
    content



module.exports = Searcher
