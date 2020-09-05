import * as textRunner from "text-runner"

export async function callTextRunner(jsText: string, sourceDir: string, expectError: boolean) {
  // @ts-ignore: this make textRunner available as a variable here
  const tr = textRunner
  // @ts-ignore: this is used inside eval
  const formatter = "silent"
  let result: any
  let error: Error
  eval("result = " + jsText)
  result = await result
  if (!expectError && result.errorCount === 0) {
    // no error expected, no error encountered --> done
    return result
  }
  if (expectError && result.errorCount > 0) {
    // error expected and error encountered --> done
    return result
  }
  if (expectError && result.errorCount === 0) {
    // error expected and no error encountered --> error
    throw new Error("expected error but got none")
  }
  // no error expected and error encountered
  console.log(`${result.errorCount} errors`)
  for (const activityResult of result.activityResults) {
    if (activityResult.error) {
      console.log(`- ${activityResult.error.name}: ${activityResult.error.message}`)
    }
  }
  throw new Error("unexpected error")
}
