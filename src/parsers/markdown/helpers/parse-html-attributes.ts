const tupleRE = /([^=]+="[^"]*")/g

export default function(attributes: string): { [key: string]: string } {
  const attrMatch = attributes.match(tupleRE)
  if (!attrMatch) {
    return {}
  }
  return attrMatch.map(attr => attr.split('=', 2)).reduce(reducer, {}) || {}
}

function reducer(acc, attr) {
  const [key, value] = attr
  acc[key.trim()] = value.trim().replace(/"/g, '')
  return acc
}
