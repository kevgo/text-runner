import path from "path"
import { actionName } from "text-runner"

export function actionNames(): string[] {
  return Object.keys(pkgJson.textrunActions).map()
}
