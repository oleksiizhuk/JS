const { promise, resolve, reject } = Promise.withResolvers()

setTimeout(() => {
  resolve('Resolved after 2 seconds');
}, 2000);

promise.then(message => {
  console.log(message); // "Resolved after 2 seconds"
}).catch(error => {
  console.error(error);
});
