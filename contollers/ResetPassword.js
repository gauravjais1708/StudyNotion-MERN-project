const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');




exports.resetPasswordToken = async (req, res) => {

   try{
        const email = req.body.email;
        const user= await User.findOne({email:email});
        if(!user){
            return res.json({
            success:false,
            message:"User with this email does not exist"
            });
        }
    
        const crypto = require('crypto');
        const token = crypto.randomUUID();
        const UpdateDetails = await User.findOneAndUpdate(
            {email:email},
           {
                token:token,
                resetPasswordExpires: Date.now() + 3600000, // 1 hour
           },
              {new:true});
        const resetUrl = `http://localhost:3000/update-password/${token}`; 
        await mailSender(
            email,
            "Password Reset Request",
            `You requested for a password reset. Click the link to reset your password: ${resetUrl}. This link will expire in 1 hour.`
        );
        res.status(200).json({
            success:true,
            message:"Password reset link has been sent to your email"
        });
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        }); 
    }
   }

//reset password
exports.resetPassword = async (req, res) => {
    try{
        const {token,confirmPassword,password} = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm password do not match",
        });
    }
    const userDetails = await User.findOne({token:token,}) // Check if token is not expired
    if(!userDetails){
        return res.status(400).json({
            success:false,
            message:"Invalid or expired token",
        });
    }
    if(userDetails.resetPasswordExpires > Date.now()){
        return res.status(400).json({
            success:false,
            message:"Token has expired",
        });
    }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate(    
        {token:token},
        {
            password:hashedPassword
        },
        {new:true},
    );
    res.status(200).json({
        success:true,
        message:"Password has been reset successfully",
    }); 
    
}
catch(err){
    console.log(err);
    res.status(500).json({
        success: false,
        message: 'something went wrong while resetting the password',
    });
}
}
