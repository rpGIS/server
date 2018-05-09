// express is the server that forms part of the nodejs program
var express = require('express');
var path = require("path");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
	// adding functionality to allow cross-domain queries when PhoneGap is running a server
	app.use(function(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		next();
	});


//logs requests
	app.use(function (req, res, next) {
		var filename = path.basename(req.url);
		var extension = path.extname(filename);
		console.log("The file " + filename + " was requested.");
		next();
	});



	var http = require('http');
	var httpServer = http.createServer(app);
	httpServer.listen(4480);

	app.get('/',function (req,res) {
		res.send("hello world from the HTTP server");
	});


var fs = require('fs')
var configtext =""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

var configarray = configtext.split(",");
var config = {};

for (var i = 0; i < configarray.length; i++) {
	var split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
}

var pg = require('pg');
var pool = new pg.Pool(config);
//code to upload the data from the form
app.post('/uploadData',function(req,res){

console.dir(req.body);
pool.connect(function(err,client,done) {
 if(err){
 console.log("not able to get connection "+ err);
 res.status(400).send(err);
 }
 var geometrystring = "st_geomfromtext('POINT(" + req.body.longitude + " " +
req.body.latitude + ")'";
var querystring = "INSERT into quiz (Question, Answer1, Answer2, Answer3, Answer4, correct, entered, geom) values ('";
querystring = querystring + req.body.Question + "','" + req.body.Answer1 + "','" + req.body.Answer2 + "','"+ req.body.Answer3 + "','"+ req.body.Answer4 + "','" +req.body.correct+"','"+req.body.entered+"',";
querystring = querystring + geometrystring + "))";
 console.log(querystring);
 client.query( querystring,function(err,result) {
 done();
 if(err){
 console.log(err);
 res.status(400).send(err);
 }
 res.status(200).send("row inserted");
 });
 });
});
//converts our geometry into something usable
app.get('/getGeoJSON/:tablename/:geomcolumn', function (req,res) {
pool.connect(function(err,client,done) {
if(err){
console.log("not able to get connection "+ err);
res.status(400).send(err);
}
var colnames = "";

var querystring = "select string_agg(colname,',') from ( select column_name as colname ";
querystring = querystring + " FROM information_schema.columns as colname ";
querystring = querystring + " where table_name = '"+ req.params.tablename +"'";
querystring = querystring + " and column_name <>'"+req.params.geomcolumn+"') as cols ";
console.log(querystring);

client.query(querystring,function(err,result){

console.log("trying");
done();
if(err){
console.log(err);
res.status(400).send(err);
}

thecolnames = result.rows[0].string_agg;
colnames = thecolnames;
console.log("the colnames "+thecolnames);

var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ";
querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(lg." + req.params.geomcolumn+")::json As geometry, ";
querystring = querystring + "row_to_json((SELECT l FROM (SELECT "+colnames + ") As l )) As properties";
querystring = querystring + " FROM "+req.params.tablename+" As lg limit 100 ) As f ";
console.log(querystring);

client.query(querystring,function(err,result){

done();
if(err){
console.log(err);
res.status(400).send(err);
}
res.status(200).send(result.rows);
});
});
});
});

app.post('/uploadAnswer',function(req,res){

console.dir(req.body);
pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }


  var querystring = "INSERT into answer (question,entered,correct) values ('";
  querystring = querystring + req.body.question + "','" + req.body.entered+"','" + req.body.correct+"')";
  console.log(querystring);
  client.query( querystring,function(err,result) {
    done();
    if(err){
      console.log(err);
      res.status(400).send(err);
    }

    res.status(200).send("Uploaded");
    });
  });
});

  app.get('/:name1', function (req, res) {

  console.log('request '+req.params.name1);


  res.sendFile(__dirname + '/'+req.params.name1);
});


  app.get('/:name1/:name2', function (req, res) {

  console.log('request '+req.params.name1+"/"+req.params.name2);


  res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2);
});


//sets the function for uploading
	app.get('/:name1/:name2/:name3', function (req, res) {

		console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3);

		res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3);
	});

  app.get('/:name1/:name2/:name3/:name4', function (req, res) {

 console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3+"/"+req.params.name4);

  res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3+"/"+req.params.name4);
});
