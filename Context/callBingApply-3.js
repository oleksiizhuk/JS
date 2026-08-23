const obj = {
  title: 'oleksii',
  arr: [1,2,3,4],
  func: function () {
    this.arr.map((item) => {
      console.log(`${this.title}, ${item}`);
    })
  }
}

const obj1 = {
  title: 'oleksii',
  arr: [1,2,3,4],
  func: function () {
    this.arr.map(function (item) {
      console.log(`${this.title}, ${item}`);
    }.bind(this))
  }
}

const obj2 = {
  title: 'oleksii',
  arr: [1,2,3,4],
  func: function () {
    this.arr.map((item) => function (item) {
      console.log(`${this.title}, ${item}`);
    }.call(obj, item))
  }
}

obj.func();
// obj1.func();
// obj2.func();
