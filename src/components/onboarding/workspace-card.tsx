import { Code2, Copy, Key, Rocket, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "./form-field";
import { InfoBox } from "./info-box";
import { SelectableCard } from "./selectable-card";
import { StepContainer } from "./step-container";
import { StepNavigation } from "./step-navigation";

const environments = [
  { name: "Production", icon: Rocket },
  { name: "Staging", icon: User },
  { name: "Development", icon: Code2 },
];

interface WorkspaceCardProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export function WorkspaceCard({ onBack, onContinue }: WorkspaceCardProps) {
  const [selectedEnv, setSelectedEnv] = useState(0);
  const [apiKeyGenerated, setApiKeyGenerated] = useState(false); // Set to true for demo

  return (
    <>
      <StepContainer>
        {/* Project Name */}
        <FormField 
        id="project-name" 
        label="Project Name"
        defaultValue="My AI Agent" 
      />
      
      {/* Environment Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase ml-1">
          Environment
        </label>
        <div className="grid grid-cols-3 gap-3">
          {environments.map((env, index) => (
            <SelectableCard
              key={env.name}
              icon={env.icon}
              title={env.name}
              isSelected={selectedEnv === index}
              onClick={() => setSelectedEnv(index)}
              className="py-4"
            />
          ))}
        </div>
      </div>
      
      {/* Generate API Key Button */}
      {!apiKeyGenerated && (
        <Button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-14 rounded-xl text-base shadow-lg" 
          size="lg"
          onClick={() => setApiKeyGenerated(true)}
        >
          <Key className="h-5 w-5 mr-2" />
          Generate API Key
        </Button>
      )}
      
      {/* API Key Display */}
      {apiKeyGenerated && (
        <InfoBox variant="warning"  title="Security Warning" className="p-6">
          <p className="text-sm leading-relaxed mb-4">
            Save this key somewhere safe. For security reasons, <span className="text-foreground font-semibold">you won&apos;t be able to view it again</span> after leaving this page.
          </p>
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">Your Secret Key</p>
            <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
              <code className="text-sm font-mono text-foreground/90 flex-1 tracking-wide">
                pk_live_8492_xkq9_m2b7_secure_key
              </code>
              <button className="flex items-center gap-2 rounded-md hover:bg-muted/50 py-2 px-3 transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/50">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
        </InfoBox>
      )}
      </StepContainer>
      
      {/* Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0  px-12 py-4 z-50">
        <div className="mx-auto max-w-7xl">
          <StepNavigation onBack={onBack} onContinue={onContinue} />
        </div>
      </div>
    </>
  );
}
