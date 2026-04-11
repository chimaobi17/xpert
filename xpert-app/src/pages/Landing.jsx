import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowRightIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CursorArrowRippleIcon
} from '@heroicons/react/24/outline';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import Button from '../components/ui/Button';

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const workflowSteps = [
    {
      step: '01',
      title: 'Find an AI Helper',
      desc: 'Explore our vast library of specialized AI experts. Filter by category, tier, or search for any specific task you need to conquer.',
      image: '/screenshots/helper_find.png'
    },
    {
      step: '02',
      title: 'Pick your Helper',
      desc: 'Browse your personal library of specialized AI experts, ready to scale your workflow instantly.',
      image: '/screenshots/helper_library.png'
    },
    {
      step: '03',
      title: 'Input & Upload',
      desc: 'Fill in simple details and upload files. No prompt engineering skills required—just tell us what you need.',
      image: '/screenshots/helper_input.png'
    },
    {
      step: '04',
      title: 'Review & Refine',
      desc: 'Review the AI-crafted prompt. Choose to send it as-is, edit for perfection, or write your own from scratch.',
      image: '/screenshots/helper_refine.png'
    },
    {
      step: '05',
      title: 'Get Results',
      desc: 'Receive high-quality insights instantly, ready to download or save directly to your workspace.',
      image: '/screenshots/helper_results.png'
    }
  ];

  // Optimization: Preload high-res screenshots to prevent flicker during transitions
  useEffect(() => {
    workflowSteps.forEach((step) => {
      const img = new Image();
      img.src = step.image;
    });
  }, []);

  useEffect(() => {
    document.title = 'Xpert | AI Accessibility for Everyone';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-500/30">
      <LandingNavbar isScrolled={isScrolled} />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in-up shadow-[0_0_20px_rgba(31,196,95,0.1)]">
              <SparklesIcon className="h-3.5 w-3.5 animate-pulse drop-shadow-[0_0_5px_rgba(31,196,95,0.8)]" />
              <span className="mt-0.5">The Next Generation of AI</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up delay-100">
              AI shouldn't be <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Complicated.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed mb-12 animate-fade-in-up delay-200">
              Skip the prompts. Just upload your documents, fill in the necessary details and let our specialized AI Helpers
              transform your data into insights, graphics, and results in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link to="/register">
                <Button size="lg" className="px-10 rounded-full text-lg shadow-xl shadow-primary-500/25 group">
                  Get Started Free
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="px-10 rounded-full text-lg">
                  See how it works
                </Button>
              </a>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-20 relative max-w-6xl mx-auto px-4 sm:px-0 animate-fade-in-up delay-500">
              <div className="relative rounded-3xl bg-white dark:bg-surface p-1 shadow-[0_0_80px_-15px_rgba(34,197,94,0.4)] overflow-hidden">
                <div className="bg-white dark:bg-background rounded-2xl overflow-hidden relative flex items-center justify-center">
                  {/* Light Mode Hero - Full Find Helper View */}
                  <img
                    src="/screenshots/light_helper_find.png"
                    alt="Xpert Find Helper Preview Light"
                    className="w-full h-auto block dark:hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] [image-rendering:-webkit-optimize-contrast] contrast-[1.02]"
                  />
                  {/* Dark Mode Hero */}
                  <img
                    src="/screenshots/hero_content_writer.png"
                    alt="Xpert Dashboard Preview Dark"
                    className="w-full h-auto hidden dark:block [image-rendering:-webkit-optimize-contrast] brightness-[1.05] contrast-[1.02]"
                  />
                  <div className="absolute inset-0 bg-transparent dark:bg-gradient-to-t dark:from-background/10 dark:to-transparent pointer-events-none" />
                </div>
              </div>
              {/* Floating Elements Decorations */}
              <div className="absolute -top-4 -right-2 sm:-top-10 sm:-right-10 p-3 sm:p-4 bg-surface/80 backdrop-blur-md border border-border rounded-2xl shadow-xl animate-bounce-subtle z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Secure & Private</p>
                    <p className="text-[8px] sm:text-[10px] text-text-tertiary uppercase tracking-wider font-black">Enterprise Grade</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-2 sm:-bottom-10 sm:-left-10 p-3 sm:p-4 bg-surface/80 backdrop-blur-md border border-border rounded-2xl shadow-xl animate-bounce-subtle delay-1000 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <GlobeAltIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Global Reach</p>
                    <p className="text-[8px] sm:text-[10px] text-text-tertiary uppercase tracking-wider font-black">20+ Languages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 sm:py-32 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">Built for results, not prompts.</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                We've built specialized tools for every task. No need to learn complex prompt engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Specialized Helpers',
                  desc: '22+ AI helpers tailored for CV writing, graphics, code analysis, and business strategy.',
                  icon: CpuChipIcon,
                  color: 'bg-primary-500'
                },
                {
                  title: 'Document Intelligence',
                  desc: 'Upload PDFs, Docs, or Images. Our helpers "read" your files to provide expert context.',
                  icon: CloudArrowUpIcon,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Prompt Autonomy',
                  desc: 'AI generates the prompt for you, but you stay in control. Edit, refine, or write your own.',
                  icon: SparklesIcon,
                  color: 'bg-purple-500'
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-background border border-border hover:border-primary-500/50 transition-all group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color}/10 flex items-center justify-center ${feature.color.replace('bg-', 'text-')} mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                    <feature.icon className="h-8 w-8 drop-shadow-[0_0_8px_currentColor]" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 lg:hidden">
              <h2 className="text-4xl font-bold mb-4">Precision AI Workflow</h2>
              <p className="text-text-secondary">A simple 5-step process to get expert results.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-10 hidden lg:block">Precision AI workflow.</h2>
                <div className="space-y-4 lg:space-y-6">
                  {workflowSteps.map((item, i) => (
                    <div
                      key={i}
                      className={`group transition-all duration-500 rounded-[2.5rem] border ${activeStep === i ? 'bg-surface border-primary-500/20 shadow-2xl shadow-primary-500/5' : 'border-transparent hover:bg-surface/30'}`}
                      onMouseEnter={() => setActiveStep(i)}
                    >
                      <div
                        className={`flex gap-4 sm:gap-6 p-6 cursor-pointer`}
                      >
                        <div className="relative">
                          <span className={`text-4xl font-black transition-colors ${activeStep === i ? 'text-primary-500' : 'text-primary-500/20'}`}>
                            {item.step}
                          </span>
                          {activeStep !== i && (
                            <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-primary-500/10 text-primary-500 animate-bounce">
                              <CursorArrowRippleIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                          <p className="text-text-secondary text-sm sm:text-base">{item.desc}</p>
                        </div>
                      </div>

                      {/* Mobile Screenshot (Visible only on mobile below the text) */}
                      <div
                        className={`lg:hidden transition-all duration-700 overflow-hidden relative group/img ${activeStep === i ? 'max-h-[800px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}
                        onClick={() => setZoomedImage(item.image)}
                      >
                        <div className="relative w-full">
                          {/* Light Mode Screenshot */}
                          <img
                            src={item.image.replace('helper_', 'light_helper_')}
                            alt={`${item.title} Light`}
                            className={`w-full h-auto block dark:hidden [image-rendering:-webkit-optimize-contrast] ${activeStep === i ? 'scale-105' : 'scale-100'} transition-transform duration-[2s] ease-out`}
                          />
                          {/* Dark Mode Screenshot */}
                          <img
                            src={item.image}
                            alt={`${item.title} Dark`}
                            className={`w-full h-auto hidden dark:block [image-rendering:-webkit-optimize-contrast] brightness-[1.05] contrast-[1.02] ${activeStep === i ? 'scale-105' : 'scale-100'} transition-transform duration-[2s] ease-out`}
                          />
                          <div className="absolute inset-0 bg-transparent dark:bg-gradient-to-t dark:from-background/30 dark:via-transparent dark:to-transparent pointer-events-none" />

                          {/* Zoom Indicator */}
                          <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-primary-500 border border-primary-500/30 opacity-100 transition-opacity shadow-[0_0_15px_rgba(31,196,95,0.3)] animate-pulse">
                            <SparklesIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center lg:text-left">
                  <Link to="/register">
                    <Button size="lg" className="rounded-full px-12 group shadow-xl shadow-primary-500/20">
                      Get Started <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Desktop Image Preview */}
              <div className="hidden lg:block relative">
                <div className="aspect-video rounded-[3rem] bg-background border border-primary-500/20 overflow-hidden flex items-center justify-center p-4 shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-background shadow-2xl border border-border overflow-hidden relative group">
                    {/* Light Mode Screenshot */}
                    <img
                      src={workflowSteps[activeStep].image.replace('helper_', 'light_helper_')}
                      alt="App Screenshot Light"
                      className="w-full h-full object-contain animate-fade-in hover:scale-105 transition-transform duration-700 ease-out cursor-pointer block dark:hidden [image-rendering:-webkit-optimize-contrast]"
                      key={`light-${activeStep}`}
                    />
                    {/* Dark Mode Screenshot */}
                    <img
                      src={workflowSteps[activeStep].image}
                      alt="App Screenshot Dark"
                      className="w-full h-full object-contain animate-fade-in hover:scale-105 transition-transform duration-700 ease-out cursor-pointer hidden dark:block [image-rendering:-webkit-optimize-contrast]"
                      key={`dark-${activeStep}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent dark:from-background/40 pointer-events-none" />
                  </div>
                </div>

                {/* Visual indicator of active step */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? 'w-8 bg-primary-500' : 'w-2 bg-primary-500/20'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Glow for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary-500/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[2.5rem] sm:rounded-[4rem] border border-primary-500/30 glass px-6 py-12 sm:px-16 sm:py-24 overflow-hidden text-center shadow-2xl shadow-primary-500/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />

              <div className="relative z-10">
                <h2 className="text-4xl sm:text-6xl font-black mb-8 text-primary-600 dark:text-primary-500">Ready to work <br className="sm:hidden" /> with Xpert?</h2>
                <p className="text-primary-700 dark:text-white/90 text-lg sm:text-xl max-w-xl mx-auto mb-12">
                  Join thousands of users who are already using specialized AI to scale their productivity.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="glass border-primary-500/20 dark:border-white/20 text-primary-600 dark:text-white hover:bg-primary-500/5 dark:hover:bg-white/10 rounded-full px-12 text-lg font-bold transition-all shadow-xl shadow-primary-500/5 dark:shadow-black/20">
                      Join for Free
                    </Button>
                  </Link>
                  <Link to="/help">
                    <span className="text-sm font-bold underline underline-offset-8 cursor-pointer text-primary-500 hover:text-primary-400">Support & FAQ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      {/* Image Lightbox for Mobile Zoom */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            {/* Light Mode Zoom */}
            <img
              src={zoomedImage?.replace('helper_', 'light_helper_')}
              alt="Zoomed Review Light"
              className="block dark:hidden rounded-2xl shadow-[0_0_50px_rgba(31,196,95,0.05)] object-contain w-full h-full max-h-[85vh] [image-rendering:-webkit-optimize-contrast]"
            />
            {/* Dark Mode Zoom */}
            <img
              src={zoomedImage}
              alt="Zoomed Review Dark"
              className="hidden dark:block rounded-2xl shadow-[0_0_50px_rgba(31,196,95,0.2)] object-contain w-full h-full max-h-[85vh] [image-rendering:-webkit-optimize-contrast]"
            />
          </div>
        </div>
      )}

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('xpert_cookies_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] animate-fade-in-up">
      <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-2xl">
        <div className="flex gap-4 items-start pb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0 shadow-lg shadow-primary-500/5">
            <SparklesIcon className="h-6 w-6 animate-pulse drop-shadow-[0_0_5px_rgba(31,196,95,0.5)]" />
          </div>
          <div>
            <h4 className="font-bold mb-1">We value your privacy</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and support our marketing efforts.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 rounded-xl"
            onClick={() => {
              localStorage.setItem('xpert_cookies_accepted', 'true');
              setShow(false);
            }}
          >
            Accept All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl"
            onClick={() => setShow(false)}
          >
            Essential only
          </Button>
        </div>
      </div>
    </div>
  );
}
