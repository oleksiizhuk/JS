//  const prepareSortedArrayAfterRemoving = (newArr, oldSortedArray) => {
//   const filteredArray = oldSortedArray.filter((element) => newArr.includes(element));
//
//   return [...newArr].sort((a,b) => {
//     return filteredArray.indexOf(a) - filteredArray.indexOf(b);
//   })
// }
//
//
// const ress = prepareSortedArrayAfterRemoving(['c', 'b' , 'a'], ['a', 'b', 'c', 'd'])
// const ress1 = prepareSortedArrayAfterRemoving(['c', 'b'], ['a', 'b', 'c', 'd'])
// const ress2 = prepareSortedArrayAfterRemoving(['c'], ['c', 'd'])
// const ress3 = prepareSortedArrayAfterRemoving([], ['d'])
//
// console.log('ress = ', ress )
// console.log('ress1 = ', ress1 )
// console.log('ress2 = ', ress2 )
// console.log('ress3 = ', ress3 )


 const algo = (number) => {
  const height = number * 2- 1
   let res = 1
   let minusHeight = height
   for(let i = 0; i < height - 1; i++) {
     if(i > 0 && i < number) {
       res += i * 2 + 1
     } else {
       minusHeight -= 2
       res += minusHeight
     }
   }
   return res
 }

 const test = (n) => n * (n + n -2) + 1

console.log('algo(1) = ', algo(1)) // 1
 console.log('algo(2) = ', test(2)) // 5 = 2 * 2 + 1
 console.log('algo(3) = ', test(3)) // 13 = 3 * 4 + 1
 console.log('algo(4) = ', test(4)) // 25 = 4 * 6 + 1
 console.log('algo(4) = ', test(5)) // 41 = 5 * 8 + 1
 console.log('algo(4) = ', test(6)) // 61 = 6 * 10 + 1
