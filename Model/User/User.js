const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : [true,"firstName is require"],
            trim : true,
        },
        lastName : {
            type : String,
            required : [true,"lastName is require"],
            trim : true,
        },
        profilePhoto : {
            type : String,
            
        },
        email : {
            type : String,
            require : [true,"email is require"],
        },
          password: {
            type: String,
            required: [true,"password is required"],
          },
        
          isBlocked: {
            type: Boolean,
            default: false,
          },
          isAdmin: {
             type: Boolean,
             default: false,
          },
          role:{
            type: String,
            enum: ["Admin","Guest","Editor"],
          },
          viewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
          ],
          followers : [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
          },
          ],
          following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
          ],
          // active:{
          //   type: Boolean,
          //   default: true,
          // },
          posts:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
          ],
            blocked:[
              {
                type : mongoose.Schema.Types.ObjectId,
                ref:"User",
              },
          ],
           plan : [
            {
              type: String,
              enum: ["Free","premium","Pro",],
              default: "Free",
            },
           ],
           userAward: {
            type : String,
            enum: ["Bronze","Silver","Gold"],
            default: "Bronze",
          },
      },
      {
        timestamps: true,
      }
);

const User = mongoose.model("User", userSchema)
module.exports = User;