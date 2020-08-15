import { appendFile } from "./actions/append-file"
import { cd } from "./actions/cd"
import { directory } from "./actions/directory"
import { fileContent } from "./actions/file-content"
import { createDirectory } from "./actions/create-directory"

export const textrunActions = {
  appendFile,
  cd,
  directory,
  fileContent,
  createDirectory,
}
