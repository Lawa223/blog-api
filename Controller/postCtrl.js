//create post

const createPost = async (req,res) =>{
        try {
            res.json({
                status: "success",
                data: "Post created successfully"
            })
         } catch (error) {
             res.json(error.message);
        }
     }
     //All post
const allPost = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "All Posts"
        })
    } catch (error) {
        res.json(error.message);
    }
}
//Single Post
const singlePost = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Single Post "
        })
    } catch (error) {
        res.json(error.message);
    }
}
//Update Post
const updatePost = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Update Post",
        })
    } catch (error) {
        res.json(error.message);
    }
}
//Delete Post
const deletePost =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Delete Post",
        })
    } catch (error) {
        res.json(error.message);
    }
}

     module.exports = {
        createPost,
        allPost,
        singlePost,
        updatePost,
        deletePost
     }