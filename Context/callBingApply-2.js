function fn (a)  {
  this.a = a;
  console.log(this);
  console.log(this.a);
  console.log('===');
}
fn('fn');
const newFn = fn.bind({ name: 'Oleksii' });
newFn('second');

function fn1 ()  {
  console.log('fn1', this);
  console.log('fn1', arguments);
}

fn1.call({ name: 'Oleksii' }, 'arg1', 'arg2')
fn1.apply({ name: 'Oleksii' }, ['arg1', 'arg2'])


class test {
  constructor(a) {this.a = a;}
  log () {console.log(this.a)}
}
const newClass = new test('class');
newClass.log();
