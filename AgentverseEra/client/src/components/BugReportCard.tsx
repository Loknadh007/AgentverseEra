import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface BugReport {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  affectedFiles: string[];
  userSentiment: 'frustrated' | 'confused' | 'neutral' | 'urgent';
}

interface BugReportCardProps {
  report: BugReport;
}

const severityColors = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-chart-4 text-white',
  medium: 'bg-chart-5 text-white',
  low: 'bg-muted text-muted-foreground',
};

const sentimentIcons = {
  frustrated: 'FRUSTRATED',
  confused: 'CONFUSED',
  neutral: 'NEUTRAL',
  urgent: 'URGENT',
};

export default function BugReportCard({ report }: BugReportCardProps) {
  return (
    <Card className="bg-card/90 backdrop-blur-xl p-6 card-glow-hover border-primary/20 animate-fade-in-scale relative overflow-visible group" data-testid="card-bug-report">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="space-y-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans text-lg font-bold text-primary">
            Bug Report Card
          </h3>
          <Badge className={`${severityColors[report.severity]} text-xs`} data-testid={`badge-severity-${report.severity}`}>
            {report.severity.toUpperCase()}
          </Badge>
        </div>

        <div className="font-mono text-sm space-y-3">
          <div className="flex gap-2">
            <span className="text-primary">"category":</span>
            <span className="text-foreground">"{report.category}"</span>
          </div>

          <div className="flex gap-2">
            <span className="text-primary">"sentiment":</span>
            <span className="text-foreground">
              "{report.userSentiment}"
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-primary">"description":</span>
            <span className="text-muted-foreground text-xs pl-4">
              "{report.description}"
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-primary">"affected_files":</span>
            <div className="pl-4 space-y-1">
              {report.affectedFiles.map((file, idx) => (
                <div key={idx} className="text-xs text-success" data-testid={`text-file-${idx}`}>
                  • {file}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
