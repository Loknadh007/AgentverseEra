import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ChatMessage
        agent="empathy"
        content="I can sense you're frustrated with this bug. Let me help you understand what's happening. Can you tell me more about when this error occurs?"
        timestamp="14:32:15"
      />
      <ChatMessage
        agent="diagnostic"
        content="Based on the stack trace, I've identified 3 possible root causes. The most likely is a race condition in your async handler."
        timestamp="14:32:28"
      />
      <ChatMessage
        agent="execution"
        content="Running diagnostics on server.js... Analyzing code flow patterns..."
        timestamp="14:32:45"
      />
    </div>
  );
}
