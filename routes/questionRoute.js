import express from "express";

// STEP 1: Import answerQuestion from questionService.js
import { answerQuestion } from "../services/questionService.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    // STEP 2: Get the question from req.body
    const { question } = req.body;

    // STEP 3: Validate the question (check if it exists and is a string)
if (!question || typeof question !== "string" || !question.trim()) {
  return res.status(400).json({
    success: false,
    message: "Question is required and must be a string"
  });
}

    // STEP 4: Call answerQuestion() with the question
    const answer = await answerQuestion({ question });

    // STEP 5: Send a success response with the answer
   res.status(200).json({
  success: true,
  message: "Question answered successfully",
  data: answer
});


  } catch (error) {
    console.error("Islamic Q&A error:", error);
    res.status(500).json({
      success: false,
      message: "Error answering question",
      error: error.message,
    });
  }
});

export default router;
