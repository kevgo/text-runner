import * as path from "path"
import * as slugify from "@sindresorhus/slugify"

export function actionName(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
