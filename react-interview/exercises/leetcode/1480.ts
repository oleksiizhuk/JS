function runningSum(nums) {
  return nums.reduce((acc, item, i) => i === 0 ? [...acc, item] : [...acc, item + acc[i - 1]], [])

  // const r = [nums[0]];
  // for (let i = 1; i < nums.length; i++) {
  //     r[i] = nums[i] + r[i - 1]
  // }
  // return r
}

console.log(runningSum([1, 1, 1, 1, 1]));
