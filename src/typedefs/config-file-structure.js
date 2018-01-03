// @flow

export type ConfigFileStructure = {
  actions?: { [string]: Object },
  files?: string,
  formatter?: string,
  useTempDirectory?: boolean
}
