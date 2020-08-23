import { additionalFileContent } from "./actions/additional-file-content"
import { workingDir } from "./actions/working-dir"
import { newFile } from "./actions/new-file"
import { directory } from "./actions/directory"
import { existingFile } from "./actions/existing-file"
import { newDirectory } from "./actions/new-directory"

export const textrunActions = {
  additionalFileContent,
  workingDir,
  newFile,
  directory,
  fileContent: existingFile,
  newDirectory,
}
