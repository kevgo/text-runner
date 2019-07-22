import { expect } from "chai"
import { scaffoldRemarkableNode } from "./remarkable-node"

describe("scaffoldRemarkableNode", function() {
  it("creates empty scaffolds", function() {
    const node = scaffoldRemarkableNode({})
    expect(node).to.not.be.an.instanceOf(scaffoldRemarkableNode)
    expect(node.content).to.equal("")
  })

  it("creates empty scaffolds", function() {
    const node = scaffoldRemarkableNode({ content: "foo" })
    expect(node).to.not.be.an.instanceOf(scaffoldRemarkableNode)
    expect(node.content).to.equal("foo")
  })
})
