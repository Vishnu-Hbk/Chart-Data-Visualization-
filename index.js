const serialPort  = require("serialport");
const connection = require("./connectivity.js");
const http = require("http");
const fs = require("fs");

const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});


app.set('view engine', 'ejs');

app.get('/home',function(req,res){
  var data = {};
  var q = [];
  connection.fetchfromDB(function(data){
    //res.send("<html><body><canvas id=""></canvas></body></html>")
    data.forEach(function(item,index){
      //res.render(__dirname+);
      q.push(item.data);
    });
    data = {data: q};
    console.log({data  : data});
    res.render("view",{data : data});
  });
});

app.get("/data",function(req,res){
  var data = {};
  var q = [];
  connection.fetchfromDB(function(data){
    //res.send("<html><body><canvas id=""></canvas></body></html>")
    data.forEach(function(item,index){
      //res.render(__dirname+);
      q.push(item.data);
    });
    data = {data: q};
    console.log({data:data});
    res.send({data : data});
  });
});

app.post('/newData',urlencodedParser,function(req,res){
  console.log(req.body.newData.toString("utf8"));
  connection.saveToDB({data : req.body.newData.toString("utf8")});
  res.redirect("/home");
});

app.listen(3000);

var port = new serialPort("COM3",{
  baudRate : 9600,
  parser : serialPort.parsers.readline("\n")
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
});

port.on('open',function(){
  console.log("Device is connected");
  connection.connectDB(function(err){
    if(err)
      console.log("Database Connection Successful");
      port.on('data',function(receivedData){
        console.log(receivedData.toString("utf8"));
        connection.saveToDB({data : receivedData.toString("utf8").replace(/\r?\n|\r/g,"")});
      });
  });
});
