const getTokenFromHeader = require("../Utils/getTokenFromHeader");
const verifyToken = require("../Utils/verifyToken");

const isLogin = (req,res,next) => {
    //get token from the header

    const token = getTokenFromHeader(req)

    //verify token 
    const decodeUser = verifyToken(token)

    //save  the user into req obj
    req.userAuth = decodeUser.id
    if(!decodeUser){
        return res.json({
            msg: "invalid/Expired token,please login again"
        })
    }else{
        next()
    }
}

module.exports = isLogin;