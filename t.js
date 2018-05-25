async function main () {
  const r = await foo()
  return r
}

async function foo () {
  return new Error('bang')
}

main()
  .then(r => console.log(111, r))
  .catch(e => console.log(222, e))
