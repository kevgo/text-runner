/** describes the entire output of a "yarn workspaces info" command */
export interface YarnOutput {
  [name: string]: YarnWorkspace
}

/** describes information about a Yarn workspace in the "yarn workspaces info" command */
interface YarnWorkspace {
  location: string
  workspaceDependencies: string[]
}

/**
 * Provides programmatic access to the various information from "yarn workspaces info".
 * A dedicated class like this is necessary because the structure provided by "yarn workspaces info"
 * and contains two different ways to address workspaces: names and paths.
 * This class simplifies this to using only paths.
 */
export class YarnReader {
  /** the data struct received from "yarn workspaces info" */
  private readonly yarnInfo: YarnOutput

  /** workspace path --> paths of workspaces that use the key directly, needed because the yarn info contains the names instead of paths */
  private readonly directDownstreams: Map<string, Set<string>>

  /** workspace path --> paths of workspaces that use the key directly and indirectly */
  private readonly transitiveDownstreams: Map<string, Set<string>>

  constructor(yarnOutput: YarnOutput) {
    this.yarnInfo = yarnOutput

    // initialize empty variables
    this.directDownstreams = new Map()
    this.transitiveDownstreams = new Map()
    for (const yarnWSInfo of Object.values(yarnOutput)) {
      this.directDownstreams.set(yarnWSInfo.location, new Set())
      this.transitiveDownstreams.set(yarnWSInfo.location, new Set())
    }

    // populate direct downstreams
    for (const yarnWSInfo of Object.values(yarnOutput)) {
      const upstreamsPaths = this.pathsFor(yarnWSInfo.workspaceDependencies)
      for (const dsPath of upstreamsPaths) {
        // @ts-ignore
        this.directDownstreams.get(dsPath).add(yarnWSInfo.location)
      }
    }

    // populate transitive downstreams
    for (const [workspace, deps] of this.directDownstreams.entries()) {
      for (const dep of deps) {
        this.registerTransitiveDownstream(workspace, dep)
      }
    }
  }

  /**
   * Provides the given workspaces ordered in the optimal build order.
   * Workspaces with no upstreams are built first.
   */
  order(workspaces: string[]): string[] {
    return workspaces.sort((a: string, b: string) => {
      // @ts-ignore
      const sizeA = this.transitiveDownstreams.get(a).size
      // @ts-ignore
      const sizeB = this.transitiveDownstreams.get(b).size
      return sizeA - sizeB
    })
  }

  /** provides the paths for the given workspace names */
  pathsFor(names: string[]): string[] {
    return names.map((name) => this.yarnInfo[name].location).sort()
  }

  /** registers the transitive downstream dependency */
  private registerTransitiveDownstream(workspace: string, downstream: string) {
    if (workspace === downstream) {
      return
    }
    // @ts-ignore
    if (this.transitiveDownstreams.get(workspace).has(downstream)) {
      return
    }
    // @ts-ignore
    this.transitiveDownstreams.get(workspace).add(downstream)
    // @ts-ignore
    for (const dsOfDs of this.directDownstreams.get(downstream).values()) {
      this.registerTransitiveDownstream(workspace, dsOfDs)
    }
  }

  /** provides all direct and indirect downstreams for the workspace with the given path */
  downstreamsFor(workspace: string): string[] {
    if (workspace === ".") {
      return []
    }
    const downstreams = this.transitiveDownstreams.get(workspace)
    if (!downstreams) {
      throw new Error(`Unknown workspace: ${workspace}`)
    }
    return Array.from(downstreams).sort()
  }

  /** provides the paths for all workspaces */
  workspaces(): string[] {
    return Array.from(this.transitiveDownstreams.keys())
  }
}
