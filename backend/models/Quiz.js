import mongoose from "mongoose";

export default mongoose.model("Quiz",
 new mongoose.Schema({
  question:String,
  options:[String],
  answer:String
 })
);