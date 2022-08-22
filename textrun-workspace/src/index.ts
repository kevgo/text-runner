import * as textRunner from "text-runner"

import { additionalFileContent } from "./actions/additional-file-content.js"
import { existingDirectory } from "./actions/existing-directory.js"
import { existingFile } from "./actions/existing-file.js"
import { newDirectory } from "./actions/new-directory.js"
import { newFile } from "./actions/new-file.js"
import { workingDir } from "./actions/working-dir.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  additionalFileContent,
  workingDir,
  newFile,
  existingDirectory,
  existingFile,
  newDirectory,
}
