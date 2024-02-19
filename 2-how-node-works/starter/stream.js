const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    //Solution 1 
    // fs.readFile(`${__dirname}/test-file.txt`,'utf-8', (err, data) => {
    //     if (err) console.log(err);
    //     res.end(data);
    // });
    //with solution 1 node will have to load the file into memory
    //before it can then send the DATA

    //Solution 2
    // const readable = fs.createReadStream(`${__dirname}/test-file.txt`);
    // readable.on("data", chunk => {
    //     res.write(chunk);
    // });

    // //this is to end the readable stream when there is no more data to read
    // readable.on("end", () => {
    //     res.end();
    // });

    // //this is for displaying error messages if the file is not found 
    // readable.on("error", err => {
    //     console.log(err);
    //     res.statusCode = 500
    //     res.end('File not found');
    // });
    //with solution 2 there is a problem with this approach
     // the problem is that the readable stream
       // (the one that is been used to read the from the disk) 
     // is much more faster than sending the result with the
     // the response writeable stream over the network
      // which will then overwhelm the the response stream
      // this problem is called: BACK PRESURE


     //Solution 3
     const readable = fs.createReadStream(`${__dirname}/test-file.txt`);
     readable.pipe(res);
     //a readable source is needed, then a pipe is used on the readable source
     //and inside the pipe a writeable destination is placed 
      // readableSource.pipe(writeableDestination)
});

server.listen(8000, '127.0.0.1', () => {
    console.log(`Listening......`);
})