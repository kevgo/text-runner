import * as ast from "../ast/index.js"
import * as files from "../filesystem/index.js"
export { extractDynamic } from "./extract-dynamic.js"
export { extractImagesAndLinks } from "./extract-images-and-links.js"

/** a list of activities */
export type List = Activity[]

/**
 * Activity is an action instance.
 * A particular action that we are going to perform
 * on a particular region of a particular document.
 */
export interface Activity {
  readonly actionName: string
  document: ast.NodeList
  readonly location: files.Location
  readonly region: ast.NodeList
}

/** scaffoldActivity creates a test Activity from the given data */
export function scaffold(data: Partial<Activity> = {}): Activity {
  return {
    actionName: data.actionName || "foo",
    location: files.Location.scaffold(),
    region: new ast.NodeList(),
    document: new ast.NodeList()
  }
}
