const express =  require("express");
const { createPost, allPost, singlePost, updatePost, deletePost } = require("../Controller/postCtrl");
const postRouter = express.Router()

// ----post---
 postRouter.post("/", createPost);
 
 postRouter.get("/",allPost);

 postRouter.get("/:id", singlePost);

postRouter.put("/:id", updatePost);

postRouter.delete("/:id",deletePost);



module.exports = postRouter;