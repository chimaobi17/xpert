import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppGuide } from '../../contexts/AppGuideContext';
import { SparklesIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Button from './Button';

const STEPS = [
  {
    title: "Welcome to Xpert",
    content: "We've built Xpert to make AI accessible to everyone. Let's walk through how to use your first AI Helper.",
    target: null,
  },
  {
    title: "Step 1: Find a Helper",
    content: "Start by clicking 'Find Helpers' in the sidebar. This is where you can explore our entire library of specialized AI agents.",
    target: "#guide-discover",
    inSidebar: true,
  },
  {
    title: "Step 2: Pick your Favorite",
    content: "Once you're in the discovery area, browse the cards and click on any Agent that looks interesting to add it to your personal workspace.",
    target: "#guide-agent-card",
  },
  {
    title: "Step 3: Your Workspace",
    content: "Now, navigate to 'My Helpers'. This is your personal mission control where all your selected AI agents live.",
    target: "#guide-workspace",
    inSidebar: true,
  },
  {
    title: "Step 4: Launch an Agent",
    content: "Click on one of your Helpers in the grid to open its dedicated workspace and start a new task.",
    target: "#guide-workspace-grid",
  },
  {
    title: "Step 5: Fill the Details",
    content: "Xpert removes the need for prompt engineering. Just fill in these simple fields with your specific requirements or documents.",
    target: "#guide-agent-form",
  },
  {
    title: "Step 6: Build the Blueprint",
    content: "Click 'Continue' to let Xpert transform your inputs into a sophisticated AI blueprint behind the scenes.",
    target: "#guide-generate-btn",
  },
  {
    title: "Step 7: Review & Refine",
    content: "You're in control. You can use the generated prompt as-is, edit it for perfection, or write your own from scratch.",
    target: "#guide-review-options",
  },
  {
    title: "Step 8: Ignite the AI",
    content: "When you're ready, click 'Send to AI' to transmit your instructions to our high-performance models.",
    target: "#guide-submit-ai",
  },
  {
    title: "Step 9: High-Quality Results",
    content: "Your result appeared here! You can copy it, save it to your library, or download generated assets instantly.",
    target: "#guide-ai-result",
  },
  {
    title: "Step 10: Revisit Anytime",
    content: "If you ever need a refresher, just click this Sparkles icon in the navigation menu to launch this guide again.",
    target: "#guide-tour-start",
  },
  {
    title: "You're all set!",
    content: "Master AI productivity with Xpert. Start scaling your workflow today with our growing library of Helpers.",
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
          width: 'calc(100% - 2rem)',
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
        width: 'calc(100% - 1rem)',
        maxWidth: '320px'
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

    const popoverWidth = 340;
    const popoverHeight = 420;

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
      {/* Surgical Fix 4: Allow pointer events to reach the app BUT keep the Card interactive */}
      <div
        className={clsx(
          "absolute transition-opacity duration-500 inset-0",
          step.target
            ? (isMobile ? "bg-black/5" : "bg-black/40 backdrop-blur-[2px]")
            : "bg-black/80 backdrop-blur-md",
          // Only allow background to capture clicks if no target is active (Welcome/Finish screens)
          !step.target ? "pointer-events-auto" : "pointer-events-none"
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
          "mx-auto bg-white dark:bg-surface border border-border/50 dark:border-border shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-fade-in-up flex flex-col justify-between overflow-hidden relative",
          isMobile
            ? "rounded-2xl p-3 min-h-fit max-h-[80vh] w-[calc(100%-1rem)] max-w-[300px]"
            : "sm:rounded-[2.5rem] sm:p-9 sm:min-h-[460px] sm:w-[480px]"
        )}>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-lg shadow-primary-500/5 transition-transform hover:scale-105">
                  <SparklesIcon className="h-5 w-5 sm:h-7 sm:w-7 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary-500 mb-0.5">XPERT Guide</p>
                  <p className="text-[9px] sm:text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
              </div>
              <button onClick={skipGuide} className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-foreground transition-all">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3 sm:mb-4 tracking-tight leading-tight">{step.title}</h3>

            <div className="space-y-4 mb-4">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                {step.content}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 sm:gap-6 pt-3 sm:pt-6 mt-3 sm:mt-4 border-t border-primary-500/10 min-w-0">
            <div className={clsx(isMobile && "flex-1")}>
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={clsx(
                  "text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all h-7 sm:h-9 flex items-center justify-center flex-shrink-0 px-2 sm:px-3 w-full sm:w-auto",
                  currentStep === 0 ? "opacity-0 invisible" : "text-text-tertiary hover:text-foreground"
                )}
              >
                Back
              </button>
            </div>
            <div className={clsx("flex items-center gap-1 sm:gap-6 min-w-0", isMobile && "flex-1")}>
              <button onClick={skipGuide} className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-foreground px-0 sm:px-3 h-7 sm:h-9 flex items-center justify-center flex-shrink-0 flex-1 sm:flex-none">Skip</button>
              <Button
                onClick={isLastStep ? finishGuide : nextStep}
                className="px-0 sm:px-4 h-7 sm:h-9 rounded-full font-black text-[7.5px] sm:text-[10px] leading-none uppercase tracking-widest shadow-lg shadow-primary-500/20 whitespace-nowrap flex-shrink-0 flex-1 sm:flex-none"
              >
                {isLastStep ? 'Finish' : 'Next Step'}
                {!isLastStep && !isMobile && <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ml-1.5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
