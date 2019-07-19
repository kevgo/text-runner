import color from 'colorette'
import path from 'path'
import { printCodeFrame } from '../helpers/print-code-frame'
import { Formatter } from './formatter'

export class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

  error(errorMessage: string) {
    super.error(errorMessage)
    console.log()
    console.log(color.dim(this.output))
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(errorMessage)
    printCodeFrame(
      console.log,
      path.join(this.sourceDir, this.activity.file.platformified()),
      this.activity.line
    )
  }

  skip(message: string) {
    super.skip(message)
    process.stdout.write(color.cyan('.'))
  }

  success() {
    super.success()
    process.stdout.write(color.green('.'))
  }

  warning(warningMessage: string) {
    super.warning(warningMessage)
    process.stdout.write(color.magenta('.'))
  }
}
