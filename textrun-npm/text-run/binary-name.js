module.exports = async function (args) {
  console.log('This code runs inside the "binary-name" block implementation.')
  console.log('I found these elements in your document:')
  console.log(args.nodes)

  // capture content from the document
  // const content = activity.searcher.tagContent('boldtext')
  // do something with the content
  // args.log(content)
}
