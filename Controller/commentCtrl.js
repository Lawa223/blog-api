//Create comment


const createComment = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Comment created successfully"
        })
     } catch (error) {
         res.json(error.message);
    }
 }
// All Comment
 const allComment =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "All comment"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Single Comment
const singleComment =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Single Comment"
        })
    } catch (error) {
        res.json(error.message);
    }
}
//Update Comment
const updateComment = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Update Comment "
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Delete Comment
const deleteComment =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Delete Comment",
        })
    } catch (error) {
        res.json(error.message);
    }
}


 module.exports = {
    createComment,
    allComment,
    singleComment,
    updateComment,
    deleteComment,


 }