const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////
//Files

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt','utf-8', (err, data1) =>{
//     if(err) return console.log('ERROR ! 💥');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2) =>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8', (err, data3) =>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('Your file as been written 😊😊');
//             })
//         });
//     });
// });
// console.log("will read file");

///////////////////////////////////////////
//Server

//Read all the files for the templates once
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//create an array of all the slugs
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

//log the slugs
// console.log(slugs);

const server = http.createServer((req, res) => {
  // console.log(req.url);

  //second parameter: true, needs to be passed into the
  //the parse function in other to parse the query
  // into an object
  //use ES6 De-structuring to create two variables
  // from: url.parse(req.url, true)
  const { query, pathname } = url.parse(req.url, true);

  // console.log(url.parse(req.url, true));

  // const pathName = req.url;

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    //Set the content-type to: text/html
    res.writeHead(200, { 'Content-type': 'text/html' });

    //use: dataObj variable that contains the data for each object
    // the way to do this is to loop through dataObj Array with a map() function
    // and replace all the placeholder in the template with the required data
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    //then replace the Placeholder in the tempOverview with the cardHtml variable
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    //then load the template overview page by reading the html file
    res.end(output);

    // res.end('This is from OVERVIEW');

    //Product page
  } else if (pathname === '/product') {
    //figure out which product to be displayed
    // by creating a variable and equating it
    // to: dataObj variable, and passing the id with the: query varaible
    // in other to retreive the object based on the id
    const product = dataObj[query.id];

    //Set the content-type to: text/html
    res.writeHead(200, { 'Content-type': 'text/html' });

    //then create a variable for the output
    // and equate it to replaceTemplate(tempProduct, product)
    const output = replaceTemplate(tempProduct, product);

    //then send the: output variable as a result to the browser to render
    res.end(output);

    // console.log(query);
    // res.end('This is from PRODUCT!');

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listing to requests on port 8000');
});
