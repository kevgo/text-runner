import slugify = require("@sindresorhus/slugify")

const delRE = /\//g
export function targetURL(targetName: string): string {
  return slugify(targetName.toLowerCase().replace(delRE, ""))
}
