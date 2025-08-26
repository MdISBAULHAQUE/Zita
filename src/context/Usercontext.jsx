import React, { createContext, useState, useEffect } from "react";
import run from "../gemini";

export const datacontext = createContext();

function Usercontext({ children }) {
  const [speaking, setspeaking] = useState(false);
  const [prompt, setprompt] = useState("Listening...");
  const [response, setresponse] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Load voices when they become available
  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (speechRecognition) {
      const recog = new speechRecognition();
      recog.lang = "en-US";
      setRecognition(recog);
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }

    // Load voices for speech synthesis
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const femaleVoice = availableVoices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
      } else {
        setSelectedVoice(availableVoices[0]); // Fallback to first voice
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial load of voices
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      recognition.onresult = (e) => {
        if (e && e.results && e.results.length > 0) {
          const currentIndex = e.resultIndex;
          if (e.results[currentIndex] && e.results[currentIndex][0]) {
            const transcript = e.results[currentIndex][0].transcript;
            setprompt(transcript);
            takeCommand(transcript.toLowerCase());
          }
        }
      };
    } else {
      console.error("SpeechRecognition is not initialized.");
    }
  };

  const takeCommand = (command) => {
    // Sample command handling
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setprompt("Opening YouTube");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setprompt("Opening Google");
    } else if (command.includes("open") && command.includes("instagram")) {
      window.open("https://www.instagram.com/", "_blank");
      speak("Opening Instagram");
      setprompt("Opening Instagram");
    } else if (command.includes("show") && command.includes("time")) {
      const currentDate = new Date();
      const formattedTime = currentDate.toLocaleTimeString("en-US");
      const currentDateFormatted = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeText = `The current time is ${formattedTime}, and today is ${currentDateFormatted}`;
      speak(timeText);
      setprompt(timeText);
    } else {
      airesponse(command);
    }
  };

  async function airesponse(prompt) {
    let text = await run(prompt);
    let newText = text
      .replace(/google/gi, "Isbaul Haque")
      .replace(/Google/gi, "Isbaul Haque");
    setprompt(newText);
    speak(newText);
    setresponse(true);
  }

  const speak = (text) => {
    const textToSpeech = new SpeechSynthesisUtterance(text);
    textToSpeech.volume = 1;
    textToSpeech.rate = 1;
    textToSpeech.pitch = 1;
    textToSpeech.lang = "en-US"; // You can change the language to whatever is needed

    // Set the voice to the selected voice
    if (selectedVoice) {
      textToSpeech.voice = selectedVoice;
    }

    // Log speech output for debugging
    console.log("Speaking:", text);

    // Add onend event to reset speaking state after speech ends
    textToSpeech.onend = () => {
      setspeaking(false); // Reset speaking state
    };

    // Speak the text
    window.speechSynthesis.speak(textToSpeech);
  };

  const value = {
    recognition,
    speaking,
    setspeaking,
    prompt,
    setprompt,
    response,
    setresponse,
    startListening,
  };

  return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
}

export default Usercontext;
