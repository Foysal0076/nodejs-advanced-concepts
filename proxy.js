class Greetings {
  english() {
    return 'Hello'
  }
}

class MoreGreetings {
  french() {
    return 'Ola'
  }
  german() {
    return 'Bonjour'
  }
}

const greetings = new Greetings()
const moreGreetings = new MoreGreetings()

const handler = {
  get: function (target, property,) {
    return target[property] || greetings[property]
  }
}
const allGreetings = new Proxy(moreGreetings, handler)

console.log(allGreetings.english())