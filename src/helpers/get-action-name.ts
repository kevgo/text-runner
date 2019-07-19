import kebab from "@queso/kebab-case"
import path from "path"

export function getActionName(filepath: string): string {
  return kebab(path.basename(filepath, path.extname(filepath)))
}
