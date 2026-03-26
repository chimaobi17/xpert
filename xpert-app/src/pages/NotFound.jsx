import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
      <h1 className="text-7xl font-bold text-primary-500">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">Page not found</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
