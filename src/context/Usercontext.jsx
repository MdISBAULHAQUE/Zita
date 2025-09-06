import React, { createContext, useState, useEffect } from "react";
import run from "../gemini";

export const datacontext = createContext();

function Usercontext({ children }) {
  const [speaking, setspeaking] = useState(false);
  const [listening, setlistening] = useState(false);
  const [prompt, setprompt] = useState("Click the button and speak");
  const [response, setresponse] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Load voices and SpeechRecognition setup
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

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Try to pick a female voice if possible
      const femaleVoice = availableVoices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // fallback to first voice
      }
    };

    // Voices might load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const startListening = () => {
    if (recognition) {
      setlistening(true);
      setresponse(false);
      setspeaking(false);
      setprompt("Listening...");
      recognition.start();

      recognition.onresult = (e) => {
        if (e && e.results && e.results.length > 0) {
          const currentIndex = e.resultIndex;
          if (e.results[currentIndex] && e.results[currentIndex][0]) {
            const transcript = e.results[currentIndex][0].transcript;
            setlistening(false);
            setprompt(`You asked: "${transcript}"`);
            takeCommand(transcript.toLowerCase());
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setlistening(false);
        setspeaking(false);
        setprompt("Error recognizing speech. Please try again.");
      };

      recognition.onend = () => {
        setlistening(false);
      };
    } else {
      console.error("SpeechRecognition is not initialized.");
    }
  };

  const takeCommand = (command) => {
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
    try {
      let text = await run(prompt);
      let newText = text
        .replace(/google/gi, "Isbaul Haque")
        .replace(/Google/gi, "Isbaul Haque");
      setprompt(newText);
      speak(newText);
      setresponse(true);
    } catch (error) {
      console.error("Error in AI response:", error);
      setprompt("Sorry, something went wrong with AI response.");
      speak("Sorry, something went wrong with AI response.");
    }
  }

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeech = new SpeechSynthesisUtterance(text);

    textToSpeech.volume = 1;
    textToSpeech.rate = 1;
    textToSpeech.pitch = 1;
    textToSpeech.lang = "en-US";

    if (selectedVoice) {
      textToSpeech.voice = selectedVoice;
    } else {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        textToSpeech.voice = voices[0];
        console.log("Using fallback voice:", voices[0].name);
      }
    }

    textToSpeech.onstart = () => {
      console.log("Speech started");
      setspeaking(true);
    };

    textToSpeech.onend = () => {
      console.log("Speech ended");
      setspeaking(false);
    };

    textToSpeech.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setspeaking(false);
    };

    console.log("Speaking text:", text);
    window.speechSynthesis.speak(textToSpeech);
  };

  const value = {
    recognition,
    speaking,
    listening,
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
