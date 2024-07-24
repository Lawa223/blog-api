

//Register

const User = require("../Model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/generateToken");
const appErr = require("../Utils/appErr");


//Register
const register = async (req,res,next) =>{
 const {firstName,lastName,profilePhoto,email,password} = req.body;
    try {

        //check if email exist

        const userFound = await User.findOne({email});
        if(userFound){
            return next(appErr("User already exists"));
        }

        //hash password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        //create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        });
        res.json({
            status: "success",
            data: user,

        })
    } catch (error) {
        next(appErr(error.message));
    }
}


//Login

const login = async (req,res,next) =>{

    const {email,password} = req.body;
    try {
        //check if email exist
        const userFound = await User.findOne({email});
        if(!userFound) {
            return next(appErr("Invalid credentials",400));
          
        }
        //check for valid password
        //veryfy password
        // const isPasswordMatched = await User.findOne({password})
        const isPasswordMatched = await bcrypt.compare(password,userFound.password);
        if(!isPasswordMatched){
            return next (appErr("Invalid credentials",400))
        }
        res.json({
            status: "success",
            data: {
                // id: userFound._id,
                firstName: userFound.firstName,
                email: userFound.email,
                // isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            },

        })
    } catch (error) {
        next(appErr(error.message));
    }
}




//All users


const allUsers = async (req,res,next) =>{
    try {
        res.json({
            status: "success",
            data: "All users",

        })
    } catch (error) {
        next(appErr(error.message))
    }
}


//User profile
//single User

const singleUser = async (req,res,next) =>{
    // console.log(req.params);
    // console.log(req.userAuth);
    // const {id} = req.params;
    const user = await User.findById(req.userAuth);
    try {
        res.json({
            status: "success",
            data: user,

        })
    } catch (error) {
        next(appErr(error.message));
    }
}


//UpdateUser

const updateUser = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Update User",

        })
    } catch (error) {
        res.json(error.message)
    }
}



//DeleteUser


const profilePhotoUploadCtrl = async (req,res,next) =>{
    try {

        //find the user to the update
        const userToUpdate = await User.findById(req.userAuth);
        //check if user found
        if(!userToUpdate){
            return next(appErr("User not found", 403))
        }
        //check if user is blocked
        if(userToUpdate.isBlocked){
            return next (appErr("Action not allowed,your account is blocked", 403));
        }
        //check if a user is updating their photo
        if(req.file){
            await User.findByIdAndUpdate(
             req.userAuth,
             {
                $set:{
                    profilePhoto: req.file.path,
                },
             },
             {
                new: true,
            }
            );
            res.json({
                status: "success",
                data: "You have successfully updated your profile photo",
    
            }); 
        }
    } catch (error) {
        next(appErr(error.message, 500));
    }
   };
      
        
        
        // who view user profile
        const whoViewedProfileCtrl = async (req,res,next) =>{
            try{
                //1. find the original user
                const user = await User.findById(req.params.id);
                //2. find the user who viewed the profile
                const  userWhoViewed = await User.findById(req.userAuth);
                //3. checck if original and who viewed are found
                if(user && userWhoViewed){
                //4. check if user whoViewed is already in the user viewers array
                const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString () === userWhoViewed._id.toJSON);
                if(isUserAlreadyViewed){
                    return next(appErr("you already viewed this profile"))
                }else{
                //5. push the userWhoViewed into the user's viewers array 
                user.viewers.push(userWhoViewed._id);
                //6. save the user
                await user.save();
                res.json({
                    status: "success",
                    msg: "You have successfully viewed this profile",
                    data: user.viewers,
                });
                }
            }
        
    } catch (error) {
        next(appErr(error.message, 500));
    }
    };
    

         //following

    const followingCtrl = async (req,res,next) =>{
        try {
            //1.find the user to follow
            const userToFollow = await User.findById(req.params.id);
            //2.find the user who is following
            const userWhoFollowed = await User.findById(req.userAuth);
            //3.Check if user and userWhoFollowed are found
            if(userToFollow && userWhoFollowed){
                //4.check userWhoFollowed is already in the user's followers array
                const isUserAlreadyFollowed = userToFollow.followers.find((follower) => follower.toString() === userWhoFollowed._id.toString());
                if(isUserAlreadyFollowed){
                    return next(appErr("You already followed the user"))
                }else{
                   //5. push userWhoFollowed in to the user's followers array
                   userToFollow.followers.push(userWhoFollowed._id);
                   //6. push userToFollowed to the userWhoFollowed following array
                   userWhoFollowed.following.push(userToFollow._id);
                   //7. save
                   await userWhoFollowed.save();
                   await userToFollow.save();
                }
            }
            res.json({
                status: "success",
                message: "You have successfully followed this user",
                followers: userToFollow.followers,
                following: userWhoFollowed.following,
    
            })
        } catch (error) {
            next(appErr(error.message))
        }
    };


module.exports = {
    register,
    login,
    allUsers,
    singleUser,
    updateUser,
    // deleteUser,
    profilePhotoUploadCtrl,
    whoViewedProfileCtrl,
    followingCtrl,
   
};