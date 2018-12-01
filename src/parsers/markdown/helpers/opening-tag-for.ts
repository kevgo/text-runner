export default function(closingTagType: string): string {
  const parts = closingTagType.split('_')
  return [parts[0], 'open'].join('_')
}
