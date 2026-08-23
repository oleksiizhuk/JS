const obj = {};

const person = [
  ['name', 'oleksii'],
  ['age', '28'],
  ['job', 'oleksii'],
]
const map = new Map(person);
map.set('phone', 99075);

console.log('map', map);

map.forEach((val) => {
  console.log('val', val);
})

const array = [...map];
console.log('array', array);
