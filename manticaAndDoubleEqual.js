
const number = {
  num: 0,
  valueOf: function () {
    return this.num += 1;
  }
}

number.prototype.valueOf =

console.log(number);
console.log(number==1 && number==2 && number==3);

// Метод valueOf()

// В JavaScript имеется встроенный метод для преобразования объекта в примитивное
// значение: Object.prototype.valueOf().
// По умолчанию этот метод возвращает объект, для которого он был вызван.





/*
* Пишем свой valueOf()
Самое интересное при работе с valueOf() заключается в том,
* что мы можем этот метод переопределить для того, чтобы конвертировать
*  с его помощью объект в примитивное значение.
*  Другими словами, можно использовать valueOf() для возврата вместо объектов строк, чисел,
* логических значений:*/








































//
// const equality = ('a==1 && a==2 && a==3 = ', a==1 && a==2 && a==3);
// console.log(equality);
// console.log(equality);
// // console.log(b.valueOf());
