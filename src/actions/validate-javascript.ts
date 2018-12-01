import pretendToUse from '../helpers/pretend-to-use'
import { ActionArgs } from '../runners/action-args'

// Runs the JavaScript code given in the code block
export default function(args: ActionArgs) {
  const code = args.nodes.textInNodeOfType('fence')
  args.formatter.log(code)
  try {
    // we only need to run the code for its side effects
    pretendToUse(new Function(code))
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
