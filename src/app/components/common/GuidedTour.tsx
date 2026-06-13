// app/components/GuidedTour.tsx (with mobile menu support)
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, SkipForward, 
  Navigation, MapPin, Compass, MousePointer, Menu
} from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  mobileMenuSelector?: string; // Selector for the hamburger menu button
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
  autoStart?: boolean;
}

export default function GuidedTour({ 
  steps, 
  onComplete, 
  onSkip, 
  storageKey = 'guided-tour-completed',
  autoStart = true 
}: GuidedTourProps) {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [elementFound, setElementFound] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('bottom');
  const retryCount = useRef(0);
  const maxRetries = 20;
  const menuButtonRef = useRef<Element | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user has seen the tour before
  useEffect(() => {
    const hasCompleted = localStorage.getItem(storageKey);
    if (autoStart && !hasCompleted) {
      setTimeout(() => setIsVisible(true), 800);
    }
  }, [storageKey, autoStart]);

  // Function to open mobile menu
  const openMobileMenu = useCallback(async () => {
    if (!isMobile) return true;
    
    // Find the mobile menu button (hamburger icon)
    const menuButton = document.querySelector('button.md\\:hidden') || 
                       document.querySelector('button[aria-label="Menu"]') ||
                       document.querySelector('.md\\:hidden button') ||
                       document.querySelector('button:has(svg[data-lucide="menu"])');
    
    if (menuButton) {
      menuButtonRef.current = menuButton;
      // Check if menu is already open by looking for mobile nav
      const mobileNav = document.querySelector('.md\\:hidden.mt-6, .mobile-nav');
      const isOpen = mobileNav && window.getComputedStyle(mobileNav).display !== 'none';
      
      if (!isOpen) {
        // Click to open menu
        (menuButton as HTMLElement).click();
        setIsMobileMenuOpen(true);
        // Wait for menu animation
        await new Promise(resolve => setTimeout(resolve, 400));
      } else {
        setIsMobileMenuOpen(true);
      }
      return true;
    }
    return false;
  }, [isMobile]);

  // Function to close mobile menu
  const closeMobileMenu = useCallback(() => {
    if (isMobile && isMobileMenuOpen) {
      const menuButton = document.querySelector('button.md\\:hidden') || 
                         document.querySelector('button[aria-label="Menu"]');
      if (menuButton) {
        (menuButton as HTMLElement).click();
        setIsMobileMenuOpen(false);
      }
    }
  }, [isMobile, isMobileMenuOpen]);

  // Find element with retry mechanism
  const findElementWithRetry = useCallback((selector: string, isMobileTarget: boolean = false): Element | null => {
    try {
      // For mobile, search within the mobile menu if it's open
      let element = null;
      
      if (isMobile && isMobileTarget && isMobileMenuOpen) {
        // Search within mobile menu
        const mobileMenu = document.querySelector('.md\\:hidden.mt-6, .mobile-nav');
        if (mobileMenu) {
          element = mobileMenu.querySelector(selector);
        }
      } else {
        // Standard search
        element = document.querySelector(selector);
      }
      
      if (element) {
        console.log(`✅ Found element for selector: ${selector}`, element);
        setElementFound(true);
        retryCount.current = 0;
        return element;
      } else {
        console.log(`❌ Element not found for selector: ${selector}, retry ${retryCount.current + 1}/${maxRetries}`);
        setElementFound(false);
      }
    } catch (error) {
      console.error(`Error finding element with selector ${selector}:`, error);
      setElementFound(false);
    }
    
    if (retryCount.current < maxRetries) {
      retryCount.current++;
      setTimeout(() => {
        const retryElement = isMobile && isMobileTarget && isMobileMenuOpen
          ? document.querySelector('.md\\:hidden.mt-6')?.querySelector(selector)
          : document.querySelector(selector);
          
        if (retryElement) {
          setTargetRect(retryElement.getBoundingClientRect());
          retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setElementFound(true);
        }
      }, 300);
    }
    
    return null;
  }, [isMobile, isMobileMenuOpen]);

  // Update target position when step changes or on scroll/resize
  const updateTargetPosition = useCallback(async () => {
    const step = steps[currentStep];
    if (step && step.targetSelector && isVisible) {
      console.log(`Looking for step ${currentStep + 1}: ${step.title} with selector: ${step.targetSelector}`);
      
      // On mobile, open the menu first if needed
      if (isMobile) {
        await openMobileMenu();
        // Small delay for menu to settle
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const isMobileTarget = isMobile;
      const targetElement = findElementWithRetry(step.targetSelector, isMobileTarget);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        console.log(`Element position: top=${rect.top}, left=${rect.left}, width=${rect.width}, height=${rect.height}`);
        setTargetRect(rect);
        
        // On mobile, determine if tooltip should be above or below
        if (isMobile) {
          const spaceAbove = rect.top;
          const spaceBelow = window.innerHeight - rect.bottom;
          setTooltipPosition(spaceAbove > spaceBelow ? 'top' : 'bottom');
        }
        
        // Scroll element into view smoothly
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    }
  }, [currentStep, steps, isVisible, findElementWithRetry, isMobile, openMobileMenu]);

  useEffect(() => {
    if (isVisible) {
      updateTargetPosition();
      window.addEventListener('scroll', updateTargetPosition);
      window.addEventListener('resize', updateTargetPosition);
      
      const observer = new MutationObserver(() => {
        updateTargetPosition();
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      
      return () => {
        window.removeEventListener('scroll', updateTargetPosition);
        window.removeEventListener('resize', updateTargetPosition);
        observer.disconnect();
        // Don't close menu when component unmounts to avoid interference
      };
    }
  }, [updateTargetPosition, isVisible]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      retryCount.current = 0;
      setElementFound(true);
      // Small delay before updating position
      setTimeout(() => updateTargetPosition(), 200);
    } else {
      handleComplete();
    }
  };

  const handlePrev = async () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      retryCount.current = 0;
      setElementFound(true);
      setTimeout(() => updateTargetPosition(), 200);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    // Close mobile menu when tour completes
    if (isMobile && isMobileMenuOpen) {
      closeMobileMenu();
    }
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    // Close mobile menu when tour is skipped
    if (isMobile && isMobileMenuOpen) {
      closeMobileMenu();
    }
    setIsVisible(false);
    onSkip?.();
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        bottom: isMobile ? '10px' : '20px',
        left: isMobile ? '10px' : 'auto',
        right: isMobile ? '10px' : 'auto',
        width: isMobile ? 'calc(100% - 20px)' : '360px',
        maxWidth: isMobile ? 'none' : '360px',
        zIndex: 9999,
      };
    }

    if (isMobile) {
      const spacing = 10;
      let top: number;
      
      if (tooltipPosition === 'top') {
        top = targetRect.top - 220;
      } else {
        top = targetRect.bottom + spacing;
      }
      
      const boundedTop = Math.max(10, Math.min(top, window.innerHeight - 200));
      
      return {
        position: 'fixed',
        top: boundedTop,
        left: '10px',
        right: '10px',
        width: 'calc(100% - 20px)',
        maxWidth: 'none',
        zIndex: 9999,
      };
    }

    const position = steps[currentStep]?.position || 'bottom';
    const spacing = 20;
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - spacing - 220;
        left = targetRect.left + targetRect.width / 2 - 180;
        break;
      case 'bottom':
        top = targetRect.bottom + spacing;
        left = targetRect.left + targetRect.width / 2 - 180;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - 120;
        left = targetRect.left - spacing - 360;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - 120;
        left = targetRect.right + spacing;
        break;
    }

    const boundedTop = Math.max(10, Math.min(top, window.innerHeight - 260));
    const boundedLeft = Math.max(10, Math.min(left, window.innerWidth - 380));

    return {
      position: 'fixed',
      top: boundedTop,
      left: boundedLeft,
      maxWidth: '360px',
      zIndex: 9999,
    };
  };

  const HighlightOverlay = () => {
    if (!targetRect || !steps[currentStep]?.targetSelector || !isVisible) return null;

    return (
      <>
        <div
          className="fixed inset-0 pointer-events-none z-9998"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        />
        
        <div
          className="fixed pointer-events-none z-9999"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        >
          <div 
            className="absolute inset-0 rounded-lg bg-transparent"
            style={{
              boxShadow: '0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3)',
              animation: 'pulse 2s infinite',
            }}
          />
          {!isMobile && (
            <div className="absolute -right-8 -top-8 animate-bounce">
              <MousePointer className="text-green-500" size={24} />
            </div>
          )}
          {isMobile && !isMobileMenuOpen && (
            <div className="absolute -left-8 -top-8 animate-bounce">
              <Menu className="text-green-500" size={20} />
            </div>
          )}
        </div>
      </>
    );
  };

  // Mobile-friendly All Steps Modal
  const AllStepsModal = () => {
    if (!showAllSteps) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-10000 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="flex items-center gap-2 sm:gap-3">
              <Compass className="text-green-600" size={isMobile ? 20 : 24} />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Navigation Guide</h3>
            </div>
            <button
              onClick={() => setShowAllSteps(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 sm:p-5 overflow-y-auto max-h-[60vh]">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tap on any step below to see where to find it:
            </p>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={async () => {
                    setShowAllSteps(false);
                    setCurrentStep(idx);
                    retryCount.current = 0;
                    setTimeout(() => updateTargetPosition(), 200);
                  }}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all active:scale-98 ${
                    idx === currentStep
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm sm:text-base ${
                        idx === currentStep
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={() => setShowAllSteps(false)}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold active:scale-98 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      <HighlightOverlay />
      <AllStepsModal />
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3);
          }
          50% {
            box-shadow: 0 0 0 3px #10b981, 0 0 0 12px rgba(16,185,129,0.1);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .active\\:scale-98:active {
            transform: scale(0.98);
          }
        }
      `}</style>
      
      <AnimatePresence>
        <motion.div
          key="tour-tooltip"
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: isMobile ? 0.95 : 0.9, y: isMobile ? 20 : 0 }}
          transition={{ duration: 0.25 }}
          style={getTooltipStyle()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-green-500 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                <MapPin className="relative text-green-600" size={isMobile ? 14 : 18} />
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllSteps(true)}
                className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors px-2 py-1"
              >
                {isMobile ? 'Menu' : 'View All'}
              </button>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Navigation className="text-green-600" size={isMobile ? 16 : 20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                {isMobile && !isMobileMenuOpen && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Menu size={14} />
                    <span>Opening menu to show you where to find this...</span>
                  </div>
                )}
                {!elementFound && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                    <span>⚠️</span>
                    <span>Looking for this navigation item...</span>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {isMobile ? (
                    <Menu size={14} className="text-green-500" />
                  ) : (
                    <MousePointer size={14} className="text-green-500" />
                  )}
                  <span>
                    {isMobile 
                      ? `Tap the ${step.id === 'ai-chatbot' ? 'chat button' : 'menu item'} above to explore` 
                      : 'Click the highlighted button above to explore this section'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 px-4 sm:px-5 py-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  retryCount.current = 0;
                  setTimeout(() => updateTargetPosition(), 200);
                }}
                className={`h-1.5 rounded-full transition-all touch-manipulation ${
                  idx === currentStep
                    ? 'w-6 bg-green-500'
                    : idx < currentStep
                    ? 'w-1.5 bg-green-300'
                    : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all touch-manipulation ${
                isFirstStep
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200'
              }`}
            >
              <ChevronLeft size={16} />
              {!isMobile && 'Back'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-manipulation"
              >
                <SkipForward size={14} />
                {!isMobile && 'Skip Tour'}
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg active:scale-95 transition-all shadow-sm touch-manipulation"
              >
                {isLastStep ? '🎉 Finish' : (isMobile ? 'Next' : 'Next Step')}
                {!isLastStep && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}


// // app/components/GuidedTour.tsx (mobile responsive)
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { usePathname } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   X, ChevronRight, ChevronLeft, SkipForward, 
//   Navigation, MapPin, Compass, MousePointer, ChevronUp, ChevronDown
// } from 'lucide-react';

// export interface TourStep {
//   id: string;
//   title: string;
//   description: string;
//   targetSelector: string;
//   position?: 'top' | 'bottom' | 'left' | 'right';
// }

// interface GuidedTourProps {
//   steps: TourStep[];
//   onComplete?: () => void;
//   onSkip?: () => void;
//   storageKey?: string;
//   autoStart?: boolean;
// }

// export default function GuidedTour({ 
//   steps, 
//   onComplete, 
//   onSkip, 
//   storageKey = 'guided-tour-completed',
//   autoStart = true 
// }: GuidedTourProps) {
//   const pathname = usePathname();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
//   const [showAllSteps, setShowAllSteps] = useState(false);
//   const [elementFound, setElementFound] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('bottom');
//   const retryCount = useRef(0);
//   const maxRetries = 15;

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Check if user has seen the tour before
//   useEffect(() => {
//     const hasCompleted = localStorage.getItem(storageKey);
//     if (autoStart && !hasCompleted) {
//       setTimeout(() => setIsVisible(true), 800);
//     }
//   }, [storageKey, autoStart]);

//   // Find element with retry mechanism
//   const findElementWithRetry = useCallback((selector: string): Element | null => {
//     try {
//       const element = document.querySelector(selector);
//       if (element) {
//         console.log(`✅ Found element for selector: ${selector}`, element);
//         setElementFound(true);
//         retryCount.current = 0;
//         return element;
//       } else {
//         console.log(`❌ Element not found for selector: ${selector}, retry ${retryCount.current + 1}/${maxRetries}`);
//         setElementFound(false);
//       }
//     } catch (error) {
//       console.error(`Error finding element with selector ${selector}:`, error);
//       setElementFound(false);
//     }
    
//     if (retryCount.current < maxRetries) {
//       retryCount.current++;
//       setTimeout(() => {
//         const retryElement = document.querySelector(selector);
//         if (retryElement) {
//           setTargetRect(retryElement.getBoundingClientRect());
//           retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           setElementFound(true);
//         }
//       }, 300);
//     }
    
//     return null;
//   }, []);

//   // Update target position when step changes or on scroll/resize
//   const updateTargetPosition = useCallback(() => {
//     const step = steps[currentStep];
//     if (step && step.targetSelector && isVisible) {
//       console.log(`Looking for step ${currentStep + 1}: ${step.title} with selector: ${step.targetSelector}`);
//       const targetElement = findElementWithRetry(step.targetSelector);
//       if (targetElement) {
//         const rect = targetElement.getBoundingClientRect();
//         console.log(`Element position: top=${rect.top}, left=${rect.left}, width=${rect.width}, height=${rect.height}`);
//         setTargetRect(rect);
        
//         // On mobile, determine if tooltip should be above or below
//         if (isMobile) {
//           const spaceAbove = rect.top;
//           const spaceBelow = window.innerHeight - rect.bottom;
//           setTooltipPosition(spaceAbove > spaceBelow ? 'top' : 'bottom');
//         }
        
//         // Scroll element into view smoothly
//         targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       } else {
//         setTargetRect(null);
//       }
//     }
//   }, [currentStep, steps, isVisible, findElementWithRetry, isMobile]);

//   useEffect(() => {
//     if (isVisible) {
//       updateTargetPosition();
//       window.addEventListener('scroll', updateTargetPosition);
//       window.addEventListener('resize', updateTargetPosition);
      
//       const observer = new MutationObserver(() => {
//         updateTargetPosition();
//       });
//       observer.observe(document.body, { childList: true, subtree: true });
      
//       return () => {
//         window.removeEventListener('scroll', updateTargetPosition);
//         window.removeEventListener('resize', updateTargetPosition);
//         observer.disconnect();
//       };
//     }
//   }, [updateTargetPosition, isVisible]);

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//       retryCount.current = 0;
//       setElementFound(true);
//       setTimeout(updateTargetPosition, 150);
//     } else {
//       handleComplete();
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//       retryCount.current = 0;
//       setElementFound(true);
//       setTimeout(updateTargetPosition, 150);
//     }
//   };

//   const handleComplete = () => {
//     localStorage.setItem(storageKey, 'true');
//     setIsVisible(false);
//     onComplete?.();
//   };

//   const handleSkip = () => {
//     localStorage.setItem(storageKey, 'true');
//     setIsVisible(false);
//     onSkip?.();
//   };

//   const getTooltipStyle = (): React.CSSProperties => {
//     if (!targetRect) {
//       return {
//         position: 'fixed',
//         bottom: isMobile ? '10px' : '20px',
//         left: isMobile ? '10px' : 'auto',
//         right: isMobile ? '10px' : 'auto',
//         width: isMobile ? 'calc(100% - 20px)' : '360px',
//         maxWidth: isMobile ? 'none' : '360px',
//         zIndex: 9999,
//       };
//     }

//     if (isMobile) {
//       // Mobile positioning - full width at top or bottom of screen
//       const spacing = 10;
//       let top: number;
      
//       if (tooltipPosition === 'top') {
//         top = targetRect.top - 200;
//       } else {
//         top = targetRect.bottom + spacing;
//       }
      
//       // Keep within viewport
//       const boundedTop = Math.max(10, Math.min(top, window.innerHeight - 200));
      
//       return {
//         position: 'fixed',
//         top: boundedTop,
//         left: '10px',
//         right: '10px',
//         width: 'calc(100% - 20px)',
//         maxWidth: 'none',
//         zIndex: 9999,
//       };
//     }

//     // Desktop positioning
//     const position = steps[currentStep]?.position || 'bottom';
//     const spacing = 20;
//     let top = 0;
//     let left = 0;

//     switch (position) {
//       case 'top':
//         top = targetRect.top - spacing - 220;
//         left = targetRect.left + targetRect.width / 2 - 180;
//         break;
//       case 'bottom':
//         top = targetRect.bottom + spacing;
//         left = targetRect.left + targetRect.width / 2 - 180;
//         break;
//       case 'left':
//         top = targetRect.top + targetRect.height / 2 - 120;
//         left = targetRect.left - spacing - 360;
//         break;
//       case 'right':
//         top = targetRect.top + targetRect.height / 2 - 120;
//         left = targetRect.right + spacing;
//         break;
//     }

//     const boundedTop = Math.max(10, Math.min(top, window.innerHeight - 260));
//     const boundedLeft = Math.max(10, Math.min(left, window.innerWidth - 380));

//     return {
//       position: 'fixed',
//       top: boundedTop,
//       left: boundedLeft,
//       maxWidth: '360px',
//       zIndex: 9999,
//     };
//   };

//   const HighlightOverlay = () => {
//     if (!targetRect || !steps[currentStep]?.targetSelector || !isVisible) return null;

//     return (
//       <>
//         <div
//           className="fixed inset-0 pointer-events-none z-9998"
//           style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
//         />
        
//         <div
//           className="fixed pointer-events-none z-9999"
//           style={{
//             top: targetRect.top - 8,
//             left: targetRect.left - 8,
//             width: targetRect.width + 16,
//             height: targetRect.height + 16,
//           }}
//         >
//           <div 
//             className="absolute inset-0 rounded-lg bg-transparent"
//             style={{
//               boxShadow: '0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3)',
//               animation: 'pulse 2s infinite',
//             }}
//           />
//           {!isMobile && (
//             <div className="absolute -right-8 -top-8 animate-bounce">
//               <MousePointer className="text-green-500" size={24} />
//             </div>
//           )}
//         </div>
//       </>
//     );
//   };

//   // Mobile-friendly All Steps Modal
//   const AllStepsModal = () => {
//     if (!showAllSteps) return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-10000 flex items-center justify-center p-4"
//         style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
//       >
//         <motion.div
//           initial={{ scale: 0.9, y: 20 }}
//           animate={{ scale: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
//         >
//           <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <Compass className="text-green-600" size={isMobile ? 20 : 24} />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Navigation Guide</h3>
//             </div>
//             <button
//               onClick={() => setShowAllSteps(false)}
//               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
//             >
//               <X size={20} />
//             </button>
//           </div>
          
//           <div className="p-4 sm:p-5 overflow-y-auto max-h-[60vh]">
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//               Tap on any step below to see where to find it:
//             </p>
//             <div className="space-y-3">
//               {steps.map((step, idx) => (
//                 <button
//                   key={step.id}
//                   onClick={() => {
//                     setShowAllSteps(false);
//                     setCurrentStep(idx);
//                     retryCount.current = 0;
//                     setTimeout(updateTargetPosition, 150);
//                   }}
//                   className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all active:scale-98 ${
//                     idx === currentStep
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-500'
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm ${
//                       idx === currentStep
//                         ? 'bg-green-500 text-white'
//                         : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
//                     }`}>
//                       {idx + 1}
//                     </div>
//                     <div className="flex-1">
//                       <h4 className={`font-semibold text-sm sm:text-base ${
//                         idx === currentStep
//                           ? 'text-green-700 dark:text-green-400'
//                           : 'text-gray-900 dark:text-white'
//                       }`}>
//                         {step.title}
//                       </h4>
//                       <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
//                         {step.description}
//                       </p>
//                     </div>
//                     <ChevronRight size={16} className="text-gray-400" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//             <button
//               onClick={() => setShowAllSteps(false)}
//               className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold active:scale-98 transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   if (!isVisible) return null;

//   const step = steps[currentStep];
//   const isFirstStep = currentStep === 0;
//   const isLastStep = currentStep === steps.length - 1;

//   return (
//     <>
//       <HighlightOverlay />
//       <AllStepsModal />
      
//       <style jsx global>{`
//         @keyframes pulse {
//           0%, 100% {
//             box-shadow: 0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3);
//           }
//           50% {
//             box-shadow: 0 0 0 3px #10b981, 0 0 0 12px rgba(16,185,129,0.1);
//           }
//         }
//         @keyframes slideUp {
//           from {
//             transform: translateY(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//         @media (max-width: 768px) {
//           .active\\:scale-98:active {
//             transform: scale(0.98);
//           }
//         }
//       `}</style>
      
//       <AnimatePresence>
//         <motion.div
//           key="tour-tooltip"
//           initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9, y: isMobile ? 20 : 0 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: isMobile ? 0.95 : 0.9, y: isMobile ? 20 : 0 }}
//           transition={{ duration: 0.25 }}
//           style={getTooltipStyle()}
//           className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-green-500 overflow-hidden"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
//                 <MapPin className="relative text-green-600" size={isMobile ? 14 : 18} />
//               </div>
//               <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
//                 Step {currentStep + 1} of {steps.length}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowAllSteps(true)}
//                 className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors px-2 py-1"
//               >
//                 {isMobile ? 'Menu' : 'View All'}
//               </button>
//               <button
//                 onClick={handleSkip}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-4 sm:p-5">
//             <div className="flex items-start gap-3">
//               <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
//                 <Navigation className="text-green-600" size={isMobile ? 16 : 20} />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
//                   {step.title}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
//                   {step.description}
//                 </p>
//                 {!elementFound && (
//                   <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
//                     <span>⚠️</span>
//                     <span>Looking for this navigation item...</span>
//                   </div>
//                 )}
//                 <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
//                   {isMobile ? (
//                     <ChevronUp size={14} className="text-green-500" />
//                   ) : (
//                     <MousePointer size={14} className="text-green-500" />
//                   )}
//                   <span>
//                     {isMobile 
//                       ? `Tap the ${step.id === 'ai-chatbot' ? 'button' : 'link'} above to explore` 
//                       : 'Click the highlighted button above to explore this section'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Progress Dots */}
//           <div className="flex justify-center gap-1.5 px-4 sm:px-5 py-2">
//             {steps.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   setCurrentStep(idx);
//                   retryCount.current = 0;
//                   setTimeout(updateTargetPosition, 150);
//                 }}
//                 className={`h-1.5 rounded-full transition-all touch-manipulation ${
//                   idx === currentStep
//                     ? 'w-6 bg-green-500'
//                     : idx < currentStep
//                     ? 'w-1.5 bg-green-300'
//                     : 'w-1.5 bg-gray-300 dark:bg-gray-600'
//                 }`}
//               />
//             ))}
//           </div>

//           {/* Footer - Mobile optimized */}
//           <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
//             <button
//               onClick={handlePrev}
//               disabled={isFirstStep}
//               className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all touch-manipulation ${
//                 isFirstStep
//                   ? 'text-gray-400 cursor-not-allowed'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200'
//               }`}
//             >
//               <ChevronLeft size={16} />
//               {!isMobile && 'Back'}
//             </button>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSkip}
//                 className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-manipulation"
//               >
//                 <SkipForward size={14} />
//                 {!isMobile && 'Skip Tour'}
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg active:scale-95 transition-all shadow-sm touch-manipulation"
//               >
//                 {isLastStep ? '🎉 Finish' : (isMobile ? 'Next' : 'Next Step')}
//                 {!isLastStep && <ChevronRight size={16} />}
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </>
//   );
// }


// // 'use client';

// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { usePathname } from 'next/navigation';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { 
// //   X, ChevronRight, ChevronLeft, SkipForward, 
// //   Navigation, MapPin, Compass, MousePointer 
// // } from 'lucide-react';

// // export interface TourStep {
// //   id: string;
// //   title: string;
// //   description: string;
// //   targetSelector: string;
// //   position?: 'top' | 'bottom' | 'left' | 'right';
// // }

// // interface GuidedTourProps {
// //   steps: TourStep[];
// //   onComplete?: () => void;
// //   onSkip?: () => void;
// //   storageKey?: string;
// //   autoStart?: boolean;
// // }

// // export default function GuidedTour({ 
// //   steps, 
// //   onComplete, 
// //   onSkip, 
// //   storageKey = 'guided-tour-completed',
// //   autoStart = true 
// // }: GuidedTourProps) {
// //   const pathname = usePathname();
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [isVisible, setIsVisible] = useState(false);
// //   const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
// //   const [showAllSteps, setShowAllSteps] = useState(false);
// //   const [elementFound, setElementFound] = useState(true);
// //   const retryCount = useRef(0);
// //   const maxRetries = 15;

// //   // Check if user has seen the tour before
// //   useEffect(() => {
// //     const hasCompleted = localStorage.getItem(storageKey);
// //     if (autoStart && !hasCompleted) {
// //       // Small delay to ensure DOM is ready
// //       setTimeout(() => setIsVisible(true), 800);
// //     }
// //   }, [storageKey, autoStart]);

// //   // Find element with retry mechanism
// //   const findElementWithRetry = useCallback((selector: string): Element | null => {
// //     try {
// //       const element = document.querySelector(selector);
// //       if (element) {
// //         console.log(`✅ Found element for selector: ${selector}`, element);
// //         setElementFound(true);
// //         retryCount.current = 0;
// //         return element;
// //       } else {
// //         console.log(`❌ Element not found for selector: ${selector}, retry ${retryCount.current + 1}/${maxRetries}`);
// //         setElementFound(false);
// //       }
// //     } catch (error) {
// //       console.error(`Error finding element with selector ${selector}:`, error);
// //       setElementFound(false);
// //     }
    
// //     // If element not found and we haven't exceeded max retries, try again
// //     if (retryCount.current < maxRetries) {
// //       retryCount.current++;
// //       setTimeout(() => {
// //         const retryElement = document.querySelector(selector);
// //         if (retryElement) {
// //           setTargetRect(retryElement.getBoundingClientRect());
// //           retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
// //           setElementFound(true);
// //         }
// //       }, 300);
// //     }
    
// //     return null;
// //   }, []);

// //   // Update target position when step changes or on scroll/resize
// //   const updateTargetPosition = useCallback(() => {
// //     const step = steps[currentStep];
// //     if (step && step.targetSelector && isVisible) {
// //       console.log(`Looking for step ${currentStep + 1}: ${step.title} with selector: ${step.targetSelector}`);
// //       const targetElement = findElementWithRetry(step.targetSelector);
// //       if (targetElement) {
// //         const rect = targetElement.getBoundingClientRect();
// //         console.log(`Element position: top=${rect.top}, left=${rect.left}, width=${rect.width}, height=${rect.height}`);
// //         setTargetRect(rect);
// //         // Scroll the navbar link into view if needed
// //         targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
// //       } else {
// //         setTargetRect(null);
// //       }
// //     }
// //   }, [currentStep, steps, isVisible, findElementWithRetry]);

// //   useEffect(() => {
// //     if (isVisible) {
// //       // Initial update
// //       updateTargetPosition();
      
// //       // Set up event listeners
// //       window.addEventListener('scroll', updateTargetPosition);
// //       window.addEventListener('resize', updateTargetPosition);
      
// //       // Also update when DOM changes (for dynamic content)
// //       const observer = new MutationObserver(() => {
// //         updateTargetPosition();
// //       });
// //       observer.observe(document.body, { childList: true, subtree: true });
      
// //       return () => {
// //         window.removeEventListener('scroll', updateTargetPosition);
// //         window.removeEventListener('resize', updateTargetPosition);
// //         observer.disconnect();
// //       };
// //     }
// //   }, [updateTargetPosition, isVisible]);

// //   const handleNext = () => {
// //     if (currentStep < steps.length - 1) {
// //       setCurrentStep(currentStep + 1);
// //       retryCount.current = 0;
// //       setElementFound(true);
// //       setTimeout(updateTargetPosition, 150);
// //     } else {
// //       handleComplete();
// //     }
// //   };

// //   const handlePrev = () => {
// //     if (currentStep > 0) {
// //       setCurrentStep(currentStep - 1);
// //       retryCount.current = 0;
// //       setElementFound(true);
// //       setTimeout(updateTargetPosition, 150);
// //     }
// //   };

// //   const handleComplete = () => {
// //     localStorage.setItem(storageKey, 'true');
// //     setIsVisible(false);
// //     onComplete?.();
// //   };

// //   const handleSkip = () => {
// //     localStorage.setItem(storageKey, 'true');
// //     setIsVisible(false);
// //     onSkip?.();
// //   };

// //   const getTooltipStyle = (): React.CSSProperties => {
// //     if (!targetRect) {
// //       return {
// //         position: 'fixed',
// //         bottom: '20px',
// //         right: '20px',
// //         maxWidth: '360px',
// //         zIndex: 9999,
// //       };
// //     }

// //     const position = steps[currentStep]?.position || 'bottom';
// //     const spacing = 20;
// //     let top = 0;
// //     let left = 0;

// //     switch (position) {
// //       case 'top':
// //         top = targetRect.top - spacing - 220;
// //         left = targetRect.left + targetRect.width / 2 - 180;
// //         break;
// //       case 'bottom':
// //         top = targetRect.bottom + spacing;
// //         left = targetRect.left + targetRect.width / 2 - 180;
// //         break;
// //       case 'left':
// //         top = targetRect.top + targetRect.height / 2 - 120;
// //         left = targetRect.left - spacing - 360;
// //         break;
// //       case 'right':
// //         top = targetRect.top + targetRect.height / 2 - 120;
// //         left = targetRect.right + spacing;
// //         break;
// //     }

// //     // Keep tooltip within viewport bounds
// //     const boundedTop = Math.max(10, Math.min(top, window.innerHeight - 260));
// //     const boundedLeft = Math.max(10, Math.min(left, window.innerWidth - 380));

// //     return {
// //       position: 'fixed',
// //       top: boundedTop,
// //       left: boundedLeft,
// //       maxWidth: '360px',
// //       zIndex: 9999,
// //     };
// //   };

// //   const HighlightOverlay = () => {
// //     if (!targetRect || !steps[currentStep]?.targetSelector || !isVisible) return null;

// //     return (
// //       <>
// //         {/* Dark overlay */}
// //         <div
// //           className="fixed inset-0 pointer-events-none z-9998"
// //           style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
// //         />
        
// //         {/* Highlighted element with glow */}
// //         <div
// //           className="fixed pointer-events-none z-9999"
// //           style={{
// //             top: targetRect.top - 8,
// //             left: targetRect.left - 8,
// //             width: targetRect.width + 16,
// //             height: targetRect.height + 16,
// //           }}
// //         >
// //           <div 
// //             className="absolute inset-0 rounded-lg bg-transparent"
// //             style={{
// //               boxShadow: '0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3)',
// //               animation: 'pulse 2s infinite',
// //             }}
// //           />
// //           {/* Animated cursor click indicator */}
// //           <div
// //             className="absolute -right-8 -top-8 animate-bounce"
// //           >
// //             <MousePointer className="text-green-500" size={24} />
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   // All Steps Modal
// //   const AllStepsModal = () => {
// //     if (!showAllSteps) return null;

// //     return (
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         exit={{ opacity: 0 }}
// //         className="fixed inset-0 z-10000 flex items-center justify-center p-4"
// //         style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
// //       >
// //         <motion.div
// //           initial={{ scale: 0.9, y: 20 }}
// //           animate={{ scale: 1, y: 0 }}
// //           className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
// //         >
// //           <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
// //             <div className="flex items-center gap-3">
// //               <Compass className="text-green-600" size={24} />
// //               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Navigation Guide</h3>
// //             </div>
// //             <button
// //               onClick={() => setShowAllSteps(false)}
// //               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
// //             >
// //               <X size={20} />
// //             </button>
// //           </div>
          
// //           <div className="p-5 overflow-y-auto max-h-[60vh]">
// //             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
// //               Click on any step below to see where to find it in the navigation bar:
// //             </p>
// //             <div className="space-y-3">
// //               {steps.map((step, idx) => (
// //                 <button
// //                   key={step.id}
// //                   onClick={() => {
// //                     setShowAllSteps(false);
// //                     setCurrentStep(idx);
// //                     retryCount.current = 0;
// //                     setTimeout(updateTargetPosition, 150);
// //                   }}
// //                   className={`w-full text-left p-4 rounded-xl border transition-all group ${
// //                     idx === currentStep
// //                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
// //                       : 'border-gray-200 dark:border-gray-700 hover:border-green-500 hover:shadow-md'
// //                   }`}
// //                 >
// //                   <div className="flex items-start gap-3">
// //                     <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
// //                       idx === currentStep
// //                         ? 'bg-green-500 text-white'
// //                         : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
// //                     }`}>
// //                       {idx + 1}
// //                     </div>
// //                     <div className="flex-1">
// //                       <h4 className={`font-semibold ${
// //                         idx === currentStep
// //                           ? 'text-green-700 dark:text-green-400'
// //                           : 'text-gray-900 dark:text-white'
// //                       }`}>
// //                         {step.title}
// //                       </h4>
// //                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
// //                         {step.description}
// //                       </p>
// //                     </div>
// //                     <ChevronRight size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
// //                   </div>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
          
// //           <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
// //             <button
// //               onClick={() => setShowAllSteps(false)}
// //               className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
// //             >
// //               Close
// //             </button>
// //           </div>
// //         </motion.div>
// //       </motion.div>
// //     );
// //   };

// //   if (!isVisible) return null;

// //   const step = steps[currentStep];
// //   const isFirstStep = currentStep === 0;
// //   const isLastStep = currentStep === steps.length - 1;

// //   return (
// //     <>
// //       <HighlightOverlay />
// //       <AllStepsModal />
      
// //       {/* Add animation keyframes to global CSS */}
// //       <style jsx global>{`
// //         @keyframes pulse {
// //           0%, 100% {
// //             box-shadow: 0 0 0 3px #10b981, 0 0 0 6px rgba(16,185,129,0.3);
// //           }
// //           50% {
// //             box-shadow: 0 0 0 3px #10b981, 0 0 0 12px rgba(16,185,129,0.1);
// //           }
// //         }
// //       `}</style>
      
// //       <AnimatePresence>
// //         <motion.div
// //           key="tour-tooltip"
// //           initial={{ opacity: 0, scale: 0.9, y: 20 }}
// //           animate={{ opacity: 1, scale: 1, y: 0 }}
// //           exit={{ opacity: 0, scale: 0.9, y: 20 }}
// //           transition={{ duration: 0.25 }}
// //           style={getTooltipStyle()}
// //           className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-green-500 overflow-hidden"
// //         >
// //           {/* Header */}
// //           <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
// //             <div className="flex items-center gap-3">
// //               <div className="relative">
// //                 <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
// //                 <MapPin className="relative text-green-600" size={18} />
// //               </div>
// //               <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
// //                 Step {currentStep + 1} of {steps.length}
// //               </span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => setShowAllSteps(true)}
// //                 className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
// //               >
// //                 View All
// //               </button>
// //               <button
// //                 onClick={handleSkip}
// //                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-2"
// //               >
// //                 <X size={18} />
// //               </button>
// //             </div>
// //           </div>

// //           {/* Content */}
// //           <div className="p-5">
// //             <div className="flex items-start gap-3">
// //               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
// //                 <Navigation className="text-green-600" size={20} />
// //               </div>
// //               <div className="flex-1">
// //                 <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
// //                   {step.title}
// //                 </h3>
// //                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
// //                   {step.description}
// //                 </p>
// //                 {!elementFound && (
// //                   <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
// //                     <span>⚠️</span>
// //                     <span>Looking for this navigation item...</span>
// //                   </div>
// //                 )}
// //                 <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
// //                   <MousePointer size={14} className="text-green-500" />
// //                   <span>Click the highlighted button above to explore this section</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Progress Dots */}
// //           <div className="flex justify-center gap-1.5 px-5 py-2">
// //             {steps.map((_, idx) => (
// //               <button
// //                 key={idx}
// //                 onClick={() => {
// //                   setCurrentStep(idx);
// //                   retryCount.current = 0;
// //                   setTimeout(updateTargetPosition, 150);
// //                 }}
// //                 className={`h-1.5 rounded-full transition-all ${
// //                   idx === currentStep
// //                     ? 'w-6 bg-green-500'
// //                     : idx < currentStep
// //                     ? 'w-1.5 bg-green-300'
// //                     : 'w-1.5 bg-gray-300 dark:bg-gray-600'
// //                 }`}
// //               />
// //             ))}
// //           </div>

// //           {/* Footer */}
// //           <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
// //             <button
// //               onClick={handlePrev}
// //               disabled={isFirstStep}
// //               className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
// //                 isFirstStep
// //                   ? 'text-gray-400 cursor-not-allowed'
// //                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
// //               }`}
// //             >
// //               <ChevronLeft size={16} />
// //               Back
// //             </button>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={handleSkip}
// //                 className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
// //               >
// //                 <SkipForward size={14} />
// //                 Skip Tour
// //               </button>
// //               <button
// //                 onClick={handleNext}
// //                 className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm"
// //               >
// //                 {isLastStep ? '🎉 Finish Tour' : 'Next Step'}
// //                 {!isLastStep && <ChevronRight size={16} />}
// //               </button>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </AnimatePresence>
// //     </>
// //   );
// // }

