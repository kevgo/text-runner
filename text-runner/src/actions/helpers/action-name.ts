import path from "path"
import slugify from "@sindresorhus/slugify"

export function actionName(filepath: string): string {
  return slugify(path.basename(filepath, path.extname(filepath)))
}
