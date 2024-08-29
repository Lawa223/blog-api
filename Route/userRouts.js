    const express =  require("express")
    // const userRouter = express.Router()
   // ----user---



   const { register, login, allUsers, singleUser,deleteUsers, profilePhotoUploadCtrl,         whoViewedProfileCtrl, followingCtrl, unFollowCtrl, blockedCtrl, unBlockedCtrl, adminBlockUserCtrl, adminUnBlockUserCtrl, updateUserCtrl, updatePassWordCtrl, deleteUserCtrl } = require("../Controller/userCtrl");

   const isLogin = require("../middlewares/isLogin");
   const multer = require("multer");
   const storage = require("../Config/cloudinary");
const isAdmin = require("../middlewares/isAdmin");
   const userRouter = express.Router()

   //instance of multer
   const upload = multer({storage})

 
   userRouter.post("/register",register);

   userRouter.post("/login",login);

   userRouter.get("/",allUsers);

   userRouter.get("/profile",isLogin,singleUser);

   userRouter.put("/update",isLogin, updateUserCtrl);

   userRouter.put("/update-password",isLogin, updatePassWordCtrl);

  userRouter.delete("/delete",isLogin,deleteUserCtrl);

  //Get/api/v1/users/profile-viewers/:id
  userRouter.get("/profile-viewers/:id", isLogin, whoViewedProfileCtrl);

  //Get/api/v1/users/profile-follower/:id
  userRouter.get("/following/:id",isLogin,followingCtrl);

   //Get/api/v1/users/following/:id
   userRouter.get("/unfollowing/:id",isLogin,unFollowCtrl)



   //Get/api/v1/users/block/:id
   userRouter.get("/blocked/:id",isLogin,blockedCtrl)


      //Get/api/v1/users/unblock/:id
      userRouter.get("/unblocked/:id",isLogin,unBlockedCtrl)


        //Put/api/v1/users/Admin-block/:id
        userRouter.put("/admin-block/:id",isLogin,isAdmin, adminBlockUserCtrl);


          //Put/api/v1/users/Admin-unBlock/:id
          userRouter.put("/admin-unblock/:id",isLogin,isAdmin, adminUnBlockUserCtrl);

   //post/api/v1/users/profile-photo-upload
   userRouter.post("/profile-photo-upload",isLogin,upload.single("profile"),profilePhotoUploadCtrl);
 








// userRouter.post("/register", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "user registered successfully",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.post("/login", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "user login successfully",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.get("/", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "All users",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.get("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Single user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.put("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Update user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.delete("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Delete user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });




module.exports = userRouter;
