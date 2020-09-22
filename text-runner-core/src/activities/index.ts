import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
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
  region: AstNodeList
  document: AstNodeList
}

/** scaffoldActivity creates a test Activity from the given data */
// TODO: use Partial<Activity>
export function scaffold(data: { actionName?: string } = {}): Activity {
  return {
    actionName: data.actionName || "foo",
    file: new AbsoluteFilePath("file"),
    line: 0,
    region: new AstNodeList(),
    document: new AstNodeList(),
  }
}
