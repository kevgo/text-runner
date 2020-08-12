/** Searches dependencies */
export class UpstreamFinder {
  private upstreams: Map<string, Set<string>>

  constructor() {
    this.upstreams = new Map()
  }

  registerDownstreams(workspace: string, dependencies: string[]) {
    for (const dependency of dependencies) {
      this.registerDownstream(workspace, dependency)
    }
  }

  registerDownstream(workspace: string, downstream: string) {
    if (!this.upstreams.has(downstream)) {
      this.upstreams.set(downstream, new Set())
    }
    this.upstreams.get(downstream).add(workspace)
  }

  upstreamsFor(workspace: string): string[] {
    return Array.from(this.upstreams.get(workspace))
  }
}
