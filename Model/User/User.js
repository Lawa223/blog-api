const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            require : [true,"firstName is require"],
            trim : true
        },
        lastName : {
            type : String,
            require : [true,"lastName is require"],
            trim : true
        },
        profilePhoto : {
            type : String,
            
        },
        email : {
            type : String,
            require : [true,"email is require"]
        },

       
      }

)