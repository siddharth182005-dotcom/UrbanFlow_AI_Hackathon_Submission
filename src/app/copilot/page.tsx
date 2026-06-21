"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function CopilotPage() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "assistant", text: "UrbanFlow AI Copilot online. How can I assist with traffic management today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", text: "Error connecting to AI: " + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-white">AI Traffic Copilot (Gemini Powered)</h2>
        </div>
        <div className="flex space-x-2">
          <span className="flex items-center text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
            <ShieldCheck size={14} className="mr-1" /> Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl p-4 rounded-xl shadow-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none prose prose-invert prose-sm max-w-none'
            }`}>
              {msg.role === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl rounded-bl-none p-4 shadow-lg flex items-center space-x-2">
              <Loader2 className="animate-spin text-blue-500" size={18} />
              <span className="text-sm">Processing tactical request...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-2 focus-within:border-blue-500 transition-colors">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white px-4"
            placeholder="Ask about traffic patterns, hotspots, or request enforcement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
