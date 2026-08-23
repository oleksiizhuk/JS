
//shallow copy это когда обьект копируеться но глубина обьекта все равно на указателях
const a = {
  name: 'Alex',
  age: 27,
  phone: ['099-075-94-55', '099-999-88-77'],
  sayHello: () => console.log('123'),
  obj: {
    a: 1,
    b: { a: 1 },
  }
}
console.log('a', a)
const b = {...a};
b.age = 30;
b.name = 30;
b.obj.a = 30;
console.log('a',a)
console.log('b',b)

console.log("===================");

//deep copy
const clone = JSON.parse(JSON.stringify(a));
console.log('clone',clone)
clone.obj.a = 100;
clone.obj.b.a = 100;
console.log('clone',clone)
console.log('a',a);
