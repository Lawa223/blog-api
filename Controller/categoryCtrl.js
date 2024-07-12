// Create Category

const createCategory =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Category created successfully"
        })
    } catch (error) {
        res.json(error.message);
    }
}

// All Category

const allCategory =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "All category"
        })
    } catch (error) {
        res.json(error.message);
    }
}


//Single Category

const singleCategory =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Single Category"
        })
    } catch (error) {
        res.json(error.message);
    }
}
//Update Category
const updateCategory =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Update Category",
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Delete Category
const deleteCategory =  async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Delete Category",
        })
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    createCategory,
    allCategory,
    singleCategory,
    updateCategory,
    deleteCategory,
}