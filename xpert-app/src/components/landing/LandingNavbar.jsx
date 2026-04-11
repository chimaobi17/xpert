import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import useTheme from '../../hooks/useTheme';
import logoFull from '../../assets/logo-full.svg';
import Button from '../ui/Button';

export default function LandingNavbar({ isScrolled }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      (mobileMenuOpen || isScrolled)
        ? "glass !border-x-0 !border-t-0 py-3"
        : "bg-transparent py-6",
      /* Remove middle border when menu is open to unify the extension */
      (mobileMenuOpen && !isScrolled) ? "border-b-0" : "border-b border-border/50 shadow-2xl"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
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
              className="p-2 rounded-xl text-text-secondary transition-transform"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Identical Extension Styling */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass !border-x-0 !border-t-0 border-b border-border/50 p-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-6 text-center pb-6 font-bold">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-primary-500">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-primary-500">How it works</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-primary-500">FAQ</a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-primary-500">Sign In</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full rounded-full mt-2">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
