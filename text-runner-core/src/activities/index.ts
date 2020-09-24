import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import * as ast from "../ast"
export { extractActivities } from "./extract-activities"
export { extractImagesAndLinks } from "./extract-images-and-links"

export type ActivityList = Activity[]

/**
 * Activity is an action instance.
 * A particular action that we are going to perform
 * on a particular region of a particular document.
 */
export interface Activity {
  actionName: string
  file: AbsoluteFilePath
  line: number
  region: ast.NodeList
  document: ast.NodeList
}

/** scaffoldActivity creates a test Activity from the given data */
// TODO: use Partial<Activity>
export function scaffold(data: { actionName?: string } = {}): Activity {
  return {
    actionName: data.actionName || "foo",
    file: new AbsoluteFilePath("file"),
    line: 0,
    region: new ast.NodeList(),
    document: new ast.NodeList(),
  }
}
