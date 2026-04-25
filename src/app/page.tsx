'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FiEye, FiCalendar, FiPlay, FiImage, FiSearch, FiFilter, 
  FiMessageCircle, FiX, FiSend, FiZap, FiTrendingUp, 
  FiShield, FiUsers, FiAward, FiChevronRight, FiHeart,
  FiCloud, FiSun, FiDroplet, FiLoader, FiCheckCircle,
  FiVolume2, FiVolumeX, FiMenu
} from 'react-icons/fi';
import { contentService } from './services/content';
import { Content } from './types';
import toast from 'react-hot-toast';

export default function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAIToast, setShowAIToast] = useState(true);
  const [isToastMinimized, setIsToastMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hello! 🌱 I'm AgriPoa AI Assistant. I can help you with:\n\n• Crop disease diagnosis\n• Pest control methods\n• Organic farming tips\n• Fertilizer recommendations\n• Weather & irrigation advice\n\nWhat would you like to know?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  
  // Animated stats
  const [stats, setStats] = useState({
    farmers: 0,
    resources: 0,
    successRate: 0,
    support: 0
  });
  
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Target values
  const targetStats = {
    farmers: 50000,
    resources: 500,
    successRate: 98,
    support: 24
  };

  useEffect(() => {
    fetchContents();
    
    // Create audio element
    audioRef.current = new Audio('/notification.mp3');
    
    // Auto-show AI toast on page load
    setTimeout(() => {
      setShowAIToast(true);
    }, 1000);
  }, []);

  // Animate stats when in view
  useEffect(() => {
    if (isStatsInView) {
      animateStats();
    }
  }, [isStatsInView]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        farmers: Math.min(Math.floor(targetStats.farmers * progress), targetStats.farmers),
        resources: Math.min(Math.floor(targetStats.resources * progress), targetStats.resources),
        successRate: Math.min(Math.floor(targetStats.successRate * progress), targetStats.successRate),
        support: Math.min(Math.floor(targetStats.support * progress), targetStats.support)
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  const fetchContents = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
        setFilteredContents(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType !== 'ALL') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    if (selectedCrop !== 'ALL') {
      filtered = filtered.filter((item) => item.cropType === selectedCrop);
    }
    setFilteredContents(filtered);
  };

  // Play sound function
  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Sound play failed:', e));
    }
  };

  // AI Chatbot responses
  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Predefined knowledge base
    const responses: { [key: string]: string } = {
      'maize disease': "🌽 **Common Maize Diseases & Solutions:**\n\n1️⃣ **Maize Lethal Necrosis (MLN)**\n• Symptoms: Rapid wilting, yellowing\n• Solution: Use certified MLN-resistant seeds\n\n2️⃣ **Gray Leaf Spot**\n• Symptoms: Gray lesions on leaves\n• Solution: Apply fungicides, crop rotation\n\n3️⃣ **Rust**\n• Symptoms: Orange/brown pustules\n• Solution: Plant resistant varieties\n\n💡 **Prevention Tips:**\n• Practice crop rotation (3-year cycle)\n• Use disease-free seeds\n• Apply recommended fungicides\n• Maintain proper spacing",
      
      'tomato disease': "🍅 **Common Tomato Diseases:**\n\n**Late Blight**\n• Dark spots on leaves with white fuzz\n• Solution: Copper-based fungicides\n\n**Early Blight**\n• Target-like spots on lower leaves\n• Solution: Remove affected leaves, apply fungicides\n\n**Tomato Yellow Leaf Curl**\n• Stunted growth, yellow curled leaves\n• Solution: Use resistant varieties, control whiteflies\n\n**Blossom End Rot**\n• Dark sunken spots on fruit bottom\n• Solution: Maintain consistent watering, add calcium\n\n🛡️ **Prevention:**\n• Use certified disease-free seeds\n• Practice crop rotation\n• Apply organic mulch\n• Ensure good air circulation",
      
      'pest control': "🐛 **Integrated Pest Management (IPM) Guide:**\n\n**Natural Methods:**\n• Neem oil spray (10ml/L water)\n• Garlic-chili solution\n• Marigold companion planting\n\n**Biological Control:**\n• Ladybugs for aphids\n• Trichogramma wasps for caterpillars\n• Praying mantis for various pests\n\n**Cultural Practices:**\n• Crop rotation\n• Remove crop residues\n• Use pheromone traps\n• Regular field scouting\n\n**Organic Pesticides:**\n• Bacillus thuringiensis (Bt)\n• Diatomaceous earth\n• Insecticidal soaps",
      
      'organic farming': "🌱 **Organic Farming Best Practices:**\n\n**Soil Health:**\n• Use compost and well-rotted manure\n• Practice green manuring\n• Implement crop rotation\n• Use cover crops (legumes)\n\n**Natural Fertilizers:**\n• Compost tea\n• Vermicompost\n• Bone meal\n• Wood ash\n\n**Pest Management:**\n• Neem products\n• Beneficial insects\n• Trap crops\n• Physical barriers\n\n**Weed Control:**\n• Mulching\n• Hand weeding\n• Flame weeding\n• Cover cropping",
      
      'fertilizer': "📊 **Fertilizer Guide:**\n\n**NPK Recommendations:**\n\n🌽 **Maize:**\n• Starter: 50kg/ha DAP\n• Top dress: 100kg/ha CAN\n\n🍅 **Tomatoes:**\n• Pre-plant: 40kg/ha NPK 15:15:15\n• Side dress: 100kg/ha CAN\n\n🥬 **Vegetables:**\n• Organic compost: 10 tons/ha\n• Liquid fertilizer every 2 weeks\n\n**Organic Options:**\n• Compost manure\n• Chicken manure (aged)\n• Green manure crops\n• Bio-slurry from biogas",
      
      'irrigation': "💧 **Smart Irrigation Guide:**\n\n**Best Practices:**\n• Water early morning (5-8 AM)\n• Avoid evening watering to prevent disease\n• Use drip irrigation for 70% water saving\n• Install rain gauges\n\n**Water Requirements:**\n🌽 Maize: 500-600mm/season\n🍅 Tomatoes: 400-500mm/season\n🥬 Vegetables: 350-400mm/season\n\n**Efficiency Tips:**\n• Mulch to reduce evaporation\n• Use moisture sensors\n• Practice deficit irrigation\n• Collect rainwater\n\n**Signs of Water Stress:**\n• Wilting leaves\n• Stunted growth\n• Leaf curling\n• Dry soil",
      
      'harvest': "🌾 **Harvesting Best Practices:**\n\n**Timing Indicators:**\n🌽 Maize: Husk turns brown, grains hard\n🍅 Tomatoes: Full color development\n🥬 Leafy veg: Before flowering\n\n**Proper Techniques:**\n• Harvest early morning\n• Use clean, sharp tools\n• Handle produce gently\n• Avoid bruising\n\n**Post-Harvest:**\n• Sort and grade immediately\n• Clean with mild solution\n• Cool quickly\n• Store properly",
      
      'storage': "📦 **Storage Guidelines:**\n\n**Grains (Maize, Wheat):**\n• Moisture below 13%\n• Use hermetic bags\n• Keep in cool, dry place\n• Regular pest inspection\n\n**Vegetables:**\n• Temperature: 10-15°C\n• Humidity: 85-95%\n• Ventilation essential\n\n**Fruits:**\n• Temperature: 5-10°C\n• Humidity: 85-90%\n• Separate ethylene producers\n\n**Pest Control Storage:**\n• Clean storage area\n• Use food-grade diatomaceous earth\n• Regular inspection\n• Proper ventilation",
      
      'weather': "☀️ **Weather-Based Farming:**\n\n**Best Planting Times:**\n🌧️ Rainy season: Start of rains\n☀️ Dry season: Irrigated farming\n\n**Weather Monitoring:**\n• Install simple rain gauge\n• Use weather apps\n• Watch for frost warnings\n\n**Climate Adaptation:**\n• Drought-resistant varieties\n• Rainwater harvesting\n• Mulching for moisture retention\n• Wind breaks for storm protection",
    };

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Default responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm your AI farming assistant. How can I help you today? Ask me about:\n\n🌽 Crop diseases\n🐛 Pest control\n🌱 Organic farming\n💧 Irrigation\n📊 Fertilizers\n🌾 Harvesting\n📦 Storage";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! 🌟 Happy farming! Feel free to ask if you need more help. Remember, healthy crops = better harvest! 🚜";
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug')) {
      return "🐞 **Quick Pest Control Tips:**\n\n• **Aphids:** Spray neem oil solution\n• **Fall Armyworm:** Use pheromone traps\n• **Stem Borer:** Remove affected stems\n• **Fruit Flies:** Use protein baits\n\nFor specific pest identification, describe what you're seeing!";
    }
    
    if (lowerMessage.includes('soil')) {
      return "🌍 **Soil Health Management:**\n\n**Signs of Healthy Soil:**\n• Earthworms present\n• Good structure\n• Dark color (organic matter)\n• Good drainage\n\n**Improvement Tips:**\n• Add compost\n• Practice minimum tillage\n• Plant cover crops\n• Test pH annually (ideal 6.0-7.0)";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return "📈 **Market Information:**\n\nFor current market prices in your area, I recommend:\n• Checking local agricultural offices\n• Using market price apps\n• Joining farmer cooperatives\n• Contacting nearby produce markets\n\nPrices vary by season and location!";
    }

    return "🌱 **How can I help you today?**\n\nI can provide information on:\n\n✅ Crop diseases & treatment\n✅ Pest identification & control\n✅ Organic farming methods\n✅ Fertilizer application rates\n✅ Irrigation techniques\n✅ Harvesting & storage\n✅ Soil health management\n\nWhat specific farming challenge are you facing?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);
    playSound();

    // Simulate AI thinking
    setTimeout(async () => {
      const response = await getAIResponse(inputMessage);
      setChatMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
      playSound();
    }, 1000);
  };

  const quickQuestions = [
    "How to control Fall Armyworm?",
    "Tomato late blight treatment",
    "Organic fertilizer recipe",
    "Maize spacing recommendations",
    "Drip irrigation setup",
    "Post-harvest storage tips"
  ];

  const cropTypes = ['ALL', 'MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
  const contentTypes = ['ALL', 'IMAGE', 'VIDEO'];

  const features = [
    { icon: FiZap, title: 'AI-Powered Diagnosis', description: 'Instant crop disease detection using advanced AI', color: 'from-yellow-500 to-orange-500' },
    { icon: FiTrendingUp, title: 'Smart Recommendations', description: 'Personalized farming advice based on your region', color: 'from-green-500 to-primary' },
    { icon: FiShield, title: 'Pest Alerts', description: 'Real-time pest outbreak notifications', color: 'from-red-500 to-pink-500' },
    { icon: FiCloud, title: 'Weather Integration', description: 'Local weather forecasts and crop planning', color: 'from-blue-500 to-cyan-500' },
    { icon: FiUsers, title: 'Farmer Community', description: 'Connect with experts and fellow farmers', color: 'from-purple-500 to-indigo-500' },
    { icon: FiAward, title: 'Expert Knowledge', description: 'Access to verified agricultural research', color: 'from-primary to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
      </audio>

      {/* AI Chatbot Toast Menu */}
      <AnimatePresence>
        {showAIToast && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Toast Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsToastMinimized(!isToastMinimized)}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <FiMessageCircle className="text-primary" size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="font-bold">AgriPoa AI Assistant</h4>
                    <p className="text-xs opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickMenu(!showQuickMenu);
                      playSound();
                    }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <FiMenu size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAIToast(false);
                    }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Quick Menu */}
              <AnimatePresence>
                {showQuickMenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/20"
                  >
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-semibold text-yellow-300 mb-2">QUICK ACTIONS</p>
                      {[
                        { icon: "🌾", label: "Diagnose Crop Disease", action: "I need help diagnosing a crop disease" },
                        { icon: "🐛", label: "Identify Pest", action: "Help me identify a pest" },
                        { icon: "🌱", label: "Fertilizer Calculator", action: "How much fertilizer should I use?" },
                        { icon: "💧", label: "Irrigation Schedule", action: "What's the best irrigation schedule?" },
                        { icon: "📈", label: "Market Prices", action: "Current market prices" },
                        { icon: "🌤️", label: "Weather Forecast", action: "Weather advice for farming" },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(item.action);
                            setIsChatOpen(true);
                            setShowAIToast(false);
                            setTimeout(() => handleSendMessage(), 500);
                            playSound();
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg transition-colors text-sm"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sound Toggle */}
              <div className="border-t border-white/20 p-3 flex justify-between items-center">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2 text-sm hover:bg-white/20 px-2 py-1 rounded transition-colors"
                >
                  {soundEnabled ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
                  <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
                </button>
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setShowAIToast(false);
                    playSound();
                  }}
                  className="bg-yellow-400 text-primary px-4 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Open Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container-custom py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="bg-yellow-400 text-primary px-4 py-2 rounded-full text-sm font-bold">
                🤖 AI-Powered Agriculture Platform
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Transforming African
              <span className="text-yellow-300"> Agriculture</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              AI-powered crop disease detection, expert guidance, and real-time solutions for African farmers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search crops, diseases, or farming tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setShowAIToast(false);
                  playSound();
                }}
                className="bg-yellow-400 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                <FiMessageCircle /> Chat with AI Assistant
              </button>
            </div>
          </motion.div>

          {/* Animated Stats Section */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: 'Farmers Helped', value: stats.farmers, suffix: '+', icon: FiUsers },
              { label: 'Resources', value: stats.resources, suffix: '+', icon: FiEye },
              { label: 'Success Rate', value: stats.successRate, suffix: '%', icon: FiCheckCircle },
              { label: 'AI Support', value: stats.support, suffix: '/7', icon: FiMessageCircle },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer"
                onClick={() => {
                  if (index === 0) toast.success("🌾 We've helped over 50,000 farmers improve their yields!");
                  if (index === 1) toast.success("📚 Access 500+ farming resources and guides!");
                  if (index === 2) toast.success("✅ 98% success rate in disease diagnosis!");
                  if (index === 3) toast.success("🤖 24/7 AI support available!");
                  playSound();
                }}
              >
                <stat.icon className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-pulse" />
                <motion.div 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  {stat.value.toLocaleString()}{stat.suffix}
                </motion.div>
                <div className="text-sm text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Smart Farming Solutions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Leverage AI technology to transform your farming experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => {
                  toast(`Learn more about ${feature.title}`, {
  icon: 'ℹ️',
  duration: 3000,
});
                  playSound();
                }}
              >
                <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to smarter farming</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload or Describe', desc: 'Share crop images or describe symptoms', icon: FiCloud },
              { step: '2', title: 'AI Analysis', desc: 'Our AI diagnoses diseases instantly', icon: FiZap },
              { step: '3', title: 'Get Solutions', desc: 'Receive expert recommendations', icon: FiCheckCircle },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <item.icon className="text-white" size={40} />
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2">
                    <div className="bg-yellow-400 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold animate-pulse">
                      {item.step}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section with Filters - Keep existing code */}
      <section className="py-16">
        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8 sticky top-20 z-40">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiFilter size={18} />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'ALL' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                >
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop === 'ALL' ? 'All Crops' : crop}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Found {filteredContents.length} resources
              </div>
            </div>
          </div>

          {/* Content Grid - Keep existing content display code */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Loading amazing content...</p>
              </div>
            </div>
          ) : filteredContents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/content/${content.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {content.type === 'VIDEO' ? (
                          <>
                            <img
                              src={content.thumbnail || content.url}
                              alt={content.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <FiPlay className="text-primary ml-1" size={28} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={content.url}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            content.type === 'VIDEO' ? 'bg-blue-500' : 'bg-green-500'
                          } text-white`}>
                            {content.type === 'VIDEO' ? '📹 Video' : '🖼️ Image'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {content.cropType}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {content.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {content.description}
                        </p>
                        {content.pestType && content.pestType !== 'NONE' && (
                          <div className="mb-4">
                            <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                              🐛 Pest: {content.pestType}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar size={14} />
                            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiEye size={14} />
                            <span>{content.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using AgriPoa to increase yields and reduce crop losses
          </p>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setShowAIToast(false);
              playSound();
            }}
            className="inline-flex items-center gap-2 bg-yellow-400 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
          >
            <FiMessageCircle /> Chat with AI Assistant Now
          </button>
        </div>
      </section>

      {/* AI Chatbot Modal - Keep existing chat modal code */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsChatOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="text-primary" size={20} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="font-bold">AgriPoa AI Assistant</h3>
                    <p className="text-xs opacity-90">Online • AI-Powered</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isUser
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-900 shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
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

              {/* Quick Questions */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInputMessage(q);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about farming, diseases, pests..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {!isChatOpen && !showAIToast && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setIsChatOpen(true);
            playSound();
          }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <FiMessageCircle size={28} />
        </motion.button>
      )}
    </div>
  );
}
