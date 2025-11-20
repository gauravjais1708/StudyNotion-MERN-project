const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    about: {
        type: String,
        trim: true,
        default: ""
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }

});

module.exports = mongoose.model("Profile", ProfileSchema);