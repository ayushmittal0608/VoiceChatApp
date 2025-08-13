import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid";

export default function VoiceChatControls() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = () => window.speechSynthesis.cancel();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const startRecognition = () => {
    window.speechSynthesis.cancel();

    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setUserSpeech("");
      setAssistantResponse("");
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserSpeech(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      recognition.stop();
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);

      if (!userSpeech.trim()) return;

      setProcessing(true);
      try {
        const systemPrompt = `
          आप एक चैटबोट हैं जो केवल Revolt (Rev) के बारे में जवाब देता है।
          कोई भी उपयोगकर्ता जो भाषा में पूछे, आप उसे हिंदी में उत्तर देंगे।
          कृपया हमेशा हिंदी में जवाब दें और Revolt के बारे में सही जानकारी दें।
        `;

        const res = await fetch("/api/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `${systemPrompt}\nUser: ${userSpeech}` }),
        });

        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        let aiText = data?.text?.parts?.[0]?.text || "";
        aiText = aiText.replace(/[*_`]/g, "").trim();
        setAssistantResponse(aiText);

        const utterance = new SpeechSynthesisUtterance(aiText);
        utterance.lang = "hi-IN"; // speak in Hindi
        utterance.onstart = () => setProcessing(false);
        utterance.onend = () => setProcessing(false);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error(err);
        setProcessing(false);
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "cursive",
      }}
    >
      <div style={{ textAlign: "center", display: "flex" }}>
        <img 
          src="/image.png" 
          alt="Rev Logo" 
          style={{ width: "120px", height: "120px", objectFit: "contain", display: "block", margin: "-12px" }} 
        />
        <h1>Talk to ChatBot</h1>
      </div>
      <button
        onClick={listening ? stopRecognition : startRecognition}
        disabled={processing}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: listening ? "#bb0000" : "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: processing ? "not-allowed" : "pointer",
          transition: "transform 0.2s",
          border: "none",
          outline: "none"
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {listening ? (
          <StopIcon style={{ width: "30px", height: "30px", color: "white" }} />
        ) : (
          <MicrophoneIcon style={{ width: "30px", height: "30px", color: "white" }} />
        )}
      </button>

      {processing && <p style={{ fontSize: "1.5rem", marginTop: "20px" }}>Processing...</p>}

      
    </div>
  );
}
