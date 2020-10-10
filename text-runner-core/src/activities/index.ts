import * as ast from "../ast"
import * as files from "../filesystem"
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
  location: files.Location
  region: ast.NodeList
}

/** scaffoldActivity creates a test Activity from the given data */
export function scaffold(data: Partial<Activity> = {}): Activity {
  return {
    actionName: data.actionName || "foo",
    location: files.Location.scaffold(),
    region: new ast.NodeList(),
    document: new ast.NodeList(),
  }
}
