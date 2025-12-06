const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');

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
    