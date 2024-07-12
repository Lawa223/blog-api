const express =  require("express")
// const userRouter = express.Router()
// ----user---



const { register, login, allUsers, singleUser, updateUser, deleteUsers } = require("../Controller/userCtrl");
 const userRouter = express.Router()







 userRouter.post("/register",register);

 userRouter.post("/login",login);

 userRouter.get("/",allUsers);

 userRouter.get("/",singleUser);

 userRouter.put("/profile/:id",updateUser);

 userRouter.delete("/profile/:id",deleteUsers);








// userRouter.post("/register", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "user registered successfully",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.post("/login", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "user login successfully",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.get("/", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "All users",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.get("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Single user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.put("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Update user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });
// userRouter.delete("/profile/:id", async (req,res) =>{
//     try {
//         res.json({
//             status: "success",
//             data: "Delete user",
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// });




module.exports = userRouter;
