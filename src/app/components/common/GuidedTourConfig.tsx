// app/components/GuidedTourConfig.tsx (updated with mobile menu info)
import { TourStep } from './GuidedTour';

export const guidedTourSteps: TourStep[] = [
  {
    id: 'home',
    title: '🏠 Home Page',
    description: 'Tap here to return to the homepage. Find latest updates and featured content.',
    targetSelector: 'a[href="/"]',
    position: 'bottom',
  },
  {
    id: 'about',
    title: '📖 About Us',
    description: 'Tap to learn about our mission, vision, and the team behind AgriPoa.',
    targetSelector: 'a[href="/about"]',
    position: 'bottom',
  },
  {
    id: 'resources',
    title: '📚 Resources',
    description: 'Access farming guides, market insights, and educational materials.',
    targetSelector: 'a[href="/resources"]',
    position: 'bottom',
  },
  {
    id: 'howitworks',
    title: '⚙️ How It Works',
    description: 'Learn our simple 3-step process to get started.',
    targetSelector: 'a[href="/howitworks"]',
    position: 'bottom',
  },
  {
    id: 'contact',
    title: '📞 Contact Us',
    description: 'Get in touch with our support team for assistance.',
    targetSelector: 'a[href="/contact"]',
    position: 'bottom',
  },
  {
    id: 'help',
    title: '❓ Help Center',
    description: 'FAQs, tutorials, and troubleshooting guides available here.',
    targetSelector: 'a[href="/help"]',
    position: 'bottom',
  },
  {
    id: 'ai-chatbot',
    title: '🤖 AI Assistant',
    description: 'Tap to chat with our AI assistant 24/7 for instant answers.',
    targetSelector: 'button', // AI chat button
    position: 'left',
  },
];

// // app/components/GuidedTourConfig.tsx (mobile-optimized selectors)
// import { TourStep } from './GuidedTour';

// export const guidedTourSteps: TourStep[] = [
//   {
//     id: 'home',
//     title: '🏠 Home Page',
//     description: 'Tap here to return to the homepage. Find latest updates and featured content.',
//     targetSelector: 'a[href="/"]',
//     position: 'bottom',
//   },
//   {
//     id: 'about',
//     title: '📖 About Us',
//     description: 'Tap to learn about our mission, vision, and the team behind AgriPoa.',
//     targetSelector: 'a[href="/about"]',
//     position: 'bottom',
//   },
//   {
//     id: 'resources',
//     title: '📚 Resources',
//     description: 'Access farming guides, market insights, and educational materials.',
//     targetSelector: 'a[href="/resources"]',
//     position: 'bottom',
//   },
//   {
//     id: 'howitworks',
//     title: '⚙️ How It Works',
//     description: 'Learn our simple 3-step process to get started.',
//     targetSelector: 'a[href="/howitworks"]',
//     position: 'bottom',
//   },
//   {
//     id: 'contact',
//     title: '📞 Contact Us',
//     description: 'Get in touch with our support team for assistance.',
//     targetSelector: 'a[href="/contact"]',
//     position: 'bottom',
//   },
//   {
//     id: 'help',
//     title: '❓ Help Center',
//     description: 'FAQs, tutorials, and troubleshooting guides available here.',
//     targetSelector: 'a[href="/help"]',
//     position: 'bottom',
//   },
//   {
//     id: 'ai-chatbot',
//     title: '🤖 AI Assistant',
//     description: 'Tap to chat with our AI assistant 24/7 for instant answers.',
//     targetSelector: 'button', // AI chat button
//     position: 'left',
//   },
// ];


// // import { TourStep } from './GuidedTour';

// // export const guidedTourSteps: TourStep[] = [
// //   {
// //     id: 'home',
// //     title: '🏠 Home Page',
// //     description: 'Click here to return to the homepage. You\'ll find the latest updates, featured content, and an overview of our platform.',
// //     targetSelector: 'a[href="/"]', // Home link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'about',
// //     title: '📖 About Us',
// //     description: 'Visit the About page to discover our mission, vision, and the team behind AgriPoa.',
// //     targetSelector: 'a[href="/about"]', // About link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'resources',
// //     title: '📚 Resources',
// //     description: 'Access farming guides, market insights, weather forecasts, and educational materials.',
// //     targetSelector: 'a[href="/resources"]', // Resources link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'howitworks',
// //     title: '⚙️ How It Works',
// //     description: 'Learn about our 3-step process to get started with AgriPoa.',
// //     targetSelector: 'a[href="/howitworks"]', // How It Works link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'contact',
// //     title: '📞 Contact Us',
// //     description: 'Have questions? Get in touch with our support team.',
// //     targetSelector: 'a[href="/contact"]', // Contact link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'help',
// //     title: '❓ Help Center',
// //     description: 'FAQs, tutorials, and troubleshooting guides available here.',
// //     targetSelector: 'a[href="/help"]', // Help link
// //     position: 'bottom',
// //   },
// //   {
// //     id: 'ai-chatbot',
// //     title: '🤖 AI Assistant',
// //     description: 'Click here to chat with our AI assistant 24/7 for instant answers.',
// //     targetSelector: 'button', // AI chat button
// //     position: 'left',
// //   },
// // ];

