"use client";

import { useState, useEffect } from "react";
import OtpInput from "./OtpInput";
import { verifyOTPAction, resendOTPAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  onBack: () => void;
  email: string;
}

export default function OtpForm({ onBack, email }: OtpFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const isComplete = code.every(Boolean);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const otp = code.join("");
      const res = await verifyOTPAction(email, otp);

      if (res.token) {
        // Show success alert
        setShowSuccess(true);
        
        // // Wait for success message, then do a hard redirect
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  
  const handleResend = async () => {
    if (timeLeft > 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await resendOTPAction(email, "");
      
      if (res.success) {
        setTimeLeft(300); // Reset to 5 minutes
        setCode(Array(6).fill("")); // Clear OTP input
      } else {
        setError(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Alert */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-white">Admin login successful</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mb-4 text-sm text-[#b3b3b3] hover:text-white"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-white">
        Two-Factor Authentication
      </h2>

      <p className="mt-2 text-sm text-[#b3b3b3]">
        Enter 6-digit code sent to{" "}
        <span className="text-white">{email}</span>
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6">
        <OtpInput value={code} setValue={setCode} />
      </div>

      <button
        disabled={!isComplete || loading}
        onClick={handleVerify}
        className="
          mt-6 w-full rounded-full p-3
          disabled:bg-gray-600 disabled:cursor-not-allowed
          enabled:bg-[#cca33a]
          text-white
        "
      >
        {loading ? "Verifying..." : "Confirm"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-400">
        {timeLeft > 0 ? (
          <>
            Resend in <span className="text-[#cca33a]">{formatTime(timeLeft)}</span>
          </>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-[#cca33a] hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </p>
    </>
  );
}




