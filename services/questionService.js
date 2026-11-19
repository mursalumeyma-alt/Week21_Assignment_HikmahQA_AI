import OpenAI from "openai";
import "dotenv/config";
import prisma from "../lib/prisma.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getSystemPrompt() {
  // Write the instruction for your system
  return `
    You are HikmahQA, an Islamic question-and-answer assistant.

    Answer Islamic questions using authentic Quranic verses
    and reliable Hadith references.

    Instructions:
    1. Be respectful, accurate, and clear.
    2. Provide Quran evidence with surah name and verse number.
    3. Provide authentic Hadith evidence with collection and reference.
    4. Never invent Quran verses or Hadith references.
    5. If you are uncertain about a reference, clearly say so.
    6. Do not issue personal fatwas.
    7. Encourage users to consult qualified Islamic scholars.

    Return your response as valid JSON with this structure:

    {
      "answer": "Your detailed answer",
      "evidence": {
        "quran": [
          {
            "reference": "Surah name and verse",
            "text": "Quran verse"
          }
        ],
        "hadith": [
          {
            "reference": "Hadith collection and number",
            "text": "Hadith text"
          }
        ]
      },
      "disclaimer": "This is NOT a fatwa. Consult qualified scholars."
    }
  `;
}

export async function answerQuestion({ question }) {
   
  try {
    const systemMessage = getSystemPrompt();

    // TODO: Ask OpenAI using systemMessage and the question
    // client.responses.create() — model "gpt-4o", json_object format
const response = await client.responses.create({
  model: "gpt-4o",
  input: [
    { role: "system", content: systemMessage },
    { role: "user", content: question }
  ],
  text: {
    format: {
      type: "json_object"
    }
  }
});
    // TODO: Parse response.output_text, save it with prisma.question.create(), and return it
if (!response.output_text) {
  throw new Error("OpenAI returned an empty response");
}

const result = JSON.parse(response.output_text);

await prisma.question.create({
  data: {
    question,
    answer: result.answer,
    evidence: JSON.stringify(result.evidence)
  }
});

return result;
  } catch (error) {
    throw error;
  }
}