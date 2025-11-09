import ActivityLog from '../ActivityLog';

export default function ActivityLogExample() {
  return (
    <div className="p-6 h-96">
      <ActivityLog
        entries={[
          {
            id: '1',
            timestamp: '20:30:15',
            agent: 'Execution Agent',
            action: 'Diagnosing code flow in server.js...',
            status: 'success',
          },
          {
            id: '2',
            timestamp: '20:30:17',
            agent: 'Execution Agent',
            action: 'RUN: npm install --save cors',
            status: 'success',
          },
          {
            id: '3',
            timestamp: '20:30:22',
            agent: 'Execution Agent',
            action: 'Analyzing dependency tree...',
            status: 'success',
          },
          {
            id: '4',
            timestamp: '20:30:28',
            agent: 'Diagnostic Agent',
            action: 'Generating root cause hypotheses...',
            status: 'running',
          },
        ]}
      />
    </div>
  );
}
