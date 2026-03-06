import Dashboard from "./components/Dashboard";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Dashboard />
      <ChatWidget />
    </div>
  );
}