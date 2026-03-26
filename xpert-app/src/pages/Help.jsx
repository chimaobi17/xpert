import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import toast from 'react-hot-toast';

const faqs = [
  {
    q: 'What is XPERT?',
    a: 'XPERT is an AI-powered prompt platform that helps you generate high-quality prompts for various tasks including coding, writing, business analysis, and more.',
  },
  {
    q: 'How do I use the AI Agents?',
    a: 'Navigate to the AI Agents page, select an agent, fill in the dynamic form fields, review the generated prompt, and send it to the AI for a response.',
  },
  {
    q: 'What are the plan limits?',
    a: 'Free plan: 25,000 tokens/day and 50 requests. Standard: 150,000 tokens/day and 300 requests. Premium: 1,000,000 tokens/day with unlimited requests.',
  },
  {
    q: 'How do I save prompts?',
    a: 'After generating a prompt or receiving an AI response, click the "Save to Library" button. You can find all saved prompts in the Library section.',
  },
  {
    q: 'Can I edit generated prompts?',
    a: 'Yes! In the prompt review step, click the "Edit" button to modify the generated prompt before sending it to the AI.',
  },
  {
    q: 'What AI models are used?',
    a: 'XPERT uses various models from Hugging Face, optimized for each agent type. Model selection is automatic based on the agent and task.',
  },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  function handleContact(e) {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setContactForm({ subject: '', message: '' });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Help Center</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Find answers and get support
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-[var(--color-text)]">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUpIcon className="h-4 w-4 text-[var(--color-text-tertiary)] flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-[var(--color-text-tertiary)] flex-shrink-0 ml-2" />
                )}
              </button>
              {openFaq === i && (
                <div className="border-t border-[var(--color-border)] px-4 py-3">
                  <p className="text-sm text-[var(--color-text-secondary)]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Contact Us</h2>
        <form onSubmit={handleContact} className="max-w-lg space-y-4">
          <Input
            label="Subject"
            value={contactForm.subject}
            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
            placeholder="What's this about?"
            required
          />
          <Textarea
            label="Message"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            placeholder="Describe your issue or feedback..."
            rows={5}
            required
          />
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
