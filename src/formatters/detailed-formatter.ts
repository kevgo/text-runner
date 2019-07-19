import color from 'colorette'
import path from 'path'
import { printCodeFrame } from '../helpers/print-code-frame'
import { Formatter } from './formatter'

export class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  error(errorMessage: string) {
    super.error(errorMessage)
    console.log(color.dim(this.output))
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(errorMessage)
    const filePath = path.join(
      this.sourceDir,
      this.activity.file.platformified()
    )
    printCodeFrame(console.log, filePath, this.activity.line)
  }

  skip(message: string) {
    super.skip(message)
    if (this.output) {
      console.log(color.dim(this.output))
    }
    console.log(
      color.cyan(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${message}`
      )
    )
  }

  success() {
    super.success()
    if (this.output) {
      console.log(color.dim(this.output))
    }
    console.log(
      color.green(
        `${this.activity.file.platformified()}:${this.activity.line} -- ${
          this.title
        }`
      )
    )
  }

  warning(warningMessage: string) {
    super.warning(warningMessage)
    if (this.output.trim() !== '') {
      console.log(color.dim(this.output))
    }
    console.log(
      color.magenta(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${warningMessage}`
      )
    )
  }
}
