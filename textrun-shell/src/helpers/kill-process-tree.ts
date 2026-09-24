import { spawn } from "node:child_process"

/** Stops pid and the processes it started. pid must be a process-group leader on Unix. */
export async function killProcessTree(pid: number): Promise<void> {
  if (pid <= 0) return
  if (process.platform === "win32") {
    await taskkill(pid)
    return
  }
  try {
    process.kill(-pid, "SIGTERM")
  } catch (err) {
    if (isGone(err)) return
    try {
      process.kill(pid, "SIGTERM")
    } catch (fallbackErr) {
      if (!isGone(fallbackErr)) throw fallbackErr
    }
  }
}

function taskkill(pid: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const killer = spawn("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" })
    killer.on("error", reject)
    killer.on("close", () => {
      resolve()
    })
  })
}

function isGone(err: unknown): boolean {
  return !!err && typeof err === "object" && "code" in err && (err.code === "ESRCH" || err.code === "EINVAL")
}
