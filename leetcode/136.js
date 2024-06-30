setTimeout(() => { console.log(1) }, 0)
console.log(2)
Promise.resolve().then(() => { console.log(3) })
new Promise((resolve,reject) => console.log(4))

