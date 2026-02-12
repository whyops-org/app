"use client";

import { LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronRight,
  Key,
  PanelLeftClose,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
}

export function Sidebar({ className, defaultCollapsed = false, ...props }: SidebarProps) {
  const router = useRouter();
  // Initialize from props
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMounted, setIsMounted] = React.useState(false);

  // Handle hydration mismatch prevention
  React.useEffect(() => {
    // Check client-side cookie to ensure state consistency
    const match = document.cookie.match(new RegExp('(^| )sidebar:state=([^;]+)'));
    if (match) {
      const cookieValue = match[2] === 'true';
      if (cookieValue !== isCollapsed) {
        setIsCollapsed(cookieValue);
      }
    }

    // Enable transitions after a short delay to prevent initial animation
    setTimeout(() => setIsMounted(true), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transitionDuration = isMounted ? "duration-300" : "duration-0";

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    document.cookie = `sidebar:state=${newState}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "group relative flex h-screen flex-col border-r border-border/30 bg-card transition-all ease-in-out",
        transitionDuration,
        isCollapsed ? "w-[70px]" : "w-64",
        className
      )}
      {...props}
    >
      {/* Header / Logo */}
      <div className={cn(
        "flex h-14 items-center overflow-hidden transition-all",
        transitionDuration,
        isCollapsed ? "justify-center px-0" : "justify-between px-4"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 flex items-center justify-center">
             <LogoMark size="sm" />
          </div>
          <span
            className={cn(
              "text-sm font-semibold text-foreground whitespace-nowrap transition-all origin-left",
              transitionDuration,
              isCollapsed ? "opacity-0 w-0 -translate-x-2.5 hidden" : "opacity-100 w-auto translate-x-0"
            )}
          >
            WhyOps
          </span>
        </div>
        
        {/* Close Button (Visible when expanded) */}
        <div className={cn(
            "transition-opacity duration-200",
            isCollapsed ? "hidden opacity-0" : "opacity-100"
        )}>
            <button
                onClick={toggleSidebar}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
                <PanelLeftClose className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-hidden">
        <div className="px-3">
          <p className={cn(
            "mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 whitespace-nowrap transition-all",
            transitionDuration,
            isCollapsed ? "opacity-0 -translate-x-2.5 h-0 mb-0 overflow-hidden" : "opacity-100 translate-x-0 h-auto"
          )}>
            Platform
          </p>
          <nav className="space-y-1">
            <SidebarItem
              icon={<PlusCircle className="h-5 w-5" />}
              isCollapsed={isCollapsed}
              label="Add Provider"
              transitionDuration={transitionDuration}
            />
            <SidebarItem
              icon={<BookOpen className="h-5 w-5" />}
              isCollapsed={isCollapsed}
              label="Documentation"
              transitionDuration={transitionDuration}
            />
            <SidebarItem
              icon={<Key className="h-5 w-5" />}
              isCollapsed={isCollapsed}
              label="API Keys"
              transitionDuration={transitionDuration}
            />
          </nav>
        </div>
      </div>

      {/* Expand Button (Floating overlay when collapsed) */}
      {isCollapsed && (
        <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border/40 bg-card text-muted-foreground shadow-sm hover:text-foreground hover:bg-surface-2 transition-colors"
        >
            <ChevronRight className="h-3 w-3" />
        </button>
      )}

      {/* Footer / Status */}
      <div className="border-t border-border/30 p-3 overflow-hidden">
        <div className={cn(
            "flex items-center gap-3 transition-all",
            transitionDuration,
            isCollapsed ? "justify-center" : ""
        )}>
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <div className="absolute -inset-0.5 animate-pulse rounded-full bg-emerald-500/20" />
          </div>
          
          <div className={cn(
            "flex flex-col whitespace-nowrap transition-all overflow-hidden",
            transitionDuration,
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <span className="text-xs font-medium text-foreground">System Online</span>
            <span className="text-[10px] text-muted-foreground">v2.4.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  transitionDuration: string;
}

function SidebarItem({ icon, label, isCollapsed, transitionDuration, className, ...props }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "group flex w-full items-center rounded-md py-2 text-sm text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground",
        transitionDuration,
        isCollapsed ? "justify-center px-0 w-10 mx-auto" : "px-2.5 gap-3",
        className
      )}
      title={isCollapsed ? label : undefined}
      {...props}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center transition-colors group-hover:text-foreground",
          transitionDuration,
          isCollapsed ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {icon}
      </span>

      <span
        className={cn(
          "truncate whitespace-nowrap transition-all origin-left",
          transitionDuration,
          isCollapsed
            ? "w-0 opacity-0 overflow-hidden"
            : "w-auto opacity-100"
        )}
      >
        {label}
      </span>
    </button>
  );
}
