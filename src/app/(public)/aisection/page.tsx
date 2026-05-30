'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiVolume2, FiVolumeX, FiMenu } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AIChatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAIToast, setShowAIToast] = useState(true);
  const [isToastMinimized, setIsToastMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hello! 🌱 I'm AgriPoa AI Assistant. I can help you with:\n\n• Crop disease diagnosis\n• Pest control methods\n• Organic farming tips\n• Fertilizer recommendations\n• Weather & irrigation advice\n\nWhat would you like to know?",
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const quickQuestions = [
    "How to control Fall Armyworm?",
    "Tomato late blight treatment",
    "Organic fertilizer recipe",
    "Maize spacing recommendations",
    "Drip irrigation setup",
    "Post-harvest storage tips",
  ];

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");

    setTimeout(() => {
      setShowAIToast(true);
    }, 1000);

    const handleOpenChat = () => {
      setIsChatOpen(true);
      setShowAIToast(false);
    };

    window.addEventListener('openAIChat', handleOpenChat);
    return () => window.removeEventListener('openAIChat', handleOpenChat);
  }, []);

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Sound play failed:", e));
    }
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    const responses: { [key: string]: string } = {
      "maize disease": "🌽 **Common Maize Diseases & Solutions:**\n\n1️⃣ **Maize Lethal Necrosis (MLN)**\n• Symptoms: Rapid wilting, yellowing\n• Solution: Use certified MLN-resistant seeds\n\n2️⃣ **Gray Leaf Spot**\n• Symptoms: Gray lesions on leaves\n• Solution: Apply fungicides, crop rotation\n\n3️⃣ **Rust**\n• Symptoms: Orange/brown pustules\n• Solution: Plant resistant varieties",
      "tomato disease": "🍅 **Common Tomato Diseases:**\n\n**Late Blight**\n• Dark spots on leaves with white fuzz\n• Solution: Copper-based fungicides\n\n**Early Blight**\n• Target-like spots on lower leaves\n• Solution: Remove affected leaves, apply fungicides",
      "pest control": "🐛 **Integrated Pest Management (IPM) Guide:**\n\n**Natural Methods:**\n• Neem oil spray (10ml/L water)\n• Garlic-chili solution\n• Marigold companion planting\n\n**Biological Control:**\n• Ladybugs for aphids\n• Trichogramma wasps for caterpillars",
      "organic farming": "🌱 **Organic Farming Best Practices:**\n\n**Soil Health:**\n• Use compost and well-rotted manure\n• Practice green manuring\n• Implement crop rotation\n• Use cover crops (legumes)",
      fertilizer: "📊 **Fertilizer Guide:**\n\n**NPK Recommendations:**\n\n🌽 **Maize:**\n• Starter: 50kg/ha DAP\n• Top dress: 100kg/ha CAN\n\n🍅 **Tomatoes:**\n• Pre-plant: 40kg/ha NPK 15:15:15\n• Side dress: 100kg/ha CAN",
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! 👋 I'm your AI farming assistant. How can I help you today?";
    }

    return "🌱 **How can I help you today?**\n\nI can provide information on:\n\n✅ Crop diseases & treatment\n✅ Pest identification & control\n✅ Organic farming methods\n✅ Fertilizer application rates\n✅ Irrigation techniques\n✅ Harvesting & storage\n✅ Soil health management";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    const userMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);
    playSound();

    setTimeout(async () => {
      const response = await getAIResponse(userMessage);
      setChatMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
      playSound();
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {showAIToast && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsToastMinimized(!isToastMinimized)}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <FiMessageCircle className="text-green-600" size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="font-bold">AgriPoa AI Assistant</h4>
                    <p className="text-xs opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setShowQuickMenu(!showQuickMenu); playSound(); }} className="hover:bg-white/20 p-1 rounded transition-colors">
                    <FiMenu size={18} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setShowAIToast(false); }} className="hover:bg-white/20 p-1 rounded transition-colors">
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showQuickMenu && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/20">
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-semibold text-yellow-300 mb-2">QUICK ACTIONS</p>
                      {[
                        { icon: "🌾", label: "Diagnose Crop Disease", action: "I need help diagnosing a crop disease" },
                        { icon: "🐛", label: "Identify Pest", action: "Help me identify a pest" },
                        { icon: "🌱", label: "Fertilizer Calculator", action: "How much fertilizer should I use?" },
                      ].map((item, idx) => (
                        <button key={idx} onClick={() => { setInputMessage(item.action); setIsChatOpen(true); setShowAIToast(false); setTimeout(() => handleSendMessage(), 500); playSound(); }} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg transition-colors text-sm">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-white/20 p-3 flex justify-between items-center">
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="flex items-center gap-2 text-sm hover:bg-white/20 px-2 py-1 rounded transition-colors">
                  {soundEnabled ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
                  <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
                </button>
                <button onClick={() => { setIsChatOpen(true); setShowAIToast(false); playSound(); }} className="bg-yellow-400 text-green-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors">
                  Open Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsChatOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="text-green-600" size={20} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="font-bold">AgriPoa AI Assistant</h3>
                    <p className="text-xs opacity-90">Online • AI-Powered</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:bg-white/20 p-1 rounded transition-colors">
                    {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
                  </button>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.isUser ? "bg-green-600 text-white" : "bg-white text-gray-900 shadow-md"}`}>
                      <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white shadow-md p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickQuestions.map((q) => (
                    <button key={q} onClick={() => { setInputMessage(q); setTimeout(() => handleSendMessage(), 100); }} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-green-600 hover:text-white transition-colors whitespace-nowrap">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask me about farming, diseases, pests..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isChatOpen && !showAIToast && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} onClick={() => { setIsChatOpen(true); playSound(); }} className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all">
          <FiMessageCircle size={28} />
        </motion.button>
      )}
    </>
  );
}