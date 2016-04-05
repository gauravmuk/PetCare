var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema(
    {
        to: {
            type: Number,
            ref: 'User'
        },
        from: {
            type: Number,
            ref: 'User'
        },
    	rating: Number,
    	comment: String,
    },
    {
        timestamps: { createdAt: 'created_at',
                      updatedAt: 'updated_at' }
    }
);

ReviewSchema.plugin(autoIncrement.plugin, {
    model:      'Review',
    field:      '_id',
    startAt:    1
});

module.exports = mongoose.model("Review", ReviewSchema);
