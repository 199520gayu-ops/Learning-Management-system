import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Loader2, Bot } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there 👋 I'm Learnify AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    const userText = input;
    setInput("");
    setIsTyping(true);

    try {
      // ✅ Calls your Gemini-powered Express backend
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.reply || "Server error");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);

    } catch (error) {
      console.error("Chatbot Error:", error.message);
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble right now. Please try again in a moment."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border flex flex-col overflow-hidden"
          >

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Learnify AI</h3>
                <p className="text-xs opacity-80">Usually replies in seconds</p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap
                      ${m.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border rounded-bl-sm text-slate-700"
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex">
                  <div className="bg-white border p-3 rounded-2xl rounded-bl-sm flex gap-2 items-center shadow-sm">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-xs text-gray-400">Learnify AI is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex bg-slate-100 rounded-xl px-3 items-center gap-2">
                <input
                  className="flex-grow py-3 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="text-blue-600 hover:text-blue-700 disabled:opacity-30 transition"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-300 mt-2">Powered by Gemini AI</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}