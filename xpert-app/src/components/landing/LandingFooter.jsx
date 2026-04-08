import { Link } from 'react-router-dom';
import logoFull from '../../assets/logo-full.svg';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Agents', href: '/agents/discover' },
        { name: 'Pricing', href: '/settings?tab=plan' },
        { name: 'Help Center', href: '/help' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Security', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/">
              <img src={logoFull} alt="Xpert" className="h-10 sm:h-12" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Empowering everyone with the power of AI. No prompting skills required. 
              Just upload your files and let Xpert handle the rest.
            </p>
            <div className="flex space-x-5">
              {/* Social Icons Placeholder */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-tertiary hover:text-primary-500 hover:border-primary-500/50 transition-all cursor-pointer">
                  <div className="h-5 w-5 bg-current opacity-20 rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-tertiary">
            © {currentYear} Xpert AI Platform. Built for the modern workspace.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-xs text-text-tertiary hover:text-primary-500">Privacy</Link>
            <Link to="/terms" className="text-xs text-text-tertiary hover:text-primary-500">Terms</Link>
            <Link to="/cookies" className="text-xs text-text-tertiary hover:text-primary-500">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
