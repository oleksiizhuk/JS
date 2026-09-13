const pow = (params, acc) => {
  if (acc === 10) {
    return acc;
  } else {
    return params * pow(params, acc + 1)
  }
}

console.log(pow(2, 9)); // 5120

const parseError = (parseData, errors) => {
  return parseData.reduce((newErrors, item) => {
    if (typeof item === 'object') {
      return parseError(Object.values(item), newErrors);
    }
    return [...newErrors, item] || [...newErrors];
  }, errors);
};

const object = [{
  a: { a: { a: { a: 1, b: 1 }, b: 1}, b: 1 },
  b: 1,
  number: 27,
  string: 'string',
  boolean: false,
}];

const result = parseError(object, []);
console.log(result);

