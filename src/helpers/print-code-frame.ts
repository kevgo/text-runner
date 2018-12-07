import { codeFrameColumns } from '@babel/code-frame'
import fs from 'fs'
import util from 'util'

type PrintFunc = (arg: string) => void | boolean

export default function(
  output: PrintFunc,
  filename: string | undefined,
  line: number | undefined
) {
  if (!filename || line == null) {
    return
  }

  const fileContent = util.promisify(fs.readFile)(filename, 'utf8')
  output(
    codeFrameColumns(fileContent, { start: { line } }, { forceColor: true })
  )
}
