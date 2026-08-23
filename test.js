const getMaximumNumber = (arr) => {
  return Math.max(...arr)
}

const getMax = (arr) => {   // arr[1,3,1]
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    if (result < arr[i]) { // 0 < 1          1 < 3       3 < 1
      result = arr[i]    // result = 1   result = 3
    }
  }
  return result;
}

const makeResult = (result) => {
  console.log(result);
}

const checkUserData = (userData) => {
  return userData === 0;

}

const getUserData = () => {
  const arr = [];
  const MAX_LENGTH = 20;

  while (arr.length < MAX_LENGTH) {

    let askNum = +prompt("введи число");
    console.log('askNum', );
    if (checkUserData(askNum)) {
      break;
    } else if (askNum % 2 === 1) {
      arr.push(askNum)
    }

  }
  return arr;
}

const makeHerringbone = (arr, maxAskNum) => {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < ((maxAskNum - arr[i]) / 2); j++) {
      result += " ";
    }
    for (let k = 0; k < arr[i]; k++) {
      result += "*"
    }
    result += "\n";
  }
  return result;
}

const main = () => {
  const arr = getUserData();
  const maxAskNum = getMax(arr);
  const result = makeHerringbone(arr, maxAskNum)

  makeResult(result)
}

main();
