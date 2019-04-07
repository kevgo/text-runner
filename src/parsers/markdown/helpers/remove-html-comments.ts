const commentRE = /<!--.*-->/g

export function removeHtmlComments(html: string): string {
  return html.replace(commentRE, '').trim()
}
