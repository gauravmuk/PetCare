var express 			= require("express");
var path 				= require("path");
var mongoose 			= require("mongoose");
var autoIncrement 		= require("mongoose-auto-increment");
var bodyParser 			= require("body-parser");
var cookieParser 		= require("cookie-parser");
var multer 				= require("multer");
var passport 			= require("passport");
var LocalStrategy 		= require("passport-local");
var FacebookStrategy 	= require("passport-facebook")
var TwitterStrategy 	= require("passport-twitter")
var session   			= require("express-session");
var AWS 				= require('aws-sdk');
var multiparty 			= require('multiparty');
var fs 					= require('fs');
var helmet 				= require('helmet');
var fbConfig			= require(__dirname + '/public/javascripts/fb_authenticate');
var twitterConfig		= require(__dirname + '/public/javascripts/twitter_authenticate');
var app					= express();
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
var uristring = process.env.MONGOLAB_URI || 
				process.env.MONGOHQ_URL ||
				"mongodb://localhost/testDB"

var connection = mongoose.connect(uristring, function(err) {
    if (err) {
		console.log("Error connecting to the mongo database. Please make sure you are running mongo in another terminal.");
    	console.log(err);
    	throw err;
    }
});// TO-DO: ALSO CHANGE 'testDB' in  default-data.js 
autoIncrement.initialize(connection);

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.xssFilter({ setOnOldIE: true }));

// Import Database schema
var Application 	= require(__dirname + '/' + 'public/models/Application');
var Message 		= require(__dirname + '/' + 'public/models/Message');
var Pet 			= require(__dirname + '/' + 'public/models/Pet');
var Pet_Posting 	= require(__dirname + '/' + 'public/models/Pet_Posting');
var Sitter_Posting	= require(__dirname + '/' + 'public/models/Sitter_Posting');
var Report			= require(__dirname + '/' + 'public/models/Report');
var Review			= require(__dirname + '/' + 'public/models/Review');
var Pet_Review		= require(__dirname + '/' + 'public/models/Pet_Review');
var User			= require(__dirname + '/' + 'public/models/User');
var ForumPost		= require(__dirname + '/' + 'public/models/Forum_Post');

// Authentication
app.use(session({ secret: 'Session Key' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new FacebookStrategy({
	clientID		: fbConfig.appID,
	clientSecret	: fbConfig.appSecret,
	callbackURL		: fbConfig.callbackUrl,
	profileFields: 	['id', 'displayName', 'picture.type(large)', 'email', 'location']
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'facebook_id' : profile.id }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				}
				else {
					User.findOne({ 'username': profile.emails[0].value }, function(err, user) {
						if (err) {
							return done(err);
						}
						if (user) {
							user.facebook_id = profile.id;
							user.facebook_access_token = accessToken;
							user.save(function(err) {
								if (err) {
									throw (err);
								}
								return done(null, user);
							})
						}
						else {
							var newUser = new User();
							newUser.facebook_id				= profile.id;
		           			newUser.facebook_access_token 	= accessToken;                   
		            		newUser.name  					= profile.displayName;
		            		newUser.role  					= 'regular'
		            		newUser.photo					= profile.photos[0].value
		            		if (profile.emails) {
		            			newUser.username = profile.emails[0].value;
		            			newUser.email = profile.emails[0].value;
		            		}

		            		if (profile._json.location) {
		            			newUser.location = profile._json.location.name;
		            		}

		            		newUser.save(function(err) {
		              			if (err) {
		                			throw err;
		                		}
		              			return done(null, newUser);
							})
						}
            		});
				}
			});
		});
	}
));

passport.use(new TwitterStrategy({
	consumerKey		: twitterConfig.consumerKey,
	consumerSecret	: twitterConfig.consumerSecret,
	callbackURL		: twitterConfig.callbackUrl
	},
	function(accessToken, tokenSecret, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'twitter_id' : profile.id }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.twitter_id				= profile.id;
           			newUser.twitter_access_token 	= accessToken;                   
            		newUser.name  					= profile.displayName;
            		newUser.role  					= 'regular'
            		// newUser.email = profile.emails[0].value;

            		newUser.save(function(err) {
              			if (err) {
                			throw err;
                		}
              		return done(null, newUser);
            		});
				}
			});
		});
	}
));

// Insert test data
/**********************************************************************/
var user1 = new User({
	name: 'John Doe',
	email: 'john@gmail.com',
	rating: 4,
	banned: false,
	location: "Toronto, ON"
});

user1.save();

var user2 = new User({
	name: 'Leonardo DiCaprio',
	email: 'leo@gmail.com',
	rating: 3,
	banned: false,
	location: "New York, NY"
});

