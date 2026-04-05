import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { post } from '../../lib/apiClient';
import toast from 'react-hot-toast';

export default function FeedbackModal({ isOpen, onClose, agentId, agentName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;
    setSubmitting(true);

    const res = await post('/feedback', {
      agent_id: agentId,
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);

    if (res.ok) {
      toast.success('Thanks for your feedback!');
      setRating(0);
      setComment('');
      onClose();
    }
  }

  function handleClose() {
    setRating(0);
    setComment('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Rate this response" isSolid>
      <div className="text-center p-2">
        <p className="text-sm text-text-secondary mb-5">
          How was your experience with <span className="font-bold text-foreground">{agentName}</span>?
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= (hover || rating);
            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-125"
              >
                {filled ? (
                  <StarIcon className="h-9 w-9 text-yellow-400" />
                ) : (
                  <StarOutline className="h-9 w-9 text-border" />
                )}
              </button>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any additional feedback? (optional)"
          rows={3}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none resize-none"
        />

        <div className="flex gap-3 mt-5">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl h-11 font-bold"
            onClick={handleClose}
          >
            Skip
          </Button>
          <Button
            className="flex-1 rounded-2xl h-11 font-bold"
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
          >
            {submitting ? 'Sending...' : 'Submit'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
