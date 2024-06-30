function dynamic (k) {
  return function (n) {
    return console.log(k * n)
  };
}
let test = dynamic(100);
test(100);

function lexical () {
  const value = 'lexicals';
  return function () { return value };
}
console.log(lexical()());

const urlGenerator = (domain) => {
  return function (url) {
    return `https://${url}.${domain}`
  }
}

const comUrl = urlGenerator('com');
const ruUrl = urlGenerator('ru');
console.log(comUrl('instagram'));
console.log(comUrl('facebook'));
console.log(ruUrl('facebook'));


function bind(context, fn) {
  // return function(...args) {
  return function() {
    // console.log('args', ...args);
    // console.log('arguments', arguments);
    // fn.apply(context, args);
    fn.apply(context);
  }
}

function logPerson() {
  console.log(`Person Name: ${this.name}, Age: ${this.age}, Job: ${this.job}`);
}
const person1 = { name: 'Oleksii', age: '28', job: 'Fronted'};
const person2 = { name: 'Oleksii', age: '300', job: 'God'};

const loggerPerson1 = bind(person1, logPerson);
const loggerPerson2 = bind(person2, logPerson);

loggerPerson1();
loggerPerson2();


class Person {
  private age
}

const person = new Person()

person.age = 2

const person = () => {
  const age = 1;
  return function () {
    return age
  }
}

person.age
