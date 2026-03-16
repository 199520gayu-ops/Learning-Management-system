import Task from "../models/Task.js";
import { sendEmail } from "../utils/sendEmail.js";


// CREATE TASK
export const createTask = async (req, res) => {

 try {

  const { title, description, learnerEmail } = req.body;

  const task = await Task.create({
   title,
   description,
   learnerEmail
  });

  const educatorEmail = "educator@gmail.com";

  await sendEmail(
   educatorEmail,
   "New Task Submission",
   `A learner submitted a task: ${title}`
  );

  res.status(201).json(task);

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};



// GET ALL TASKS
export const getTasks = async (req, res) => {

 try {

  const tasks = await Task.find().sort({ createdAt: -1 });

  res.json(tasks);

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};



// REPLY TASK
export const replyTask = async (req, res) => {

 try {

  const { reply } = req.body;

  const task = await Task.findByIdAndUpdate(
   req.params.id,
   { reply },
   { new: true }
  );

  if (!task) {
   return res.status(404).json({ message: "Task not found" });
  }

  await sendEmail(
   task.learnerEmail,
   "Reply for your task",
   `Educator reply: ${reply}`
  );

  res.json(task);

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};



// DELETE TASK
export const deleteTask = async (req, res) => {

 try {

  await Task.findByIdAndDelete(req.params.id);

  res.json({ message: "Task deleted successfully" });

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};