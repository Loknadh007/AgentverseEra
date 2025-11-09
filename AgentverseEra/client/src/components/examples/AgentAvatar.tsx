import AgentAvatar, { AgentLabel } from '../AgentAvatar';

export default function AgentAvatarExample() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-4 items-center">
        <AgentAvatar type="empathy" size="lg" />
        <AgentLabel type="empathy" />
      </div>
      <div className="flex gap-4 items-center">
        <AgentAvatar type="diagnostic" size="lg" />
        <AgentLabel type="diagnostic" />
      </div>
      <div className="flex gap-4 items-center">
        <AgentAvatar type="execution" size="lg" />
        <AgentLabel type="execution" />
      </div>
    </div>
  );
}
