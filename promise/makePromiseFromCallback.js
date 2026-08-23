const fs = {
  readFile (path, cb) {
    let text = 'a'
    setTimeout(() => {
      text = 'text'
      cb('text')
      console.log('setTimeout');
    }, 2000)
  }
}

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (fileContent) => {
      resolve(fileContent)
    })
  })
}

readFilePromise().then((res) => {
  console.log('res = ', res);
})

