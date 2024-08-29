const mongoose = require("mongoose")
const Post = require("../Post/Post");

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
          comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
          ],
            blocked:[
              {
                type : mongoose.Schema.Types.ObjectId,
                ref:"User",
              },
          ],
          //  plan : [
          //   {
          //     type: String,
          //     enum: ["Free","premium","Pro",],
          //     default: "Free",
          //   },
            
          //  ],
           userAward: {
            type : String,
            enum: ["Bronze","Silver","Gold"],
            default: "Bronze",
          },
      },
      {
        timestamps: true,
        toJSON:{virtuals: true},
      }
);

  userSchema.pre("findOne",async function (next){
    //get the user id 
    const userId = this._conditions._id;
    //find the post created by the user\
    const posts = await Post.find({user: userId});
    //get the last post created by the user
    const lastPost = posts[posts.length -1];
    

    //get the last post date
    const lastPostDate = new Date(lastPost?.createdAt);
    
    //get the last post date in string format
    const lastPostDateStr = lastPostDate.toDateString();
    
    // //add virtual to the schema
    userSchema.virtual("lastPostDate").get(function (){
      return lastPostDateStr;
      // <h1>{`${hour}:${min} ${hour < 12 ? "am" : "pm"}`}</h1>
    });
    
    //Check if user is inactive for 30 days -------
    //get current date 
    const currentDate = new Date();
    //get the difference between last post date and the current date
    const diff = currentDate - lastPostDate;
    //get the difference between in days and return less than in days
    const diffInDays = diff/ (1000 * 3600 * 24);

    if (diffInDays > 30){
      //Add virtuals isInactive to the schema to check if a user is inactive for 30 days
      userSchema.virtual("isInactive").get(function (){
        return true;
      });
      //Find the user by ID and update
      await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );
    }else{
      userSchema.virtual("isInactive").get(function (){
        return false;
      });
      //Find the user by ID and update
      await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      );
    }

     
    //---------Last Active Date------
    //convert  to days ago,for example 1 day ago
    const daysAgo = Math.floor(diffInDays);
    //Add virtuals lastActive in days to the schema
    userSchema.virtual("lastActive").get(function (){
      //Check if daysAgo is less than 0
      if (daysAgo <= 0){
        return "Today";
      }
      //Check if daysAgo is equal to 1
      if(daysAgo === 1) {
        return "Yesterday";
      }
      //check if daysAgo is greater than 1 
      if (daysAgo > 1){
        return `${daysAgo} days ago`;
      }
    });

     //update userAword based on the number of posts
     //-------------------------------------------------------
     //get the number of posts
     const numberOfPosts = posts.length;
     //check if the number of posts is less than 10
     if(numberOfPosts < 10){
      await User.findByIdAndUpdate(
        userId,
        {
          userAward: "Bronze",
        },
        {
          new: true,
        }
      );
     }
     //check if the number of posts is greater than 10
     if (numberOfPosts > 10){
      await User.findByIdAndUpdate(
        userId,
        {
          userAward: "Silver",
        },
        {
          new: true,
        }
      );
     }
     //check if the number of posts is greater than 20
     if (numberOfPosts > 20){
      await User.findByIdAndUpdate(
        userId,
        {
          userAward: "Gold",
        },
        {
          new: true,
        }
      );
     }
    next();
  })
    


 
      //Add fullName
      userSchema.virtual("fullName").get(function(){
        return `${this.firstName} ${this.lastName}`
      });
       //initials
       userSchema.virtual("initials").get(function(){
        return`${this.firstName[0]}${this.lastName[0]}`
       });
        //postCount
       userSchema.virtual("postCount").get(function(){
        return this.posts.length
       });
        //followers
       userSchema.virtual("followingCount").get(function(){
        return this.followers.length
       });
       //following
       userSchema.virtual("unfollowingCount").get(function(){
        return this.following.length
       });
       userSchema.virtual("blockedCount").get(function(){
        return this.blocked.length
       });
       userSchema.virtual("viewersCount").get(function(){
        return this.viewers.length
       });

       
     
       
      

  


      
const User = mongoose.model("User", userSchema)
module.exports = User;