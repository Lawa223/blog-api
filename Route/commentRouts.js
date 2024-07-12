const express =  require("express");
const { createComment,allComment, singleComment, updateComment, deleteComment } = require("../Controller/commentCtrl");


const commentRouter = express.Router()

// ----comment---

commentRouter.post("/",createComment);

commentRouter.get("/",allComment);

commentRouter.get("/:id",singleComment);

commentRouter.put("/:id",updateComment );

commentRouter.delete("/:id",deleteComment);



module.exports = commentRouter;
