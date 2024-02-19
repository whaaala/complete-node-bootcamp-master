class APIFeatures{
    //the first parameter is the: Mongoose query
    //the second parameter is the:Query provided by the client
    constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
    }
  
    filter(){
      const queryObj = {...this.queryString};
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
    
      excludedFields.forEach(el => delete queryObj[el])
  
      //1B) Advance filtering
       //convert the object to a String with JSON.stringify
      let queryStr = JSON.stringify(queryObj);
       // use .replace() on the variable
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
       return this; 
    }
  
    sort(){
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join('');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
       }
       return this;
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
        //query = query.select('name duration price'); // 
          //The selection of specific fields is called:
           // PROJECTING
       }else{
        this.query = this.query.select('-__v');
        // The minus (-) is used to exclude a field
       }
       return this;
    }
  
    paginate(){
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100; 
      const skip = (page - 1) * limit;
      
      this.query = this.query.skip(skip).limit(limit);
    
      return this;
    }
  }

  module.exports = APIFeatures;