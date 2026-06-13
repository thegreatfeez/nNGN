import { type FC, useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, QrCode, RotateCcw } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { adminApi } from "../../lib/adminApi";
import { Button } from "../../components/shared/Button";
import { formatDateTime } from "../../lib/utils";
import type { Ticket } from "../../lib/api";

type ScanState = "scanning" | "loading" | "valid" | "used" | "notfound" | "error";

interface ScanResult {
  state: ScanState;
  ticket?: Ticket;
  errorMsg?: string;
}

export const AdminScan: FC = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [result, setResult] = useState<ScanResult>({ state: "scanning" });
  const scannerDivId = "qr-scanner";

  function extractCode(raw: string): string {
    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "ticket" && parts[1]) return parts[1];
    } catch {
      // Not a URL — treat as raw code
    }
    return raw.trim();
  }

  async function onScanSuccess(decoded: string) {
    if (result.state !== "scanning") return;
    scannerRef.current?.pause(true);
    setResult({ state: "loading" });

    const code = extractCode(decoded);

    try {
      const res = await adminApi.markTicketUsed(code);
      setResult({ state: "valid", ticket: res.ticket });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("already used")) {
        try {
          const { ticket } = await adminApi.markTicketUsed(code).catch(async () => {
            const t = await fetch(
              `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/api/tickets/${code}`
            ).then((r) => r.json());
            return { ticket: t };
          });
          setResult({ state: "used", ticket });
        } catch {
          setResult({ state: "used" });
        }
      } else if (msg.includes("not found")) {
        setResult({ state: "notfound" });
      } else {
        setResult({ state: "error", errorMsg: msg });
      }
    }
  }

  function reset() {
    setResult({ state: "scanning" });
    scannerRef.current?.resume();
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerDivId,
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );
    scanner.render(onScanSuccess, (err) => { void err; });
    scannerRef.current = scanner;
    return () => { scanner.clear().catch(() => {}); };
  }, []);

  const isScanning = result.state === "scanning" || result.state === "loading";

  return (
    <div className="p-8 space-y-6 max-w-lg animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Scan QR Code</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Point the camera at a ticket QR code to verify and mark it as used.
        </p>
      </div>

      {/* Scanner */}
      <div
        className={`rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 shadow-sm ${
          !isScanning ? "hidden" : ""
        }`}
      >
        <div
          id={scannerDivId}
          className="[&_video]:rounded-xl [&_select]:bg-white [&_select]:text-gray-900 [&_select]:border-gray-200 [&_button]:bg-violet-600 [&_button]:text-white [&_button]:rounded-xl [&_button]:border-0"
        />
        {result.state === "loading" && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border-t border-gray-100">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-violet-500" />
            Verifying ticket…
          </div>
        )}
      </div>

      {!isScanning && <ResultCard result={result} onReset={reset} />}

      {isScanning && (
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <QrCode size={14} className="text-violet-400 shrink-0" />
          <span>Scan a ticket QR code — camera access required</span>
        </div>
      )}
    </div>
  );
};

const ResultCard: FC<{ result: ScanResult; onReset: () => void }> = ({ result, onReset }) => {
  const isValid = result.state === "valid";

  return (
    <div
      className={`rounded-2xl border-2 p-8 space-y-5 text-center animate-scale-in ${
        isValid
          ? "border-emerald-200 bg-emerald-50"
          : "border-rose-200 bg-rose-50"
      }`}
    >
      <div className={`h-16 w-16 rounded-2xl mx-auto flex items-center justify-center ${
        isValid ? "bg-emerald-100" : "bg-rose-100"
      }`}>
        {isValid ? (
          <CheckCircle size={32} className="text-emerald-500" />
        ) : (
          <XCircle size={32} className="text-rose-500" />
        )}
      </div>

      <div>
        <p className={`text-xl font-black ${isValid ? "text-emerald-700" : "text-rose-700"}`}>
          {isValid && "Valid — Admit"}
          {result.state === "used" && "Already Used"}
          {result.state === "notfound" && "Ticket Not Found"}
          {result.state === "error" && "Verification Failed"}
        </p>

        {result.ticket && (
          <div className="mt-3 space-y-1">
            <p className="font-semibold text-gray-800 text-sm">{result.ticket.event_title}</p>
            <p className="font-mono text-xs text-gray-400">{result.ticket.ticket_code}</p>
            {result.state === "used" && result.ticket.used_at && (
              <p className="text-xs text-rose-500 font-medium">
                Scanned: {formatDateTime(result.ticket.used_at)}
              </p>
            )}
          </div>
        )}

        {result.state === "error" && result.errorMsg && (
          <p className="text-xs text-rose-500 mt-2">{result.errorMsg}</p>
        )}
      </div>

      <Button onClick={onReset} variant={isValid ? "secondary" : "outline"} className="w-full">
        <RotateCcw size={14} /> Scan Next
      </Button>
    </div>
  );
};
