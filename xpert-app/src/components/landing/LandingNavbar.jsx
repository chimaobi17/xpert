import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import useTheme from '../../hooks/useTheme';
import logoFull from '../../assets/logo-full.svg';
import Button from '../ui/Button';

export default function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      mobileMenuOpen 
        ? 'bg-background border-b border-border/50 py-4 shadow-2xl' 
        : isScrolled 
          ? 'glass !border-x-0 !border-t-0 border-b border-border/50 py-3 shadow-2xl' 
          : 'bg-background/20 backdrop-blur-xl border-b border-border/10 py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={logoFull} alt="Xpert" className="h-10 sm:h-12" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-text-secondary hover:text-primary-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-text-secondary hover:text-primary-500 transition-colors">How it works</a>
            <a href="#faq" className="text-sm font-semibold text-text-secondary hover:text-primary-500 transition-colors">FAQ</a>
            
            <div className="h-4 w-px bg-border/50 mx-2" />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-secondary hover:text-primary-500 hover:bg-primary-500/5 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <Link to="/login">
              <Button variant="outline" size="sm" className="px-6 rounded-full">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="px-6 rounded-full shadow-lg shadow-primary-500/20">Get Started</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-secondary hover:text-primary-500"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text-secondary"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 right-0 bg-background border-b border-border/10 p-4 animate-fade-in shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-8">
            <img src={logoFull} alt="Xpert" className="h-10" />
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-text-secondary" />
            </button>
          </div>
          <div className="flex flex-col space-y-6 text-center pb-8 font-bold">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary">How it works</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary">FAQ</a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary">Sign In</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full rounded-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
