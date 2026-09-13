function lengthOfLastWord(s) {
  const newARR = s.split(' ')
  const ress = newARR.filter((item) => item !== '')
  return ress[ress.length - 1].length
}

console.log('result = ', lengthOfLastWord("   fly me   to   the moon  "));
