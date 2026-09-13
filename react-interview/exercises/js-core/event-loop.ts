console.log(1); //

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3)); //

setTimeout(() => {
    console.log(4); //
    Promise.resolve().then(() => console.log(5)); //
}, 0);

Promise.resolve().then(() => {
    console.log(6); //
    setTimeout(() => console.log(7), 0);
});

queueMicrotask(() => console.log(8)); //

console.log(9); //

// ПРАВИЛЬНО: 1 9 3 6 8 2 4 5 7
// синхронный код → ВСЕ микротаски (3 6 8) → макротаски ПО ОДНОЙ (2, 4+его микро 5, 7)
// setTimeout(2) раньше setTimeout(4): очередь макротасок — FIFO