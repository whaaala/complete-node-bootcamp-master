//This a built in node event module
const EventEmitter = require('events');
const http = require('http');

//creating a Class and inheriting from EventEmitter
// this is ES6 or ES2015 syntax
class Sales extends EventEmitter {
    constructor() {
        super();
    }
}
//create the class for the event that was just required
 // this is the name event that event Emitter will emit 
const myEmitter = new Sales();

//create the Event listener for the named event emitter
myEmitter.on('newSale', () =>{
    console.log('There was a new sale');
});

//create another Event listener for the named event emitter
myEmitter.on('newSale', () =>{
    console.log('Customer name: Baba');
});

//create another Event listener for the named event emitter 
 //that uses the parameter passed in the named event emitted
myEmitter.on('newSale', stock =>{
    console.log(`There are now ${stock} items left in the stock`);
});

//use the event emitter to emit a named event
// newSale is the named event 
myEmitter.emit('newSale', 9);

/////////////////////////////////////////////////////////////////////

const server = http.createServer();


server.on('request', (req, res) => {
    console.log('Request received');
    res.end('Request received');
});


server.on('request', (req, res) => {
    console.log('Another request 😊');
});


server.on('close', () => {
    res.end('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests........');
});
