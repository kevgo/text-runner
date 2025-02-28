import * as textRunner from "text-runner"

export default function textrunnerCommand(action: textRunner.actions.Args): void {
  const documented = action.region.text().replace("text-runner ", "")
  action.name(`Text-Runner command: ${documented}`)
  const existing = Object.keys(textRunner.commands).map(s => s.toLowerCase())
  if (!existing.includes(documented)) {
    throw new textRunner.UserError(
      `No text-runner command: ${documented}`,
      `Commands are: ${existing.join(", ")}`,
      action.location
    )
  }
}
