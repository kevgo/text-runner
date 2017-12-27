// @flow

// Minimum returns the smallest of the given numbers
module.exports = function minimum (numbers: number[] | number): number {
  if (Array.isArray(numbers)) {
    return numbers.reduce((n, sum) => n < sum ? n : sum, 10000)
  } else {
    return numbers
  }
}
