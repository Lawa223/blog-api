

//Register

const User = require("../Model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/generateToken");
const appErr = require("../Utils/appErr");
const Category = require("../Model/Category/Category")
const Comment = require("../Model/Comment/Comment");

const Post = require("../Model/Post/Post");

//Register
const register = async (req,res,next) =>{
 const {firstName,lastName,profilePhoto,email,password,isAdmin} = req.body;
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


// const allUsers = async (req,res,next) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "All users",

//         })
//     } catch (error) {
//         next(appErr(error.message))
//     }
// }



    

//All users


const allUsers = async (req,res) =>{
    try {
         //find all users
         const users = await User.find()
        res.json({
            status: "success",
            data: users,

        })
    } catch (error) {
        res.json(error.message)
    }
}


//User profile
//single User

const singleUser = async (req,res,next) =>{
   
    const user = await User.findById(req.userAuth);
    try {
        res.json({
            status: "success",
            data: user,

        })
    } catch (error) {
        
        next(appErr(error.message));
    }
};


//UpdateUser

const updateUserCtrl = async (req,res,next) =>{
    const {email, firstName, lastName} = req.body;
    try {
        //Check if email
        if(email){
            const emailFound = await User.findOne({email: email});
            if(emailFound){
                return next(appErr("Email is taken", 400));
            }
        }
        //update the user
        const user = await User.findByIdAndUpdate(
            req.userAuth,
            {lastName, firstName, email},
            {new: true, runValidators: true}
        );
        res.json({
            status: "success",
            data: user,

        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//update password
const updatePassWordCtrl = async (req,res,next) => {
    const {password} = req.body;
    try{
        //Check if user is updating password
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            //update user
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    password: hashedPassword,
                },
                {
                    new: true,
                }
            );
            res.json({
                status: "Success",
                data: "password update successfully",
            });
        }else{
            return next(appErr("please provide password field"));
        }
    }catch (error){
        next(appErr(error.message));
    }
};



       //Profile Photo----------------


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
      
        
        //Viewers

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
                    return next(appErr("You already viewed this profile"))
                }else{
                //5. push the userWhoViewed into the user's viewers array 
                user.viewers.push(userWhoViewed._id);
                //6. save the user
                await user.save();
                res.json({
                    status: "Success",
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


    //Unfollow user
    const unFollowCtrl = async (req,res,next) =>{
       
        const user = await User.findById(req.userAuth);
        try {
               //1.find the user to follow
               const userToBeUnFollowed = await User.findById(req.params.id);
               //2.find the user who is following
               const userWhoUnFollowed = await User.findById(req.userAuth);
               //3.check if the user is userWhoUnFollowed are found
               if(userToBeUnFollowed && userWhoUnFollowed){
               //4. Check if userWhoUnfollowed is alredy in the user's  followers array
               const isUserAlreadyFollowed = userToBeUnFollowed.followers.find((follower) => follower.toString()  === userWhoUnFollowed._id.toString());
               if(!isUserAlreadyFollowed){
                return next(appErr("You have not followed this user"));
               }else{
            
                //5.Remove  userWhoFollowed from the user's followers array
                userToBeUnFollowed.followers = userToBeUnFollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toString());
               
                //6. Save the User
                await userToBeUnFollowed.save()


                //7. Remove userToBeUnfollowed from the userWhoUnFollowed's following array
             userWhoUnFollowed.following = userToBeUnFollowed.following.filter(following => following.toString() !== userWhoUnFollowed._id.toString)

             //8. save the user
             await userWhoUnFollowed.save();
               
            res.json({
                status: "success",
                msg: "You have successfully unfollowed the user",
                usertobeUnfollowed: userToBeUnFollowed.followers,
                userWhoUnFollowed: userWhoUnFollowed.following,
    
            })
        }
    }
        } catch (error) {
            next(appErr(error.message));
        }
    };


        //Block

         
    const blockedCtrl = async (req,res,next) =>{
        try {
            //1.find the user to block
            const userToBlocked = await User.findById(req.params.id);
            //2.find the user who  blocked user
            const userWhoBlocked = await User.findById(req.userAuth);
            //3.Check if user and userWhoBlocked are found
            if(userToBlocked && userWhoBlocked){
                //4.check userWhoBlocked is already in the user's Blocked array
                const isUserAlreadyBlocked = userWhoBlocked.blocked.find((blocked) => blocked.toString() === userToBlocked._id.toString());

                if(isUserAlreadyBlocked){
                    return next(appErr("You already blocked the user"))
                }else{
                   //5. push userToBlocked in to the userWhoBlocked's blocked array
                   userWhoBlocked.blocked.push(userToBlocked._id);
                   //6. push userToBlocked to the userWhoBlocked blocked array
                   userWhoBlocked.blocked.push(userToBlocked._id);
                   //7. save
                   await userWhoBlocked.save();
                //    await userToBlock.save();
                }
            }
            res.json({
                status: "success",
                message: "You have successfully Blocked this user",
                // followers: userToBlock.followers,
                blocked: userWhoBlocked.blocked,
    
            })
        } catch (error) {
            next(appErr(error.message))
        }
    };



    //UnBlocked

    const unBlockedCtrl = async (req,res,next) =>{
       
        
        try {
               //1.find the user to block
               const userToBeUnBlocked = await User.findById(req.params.id);
               //2.find the user who is block
               const userWhoUnBlocked = await User.findById(req.userAuth);
               //3.check if the user is userWhoUnBlocked are found
               if(userToBeUnBlocked && userWhoUnBlocked){
               //4. Check if userWhoUnBlock is alredy in the user's  block array
               const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find((block) => block.toString()  === userToBeUnBlocked._id.toString());
               if(!isUserAlreadyBlocked){
                return next(appErr("You have not Blocked this user"));
               }else{
            
                //5.Remove  userWhoUnBlocked from the user's blocked array
                userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(block => block.toString() !== userToBeUnBlocked._id.toString());
               
                //6. Save the User
                await userWhoUnBlocked.save()                
               
            res.json({
                status: "success",
                msg: "You have successfully unblocked the user",
                
                userWhoUnBlocked: userWhoUnBlocked.blocked,
    
            })
        }
    }
        } catch (error) {
            next(appErr(error.message));
        }
    };
     
      //Admin blocked

      const adminBlockUserCtrl = async (req,res,next) =>{
        //find the user to be blocked
        
        try {
             //find the user to be blocked
             const userTobeBlocked = await User.findById(req.params.id);
             if(!userTobeBlocked){
                return next(appErr("user not found",400))
             }
             //Change the isBlocked to true
             userTobeBlocked.isBlocked = true;
             await userTobeBlocked.save();
            res.json({
                status: "success",
                data: "You have successfully blocked this user",
    
            })
        } catch (error) {
            res.json(error.message)
        }
    };

         
      //Admin Unblocked

      const adminUnBlockUserCtrl = async (req,res,next) =>{
        //find the user to be blocked
        
        try {
             //find the user to be blocked
             const userToBeUnBlocked = await User.findById(req.params.id);
             if(!userToBeUnBlocked){
                return next(appErr("user not found",400))
             }
             //Change the isBlocked to true
             userToBeUnBlocked.isBlocked = false;
             await userToBeUnBlocked.save();
            res.json({
                status: "success",
                data: "You have successfully unblocked this user",
    
            })
        } catch (error) {
            next(appErr(error.message));
        }
    };

                  

    ///Delete

const deleteUserCtrl = async (req,res,next) =>{
    try {
        //1.find the user to be deleted
        await User.findByIdAndDelete(req.userAuth);
       //2.find all posts by the user to be deleted
       await Post.deleteMany({user: req.userAuth});
       //3.Delete all comments of the user
       await Comment.deleteMany({user: req.userAuth});
       //4.Delete all comments of the user
       await Category.deleteMany({user: req.userAuth});
      
        res.json({
            status: "success",
            data: "Your account has been deleted successfully",

        });
    } catch (error) {
        next(appErr(error.message))
    }
};






  

module.exports = {
    register,
    login,
    allUsers,
    singleUser,
    updateUserCtrl,
    deleteUserCtrl,
    profilePhotoUploadCtrl,
    whoViewedProfileCtrl,
    followingCtrl,
    unFollowCtrl,
    blockedCtrl,
    unBlockedCtrl,
    adminBlockUserCtrl,
    adminUnBlockUserCtrl,
    updatePassWordCtrl ,

   
};