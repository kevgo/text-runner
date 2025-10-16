import * as textRunner from "text-runner"

import { appendFile } from "./actions/append-file.js"
import { compareFiles } from "./actions/compare-files.js"
import { copyFile } from "./actions/copy-file.js"
import { emptyFile } from "./actions/empty-file.js"
import { existingDirectory } from "./actions/existing-directory.js"
import { existingFileWithContent } from "./actions/existing-file-with-content.js"
import { existingFile } from "./actions/existing-file.js"
import { newDirectory } from "./actions/new-directory.js"
import { newFile } from "./actions/new-file.js"
import { workingDir } from "./actions/working-dir.js"

export const textrunActions: textRunner.exports.TextrunActions = {
  appendFile,
  compareFiles,
  copyFile,
  emptyFile,
  existingDirectory,
  existingFile,
  existingFileWithContent,
  newDirectory,
  newFile,
  workingDir
}
