const one = () => Promise.resolve('One');

async function myFunc() {
  console.log('In Function');
  const res = await one();
  console.log(res);
}

console.log('Before Function');
myFunc();
console.log('After Function');
