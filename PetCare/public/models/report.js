var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var ReportSchema = new Schema(
    {
        to: {
            type: Number,
            ref: 'User'
        },
        from: {
            type: Number,
            ref: 'User'
        },
    	message: String,
        resolve: Boolean,
    },
    {
        timestamps: { createdAt: 'created_at',
                      updatedAt: 'updated_at' }
    }
);

ReportSchema.plugin(autoIncrement.plugin, {
    model:      'Report',
    field:      '_id',
    startAt:    1
});


module.exports = mongoose.model("Report", ReportSchema);