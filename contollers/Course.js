const Course = require('../models/Course');
const Tag = require('../models/Tag');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const User = require('../models/User');
//create course 
exports.createCourse = async (req, res) => {
    try {
        const {courseName, coursedescription, tags ,price,whatYouWillLearn} = req.body;
        const instructorId = req.user.id;   
        //upload thumbnail to cloudinary
        const thumbnail = await uploadImageToCloudinary(
            req.files.thumbnail, "thumbnails", 300, 80
        );
        if(!courseName || !coursedescription || !tags || !price || !whatYouWillLearn){
            return res.status(400).json({
                success: false, 
                message: "All fields are required",
            });
        }
        //check for instructor
        const userid=req.user.id;
        const instructorDetails = await User.findById(userid);
        if (!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        const tagDetails = await Tag.findById(tag);
        if (!tagDetails){
            return res.status(404).json({
                success: false,
                message: `Tag with id ${tag} not found`,
            });
        }
        if(instructorDetails.accountType !== 'instructor'){
            return res.status(403).json({
                success: false,
                message: "Only instructors can create courses",
            });
        }
            const thumbNailImage = await uploadImageToCloudinary(thumbnail,process.env.CLOUDINARY_FOLDER_NAME)

        const courseDetails = await Course.create({ 
            title: courseName,
            description: coursedescription,
            tags: tags,
            instructor: instructorId,
            thumbnail: thumbnail.secure_url,
        }); 
        console.log(courseDetails); 
         return res.status(200).json({
            success: true,
            message: "Course created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Course creation failed",
        });
    }
};
//get all courses   
exports.getAllCourses = async (req, res) => {

    try {   
        const courses = await Course.find({}).populate(
            "instructor",           
            "firstName lastName email"
        ).populate(
            "tags",
            "name description"
        );
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses: courses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({  
            success: false,
            message: "Failed to fetch courses",
        });
    };
} ;