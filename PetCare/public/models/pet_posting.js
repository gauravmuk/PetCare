var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PetPostingSchema = new Schema({
	created_at: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    },
	title: String,
	duration: String,
	location: String,
	price: Number,
	description: String,
	thumbnail: String,
	status: String
});

module.exports = mongoose.model("PetPosting", PetPostingSchema);