

//Register

const User = require("../Model/User/User");
const bcrypt = require("bcryptjs")

const register = async (req,res) =>{

    const {firstName,lastName,profilePhoto,email,password} = req.body;



    try {

        //check if email exist

        const userFound = await User.findOne({email});
        if(userFound){
            return res.json({
                msg: "User already exist"
            });
        }

        //hash password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        //create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        });
        res.json({
            status: "success",
            data: user,

        })
    } catch (error) {
        res.json(error.message)
    }
}


//Login

const login = async (req,res) =>{

    const {email,password} = req.body;
    try {
        //check if email exist
        const userFound = await User.findOne({email});
        if(!userFound) {
            return res.json({
                msg:"invalid Credentials",
            });
          
        }
        //check for valid password
        //veryfy password
        // const isPasswordMatched = await User.findOne({password})
        const isPasswordMatched = await bcrypt.compare(password,userFound.password);
        if(!isPasswordMatched){
            return res.json({

                msg: "invalid Credentials"
            });
        }
        res.json({
            status: "success",
            data: "User Login successfully",

        })
    } catch (error) {
        res.json(error.message)
    }
}




//All users


const allUsers = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "All user",

        })
    } catch (error) {
        res.json(error.message)
    }
}



//single User

const singleUser = async (req,res) =>{
    // console.log(req.params);
    const {id} = req.params;
    const user = await User.findById(id);
    try {
        res.json({
            status: "success",
            data: "single User",

        })
    } catch (error) {
        res.json(error.message)
    }
}


//UpdateUser

const updateUser = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Update User",

        })
    } catch (error) {
        res.json(error.message)
    }
}


//DeleteUser


const deleteUsers = async (req,res) =>{
    try {
        res.json({
            status: "success",
            data: "Delete User",

        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    register,
    login,
    allUsers,
    singleUser,
    updateUser,
    deleteUsers,
}