import HypothesesPanel from '../HypothesesPanel';

export default function HypothesesPanelExample() {
  return (
    <div className="p-6">
      <HypothesesPanel
        hypotheses={[
          {
            id: 1,
            title: 'Race condition in async authentication handler',
            confidence: 85,
            details: 'The session middleware is attempting to read user data before the authentication promise resolves, causing undefined access errors.',
          },
          {
            id: 2,
            title: 'Missing null check in user profile retrieval',
            confidence: 65,
            details: 'When a user profile is not found in the database, the code attempts to access properties on undefined, triggering the crash.',
          },
          {
            id: 3,
            title: 'Incorrect error boundary configuration',
            confidence: 40,
            details: 'The React error boundary may not be properly catching errors from the async authentication flow.',
          },
        ]}
      />
    </div>
  );
}
