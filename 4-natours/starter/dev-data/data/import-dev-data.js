const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({ path: './config.env' });


//Replace the password placeholder in the path
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

  //READ Json file 
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

// IMPORT DATA INTO DB
const importDataIntoDB = async () => {
    try{
        await Tour.create(tours);
        console.log('Data imported successfully');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

// DELETE DATA FROM DB
const deleteDataFromDB = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data deleted successfully');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importDataIntoDB();
}else if (process.argv[2] === '--delete'){
    deleteDataFromDB();
}


