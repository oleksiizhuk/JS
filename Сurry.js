function curry1(f) {
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}
// function sum1(a, b) {
//   return a + b;
// }
// let curriedSum1 = curry1(sum1);
// console.log(curriedSum1(10)(50));
//
//
const curry = (callback) => (a) => (b) => callback(a, b);
// const sum = (a, b) => (a + b);
// console.log(curry(sum));
// let curriedSum = curry(sum);
// console.log(curriedSum(10)(50));


const curryFunc = (callBack) => {
  return (date) => {
    const resultDate = date ? date : Date.now();
    return (type) => {
      const resultType = type ? type : 'debug';
      return callBack(resultType.toUpperCase(), resultDate);
    }
  }
}
const sayLogger = (type, date) => ( `Logger type is ${type}, time is ${date}`)
const logger = curryFunc(sayLogger);
console.log(logger()('error'));
console.log(logger()('debug'));
console.log(logger(Date.now())('logging'));
console.log(logger(Date.now())('test'));
