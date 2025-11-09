import { motion } from 'framer-motion';
import AgentAvatar, { AgentLabel, type AgentType } from './AgentAvatar';

export interface ChatMessageProps {
  agent: AgentType;
  content: string;
  timestamp: string;
  isUser?: boolean;
}

export default function ChatMessage({ agent, content, timestamp, isUser }: ChatMessageProps) {
  const borderColors = {
    empathy: 'border-l-primary',
    diagnostic: 'border-l-success',
    execution: 'border-l-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${agent}`}
    >
      {!isUser && <AgentAvatar type={agent} />}
      
      <div className={`flex flex-col gap-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && <AgentLabel type={agent} />}
        
        <div
          className={`rounded-xl p-4 shadow-md ${
            isUser
              ? 'bg-secondary/80 backdrop-blur-sm'
              : `bg-card/80 backdrop-blur-sm border-l-4 ${borderColors[agent]}`
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        <span className="text-xs text-muted-foreground font-mono" data-testid={`timestamp-${agent}`}>
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
}
