const User = require("../Model/User/User");
const Post = require("../Model/Post/Post");
const appErr = require("../Utils/appErr");



//create post
const createPostCtrl = async (req,res,next) =>{
    const {title,description,category} = req.body;
        try {
            //find the user
         const  author = await User.findById(req.userAuth);
         //check if the user is block
          if (author.isBlocked){
            return next(appErr("Access denied, account blocked", 403));
          }
          //check if title is already taken
          const postTitle = await Post.findOne({title})
          if(postTitle){
            return next(appErr(`${title} already exists`, 403));
          }
         //create post
         const postCreated = await Post.create({
            title,
            description,
            category,
            user: author._id,

         });
         await author.save();
            res.json({
                status: "success",
                data: postCreated,
            })
         } catch (error) {
             res.json(error.message);
        }
     };
 



             //Single Post
             
           const singlePostCtrl = async (req,res) =>{
   
          try {
        //find the user
        const author = await User.findById(req.userAuth);
        //find the post
        const post = await Post.findById(req.params.id)           
          
        res.json({
            status: "success",
            data: post,
        })
    } catch (error) {
        res.json(error.message);
    }
}



     //All post
     const allPost = async (req,res) =>{
        try {
            const posts = await Post.find({}).populate("user").populate("category","title")
            //Check if the user is blocked by the post owner
            const filteredPosts = posts.filter((post) => {
                //get all blocked users
                const blockedUsers = post.user.blocked;
                const isBlocked = blockedUsers.includes(req.userAuth);

                return !isBlocked;
            });
            res.json({
                status: "success",
                data:  filteredPosts,
            })
        } catch (error) {
            res.json(error.message);
        }
    };

    //Like Post

    //toggle like
    const toggleLikePostCtrl = async (req,res,next) =>{
        try{
                 //Get the post
        const post = await Post.findById(req.params.id);
        //Check if the user already like the post
        const isLike = post.likes.includes(req.userAuth);
        //if the user has already like the post,Unlikee the post
        if(isLike){
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString())
            await post.save()
        }else{
            //iif the user has not liked the post,like the post
            post.likes.push(req.userAuth)
            await post.save()
         }
            res.json({
                status: "success",
                data: post,
            });
        } catch (error) {
            next(error.message);
        }
    };

             

    //toggle Dislike
    const toggleDisLikePostCtrl = async (req,res,next) =>{
        try{
                 //Get the post
        const post = await Post.findById(req.params.id);
        //Check if the user already Dislike the post
        const isDisLike = post.dislikes.includes(req.userAuth);
        //Check if the user has already liked the post,UnDisLike the post
        const isLiked = post.likes.includes(req.userAuth);
        if(isLiked){
            return next(
                appErr(
                    "You have already liked this post,Unlike to Dislike the post", 403
                )
            );
           
        }else{
            //if the user has already liked the post,unlike the post
            if(isDisLike){
                post.dislikes = post.dislikes.filter(
                    (dislike) => dislike.toString() !== req.userAuth.toString()
                );
                await post.save();
            }else{
                //if the user has not like the post, like the post
                post.dislikes.push(req.userAuth)
                await post.save();
            }

         }
            res.json({
                status: "success",
                data: post,
            });
        } catch (error) {
            next(error.message);
        }
    };
    
    
    //Post Details
    const postDetailsCtrl = async (req,res,next) =>{
        try{
           //Find the post
           const post = await Post.findById(req.params.id);
           //Number of view
           //Check if the user viewed this post
           const isViewed = post.numViews.includes(req.userAuth)
           if(isViewed){
           res.json({
            status: "success",
            data: post,
           });
        }else{
            //push into numViews
            post.numViews.push(req.userAuth);
            await post.save();
            res.json({
                status: "success",
                data: post,
            });
        }
        }catch (error){
            next(appErr(error.message));
        }
    };
    
      
        
    //Update Post 
const updatePostCtrl =  async (req,res,next) =>{
    const {description,title,category} = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id)
        if(post.user.toString() !== req.userAuth.toString()){
            return next(appErr("You are not allowed to update this post", 403))
        }
        const updatePost = await Post.findByIdAndUpdate(req.params.id,{title,description,category,photo:req?.file?.path},{new: true},);
        res.json({
            status: "success",
            data: updatePost,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

        
    

// //Update Post
// const updatePost = async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Update Post",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// }


//Delete Post
const deletePost =  async (req,res,next) =>{
    try {
        //1.find the Post to be deleted
        const post = await findById(req.params.id);
       if (post.user.toString() !== req.userAuth.toString()){
          return  next(appErr("You are not allowed to delete this post", 403));
        }
           await post.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            Message: "Post deleted successfully"
        })
    } catch (error) {
        next(appErr(error.message));
    }
}





    
     module.exports = {
        createPostCtrl,
        allPost,
        singlePostCtrl,
        toggleLikePostCtrl,
        toggleDisLikePostCtrl,
        postDetailsCtrl,
        deletePost,
        updatePostCtrl,
     }