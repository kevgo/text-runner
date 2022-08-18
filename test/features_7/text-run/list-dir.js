import {promises as fs} from "fs"
export default async (action) => {
  const items = await fs.readdir(action.configuration.workspace.platformified())
  action.name(`${items.length} workspace files (${items.join(", ")})`)
}