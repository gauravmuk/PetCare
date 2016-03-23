var express = require("express");
var app		= express();
var path 	= require("path");
var mongoose= require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

/* Application Setup */ 

// Serving static files in Express
app.use(express.static(path.join(__dirname, 'public')));
// Configure View engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);


/* Database Setup */

// Connect to a database
// NOTE: Dont forget to run 'mongod' (mongoDB daemon) in a different terminal
var connection = mongoose.connect("mongodb://localhost/testDB");
autoIncrement.initialize(connection)

// Import Database schema
var Application = require(__dirname + '/public/models/Application');
var Message = require(__dirname + '/public/models/Message');
var Pet = require(__dirname + '/public/models/Pet');
var Pet_Posting = require(__dirname + '/public/models/Pet_Posting');
var Sitter_Posting = require(__dirname + '/public/models/Sitter_Posting');
var Report = require(__dirname + '/public/models/Report');
var Review = require(__dirname + '/public/models/Review');
var User = require(__dirname + '/public/models/User');

// Testing
var user1 = new User({
	name: 'John Doe',
	email: 'john@gmail.com'
});

user1.save();

var pet1 = new Pet({
	type: 'Cat',
	user: user1._id
});

pet1.save();

var dogSchema = new mongoose.Schema({
	name: String,
	age: Number
});

// Take the dogSchema, compile it in to a model and save it in a variable 
var Dog = mongoose.model("Dog", dogSchema);


/* Application Routes */

app.get("/", function(req, res){
	res.render("index.html");
});

app.get("/signup", function(req, res){
	res.render("signup.html");
});

app.get("/signin", function(req, res){
	res.render("signin.html");
});

app.get("/admin", function(req, res){
	res.render("admin.html");
});

app.get("/new_post_pet", function(req, res){
	res.render("new_post_pet.html");
});

app.get("/new_post_petsitter", function(req, res){
	res.render("new_post_petsitter.html");
});

app.get("/post_pet", function(req, res){
	res.render("post_pet.html");
});

app.get("/post_petsitter", function(req, res){
	res.render("post_petsitter.html");
});

app.get("/search_pet", function(req, res){
	res.render("search_pet.html");
});

app.get("/search_petsitter", function(req, res){
	res.render("search_petsitter.html");
});

app.get("/messages", function(req, res){
	res.render("messages.html");
});

app.get("/applications", function(req, res){
	res.render("applications.html");
});

app.get("/users/:id", function(req, res){
	var user = [];
	User.findById(req.params.id, function(err, user) {
		if (err) {
			throw err;
		}
		res.json(user)
	});
});

app.get("/user_profile", function(req, res){
	res.render("user_profile.html");
});

// Tesing 
app.get("/dogs", function(req, res){
	res.send("Who let the dogs out?");
});

// Testing Route Parameters
// Ex: 	/http://localhost:3000/dogs/1
// 		/http://localhost:3000/dogs/33
app.get("/dogs/:id", function(req, res){
	console.log(req.params);
	res.send("Dog id = "+ req.params.id);
});

// Testing Route Parameters + Database
// Ex: 	/http://localhost:3000/dogs/new/Timmy
// 		/http://localhost:3000/dogs/new/Max
app.get("/dogs/new/:name", function(req, res){
	var dogName = req.params.name;

	// Adding a new dog to the database testDB
	Dog.create({
		name: dogName,
		age: 6

	}, function(err, dog){
		if(err){
			console.log("Dog.create(): error");
		}
		else{
			console.log("Dog.create(): successful");
			console.log(dog);
		}
	});

	res.send("Creating new dog");
});

// Testing Route Parameters + Database
// Ex: 	/http://localhost:3000/dogs/find/Timmy
// 		/http://localhost:3000/dogs/find/Buster
app.get("/dogs/find/:name", function(req, res){
	var dogName = req.params.name;

	var result = [];

	// Find dogs with a given name from the testDB
	Dog.find({name : dogName}, function(err, dogs){
		if(err){
			console.log("Dog.find(): error");
		}
		else{
			console.log("Dog.find(): successful");
			console.log(dogs);
			result = dogs;
			if (result.length != 0 )
				res.send(result[0].name+ " is "+ result[0].age + " years old");
			else
				res.send("No results found");
			}
	});

});

// If none of the above routes matches, display an error
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});


/* Start server */ 

app.listen(3000, function(){
	console.log("PetCare server listening on port 3000");
});
