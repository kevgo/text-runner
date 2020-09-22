import { Data, PartialData } from "./data"
import { defaults } from "./defaults"

export function backfillDefaults(partial: PartialData): Data {
  const result = defaults()
  for (const [key, value] of Object.entries(partial)) {
    if (value != null) {
      // @ts-ignore
      result[key] = value
    }
  }
  return result
}
