const person = new Object({
  age: 28,
  greet: function () {
    console.log('greed');
  }
});

Object.prototype.sayHello = function () {
  console.log('Hello');
}
const oleksii = Object.create(person);


// прототипный вариант
function Name (name) {
  this.name = name;
}
Name.prototype.hello = function (){
  console.log(this.name);
}
let func = new Name('Oleksii');
func.hello();


// класовый вариант
class NameTest {
  constructor(name) {
    this.name = name;
  }
  hello = () => {
    console.log(this.name)
  }
}

const newClass = new NameTest('Oleksii');
newClass.hello();

// function b = () {}
// b.prototype === Function.__proto__
// false
// b.__proto__ === Function.__proto__
// true
// b.prototype === Function.prototype
// false
