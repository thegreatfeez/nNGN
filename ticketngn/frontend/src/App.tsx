import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./app/providers/QueryProvider";
import { WalletProvider } from "./app/providers/WalletProvider";
import Router from "./app/Router";

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
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #ede9fe",
              borderRadius: "14px",
              fontSize: "14px",
              maxWidth: "380px",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(124,58,237,0.12)",
            },
            success: {
              duration: 4000,
              iconTheme: { primary: "#7c3aed", secondary: "#ffffff" },
              style: {
                border: "1px solid #c4b5fd",
              },
            },
            error: {
              duration: 7000,
              iconTheme: { primary: "#f43f5e", secondary: "#ffffff" },
              style: {
                border: "1px solid #fecdd3",
              },
            },
          }}
        />
      </WalletProvider>
    </QueryProvider>
  );
}
