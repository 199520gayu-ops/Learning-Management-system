import Quiz from "../models/Quiz.js";

export const createQuiz=async(req,res)=>{
 const q=await Quiz.create(req.body);
 res.json(q);
}

export const getQuiz=async(req,res)=>{
 const q=await Quiz.find();
 res.json(q);
}