import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { RemarkableNode } from "./remarkable-node"

/**
 * TransformerCategory is a set of transformers that perform a typical group of transformations.
 *
 * An example is the group of transformers that convert custom HTML tags.
 */
export interface TransformerCategory {
  // loadTransformers loads the transformers asynchronously
  loadTransformers(): Promise<void>

  // canTransform returns whether this TransformerBlock can transform the given RemarkableNode
  canTransform(
    node: RemarkableNode,
    filepath: AbsoluteFilePath,
    line: number
  ): boolean

  // transforms the given RemarkableNode into an AstNodeList
  transform(
    node: RemarkableNode,
    filepath: AbsoluteFilePath,
    line: number,
    openTags: OpenTagTracker
  ): Promise<AstNodeList>
}
