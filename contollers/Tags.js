const Tag = require("../models/Tag");
//create tag
exports.createTag = async (req, res) => {
    try {
        const { name, description,  } = req.body;
        if(!name || !description ){
            return res.status(400).json({
                success: false,
                message: "Name, description, and course are required fields",
            })
        }

        const tagDetails = await Tag.create({
            name:name,
            description:description,
            
        });
        console.log(tagDetails);


       return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        });
    }
     catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to create tag",
        });
    }
};

//get all tags
exports.ShowAllTags = async (req, res) => {
    try {   
        const tags = await Tag.find({},{name:true,description:true, });
        res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            tags: tags,
        });
    }
    
    catch (err) {
        console.log(err);
        res.status(500).json({  
            success: false,
            message: "Failed to fetch tags",
        });
    };
}