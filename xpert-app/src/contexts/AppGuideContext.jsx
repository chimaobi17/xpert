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
      if (seen === 'true') {
        setHasSeenGuide(true);
      } else if (sessionStorage.getItem('xpert_just_registered') === 'true') {
        // New signup — auto-start guide once
        sessionStorage.removeItem('xpert_just_registered');
        setHasSeenGuide(false);
        setCurrentStep(0);
      } else {
        // Existing user signing in who never finished guide — don't force it
        setHasSeenGuide(true);
      }
    } else if (!loading) {
      setHasSeenGuide(true); // Don't show guide for guests
    }
  }, [user?.id, loading]);

  const startGuide = React.useCallback(() => {
    setCurrentStep(0);
  }, []);

  const nextStep = React.useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = React.useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const skipGuide = React.useCallback(() => {
    setCurrentStep(-1);
    if (user?.id) localStorage.setItem(`xpert_guide_seen_${user.id}`, 'true');
    setHasSeenGuide(true);
  }, [user?.id]);

  const finishGuide = React.useCallback(() => {
    setCurrentStep(-1);
    if (user?.id) localStorage.setItem(`xpert_guide_seen_${user.id}`, 'true');
    setHasSeenGuide(true);
  }, [user?.id]);

  const value = React.useMemo(() => ({
    currentStep,
    hasSeenGuide,
    startGuide,
    nextStep,
    prevStep,
    skipGuide,
    finishGuide,
    isActive: currentStep >= 0
  }), [currentStep, hasSeenGuide, startGuide, nextStep, prevStep, skipGuide, finishGuide]);

  return (
    <AppGuideContext.Provider value={value}>
      {children}
    </AppGuideContext.Provider>
  );
};
