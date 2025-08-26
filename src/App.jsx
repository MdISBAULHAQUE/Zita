import React, { useContext } from "react";
import "./App.css";
import va from "../Picture/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/Usercontext";
import speakGif from "../Picture/speak.gif";
import aiGif from "../Picture/aivoice.gif";

function App() {
  const {
    recognition,
    speaking,
    setspeaking,
    prompt,
    response,
    setresponse,
    setprompt,
    startListening, // Use startListening from context
  } = useContext(datacontext);

  return (
    <div className="main">
      <img src={va} alt="" id="zita" />
      <span>I'M Zita, Your Advanced Virtual Assistant</span>

      {!speaking ? (
        <button
          onClick={() => {
            setprompt("Listening...");
            setspeaking(true);
            setresponse(false);
            startListening(); // Start listening when button is clicked
          }}
        >
          Click here <CiMicrophoneOn />
        </button>
      ) : (
        <div className="response">
          {!response ? (
            <img src={speakGif} alt="" id="speak" />
          ) : (
            <img src={aiGif} alt="" id="aigif" />
          )}

          <p>{prompt}</p>
        </div>
      )}
    </div>
  );
}

export default App;
