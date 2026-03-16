import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  question:{
    type:String,
    required:true
  },
  askedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  replies:[
    {
      message:String,
      repliedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      date:{
        type:Date,
        default:Date.now
      }
    }
  ]
},{timestamps:true});

export default mongoose.model("Discussion",discussionSchema);