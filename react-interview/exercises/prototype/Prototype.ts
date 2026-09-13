const ARRAY = [1, 2, 3, 4, 5];

Array.prototype._map = function (func) {
  let result = [];
  for (let index = 0; index < this.length; index++) {
    result.push(func(this[index], index, this));
  }
  return result;
};

Array.prototype._filter = function (callBack) {
  let result = []
  for (let index = 0; index < this.length; index++) {
    let res = callBack(this[index], index, this)
    res ? result.push(this[index]) : '';
  }
  return result;
};

ARRAY._map((item, index) => item + index);
const result = ARRAY._filter((item) => item % 2);
console.log(result);

Number.prototype.plus = function (value) {
  return this + value
}

Number.prototype.minus = function (value) {
  return this - value
}

console.log((2).plus(2).minus(3));

console.log(ARRAY, '=', ARRAY.hasOwnProperty(0));
