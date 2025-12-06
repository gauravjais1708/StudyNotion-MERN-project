const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false, 
                message: "No token provided",
            });
        } 

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user= decoded;
           
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        } next();
        
    }

    
    
    catch (err) {

         return  res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

//isStudent 
 exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'student') {
            return res.status(401).json({
                success: false,
                message: "Access denied, students only",
            });
        }


        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "user role verification failed",
        });
    }
};  

//isInstructor
 exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'instructor') {
            return res.status(401).json({
                success: false,
                message: "Access denied, instructors only",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "user role verification failed",
        });
    }
};
//isadmin
    exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: "Access denied, Admins only",
            });
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false, 
            message: "user role verification failed",
        });
    }
};