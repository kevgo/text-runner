import { type ChildProcess, spawn } from "node:child_process"
import { callArgs } from "textrun-extension"

import { killProcessTree } from "./kill-process-tree.js"

export interface ServerOutput {
  fullText(): string
  waitForText(text: string): Promise<void>
}

/** A long-running process started in its own process group so it can be stopped with its children. */
export interface ServerProcess {
  kill(): Promise<void>
  output: ServerOutput
  pid(): number
}

export function startServer(command: string, cwd: string): ServerProcess {
  const [runnable, ...params] = callArgs(command, process.platform)
  if (runnable == null) {
    throw new Error("no command to execute given")
  }
  const child = spawn(runnable, params, {
    cwd,
    detached: process.platform !== "win32",
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"]
  })
  const output = collectOutput(child)
  let killed = false
  return {
    output,
    pid() {
      return child.pid ?? -1
    },
    async kill() {
      if (killed) return
      killed = true
      if (child.pid != null) await killProcessTree(child.pid)
      await delay(1)
    }
  }
}

function collectOutput(child: ChildProcess): ServerOutput {
  let text = ""
  const waiters: Array<{ reject: (err: Error) => void; resolve: () => void; text: string }> = []

  function consider(): void {
    for (const waiter of [...waiters]) {
      if (!text.includes(waiter.text)) continue
      waiters.splice(waiters.indexOf(waiter), 1)
      waiter.resolve()
    }
  }

  function fail(err: Error): void {
    for (const waiter of waiters.splice(0)) waiter.reject(err)
  }

  child.stdout?.on("data", (chunk: Buffer) => {
    text += chunk.toString()
    consider()
  })
  child.stderr?.on("data", (chunk: Buffer) => {
    text += chunk.toString()
    consider()
  })
  child.on("error", fail)
  child.on("close", () => {
    fail(new Error("process ended before producing the expected output"))
  })

  return {
    fullText() {
      return text
    },
    waitForText(expected: string) {
      if (text.includes(expected)) return Promise.resolve()
      return new Promise((resolve, reject) => {
        waiters.push({ reject, resolve, text: expected })
      })
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
