import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const AppGuideContext = createContext();

export const useAppGuide = () => {
  const context = useContext(AppGuideContext);
  if (!context) {
    throw new Error('useAppGuide must be used within an AppGuideProvider');
  }
  return context;
};

export const AppGuideProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(-1); // -1 means guide is not active
  const [hasSeenGuide, setHasSeenGuide] = useState(null); // null means pending verification

  useEffect(() => {
    if (user?.id) {
      const seen = localStorage.getItem(`xpert_guide_seen_${user.id}`);
      setHasSeenGuide(seen === 'true');
    } else if (!loading) {
      setHasSeenGuide(true); // Don't show guide for guests
    }
  }, [user?.id, loading]);

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
    if (user?.id) localStorage.setItem(`xpert_guide_seen_${user.id}`, 'true');
    setHasSeenGuide(true);
  };

  const finishGuide = () => {
    setCurrentStep(-1);
    if (user?.id) localStorage.setItem(`xpert_guide_seen_${user.id}`, 'true');
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
