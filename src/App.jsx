import React, { useContext } from "react";
import "./App.css";
import va from "../Picture/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/Usercontext";
import speakGif from "../Picture/speak.gif";
import aiGif from "../Picture/aivoice.gif";

function App() {
  const { speaking, listening, prompt, response, startListening } = useContext(datacontext);

  return (
    <div className="main">
      <img src={va} alt="AI Assistant" id="zita" />
      <span>I'M Zita, Your Advanced Virtual Assistant</span>

      {!speaking && !response && !listening ? (
        <button onClick={startListening}>
          Click and Speak <CiMicrophoneOn size="1.2em" />
        </button>
      ) : (
        <div className="response">
          {listening ? (
            <img src={speakGif} alt="Listening..." id="speak" />
          ) : speaking ? (
            <img src={aiGif} alt="Speaking..." id="aigif" />
          ) : null}
          <p>{prompt}</p>
          <button onClick={startListening}>
            Ask Again <CiMicrophoneOn size="1.2em" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;