export class RemarkableNode {
  lines: any
  children: RemarkableNode[]
  type: string
  content: string
  attributes: any
  hLevel: string | undefined
  alt: string | undefined
  src: string | undefined
  href: string | undefined
  title: string | undefined

  constructor() {
    this.type = ''
    this.content = ''
    this.children = []
  }
}
