// ported from gbthang - QueryClientProvider + Toaster - 2026-04-17
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: "0.875rem",
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#fff" },
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
