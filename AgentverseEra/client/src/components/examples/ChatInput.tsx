import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  return (
    <div className="p-6">
      <ChatInput onSubmit={(msg) => console.log('Message sent:', msg)} />
    </div>
  );
}
