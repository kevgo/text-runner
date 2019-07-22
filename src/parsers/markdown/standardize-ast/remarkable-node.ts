/** A node in the output of the Remarkable parser */
export interface RemarkableNode {
  lines: number[]
  children: RemarkableNode[]
  type: string
  content: string
  attributes: any
  hLevel: string | undefined
  alt: string | undefined
  src: string | undefined
  href: string | undefined
  title: string | undefined
}

/** creates empty RemarkableNodes for testing */
export function scaffoldRemarkableNode(args: OptionalRemarkableNode) {
  return { ...defaultValues, ...args }
}
type OptionalRemarkableNode = Partial<RemarkableNode>

const defaultValues: RemarkableNode = {
  alt: undefined,
  attributes: undefined,
  children: [],
  content: "",
  hLevel: undefined,
  href: undefined,
  lines: [],
  src: undefined,
  title: undefined,
  type: ""
}
