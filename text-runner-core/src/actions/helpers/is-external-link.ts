import * as url from "url"

export function isExternalLink(target: string): boolean {
  return target.startsWith("//") || !!url.parse(target).protocol
}
