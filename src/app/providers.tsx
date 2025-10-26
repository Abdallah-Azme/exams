// app/providers.tsx
"use client";

import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiError } from "../utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
});

function ErrorHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.mutation.state.status === "error") {
        const error = event.mutation.state.error;

        if (error instanceof ApiError) {
          if (error.validationErrors) {
            // Show validation errors
            Object.entries(error.validationErrors).forEach(
              ([field, errors]) => {
                const fieldName =
                  field.charAt(0).toUpperCase() + field.slice(1);
                const messages = Array.isArray(errors) ? errors : [errors];
                messages.forEach((msg) => {
                  toast.error(`${fieldName}: ${msg}`);
                });
              }
            );
          } else {
            toast.error(error.message);
          }
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorHandler>{children}</ErrorHandler>
    </QueryClientProvider>
  );
}
