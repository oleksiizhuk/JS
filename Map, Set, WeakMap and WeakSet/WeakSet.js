const users = [
  {name: 'oleksii'},
  {name: 'lena'},
  {name: 'ana'},
]

const people = new WeakSet(users);

console.log(people.has(users[0]))
console.log(people.has(users[1]))
console.log(people.has(users[2]))
