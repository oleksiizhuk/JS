const objHuman = {
  name: 'Oleksii',
  salary: 500
}

function toRaise (sum) {
  this.salary += sum;
  console.log(`${this.name}new salary = ${this.salary}`);
}

// CALL
toRaise.call(objHuman, 300);
// APPLY
toRaise.apply(objHuman, [300]);
//BIND
const newToRaise = toRaise.bind(objHuman)
newToRaise(300);
//

function hello () {
  console.log('Hello!', this);
}

function arraa () {
  console.log('arra!', this);
}

const arrowFunction = () => {
  console.log('arrowFunction', this)
}

const person = {
  name: 'Vladilen',
  age: '25',
  sayHello: hello,
  sayHelloWindow: hello.bind(window)
}

arrowFunction()
hello()
person.sayHello()
person.sayHelloWindow()
window.hello()
window.arraa()
