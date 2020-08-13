/** Searches dependencies */
export class UpstreamInfo {
  /** workspace --> workspaces that are upstreams of the key */
  private upstreams: Map<string, Set<string>>

  constructor(workspaces: string[]) {
    this.upstreams = new Map()
    for (const workspace of workspaces) {
      this.upstreams.set(workspace, new Set())
    }
  }

  registerDownstreams(workspace: string, dependencies: string[]) {
    for (const dependency of dependencies) {
      this.registerDownstream(workspace, dependency)
    }
  }

  registerDownstream(workspace: string, downstream: string) {
    const upstreams = this.upstreams.get(downstream)
    if (upstreams === undefined) {
      throw new Error(`Unregistered workspace: ${workspace}`)
    }
    if (!this.upstreams.has(workspace)) {
      throw new Error(`Unregistered workspace: ${workspace}`)
    }
    upstreams.add(workspace)
  }

  upstreamsFor(workspace: string): string[] {
    if (workspace === ".") {
      return []
    }
    const upstreams = this.upstreams.get(workspace)
    if (upstreams === undefined) {
      throw new Error(`Unregistered workspace: ${workspace}`)
    }
    return Array.from(upstreams).sort()
  }
}
