import { Configuration, PartialConfiguration } from "./configuration"
import { defaultConfiguration } from "./default-configuration"

export function backfillDefaults(partial: PartialConfiguration): Configuration {
  const result = defaultConfiguration()
  for (const [key, value] of Object.entries(partial)) {
    if (value != null) {
      // @ts-ignore
      result[key] = value
    }
  }
  return result
}
