const express =  require("express");
const { createCategoryCtrl,  updateCategory,  deleteCategoryCtrl, fetchSingleCategoryCtrl, fetchAllCategoryCtrl } = require("../Controller/categoryCtrl");

const isLogin = require("../middlewares/isLogin");
const categoryRouter = express.Router()

// ----category---

categoryRouter.post("/",isLogin, createCategoryCtrl);

categoryRouter.get("/",fetchAllCategoryCtrl);

categoryRouter.get("/:id",fetchSingleCategoryCtrl);

categoryRouter.put("/:id",updateCategory);

categoryRouter.delete("/:id",isLogin,deleteCategoryCtrl);


module.exports = categoryRouter;



