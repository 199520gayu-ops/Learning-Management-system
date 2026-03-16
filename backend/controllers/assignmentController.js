import Submission from "../models/Submission.js";

/* GET ALL SUBMISSIONS */

export const getSubmissions = async (req,res)=>{
try{

const submissions = await Submission.find()
.populate("learner","name email")
.populate("assignment","title");

res.json(submissions);

}catch(err){
res.status(500).json({message:"Failed to fetch"});
}
};


/* EDUCATOR EVALUATE */

export const evaluate = async (req,res)=>{
try{

const {marks,feedback} = req.body;

const sub = await Submission.findByIdAndUpdate(
req.params.id,
{
marks,
feedback
},
{new:true}
);

res.json(sub);

}catch(err){
res.status(500).json({message:"Evaluation failed"});
}
};