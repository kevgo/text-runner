// @ts-expect-error: no types available
import * as anchor from "anchor-markdown-header"

export function targetURL(targetName: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const link = anchor(targetName, "github.com") as string
  return link.substring(link.indexOf("#") + 1, link.indexOf(")"))
}
