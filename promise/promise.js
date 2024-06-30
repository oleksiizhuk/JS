// Функция для выполнения HTTP-запроса
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          return reject(new Error('Network response was not ok ' + response.statusText));
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

fetchData('https://api.example.com/data')
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
