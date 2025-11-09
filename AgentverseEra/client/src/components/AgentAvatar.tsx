import { Brain, Heart, Wrench } from 'lucide-react';

export type AgentType = 'empathy' | 'diagnostic' | 'execution';

interface AgentAvatarProps {
  type: AgentType;
  size?: 'sm' | 'md' | 'lg';
}

const agentConfig = {
  empathy: {
    icon: Heart,
    color: 'border-primary',
    bg: 'bg-primary/10',
    name: 'Empathy Agent',
  },
  diagnostic: {
    icon: Brain,
    color: 'border-success',
    bg: 'bg-success/10',
    name: 'Diagnostic Agent',
  },
  execution: {
    icon: Wrench,
    color: 'border-destructive',
    bg: 'bg-destructive/10',
    name: 'Execution Agent',
  },
};

const sizeConfig = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export default function AgentAvatar({ type, size = 'md' }: AgentAvatarProps) {
  const config = agentConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`${sizeConfig[size]} ${config.bg} ${config.color} border-2 rounded-md flex items-center justify-center font-bold`}
      data-testid={`avatar-${type}`}
    >
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
}

export function AgentLabel({ type }: { type: AgentType }) {
  const config = agentConfig[type];
  const Icon = config.icon;
  
  return (
    <div className="flex items-center gap-2" data-testid={`label-${type}`}>
      <Icon className="w-4 h-4" />
      <span className="font-mono text-sm font-bold">{config.name}</span>
    </div>
  );
}
