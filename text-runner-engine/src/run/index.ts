export * from "./activity-collector.js"
export * from "./parallel.js"
export * from "./sequential.js"
export * from "./stopwatch.js"

/** LogFn defines the signature of the "log" function available to actions */
export type LogFn = (message?: any, ...optionalParams: any[]) => void

/** signature of the method that allows actions to set a refined name for the current test step */
export type RefineNameFn = (newName: string) => void
