const express =  require("express");
const commentRouter = express.Router();
const isLogin = require("../middlewares/isLogin");
const {createCommentCtrl,fetchAllCommentCtrl,fetchSingleCommentCtrl,updateComment,deletecommentCtrl} = require("../Controller/commentCtrl")




const multer = require("multer");
const storage = require("../Config/cloudinary");
//instance of multer
const upload = multer({storage})



// ----comment---

commentRouter.post("/:id",isLogin,createCommentCtrl);

commentRouter.get("/", fetchAllCommentCtrl);

commentRouter.get("/:id",isLogin,fetchSingleCommentCtrl);

commentRouter.put("/:id",isLogin,upload.single("photo"), updateComment );

commentRouter.delete("/:id",isLogin, deletecommentCtrl);



module.exports = commentRouter;
