const set = new Set([1,2,3,4]);
set.add(10).add(20).add(30).add(20);

console.log(set);
console.log(set.has(30));
console.log(set.size);
console.log(set.delete(1));
// console.log(set.clear());
console.log(set.values());
console.log(set.keys());
