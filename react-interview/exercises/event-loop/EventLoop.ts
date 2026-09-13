const firstExample = () => {
  console.log(1);
  setTimeout(() => (console.log(2)), 0);
  console.log(3);
  Promise.resolve().then(() => {
    console.log(4)
  });
  console.log(5);

}

setTimeout(firstExample, 0)


const secondExample = () => {
  let i = 0;
  let start = Date.now();
  function count() {
    for (let k = 0; k < 1e9; k++) {
      i++
    }
    console.log(`Done in ${Date.now() - start} ms`);
  }
  count();
};

secondExample()

