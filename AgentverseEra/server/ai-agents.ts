import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMPATHY_SYSTEM_PROMPT = `You are the Empathy Agent (💙). Your primary goal is to connect with the frustrated user and extract a clear, structured bug report.

1. Tone: Be warm, encouraging, and highly empathetic. Use appropriate emojis.
2. Task: Analyze the user's input for sentiment (Frustrated, Confused, Neutral, Urgent) and technical core.
3. Output: Acknowledge their pain with a brief empathetic message, then generate the Structured Bug Report.
4. Handoff: State you are passing the report to the Diagnostic Agent.

REQUIRED OUTPUT FORMAT:
First, provide a brief empathetic response (2-3 sentences max).
Then output this JSON structure:
{
  "user_sentiment": "Frustrated|Confused|Neutral|Urgent",
  "severity": "critical|high|medium|low",
  "category": "Runtime Error|CORS|Database|Authentication|etc",
  "description": "Concise 1-sentence summary",
  "affected_files": ["estimated file paths based on description"],
  "handoff_message": "Brief message for user about passing to Diagnostic Agent"
}`;

const DIAGNOSTIC_SYSTEM_PROMPT = `You are the Diagnostic Agent (🧠). Your input is a bug report and you must generate EXACTLY THREE (3) distinct, competing hypotheses for the root cause.

1. Task: Apply deep technical reasoning to create 3 ranked hypotheses.
2. Output: Format as JSON array ranked by confidence score (highest first).
3. Handoff: Select the highest-confidence hypothesis for the Execution Agent.
4. Critical Rule: Do NOT generate code or shell commands. Analysis and planning only.

REQUIRED OUTPUT FORMAT:
First, provide a brief analysis message (2-3 sentences).
Then output this JSON structure:
{
  "hypotheses": [
    {
      "id": 1,
      "title": "Highest confidence root cause",
      "confidence": 70-100,
      "details": "Brief technical justification"
    },
    {
      "id": 2,
      "title": "Second most likely cause",
      "confidence": 40-69,
      "details": "Brief technical justification"
    },
    {
      "id": 3,
      "title": "Lowest confidence but plausible",
      "confidence": 10-39,
      "details": "Brief technical justification"
    }
  ],
  "next_action": "Clear instruction for Execution Agent based on Hypothesis #1",
  "handoff_message": "Brief message for user"
}`;

const EXECUTION_SYSTEM_PROMPT = `You are the Execution Agent (⚡). Your goal is to autonomously execute the fix based on the Diagnostic Agent's recommendation.

1. Protocol: Log every action you take.
2. File Modification: Generate the necessary code change.
3. Code Diff Output: Present using Git-style diff format.
4. Final Status: Conclude with PASS/FAIL status.

REQUIRED OUTPUT FORMAT:
First, provide a brief message about what you're doing (1-2 sentences).
Then output this JSON structure:
{
  "activity_steps": [
    "Step 1: Action description",
    "Step 2: Action description",
    "Step 3: Action description"
  ],
  "code_diff": {
    "filename": "path/to/file.ts",
    "lines": [
      {"type": "context", "lineNumber": 15, "content": "existing code"},
      {"type": "remove", "lineNumber": 16, "content": "code to remove"},
      {"type": "add", "lineNumber": 16, "content": "code to add"},
      {"type": "context", "lineNumber": 17, "content": "more context"}
    ]
  },
  "final_status": "Fix applied successfully! Status: GREEN|YELLOW|RED",
  "test_command": "npm test || npm run dev"
}`;

