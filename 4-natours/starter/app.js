const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// The expess.json() is the middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', function(req, res, next){
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
  next();
})

module.exports = app;

/*
//Read the file as a TOP level CODE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// // 2) ROUTE HANDLERS
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     // Use the status to add the falure or success message
//     status: 'success',
//     requestedAt: req.requestTime,
//     //use the result property to send the total number of the tour
//     result: tours.length,
//     //Use the Data property to add the data
//     // that will contain the object for the DATA that is read from the file
//     data: {
//       tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   console.log(req.params);

//   // convert the string variable into a number
//   // by multiplying it by 1
//   const id = req.params.id * 1;

//   //use: find(callback function) to loop through the tour
//   // Array and if the element is found the find method
//   // will create an array that only contains that element
//   const tour = tours.find((el) => el.id === id);

//   //if no tour is found, then the condition below can be used
//   // to determine that the id is invalid
//   if (!tour) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid id',
//     });
//   }

//   res.status(200).json({
//     // Use the status to add the falure or success message
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   // use the id in the last object to create a new id
//   // by adding 1 to it
//   const newId = tours[tours.length - 1].id + 1;

//   //Use: Object.assign to create a new Object by mergeing
//   // two existing objects together
//   const newTour = Object.assign({ id: newId }, req.body);

//   //push the tour into the tour Array
//   tours.push(newTour);

//   //Presist (save) new tour object into the tour Array
//   //by overwriting the old file in the tours-simple.json file
//   // use: JSON.stringify(<Name of object>) to convert a plan normal JavaSript object
//   // into a JSON object
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       //send the newly created object as the response once the file is written
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   //if the id doesnot exist,
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<update tour here....>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   //if the id does not exist,
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid id',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };


// // 3) ROUTES

// const tourRouter = express.Router();
// const userRouter = express.Router();


// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
/////////////////////////////////////////////////////////////////
*/

/*
// app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id',  updateTour)
//app.delete('/api/v1/tours/:id', deleteTour)
*/
