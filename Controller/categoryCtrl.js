
const appErr = require("../Utils/appErr");
const Category = require("../Model/Category/Category")




// Create Category



const createCategoryCtrl =  async (req, res, next) =>{
    const {title} = req.body;
    try {
        const category = await Category.create({title,user: req.userAuth});
        res.json({
            status: "success",
            data: category ,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

    // fetch all category

    const fetchAllCategoryCtrl = async (req,res,next) =>{
        try{
            const categories = await Category.find();
            res.json({
                status: "success",
                data: categories,
            });
        }catch(error){
            next(appErr(error.message));
        }
    }


//Single Category

const fetchSingleCategoryCtrl =  async (req,res,next) =>{
    try {
         
        const category = await Category.findById(req.params.id)
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}



//Update Category
const updateCategory =  async (req,res,next) =>{
    const {title} = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id,{title},{new: true, runValidators: true},);
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//Delete Category
const deleteCategoryCtrl =  async (req,res,next) =>{
    try {
        //1.find the Category to be deleted
        await Category.findByIdAndDelete(req.params.id);
  
        res.json({
            status: "success",
            Message: "Category deleted successfully"
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

module.exports = {
    createCategoryCtrl,
    fetchAllCategoryCtrl,
    fetchSingleCategoryCtrl,
    updateCategory,
    deleteCategoryCtrl,
    
}