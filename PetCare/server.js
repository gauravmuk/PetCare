var express 		= require("express");
var path 			= require("path");
var mongoose 		= require("mongoose");
var autoIncrement 	= require("mongoose-auto-increment");
var bodyParser 		= require("body-parser");
var cookieParser 	= require("cookie-parser");
var multer 			= require("multer");
var passport 		= require("passport");
var LocalStrategy 	= require("passport-local");
var session   		= require("express-session");
var app				= express();
/* Application Setup */ 

// For parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
autoIncrement.initialize(connection);

// Import Database schema
var Application 	= require(__dirname + '/public/models/Application');
var Message 		= require(__dirname + '/public/models/Message');
var Pet 			= require(__dirname + '/public/models/Pet');
var Pet_Posting 	= require(__dirname + '/public/models/Pet_Posting');
var Sitter_Posting	= require(__dirname + '/public/models/Sitter_Posting');
var Report			= require(__dirname + '/public/models/Report');
var Review			= require(__dirname + '/public/models/Review');
var Pet_Review		= require(__dirname + '/public/models/Pet_Review');
var User			= require(__dirname + '/public/models/User');

// Authentication
app.use(session({ secret: 'Session Key' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Insert test data
/**********************************************************************/
var user1 = new User({
	name: 'John Doe',
	email: 'john@gmail.com',
	rating: 0,
	banned: false
});

user1.save();

var user2 = new User({
	name: 'Leonardo DiCaprio',
	email: 'leo@gmail.com',
	rating: 0,
	banned: false
});

user2.save();

var user3 = new User({
	name: 'Taewoo Kim',
	email: 'rlaxodn@gmail.com',
	rating: 0,
	banned: true
});

user3.save();

var msg1 = new Message({
	to: 1,
	from: 2,
	message: 'Where are you?',
	read: false,
});

msg1.save();

var msg2 = new Message({
	to: 2,
	from: 1,
	message: 'somewhere ...',
	read: true,
});

msg2.save();

var msg3 = new Message({
	to: 1,
	from: 3,
	message: 'yo',
	read: true,
});

msg3.save();

var msg4 = new Message({
	to: 3,
	from: 1,
	message: 'blablabla',
	read: true,
});

msg4.save();

var msg5 = new Message({
	to: 3,
	from: 2,
	message: '...',
	read: true,
});

msg5.save();

var app1 = new Application({
	to: 1,
	from: 2,
	isPetPost: true,
	pet_posting: 1,
	message: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et,',
});
app1.save();

var app2 = new Application({
	to: 1,
	from: 3,
	isPetPost: false,
	sitter_posting: 1,
	message: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et,',
});
app2.save();

var app3 = new Application({
	to: 2,
	from: 1,
	isPetPost: true,
	pet_posting: 1,
	message: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et,',
});
app3.save();

var pet1 = new Pet({
	name: 'Kitty',
	user: 1,
	type: 'Cat',
	breed: 'Persian',
	gender: 'Male',
	age: 2,
	description: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et, ex meis principes neglegentur eos. Vel tractatos repudiare expetendis in. Aeque inermis eu nec. His libris noster tacimates ne, enim stet vis ex. Ei mel populo causae liberavisse, ei eos iisque erroribus.',
	rating: 2
});

pet1.save();

var petPosting1 = new Pet_Posting({
    user: 1,
    pet: 1,
	title: 'Looking for a kind pet sitter.',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '$110 per day',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: '/images/cat1.jpg',
	status: 'open'
});

petPosting1.save();

var sitterPosting1 = new Sitter_Posting({
    user: 1,
	title: 'Cat/Dog Sitter Near Toronto',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '20 - 25 per Day',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 2,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});

sitterPosting1.save();

var report1 = new Report({
    to: 1,
    from: 2,
	message: "I would like to report user 1.",
    resolve: false
});

report1.save();

/**********************************************************************/

// Returns true if the value is an integer
// TODO: Add mocha tests
function isNumber(value) {
    return /^\d+$/.test(value);
};

/**********************************************************************/

/* Application Routes */
app.get("/layouts/home.html",function(req,res){
    res.render("layouts/home.html");
});

app.get("/users/show.html", function(req, res) {
	res.render("users/show.html");
});

app.get("/users/applications.html", function(req, res) {
	res.render("users/applications.html")
});

app.get("/users/messages.html", function(req, res) {
	res.render("users/messages.html")
});

app.get("/signin.html", function(req, res) {
	res.render("signin.html")
});

app.get("/signup.html", function(req, res) {
	res.render("signup.html")
});

app.get("/pet_posts/index.html", function(req, res){
	res.render("pet_posts/index.html");
});

app.get("/pet_posts/new.html", function(req, res){
	res.render("pet_posts/new.html");
});

app.get("/pet_posts/show.html", function(req, res){
	res.render("pet_posts/show.html");
});

app.get("/petsitter_posts/index.html", function(req, res){
	res.render("petsitter_posts/index.html");
});

app.get("/petsitter_posts/show.html", function(req, res){
	res.render("petsitter_posts/show.html");
});

app.get("/petsitter_posts/new.html", function(req, res){
	res.render("petsitter_posts/new.html");
});

app.get("/pet/new.html", function(req, res){
	res.render("pet/new.html");
});

app.get("/admin/admin.html", function(req, res){
	res.render("admin/admin.html");
});

app.post('/api/register', function(req, res, next) {
	var username 	= req.body.username;
	var password 	= req.body.password;
	var name 		= req.body.name;

	User.register(new User({ username: username, name: name, rating: 0,	location: '',
		description: '', role: '', photo: '', banned: false }), password, function(err) {
		if (err) {
			console.log("error when registering");
			return next(err);
		}

		passport.authenticate('local')(req, res, function() {
			res.send({ id: res.req.user.id, name: res.req.user.name });
		});
	});
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
	res.send({ id: res.req.user.id, name: res.req.user.name });
});

app.get('/api/logout', function(req, res) {
	req.logout();
	console.log("logged out ok!")
	res.send('Logged out!');
});

app.get('/api/status', function(req, res) {
	if (!req.isAuthenticated()) {
		res.json(false);
	}
	else {
		res.json(true);
	}
})

/* REST API routes */
app.get("/api/users/:id", function(req, res){
	var user = [];

	if (isNumber(req.params.id)) {

		User.findById(req.params.id, function(err, user) {
			if (err) {
				throw err;
			}
			res.json(user)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Return all users
app.get("/api/users", function(req, res){
	var user = [];
	User.find({}, function(err, user) {
		if (err) {
			throw err;
		}
		res.json(user)
	});
});

// Ban a user with the given user id
app.put("/api/users/:id/ban", function(req, res){

	if (isNumber(req.params.id)) {

		// var id 	= req.body.data.id;
		var id = req.params.id;
		// console.log("updatedUser");

		// Update the 'banned' field of the user to true
		User.update({_id: id}, {$set: {banned:true}}, function(err, updatedUser){
			if (err) {
				throw err;
			}
			else{
				// On Success return info
				console.log(updatedUser);
				res.json(updatedUser);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Return the pets for a given user
app.get("/api/users/:id/pets", function(req,res){

	if (isNumber(req.params.id)) {

		var inbox = [];
		var sent = [];

		Pet.find({user: req.params.id}).populate('user').exec(function(err, pet) {
			if (err) {
				throw err;
			}
			res.json(pet);

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Update user information
app.put('/api/users/:id', function (req, res) {

	if (isNumber(req.params.id)) {

		User.findOne({_id: req.params.id}, function (err, user) {

		    user.name = req.body.data.name;
		    user.location = req.body.data.location;
		    user.description = req.body.data.description;

		    user.save(function (err) {
		        if(err) {
		        }
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

app.post("/api/reviews", function(req, res){
	// Get Review information from the request body
	var toUser 			= req.body.data.to;
	var fromUser 		= req.body.data.from;
	var reviewRating 	= req.body.data.rating;
	var reviewComment 	= req.body.data.comment;

	// Save Review information in the database 
	Review.create({
		to: toUser,
		from: fromUser,
		rating: reviewRating,
		comment: reviewComment

	}, function(err, review){
		if(err){
			console.log("Review.create(): error\n"+ err);
		}
		else{
			// Successfully added a new review to the database
			// Now calculate average rating for the 'to' user
			Review.find({to: toUser}, function(err, reviews){
				if(err){
					"Review.find(): error\n"+ err
				}
				else{
					// Successfully found all the reviews for the given user
					// Now calulate the new average rating value for the user
					var num = reviews.length;
					var sum = 0;
					for (var i=0; i<num; i++){
						sum = sum + reviews[i].rating;
					}

					var newAvgRating = Math.round(sum/num)
					console.log("Average rating for user "+ toUser + " = " + newAvgRating);
					
					// TO-DO: Update new average rating on the user schema
				}
			}); 
		}
	});

	// Send back a response or end response
	res.json({resData: "data"});
	// res.end();
});


app.get("/api/pets/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var pet = [];
		Pet.findById(req.params.id, function(err, pet) {
			if (err) {
				throw err;
			}
			res.json(pet)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

app.post("/api/pets", function(req, res){

	var newPet = new Pet({
		user: req.body.data.user,
		name: req.body.data.name,
		type: req.body.data.type,
		breed: req.body.data.breed,
		gender: req.body.data.gender,
		age: req.body.data.age,
		description: req.body.data.description,
		rating: req.body.data.rating,
		photo: req.body.data.photo,	// TODO: Get pet image
	});

	newPet.save(function(err) {
		console.log(newPet);
		res.setHeader('Location', '/users/' + newPet.user);
    	res.status(201).send(null);
	});

});

app.get("/api/petpostings/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var petposting = [];
		Pet_Posting.findById(req.params.id).populate('user').exec(function(err, petposting) {
			if (err) {
				throw err;
			}
			res.jsonp(petposting)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Return all pet postings
app.get("/api/petpostings", function(req, res){
	var petposting = [];
	Pet_Posting.find({}, function(err, petposting) {
		if (err) {
			throw err;
		}
		res.json(petposting)
	});
});


// Delete a given pet posting from the database
app.delete("/api/petpostings/:id", function(req, res){

	if (isNumber(req.params.id)) {

		// Get params from the request
		var postID = req.params.id;
		console.log("delete sitter posting " + postID);
		// remove a pet posting with a given ID from the datbase
		Pet_Posting.remove({ _id:postID }, function(err, result){
			if(err){
				throw err;
			}
			else{
				// On success, log and return response
				console.log("sitter posting deleted " + result);
				res.json(result);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

app.post("/api/petpostings", function(req, res){

	var newPost = new Pet_Posting({
		user: req.body.data.user,
		title: req.body.data.title,
		duration: req.body.data.duration,
		location: req.body.data.location,
		price: req.body.data.price,
		supplies: req.body.data.supplies,
		additional_info: req.body.data.additional_info,
		description: req.body.data.description,
		thumbnail: req.body.data.thumbnail,	// TODO: Get user image
		pet: 1,
		status: 'open'
	});

	newPost.save(function(err) {
		res.setHeader('Location', '/pet_posts/' + newPost._id);
    	res.status(201).send(null);
	});

});

app.put('/api/petpostings/:id', function (req, res) {

	if (isNumber(req.params.id)) {

		Pet_Posting.findOne({_id: req.params.id}, function (err, petposting) {

            petposting.title = req.body.data.title;
            petposting.duration = req.body.data.duration;
            petposting.location = req.body.data.location;
            petposting.price = req.body.data.price;
            petposting.description = req.body.data.description;


		    petposting.save(function (err) {
		        if(err) {
		        }
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

app.get("/api/sitterpostings/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var sitterposting = [];
		Sitter_Posting.findById(req.params.id).populate('user').exec(function(err, sitterposting) {
			if (err) {
				throw err;
			}
			res.json(sitterposting)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Delete a given sitter posting from the database
app.delete("/api/sitterpostings/:id", function(req, res){

	if (isNumber(req.params.id)) {

		// Get params from the request
		var postID = req.params.id;
		console.log("delete sitter posting " + postID);
		// remove a sitter posting with a given ID from the datbase
		Sitter_Posting.remove({ _id:postID }, function(err, result){
			if(err){
				throw err;
			}
			else{
				// On success, log and return response
				console.log("sitter posting deleted " + result);
				res.json(result);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Return all sitter postings
app.get("/api/sitterpostings", function(req, res){
	var sitterposting = [];
	Sitter_Posting.find({}, function(err, sitterposting) {
		if (err) {
			throw err;
		}
		res.json(sitterposting)
	});
});

app.post("/api/sitterpostings", function(req, res){

	var newPost = new Sitter_Posting({
		user: req.body.data.user,
		types: req.body.data.types,
		title: req.body.data.title,
		duration: req.body.data.duration,
		location: req.body.data.location,
		price: req.body.data.price,
		experience: req.body.data.price,
		supplies: req.body.data.supplies,
		number_of_pets: req.body.data.number_of_pets,
		description: req.body.data.description,
		thumbnail: req.body.data.thumbnail,	// TODO: Get user image
		status: 'open'
	});

	newPost.save(function(err) {
		res.setHeader('Location', '/petsitter_posts/' + newPost._id);
		console.log(newPost._id);
    	res.status(201).send(null);
	});

});

app.put('/api/sitterpostings/:id', function (req, res) {

	if (isNumber(req.params.id)) {

		Sitter_Posting.findOne({_id: req.params.id}, function (err, sitterposting) {

            sitterposting.title = req.body.data.title;
            sitterposting.duration = req.body.data.duration;
            sitterposting.location = req.body.data.location;
            sitterposting.price = req.body.data.price;
            sitterposting.description = req.body.data.description;

		    sitterposting.save(function (err) {
		        if(err) {
		        }
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

app.get("/api/reports/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var report = [];
		Report.findById(req.params.id, function(err, report) {
			if (err) {
				throw err;
			}
			res.json(report)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

app.get("/api/reports", function(req, res){
	var report = [];
	Report.find({}).populate('to').populate('from').exec(function(err, report) {
		if (err) {
			throw err;
		}
		res.json(report)
	});
});

// Get Received and Sent applications of the given user
app.get("/api/applications/:userId", function(req,res){

	if (isNumber(req.params.userId)) {

		var received = [];
		var sent = [];

		Application.find({to: req.params.userId}).populate('from').exec(function(err, received) {
			if (err) {
				throw err;
			}
			Application.find({from: req.params.userId}).populate('to').exec(function(err, sent) {
				if (err) {
					throw err;
				}

				// create JSON object
				var data = "{" + JSON.stringify("received") + ": [";
				for (var i = 0; i < received.length; i++) {
					if (received[i]['isPetPost']) {
						var posting_id = received[i]['pet_posting'];
						var url = "/pet_posts/" + posting_id;

					} else {
						var posting_id = received[i]['sitter_posting'];
						var url = "/petsitter_posts/" + posting_id;
					}
					data += "{" + JSON.stringify("from") + ":" + JSON.stringify(received[i]['from']['name']);
					data += "," + JSON.stringify("from_id") + ":" + JSON.stringify(received[i]['from']['_id']);
					data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(received[i]['created_at']);
					data += "," + JSON.stringify("message") + ":" + JSON.stringify(received[i]['message']);
					data += "," + JSON.stringify("url") + ":" + JSON.stringify(url);
					data += "," + JSON.stringify("posting_id") + ":" + JSON.stringify(posting_id);
					data += "}";
					if (i != received.length - 1) {data += ",";}
				}
				data += "]," + JSON.stringify("sent") + ": ["
				for (var i = 0; i < sent.length; i++) {
					if (received[i]['isPetPost']) {
						var posting_id = sent[i]['pet_posting'];
						var url = "/pet_posts/" + posting_id;
					} else {
						var posting_id = sent[i]['sitter_posting'];
						var url = "/petsitter_posts/" + posting_id;
					}
					data += "{" + JSON.stringify("to") + ":" + JSON.stringify(sent[i]['to']['name']);
					data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(sent[i]['created_at']);
					data += "," + JSON.stringify("message") + ":" + JSON.stringify(sent[i]['message']);
					data += "," + JSON.stringify("url") + ":" + JSON.stringify(url);
					data += "," + JSON.stringify("posting_id") + ":" + JSON.stringify(posting_id);
					data += "}";
					if (i != sent.length - 1) {data += ",";}
				}
				data += "]}"

				console.log(JSON.parse(data));
				res.json(JSON.parse(data));
			});
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Post a new application
app.post("/api/application", function(req, res){
	var post = [];
	Pet_Posting.find({_id: req.body.posting_id}, function(err, post){
		if (err) {
			throw err;
		}
		var application = new Application({
			from: req.body.from,
			to: post[0]['user'],
			pet_posting: req.body.posting_id,
			sitter_posting: req.body.posting_id,
			message: req.body.message,
			isPetPost: req.body.isPetPost,
		});
		application.save();
	});
});

// Get inbox and Sent messages of the given user
app.get("/api/messages/:userId", function(req,res){

	if (isNumber(req.params.userId)) {

		var inbox = [];
		var sent = [];

		Message.find({to: req.params.userId}).populate('from').exec(function(err, inbox) {
			if (err) {
				throw err;
			}
			Message.find({from: req.params.userId}).populate('to').exec(function(err, sent) {
				if (err) {
					throw err;
				}

				// create JSON object
				var data = "{" + JSON.stringify("inbox") + ": [";
				for (var i = 0; i < inbox.length; i++) {
					data += "{" + JSON.stringify("from") + ":" + JSON.stringify(inbox[i]['from']['name']);
					data += "," + JSON.stringify("from_id") + ":" + JSON.stringify(inbox[i]['from']['_id']);
					data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(inbox[i]['created_at']);
					data += "," + JSON.stringify("message") + ":" + JSON.stringify(inbox[i]['message']);
					data += "," + JSON.stringify("read") + ":" + JSON.stringify(inbox[i]['read']);
					data += "," + JSON.stringify("msg_id") + ":" + JSON.stringify(inbox[i]['_id']) + "}";
					if (i != inbox.length - 1) {data += ",";}

				}
				data += "]," + JSON.stringify("sent") + ": ["
				for (var i = 0; i < sent.length; i++) {
					data += "{" + JSON.stringify("to") + ":" + JSON.stringify(sent[i]['to']['name']);
					data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(sent[i]['created_at']);
					data += "," + JSON.stringify("message") + ":" + JSON.stringify(sent[i]['message']);
					data += "," + JSON.stringify("read") + ":" + JSON.stringify(sent[i]['read']) + "}";
					if (i != sent.length - 1) {data += ",";}
				}
				data += "]}"

				console.log(JSON.parse(data));
				res.json(JSON.parse(data));
			});
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update read status of the given message
app.put("/api/read/:msg_id", function(req, res){

	if (isNumber(req.params.msg_id)) {

		var msg = [];

		Message.findByIdAndUpdate(req.params.msg_id, {$set: {read:true}}, function(err, msg){
			if (err) throw err;
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Post a new message
app.post("/api/message", function(req, res){
	var msg = new Message({
		from: req.body.from,
		to: req.body.to,
		message: req.body.message,
		read: false,
	});

	msg.save();
});

app.use("*",function(req, res) {
    res.sendFile(path.join(__dirname,"views/index.html"));
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
