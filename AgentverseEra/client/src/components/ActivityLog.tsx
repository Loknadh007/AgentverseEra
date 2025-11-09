import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ActivityEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: 'running' | 'success' | 'error';
}

interface ActivityLogProps {
  entries: ActivityEntry[];
}

const statusColors = {
  running: 'text-primary',
  success: 'text-success',
  error: 'text-destructive',
};

export default function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <Card className="bg-card/90 backdrop-blur-xl p-6 h-full flex flex-col card-glow-hover border-primary/20 animate-fade-in-scale relative overflow-visible group" data-testid="log-activity">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 h-full flex flex-col">
      <h3 className="font-sans text-lg font-bold text-primary mb-4">
        Activity Log
      </h3>

      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
        
        <ScrollArea className="h-full">
          <div className="space-y-2 font-mono text-xs py-2">
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-2 items-start"
                data-testid={`entry-${entry.id}`}
              >
                <span className="text-muted-foreground shrink-0">
                  [{entry.timestamp}]
                </span>
                <span className={`font-bold ${statusColors[entry.status]}`}>
                  {entry.agent}:
                </span>
                <span className="text-foreground flex-1">{entry.action}</span>
                {entry.status === 'running' && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
      </div>
      </div>
    </Card>
  );
}