user2.save();

var user3 = new User({
	name: 'Taewoo Kim',
	email: 'rlaxodn@gmail.com',
	rating: 0,
	banned: true,
	location: "Ottawa, ON"
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
	read: true,
	message: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et,',
});
app1.save();

var app2 = new Application({
	to: 1,
	from: 3,
	isPetPost: false,
	sitter_posting: 1,
	read: false,
	message: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et,',
});
app2.save();

var app3 = new Application({
	to: 2,
	from: 1,
	isPetPost: true,
	pet_posting: 1,
	read: true,
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
	rating: 2,
	photo: 'images/cat1.jpg'
});

pet1.save();

var pet2 = new Pet({
	name: 'Mango',
	user: 1,
	type: 'Cat',
	breed: 'Persian',
	gender: 'Male',
	age: 5,
	description: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et, ex meis principes neglegentur eos. Vel tractatos repudiare expetendis in. Aeque inermis eu nec. His libris noster tacimates ne, enim stet vis ex. Ei mel populo causae liberavisse, ei eos iisque erroribus.',
	rating: 3,
	photo: 'images/cat1.jpg'
});

pet2.save();

var pet3 = new Pet({
	name: 'doggy',
	user: 2,
	type: 'dog',
	breed: 'Persian',
	gender: 'Male',
	age: 5,
	description: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et, ex meis principes neglegentur eos. Vel tractatos repudiare expetendis in. Aeque inermis eu nec. His libris noster tacimates ne, enim stet vis ex. Ei mel populo causae liberavisse, ei eos iisque erroribus.',
	rating: 4,
	photo: 'images/cat1.jpg'
});

pet3.save();

var petPosting1 = new Pet_Posting({
    user: 1,
    pet: 1,
	title: 'Looking for a kind pet sitter.',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '10',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat1.jpg',
	status: 'open'
});

petPosting1.save();

var petPosting2 = new Pet_Posting({
    user: 1,
    pet: 2,
	title: 'this is posting 2',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '110',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat2.jpg',
	status: 'closed'
});

petPosting2.save();

var petPosting3 = new Pet_Posting({
    user: 1,
    pet: 3,
	title: 'this is posting 3',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '110',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat2.jpg',
	status: 'open'
});

petPosting3.save();

var petPosting4 = new Pet_Posting({
    user: 1,
    pet: 3,
	title: 'this is posting 4',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '110',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat2.jpg',
	status: 'open'
});

petPosting4.save();

var petPosting5 = new Pet_Posting({
    user: 1,
    pet: 2,
	title: 'this is posting 5',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '110',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat2.jpg',
	status: 'open'
});

petPosting5.save();

var petPosting6 = new Pet_Posting({
    user: 1,
    pet: 2,
	title: 'this is posting 5',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '110',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: 'images/cat2.jpg',
	status: 'closed'
});

petPosting6.save();

var sitterPosting1 = new Sitter_Posting({
    user: 1,
	title: 'Cat/Dog Sitter Near Toronto',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '20 - 25',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 2,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});

sitterPosting1.save();

var sitterPosting2 = new Sitter_Posting({
    user: 2,
	title: '222222222222222222',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '2.0 - 2.5',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 100,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});
sitterPosting2.save();

var sitterPosting3 = new Sitter_Posting({
    user: 2,
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '20 - 25',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 100,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'closed'
});
sitterPosting3.save();

var sitterPosting4 = new Sitter_Posting({
    user: 2,
	title: '4',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Ottawa, ON',
	price: '20321 - 20322',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 100,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});
sitterPosting4.save();

var sitterPosting5 = new Sitter_Posting({
    user: 2,
	title: '5',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '20 - 25',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 100,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});
sitterPosting5.save();

var sitterPosting6 = new Sitter_Posting({
    user: 2,
	title: '6',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Ottawa, ON',
	price: '20 - 25',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 100,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'closed'
});
sitterPosting6.save();




var report1 = new Report({
    to: 1,
    from: 2,
	message: "I would like to report user 1.",
    resolve: false
});

report1.save();

var forumPost1 = new ForumPost({
    user: 1,
	type: 'message',
	message: 'I have 2 dogs!',
	image: '',
	likes: 0
});

forumPost1.save();

var forumPost2 = new ForumPost({
    user: 2,
	type: 'image',
	message: '',
	image: 'http://bebusinessed.com/wp-content/uploads/2014/03/734899052_13956580111.jpg',
	likes: 12
});

forumPost2.save();

/**********************************************************************/

// Returns true if the value is an integer
// TODO: Add mocha tests
function isNumber(value) {
    return /^\d+$/.test(value);
};

