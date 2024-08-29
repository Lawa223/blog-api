const appErr = require("../Utils/appErr");
const Comment = require("../Model/Comment/Comment");
const User = require("../Model/User/User");
const Post = require("../Model/Post/Post");




//create Comment
const createCommentCtrl = async (req,res,next) =>{
    const {description} = req.body;
        try {
            //find the post to comment
            const post = await Post.findById(req.params.id)
            //create the comment
            const comment = await Comment.create({
                post: post._id,
                description,
                user:req.userAuth,
            })
              //push the comment to the post
              post.comments.push(comment._id);
             // find the user
             const user = await User.findById(req.userAuth)
             //push to user list
             user.comments.push(comment._id);
             //save
             await post.save({validateBeforeSave: false});
             await user.save({validateBeforeSave: false});

               
         
            res.json({
                status: "success",
                data: comment,
            })
         } catch (error) {
            next(appErr(error.message));
        }
     }

    // Read all comment

    const fetchAllCommentCtrl = async (req,res,next) =>{
        try{
            const comment = await Comment.find();
            res.json({
                status: "success",
                data: comment,
            });
        }catch(error){
            next(appErr(error.message));
        }
    }

//Read the single comment

const fetchSingleCommentCtrl =  async (req,res,next) =>{
    try {
        const comment = await Comment.findById(req.params.id)
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}
//Update Comment 
const updateComment =  async (req,res,next) =>{
    const {description,post} = req.body;
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id,{description,post},{new: true, runValidators: true},);
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}
//Delete Comment
const deletecommentCtrl =  async (req,res,next) =>{
    try {
        //1.find the Comment to be deleted
        const comment = await Comment.findById(req.params.id);
       if (comment.user.toString() !== req.userAuth.toString()){
          return  next(appErr("You are not allowed to delete this comment", 403));
        }
           await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            Message: "Comment deleted successfully"
        })
    } catch (error) {
        next(appErr(error.message));
    }
}



    module.exports = {
        createCommentCtrl,
        fetchAllCommentCtrl,
        fetchSingleCommentCtrl,
        updateComment,
        deletecommentCtrl


 }