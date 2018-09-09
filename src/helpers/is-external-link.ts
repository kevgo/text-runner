import url from 'url'

export default function isExternalLink(target: string): boolean {
  return target.startsWith('//') || !!url.parse(target).protocol
}
