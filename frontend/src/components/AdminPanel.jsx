import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaPlus, FaExclamationTriangle, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

export default function AdminPanel({ isLoggedIn, setLoggedIn, goBack }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [data, setData] = useState({ instruction: "", input: "", output: "" });

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [shake, setShake] = useState(false);

  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "adamas123") {
      setLoggedIn(true);
      showToast("Welcome back, Admin!", "success");
    } else {
      setShake(true);
      showToast("Invalid username or password", "error");
      setTimeout(() => setShake(false), 500); // Reset shake animation
    }
  };

  const handleSave = () => {
    if (!data.instruction || !data.input || !data.output) {
      showToast("Please fill all fields before saving", "error");
      return;
    }
    console.log("Saving Data:", data);
    showToast("Knowledge Base Updated!", "success");
    // Optional: Clear form after save
    // setData({ instruction: "", input: "", output: "" });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-50 relative overflow-hidden">
        {/* Toast Notification */}
        {toast.show && <Toast message={toast.message} type={toast.type} />}

        <button onClick={goBack} className="absolute top-6 left-6 text-blue-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm font-medium">
          <FaChevronLeft /> Back to Chat
        </button>

        <div className={`w-full max-w-sm transition-transform ${shake ? "animate-shake" : ""}`}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <FaShieldAlt size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Admin Access</h2>
          <p className="text-center text-slate-500 text-sm mb-8">Secure entry for system configuration</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200">
              Identify
            </button>
          </form>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-8px); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 overflow-y-auto relative">
      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="flex items-center justify-between mb-8">
        <button onClick={goBack} className="text-blue-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm font-semibold">
          <FaChevronLeft /> Back to Chat
        </button>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Authorized</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Knowledge Base</h2>
        <p className="text-sm text-slate-500">Train your AI with custom instructions and QA pairs.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">System Instruction</label>
            <textarea
              placeholder="e.g. When does the admission process start?"
              className="w-full mt-2 p-4 rounded-xl border border-gray-300 bg-slate-50 min-h-[80px] outline-none focus:bg-white focus:ring-2 ring-blue-500/10 focus:border-blue-500 text-sm transition-all"
              onChange={(e) => setData({ ...data, instruction: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700uppercase tracking-widest ml-1">Input</label>
              <textarea
                type="text" placeholder="New session admission timeline"
                className="w-full mt-2 p-4 rounded-xl border border-gray-300 bg-slate-50 min-h-[80px] outline-none focus:bg-white focus:ring-2 ring-blue-500/10 focus:border-blue-500 text-sm transition-all"
                onChange={(e) => setData({ ...data, input: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Output (Response)</label>
              <textarea
                placeholder="The admissions process..."
                className="w-full mt-2 p-2 rounded-xl border border-gray-300 bg-slate-50 min-h-[80px] outline-none focus:bg-white focus:ring-2 ring-blue-500/10 focus:border-blue-500 text-sm transition-all"
                onChange={(e) => setData({ ...data, output: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600/10 backdrop-blur-md border border-blue-600/20 text-blue-600 py-2 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm active:scale-[0.97]"
        >
          <FaPlus size={14} className="opacity-80" />
          <span className="tracking-tight">Add Knowledge</span>
        </button>
      </div>
    </div>
  );
}

// Internal Toast Component
function Toast({ message, type }) {
  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl transition-all animate-slide-down ${type === "success" ? "bg-slate-900 text-white" : "bg-red-500 text-white"
      }`}>
      {type === "success" ? <FaCheckCircle className="text-green-400" /> : <FaExclamationTriangle />}
      <span className="text-sm font-bold tracking-tight">{message}</span>
      <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}