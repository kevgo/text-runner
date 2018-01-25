// @flow

export type ConfigFileStructure = {
  // $FlowFixMe: the structure of the activityTypes block is user-defined and cannot be statically typed
  activityTypes?: { [string]: Object },
  files?: string,
  formatter?: string,
  useSystemTempDirectory?: boolean
}
