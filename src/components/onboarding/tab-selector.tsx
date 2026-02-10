import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabSelectorProps {
  tabs: readonly Tab[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabSelector({ tabs, selectedTab, onTabChange, className }: TabSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
            selectedTab === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.icon && <span className="text-base">{tab.icon}</span>}
          {tab.label}
          {selectedTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
