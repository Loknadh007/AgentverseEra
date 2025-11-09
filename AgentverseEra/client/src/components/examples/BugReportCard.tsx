import BugReportCard from '../BugReportCard';

export default function BugReportCardExample() {
  return (
    <div className="p-6">
      <BugReportCard
        report={{
          severity: 'high',
          category: 'Runtime Error',
          description: 'Undefined variable causing application crash on user login',
          affectedFiles: ['src/auth/login.ts', 'src/middleware/session.ts'],
          userSentiment: 'frustrated',
        }}
      />
    </div>
  );
}
