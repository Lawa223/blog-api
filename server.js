const express = require ("express");
const dotenv = require("dotenv");
const userRouter = require("./Route/userRouts");
const postRouter = require("./Route/postRouts");
const commentRouter = require("./Route/commentRouts");
const categoryRouter = require("./Route/categoryRouts");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const app = express()

require("dotenv").config()
require("./Config/dbConnect")

//middleware
app.use(express.json())

app.use("/api/v1/user",userRouter);
app.use("/api/v1/post",postRouter);
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/category",categoryRouter);


//error handlers middleware
app.use(globalErrorHandler);



//404 error
app.use("*",(req,res) => {
    res.status(404).json({
        message:`${req.originalUrl} - Rout not found`,
    });
});

//listen to server




const PORT = process.env.PORT || 9000

app.listen(PORT, console.log(`server is running on  ${PORT}`))
