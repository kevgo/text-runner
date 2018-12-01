const commentRE = /<!--.*-->/g

export default function removeHtmlComments(html: string): string {
  return html.replace(commentRE, '').trim()
}
