'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiInfo, FiGrid, FiBarChart2, FiMail, FiHelpCircle, FiMessageCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/about', label: 'About', icon: FiInfo },
    { href: '/resources', label: 'Resources', icon: FiGrid },
    { href: '/howitworks', label: 'How It Works', icon: FiBarChart2 },
    { href: '/contact', label: 'Contact', icon: FiMail },
    { href: '/help', label: 'Help', icon: FiHelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12">
              <Image
                src="/logos.png"
                alt="AgriPoa"
                fill
                className="object-contain"
              />
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-green-600' : 'text-white'}`}>
              AgriPoa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 transition-colors font-medium ${
                    scrolled 
                      ? `text-gray-700 hover:text-green-600 ${isActive ? 'text-green-600' : ''}`
                      : `text-white hover:text-yellow-300 ${isActive ? 'text-yellow-300' : ''}`
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            
            {/* AI Chat Button */}
            {/* <button
              onClick={() => {
                const event = new CustomEvent('openAIChat');
                window.dispatchEvent(event);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                scrolled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-400 text-green-600 hover:bg-yellow-300'
              }`}
            >
              <FiMessageCircle size={16} />
              AI Assistant
            </button> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden focus:outline-none ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-6 pb-4 bg-white rounded-lg shadow-lg p-4"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-3 px-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 mt-3 pt-3">
              <button
                onClick={() => {
                  const event = new CustomEvent('openAIChat');
                  window.dispatchEvent(event);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <FiMessageCircle size={18} />
                <span className="font-medium">AI Assistant</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FiMenu, FiX } from 'react-icons/fi';
// import Image from 'next/image';
// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { href: '/', label: 'Home' },
//     { href: '/about', label: 'About' },
//     // { href: '/admin/login', label: 'Admin' },
//   ];

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
//       }`}
//     >
//       <div className="container-custom">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="flex items-center space-x-2">
//           <div className="relative w-15 h-15">
//             <Image
//               src="/logos.png"
//               alt="AgriPoa"
//               fill
//               className="object-contain"
//             />
//           </div>
         
//         </Link>
//           {/* <Link href="/" className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
//               <span className="text-white font-bold text-xl">A</span>
//             </div>
//             <span className="text-2xl font-bold text-primary">AgriPoa</span>
//           </Link> */}

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`text-gray-700 hover:text-primary transition-colors font-medium ${
//                   pathname === link.href ? 'text-primary' : ''
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-gray-700 focus:outline-none"
//           >
//             {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="md:hidden mt-4 pb-4"
//           >
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setIsOpen(false)}
//                 className={`block py-2 text-gray-700 hover:text-primary transition-colors ${
//                   pathname === link.href ? 'text-primary' : ''
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </header>
//   );
// }