// Returns true if the value is a String
function isString(value) {
    return /^\w+$/.test(value);
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

app.get("/forum/index.html", function(req, res){
	res.render("forum/index.html");
});

app.get("/admin/admin.html", function(req, res){
	res.render("admin/admin.html");
});

app.get("/modals/petReviewModal.html", function(req, res){
	res.render("modals/petReviewModal.html");
});

app.get("/modals/applyModal.html", function(req, res){
	res.render("modals/applyModal.html");
});

app.get("/modals/messageModal.html", function(req, res){
	res.render("modals/messageModal.html");
});

app.get("/modals/reportModal.html", function(req, res){
	res.render("modals/reportModal.html");
});

app.get("/modals/reviewModal.html", function(req, res){
	res.render("modals/reviewModal.html");
});

app.get("/modals/editPetModal.html", function(req, res){
	res.render("modals/editPetModal.html");
});

app.post('/api/register', function(req, res, next) {
	var username 	= req.body.username;
	var password 	= req.body.password;
	var name 		= req.body.name;

	User.register(new User({ username: username, email: username, name: name, location: '',
		description: '', role: 'regular', photo: '' }), password, function(err) {
		if (err) {
			res.json({ err: err });
		}
		else {
			passport.authenticate('local', { session: true })(req, res, function() {
				res.send({ id: req.user.id, name: req.user.name, role: req.user.role });
			});
		}
	});
});

app.post('/api/login', passport.authenticate('local', { session: true, failWithError: true}), 
	function(req, res, next) {
		User.findOne({_id: req.user.id}, function(err, user){
			if(err) {
				return next(err);
			}
			else {
				if (user.banned) {
					res.json({ err: 'This account has been banned'})
				} 
				else {
					res.json({ id: req.user.id, name: req.user.name, role: req.user.role });
				}
			}
		});	
	},
	function(err, req, res, next) {
		res.status(200).json({ err: err });
	}
);


app.get('/api/logout', function(req, res) {
	req.logout();
	res.end();
});

app.get('/api/status', function(req, res) {
	if (!req.isAuthenticated()) {
		res.json({ logged_in: false });
	}
	else {
		res.json({ logged_in: true, is_banned: req.user.banned, user: { id: req.user._id, name: req.user.name, role: req.user.role }});
	}
});

app.get('/auth/twitter', passport.authenticate('twitter', { session: true }));

app.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { session: true, failureRedirect: '/signin' }),
	function(req, res) {
		res.redirect('/');
	}
);

app.get('/auth/facebook', passport.authenticate('facebook', { session: true, scope: ['email', 'user_location'] }));

