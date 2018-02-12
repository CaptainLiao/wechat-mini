let index = 0

module.exports = () => {
  index++
  return new Date().getTime() + '_' + index
}
