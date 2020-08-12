/** replaceRequireLocalModule makes sure "require('.') works as expected even if running in a temp workspace. */
export function replaceRequireLocalModule(code: string): string {
  return code.replace(/require\(['"].['"]\)/, "require(process.cwd())")
}
