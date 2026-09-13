


const factorial = (n) => {
  if(n === 0) {
    return 1;
  }
  return n * factorial(n - 1)

}

console.log('factorial = ', factorial(1))
console.log('factorial = ', factorial(5))
console.log('factorial = ', factorial(6))
