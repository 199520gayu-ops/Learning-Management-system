import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
{
assignment:{
type:mongoose.Schema.Types.ObjectId,
ref:"Assignment",
required:true
},

learner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

answer:{
type:String
},

marks:{
type:Number,
default:null
},

feedback:{
type:String,
default:""
}

},
{timestamps:true}
);

export default mongoose.model("Submission",submissionSchema);