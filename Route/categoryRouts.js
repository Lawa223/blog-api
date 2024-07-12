const express =  require("express");
const { createCategory, allCategory, singleCategory, updateCategory, deleteCategory } = require("../Controller/categoryctrl");
const categoryRouter = express.Router()

// ----category---

categoryRouter.post("/",createCategory);

categoryRouter.get("/",allCategory);

categoryRouter.get("/:id",singleCategory);

categoryRouter.put("/:id",updateCategory);

categoryRouter.delete("/:id",deleteCategory);


module.exports = categoryRouter;



