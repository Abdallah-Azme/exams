"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { apiClient } from "@/src/utils";
import { logout } from "@/src/utils/cookies";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function Header() {
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/logout");
    },
    onSuccess: () => {
      useStore.getState().setUser(null);
      logout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-semibold">Demo book Exam</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="text-sm  text-blue-500 hover:text-blue-400 hover:underline font-semibold"
          >
            Profile
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
