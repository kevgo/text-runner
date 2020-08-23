import { appendFile } from "./actions/append-file"
import { workingDir } from "./actions/working-dir"
import { createFile } from "./actions/create-file"
import { directory } from "./actions/directory"
import { fileContent } from "./actions/file-content"
import { newDirectory } from "./actions/new-directory"

export const textrunActions = {
  appendFile,
  workingDir,
  createFile,
  directory,
  fileContent,
  newDirectory,
}