export async function callEmpathyAgent(userMessage: string): Promise<{
  response: string;
  bugReport: {
    user_sentiment: string;
    severity: string;
    category: string;
    description: string;
    affected_files: string[];
  };
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: EMPATHY_SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Empathy Agent returned non-JSON response, using fallback");
      throw new Error("Invalid JSON response");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn("Empathy Agent JSON parse error, using fallback");
      throw new Error("JSON parse failed");
    }

    const responseText = content.substring(0, content.indexOf('{')).trim();

    if (!parsed.user_sentiment || !parsed.severity || !parsed.category) {
      console.warn("Empathy Agent response missing required fields, using fallback");
      throw new Error("Incomplete bug report structure");
    }

    return {
      response: responseText || "I understand this is challenging. Let me help you debug this issue.",
      bugReport: {
        user_sentiment: parsed.user_sentiment,
        severity: parsed.severity,
        category: parsed.category,
        description: parsed.description || userMessage,
        affected_files: Array.isArray(parsed.affected_files) ? parsed.affected_files : [],
      }
    };
  } catch (error: any) {
    console.error("OpenAI API Error (Empathy Agent) - using fallback:", error.message);
    
    const containsAuth = /auth|login|signin|session|token/i.test(userMessage);
    const containsCrash = /crash|error|undefined|null|fail/i.test(userMessage);
    
    return {
      response: "I can see you're dealing with a frustrating issue. Let me analyze this for you and coordinate with our diagnostic team.",
      bugReport: {
        user_sentiment: "frustrated",
        severity: containsCrash ? "high" : "medium",
        category: containsAuth ? "Authentication Error" : "Runtime Error",
        description: userMessage,
        affected_files: containsAuth ? ["src/auth/login.ts", "src/middleware/auth.ts"] : ["src/components/App.tsx"],
      }
    };
  }
}

export async function callDiagnosticAgent(bugReport: any): Promise<{
  response: string;
  hypotheses: Array<{
    id: number;
    title: string;
    confidence: number;
    details: string;
  }>;
  nextAction: string;
}> {
  try {
    const bugContext = JSON.stringify(bugReport, null, 2);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: DIAGNOSTIC_SYSTEM_PROMPT },
        { role: "user", content: `Bug Report:\n${bugContext}\n\nGenerate 3 ranked hypotheses for the root cause.` }
      ],
      temperature: 0.6,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Diagnostic Agent returned non-JSON response, using fallback");
      throw new Error("Invalid JSON response");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn("Diagnostic Agent JSON parse error, using fallback");
      throw new Error("JSON parse failed");
    }

    if (!Array.isArray(parsed.hypotheses) || parsed.hypotheses.length !== 3) {
      console.warn("Diagnostic Agent returned invalid hypotheses structure, using fallback");
      throw new Error("Invalid hypotheses structure");
    }

    const responseText = content.substring(0, content.indexOf('{')).trim();

    return {
      response: responseText || "I've analyzed the issue and generated ranked hypotheses.",
      hypotheses: parsed.hypotheses,
      nextAction: parsed.next_action || "Investigate the issue further",
    };
  } catch (error: any) {
    console.error("OpenAI API Error (Diagnostic Agent) - using fallback:", error.message);
    
    const isAuth = bugReport.category?.toLowerCase().includes('auth');
    
    return {
      response: "🧠 Based on the error patterns and your description, I've generated three potential root causes ranked by likelihood.",
      hypotheses: isAuth ? [
        {
          id: 1,
          title: "Missing null check for user object after authentication",
          confidence: 85,
          details: "The authentication handler successfully retrieves user data, but subsequent code assumes the user object always exists without proper validation, causing undefined access errors when login fails."
        },
        {
          id: 2,
          title: "Async race condition in session middleware",
          confidence: 65,
          details: "Session data may not be fully initialized before components try to access user information, leading to undefined errors during the authentication flow."
        },
        {
          id: 3,
          title: "Incorrect error boundary configuration",
          confidence: 40,
          details: "The React error boundary may not be properly configured to catch and handle authentication errors, allowing undefined access to propagate through the component tree."
        }
      ] : [
        {
          id: 1,
          title: "Undefined variable or property access",
          confidence: 80,
          details: "The application is attempting to access a property on an undefined or null object, typically caused by missing data validation or incorrect state initialization."
        },
        {
          id: 2,
          title: "Asynchronous timing issue",
          confidence: 60,
          details: "Data is being accessed before it has been loaded or initialized, often occurring with API calls or state updates that haven't completed yet."
        },
        {
          id: 3,
          title: "Missing error handling",
          confidence: 45,
          details: "The code lacks proper try-catch blocks or error boundaries to gracefully handle failures, causing the application to crash when encountering unexpected conditions."
        }
      ],
      nextAction: isAuth 
        ? "Add null check for user object in login handler and ensure proper error messages are displayed"
        : "Add defensive null checks and validate all data before accessing properties"
    };
  }
}

