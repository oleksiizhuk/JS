const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'foo'),
);
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) =>
  results.forEach((result) => console.log(result.status)),
  // fulfilled
  // rejected
);



async function fetchData() {
  const urls = [
    'https://swapi.dev/api/people/1',
    'https://swapi.dev/api/people/2',
    'https://swapi.dev/api/people/asdf',
  ];

  const promises = urls.map(url => fetch(url).then(response => response.json()));

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Data from API ${index + 1}:`, result.value);
    } else {
      console.error(`Error fetching data from API ${index + 1}:`, result.reason);
    }
  });

}

fetchData()
