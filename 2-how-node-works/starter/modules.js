//arguments is an array in JavaScript
// this array contains all the values that are passed
 //into a function
// console.log(arguments);
// console.log(require('module').wrapper);

//module.exports 
const C = require('./test-module-1');
const calcl = new C();
// console.log(calcl.add(3, 4));
// console.log(calcl.multiply(3, 4));

//exports
// const calc2 = require('./test-module-2');
const {add, multiply, divide} = require('./test-module-2');
// console.log(add(3, 4));

//caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
