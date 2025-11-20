const mongoose = require("mongoose");
const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
    },

});

module.exports = mongoose.model("Tag", TagSchema);