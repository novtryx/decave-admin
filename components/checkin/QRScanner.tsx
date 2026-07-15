"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { IoScanOutline } from "react-icons/io5";

interface QRScannerProps {
  onScan: (code: string) => void;
  disabled?: boolean;
}

// Cross-browser camera QR scanning: draws each video frame to a
// hidden canvas and decodes it with jsQR (pure JS, no native API
// dependency). This works the same on iOS Safari, Android Chrome,
// desktop — anywhere getUserMedia works — unlike the native
// BarcodeDetector API, which iOS Safari and Firefox don't support.
export default function QRScanner({ onScan, disabled }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          const now = Date.now();
          // Debounce: ignore the same code re-detected within 3s —
          // the camera reads the same frame many times a second.
          if (
            !lastScanRef.current ||
            lastScanRef.current.code !== code.data ||
            now - lastScanRef.current.at > 3000
          ) {
            lastScanRef.current = { code: code.data, at: now };
            onScan(code.data);
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const startCamera = async () => {
    setCameraError(null);
    setStarting(true);

    // getUserMedia only exists on secure contexts (HTTPS or
    // localhost) — if it's missing entirely, no permission prompt
    // will ever appear, so tell the person that directly instead of
    // showing a generic "check your permissions" message.
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "This browser can't access the camera here — camera access needs a secure (https://) connection."
      );
      setStarting(false);
      return;
    }

    try {
      // Calling getUserMedia is itself what triggers the browser's
      // native permission prompt the first time. If permission was
      // already denied previously, browsers won't re-prompt — that's
      // caught as NotAllowedError below with instructions to fix it
      // manually, since no JS can force a re-prompt at that point.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (err: any) {
      switch (err?.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          setCameraError(
            "Camera permission was denied. Open your browser's site settings for this page and allow Camera access, then tap \"Start Camera Scanner\" again."
          );
          break;
        case "NotFoundError":
        case "DevicesNotFoundError":
          setCameraError("No camera was found on this device.");
          break;
        case "NotReadableError":
        case "TrackStartError":
          setCameraError("The camera is already in use by another app. Close it and try again.");
          break;
        default:
          setCameraError("Couldn't access the camera. Please try again.");
      }
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode("");
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <IoScanOutline /> Scan Ticket
      </h3>

      <div className="mb-4">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            disabled={disabled || starting}
            className="w-full py-3 rounded-lg bg-[#cca33a] text-black text-sm font-semibold disabled:opacity-50"
          >
            {starting ? "Starting Camera…" : "Start Camera Scanner"}
          </button>
        ) : (
          <div>
            <div className="relative rounded-lg overflow-hidden border border-[#2a2a2a] mb-2">
              <video ref={videoRef} className="w-full" muted playsInline autoPlay />
              {/* Scan-frame overlay, purely visual */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 aspect-square border-2 border-[#cca33a] rounded-lg" />
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <button onClick={stopCamera} className="w-full py-2 rounded-lg bg-[#2a2a2a] text-white text-sm">
              Stop Camera
            </button>
          </div>
        )}
        {cameraError && <p className="text-red-500 text-xs mt-2">{cameraError}</p>}
      </div>

      <p className="text-xs text-[#6F6F6F] mb-2">Or, if a ticket won&apos;t scan, type/paste its code:</p>
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Ticket code"
          disabled={disabled}
          className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          Check In
        </button>
      </form>
    </div>
  );
}