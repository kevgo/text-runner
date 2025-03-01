export * from "./find.js"
export * from "./list.js"

/**
 * Target is a position in a Markdown file that links can point to:
 * headers or anchors
 */
export interface Target {
  readonly level?: number
  readonly name: string
  readonly text?: string
  readonly type: Types
}

/** types of link targets */
export type Types = "anchor" | "heading"
