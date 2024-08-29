const express =  require("express");
const { createPostCtrl, allPost, updatePost, deletePost, singlePostCtrl, toggleLikePostCtrl, toggleDisLikePostCtrl, postDetailsCtrl, deletePostCtrl, updatePostCtrl } = require("../Controller/postCtrl");
const isLogin = require("../middlewares/isLogin");
const postRouter = express.Router();

const multer = require("multer");
const storage = require("../Config/cloudinary");

 //instance of multer
 const upload = multer({storage})



// ----post---
 postRouter.post("/",isLogin, createPostCtrl);
 
 postRouter.get("/",isLogin,allPost);

 postRouter.get("/likes/:id",isLogin,toggleLikePostCtrl);

 postRouter.get("/dislikes/:id",isLogin,toggleDisLikePostCtrl);

 postRouter.get("/:id",isLogin, singlePostCtrl);

 postRouter.get("/:id",isLogin, postDetailsCtrl);

postRouter.put("/:id",isLogin,upload.single("photo"), updatePostCtrl);

postRouter.delete("/:id",deletePost);





module.exports = postRouter;