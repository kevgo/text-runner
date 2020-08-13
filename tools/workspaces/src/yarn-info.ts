/** Provides programmatic access to the information from "yarn workspaces info" */
export class YarnInfo {
  /** workspace --> workspaces that are upstreams of the key */
  private upstreams: Map<string, Set<string>>
  private downstreams: Map<string, Set<string>>
  private yarnInfo: any

  constructor(yarnInfo: any) {
    this.yarnInfo = yarnInfo
    this.upstreams = new Map()
    this.downstreams = new Map()
    for (const key of Object.keys(yarnInfo)) {
      this.downstreams.set(yarnInfo[key].location, new Set(yarnInfo[key].workspaceDependencies))
      this.upstreams.set(yarnInfo[key].location, new Set())
      for (const dep of yarnInfo[key].workspaceDependencies) {
        this.registerDownstream(yarnInfo[key].location, dep)
      }
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

  /** provides the locations of all workspaces */
  workspaces(): string[] {
    return Array.from(this.downstreams.keys())
  }

  /** provides the path of the workspace with the given name */
  workspaceWithName(name: string): string {
    return this.yarnInfo[name].location
  }
}
