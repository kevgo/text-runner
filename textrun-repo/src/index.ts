import * as tr from "text-runner"

import { executable } from "./executable"
import { existingFile } from "./existing-file"
import { existingFileContent } from "./existing-file-content"

export const textrunActions: tr.exports.TextrunActions = {
  executable,
  existingFile,
  existingFileContent,
}
