'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSearch, FiMessageCircle, FiUsers, FiEye, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    farmers: 0,
    resources: 0,
    successRate: 0,
    support: 0,
  });

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef);

  const targetStats = {
    farmers: 50000,
    resources: 500,
    successRate: 98,
    support: 24,
  };

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
        support: Math.min(Math.floor(targetStats.support * progress), targetStats.support),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  return (
    <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
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
            <span className="bg-yellow-400 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
              🤖 AI-Powered Agriculture Platform
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Transforming African
            <span className="text-yellow-300"> Agriculture</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            AI-powered crop disease detection, expert guidance, and real-time
            solutions for African farmers
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
                const event = new CustomEvent('openAIChat');
                window.dispatchEvent(event);
              }}
              className="bg-yellow-400 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <FiMessageCircle /> Chat with AI Assistant
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: "Farmers Helped", value: stats.farmers, suffix: "+", icon: FiUsers },
            { label: "Resources", value: stats.resources, suffix: "+", icon: FiEye },
            { label: "Success Rate", value: stats.successRate, suffix: "%", icon: FiCheckCircle },
            { label: "AI Support", value: stats.support, suffix: "/7", icon: FiMessageCircle },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/15 backdrop-blur-md rounded-lg p-4 cursor-pointer border border-white/20 shadow-lg"
              onClick={() => {
                if (index === 0) toast.success("🌾 We've helped over 50,000 farmers improve their yields!");
                if (index === 1) toast.success("📚 Access 500+ farming resources and guides!");
                if (index === 2) toast.success("✅ 98% success rate in disease diagnosis!");
                if (index === 3) toast.success("🤖 24/7 AI support available!");
              }}
            >
              <stat.icon className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
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
  );
}