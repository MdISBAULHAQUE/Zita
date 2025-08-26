let apiKey = "AIzaSyBZmnMzK88M039TNokjB1F9uJ2tyKzdrQg";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 50,
  responseModalities: [],
  responseMimeType: "text/plain",
};

// Helper function to download files (browser-friendly)
function downloadFile(filename, data, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  const candidates = result.response.candidates;

  // Loop through the candidates and parts
  for (
    let candidateIndex = 0;
    candidateIndex < candidates.length;
    candidateIndex++
  ) {
    for (
      let partIndex = 0;
      partIndex < candidates[candidateIndex].content.parts.length;
      partIndex++
    ) {
      const part = candidates[candidateIndex].content.parts[partIndex];

      if (part.inlineData) {
        try {
          const filename = `output_${candidateIndex}_${partIndex}`;

          const byteArray = new Uint8Array(
            atob(part.inlineData.data)
              .split("")
              .map((char) => char.charCodeAt(0))
          );

          downloadFile(filename, byteArray, part.inlineData.mimeType);
          console.log(`Output ready to be downloaded: ${filename}`);
        } catch (err) {
          console.error("Error processing inline data:", err);
        }
      }
    }
  }

  return result.response.text();
}

export default run;
