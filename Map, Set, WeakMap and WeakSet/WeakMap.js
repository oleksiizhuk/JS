const weakMap = new WeakMap();

const cacheUser = (user) => {
  !weakMap.has(user) && weakMap.set(user, Date.now());
}

const lena = { name: 'lena' };
const alex = { name: 'alex' };

cacheUser(lena)
cacheUser(alex)

console.log(weakMap.has(lena));
console.log(weakMap.has(alex));
