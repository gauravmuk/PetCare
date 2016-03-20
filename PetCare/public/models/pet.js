var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
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

PetSchema.plugin(autoIncrement.plugin, {
	model: 		'Pet',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("Pet", PetSchema);