app.get('/auth/facebook/callback', 
	passport.authenticate('facebook', { session: true, failureRedirect: '/signin' }),
	function(req, res) {
		res.redirect('/');
	}
);

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
app.get("/api/users/:id/pets", function(req, res){
	if (isNumber(req.params.id)) {
		Pet.find({ user: req.params.id })
		.populate('user')
		.populate({ path: 'reviews', populate:{ path: 'from', model: 'User' }})
		.exec(function(err, pet) {
			if (err) {
				throw err;
			}
			res.json(pet);

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Return the closed or open posts for a given user
app.get("/api/users/:id/posts/:status", function(req, res){
	if (isNumber(req.params.id) && isString(req.params.status)) {
		var posts = [];
		Sitter_Posting.find({ user: req.params.id, status: req.params.status }).populate('user').exec(function(err, sitter_post) {
			if (err) {
				throw err;
			}
			if (sitter_post.length > 0) {
				posts = posts.concat(sitter_post);
			}

			Pet_Posting.find({ user: req.params.id, status: req.params.status })
			.populate({ path: 'pet', populate: { path: 'reviews', model: 'PetReview', populate: { path: 'from', model: 'User'} }})
			.exec(function(err, pet_post) {
				if (err) {
					throw err;
				}

				if (pet_post.length > 0) {
					posts = posts.concat(pet_post);
				}
				res.json(posts);
			});
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

app.get("/api/users/:id/reviews", function(req, res){
	if (isNumber(req.params.id)) {
		Review.find({ to: req.params.id }).populate('from').exec(function(err, reviews) {
			if (err) {
				throw err;
			}
			res.json(reviews);
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update user information
app.put('/api/users/:id', function (req, res) {

	if (isNumber(req.params.id)) {
		User.findOne({ _id: req.params.id }, function (err, user) {
		    user.name 			= req.body.data.name;
		    user.email 			= req.body.data.email;
		    user.location 		= req.body.data.location;
		    user.description 	= req.body.data.description;

		    user.save(function (err, user) {
		        if (err) {
		        	throw err;
		        }
    			res.status(200);
    			res.json(user);
		    });

		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 


// Update Sitter review table, calculate new average rating for person who made the post(User/Sitter) and update
app.post("/api/sitterpostings/:id/reviews", function(req, res){
	console.log("/api/sitterpostings/:id/reviews");

	// Get Review information from the request body
	var fromUser 		= req.body.data.from;
	var reviewRating 	= req.body.data.rating;
	var reviewComment 	= req.body.data.comment;
	var postID 			= req.params.id;

	// Get user Id who made the post
	if (isNumber(postID)){
		Sitter_Posting.findOne({_id : postID}, function(err, post){
			if(err){
				console.log("error");
			}
			// If found post successfully 
			else{
				// Get user Id who made the post from this post we found
				var toUser = post.user;

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

						// Round the average rating to int
						var newAvgRating = Math.round(sum/num)
						console.log("Average rating for user "+ toUser + " = " + newAvgRating);
						console.log("From user "+ fromUser);
					
						// Update new average rating on the user schema
						User.update({_id: toUser}, {$set: {rating:newAvgRating}}, function(err, updatedUser){
							if(err){
								console.log(err);
							}
							else{
								console.log(updatedUser);
							}
						});
					}
					}); 
				}
				});
			}
		});
	}

	// Send back a response or end response
	res.json({resData: "data"});
});

// Given a post ID, return the avg rating of the person who made the post(User/Sitter)
app.get("/api/sitterpostings/:id/rating", function(req, res){
	console.log('GET /api/sitterpostings/:id/rating');

	var postID 			= req.params.id;
	if (isNumber(postID)){
		// Query post from the database and get the ID of the user who made the post
		Sitter_Posting.findOne({_id : postID}, function(err, post){
			if(err){
				console.log("error");
			}
			else{
				// If found post successfully
				// Get the ID of the user who made the post from this post we found
				var userID = post.user;
				// Query that user and return his/her average rating
				User.findOne({_id: userID}, function(err, user){
					var avgRating = user.rating;
					// Send back a response or end response
					console.log('Avg rating of the user= ' + avgRating);
					res.json({avgRating: avgRating});
				});
			}
		});
	}
	else{
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update Pet review table, calculate new average rating for the pet on the post and update rating
app.post("/api/petpostings/:id/reviews", function(req, res){
	console.log("/api/petpostings/:id/reviews");

	// Get Review information from the request body
	var fromUser 		= req.body.data.from;
	var reviewRating 	= req.body.data.rating || 0;
	var reviewComment 	= req.body.data.comment;
	var postID 			= req.params.id;

	// Get user Id who made the post
	if (isNumber(postID)){
		Pet_Posting.findOne({ _id : postID }, function(err, post){
			if (err){
				throw err;
			}
			// If found post successfully 
			else{
				// Get user pet id which we want to make the review to
				var toPet = post.pet;
				// Save Review information in the database 
				Pet_Review.create({
				to: toPet,
				from: fromUser,
				rating: reviewRating,
				comment: reviewComment

				}, function(err, review){
				if (err){
					throw err;
				}
				else{
					// Successfully added a new review to the database
					// Now calculate average rating for the 'to' user
					Pet_Review.find({ to: toPet }, function(err, reviews){
					if(err){
						"Review.find(): error\n"+ err
					}
					else {
						// Successfully found all the reviews for the given user
						// Now calulate the new average rating value for the user
						var num = reviews.length;
						var sum = 0;
						var reviewIds = [];

						for (var i = 0; i < num; i++){
							sum = sum + reviews[i].rating;
							reviewIds.push(reviews[i]._id);
						};

						// Round the average rating to int
						var newAvgRating = Math.round(sum/num);

						// Update new average rating on the user schema
						Pet.update({ _id: toPet }, { $set: { rating: newAvgRating, reviews: reviewIds }}, function(err, updatedPet) {
							if (err){
								throw err;
							}
							else{
								console.log(updatedPet);
							}
						});
					}
					}); 
				}
				});
			}
		});
	}

	// Send back a response or end response
	res.json({resData: "data"});
});

// Given a post ID, return the avg rating of the pet reffered to by the post
app.get("/api/petpostings/:id/rating", function(req, res){
	console.log('GET /api/petpostings/:id/rating');

	var postID 			= req.params.id;
	if (isNumber(postID)){
		// Query post from the database and get the ID of pet reffered to by this post
		Pet_Posting.findOne({_id : postID}, function(err, post){
			if(err){
				console.log("error");
			}
			else{
				// If found post successfully
				// Get user Id of the pet
				var PetID = post.pet;
				// Query that pet and return it's average rating
				User.findOne({_id: PetID}, function(err, pet){
					var avgRating = pet.rating;
					// Send back a response or end response
					console.log('Avg rating of the pet = ' + avgRating);
					res.json({avgRating: avgRating});
				});
			}
		});
	}	
	else{
		res.status(400).send({ error: "Invalid ID" });
	}
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
		res.setHeader('Location', '/users/' + newPet.user);
    	res.status(201).send({ id: newPet._id, name: newPet.name, type: newPet.type, breed: newPet.breed });
	});

});

// Update pet information
app.put("/api/pets/:id", function (req, res) {

	if (isNumber(req.params.id)) {
		Pet.findOne({ _id: req.params.id }, function (err, pet) {
		    pet.name 			= req.body.data.name;
		    pet.type 	 		= req.body.data.type;
		    pet.age				= req.body.data.age;
		    pet.gender 			= req.body.data.gender;
		    pet.breed 			= req.body.data.breed;
		    pet.description 	= req.body.data.description;
		    if (req.body.data.photo) {
		    	pet.photo = req.body.data.photo;
		    }

		    pet.save(function (err, pet) {
		        if (err) {
		        	throw err;
		        }
    			res.status(200);
    			res.json(pet);
		    });
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

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
		pet: req.body.data.pet,
		status: 'open'
	});

	newPost.save(function(err, result) {
		res.setHeader('Location', '/pet_posts/' + newPost._id);
    	res.status(201).send({_id : result._id, title : result.title, duration : result.duration,
    	price : result.price});
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
    			res.status(200).send(null);
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Close a pet posting
app.put('/api/petpostings/:id/close', function (req, res) {

	if (isNumber(req.params.id)) {

		Pet_Posting.findOne({_id: req.params.id}, function (err, petposting) {

            petposting.status = 'closed';

		    petposting.save(function (err) {
		        if(err) {
		        }
				res.setHeader('Location', '/pet_posts/' + petposting._id);
    			res.status(200).send(null);
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
		experience: req.body.data.experience,
		supplies: req.body.data.supplies,
		number_of_pets: req.body.data.number_of_pets,
		description: req.body.data.description,
		thumbnail: req.body.data.thumbnail,	// TODO: Get user image
		status: 'open'
	});

	newPost.save(function(err) {
		res.setHeader('Location', '/petsitter_posts/' + newPost._id);
    	res.status(201).send({_id : newPost._id, title : newPost.title, duration : newPost.duration,
    	price : newPost.price});
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
    			res.status(200).send(null);
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Close a sitter posting
app.put('/api/sitterpostings/:id/close', function (req, res) {

	if (isNumber(req.params.id)) {

		Sitter_Posting.findOne({_id: req.params.id}, function (err, sitterposting) {

            sitterposting.status = 'closed';

		    sitterposting.save(function (err) {
		        if(err) {
		        }
				res.setHeader('Location', '/petsitter_posts/' + sitterposting._id);
    			res.status(200).send(null);
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

app.post("/api/reports/", function(req, res){
	var to 			= req.body.data.to;
	var from 		= req.body.data.from;
	var reportMsg	= req.body.data.reportMsg;

	console.log("to " + to);
	console.log("from " + from);
	console.log("reportMsg " + reportMsg);

	var newReport = new Report({
		to: to,
		from: from,
		message: reportMsg
	});

	newReport.save(function(err, report) {
		if(err){
			res.setHeader('Location', '/');
			console.log("Error Creating Report");
    		res.status(400).send({ error: "Error Creating Report" });
		}
		else{
			res.json({report: report});
		}
	});
});

// Get the number of new messages and applications
app.get("/api/news/:userId", function(req, res){
	if (req.params.userId != 'undefined' && isNumber(req.params.userId)) {
console.log(req.params.userId);
		var messages = [];
		var applications = [];

		Message.find({to: req.params.userId}, function(err, messages) {
			if (err) {
				throw err;
			}
			Application.find({to: req.params.userId}, function(err, applications) {
				if (err) {
					throw err;
				}

				var m_count = 0;
				var a_count = 0;

				for (var i = 0; i < messages.length; i++) {
					if (!messages[i]['read'])
						m_count++;
				}

				for (var i = 0; i < applications.length; i++) {
					if (!applications[i]['read'])
						a_count++;
				}

				var data = {
					messages: m_count,
					applications: a_count
				};

				console.log(data);
				res.json(data);
			});
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Search pet postings given user quieries
app.get("/api/search_pet/:pet/:location/:min_price/:userId", function(req, res){
	var petposting = [];
	var application = [];
	var users = [];
	var pets = [];

	var pet = req.params.pet;
	var location = req.params.location;
	var min_price = req.params.min_price;
	var userId = req.params.userId;

	Pet_Posting.find({}).populate('pet').exec(function(err, petposting) {
		if (err) { throw err; }
		Application.find({}, function(err, application) {
			if (err) { throw err; }
			User.find({}, function(err, users){
				if (err) { throw err; }
				Pet.find({}, function(err, pets){
					if (err) { throw err; }

					var regex_pet = new RegExp(".*" + pet + ".*", "i");
					var regex_location = new RegExp(".*" + location + ".*", "i");

					// create JSON object
					var data = [];
					for (var i = 0; i < petposting.length; i++) {
						if (petposting[i]['status'] === "closed" || petposting[i]['user'] == userId)
							continue;

						var rank = 0;

						if (pet === "none") {
							rank += 1;
						} else if (petposting[i]['pet']['type'].match(regex_pet)) {
							rank += 2;
						} else if (pet === "user_data" && userId != 'undefined') {
							for (var k = 0; k < pets.length; k++) {
								if (pets[k]['user'] == userId && pets[k]['type'] == petposting[i]['pet']['type']) {
									rank += 2;
									break;
								}
							}
						}

						if (location === "none") {
							rank += 1;
						} else if (petposting[i]['location'].match(regex_location)) {
							rank += 2;
			 			} else if (userId != 'undefined') {
			 				for (var k = 0; k < users.length; k++) {
			 					if (users[k]['_id'] == userId && users[k]['location'] == petposting[i]['location']) {
			 						rank += 2;
			 						break;
			 					}
			 				}
			 			}

						if (min_price === "none") {
							rank += 1;
						} else if (isNaN(min_price) || isNaN(petposting[i]['price'])
							|| Number(min_price) > Number(petposting[i]['price'])) {
							continue;
						} else {
							rank += 2;
						}

						var applied = false;
						for (var j = 0; j < application.length; j++) {
							if (application[j]['isPetPost'] && application[j]['pet_posting'] == petposting[i]['_id']
								&& application[j]['from'] == userId) {
								applied = true;
								break;
							}
						}

						data.push({
							rank: rank,
							posting_id: petposting[i]['_id'],
							user_id: petposting[i]['user'],
							pet_id: petposting[i]['pet']['_id'],
							title: petposting[i]['title'],
							duration: petposting[i]['duration'],
							location: petposting[i]['location'],
							price: petposting[i]['price'],
							description: petposting[i]['description'],
							thumbnail: petposting[i]['thumbnail'],
							pet_type: petposting[i]['pet']['type'],
							rating: petposting[i]['pet']['rating'],
							pet_age: petposting[i]['pet']['age'],
							applied: applied
						});
					}
					//console.log(data);
					res.json(data);
				});
			});
		});
	});
});

// Search sitter postings
app.get("/api/search_sitter/:pet/:location/:max_price/:userId", function(req, res){
	var sitterPosting = [];
	var application = [];
	var users = [];
	var pets = [];

	var pet = req.params.pet;
	var location = req.params.location;
	var max_price = req.params.max_price;
	var userId = req.params.userId;

	console.log(pet +" "+location+" "+ max_price+" " +userId);

	Sitter_Posting.find({}).populate('user').exec(function(err, sitterPosting) {
		if (err) { throw err; }
		Application.find({}, function(err, application) {
			if (err) { throw err; }
			User.find({}, function(err, users){
				if (err) { throw err; }
				Pet.find({}, function(err, pets){
					if (err) { throw err; }

					var regex_pet = new RegExp(".*" + pet + ".*", "i");
					var regex_location = new RegExp(".*" + location + ".*", "i");

					// create JSON object
					var data = [];
					for (var i = 0; i < sitterPosting.length; i++) {
						if (sitterPosting[i]['status'] === "closed" || sitterPosting[i]['user']['_id'] == userId)
							continue;

						var rank = 0;

						if (pet === "none") {
							rank += 1;
						} else if (sitterPosting[i]['types'].match(regex_pet)) {
							rank += 2;
						} else if (pet === "user_data" && userId != 'undefined') {
							for (var k = 0; k < pets.length; k++) {
								if (pets[k]['user'] == userId) {

									regex_pet = new RegExp(".*" + pets[k]['type'] + ".*", "i");
									if (sitterPosting[i]['types'].match(regex_pet)) {
										rank += 2;
										break;
									}
								}
							}
						}

						if (location === "none") {
							rank += 1;
						} else if (sitterPosting[i]['location'].match(regex_location)) {
							rank += 2;
			 			} else if (userId != 'undefined') {
			 				for (var k = 0; k < users.length; k++) {
			 					if (users[k]['_id'] == userId && users[k]['location'] == sitterPosting[i]['location']) {
			 						rank += 2;
			 						break;
			 					}
			 				}
			 			}

						var lower_price = "" + sitterPosting[i]['price'].match(/([^ ]+)/, "")[1];

						if (max_price === "none") {
							rank += 1;
						} else if (isNaN(max_price) || isNaN(lower_price)
							|| Number(max_price) < Number(lower_price)) {
							continue;
						} else {
							rank += 2;
						}

						var applied = false;
						for (var j = 0; j < application.length; j++) {
							if (!application[j]['isPetPost'] && application[j]['sitter_posting'] == sitterPosting[i]['_id']
								&& application[j]['from'] == userId) {
								applied = true;
								break;
							}
						}

						data.push({
							rank: rank,
							posting_id: sitterPosting[i]['_id'],
							user_id: sitterPosting[i]['user']['_id'],
							title: sitterPosting[i]['title'],
							types: sitterPosting[i]['types'],
							duration: sitterPosting[i]['duration'],
							location: sitterPosting[i]['location'],
							price: sitterPosting[i]['price'],
							experience: sitterPosting[i]['experience'],
							description: sitterPosting[i]['description'],
							thumbnail: sitterPosting[i]['thumbnail'],
							rating: sitterPosting[i]['user']['rating'],
							applied: applied
						});
					}

					//console.log(data);
					res.json(data);
				});
			});
		});
	});
});

// Search sitter postings
app.get("/api/sitterpostings", function(req, res){
	var sitterposting = [];
	Sitter_Posting.find({}, function(err, sitterposting) {
		if (err) {
			throw err;
		}
		res.json(sitterposting)
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
				var received_json = [];
				var sent_json = [];

				for (var i = 0; i < received.length; i++) {
					if (received[i]['isPetPost']) {
						var posting_id = received[i]['pet_posting'];
						var url = "/pet_posts/" + posting_id;

					} else {
						var posting_id = received[i]['sitter_posting'];
						var url = "/petsitter_posts/" + posting_id;
					}
					received_json.push({
						from: received[i]['from']['name'],
						from_id: received[i]['from']['_id'],
						created_at: received[i]['created_at'],
						message: received[i]['message'],
						url: url,
						posting_id: posting_id,
						read: received[i]['read'],
						app_id: received[i]['_id']
					});
				}

				for (var i = 0; i < sent.length; i++) {
					if (sent[i]['isPetPost']) {
						var posting_id = sent[i]['pet_posting'];
						var url = "/pet_posts/" + posting_id;
					} else {
						var posting_id = sent[i]['sitter_posting'];
						var url = "/petsitter_posts/" + posting_id;
					}
					sent_json.push({
						to: sent[i]['to']['name'],
						created_at: sent[i]['created_at'],
						message: sent[i]['message'],
						url: url,
						posting_id: posting_id,
						read: sent[i]['read']
					});
				}

				var data = {
					received: received_json,
					sent: sent_json
				};

				console.log(data);
				res.json(data);
			});
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Post a new application
app.post("/api/application", function(req, res){
	var post = [];
	var Posting; // either pet_posting or sitter_posting depends on posting type.

	if (req.body.isPetPost == 'true') {
		Posting = Pet_Posting;
	} else {
		Posting = Sitter_Posting;
	}

	Posting.find({_id: req.body.posting_id}, function(err, post){
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
			read: false
		});
		application.save();
	});
});

// Update read status of the given application
app.put("/api/read_application/:app_id", function(req, res){

	if (isNumber(req.params.app_id)) {

		var app = [];

		Application.findByIdAndUpdate(req.params.app_id, {$set: {read:true}}, function(err, app){
			if (err) 
				throw err;
			res.status(200).send(null);
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Get inbox and Sent messages of the given user
app.get("/api/messages/:userId", function(req,res){

	if (isNumber(req.params.userId)) {

		var inbox = [];
		var sent = [];
		Message.find({ to: req.params.userId }).populate('from').exec(function(err, inbox) {
			if (err) {
				throw err;
			}
			Message.find({ from: req.params.userId }).populate('to').exec(function(err, sent) {
				if (err) {
					throw err;
				}

				// create JSON object
				var inbox_json = [];
				var sent_json = [];

				for (var i = 0; i < inbox.length; i++) {
					inbox_json.push({
						from: inbox[i]['from']['name'],
						from_id: inbox[i]['from']['_id'],
						created_at: inbox[i]['created_at'],
						message: inbox[i]['message'],
						read: inbox[i]['read'],
						msg_id: inbox[i]['_id']
					});
				}

				for (var i = 0; i < sent.length; i++) {
					sent_json.push({
						to: sent[i]['to']['name'],
						created_at: sent[i]['created_at'],
						message: sent[i]['message'],
						read: sent[i]['read']
					});
				}

				var data = {
					inbox: inbox_json,
					sent: sent_json
				};

				console.log(data);
				res.json(data);
			});
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update read status of the given message
app.put("/api/read_msg/:msg_id", function(req, res){

	if (isNumber(req.params.msg_id)) {

		var msg = [];

		Message.findByIdAndUpdate(req.params.msg_id, {$set: {read:true}}, function(err, msg){
			if (err) throw err;
    		res.status(201).send(null);
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

// Return all forum posts
app.get("/api/forumposts", function(req, res){
	var forumpost = [];
	ForumPost.find({}).sort([['created_at', 'descending']]).populate('user').exec(function(err, forumpost) {
		if (err) {
			throw err;
		}
		res.json(forumpost)
	});

});

// Post a new forum post
app.post("/api/forumposts", function(req, res){

	var forumpost = new ForumPost({
	    user: req.body.data.user,
		type: req.body.data.type,
		message: req.body.data.message,
		image: req.body.data.image,
		likes: req.body.data.likes,
	});

	forumpost.save(function(err) {
		console.log(forumpost);
    	res.status(201).send(null);
	});


});

// Increases the 'likes' on a forum post by 1
app.put('/api/forumposts/:id/like', function (req, res) {

	if (isNumber(req.params.id)) {

		ForumPost.findOne({_id: req.params.id}, function (err, forumpost) {

		    forumpost.likes = forumpost.likes + 1;

		    forumpost.save(function(err) {
		    	res.status(200).send(null);
			});

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

/* Amazon S3 Upload */
// connect to existing bucket
var s3bucket = new AWS.S3({params: {Bucket: 'pet.care'}});

// Uploads a file to Amazon S3 and return the URL
app.post("/api/upload", function(req, res){

	var fileForm = new multiparty.Form();
	var imageToUpload;

	// Parse the file from the form
    fileForm.parse(req, function(err, fields, files) {

		imageToUpload = files.file[0];

		// Check the filetype and size is 1MB
		if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(imageToUpload.path) && imageToUpload.size < 1000000) {

			s3bucket.createBucket(function() {

				var dataLocation = '';
				var params = {Body: fs.createReadStream(imageToUpload.path), 
					Key: imageToUpload.originalFilename};

				s3bucket.upload(params, function(err, data) {
					if (err) {
						console.log("Error uploading data: ", err);
					} else {
						console.log("Successfully uploaded image.");
					}
				}).send(function(err, data) {

				    if (err) {
						console.log("Error uploading image. Please make sure you have set up your credentials file.", 
							err);
						var imageJSON = '{ "url": null }';
						res.setHeader('Location', null);
						res.status(201).json(JSON.parse(imageJSON));
				    } else {
						var imageJSON = '{ "url": "' + data.Location + '"}';
						res.setHeader('Location', data.Location);
						res.status(201).json(JSON.parse(imageJSON));
					}
				});

			});
		} else {
			var imageJSON = '{ "url": null }';
			res.setHeader('Location', null);
			res.status(201).json(JSON.parse(imageJSON));
		}

    });

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
var theport = process.env.PORT || 3000;

app.listen(theport, function(){
	console.log("PetCare server listening on port 3000");
});

/* Helper Functions */

// Return a given user's avg Rating
function getUserRating(userID){
	User.findOne({_id:userID}, function(err, user){
		if(err){
			return 0;
		}
		else{
			return user.rating;
		}
	});
}

// Return a given pet's avg Rating
function getPetRating(petID){
	Pet.findOne({_id:petID}, function(err, pet){
		if(err){
			return 0;
		}
		else{
			return pet.rating;
		}
	});
}

/* Functions for mocha testing */

var mochaTestServer;

exports.startServer = function(port) {
    mochaTestServer = app.listen(port);
};

// close destroys the server.
exports.closeServer = function() {
    mochaTestServer.close();
};

// Remove a given user at end of Mocha testing
exports.removeMochaTestUser = function(userName) {
	User.remove({ username:userName }, function(err, result){
		if(err){
			throw err;
		}
		else{
			// On success, log result
			// console.log(result);
		}
	});
};

// Remove a pet at end of Mocha testing
exports.removeMochaPet = function(petName) {
	Pet.remove({ name:petName }, function(err, result){
		if(err){
			throw err;
		}
		else{
		}
	});
};


// Remove a pet at end of Mocha testing
exports.removePosting = function(type, title) {

	var PostingType;

	if (type == 'petPosting') {
		PostingType = Pet_Posting;
	} else {
		PostingType = Sitter_Posting;
	}

	PostingType.remove({ title:title }, function(err, result){
		if(err){
			throw err;
		}
		else{
		}
	});
};