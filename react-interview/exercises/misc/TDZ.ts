// first example

// let x = 'outer scope';
// (function () {
//   console.log(x);
//   let x = 'inner scope';
// }());


let x = 'outer scope';
(function a () {
  console.log(x);
  let x = 'inner scope';
}())
{
  let a = {name: 'lex'}
  function getName () {
    return this.name
  }
  const name = getName.bind(a)
  a = {name: 'stas'}

  name() //???
}

let a = {name: 'lex'}
function getName () {
  return this.name
}
const name = getName.bind(a)
delete a.name
name() //???


