import * as ast from "../ast"
import { FullPath } from "../filesystem/full-path"
export { extractDynamic } from "./extract-dynamic"
export { extractImagesAndLinks } from "./extract-images-and-links"

/** a list of activities */
export type List = Activity[]

/**
 * Activity is an action instance.
 * A particular action that we are going to perform
 * on a particular region of a particular document.
 */
export interface Activity {
  actionName: string
  document: ast.NodeList
  file: FullPath
  line: number
  region: ast.NodeList
}

/** scaffoldActivity creates a test Activity from the given data */
// TODO: use Partial<Activity>
export function scaffold(data: { actionName?: string } = {}): Activity {
  return {
    actionName: data.actionName || "foo",
    file: new FullPath("file"),
    line: 0,
    region: new ast.NodeList(),
    document: new ast.NodeList(),
  }
}
