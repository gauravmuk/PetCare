var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PetSchema = new Schema({
	created_at: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	name: String,
	type: String,
	breed: String,
	age: Number,
	description: String,
	rating: Number,
	photo: String
});

module.exports = mongoose.model("Pet", PetSchema);