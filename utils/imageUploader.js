const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file,folder,height,quality) => {
    const options = {
        folder: folder,
        height: height,
        quality: quality,
        crop: "scale",
    };
    if(height){
        options.height = height;
    }
    if(quality){    
        options.quality = quality;
    }
    options.resource_type = "auto   ";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};