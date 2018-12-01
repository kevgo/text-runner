import chalk from 'chalk'
import path from 'path'
import printCodeFrame from '../helpers/print-code-frame'
import Formatter from './formatter'

export default class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

  error(errorMessage: string) {
    super.error(errorMessage)
    console.log()
    console.log(chalk.dim(this.output))
    process.stdout.write(
      chalk.red(
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
    process.stdout.write(chalk.cyan('.'))
  }

  success() {
    super.success()
    process.stdout.write(chalk.green('.'))
  }

  warning(warningMessage: string) {
    super.warning(warningMessage)
    process.stdout.write(chalk.magenta('.'))
  }
}
