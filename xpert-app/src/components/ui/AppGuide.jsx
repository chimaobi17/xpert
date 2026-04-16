import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppGuide } from '../../contexts/AppGuideContext';
import { SparklesIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import LightBulbOnIcon from '../icons/LightBulbOnIcon';
import clsx from 'clsx';
import Button from './Button';

const STEPS = [
  {
    title: "Welcome to Xpert",
    content: "Xpert is designed to make your work easier by giving you access to specialized AI assistants for almost any task. Let's take a quick look at how everything works.",
    target: null,
  },
  {
    title: "Step 1: Find your Helpers",
    content: "First, you'll want to pick the right assistant for your task. Click 'Find Helpers' in the sidebar to browse our full list of experts.",
    target: "#guide-discover",
    inSidebar: true,
  },
  {
    title: "Step 2: Add to your Team",
    content: "When you find an assistant that looks useful, just click it to add it to your personal workspace so you can use it whenever you need.",
    target: "#guide-agent-card",
  },
  {
    title: "Step 3: Your Workspace",
    content: "You can manage your chosen assistants here in 'My Helpers'. We've already added a few for you to try out right away.",
    target: "#guide-workspace",
    inSidebar: true,
  },
  {
    title: "Step 4: Start a Task",
    content: "Whenever you're ready to start, just click on any helper in your grid to enter its dedicated workspace.",
    target: "#guide-workspace-grid",
  },
  {
    title: "Step 5: Provide the Details",
    content: "You don't need to worry about writing complex prompts. Just fill in the simple fields and upload any documents the AI should look at.",
    target: "#guide-agent-form",
  },
  {
    title: "Step 6: Build the Instructions",
    content: "Once you click 'Continue', Xpert automatically drafts the most effective instructions for the AI based on your input.",
    target: "#guide-generate-btn",
  },
  {
    title: "Step 7: Review & Refine",
    content: "You can see the final instructions here. If everything looks good, use them as-is, or make any quick edits to get exactly what you want.",
    target: "#guide-review-options",
  },
  {
    title: "Step 8: Get your Result",
    content: "Click 'Send to AI' and our systems will process your request and give you a high-quality answer in seconds.",
    target: "#guide-submit-ai",
  },
  {
    title: "Step 9: Your Answer",
    content: "Your result appears right here. From here, you can copy the text, save it for later, or download any files the AI generated.",
    target: "#guide-ai-result",
  },
  {
    title: "Step 10: Need Help Again?",
    content: "If you ever need a refresher on how things work, just click the light bulb icon in the top navigation menu to restart this tour.",
    target: "#guide-tour-start",
  },
  {
    title: "You're all set!",
    content: "You're ready to start using Xpert. If you have any questions, feel free to check the help section or reach out to us.",
    target: null,
  }
];

export default function AppGuide() {
  const { currentStep, nextStep, prevStep, skipGuide, finishGuide, isActive } = useAppGuide();
  const [targetRect, setTargetRect] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isAutoToggling, setIsAutoToggling] = useState(false);
  const step = STEPS[currentStep];

  const cardRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Surgical Fix 1: Decouple smooth scrolling from UI updates to prevent jitter
  useEffect(() => {
    if (isActive && step?.target) {
      const el = document.querySelector(step.target);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive || !step?.target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      let targetSelector = step.target;

      // Unify Mobile Step 2 with Step 1 by explicitly pointing it at the Find Helpers sidebar tab
      if (isMobile && step.target === '#guide-agent-card') {
        targetSelector = '#guide-discover';
      }

      let el = document.querySelector(targetSelector);
      const isSidebarTarget = targetSelector?.includes('guide-discover') || targetSelector?.includes('guide-workspace') || targetSelector?.includes('guide-library');

      if (el) {
        const rect = el.getBoundingClientRect();

        // Surgical Fix 2: Coordinate sidebar toggles with layout awareness
        if (isMobile && !isAutoToggling) {
          const isSidebarVisible = rect.width > 0 && rect.left >= 0;

          if (isSidebarTarget && !isSidebarVisible) {
            const menuToggle = document.querySelector('#guide-menu-toggle');
            if (menuToggle) {
              setIsAutoToggling(true);
              menuToggle.click();
              setTimeout(() => setIsAutoToggling(false), 1000);
              return;
            }
          }
        }

        setTargetRect(rect);
      }
    };

    let rafId;
    const throttledUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateRect);
    };

    const timer = setTimeout(updateRect, 400);
    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('scroll', throttledUpdate, true);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate, true);
    };
  }, [isActive, step?.target, isMobile, currentStep, isAutoToggling]);

  if (!isActive) return null;

  const isLastStep = currentStep === STEPS.length - 1;

  const getPopoverStyle = () => {
    if (isMobile) {
      if (!targetRect) {
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92vw',
          maxWidth: '480px'
        };
      }

      // Mobile: 'Smart Below' - Go below if space exists, otherwise flip to top to stay in view
      const cardHeightEstimate = 320;
      const spaceBelow = window.innerHeight - targetRect.bottom;
      const topOffset = spaceBelow > cardHeightEstimate + 20
        ? targetRect.bottom + 8
        : Math.max(8, targetRect.top - cardHeightEstimate - 8);

      return {
        position: 'absolute',
        top: `${topOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92vw',
        maxWidth: '360px'
      };
    }

    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '500px'
      };
    }

    const popoverWidth = 480;
    const popoverHeight = 460;

    let top = targetRect.bottom + 20;
    if (top + popoverHeight > window.innerHeight) {
      top = targetRect.top - popoverHeight - 20;
      if (top < 20) top = Math.max(20, window.innerHeight - popoverHeight - 20);
    }

    let left = targetRect.left + (targetRect.width / 2) - (popoverWidth / 2);
    left = Math.max(20, Math.min(window.innerWidth - popoverWidth - 20, left));

    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`
    };
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Interaction Limiting Overlay */}
      <div
        className={clsx(
          "absolute transition-opacity duration-500 inset-0",
          step.target
            ? (isMobile ? "bg-background/60 backdrop-blur-sm" : "bg-black/40 backdrop-blur-[2px]")
            : "bg-background/80 backdrop-blur-md",
          // On mobile, universally block all underlying clicks. On desktop, only block when there's no target.
          (isMobile || !step.target) ? "pointer-events-auto" : "pointer-events-none"
        )}
        onClick={skipGuide}
      />

      {/* Target Highlight (Beacon) */}
      {targetRect && !isAutoToggling && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - (isMobile ? 4 : 8),
            left: targetRect.left - (isMobile ? 4 : 8),
            width: targetRect.width + (isMobile ? 8 : 16),
            height: targetRect.height + (isMobile ? 8 : 16),
          }}
        >
          <div className="absolute inset-0 rounded-xl border-2 border-primary-500 shadow-[0_0_30px_rgba(31,196,95,0.4)]" />
        </div>
      )}

      {/* Popover Card */}
      <div
        ref={cardRef}
        className="transition-all duration-500 pointer-events-auto"
        style={getPopoverStyle()}
      >
        <div className={clsx(
          "mx-auto bg-white dark:bg-surface border border-border/50 dark:border-border shadow-2xl animate-fade-in-up flex flex-col justify-between overflow-hidden relative w-full",
          isMobile
            ? "rounded-[1.5rem] p-5 sm:p-6 min-h-fit max-h-[85vh]"
            : "sm:rounded-[2rem] sm:p-8 sm:min-h-[440px] sm:w-[480px]"
        )}>
          <div className="flex-1 overflow-y-auto sm:overflow-hidden custom-scrollbar">
            <div className="flex items-center justify-between mb-5 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-lg shadow-primary-500/5 transition-transform hover:scale-105">
                  <LightBulbOnIcon className="h-5 w-5 sm:h-7 sm:w-7 animate-pulse" />
                </div>
                <div>
                  <p className="text-[clamp(0.65rem,2vw,0.75rem)] font-black uppercase tracking-[0.2em] text-primary-500 mb-0.5">XPERT Guide</p>
                  <p className="text-[clamp(0.55rem,1.5vw,0.65rem)] font-bold text-text-tertiary uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
              </div>
              <button 
                onClick={skipGuide} 
                className="p-2 -mr-2 text-text-tertiary hover:text-primary-500 transition-all active:scale-95"
                aria-label="Close Guide"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <h3 className="text-[clamp(1.25rem,4vw,1.5rem)] font-black text-foreground mb-3 sm:mb-4 tracking-tight leading-tight">
              {step.title}
            </h3>

            <div className="space-y-4 mb-4">
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] text-text-secondary leading-relaxed font-medium">
                {step.content}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 pt-4 sm:pt-6 mt-4 border-t border-primary-500/10 w-full">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={clsx(
                "py-2.5 sm:py-3 px-3 sm:px-4 w-1/3 text-[clamp(0.6rem,2vw,0.75rem)] font-black uppercase tracking-widest transition-all rounded-xl text-center",
                currentStep === 0 ? "opacity-0 invisible pointer-events-none" : "text-text-tertiary hover:bg-surface-hover hover:text-foreground"
              )}
            >
              Back
            </button>
            <div className="flex flex-row items-center justify-end gap-2 sm:gap-3 w-2/3">
              <button 
                onClick={skipGuide} 
                className="py-2.5 sm:py-3 px-3 sm:px-4 flex-1 text-[clamp(0.6rem,2vw,0.75rem)] font-black uppercase tracking-widest text-text-tertiary hover:bg-surface-hover hover:text-foreground rounded-xl text-center transition-all"
              >
                Skip
              </button>
              <Button
                onClick={isLastStep ? finishGuide : nextStep}
                className="py-2.5 sm:py-3 px-4 sm:px-6 flex-1 rounded-2xl sm:rounded-full font-black text-[clamp(0.6rem,2vw,0.75rem)] leading-tight uppercase tracking-widest shadow-lg shadow-primary-500/20 whitespace-nowrap flex items-center justify-center m-0 transition-transform hover:scale-105 active:scale-95"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 flex-shrink-0" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
