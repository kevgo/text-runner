import toSpaceCase from "to-space-case"

export default function convertToActivityTypeName(blockType: string): string {
  return toSpaceCase(blockType || "")
}
