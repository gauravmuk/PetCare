var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var PetReviewSchema = new Schema(
    {
        to: {
            type: Number,
            ref: 'Pet'
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

PetReviewSchema.plugin(autoIncrement.plugin, {
    model:      'PetReview',
    field:      '_id',
    startAt:    1
});

module.exports = mongoose.model("PetReview", PetReviewSchema);