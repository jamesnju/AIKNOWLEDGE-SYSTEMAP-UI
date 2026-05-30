'use client';

import { motion } from 'framer-motion';
import { FiCloud, FiZap, FiCheckCircle } from 'react-icons/fi';

const steps = [
  { step: "1", title: "Upload or Describe", desc: "Share crop images or describe symptoms", icon: FiCloud },
  { step: "2", title: "AI Analysis", desc: "Our AI diagnoses diseases instantly", icon: FiZap },
  { step: "3", title: "Get Solutions", desc: "Receive expert recommendations", icon: FiCheckCircle },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-green-100">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-600 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Simple steps to smarter farming</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <item.icon className="text-white" size={40} />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2">
                  <div className="bg-yellow-400 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
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
  );
}