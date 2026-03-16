import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
{
  title:{
    type:String,
    required:true
  },
  topic:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  duration:{
    type:String,
    required:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},
{timestamps:true}
);

export default mongoose.model("StudyPlan",studySchema);