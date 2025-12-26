const Section = require("../models/Section");
const Course = require("../models/Course");
//create section
exports.createSection = async (req, res) => {   
    try {
        const { courseId, sectionName,} = req.body;
        if(!courseId || !sectionName ){
            return res.status(400).json({
                success: false,
                message: "Course ID and section name are required fields",
            })
        }
        const newSection = await Section.create({sectionName});
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { sections: newSection._id },    
            },
            { new: true }
        );
        console.log(updatedCourseDetails);
         return res.status(200).json({  
            success: true,
            message: "Section created and added to course successfully",
        });
    }   
        catch (err) {   
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to create section",
        });
    }
};
//update section
exports.updateSection = async (req, res) => {
    try {
        const { sectionId, sectionName } = req.body;
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: "Section ID and new section name are required",
            });
        }
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName: sectionName },
            { new: true }
        );
        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section: updatedSection,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to update section",
        });
    }
};
//delete section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.params;
        if (!sectionId) {
            return res.status(400).json({   
                success: false,
                message: "Section ID  required",
            });
        }
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { sections: sectionId } },
            { new: true }
        );
        console.log(updatedCourse);
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to delete section",
        });
    }
};