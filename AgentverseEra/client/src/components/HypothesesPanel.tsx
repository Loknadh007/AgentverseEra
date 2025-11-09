import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Hypothesis {
  id: number;
  title: string;
  confidence: number;
  details: string;
}

interface HypothesesPanelProps {
  hypotheses: Hypothesis[];
}

export default function HypothesesPanel({ hypotheses }: HypothesesPanelProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <Card className="bg-card/90 backdrop-blur-xl p-6 card-glow-hover border-primary/20 animate-fade-in-scale relative overflow-visible group" data-testid="panel-hypotheses">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
      <h3 className="font-sans text-lg font-bold text-primary mb-4">
        Root Cause Hypotheses
      </h3>

      <div className="space-y-3">
        {hypotheses.map((hypothesis) => (
          <motion.div
            key={hypothesis.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: hypothesis.id * 0.1 }}
            className="bg-accent rounded-xl overflow-hidden shadow-sm"
            data-testid={`hypothesis-${hypothesis.id}`}
          >
            <button
              onClick={() => setExpandedId(expandedId === hypothesis.id ? null : hypothesis.id)}
              className="w-full p-4 hover-elevate active-elevate-2 flex items-start justify-between gap-3 transition-all"
              data-testid={`button-hypothesis-${hypothesis.id}`}
            >
              <div className="flex items-start gap-3 flex-1 text-left">
                <Badge className="bg-primary text-primary-foreground shrink-0">
                  #{hypothesis.id}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-sans mb-2">{hypothesis.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${hypothesis.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {hypothesis.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              {expandedId === hypothesis.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {expandedId === hypothesis.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hypothesis.details}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      </div>
    </Card>
  );
}
