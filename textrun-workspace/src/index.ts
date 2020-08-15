import { appendFile } from "./actions/append-file"
import { cd } from "./actions/cd"
import { mkdir } from "./actions/mkdir"

export const textrunActions = {
  appendFile,
  cd,
  mkdir,
}
