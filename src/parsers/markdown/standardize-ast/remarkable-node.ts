/** A node in the output of the Remarkable parser */
export class RemarkableNode {
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

  // This constructor isn't used and just here to make the type checker happy
  constructor() {
    this.type = ""
    this.content = ""
    this.children = []
    this.lines = []
  }
}
