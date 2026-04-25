'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '../common/Button';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative container-custom py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Empowering African Farmers
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Access expert knowledge, sustainable farming practices, and innovative solutions for better crop yields
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/content">
              <Button variant="secondary" size="large">
                Explore Content
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="large" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { number: '10K+', label: 'Farmers Reached' },
            { number: '500+', label: 'Educational Contents' },
            { number: '50+', label: 'Expert Contributors' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-gray-200">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}