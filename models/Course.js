const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatyouwillLearn: {
        type: String,
        required: true,
    },
    courseContent: {
        type: mongoose.Schema.ObjectId,
        ref: "Section",


    },
    ratingandReviews: {
        type: mongoose.Schema.ObjectId,
        ref: "RatingAndReview",
    },
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.ObjectId,
        ref: "Tag",

    },
    studentsEnrolled: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }

});

module.exports = mongoose.model("Course", CourseSchema);     