import { appendFile } from "./actions/append-file"
import { cd } from "./actions/cd"
import { directory } from "./actions/directory"
import { mkdir } from "./actions/mkdir"

export const textrunActions = {
  appendFile,
  cd,
  directory,
  mkdir,
}
