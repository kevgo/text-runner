import * as files from "."

/** represents a location inside the document base, i.e. a line inside a file */
export class Location {
  file: files.FullFilePath
  line: number
  sourceDir: files.SourceDir

  constructor(sourceDir: files.SourceDir, file: files.FullFilePath, line: number) {
    this.sourceDir = sourceDir
    this.file = file
    this.line = line
  }

  /** provides an empty location for testing */
  static scaffold(): Location {
    return new Location(new files.SourceDir(""), new files.FullFilePath(""), 0)
  }

  /** provides the absolute path to the file in this location */
  absoluteFilePath(): files.AbsoluteFilePath {
    return this.sourceDir.joinFullFile(this.file)
  }

  /** provides a copy of this Location with the given file */
  withFile(file: files.FullFilePath): Location {
    return new Location(this.sourceDir, file, this.line)
  }

  /** provides a copy of this Location with the given line */
  withLine(line: number): Location {
    return new Location(this.sourceDir, this.file, line)
  }
}
