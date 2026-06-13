// app/page.tsx (updated)
'use client';

import { motion } from 'framer-motion';
import AIChatbot from './(public)/aisection/page';
import ContentSection from './(public)/contentsection/page';
import CTASection from './(public)/ctasection/page';
import Features from './(public)/features/page';
import Hero from './(public)/hero/page';
import HowItWorks from './(public)/howitworks/page';
import Header from './components/common/Header';
import OnboardingGuide from './components/common/OnboardingGuide';

// Define your onboarding steps
const onboardingSteps = [
  {
    id: 'hero',
    title: '👋 Welcome to Our Platform!',
    description: 'Discover how our AI-powered solution can transform your workflow and boost productivity.',
    targetId: 'hero-section',
    position: 'bottom' as const,
  },
  {
    id: 'features',
    title: '✨ Powerful Features',
    description: 'Explore our comprehensive suite of tools designed to meet all your needs in one place.',
    targetId: 'features-section',
    position: 'top' as const,
  },
  {
    id: 'how-it-works',
    title: '🔄 How It Works',
    description: 'Simple 3-step process to get started. Watch your productivity soar with minimal effort.',
    targetId: 'howitworks-section',
    position: 'top' as const,
  },
  {
    id: 'content',
    title: '📚 Rich Content Library',
    description: 'Access thousands of resources, templates, and guides to accelerate your learning.',
    targetId: 'content-section',
    position: 'top' as const,
  },
  {
    id: 'cta',
    title: '🚀 Ready to Start?',
    description: 'Click the button below to begin your journey. Our team is here to help you every step of the way.',
    targetId: 'cta-section',
    position: 'top' as const,
  },
  {
    id: 'ai-chatbot',
    title: '🤖 Need Help?',
    description: 'Our AI assistant is available 24/7. Ask anything about the platform, features, or pricing.',
    targetId: 'ai-chatbot-section',
    position: 'left' as const,
  },
];

export default function Home() {
  const handleComplete = () => {
    console.log('Onboarding completed!');
    // Optional: Track analytics event
  };

  const handleSkip = () => {
    console.log('Onboarding skipped');
    // Optional: Track analytics event
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Onboarding Guide */}
      {/* <OnboardingGuide
        steps={onboardingSteps}
        onComplete={handleComplete}
        onSkip={handleSkip}
        storageKey="myapp-onboarding-v1"
        showProgress={true}
        highlightTargets={true}
      /> */}
      
      <motion.div
        id="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
      </motion.div>
      
      <motion.div
        id="features-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <Features />
      </motion.div>
      
      <motion.div
        id="howitworks-section"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <HowItWorks />
      </motion.div>
      
      <motion.div
        id="content-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <ContentSection />
      </motion.div>
      
      <motion.div
        id="cta-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <CTASection />
      </motion.div>
      
      <motion.div
        id="ai-chatbot-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <AIChatbot />
      </motion.div>
    </main>
  );
}

// 'use client';

// import { motion } from 'framer-motion';
// import AIChatbot from './(public)/aisection/page';
// import ContentSection from './(public)/contentsection/page';
// import CTASection from './(public)/ctasection/page';
// import Features from './(public)/features/page';
// import Hero from './(public)/hero/page';
// import HowItWorks from './(public)/howitworks/page';
// import Header from './components/common/Header';

// export default function Home() {
//   return (
//     <main className="min-h-screen">
//       <Header />
      
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Hero />
//       </motion.div>
      
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Features />
//       </motion.div>
      
//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.6 }}
//       >
//         <HowItWorks />
//       </motion.div>
      
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.6 }}
//       >
//         <ContentSection />
//       </motion.div>
      
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.6 }}
//       >
//         <CTASection />
//       </motion.div>
      
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//       >
//       </motion.div>

//       <AIChatbot />
//     </main>
//   );
// }
