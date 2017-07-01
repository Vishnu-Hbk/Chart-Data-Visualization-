const mongodb = require('mongodb');
var _db;

module.exports = {
  connectDB : function(next){
    mongodb.connect("mongodb://localhost:27017/Data",function(err,db){
      if(err){
        next(err);
      } else {
        console.log("Connection Successful");
        _db = db;
        next();
      }
    });
  },

  saveToDB : function(data){
    _db.collection("Data").insertOne(data,function(err){
      if(err){
        console.log("Error : "+err);
      } else {
        console.log("Inserted");
      }
    });
  },

  fetchfromDB : function(next){
    _db.collection("Data").find().sort({ $natural: -1}).limit(10).toArray(function(err,data){
      if(err){
        console.log("Error Fetch");
        next(err);
      } else {
        next(data);
      }
    });
  }
}
