'use client';

import { FiMessageCircle } from 'react-icons/fi';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Farming?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of farmers already using AgriPoa to increase yields and reduce crop losses
        </p>
        <button
          onClick={() => {
            const event = new CustomEvent('openAIChat');
            window.dispatchEvent(event);
          }}
          className="inline-flex items-center gap-2 bg-yellow-400 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
        >
          <FiMessageCircle /> Chat with AI Assistant Now
        </button>
      </div>
    </section>
  );
}