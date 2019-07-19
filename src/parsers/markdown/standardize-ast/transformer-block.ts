import { AbsoluteFilePath } from "../../../domain-model/absolute-file-path"
import { AstNodeList } from "../../ast-node-list"
import { RemarkableNode } from "./remarkable-node"

/**
 * TransformerBlock is a set of transformers that perform a typical group of transformations.
 *
 * An example is the group of transformers that convert custom HTML tags.
 */
export interface TransformerBlock {
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
    line: number
  ): Promise<AstNodeList>
}
