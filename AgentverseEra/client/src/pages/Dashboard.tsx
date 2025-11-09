import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import BugReportCard from '@/components/BugReportCard';
import HypothesesPanel from '@/components/HypothesesPanel';
import ActivityLog from '@/components/ActivityLog';
import CodeDiff from '@/components/CodeDiff';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { BugReport } from '@/components/BugReportCard';
import type { Hypothesis } from '@/components/HypothesesPanel';
import type { ActivityEntry } from '@/components/ActivityLog';
import type { DiffLine } from '@/components/CodeDiff';

export default function Dashboard() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: conversationData } = useQuery({
    queryKey: ['/api/conversations', conversationId],
    enabled: !!conversationId,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/conversations');
      return await res.json();
    },
    onSuccess: (data: any) => {
      setConversationId(data.conversation.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, { content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversationId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!conversationId) {
      createConversationMutation.mutate();
    }
  }, []);

  const messages = (conversationData as any)?.messages || [];
  const bugReport = (conversationData as any)?.bugReport;
  const hypotheses = (conversationData as any)?.hypotheses || [];
  const activityLog = (conversationData as any)?.activityLog || [];

  const codeDiff = messages.find((m: any) => m.metadata?.codeDiff)?.metadata?.codeDiff;

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const transformedMessages = messages.map((msg: any) => ({
    id: msg.id,
    agent: msg.agent as 'empathy' | 'diagnostic' | 'execution',
    content: msg.content,
    timestamp: formatTimestamp(msg.timestamp),
    isUser: msg.isUser === 1,
  }));

  const transformedBugReport: BugReport | null = bugReport ? {
    severity: bugReport.severity as 'critical' | 'high' | 'medium' | 'low',
    category: bugReport.category,
    description: bugReport.description,
    affectedFiles: bugReport.affectedFiles,
    userSentiment: bugReport.userSentiment as 'frustrated' | 'confused' | 'neutral' | 'urgent',
  } : null;

  const transformedHypotheses: Hypothesis[] = hypotheses.map((h: any) => ({
    id: h.rank,
    title: h.title,
    confidence: h.confidence,
    details: h.details,
  }));

  const transformedActivityLog: ActivityEntry[] = activityLog.map((entry: any) => ({
    id: entry.id,
    timestamp: formatTimestamp(entry.timestamp),
    agent: entry.agent,
    action: entry.action,
    status: entry.status as 'running' | 'success' | 'error',
  }));

  return (
    <div className="h-screen w-full bg-gradient-to-br from-background via-background to-accent/5 flex gap-6 p-6">
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex items-center justify-between animate-slide-in-up">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-sans bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift">
              AGENTVERSE
            </h1>
            <p className="text-sm text-muted-foreground font-sans tracking-wide">
              Multi-Agent Autonomous Debugging System
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {transformedMessages.map((msg: any) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
            
            {codeDiff && (
              <div className="animate-slide-up">
                <CodeDiff {...codeDiff} enableTypewriter={true} />
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput onSubmit={handleSendMessage} disabled={sendMessageMutation.isPending} />
      </div>

      <div className="w-96 flex flex-col gap-6 shrink-0">
        {transformedBugReport && (
          <div className="animate-slide-up">
            <BugReportCard report={transformedBugReport} />
          </div>
        )}
        
        {transformedHypotheses.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <HypothesesPanel hypotheses={transformedHypotheses} />
          </div>
        )}
        
        <div className="flex-1 min-h-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <ActivityLog entries={transformedActivityLog} />
        </div>
      </div>
    </div>
  );
}
