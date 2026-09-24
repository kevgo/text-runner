type ShutdownHook = () => Promise<void> | void

const hooks = new Set<ShutdownHook>()

/** Registers a hook to run when the CLI finishes. Returns a function that unregisters it. */
export function registerShutdown(hook: ShutdownHook): () => void {
  hooks.add(hook)
  return () => {
    hooks.delete(hook)
  }
}

/** Runs and clears every registered shutdown hook. */
export async function runShutdownHooks(): Promise<void> {
  const pending = [...hooks]
  hooks.clear()
  for (const hook of pending) {
    await hook()
  }
}
