

// 1 1 2 3 5 8 13
const f = (n) => {

  if(n <= 2 ) {
    return 1
  }

  return f(n - 1) + f(n - 2)
}

console.log('fibonachi = ', f(7))
console.log('fibonachi = ', f(8))
