export class WorkspaceTagger {
  /** the known workspaces and whether they are tagged right now */
  workspaces: Map<string, boolean>

  constructor(knownWorkspaces: string[]) {
    this.workspaces = new Map()
    for (const knownWorkspace of knownWorkspaces) {
      this.workspaces.set(knownWorkspace, false)
    }
    this.workspaces.set(".", false)
  }

  tag(workspace: string) {
    if (this.workspaces.has(workspace)) {
      this.workspaces.set(workspace, true)
    } else {
      this.workspaces.set(".", true)
    }
  }

  tagMany(workspaces: string[]) {
    for (const workspace of workspaces) {
      this.tag(workspace)
    }
  }

  tagged(): string[] {
    const result: string[] = []
    for (const workspace of this.workspaces.keys()) {
      if (this.workspaces.get(workspace)) {
        result.push(workspace)
      }
    }
    return result
  }
}
