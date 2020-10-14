import * as tr from "text-runner-core"

export default function textrunnerCommand(action: tr.actions.Args): void {
  const documented = action.region.text().replace("text-run ", "")
  action.name(`Text-Runner command: ${documented}`)
  const existing = Object.keys(tr.commands).map(s => s.toLowerCase())
  if (!existing.includes(documented)) {
    throw new tr.UserError(
      `No text-run command: ${documented}`,
      `Commands are: ${existing.join(", ")}`,
      action.location
    )
  }
}
