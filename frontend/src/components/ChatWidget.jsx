import AdminPanel from "./AdminPanel.jsx";
import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaMicrophone,
  FaKeyboard,
  FaVolumeUp,
  FaVolumeMute,
  FaUserAlt,
  FaPlus,
  FaChevronLeft
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const Typewriter = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayedText}</span>;
};

export default function ChatWidget({ isOpen, closeChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [listening, setListening] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  }, []);

  const speak = (msg) => {
    if (!speakerOn) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(msg);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.name.includes("Google US English") ||
      v.name.includes("Samantha") ||
      v.name.includes("Zira") ||
      v.name.toLowerCase().includes("female")
    );
    if (femaleVoice) speech.voice = femaleVoice;
    speech.lang = "en-US";
    speech.pitch = 1.1;
    speech.rate = 1.0;
    window.speechSynthesis.speak(speech);
  };

  const send = async (msg) => {
    if (!msg.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: msg, isNew: false }
    ]);

    setText("");
    setVoiceMode(false);

    try {
      const res = await fetch("https://8000-01kjz5d1wyvdjk73xd3fys2m8w.cloudspaces.litng.ai/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: msg
        })
      });

      const data = await res.json();
      const responseText = data.answer;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: responseText,
          isNew: true,
          showCall: shouldShowCall(responseText)
        }
      ]);

      speak(responseText);

    } catch (err) {
      const fallback = "Something went wrong. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: fallback,
          isNew: true,
          showCall: true
        }
      ]);

      speak(fallback);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) setText(event.results[i][0].transcript);
        else interim += event.results[i][0].transcript;
      }
    };
    recognition.onend = () => { setListening(false); setVoiceMode(false); };
  };

  const shouldShowCall = (text) => {
    const keywords = [
      "don't have",
      "do not have",
      "not available",
      "visit official",
      "official site",
      "call",
      "contact"
    ];

    return keywords.some(k =>
      text.toLowerCase().includes(k)
    );
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col bg-[#F7F9FC] transition-all duration-700 ease-in-out chat-reveal ${isOpen ? "open" : "closed"}`}>

      {isAdminMode ? (
        <AdminPanel
          isLoggedIn={isLoggedIn}
          setLoggedIn={setIsLoggedIn}
          goBack={() => setIsAdminMode(false)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
            <button onClick={closeChat} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:bg-gray-50 transition">
              <FaChevronLeft size={14} />
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-800 tracking-tight text-lg">Adamas Agent</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Now</span>
              </div>
            </div>

            {/* Logo Button to trigger Admin */}
            <div
              onClick={() => setIsAdminMode(true)}
              className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm cursor-pointer hover:ring-2 ring-blue-400 transition-all"
            >
              <img src="/AU.png" alt="Bot Avatar" className="w-8 h-8 object-contain" />
            </div>
          </div>

          {/* Message Area */}
          <div
            ref={scrollRef}
            className="relative flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#F7F9FC]"
          >

            {/* ✅ Watermark Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/AU.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "300px",
                opacity: 0.1
              }}
            ></div>

            {/* ✅ Chat Content */}
            <div className="relative z-10">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm ${m.role === "user"
                      ? "bg-white border-blue-100 text-blue-500"
                      : "bg-blue-600 border-blue-400 text-white"
                      }`}
                  >
                    {m.role === "user" ? (
                      <FaUserAlt size={14} />
                    ) : (
                      <FaRobot size={16} />
                    )}
                  </div>

                  <div
                    className={`max-w-[78%] px-5 py-3.5 rounded-[22px] text-[14.5px] leading-relaxed shadow-sm ${m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 rounded-tl-none border border-gray-100"
                      }`}
                  >
                    {m.role === "bot" && m.isNew ? (
                      <Typewriter text={m.text} />
                    ) : (
                      m.text
                    )}

                    {/* Call + Visit Site */}
                    {m.role === "bot" && m.showCall && (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-between shadow-sm">

                        {/* Left Section */}
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-semibold text-slate-700">
                            Need help?
                          </span>
                          <span className="text-xs text-gray-400">
                            Please contact or visit our official site
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">

                          {/* Visit Site */}
                          <a
                            href="https://adamasuniversity.ac.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 px-4 flex items-center gap-2 text-sm rounded-lg bg-blue-50 border border-gray-100 text-slate-600 hover:bg-blue-200 transition"
                          >
                            🌐
                          </a>

                          {/* Call */}
                          <a
                            href="tel:+919339244265"
                            className="h-9 px-4 flex items-center gap-2 text-sm rounded-lg bg-green-200 text-white hover:bg-green-300 transition shadow-sm"
                          >
                            📞
                          </a>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Listening Animation */}
              {listening && (
                <div className="flex justify-center py-4">
                  <div className="flex gap-1.5 items-center h-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-blue-500 rounded-full animate-bounce"
                        style={{
                          height: `${20 + Math.random() * 80}%`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white shrink-0 border-t border-gray-100">
            <div className="flex items-center gap-3 bg-[#F1F4F9] rounded-2xl px-4 py-3 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
              <button className="text-gray-400 hover:text-blue-500 transition-colors"><FaPlus size={16} /></button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(text)}
                placeholder={listening ? "Listening..." : "Type your message..."}
                className="flex-1 bg-transparent outline-none text-[15px] text-slate-700 placeholder:text-gray-400"
              />
              <button onClick={() => setSpeakerOn(!speakerOn)} className={`transition-all ${speakerOn ? "text-blue-500 scale-110" : "text-gray-300"}`}>
                {speakerOn ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
              </button>
              {voiceMode ? (
                <button onClick={startVoice} disabled={listening} className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center relative shadow-lg shadow-blue-200">
                  <FaMicrophone size={16} />
                  {listening && <span className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ping"></span>}
                </button>
              ) : (
                <button onClick={() => text ? send(text) : setVoiceMode(true)} className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  {text ? <IoSend size={18} /> : <FaMicrophone size={16} />}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>
        {`
    .scrollbar-hide::-webkit-scrollbar { 
      display: none; 
    }
    .scrollbar-hide { 
      -ms-overflow-style: none; 
      scrollbar-width: none; 
    }

    .chat-reveal {
      /* Animation starts from the bottom-right button position */
      clip-path: circle(0% at 90% 90%);
      transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
    }

    .chat-reveal.open {
      clip-path: circle(150% at 90% 90%);
      pointer-events: auto;
    }

    .chat-reveal.closed {
      clip-path: circle(0% at 90% 90%);
      pointer-events: none;
    }
  `}
      </style>
    </div>
  );
}