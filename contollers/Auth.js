const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const ProfileDetails = require('../models/ProfileDetails');
const jwt  = require('jsonwebtoken');
require('dotenv').config();
//send otp
exports.sendOTP = async (req, res) => {
   
        try{
            const { email } = req.body;
        const checkUserPresent = await User.findOne({ email});
        if (checkUserPresent) {
            return res.status(400).json({ 
                success: false,
                 message: "User already exists" });
        }
        const otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false,
             specialChars: false,
              lowerCaseAlphabets: false });

              console.log("otp generated:", otp);

              const result = await OTP.findOne({otp:otp});
              while(result){
                otp = otpGenerator.generate(6, { 
                    upperCaseAlphabets: false,
                     specialChars: false,
                      lowerCaseAlphabets: false });
              }
              result = await OTP.create({otp:otp});

              const otpPayload = {email,otp};
                //send otp to user email
                const otpBody = await OTP.create(otpPayload);
                console.log( otpBody);
              
                    res.status(200).json({
                        success: true,
                        message: "OTP sent successfully",
                    });  
        }

        catch(err){

            console.log(err);
            res.status(500).json({
                success: false,
                message: error.message,
            });
           
        }

};

//signup
exports.signUp = async (req, res) => {
    try {const {
        firsName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    }=req.body;
    if( !firsName || !lastName || !email || !password || !confirmPassword || !accountType ||  !otp){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
       
    }
     if (password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match",
            });     
   
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log("recent otp:", recentOtp);

        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"otp found ",
            });

        }else if(otp != recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:"otp is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const profileDetails= await ProfileDetails.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const usr = await User.create({
            firsName,
            lastName,
            email,  
            password:hashedPassword,
            accountType,
           additionalDetails:profileDetails._id, 
           image:`https://api.dicebear.com/6.x/initials/svg?seed=${firsName}${lastName}`,   
        });
        res.status(200).json({
            success:true,
            message:"User created successfully",
        });
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user,
        });
    
    
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message:"user can not be registered , please try again later",
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required",
            });

        }
        const user = await User.findOne({ email }).populate("additionalDetails"); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found, please sign up",
            });
        }
        //generate JWT token after password match
        if (await bcrypt.compare(password, user.password)) {
            const payload ={
                email:user.email,
                id:user._id,
               accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 2*24 * 60 * 60 * 1000), // 3 day
                httpOnly: true,
            };

            res.status(200).cookie("token", token, options).json({
                success: true,
                message: "Login successful",
                user,
            
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({  
            success: false,
            message: "Login failed, please try again later",
        });
    }
};
//logout
exports.logout = async (req, res) => {
    try {   
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Logout failed, please try again later",
        });
    }
}; 
//changepassword

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {  
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Password change failed, please try again later",
        });
    }
};