import AbsoluteFilePath from '../../../domain-model/absolute-file-path'
import UnprintedUserError from '../../../errors/unprinted-user-error'

const tagNameRE = /^<(\/?\w+).*>/

export default function getHtmlBlockTag(
  html: string,
  file: AbsoluteFilePath,
  line: number
): string {
  const matches = html.match(tagNameRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot find tagname in HTML block: '${html}'`,
      file.platformified(),
      line
    )
  }
  return matches[1]
}
