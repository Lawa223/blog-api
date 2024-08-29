const User = require("../Model/User/User");
const appErr = require ("../Utils/appErr");
const getTokenFromHeader = require("../Utils/getTokenFromHeader");
const verifyToken = require("../Utils/verifyToken");

const isAdmin = async (req,res,next) => {
    
    //get token from the header

    const token = getTokenFromHeader(req);

    //verify token 
    const decodeUser = verifyToken(token)

    //save  the user into req obj
    req.userAuth = decodeUser.id;
    //find the user in DB
    const user = await User.findById(decodeUser.id);
    //check if the user is admin
    if(user.isAdmin){
        return next();
    }else{
        return next(appErr("Access Denied,Admin Only", 400));
        
    }
}


module.exports = isAdmin;