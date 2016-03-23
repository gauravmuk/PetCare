var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SitterPostingSchema = new Schema({
	created_at: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	title: String,
	duration: String,
	location: String,
	price: Number,
	experience: String,
	supplies: Number,
	description: String,
	thumbnail: String,
	status: String
});

module.exports = mongoose.model("SitterPosting", SitterPostingSchema);