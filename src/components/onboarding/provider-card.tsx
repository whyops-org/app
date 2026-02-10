import { Code2, EyeOff, Key, ShieldCheck, Sparkles, User } from "lucide-react";
import { useState } from "react";

import { FormField } from "./form-field";
import { InfoBox } from "./info-box";
import { SelectableCard } from "./selectable-card";
import { StepContainer } from "./step-container";
import { StepNavigation } from "./step-navigation";

const providers = [
  { name: "OpenAI", detail: "GPT-4o, GPT-3.5 Turbo", icon: Sparkles },
  { name: "Anthropic", detail: "Claude 3.5 Sonnet, Haiku", icon: User },
  { name: "Custom", detail: "Local LLM, Azure, Vertex", icon: Code2 },
];

interface ProviderCardProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export function ProviderCard({ onBack, onContinue }: ProviderCardProps) {
  const [selected, setSelected] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <StepContainer>
        {/* Provider Selection Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {providers.map((provider, index) => (
          <SelectableCard
            key={provider.name}
            icon={provider.icon}
            title={provider.name}
            description={provider.detail}
            isSelected={selected === index}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>

      {/* API Key Section */}
      <FormField
        id="api-key"
        label="Provider API Key"
        type={showPassword ? "text" : "password"}
        placeholder="sk-..."
        icon={Key}
        defaultValue="sk-live-xhq9-n2b7-secure-key"
        iconRight={
          <button 
            className="text-muted-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            <EyeOff className="h-5 w-5" />
          </button>
        }
      />
      
      {/* Security Info - Now using InfoBox component */}
      <InfoBox variant="success" icon={ShieldCheck} title="Encrypted and never shared">
        Your keys are encrypted at rest using AES-256 and only decrypted in the secure enclave during active agent sessions.
      </InfoBox>
      </StepContainer>
      
      {/* Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0 px-12 py-4 z-50">
        <div className="mx-auto max-w-7xl">
          <StepNavigation onBack={onBack} onContinue={onContinue} />
        </div>
      </div>
    </>
  );
}
