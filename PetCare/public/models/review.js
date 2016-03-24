var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	created_at: Date,
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	rating: Number,
	comment: String,
});

ReviewSchema.plugin(autoIncrement.plugin, {
    model:      'Review',
    field:      '_id',
    startAt:    1
});

module.exports = mongoose.model("Review", ReviewSchema);
