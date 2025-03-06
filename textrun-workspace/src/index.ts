import * as textRunner from "text-runner"

import { additionalFileContent } from "./actions/additional-file-content.js"
import { emptyFile } from "./actions/empty-file.js"
import { existingDirectory } from "./actions/existing-directory.js"
import { existingFile } from "./actions/existing-file.js"
import { existingFileWithContent } from "./actions/existing-file-with-content.js"
import { newDirectory } from "./actions/new-directory.js"
import { newFile } from "./actions/new-file.js"
import { workingDir } from "./actions/working-dir.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  additionalFileContent,
  emptyFile,
  existingDirectory,
  existingFile,
  existingFileWithContent,
  newDirectory,
  newFile,
  workingDir
}
