import React, { createContext, useContext, useState, useEffect } from 'react';

const AppGuideContext = createContext();

export const useAppGuide = () => {
  const context = useContext(AppGuideContext);
  if (!context) {
    throw new Error('useAppGuide must be used within an AppGuideProvider');
  }
  return context;
};

export const AppGuideProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 means guide is not active
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('xpert_guide_seen');
    if (seen) {
      setHasSeenGuide(true);
    }
  }, []);

  const startGuide = () => {
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const skipGuide = () => {
    setCurrentStep(-1);
    localStorage.setItem('xpert_guide_seen', 'true');
    setHasSeenGuide(true);
  };

  const finishGuide = () => {
    setCurrentStep(-1);
    localStorage.setItem('xpert_guide_seen', 'true');
    setHasSeenGuide(true);
  };

  const value = {
    currentStep,
    hasSeenGuide,
    startGuide,
    nextStep,
    prevStep,
    skipGuide,
    finishGuide,
    isActive: currentStep >= 0
  };

  return (
    <AppGuideContext.Provider value={value}>
      {children}
    </AppGuideContext.Provider>
  );
};
