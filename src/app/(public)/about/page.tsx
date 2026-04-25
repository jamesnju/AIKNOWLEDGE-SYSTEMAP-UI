'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

export default function AboutPage() {
  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To empower African farmers with accessible, practical agricultural knowledge and sustainable farming solutions.',
    },
    {
      icon: FiEye,
      title: 'Our Vision',
      description: 'A future where every African farmer has the resources and knowledge to achieve food security and prosperity.',
    },
    {
      icon: FiHeart,
      title: 'Our Values',
      description: 'Sustainability, innovation, community, and excellence in everything we do.',
    },
  ];

  return (
    <main className="pt-24 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About AgriPoa</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging the knowledge gap in African agriculture through digital innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-4">
                <value.icon size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">Join Our Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Together, we can transform agriculture in Africa. Whether you're a farmer, expert, or supporter,
            your contribution matters.
          </p>
          <a
            href="/admin/register"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Become a Contributor
          </a>
        </motion.div>
      </div>
    </main>
  );
}