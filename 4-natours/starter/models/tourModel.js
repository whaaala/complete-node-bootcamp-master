const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than or equals then 40 characters'],
      minlength: [10, 'A tour name must have more than or equals then 10 characters'],
      // validate: validator.isAlpha
      // validate: [validator.isAlpha, 'Tour name must contain characters']
    },
    slug: String, 
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty:{
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum:{
         values: ['easy', 'medium', 'difficult'],
         message:'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage:{
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity:{
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount:{
      type:Number,
      validate: {
        validator:function(val){
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      //trim will remove all the white spaces in the 
      //beginning and end of the String
      required:  [true, 'A tour must have a description']
    }, 
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image']
    }, 
    images:[String],
    // this [string] is used to define an array of Strings
    createdAt:{
      type: Date, 
      // Date is an automatically created timestamp
      default: Date.now(), 
      // in mongoose the Date.now() function is converted to today's
      //date in other to make sense of the data 
      select: false
    }, 
    startDates:[Date],
     //this will be an array of dates that a user will input
    //that mongoose will then parse as a Dates 
    secretTour: {
      type:Boolean,
      default:false
    },
   
  },
  {
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
  });

  tourSchema.virtual('durationWorks').get(function() {
    return this.duration / 7 
  });

  //DOCUMENTE MIDDLEWARE: runs before the .save() and .creste()
  //but NOT on .insertMany() commands
  tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
  });

  // tourSchema.post('save', function(doc, next) {
  //   console.log(doc);
  //   next();
  // })

  //QUERY MIDDLEWARE
  tourSchema.pre(/^find/, function(next) {
    //get tours where the secret tour is not equal to true
    this.find({ secretTour: {$ne: true}});
    
    //set property to store the date in milliseconds 
    this.start = Date.now();
    next();
  });

  tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    console.log(docs);
    next();
  });

  //AGGREGATION MIDDLEWARE
  tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    console.log(this.pipeline());
    next();
  })

  
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;