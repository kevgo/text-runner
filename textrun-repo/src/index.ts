import * as textRunner from "text-runner"

import { executable } from "./executable.js"
import { existingFile } from "./existing-file.js"
import { existingFileContent } from "./existing-file-content.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  executable,
  existingFile,
  existingFileContent,
}
