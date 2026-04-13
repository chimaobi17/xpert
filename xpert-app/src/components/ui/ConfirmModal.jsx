import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: Icon,
}) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
      : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} isSolid size="sm">
      <div className="text-center p-1 sm:p-2">
        {Icon && (
          <div className={`${variant === 'danger' ? 'bg-red-500/10' : 'bg-primary-500/10'} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${variant === 'danger' ? 'text-red-500' : 'text-primary-500'}`} />
          </div>
        )}
        <p className="text-sm text-text-secondary mb-6 font-medium">{message}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-full font-bold"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            className={`flex-1 h-11 rounded-full font-bold ${confirmClass}`}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
