'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [counts, setCounts] = useState({ farmers: 0, content: 0, experts: 0 });

  useEffect(() => {
    if (isInView) {
      const animateCount = (target: number, key: keyof typeof counts) => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCounts(prev => ({ ...prev, [key]: target }));
            clearInterval(timer);
          } else {
            setCounts(prev => ({ ...prev, [key]: Math.floor(start) }));
          }
        }, 16);
      };
      
      animateCount(10000, 'farmers');
      animateCount(500, 'content');
      animateCount(50, 'experts');
    }
  }, [isInView]);

  const stats = [
    { label: 'Farmers Reached', value: counts.farmers, suffix: '+', key: 'farmers' },
    { label: 'Educational Contents', value: counts.content, suffix: '+', key: 'content' },
    { label: 'Expert Contributors', value: counts.experts, suffix: '+', key: 'experts' },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-200">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}