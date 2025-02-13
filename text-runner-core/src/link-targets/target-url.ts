// @ts-expect-error: no types available
import anchor from "anchor-markdown-header"

export function targetURL(targetName: string): string {
  const link = anchor(targetName, "github.com") as string
  return link.substring(link.indexOf("#") + 1, link.indexOf(")"))
}
