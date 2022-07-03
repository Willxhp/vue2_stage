const vm = new Vue({
  data() {
    return {
      name: 'xhp',
      age: 23,
      friends: {
        name: 'la',
        age: 30
      },
      hobbies: ['吃饭', '睡觉', {a: 1}]
    }
  },
  el: '#app',
  // template: '<div></div>'
})