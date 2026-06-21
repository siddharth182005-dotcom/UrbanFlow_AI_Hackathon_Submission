"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Mic, MicOff, Volume2, VolumeX, Minimize2, Maximize2, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "assistant", text: "UrbanFlow AI Copilot online. System integrated with Astram live feed. How can I assist you with traffic management?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition error", e);
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Strip markdown for speech
    const plainText = text.replace(/[*#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.05; // slightly faster, robotic tactical feel
    utterance.pitch = 0.9; 
    
    // Try to find a good voice (preferably English/UK or robotic)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Samantha')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: "user", text: input.trim() };
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
        setMessages(prev => [...prev, { role: "assistant", text: "Error connecting to UrbanFlow AI mainframe: " + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
        speakText(data.text);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "System connection failure. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-blue-400/50 transition-colors flex items-center justify-center group"
          >
            <Bot size={28} className="group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-6 right-6 z-50 glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col glow-border-blue ${
              isExpanded ? 'w-[600px] h-[80vh]' : 'w-[400px] h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-slate-900/90 border-b border-slate-700 p-3 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <Bot className="text-blue-500 animate-pulse" size={20} />
                <h3 className="font-bold text-white text-sm tracking-wide">URBANFLOW COPILOT</h3>
                <span className="flex items-center text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded ml-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-ping"></div> Online
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button suppressHydrationWarning onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button suppressHydrationWarning onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white transition-colors">
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button suppressHydrationWarning onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/40">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-2 shrink-0">
                      <Bot size={16} className="text-blue-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-none backdrop-blur-md'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-2 shrink-0">
                    <Bot size={16} className="text-blue-400" />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-bl-none p-3 backdrop-blur-md flex items-center space-x-2">
                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                    <span className="text-slate-400 text-xs tracking-wide">ANALYZING GRID...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-700 bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
                <button 
                  type="button"
                  suppressHydrationWarning
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input 
                  type="text"
                  suppressHydrationWarning
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask UrbanFlow AI..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  type="button"
                  onClick={handleSend}
                  suppressHydrationWarning
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
