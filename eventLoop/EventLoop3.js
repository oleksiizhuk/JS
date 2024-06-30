let i = 0;
const progress = document.getElementById('progress')

// function count() {
//   do {
//     i++;
//     i % 100 === 0 ? progress.innerHTML = i : null;
//   } while (i > 10000)
//   {
//     i % 100 === 0 && console.log(i);
//     if (i < 10000) {
//       setTimeout(count);
//     }
//   }
// }
// count()

const synk = () => {
  for(let i = 0; i < 50000; i++) {
    console.log(i);
    i % 100 === 0 ? progress.innerHTML = i : null;
  }
}

synk()

setInterval(() => console.log(123), 1000)

