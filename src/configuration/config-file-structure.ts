export interface ConfigFileStructure {
  actions?: { [key: string]: any }
  defaultFile?: string
  files?: string
  formatter?: string
  publications: any
  useSystemTempDirectory?: boolean
}
