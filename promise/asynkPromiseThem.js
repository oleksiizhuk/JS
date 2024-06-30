let thenPromise = new Promise((resolve) => (
  setTimeout(() => resolve("thenPromise!"), 1000)
));
let asyncPromise = new Promise((resolve) => {
  setTimeout(() => resolve("asyncPromise!"), 2000)
});

(async () => {
  console.log(await asyncPromise);
})()
thenPromise.then(res => console.log(res));
(async () => {
  const first = await asyncPromise;
  const second = await thenPromise;
  console.log('first', first);
  console.log('second', second);
})()



// Promise.resolve(10)
//   .then(e => console.log(e)) // 10
//   .then(e => Promise.resolve(e))
//   .then(console.log) // undefined
//   .then(e => {
//     if (!e) {
//       throw 'Error caught';
//     }
//   })
//   .catch(e => {
//     console.log(e); // ??
//     return new Error('New error');
//   })
//   .then(e => {
//     console.log(e.message); // New error
//   })
//   .catch(e => {
//     console.log(e.message); // ??
//   });
