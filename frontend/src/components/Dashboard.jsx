import { useState } from "react";
import ChatWidget from "./ChatWidget"; 
import { FaRobot } from "react-icons/fa";

export default function MobileViewContainer() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex justify-center items-center font-sans">
      <div className="relative w-full h-screen md:max-w-[450px] md:h-[92vh] md:rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 bg-slate-900">
        
        {/* Dashboard Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/dashboard.png')` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Floating Launcher Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={`absolute bottom-8 right-8 z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 animate-modern-float ${
            isChatOpen ? "opacity-0 scale-0 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <FaRobot size={26} />
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
        </button>

        {/* Chatbot Component with Reveal Animation */}
        <ChatWidget isOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} />

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-modern-float {
          animation: float 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}