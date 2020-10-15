import * as tr from "text-runner"

export default function actionArg(action: tr.actions.Args): void {
  const documented = action.region.text()
  const allExisting = Object.keys(action).sort()
  for (const existing of allExisting) {
    if (documented === existing) {
      return
    }
  }
  throw new tr.UserError(
    `"${documented}" is not an attribute of action`,
    `The attributes are ${allExisting.join(", ")}`,
    action.location
  )
}
