import { ActionArgs } from "../types/action-args"

export default function test(args: ActionArgs) {
  args.log(args.nodes.text())
}
