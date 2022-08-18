export function callArgs(command: string, platform: NodeJS.Platform): string[] {
  if (platform === "win32") {
    return ["cmd", "/c", command.replace(/\//g, "\\")]
  } else {
    return ["sh", "-c", command]
  }
}
