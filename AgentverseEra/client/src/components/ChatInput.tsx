import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSubmit(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end" data-testid="input-chat">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your bug or issue... (e.g., 'My app crashes when users try to login')"
        className="flex-1 min-h-[60px] max-h-[200px] resize-none bg-secondary border-border font-mono text-sm"
        disabled={disabled}
        data-testid="textarea-message"
      />
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-[60px] w-[60px]"
        data-testid="button-send"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
