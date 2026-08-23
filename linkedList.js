// method
// 1) size
// 2) clear
// 3) getLast
// 4) getFirst

class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  addToTheEnd(value) {
    let node = new Node(value);
    if (this.length === 0) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = new Node(value);
    }
    this.length++;
  }

  insertInPosition(position, value) {
    if (position < 0 || position > this.length) {
      return 'Incorrect value of position';
    }
    let node = new Node(value);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;
      let prev = null;
      let index = 0;
      while (index < position) {
        prev = current;
        current = current.next;
        index++;
      }
      prev.next = node;
      node.next = current;
    }

    this.length++;
  }

  getNodeByPosition(position) {
    if (position < 0 || position > this.length) {
      return 'Incorrect value of position';
    }

    let current = this.head;
    let index = 0;

    while (index < position) {
      current = current.next;
      index++;
    }

    return current.value;
  }

  removeFromPosition(position) {
    if (position < 0 || position > this.length) {
      return 'Incorrect value of position';
    }

    let current = this.head;

    if (position === 0) {
      this.head = current.next;
    } else {
      let prev = null;
      let index = 0;

      while (index < position) {
        prev = current;
        current = current.next;
        index++;
      }

      prev.next = current.next;
    }

    this.length--;
    return current.value;
  }

  getIndexOf(value) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  removeElementByValue(value) {
    return this.removeFromPosition(this.getIndexOf(value));
  }

  isEmpty() {
    return this.length === 0;
  }

  getLength() {
    return this.length;
  }

  print() {
    let current = this.head;
    while (current) {
      console.log('1',current);
      current = current.next;
    }
  }

}

const list = new LinkedList();
list.addToTheEnd(1);
list.addToTheEnd(2);
list.addToTheEnd(3);
list.addToTheEnd(4);
// console.log('getLength-  ', list.getLength());
// console.log('isEmpty - ', list.isEmpty());
list.print()

console.log('getNodeByPosition- ', list.getNodeByPosition(2));

