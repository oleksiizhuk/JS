const obj1 = {
  a: 1,
  "list": [
    {
      "dt": 1487246400,
      "main": {
        "temp": 286.67,
        "temp_min": 281.556,
        "temp_max": 286.67,
        "pressure": 972.73,
        "sea_level": 1046.46,
        "grnd_level": 972.73,
        "humidity": 75,
        "temp_kf": 5.11
      }
    }
  ],
  hello: function () {
    console.log(this.list);
  }
};
const obj3 = { name: { user: "user" }, age: { user: "user1" }, null: { null: { null: null } }, time: 22 };
const obj4 = { name: { user: "user" }, null: { null: { null: null } }, age: { user: "user1" }, time: 22 };
const obj5 = { name: 'Aleks', age: 25 };
const obj6 = { name: 'Aleks', age: "25" };
const obj7 = {
  user: { user: 123 }, func: function () {
  }, date: new Date()
};
const arr1 = [1, [1, 2]];
const str1 = "Hello";
const int1 = 100;

function makeCopy() {
  var objCopy;

  function copy(a) {

    if (typeof a !== "object") {
      return a;
    }
    if (typeof a === 'object') {
      const res = new a.constructor();
      for (let key in a) {
        res[key] = copy(a[key]);
      }
      return res;
    }
    if (Array.isArray(a)) {
      const res = new a.constructor(val.length);
      for (let i = 0; i < a.length; i++) {
        res[i] = copy(a[i]);
      }
      return res;
    }
    for (let key in a) {
      objCopy[key] = copy(a[key]);
    }
    return objCopy;
  }

  return copy;
}


function copys(val) {
  if (typeof val !== "object") {
    return val;
  }
  if (typeof val === 'object') {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = copys(val[key]);
    }
    return res;
  }
  if (Array.isArray(val)) {
    const result = new val.constructor(val.length);
    for (let index = 0; index < val.length; index++) {
      result[index] = copys(val[index]);
    }
    return result;
  }
  for (let key in val) {
    objCopy[key] = copys(val[key]);
  }
  return objCopy;
}


// let counter = makeCopy();
// let ress = counter(obj7);
// console.log(obj7);
// console.log(ress);

let test = copys(obj1);
// console.log(test)
test.a = 2;

console.log(test);
console.log(obj1.hello());
