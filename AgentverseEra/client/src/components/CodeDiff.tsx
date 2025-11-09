import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNumber?: number;
  content: string;
}

interface CodeDiffProps {
  filename: string;
  lines: DiffLine[];
  enableTypewriter?: boolean;
}

export default function CodeDiff({ filename, lines, enableTypewriter = false }: CodeDiffProps) {
  const [visibleLines, setVisibleLines] = useState(enableTypewriter ? 0 : lines.length);

  useEffect(() => {
    if (enableTypewriter && visibleLines < lines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, lines.length, enableTypewriter]);

  const getLineStyle = (type: DiffLine['type']) => {
    switch (type) {
      case 'add':
        return 'bg-primary/10 text-primary border-l-2 border-l-primary';
      case 'remove':
        return 'bg-destructive/10 text-destructive border-l-2 border-l-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'add':
        return '+';
      case 'remove':
        return '-';
      default:
        return ' ';
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur-xl border-primary/20 overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-fade-in-scale" data-testid="diff-code">
      <div className="bg-gradient-to-r from-accent via-accent to-primary/10 px-4 py-3 border-b border-primary/30">
        <p className="font-mono text-xs text-primary font-bold tracking-wide" data-testid="text-filename">
          📝 {filename}
        </p>
      </div>

      <div className="font-mono text-xs overflow-x-auto">
        {lines.slice(0, visibleLines).map((line, idx) => (
          <div
            key={idx}
            className={`px-4 py-1 ${getLineStyle(line.type)}`}
            data-testid={`line-${line.type}-${idx}`}
          >
            <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">
              {line.lineNumber || ''}
            </span>
            <span className="inline-block w-4 font-bold select-none">
              {getPrefix(line.type)}
            </span>
            <span>{line.content}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
