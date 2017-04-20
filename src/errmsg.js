
module.exports = {
  argInst(name, expected) { return `Argument ${name} not an instance of ${expected}!` },
  argType(name, expected, arg) { return `Argument ${name} not of type ${expected}! (${Array.isArray(arg) ? 'array' : typeof arg})` },
}
