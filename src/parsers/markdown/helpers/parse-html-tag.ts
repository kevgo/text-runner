import UnprintedUserError from '../../../errors/unprinted-user-error'
import parseHtmlAttributes from './parse-html-attributes'

const attrRE = /<(\/?\w+)\s*(.*)>/

export default function(
  html: string,
  filepath: string,
  line: number
): [string, { [key: string]: string }] {
  const matches = html.match(attrRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot parse HTML tag: '${html}'`,
      filepath,
      line
    )
  }
  return [matches[1], parseHtmlAttributes(matches[2])]
}
