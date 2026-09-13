
const str = 'Hello World!';
console.log(str);
let result = [];

const revers = (str) => {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}
console.log(revers(str));