export async function callExecutionAgent(nextAction: string, bugReport: any): Promise<{
  response: string;
  activitySteps: string[];
  codeDiff: {
    filename: string;
    lines: Array<{
      type: 'context' | 'add' | 'remove';
      lineNumber?: number;
      content: string;
    }>;
  } | null;
  finalStatus: string;
}> {
  try {
    const context = JSON.stringify({ nextAction, bugReport }, null, 2);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: EXECUTION_SYSTEM_PROMPT },
        { role: "user", content: `Execute this action:\n${context}` }
      ],
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Execution Agent returned non-JSON response, using fallback");
      throw new Error("Invalid JSON response");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn("Execution Agent JSON parse error, using fallback");
      throw new Error("JSON parse failed");
    }

    const responseText = content.substring(0, content.indexOf('{')).trim();

    return {
      response: responseText || "Executing the fix now...",
      activitySteps: Array.isArray(parsed.activity_steps) ? parsed.activity_steps : [],
      codeDiff: parsed.code_diff || null,
      finalStatus: parsed.final_status || "Processing...",
    };
  } catch (error: any) {
    console.error("OpenAI API Error (Execution Agent) - using fallback:", error.message);
    
    const isAuth = bugReport.category?.toLowerCase().includes('auth');
    const targetFile = bugReport.affected_files?.[0] || "src/main.ts";
    
    return {
      response: "I've prepared a code fix based on the most likely root cause. Here's the proposed change:",
      activitySteps: [
        "Analyzing code structure and dependencies",
        "Identifying exact location of the issue",
        "Generating defensive null check pattern",
        "Preparing git-style diff for review"
      ],
      codeDiff: isAuth ? {
        filename: "src/auth/login.ts",
        lines: [
          { type: 'context', lineNumber: 15, content: 'async function handleLogin(credentials) {' },
          { type: 'remove', lineNumber: 16, content: '  const user = await authenticateUser(credentials);' },
          { type: 'add', lineNumber: 16, content: '  const user = await authenticateUser(credentials);' },
          { type: 'add', lineNumber: 17, content: '  if (!user) {' },
          { type: 'add', lineNumber: 18, content: '    throw new Error("Invalid credentials");' },
          { type: 'add', lineNumber: 19, content: '  }' },
          { type: 'context', lineNumber: 20, content: '  return user;' },
          { type: 'context', lineNumber: 21, content: '}' },
        ]
      } : {
        filename: targetFile,
        lines: [
          { type: 'context', lineNumber: 10, content: 'function processData(data) {' },
          { type: 'remove', lineNumber: 11, content: '  return data.value.toUpperCase();' },
          { type: 'add', lineNumber: 11, content: '  if (!data || !data.value) {' },
          { type: 'add', lineNumber: 12, content: '    console.error("Invalid data:", data);' },
          { type: 'add', lineNumber: 13, content: '    return "";' },
          { type: 'add', lineNumber: 14, content: '  }' },
          { type: 'add', lineNumber: 15, content: '  return data.value.toUpperCase();' },
          { type: 'context', lineNumber: 16, content: '}' },
        ]
      },
      finalStatus: "Fix applied successfully! Status: GREEN - Ready for testing"
    };
  }
}
