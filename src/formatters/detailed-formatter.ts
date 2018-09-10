import chalk from "chalk"
import Formatter from "./formatter"
import path from "path"
import printCodeFrame from "../helpers/print-code-frame"

export default class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  error(errorMessage: string) {
    this.registerError()
    console.log(chalk.dim(this.output))
    process.stdout.write(
      chalk.red(
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
    this.registerSkip()
    if (this.output) console.log(chalk.dim(this.output))
    console.log(
      chalk.cyan(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${message}`
      )
    )
  }

  success() {
    super.success()
    if (this.output) console.log(chalk.dim(this.output))
    console.log(
      chalk.green(
        `${this.activity.file.platformified()}:${this.activity.line} -- ${
          this.title
        }`
      )
    )
  }

  warning(warningMessage: string) {
    this.registerWarning()
    if (this.output.trim() !== "") console.log(chalk.dim(this.output))
    console.log(
      chalk.magenta(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${warningMessage}`
      )
    )
  }
}
