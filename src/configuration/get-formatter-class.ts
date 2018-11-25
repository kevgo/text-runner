import UnprintedUserError from '../errors/unprinted-user-error'
import DetailedFormatter from '../formatters/detailed-formatter'
import DotFormatter from '../formatters/dot-formatter'
import Formatter from '../formatters/formatter'

export default function getFormatterClass(
  name: string,
  def: typeof Formatter
): typeof Formatter {
  if (name === 'dot') {
    return DotFormatter
  } else if (name === 'detailed') {
    return DetailedFormatter
  } else if (name) {
    throw new UnprintedUserError(`Unknown formatter: ${name}

Available formatters are: detailed, dot`)
  } else {
    return def
  }
}
