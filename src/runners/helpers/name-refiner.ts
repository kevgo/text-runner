import { RefineNameFn } from "../types/refine-name-function"

/** allows refining the current name of a test step */
export class NameRefiner {
  constructor(private name: string) {}

  /** returns the refined name */
  finalName(): string {
    return this.name
  }

  /** returns a function that can be called to refine the name */
  refineFn(): RefineNameFn {
    return this.refineName.bind(this)
  }

  /** updates the currently stored name to the given name */
  private refineName(newName: string) {
    this.name = newName
  }
}
