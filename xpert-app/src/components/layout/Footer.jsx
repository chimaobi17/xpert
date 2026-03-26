export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-[var(--color-text-tertiary)]">
        <p>&copy; {new Date().getFullYear()} XPERT. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[var(--color-text-secondary)]">Privacy</a>
          <a href="#" className="hover:text-[var(--color-text-secondary)]">Terms</a>
        </div>
      </div>
    </footer>
  );
}
