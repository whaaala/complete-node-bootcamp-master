// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.aliasTopTours = async(req, res, next) =>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

/*
// class APIFeatures{
//   //the first parameter is the: Mongoose query
//   //the second parameter is the:Query provided by the client
//   constructor(query, queryString){
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter(){
//     const queryObj = {...this.queryString};
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
//     excludedFields.forEach(el => delete queryObj[el])

//     //1B) Advance filtering
//      //convert the object to a String with JSON.stringify
//     let queryStr = JSON.stringify(queryObj);
//      // use .replace() on the variable
//      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));

//      return this; 
//   }

//   sort(){
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt');
//      }
//      return this;
//   }

//   limitFields(){
//     if(this.queryString.fields){
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//       //query = query.select('name duration price'); // 
//         //The selection of specific fields is called:
//          // PROJECTING
//      }else{
//       this.query = this.query.select('-__v');
//       // The minus (-) is used to exclude a field
//      }
//      return this;
//   }

//   paginate(){
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100; 
//     const skip = (page - 1) * limit;
    
//     this.query = this.query.skip(skip).limit(limit);
  
//     return this;
//   }
// }
*/

exports.getAllTours = async (req, res) => {
  try {
    /*
    console.log(req.query);
    //BUILD QUERY
    //1A) filtering
    // const queryObj = {...req.query};
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
    // excludedFields.forEach(el => delete queryObj[el])

    // //1B) Advance filtering
    //  //convert the object to a String with JSON.stringify
    // let queryStr = JSON.stringify(queryObj);
    //  // use .replace() on the variable
    //  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);


    // 
    // let query = Tour.find(JSON.parse(queryStr));
     
    // //2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    //  }

     //3) Field limiting 
    //  if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    //   //query = query.select('name duration price'); // 
    //     //The selection of specific fields is called:
    //      // PROJECTING
    //  }else{
    //   query = query.select('-__v');
    //   // The minus (-) is used to exclude a field
    //  }
     
    //  //4) Pagination
    //   //create a page defualt
    //    // use * 1 to turn the value of the page to a number
    //    // use: || to make use the client always get the frist page
    //      // if no page parameter is given by the client
    //  const page = req.query.page * 1 || 1;
    //  //same with limit
    //  const limit = req.query.limit * 1 || 100; 
    //  //to calculate the skip value, use page parameter - 1 
    //   // multiple by the number of limit
    //  const skip = (page - 1) * limit;

    //   // page=3&limit=10, 1-10, page1, 11-20 page2, 21-30 page 3     
    //   query = query.skip(skip).limit(limit);

    //   if(req.query.page){
    //     const numTours = await Tour.countDocuments();
    //     if(skip >= numTours) throw new Error('This page does not exist')
    //   }
    */
    //EXECUTE QUERY#
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;

    /*
    // {difficulty: 'easy', duration: { $gte: 5}}
    
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    */

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  /*
// console.log(req.params);
// // convert the string variable into a number
// // by multiplying it by 1
// const id = req.params.id * 1;

//use: find(callback function) to loop through the tour
*/

  // Array and if the element is found the find method
  // will create an array that only contains that element
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //     // Use the status to add the falure or success message
  //     status: 'success',
  //     data: {
  //         tour,
  //     },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};


exports.getTourStats = async (req, res) =>{
  try {
    const stats = await Tour.aggregate([
      {
        $match:{ratingsAverage: {$gte: 4.5}}
      },
      {
        $group:{
          _id: {$toUpper: '$difficulty'},
          numTour:{$sum: 1}, //this will count the number of items 
          //that goes through the pipeline 
          numRatings: {$sum:'$ratingsQuantity'},
          avgRating: {$avg:'$ratingsAverage'},
          avgPrice: {$avg:'$price'},
          minPrice: {$min:'$price'},
          maxPrice: {$max:'$price'},
          }
        },
        {
          $sort:{
            avgPrice: 1
          }
        },
        // {
        //   $match:{ _id: {$ne: 'EASY'}}
        // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
    
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $match:{
          startDates: {
            $gte:new Date(`${year}-01-01`), 
            $lte:new Date(`${year}-12-31`), 
          }
        }
      },
      {
        $group:{
          _id:{$month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'} 
          // this will create an array for the name field
        }
      },
      {
        $addFields: {months: '$_id'}
        //this will create a field called 'months'
        // for the: _id
      },
      {
        $project:{
          _id: 0
          //this will not display the: _id field to the client
          // value 1 will display the: _id field to the client
        }
      },
      {
        $sort:{numTourStarts: -1}
        // the value: -1 is used to sort the data in descending order
      },
      {
        $limit:12
        // this will set the limit of data to display 
        //to the client

      }
    
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
} 

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/*
exports.checkID = (req, res, next, val) =>{

    console.log(`Tour id is: ${val}`);

     //if the id does not exist,
     if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid id',
        });
    }
    next();
}
*/

/*
exports.createTour = (req, res) => {
    // use the id in the last object to create a new id
    // by adding 1 to it
    const newId = tours[tours.length - 1].id + 1;
    
    //Use: Object.assign to create a new Object by mergeing
    // two existing objects together
    const newTour = Object.assign({ id: newId }, req.body);
    
    //push the tour into the tour Array
    tours.push(newTour);
    
    //Presist (save) new tour object into the tour Array
    //by overwriting the old file in the tours-simple.json file
    // use: JSON.stringify(<Name of object>) to convert a plan normal JavaSript object
    // into a JSON object
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            //send the newly created object as the response once the file is written
            res.status(201).json({
                status: 'success',
                data: {
                    tours: newTour,
                },
            });
        }
        );
};
*/
