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
var helmet 				= require('helmet');
var compression 		= require('compression')
var fbConfig			= require('./server/config/fb_authenticate');
var twitterConfig		= require('./server/config/twitter_authenticate');
var database 			= require('./server/config/database');
var app					= express();

/* Application Setup */ 

// compress all requests to boots performance
app.use(compression())


// For parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Serving static files in Express
app.use(express.static(path.join(__dirname, 'public'), {maxAge:	86400000}));


// Configure View engine
app.set("views", __dirname + "/public/partials");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);


// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.xssFilter({ setOnOldIE: true }));

/* Database Setup */
// Connect to a database
var connection = mongoose.connect(database.uri, function(err) {
    if (err) {
		console.log("Error connecting to the mongo database. Please make sure you are running mongo in another terminal.");
    	console.log(err);
    	throw err;
    }
});

//Initialize autoIncrement for _id fields of models
autoIncrement.initialize(connection);


// Import Database schema
var Application 	= require('./server/models/Application');
var Message 		= require('./server/models/Message');
var Pet 			= require('./server/models/Pet');
var Pet_Posting 	= require('./server/models/Pet_Posting');
var Sitter_Posting	= require('./server/models/Sitter_Posting');
var Report			= require('./server/models/Report');
var Review			= require('./server/models/Review');
var Pet_Review		= require('./server/models/Pet_Review');
var User			= require('./server/models/User');
var ForumPost		= require('./server/models/Forum_Post');
var Authentication  = require('./server/models/Authentication');

// Import Routes
var userRoute 			= require('./server/routes/user');
var petRoute 			= require('./server/routes/pet');
var applicationRoute 	= require('./server/routes/application');
var reportRoute 		= require('./server/routes/report');
var messageRoute 		= require('./server/routes/message');
var forumPostRoute 		= require('./server/routes/forum_post');
var petPostingRoute 	= require('./server/routes/pet_posting');
var sitterPostingRoute 	= require('./server/routes/sitter_posting');
var fileRoute			= require('./server/routes/file');
var authRoute			= require('./server/routes/auth');

/* Authentication Setup */
// Session
app.use(session({ secret: 'Session Key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// LocalStrategy (using username and password)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// FacebookStrategy
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
		            		if (profile.photos[0].value) {
		            			newUser.photo = profile.photos[0].value
		            		}
		            		else {
		            			newUser.photo = '/assets/images/default-profile-pic.png'
		            		};

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

// Twitter Strategy
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

/* Application Routes */

// Render HTML Files
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
	res.render("account/signin.html")
});

app.get("/signup.html", function(req, res) {
	res.render("account/signup.html")
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

app.get("/modals/editPostingModal.html", function(req, res){
	res.render("modals/editPostingModal.html");
});

// API Routes
app.use('/auth', authRoute)
app.use('/api/upload', fileRoute)
app.use('/api/users', userRoute)
app.use('/api/pets', petRoute)
app.use('/api/reports', reportRoute)
app.use('/api/applications', applicationRoute)
app.use('/api/messages', messageRoute)
app.use('/api/forumposts', forumPostRoute)
app.use('/api/petpostings', petPostingRoute)
app.use('/api/sitterpostings', sitterPostingRoute)

app.use("*",function(req, res) {
    res.sendFile(path.join(__dirname,"/server/views/index.html"));
});

// If none of the above routes matches, display an error
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

var theport = process.env.PORT || 3000;
/* Start server */ 
app.listen(theport, function(){
	console.log("PetCare server running at http://localhost:3000/");
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

// Returns true if the value is an integer
function isNumber(value) {
    return /^\d+$/.test(value);
};

// Returns true if the value is a String
function isString(value) {
    return /^\w+$/.test(value);
};


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

// Remove a posting at end of Mocha testing
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

// Remove a forum posting at end of Mocha testing
exports.removeForumPost = function(message) {

	ForumPost.remove({ message:message }, function(err, result){
		if(err){
			throw err;
		}
		else{
		}
	});
};

// Remove a message at end of Mocha testing
exports.removeMochaMessage = function(message) {
	Message.remove({ message:message }, function(err, result){
		if(err){
			throw err;
		}
		else{
		}
	});
};

// Remove a token at end of Mocha testing
exports.removeMochaToken = function(token) {
	Authentication.remove({ token:token }, function(err, result){
		if(err){
			throw err;
		}
		else{
		}
	});
};

// export the isNumber() function for Mocha testing
exports.isInt = isNumber;