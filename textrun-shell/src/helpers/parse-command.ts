import { trimDollar } from "../helpers/trim-dollar.js"

export function parseCommand(text: string, globalizePathFunc: (x: string) => string): string {
  return text
    .split("\n")
    .map((line: string) => line.trim())
    .map(trimDollar)
    .filter((line: string) => line.length > 0)
    .map(globalizePathFunc)
    .join(" && ")
}
