import StudyPlan from "../models/StudyPlan.js";

export const createPlan = async (req, res) => {

 try {

  const { title, topic, date, duration } = req.body;

  const plan = new StudyPlan({
   title,
   topic,
   date,
   duration,
   createdBy: req.user._id
  });

  const saved = await plan.save();

  res.status(201).json(saved);

 } catch (error) {

  res.status(400).json({ message: error.message });

 }

};


export const getPlans = async (req, res) => {

 try {

  const plans = await StudyPlan.find({
   createdBy: req.user._id
  });

  res.json(plans);

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};