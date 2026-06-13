// app/components/OnboardingGuide.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  targetId?: string; // Optional: ID of element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingGuideProps {
  steps: GuideStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
  showProgress?: boolean;
  highlightTargets?: boolean;
}

export default function OnboardingGuide({
  steps,
  onComplete,
  onSkip,
  storageKey = 'onboarding-completed',
  showProgress = true,
  highlightTargets = true,
}: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Check if user has seen onboarding before
  useEffect(() => {
    const hasCompleted = localStorage.getItem(storageKey);
    if (!hasCompleted) {
      setIsVisible(true);
    }
  }, [storageKey]);

  // Get target element position
  useEffect(() => {
    if (highlightTargets && steps[currentStep]?.targetId) {
      const targetElement = document.getElementById(steps[currentStep].targetId!);
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, highlightTargets, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onSkip?.();
  };

  const handleShowAllSteps = () => {
    // Scroll through all steps in a modal or expand view
    const stepsText = steps.map((step, idx) => 
      `${idx + 1}. ${step.title}\n   ${step.description}`
    ).join('\n\n');
    alert('📋 All Steps:\n\n' + stepsText);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Calculate tooltip position based on target
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        maxWidth: '320px',
        zIndex: 9999,
      };
    }

    const position = steps[currentStep].position || 'bottom';
    const spacing = 16;
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - spacing - 200;
        left = targetRect.left + targetRect.width / 2 - 160;
        break;
      case 'bottom':
        top = targetRect.bottom + spacing;
        left = targetRect.left + targetRect.width / 2 - 160;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - 100;
        left = targetRect.left - spacing - 320;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - 100;
        left = targetRect.right + spacing;
        break;
    }

    return {
      position: 'fixed',
      top: Math.max(10, Math.min(top, window.innerHeight - 220)),
      left: Math.max(10, Math.min(left, window.innerWidth - 330)),
      maxWidth: '320px',
      zIndex: 9999,
    };
  };

  // Highlight overlay for target elements
  const HighlightOverlay = () => {
    if (!highlightTargets || !targetRect || !steps[currentStep]?.targetId) return null;

    return (
      <div
        className="fixed inset-0 pointer-events-none z-9998"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div
          className="absolute bg-transparent rounded-lg shadow-2xl"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5), 0 0 0 3px #3b82f6',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    );
  };

  return (
    <>
      <HighlightOverlay />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          style={getTooltipStyle()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress Bar (optional) */}
          {showProgress && (
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={handleShowAllSteps}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline"
              >
                Show all steps
              </button>
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <SkipForward size={14} />
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}