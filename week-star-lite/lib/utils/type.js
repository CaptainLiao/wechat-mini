const type = thing => {
  if (thing === null) return 'null'
  if (Array.isArray(thing)) return 'array'
  return typeof thing
}

module.exports = type
