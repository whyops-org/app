/**
 * Code snippets utility for the onboarding complete step
 * Generates API code examples based on user configuration
 */

export interface CodeSnippetData {
  apiKey: string;
  apiKeyPrefix: string;
  projectId: string;
  environmentId: string;
}

export interface CodeSnippet {
  filename: string;
  code: string;
}

const PYTHON_TEMPLATE = `import requests

# Your API credentials from WhyOps
WHYOPS_API_KEY = "{{apiKey}}"
WHYOPS_API_URL = "{{apiBaseUrl}}/api"
PROJECT_ID = "{{projectId}}"
ENVIRONMENT_ID = "{{environmentId}}"

def send_event(event_type, trace_id, content, metadata=None):
    """Send an event to WhyOps"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {WHYOPS_API_KEY}"
    }
    payload = {
        "eventType": event_type,
        "traceId": trace_id,
        "userId": "user-123",
        "projectId": PROJECT_ID,
        "environmentId": ENVIRONMENT_ID,
        "content": content,
        "metadata": metadata or {}
    }
    response = requests.post(
        f"{WHYOPS_API_URL}/events",
        json=payload,
        headers=headers
    )
    return response.json()

# Example usage
trace_id = "session-001"

# Send user message
send_event(
    "user_message",
    trace_id,
    {"text": "Hello, I need help with my order"}
)

# Send LLM response
send_event(
    "llm_response",
    trace_id,
    {"text": "I'd be happy to help you with your order!"},
    {"model": "gpt-4", "tokens": 150}
)

print("Events sent successfully!")`;

const JAVASCRIPT_TEMPLATE = `const axios = require('axios');

// Your API credentials from WhyOps
const WHYOPS_API_KEY = "{{apiKey}}";
const WHYOPS_API_URL = "{{apiBaseUrl}}/api";
const PROJECT_ID = "{{projectId}}";
const ENVIRONMENT_ID = "{{environmentId}}";

async function sendEvent(eventType, traceId, content, metadata = {}) {
  const response = await axios.post(\`\${WHYOPS_API_URL}/events\`, {
    eventType,
    traceId,
    userId: "user-123",
    projectId: PROJECT_ID,
    environmentId: ENVIRONMENT_ID,
    content,
    metadata
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${WHYOPS_API_KEY}\`
    }
  });
  return response.data;
}

// Example usage
const traceId = "session-001";

// Send user message
await sendEvent(
  "user_message",
  traceId,
  { text: "Hello, I need help with my order" }
);

// Send LLM response
await sendEvent(
  "llm_response",
  traceId,
  { text: "I'd be happy to help you with your order!" },
  { model: "gpt-4", tokens: 150 }
);

console.log("Events sent successfully!");`;

const TYPESCRIPT_TEMPLATE = `import axios from 'axios';

// Your API credentials from WhyOps
const WHYOPS_API_KEY = "{{apiKey}}";
const WHYOPS_API_URL = "{{apiBaseUrl}}/api";
const PROJECT_ID = "{{projectId}}";
const ENVIRONMENT_ID = "{{environmentId}}";

interface EventPayload {
  eventType: string;
  traceId: string;
  userId: string;
  projectId: string;
  environmentId: string;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

async function sendEvent(
  eventType: string,
  traceId: string,
  content: Record<string, unknown>,
  metadata?: Record<string, unknown>
): Promise<void> {
  const payload: EventPayload = {
    eventType,
    traceId,
    userId: "user-123",
    projectId: PROJECT_ID,
    environmentId: ENVIRONMENT_ID,
    content,
    metadata
  };

  await axios.post(\`\${WHYOPS_API_URL}/events\`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${WHYOPS_API_KEY}\`
    }
  });
}

// Example usage
const traceId = "session-001";

// Send user message
await sendEvent(
  "user_message",
  traceId,
  { text: "Hello, I need help with my order" }
);

// Send LLM response
await sendEvent(
  "llm_response",
  traceId,
  { text: "I'd be happy to help you with your order!" },
  { model: "gpt-4", tokens: 150 }
);

console.log("Events sent successfully!");`;

export function getPythonSnippet(data: CodeSnippetData, apiBaseUrl: string): CodeSnippet {
  return {
    filename: "main_agent.py",
    code: PYTHON_TEMPLATE
      .replace("{{apiKey}}", data.apiKey)
      .replace("{{apiBaseUrl}}", apiBaseUrl)
      .replace("{{projectId}}", data.projectId)
      .replace("{{environmentId}}", data.environmentId),
  };
}

export function getJavaScriptSnippet(data: CodeSnippetData, apiBaseUrl: string): CodeSnippet {
  return {
    filename: "main_agent.js",
    code: JAVASCRIPT_TEMPLATE
      .replace("{{apiKey}}", data.apiKey)
      .replace("{{apiBaseUrl}}", apiBaseUrl)
      .replace("{{projectId}}", data.projectId)
      .replace("{{environmentId}}", data.environmentId),
  };
}

export function getTypeScriptSnippet(data: CodeSnippetData, apiBaseUrl: string): CodeSnippet {
  return {
    filename: "main_agent.ts",
    code: TYPESCRIPT_TEMPLATE
      .replace("{{apiKey}}", data.apiKey)
      .replace("{{apiBaseUrl}}", apiBaseUrl)
      .replace("{{projectId}}", data.projectId)
      .replace("{{environmentId}}", data.environmentId),
  };
}

export function getCodeSnippet(language: string, data: CodeSnippetData, apiBaseUrl: string): CodeSnippet {
  switch (language) {
    case "python":
      return getPythonSnippet(data, apiBaseUrl);
    case "javascript":
      return getJavaScriptSnippet(data, apiBaseUrl);
    case "typescript":
      return getTypeScriptSnippet(data, apiBaseUrl);
    default:
      return getPythonSnippet(data, apiBaseUrl);
  }
}
