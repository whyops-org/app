"use client";

import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/onboarding/auth-card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative h-dvh overflow-hidden bg-grid">
      <main className="relative mx-auto flex h-dvh w-full items-center justify-center overflow-x-hidden px-6 py-10">
        <AuthCard onGithubClick={() => router.push("/onboarding")} />
      </main>
    </div>
  );
}
