'use client';

import { motion } from 'framer-motion';
import { FiBookOpen, FiVideo, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Card from '../common/Card';

export default function FeaturesSection() {
  const features = [
    {
      icon: FiBookOpen,
      title: 'Expert Knowledge',
      description: 'Access curated agricultural content from industry experts and researchers.',
    },
    {
      icon: FiVideo,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides on farming techniques and pest management.',
    },
    {
      icon: FiUsers,
      title: 'Farmer Community',
      description: 'Connect with fellow farmers and share experiences and tips.',
    },
    {
      icon: FiTrendingUp,
      title: 'Sustainable Growth',
      description: 'Learn sustainable farming practices for better yields and profitability.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Why Choose AgriPoa?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We provide comprehensive agricultural resources to help farmers succeed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}