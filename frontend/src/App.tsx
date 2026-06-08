import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./app/providers/QueryProvider";
import { WalletProvider } from "./app/providers/WalletProvider";
import Router from "./app/Router";

// Initialise AppKit (side-effect import)
import "./lib/appkit";

export default function App() {
  return (
    <QueryProvider>
      <WalletProvider>
        <Router />
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#0f172a",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "14px",
              maxWidth: "380px",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            },
            success: {
              duration: 4000,
              iconTheme: { primary: "#34d399", secondary: "#0f172a" },
              style: {
                background: "#0f172a",
                border: "1px solid rgba(52,211,153,0.35)",
                color: "#f1f5f9",
              },
            },
            error: {
              duration: 7000,
              iconTheme: { primary: "#f87171", secondary: "#0f172a" },
              style: {
                background: "#0f172a",
                border: "1px solid rgba(248,113,113,0.35)",
                color: "#f1f5f9",
              },
            },
          }}
        />
      </WalletProvider>
    </QueryProvider>
  );
}
