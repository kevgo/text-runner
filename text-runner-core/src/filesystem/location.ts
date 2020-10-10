import * as files from "."

/** represents a location inside the document base, i.e. a line inside a file */
export class Location {
  file: files.FullFile
  line: number
  sourceDir: files.SourceDir

  constructor(sourceDir: files.SourceDir, file: files.FullFile, line: number) {
    this.sourceDir = sourceDir
    this.file = file
    this.line = line
  }

  static scaffold(): Location {
    return new Location(new files.SourceDir(""), new files.FullFile(""), 0)
  }

  absoluteFile(): files.AbsoluteFile {
    return this.sourceDir.joinFullFile(this.file)
  }

  withLine(line: number): Location {
    return new Location(this.sourceDir, this.file, line)
  }
}
