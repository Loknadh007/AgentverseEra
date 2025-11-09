import CodeDiff from '../CodeDiff';

export default function CodeDiffExample() {
  return (
    <div className="p-6">
      <CodeDiff
        filename="src/auth/login.ts"
        lines={[
          { type: 'context', lineNumber: 15, content: 'async function loginUser(credentials) {' },
          { type: 'remove', lineNumber: 16, content: '  const user = await getUser(credentials.username);' },
          { type: 'add', lineNumber: 16, content: '  const user = await getUser(credentials.username) || null;' },
          { type: 'add', lineNumber: 17, content: '  if (!user) throw new Error("User not found");' },
          { type: 'context', lineNumber: 18, content: '  return validatePassword(user, credentials.password);' },
          { type: 'context', lineNumber: 19, content: '}' },
        ]}
        enableTypewriter={false}
      />
    </div>
  );
}
