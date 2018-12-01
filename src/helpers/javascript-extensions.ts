import interpret from 'interpret'

// Returns all possible filename extensions that handler functions can have
export default function javascriptExtensions(): string[] {
  return Object.keys(interpret.jsVariants).map(it => it.slice(1))
}
