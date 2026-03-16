import Discussion from "../models/Discussion.js";


// CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {

    const { question } = req.body;

    const newQuestion = new Discussion({
      question,
      askedBy: req.user._id
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);

  } catch (error) {

    res.status(500).json({
      message: "Error creating question",
      error: error.message
    });

  }
};



// GET ALL QUESTIONS
export const getQuestions = async (req, res) => {

  try {

    const questions = await Discussion.find()
      .populate("askedBy", "name email")
      .populate("replies.repliedBy", "name");

    res.status(200).json(questions);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching discussions",
      error: error.message
    });

  }

};



// REPLY TO QUESTION
export const replyQuestion = async (req, res) => {

  try {

    const { message } = req.body;

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    discussion.replies.push({
      message,
      repliedBy: req.user._id
    });

    await discussion.save();

    res.status(200).json({
      message: "Reply added successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error replying to discussion",
      error: error.message
    });

  }

};