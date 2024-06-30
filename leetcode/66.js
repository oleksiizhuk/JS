function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
};

console.log('result = ',plusOne([1,2,3]))
console.log('result = ',plusOne([2,2,3,4,5,6,7,8,9,0,9]))
