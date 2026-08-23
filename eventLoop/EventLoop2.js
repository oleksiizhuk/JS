const options = {
  method: 'GET',
  redirect: 'follow'
};

const sendRequestAwait = async () => {
  let start = Date.now();
  const res = await fetch('https://swapi.dev/api/people', options);
  let { results } = await res.json();
  console.log(`sendRequestAwait Done in ${Date.now() - start} ms`);
  return results;
}

const sendRequestThen = () => {
  return fetch('https://swapi.dev/api/people', options);
}


const asynk1 = async () => {
  setTimeout(() => console.log('setTimeout: 1'), 0);
  console.log('await:1', await sendRequestAwait());
  setTimeout(() => console.log('setTimeout: 2'), 0);
  console.log('SYNK STOP STACK :1');
  console.log('await:2', await sendRequestAwait());
  setTimeout(() => console.log('setTimeout 3'), 0);
  console.log('SYNK STOP STACK :2');
  console.log('await:3', await sendRequestAwait());
  setTimeout(() => console.log('setTimeout 4'), 0);
  console.log('SYNK STOP STACK :3');
  console.log('await:4', await sendRequestAwait());
  setTimeout(() => console.log('setTimeout 5'), 0);
  console.log('SYNK STOP STACK :4');
  console.log('await:5', await sendRequestAwait());
  setTimeout(() => console.log('setTimeout 6'), 0);
  console.log('SYNK STOP STACK :5');
}

const asynk2 = async () => {
  setTimeout(() => console.log('setTimeout: 1'), 0);
  setTimeout(async () => console.log('await:1', await sendRequestAwait()), 0);
  setTimeout(() => console.log('setTimeout: 2'), 0);
  console.log('SYNK STOP STACK :1');
  setTimeout(async () => console.log('await:2', await sendRequestAwait()), 0);
  setTimeout(() => console.log('setTimeout 3'), 0);
  console.log('SYNK STOP STACK :2');
  setTimeout(async () => console.log('await:3', await sendRequestAwait()), 0);
  setTimeout(() => console.log('setTimeout 4'), 0);
  console.log('SYNK STOP STACK :3');
  setTimeout(async () => console.log('await:4', await sendRequestAwait()), 0);
  setTimeout(() => console.log('setTimeout 5'), 0);
  console.log('SYNK STOP STACK :4');
  setTimeout(async () => console.log('await:5', await sendRequestAwait()), 0);
  setTimeout(() => console.log('setTimeout 6'), 0);
  console.log('SYNK STOP STACK :5');
}

const then1 = () => {
  setTimeout(() => console.log('setTimeout: 1'), 0);
  sendRequestThen().then(res => res.json()).then((data) => console.log('then: 1', data,));
  setTimeout(() => console.log('setTimeout: 2'), 0);
  sendRequestThen().then(res => res.json()).then((data) => console.log('then: 2', data,));
  setTimeout(() => console.log('setTimeout: 3'), 0);
  sendRequestThen().then(res => res.json()).then((data) => console.log('then: 3', data,));
  setTimeout(() => console.log('setTimeout: 4'), 0);
  sendRequestThen().then(res => res.json()).then((data) => console.log('then: 4', data,));
  setTimeout(() => console.log('setTimeout: 5'), 0);
  sendRequestThen().then(res => res.json()).then((data) => console.log('then: 5', data,));
  setTimeout(() => console.log('setTimeout: 6'), 0);
}

// asynk1()
// asynk2()
// then1()

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

// for (let i = 0; i < 5; i++) {
//   secondExample()
// }

