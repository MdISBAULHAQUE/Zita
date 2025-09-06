// gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure your new, secure API key is in your .env file
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GOOGLE_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// FIX: Corrected the model name here
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192, // Increased for longer responses
};

async function run(prompt) {
  try {
    console.log("Sending prompt to Gemini:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini response:", text);
    return text || "I couldn't generate a response for that.";

  } catch (err) {
    console.error("Gemini API Error:", err);
    
    if (err.message?.includes('API_KEY')) {
      return "Please check your API key configuration.";
    }
    if (err.message?.includes('quota')) {
      return "API quota exceeded. Please try again later.";
    }
    
    return "I'm having trouble connecting right now. Please try again.";
  }
}

export default run;