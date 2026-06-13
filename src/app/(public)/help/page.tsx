'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FiSend, 
  FiVolume2, 
  FiVolumeX, 
  FiHome,
  FiMessageCircle,
  FiZap,
  FiTrendingUp,
  FiShield,
  FiCloud,
  FiUsers,
  FiAward,
  FiChevronRight,
  FiArrowLeft,
  FiCopy,
  FiCheck,
  FiMoreVertical,
  FiTrash2,
  FiDownload
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Groq from 'groq-sdk';

export default function HelpPage() {
    
  const [chatMessages, setChatMessages] = useState<Array<{ 
    text: string; 
    isUser: boolean; 
    timestamp: Date;
    isTyping?: boolean;
  }>>([
    {
      text: "Hello! 🌱 I'm AgriPoa AI Assistant. I'm here to help you with all your farming questions!",
      isUser: false,
      timestamp: new Date()
    },
    {
      text: "I can assist you with:\n\n🌾 **Crop Diseases** - Identify and treat crop diseases\n🐛 **Pest Control** - Natural and organic pest solutions\n🌱 **Organic Farming** - Best practices and techniques\n💧 **Irrigation** - Water management advice\n📊 **Fertilizers** - NPK recommendations\n🌦️ **Weather** - Weather-based farming tips\n📦 **Storage** - Post-harvest storage guidelines",
      isUser: false,
      timestamp: new Date()
    },
    {
      text: "What would you like to know today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Groq AI (WORKING)
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const quickQuestions = [
    "How to control Fall Armyworm?",
    "Tomato late blight treatment",
    "Organic fertilizer recipe",
    "Maize spacing recommendations",
    "Drip irrigation setup",
    "Post-harvest storage tips",
    "Identify crop disease from image",
    "Best planting season for maize",
  ];

  const categories = [
    { icon: FiZap, name: "Crop Diseases", color: "from-yellow-500 to-orange-500", prompt: "Help me identify a crop disease. What are the common symptoms?" },
    { icon: FiShield, name: "Pest Control", color: "from-red-500 to-pink-500", prompt: "How to control pests organically? Give me natural solutions." },
    { icon: FiTrendingUp, name: "Fertilizers", color: "from-green-500 to-green-600", prompt: "What fertilizer should I use for different crops? Give NPK recommendations." },
    { icon: FiCloud, name: "Irrigation", color: "from-blue-500 to-cyan-500", prompt: "Best irrigation practices for small-scale farmers in Kenya." },
    { icon: FiUsers, name: "Organic Farming", color: "from-purple-500 to-indigo-500", prompt: "Organic farming techniques for Kenyan farmers." },
    { icon: FiAward, name: "Harvesting", color: "from-green-600 to-green-700", prompt: "When and how to harvest different crops for best yields?" },
  ];

  useEffect(() => {
    // Create dummy audio to prevent 404 errors
    if (typeof window !== 'undefined') {
      audioRef.current = {
        play: () => Promise.resolve(),
        currentTime: 0,
        pause: () => {},
        volume: 1
      } as HTMLAudioElement;
    }
    inputRef.current?.focus();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAITyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      // Silent - no sound needed
    }
  };

  // Typing effect for bot responses
  const typeMessage = async (fullText: string, index: number) => {
    const characters = fullText.split('');
    let currentText = '';
    
    for (let i = 0; i < characters.length; i++) {
      currentText += characters[i];
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], text: currentText, isTyping: true };
        }
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, 10)); // Typing speed
    }
    
    setChatMessages(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], isTyping: false };
      }
      return updated;
    });
  };

  // REAL AI RESPONSE using Groq (WORKING)
  const getAIResponse = async (message: string): Promise<string> => {
    try {
      if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
        return "⚠️ **API Key Missing**\n\nPlease add your Groq API key to .env.local file.\n\n**Get a free key:**\n1. Go to https://console.groq.com/\n2. Sign up for free\n3. Create an API key\n4. Add to .env.local: NEXT_PUBLIC_GROQ_API_KEY=your_key\n5. Restart the development server";
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are AgriPoa, an expert agricultural AI assistant for Kenyan farmers. 
            Provide practical, actionable advice about farming in Kenya. Be concise but informative.
            
            Important guidelines:
            - Focus on solutions relevant to Kenyan climate and conditions
            - Suggest affordable, locally available solutions
            - Include organic options when possible
            - Be practical and actionable
            - Use simple language farmers can understand
            - Keep responses under 200 words
            - Use bullet points and emojis for better readability
            - If asked about disease diagnosis, ask for specific symptoms
            - If asked about pests, provide identification tips and control methods`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 600,
      });

      const response = completion.choices[0]?.message?.content;
      return response || "I couldn't generate a response. Please try again.";
      
    } catch (error: any) {
      console.error("AI Error:", error);
      
      if (error.message?.includes("API key") || error.message?.includes("403")) {
        return "🔑 **API Key Error**\n\nYour Groq API key is invalid or missing.\n\n**Quick fix:**\n1. Get free key from: https://console.groq.com/\n2. Add to .env.local file:\n   `NEXT_PUBLIC_GROQ_API_KEY=your_key`\n3. Restart the dev server with `npm run dev`";
      }
      
      if (error.message?.includes("quota") || error.message?.includes("429")) {
        return "📊 **Rate Limit**\n\nGroq free tier: 30 requests per minute.\n\nPlease wait a moment and try again.";
      }
      
      if (error.message?.includes("network") || error.message?.includes("fetch")) {
        return "🌐 **Connection Error**\n\nUnable to reach the AI service.\n\nPlease check your internet connection and try again.";
      }
      
      return "🌱 **I'm having trouble connecting right now.**\n\nPlease try again in a few moments. If the problem persists, check your internet connection and Groq API key.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessageText = inputMessage;
    const userTimestamp = new Date();
    
    // Add user message
    setChatMessages((prev) => [...prev, { 
      text: userMessageText, 
      isUser: true,
      timestamp: userTimestamp
    }]);
    
    setInputMessage("");
    setIsAITyping(true);
    playSound();

    // Get AI response from Groq
    try {
      const response = await getAIResponse(userMessageText);
      
      // Add a temporary typing message
      const tempIndex = chatMessages.length + 1;
      setChatMessages((prev) => [...prev, { 
        text: "", 
        isUser: false,
        timestamp: new Date(),
        isTyping: true
      }]);
      
      // Start typing effect
      setTimeout(() => {
        typeMessage(response, tempIndex);
        setIsAITyping(false);
        playSound();
      }, 500);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChatMessages((prev) => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        isUser: false,
        timestamp: new Date()
      }]);
      setIsAITyping(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deleteMessage = (index: number) => {
    setChatMessages(prev => prev.filter((_, i) => i !== index));
    toast.success("Message deleted");
    setShowMenu(null);
  };

  const clearChat = () => {
    setChatMessages([
      {
        text: "Hello! 🌱 I'm AgriPoa AI Assistant. I'm here to help you with all your farming questions!",
        isUser: false,
        timestamp: new Date()
      },
      {
        text: "I can assist you with:\n\n🌾 **Crop Diseases** - Identify and treat crop diseases\n🐛 **Pest Control** - Natural and organic pest solutions\n🌱 **Organic Farming** - Best practices and techniques\n💧 **Irrigation** - Water management advice\n📊 **Fertilizers** - NPK recommendations\n🌦️ **Weather** - Weather-based farming tips\n📦 **Storage** - Post-harvest storage guidelines",
        isUser: false,
        timestamp: new Date()
      },
      {
        text: "What would you like to know today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    toast.success("Chat cleared!");
  };

  const formatMessage = (text: string) => {
    if (!text) return '';
    let formattedText = text;
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-green-700">$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br />');
    formattedText = formattedText.replace(/•/g, '<span class="text-green-600 mr-2">•</span>');
    return formattedText;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex-shrink-0 sticky top-0 z-10">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition-colors">
                <FiArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="text-green-600 sm:w-5 sm:h-5" size={16}  />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold">AgriPoa AI</h1>
                  <p className="text-[10px] sm:text-xs opacity-90 hidden xs:block">Online • Ready to help 24/7</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/20 p-1.5 sm:p-2 rounded-lg hover:bg-white/30 transition-colors"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <FiVolume2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <FiVolumeX size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
              <button
                onClick={clearChat}
                className="bg-white/20 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-white/30 transition-colors text-xs sm:text-sm font-semibold"
              >
                Clear
              </button>
              <Link
                href="/"
                className="bg-yellow-400 text-green-600 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold"
              >
                <FiHome size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Exit</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-72 xl:w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-6">
            {/* Categories */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiZap className="text-green-600" />
                Quick Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(category.prompt);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`bg-gradient-to-r ${category.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <category.icon className="text-white" size={14} />
                    </div>
                    <span className="flex-1 text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </span>
                    <FiChevronRight className="text-gray-400 group-hover:text-green-600" size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Questions */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Popular Questions</h2>
              <div className="space-y-1">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-2 text-sm">💡 Pro Tip</h3>
              <p className="text-green-700 text-xs">
                Be specific with your questions. Include crop type and symptoms for better advice!
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Mobile Categories Bar */}
          <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
            <div className="flex gap-2 p-2 sm:p-3">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(category.prompt);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gray-100 rounded-full text-xs sm:text-sm whitespace-nowrap hover:bg-green-100 transition-colors"
                >
                  <category.icon size={12} className="sm:w-4 sm:h-4 text-green-600" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
          >
            <AnimatePresence>
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: msg.isUser ? 100 : -100 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"} group`}
                >
                  <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%] ${msg.isUser ? "order-2" : "order-1"}`}>
                    {/* Avatar for bot */}
                    {!msg.isUser && (
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 ml-0 sm:ml-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                          <FiMessageCircle className="text-white" size={10}  />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-green-600">AgriPoa AI</span>
                        <span className="text-[9px] sm:text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div
                      className={`relative p-2.5 sm:p-3 rounded-2xl ${
                        msg.isUser
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "bg-white text-gray-900 shadow-md"
                      } ${msg.isTyping ? "min-w-[60px] sm:min-w-[80px]" : ""}`}
                    >
                      {msg.isTyping && !msg.text ? (
                        <div className="flex gap-1 py-1 sm:py-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                      ) : (
                        <>
                          <div 
                            className="text-xs sm:text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                          />
                          {msg.isUser && (
                            <div className="text-[10px] sm:text-xs text-right mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Actions for bot messages */}
                    {!msg.isUser && msg.text && !msg.isTyping && (
                      <div className="flex items-center gap-2 mt-1 ml-1 sm:ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="text-gray-400 hover:text-green-600 transition-colors p-0.5"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? <FiCheck size={11} className="sm:w-3 sm:h-3" /> : <FiCopy size={11} className="sm:w-3 sm:h-3" />}
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === idx ? null : idx)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                            title="Delete"
                          >
                            <FiTrash2 size={11} className="sm:w-3 sm:h-3" />
                          </button>
                          {showMenu === idx && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10">
                              <button
                                onClick={() => deleteMessage(idx)}
                                className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                              >
                                Delete message
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* AI Typing Indicator */}
            {isAITyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="text-white" size={10} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-green-600">AgriPoa AI</span>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Row - Mobile */}
          <div className="lg:hidden bg-white border-t border-gray-200 p-2 sm:p-3 overflow-x-auto flex-shrink-0">
            <div className="flex gap-1.5 sm:gap-2">
              {quickQuestions.slice(0, 4).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 rounded-full text-[10px] sm:text-xs whitespace-nowrap hover:bg-green-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
            <div className="flex gap-2 sm:gap-3 max-w-5xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me about farming, diseases, pests..."
                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-1.5 sm:gap-2"
              >
                <FiSend size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline text-sm">Send</span>
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 sm:mt-3">
              Powered by Groq AI • Responses are for informational purposes only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { 
//   FiSend, 
//   FiVolume2, 
//   FiVolumeX, 
//   FiHome,
//   FiMessageCircle,
//   FiZap,
//   FiTrendingUp,
//   FiShield,
//   FiCloud,
//   FiUsers,
//   FiAward,
//   FiChevronRight,
//   FiArrowLeft,
//   FiCopy,
//   FiCheck,
//   FiMoreVertical,
//   FiTrash2,
//   FiDownload
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import Groq from 'groq-sdk';

// export default function HelpPage() {
    
//   const [chatMessages, setChatMessages] = useState<Array<{ 
//     text: string; 
//     isUser: boolean; 
//     timestamp: Date;
//     isTyping?: boolean;
//   }>>([
//     {
//       text: "Hello! 🌱 I'm AgriPoa AI Assistant. I'm here to help you with all your farming questions!",
//       isUser: false,
//       timestamp: new Date()
//     },
//     {
//       text: "I can assist you with:\n\n🌾 **Crop Diseases** - Identify and treat crop diseases\n🐛 **Pest Control** - Natural and organic pest solutions\n🌱 **Organic Farming** - Best practices and techniques\n💧 **Irrigation** - Water management advice\n📊 **Fertilizers** - NPK recommendations\n🌦️ **Weather** - Weather-based farming tips\n📦 **Storage** - Post-harvest storage guidelines",
//       isUser: false,
//       timestamp: new Date()
//     },
//     {
//       text: "What would you like to know today?",
//       isUser: false,
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isAITyping, setIsAITyping] = useState(false);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//   const [showMenu, setShowMenu] = useState<number | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Initialize Groq AI (WORKING)
//   const groq = new Groq({
//     apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
//     dangerouslyAllowBrowser: true
//   });

//   const quickQuestions = [
//     "How to control Fall Armyworm?",
//     "Tomato late blight treatment",
//     "Organic fertilizer recipe",
//     "Maize spacing recommendations",
//     "Drip irrigation setup",
//     "Post-harvest storage tips",
//     "Identify crop disease from image",
//     "Best planting season for maize",
//   ];

//   const categories = [
//     { icon: FiZap, name: "Crop Diseases", color: "from-yellow-500 to-orange-500", prompt: "Help me identify a crop disease. What are the common symptoms?" },
//     { icon: FiShield, name: "Pest Control", color: "from-red-500 to-pink-500", prompt: "How to control pests organically? Give me natural solutions." },
//     { icon: FiTrendingUp, name: "Fertilizers", color: "from-green-500 to-green-600", prompt: "What fertilizer should I use for different crops? Give NPK recommendations." },
//     { icon: FiCloud, name: "Irrigation", color: "from-blue-500 to-cyan-500", prompt: "Best irrigation practices for small-scale farmers in Kenya." },
//     { icon: FiUsers, name: "Organic Farming", color: "from-purple-500 to-indigo-500", prompt: "Organic farming techniques for Kenyan farmers." },
//     { icon: FiAward, name: "Harvesting", color: "from-green-600 to-green-700", prompt: "When and how to harvest different crops for best yields?" },
//   ];

//   useEffect(() => {
//     // Create dummy audio to prevent 404 errors
//     if (typeof window !== 'undefined') {
//       audioRef.current = {
//         play: () => Promise.resolve(),
//         currentTime: 0,
//         pause: () => {},
//         volume: 1
//       } as HTMLAudioElement;
//     }
//     inputRef.current?.focus();
//     scrollToBottom();
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatMessages, isAITyping]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const playSound = () => {
//     if (soundEnabled && audioRef.current) {
//       // Silent - no sound needed
//     }
//   };

//   // Typing effect for bot responses
//   const typeMessage = async (fullText: string, index: number) => {
//     const characters = fullText.split('');
//     let currentText = '';
    
//     for (let i = 0; i < characters.length; i++) {
//       currentText += characters[i];
//       setChatMessages(prev => {
//         const updated = [...prev];
//         if (updated[index]) {
//           updated[index] = { ...updated[index], text: currentText, isTyping: true };
//         }
//         return updated;
//       });
//       await new Promise(resolve => setTimeout(resolve, 10)); // Typing speed
//     }
    
//     setChatMessages(prev => {
//       const updated = [...prev];
//       if (updated[index]) {
//         updated[index] = { ...updated[index], isTyping: false };
//       }
//       return updated;
//     });
//   };

//   // REAL AI RESPONSE using Groq (WORKING)
//   const getAIResponse = async (message: string): Promise<string> => {
//     try {
//       if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
//         return "⚠️ **API Key Missing**\n\nPlease add your Groq API key to .env.local file.\n\n**Get a free key:**\n1. Go to https://console.groq.com/\n2. Sign up for free\n3. Create an API key\n4. Add to .env.local: NEXT_PUBLIC_GROQ_API_KEY=your_key\n5. Restart the development server";
//       }

//       const completion = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content: `You are AgriPoa, an expert agricultural AI assistant for Kenyan farmers. 
//             Provide practical, actionable advice about farming in Kenya. Be concise but informative.
            
//             Important guidelines:
//             - Focus on solutions relevant to Kenyan climate and conditions
//             - Suggest affordable, locally available solutions
//             - Include organic options when possible
//             - Be practical and actionable
//             - Use simple language farmers can understand
//             - Keep responses under 200 words
//             - Use bullet points and emojis for better readability
//             - If asked about disease diagnosis, ask for specific symptoms
//             - If asked about pests, provide identification tips and control methods`
//           },
//           {
//             role: "user",
//             content: message
//           }
//         ],
//         model: "llama-3.3-70b-versatile",
//         temperature: 0.7,
//         max_tokens: 600,
//       });

//       const response = completion.choices[0]?.message?.content;
//       return response || "I couldn't generate a response. Please try again.";
      
//     } catch (error: any) {
//       console.error("AI Error:", error);
      
//       if (error.message?.includes("API key") || error.message?.includes("403")) {
//         return "🔑 **API Key Error**\n\nYour Groq API key is invalid or missing.\n\n**Quick fix:**\n1. Get free key from: https://console.groq.com/\n2. Add to .env.local file:\n   `NEXT_PUBLIC_GROQ_API_KEY=your_key`\n3. Restart the dev server with `npm run dev`";
//       }
      
//       if (error.message?.includes("quota") || error.message?.includes("429")) {
//         return "📊 **Rate Limit**\n\nGroq free tier: 30 requests per minute.\n\nPlease wait a moment and try again.";
//       }
      
//       if (error.message?.includes("network") || error.message?.includes("fetch")) {
//         return "🌐 **Connection Error**\n\nUnable to reach the AI service.\n\nPlease check your internet connection and try again.";
//       }
      
//       return "🌱 **I'm having trouble connecting right now.**\n\nPlease try again in a few moments. If the problem persists, check your internet connection and Groq API key.";
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessageText = inputMessage;
//     const userTimestamp = new Date();
    
//     // Add user message
//     setChatMessages((prev) => [...prev, { 
//       text: userMessageText, 
//       isUser: true,
//       timestamp: userTimestamp
//     }]);
    
//     setInputMessage("");
//     setIsAITyping(true);
//     playSound();

//     // Get AI response from Groq
//     try {
//       const response = await getAIResponse(userMessageText);
      
//       // Add a temporary typing message
//       const tempIndex = chatMessages.length + 1;
//       setChatMessages((prev) => [...prev, { 
//         text: "", 
//         isUser: false,
//         timestamp: new Date(),
//         isTyping: true
//       }]);
      
//       // Start typing effect
//       setTimeout(() => {
//         typeMessage(response, tempIndex);
//         setIsAITyping(false);
//         playSound();
//       }, 500);
//     } catch (error) {
//       console.error("Error getting AI response:", error);
//       setChatMessages((prev) => [...prev, { 
//         text: "Sorry, I encountered an error. Please try again.", 
//         isUser: false,
//         timestamp: new Date()
//       }]);
//       setIsAITyping(false);
//     }
//   };

//   const copyToClipboard = (text: string, index: number) => {
//     navigator.clipboard.writeText(text);
//     setCopiedIndex(index);
//     toast.success("Copied to clipboard!");
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const deleteMessage = (index: number) => {
//     setChatMessages(prev => prev.filter((_, i) => i !== index));
//     toast.success("Message deleted");
//     setShowMenu(null);
//   };

//   const clearChat = () => {
//     setChatMessages([
//       {
//         text: "Hello! 🌱 I'm AgriPoa AI Assistant. I'm here to help you with all your farming questions!",
//         isUser: false,
//         timestamp: new Date()
//       },
//       {
//         text: "I can assist you with:\n\n🌾 **Crop Diseases** - Identify and treat crop diseases\n🐛 **Pest Control** - Natural and organic pest solutions\n🌱 **Organic Farming** - Best practices and techniques\n💧 **Irrigation** - Water management advice\n📊 **Fertilizers** - NPK recommendations\n🌦️ **Weather** - Weather-based farming tips\n📦 **Storage** - Post-harvest storage guidelines",
//         isUser: false,
//         timestamp: new Date()
//       },
//       {
//         text: "What would you like to know today?",
//         isUser: false,
//         timestamp: new Date()
//       }
//     ]);
//     toast.success("Chat cleared!");
//   };

//   const formatMessage = (text: string) => {
//     if (!text) return '';
//     let formattedText = text;
//     formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-green-700">$1</strong>');
//     formattedText = formattedText.replace(/\n/g, '<br />');
//     formattedText = formattedText.replace(/•/g, '<span class="text-green-600 mr-2">•</span>');
//     return formattedText;
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex-shrink-0">
//         <div className="px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Link href="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
//                 <FiArrowLeft size={20} />
//               </Link>
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
//                     <FiMessageCircle className="text-green-600" size={20} />
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
//                 </div>
//                 <div>
//                   <h1 className="font-bold">AgriPoa AI Assistant</h1>
//                   <p className="text-xs opacity-90">Online • Ready to help 24/7</p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setSoundEnabled(!soundEnabled)}
//                 className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//                 title={soundEnabled ? "Mute" : "Unmute"}
//               >
//                 {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
//               </button>
//               <button
//                 onClick={clearChat}
//                 className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm font-semibold"
//               >
//                 Clear
//               </button>
//               <Link
//                 href="/"
//                 className="bg-yellow-400 text-green-600 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2 text-sm font-semibold"
//               >
//                 <FiHome size={16} /> Exit
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         {/* Sidebar - Hidden on mobile, visible on desktop */}
//         <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
//           <div className="p-4 space-y-6">
//             {/* Categories */}
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                 <FiZap className="text-green-600" />
//                 Quick Categories
//               </h2>
//               <div className="space-y-2">
//                 {categories.map((category, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => {
//                       setInputMessage(category.prompt);
//                       setTimeout(() => handleSendMessage(), 100);
//                     }}
//                     className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
//                   >
//                     <div className={`bg-gradient-to-r ${category.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
//                       <category.icon className="text-white" size={14} />
//                     </div>
//                     <span className="flex-1 text-sm text-gray-700 group-hover:text-green-600 transition-colors">
//                       {category.name}
//                     </span>
//                     <FiChevronRight className="text-gray-400 group-hover:text-green-600" size={14} />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Questions */}
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 mb-3">Popular Questions</h2>
//               <div className="space-y-1">
//                 {quickQuestions.map((question, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => {
//                       setInputMessage(question);
//                       setTimeout(() => handleSendMessage(), 100);
//                     }}
//                     className="w-full text-left px-3 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors text-sm"
//                   >
//                     {question}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tips */}
//             <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
//               <h3 className="font-bold text-green-800 mb-2 text-sm">💡 Pro Tip</h3>
//               <p className="text-green-700 text-xs">
//                 Be specific with your questions. Include crop type and symptoms for better advice!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Categories Bar */}
//         <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
//           <div className="flex gap-2 p-3">
//             {categories.map((category, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   setInputMessage(category.prompt);
//                   setTimeout(() => handleSendMessage(), 100);
//                 }}
//                 className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap hover:bg-green-100 transition-colors"
//               >
//                 <category.icon size={14} className="text-green-600" />
//                 <span>{category.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area - Full height */}
//         <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
//           {/* Chat Messages */}
//           <div 
//             ref={chatContainerRef}
//             className="flex-1 overflow-y-auto p-4 space-y-4"
//           >
//             <AnimatePresence>
//               {chatMessages.map((msg, idx) => (
//                 <motion.div
//                   key={idx}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: msg.isUser ? 100 : -100 }}
//                   transition={{ duration: 0.3 }}
//                   className={`flex ${msg.isUser ? "justify-end" : "justify-start"} group`}
//                 >
//                   <div className={`max-w-[85%] lg:max-w-[70%] ${msg.isUser ? "order-2" : "order-1"}`}>
//                     {/* Avatar for bot */}
//                     {!msg.isUser && (
//                       <div className="flex items-center gap-2 mb-1">
//                         <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
//                           <FiMessageCircle className="text-white" size={12} />
//                         </div>
//                         <span className="text-xs font-semibold text-green-600">AgriPoa AI</span>
//                         <span className="text-xs text-gray-400">
//                           {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>
//                     )}
                    
//                     {/* Message Bubble */}
//                     <div
//                       className={`relative p-3 rounded-2xl ${
//                         msg.isUser
//                           ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
//                           : "bg-white text-gray-900 shadow-md"
//                       } ${msg.isTyping ? "min-w-[80px]" : ""}`}
//                     >
//                       {msg.isTyping && !msg.text ? (
//                         <div className="flex gap-1 py-2">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
//                         </div>
//                       ) : (
//                         <>
//                           <div 
//                             className="text-sm leading-relaxed"
//                             dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
//                           />
//                           {msg.isUser && (
//                             <div className="text-xs text-right mt-1 opacity-70">
//                               {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
                    
//                     {/* Actions for bot messages */}
//                     {!msg.isUser && msg.text && !msg.isTyping && (
//                       <div className="flex items-center gap-2 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => copyToClipboard(msg.text, idx)}
//                           className="text-gray-400 hover:text-green-600 transition-colors"
//                           title="Copy response"
//                         >
//                           {copiedIndex === idx ? <FiCheck size={12} /> : <FiCopy size={12} />}
//                         </button>
//                         <div className="relative">
//                           <button
//                             onClick={() => setShowMenu(showMenu === idx ? null : idx)}
//                             className="text-gray-400 hover:text-red-600 transition-colors"
//                             title="Delete"
//                           >
//                             <FiTrash2 size={12} />
//                           </button>
//                           {showMenu === idx && (
//                             <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10">
//                               <button
//                                 onClick={() => deleteMessage(idx)}
//                                 className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
//                               >
//                                 Delete message
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
            
//             {/* AI Typing Indicator */}
//             {isAITyping && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex justify-start"
//               >
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
//                       <FiMessageCircle className="text-white" size={12} />
//                     </div>
//                     <span className="text-xs font-semibold text-green-600">AgriPoa AI</span>
//                   </div>
//                   <div className="bg-white rounded-2xl p-3 shadow-md">
//                     <div className="flex gap-1">
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-75"></div>
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Questions Row - Mobile */}
//           <div className="lg:hidden bg-white border-t border-gray-200 p-3 overflow-x-auto flex-shrink-0">
//             <div className="flex gap-2">
//               {quickQuestions.slice(0, 4).map((question, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => {
//                     setInputMessage(question);
//                     setTimeout(() => handleSendMessage(), 100);
//                   }}
//                   className="px-3 py-1.5 bg-gray-100 rounded-full text-xs whitespace-nowrap hover:bg-green-100 transition-colors"
//                 >
//                   {question}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Input Area */}
//           <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
//             <div className="flex gap-3 max-w-5xl mx-auto">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                 placeholder="Ask me about farming, diseases, pests, fertilizers..."
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim()}
//                 className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
//               >
//                 <FiSend size={18} />
//                 <span className="hidden sm:inline text-sm">Send</span>
//               </button>
//             </div>
//             <p className="text-xs text-gray-400 text-center mt-3">
//               Powered by Groq AI • Responses are for informational purposes only
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }