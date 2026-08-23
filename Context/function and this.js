const person1 = {
  name: "Anna",
  age: 25,
}
function hello() {
  console.log('Hello Func = ', this)
}
const ArrowHello = () => {
  console.log('Hello Arrow = ', this)
}
const person = {
  name: 'Oleksii',
  age: 30,
  login: function (job, phone) {
    console.group(`Func ${this.name} info: `)
    console.log(`Name: ${this.name}`)
    console.log(`Age: ${this.age}`)
    console.log(`Job: ${job}`)
    console.log(`Phone: ${phone}`)
    console.log('This:', this)
    console.groupEnd()
  },
  sayHello: hello,
  sayHelloWindow: hello.bind(window),
  sayHelloArrow: ArrowHello,
  sayHelloArrowWindow: ArrowHello.bind(window),
}

person.login('QA', '+123')
person.login.bind(person1)('QA', '+123')
person.login.bind(person1, 'QA', '+123')()
person.login.call(person1, 'QA', '+123')
person.login.call(person1, 'QA', '+123')
person.login.apply(person1, ['QA', '+123'])

const anotherUser = {
  name: 'Another Name',
  arr: [1, 2, 3],
  getArr: function () {
    console.log('getArr = ', this)
    this.arr.map((function () {
      console.log('This.name =', this.name)
    }).bind(this))
  }
}
anotherUser.getArr()
