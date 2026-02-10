"use client";

import { ArrowRight, Info } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "./code-block";
import { CommandBlock } from "./command-block";
import { InfoBox } from "./info-box";
import { StepContainer } from "./step-container";
import { TabSelector } from "./tab-selector";

const languages = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "javascript", label: "JavaScript", icon: "⚡" },
  { id: "typescript", label: "TypeScript", icon: "📘" },
] as const;

const codeSnippets = {
  python: {
    install: "$ pip install whyops",
    filename: "main_agent.py",
    code: `import os
import whyops

# Initialize the SDK with your API key
whyops.init(
  api_key="sk_live_948d_xjf03_mxv201",
  environment="production"
)

# Decorate your main agent function to trace decisions
@whyops.trace(tags=["customer-service", "level-1"])
def handle_customer_inquiry(query):
  # Your agent logic here
  context = retrieve_context(query)
  decision = llm.predict(context)
  
  return decision`,
  },
  javascript: {
    install: "$ npm install whyops",
    filename: "main_agent.js",
    code: `const whyops = require('whyops');

// Initialize the SDK with your API key
whyops.init({
  apiKey: "sk_live_948d_xjf03_mxv201",
  environment: "production"
});

// Decorate your main agent function to trace decisions
const handleCustomerInquiry = whyops.trace(
  async (query) => {
    // Your agent logic here
    const context = await retrieveContext(query);
    const decision = await llm.predict(context);
    
    return decision;
  },
  { tags: ["customer-service", "level-1"] }
);`,
  },
  typescript: {
    install: "$ npm install whyops",
    filename: "main_agent.ts",
    code: `import whyops from 'whyops';

// Initialize the SDK with your API key
whyops.init({
  apiKey: "sk_live_948d_xjf03_mxv201",
  environment: "production"
});

// Decorate your main agent function to trace decisions
const handleCustomerInquiry = whyops.trace(
  async (query: string): Promise<string> => {
    // Your agent logic here
    const context = await retrieveContext(query);
    const decision = await llm.predict(context);
    
    return decision;
  },
  { tags: ["customer-service", "level-1"] }
);`,
  },
};

export function CompleteStep() {
  const [selectedLang, setSelectedLang] = useState<keyof typeof codeSnippets>("python");

  const snippet = codeSnippets[selectedLang];

  return (
    <>
      <StepContainer>
        {/* Language Tabs */}
        <TabSelector
          tabs={languages}
          selectedTab={selectedLang}
          onTabChange={(tabId) => setSelectedLang(tabId as keyof typeof codeSnippets)}
        />
        
        {/* Content */}
        <div className="space-y-6">
          {/* 1. Install the package */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              <span className="text-muted-foreground">1</span> Install the package
            </h3>
            <CommandBlock command={snippet.install} />
          </div>

          {/* 2. Initialize & Trace */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              <span className="text-muted-foreground">2</span> Initialize & Trace
            </h3>
            
            {/* File label with badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">{snippet.filename}</span>
              <Badge className="bg-primary/10 border-primary/30 text-primary">
                Generated API Key
              </Badge>
            </div>

            {/* Code block */}
            <CodeBlock code={snippet.code} language="typescript" />

            {/* Info box */}
            <InfoBox variant="info" icon={Info} title="">
              <p className="text-sm">
                The <code className="rounded bg-muted/50 font-mono text-xs">@whyops.trace</code> decorator automatically captures inputs, outputs, and intermediate reasoning steps.
              </p>
            </InfoBox>
          </div>
        </div>
      </StepContainer>
      
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 px-12 py-4 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => window.open("/docs", "_blank")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            View Documentation
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Waiting for first event...</span>
            </div>
            
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={() => window.location.href = "/dashboard"}
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
