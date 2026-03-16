import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
{
studentId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

lessonId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Lesson"
},

fileUrl:{
type:String
},

fileName:{
type:String
},

score:{
type:Number,
default:null
},

feedback:{
type:String,
default:""
},

status:{
type:String,
enum:["submitted","reviewed"],
default:"submitted"
},

reviewedAt:{
type:Date
}

},
{timestamps:true}
);

export default mongoose.model("Assignment",assignmentSchema);
