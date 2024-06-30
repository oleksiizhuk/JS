// "use strict";

// 1 Preventing Implicit Global Variables:
// function foo() {
//   bar = 10; // Error: bar is not defined (creates a global variable in non-strict mode)
// }
//
// console.log(foo())

// 2 Avoiding Octal Number Syntax:
// var num = 010; // In strict mode, Octal literals are not allowed
// console.log(num); // Prints 8 in non-strict mode, 10 in strict mode

// // 3 Preventing Duplicate Property Names:
// var obj = {
//   prop: 1,
//   prop: 2 // Error: Duplicate data property in object literal not allowed in strict mode
// };
//
// // 4 Disallowed Use of with Statement:
// var obj = { a: 1, b: 2 };
// with(obj) {
//   console.log(a + b); // Allowed in non-strict mode, but disallowed in strict mode
// }
//
//
// // 5 Error on Assignment to Read-Only Properties:
// var obj = {};
// Object.defineProperty(obj, 'x', { value: 42, writable: false });
// obj.x = 43; // TypeError: Cannot assign to read only property 'x' of object
//

const fs = {
  readFile (path, cb) {
    let text = 'a'
     setTimeout(() => {
       text = 'text'
       cb('text')
       console.log('setTimeout');
     }, 2000)
  }
}

// console.log(1)
// fs.readFile('', (fileContent) => {
//   console.log('fileContent ', fileContent);
// })

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (fileContent) => {
      resolve(fileContent)
    })
  })
}

readFilePromise().then((res) => {
  console.log('res = ', res);
})

