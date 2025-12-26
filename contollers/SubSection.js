const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
//create subsection
exports.createSubSection = async (req, res) => {
    try {
       //fetch data from request body
       const { sectionId, title, description, timeDuration } = req.body;
       const video = req.files.videoFile;
       //validation
         if (!sectionId || !title || !description || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
         }

       //upload video to cloudinary
       const uploadDetails = await uploadImageToCloudinary(
        video,process.env.FOLDER_NAME);
       //   create subsection in db
         const subSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: timeDuration,
            videoUrl: uploadDetails.secure_url,
        });
       //add subsection to section
       const updatedSectionDetails = await Section.findByIdAndUpdate(
        sectionId,
        {
            $push: { subSections: subSectionDetails._id },
        },
        { new: true }
    );
    console.log(updatedSectionDetails);
     return res.status(200).json({
        success: true,
        message: "Subsection created and added to section successfully",
    });
    }
        catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to create subsection",
        });
    }
};