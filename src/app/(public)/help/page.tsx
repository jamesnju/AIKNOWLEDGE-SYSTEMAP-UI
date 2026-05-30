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
    { icon: FiZap, name: "Crop Diseases", color: "from-yellow-500 to-orange-500", prompt: "Help me identify a crop disease" },
    { icon: FiShield, name: "Pest Control", color: "from-red-500 to-pink-500", prompt: "How to control pests organically?" },
    { icon: FiTrendingUp, name: "Fertilizers", color: "from-green-500 to-green-600", prompt: "What fertilizer should I use?" },
    { icon: FiCloud, name: "Irrigation", color: "from-blue-500 to-cyan-500", prompt: "Best irrigation practices" },
    { icon: FiUsers, name: "Organic Farming", color: "from-purple-500 to-indigo-500", prompt: "Organic farming techniques" },
    { icon: FiAward, name: "Harvesting", color: "from-green-600 to-green-700", prompt: "When and how to harvest?" },
  ];

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
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
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Sound play failed:", e));
    }
  };

  // Typing effect for bot responses
  const typeMessage = async (fullText: string, index: number) => {
    const words = fullText.split('');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i];
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], text: currentText, isTyping: true };
        }
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, 15)); // Typing speed
    }
    
    setChatMessages(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], isTyping: false };
      }
      return updated;
    });
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    const responses: { [key: string]: string } = {
      "maize disease": "🌽 **Common Maize Diseases & Solutions:**\n\n**1. Maize Lethal Necrosis (MLN)**\n• Symptoms: Rapid wilting, yellowing, dead heart\n• Solution: Use certified MLN-resistant seeds\n• Remove infected plants immediately\n\n**2. Gray Leaf Spot**\n• Symptoms: Gray lesions on leaves\n• Solution: Apply fungicides (Mancozeb)\n• Practice crop rotation (3-year cycle)\n\n**3. Rust**\n• Symptoms: Orange/brown pustules\n• Solution: Plant resistant varieties\n• Apply sulfur-based fungicides\n\n**4. Stalk Borer**\n• Symptoms: Holes in stems, wilting\n• Solution: Use neem oil spray\n• Apply Trichogramma parasitic wasps\n\n💡 **Prevention Tips:**\n• Use certified disease-free seeds\n• Maintain proper spacing (75cm x 25cm)\n• Practice crop rotation\n• Apply recommended fungicides early",

      "fall armyworm": "🐛 **Fall Armyworm Control Guide:**\n\n**Identification:**\n• Caterpillars with inverted Y on head\n• Damage: Window-paning on leaves\n• Frass (feces) in whorls\n\n**Control Methods:**\n\n🌿 **Organic:**\n• Neem oil (10ml/L water) - apply every 5 days\n• Garlic-chili solution\n• Bt (Bacillus thuringiensis) spray\n\n🧪 **Chemical:**\n• Emamectin benzoate\n• Spinosad\n• Rotate chemicals to prevent resistance\n\n📋 **Cultural Control:**\n• Early planting (avoid peak season)\n• Intercrop with legumes\n• Handpick caterpillars\n• Destroy crop residues\n\n🕯️ **Traps:**\n• Pheromone traps (15 per hectare)\n• Light traps for monitoring",

      "tomato disease": "🍅 **Common Tomato Diseases & Solutions:**\n\n**Late Blight**\n• Symptoms: Dark spots on leaves with white fuzz\n• Solution: Copper-based fungicides\n• Remove infected leaves\n\n**Early Blight**\n• Symptoms: Target-like spots on lower leaves\n• Solution: Remove affected leaves\n• Apply chlorothalonil fungicide\n\n**Tomato Yellow Leaf Curl**\n• Symptoms: Stunted growth, yellow curled leaves\n• Solution: Use resistant varieties\n• Control whiteflies with neem oil\n\n**Blossom End Rot**\n• Symptoms: Dark sunken spots on fruit bottom\n• Solution: Consistent watering\n• Add calcium to soil\n• Mulch to retain moisture\n\n**Prevention:**\n• Use certified disease-free seeds\n• Practice 3-year crop rotation\n• Apply organic mulch\n• Ensure good air circulation (proper spacing)",

      "pest control": "🐞 **Integrated Pest Management (IPM) Guide:**\n\n**Natural/Organic Methods:**\n• Neem oil spray (10ml/L water)\n• Garlic-chili solution\n• Marigold companion planting\n• Diatomaceous earth powder\n\n**Biological Control:**\n• Ladybugs for aphids\n• Trichogramma wasps for caterpillars\n• Praying mantis for various pests\n• Nematodes for soil pests\n\n**Cultural Practices:**\n• Crop rotation (3-4 year cycle)\n• Remove crop residues\n• Use pheromone traps\n• Regular field scouting (weekly)\n\n**Organic Pesticides:**\n• Bacillus thuringiensis (Bt)\n• Spinosad\n• Insecticidal soaps\n• Pyrethrin",

      "organic fertilizer": "🌱 **Organic Fertilizer Recipes:**\n\n**Compost Tea:**\n• 1 part mature compost\n• 5 parts water\n• Steep for 3-5 days\n• Dilute 1:10 before use\n• Apply weekly\n\n**Nettle Fertilizer:**\n• 1kg fresh nettle leaves\n• 10L water\n• Ferment for 2 weeks\n• Dilute 1:20\n• Rich in nitrogen and iron\n\n**Eggshell Fertilizer:**\n• Crush eggshells\n• Soak in water for 2 days\n• Use water for calcium boost\n• Add crushed shells to soil\n\n**Banana Peel Fertilizer:**\n• Chop peels\n• Soak in water for 3 days\n• Use water for potassium\n• Bury peels near plants\n\n**Application Rates:**\n• Vegetables: 5L per square meter\n• Fruit trees: 20L per tree\n• Apply every 2 weeks",

      "irrigation": "💧 **Smart Irrigation Guide:**\n\n**Best Practices:**\n• Water early morning (5-8 AM)\n• Avoid evening watering (promotes disease)\n• Use drip irrigation (70% water saving)\n• Install rain gauges\n• Mulch to reduce evaporation (50% less water)\n\n**Water Requirements by Crop:**\n🌽 Maize: 500-600mm/season\n🍅 Tomatoes: 400-500mm/season\n🥬 Vegetables: 350-400mm/season\n🌶️ Peppers: 400-450mm/season\n🥔 Potatoes: 500-600mm/season\n\n**Efficiency Tips:**\n• Use moisture sensors\n• Practice deficit irrigation\n• Collect rainwater\n• Install drip lines under mulch\n\n**Signs of Water Stress:**\n• Wilting leaves\n• Stunted growth\n• Leaf curling\n• Dry, cracked soil",
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! 👋 Welcome to AgriPoa AI Assistant! 🌱\n\nI'm here to help you with:\n\n🌽 Crop diseases & treatment\n🐛 Pest identification & control\n🌱 Organic farming methods\n💧 Irrigation techniques\n📊 Fertilizer recommendations\n🌾 Harvesting & storage\n\nWhat farming challenge can I help with today?";
    }

    if (lowerMessage.includes("thank")) {
      return "You're very welcome! 🌟 Happy farming! Remember, healthy crops lead to better harvests. Feel free to ask if you need more help. 🚜\n\nIs there anything else I can assist you with?";
    }

    return "🌱 **How can I help you today?**\n\nI can provide detailed information on:\n\n✅ **Crop Diseases** - Symptoms, treatment, prevention\n✅ **Pest Control** - Organic & chemical solutions\n✅ **Fertilizers** - Application rates, organic options\n✅ **Irrigation** - Water management, systems\n✅ **Planting** - Spacing, timing, techniques\n✅ **Harvesting** - Timing, methods, handling\n✅ **Storage** - Pest control, conditions\n✅ **Soil Health** - Improvement, testing\n\n**Try asking me:**\n• \"How to control Fall Armyworm?\"\n• \"Maize disease treatment\"\n• \"Organic fertilizer recipe\"\n• \"Best irrigation practices\"\n\nWhat specific farming question do you have? 🌾";
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

    // Get AI response
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
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <FiArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="text-green-600" size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="font-bold">AgriPoa AI Assistant</h1>
                  <p className="text-xs opacity-90">Online • Ready to help 24/7</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
              </button>
              <button
                onClick={clearChat}
                className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm font-semibold"
              >
                Clear
              </button>
              <Link
                href="/"
                className="bg-yellow-400 text-green-600 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <FiHome size={16} /> Exit
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
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

        {/* Mobile Categories Bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
          <div className="flex gap-2 p-3">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(category.prompt);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap hover:bg-green-100 transition-colors"
              >
                <category.icon size={14} className="text-green-600" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area - Full height */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
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
                  <div className={`max-w-[85%] lg:max-w-[70%] ${msg.isUser ? "order-2" : "order-1"}`}>
                    {/* Avatar for bot */}
                    {!msg.isUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                          <FiMessageCircle className="text-white" size={12} />
                        </div>
                        <span className="text-xs font-semibold text-green-600">AgriPoa AI</span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div
                      className={`relative p-3 rounded-2xl ${
                        msg.isUser
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "bg-white text-gray-900 shadow-md"
                      } ${msg.isTyping ? "min-w-[80px]" : ""}`}
                    >
                      {msg.isTyping && !msg.text ? (
                        <div className="flex gap-1 py-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                      ) : (
                        <>
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                          />
                          {msg.isUser && (
                            <div className="text-xs text-right mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Actions for bot messages */}
                    {!msg.isUser && msg.text && !msg.isTyping && (
                      <div className="flex items-center gap-2 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? <FiCheck size={12} /> : <FiCopy size={12} />}
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === idx ? null : idx)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                          </button>
                          {showMenu === idx && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10">
                              <button
                                onClick={() => deleteMessage(idx)}
                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
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
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="text-white" size={12} />
                    </div>
                    <span className="text-xs font-semibold text-green-600">AgriPoa AI</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Row - Mobile */}
          <div className="lg:hidden bg-white border-t border-gray-200 p-3 overflow-x-auto flex-shrink-0">
            <div className="flex gap-2">
              {quickQuestions.slice(0, 4).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-xs whitespace-nowrap hover:bg-green-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex gap-3 max-w-5xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me about farming, diseases, pests, fertilizers..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <FiSend size={18} />
                <span className="hidden sm:inline text-sm">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Powered by AI • Responses are for informational purposes only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}