require! {
  'dashify'
}


# Builds up link targets
class LinkTargetBuilder

  ({@link-targets}) ->


  build-link-targets: (file-path, tree) ->
    @link-targets[file-path] or= []
    for node in tree
      switch node.type

        case 'htmltag'
          if (matches = node.content.match /<a name="([^"]*)">/)
            @link-targets[file-path].push type: 'anchor', name: matches[1]

        case 'heading'
          @link-targets[file-path].push type: 'heading', name: dashify(node.content), text: node.content, level: node.level

    tree



module.exports = LinkTargetBuilder
