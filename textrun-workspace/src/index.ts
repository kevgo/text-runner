import { additionalFileContent } from "./actions/additional-file-content"
import { existingDirectory } from "./actions/existing-directory"
import { existingFile } from "./actions/existing-file"
import { newDirectory } from "./actions/new-directory"
import { newFile } from "./actions/new-file"
import { workingDir } from "./actions/working-dir"

export const textrunActions = {
  additionalFileContent,
  workingDir,
  newFile,
  existingDirectory,
  existingFile,
  newDirectory,
}
