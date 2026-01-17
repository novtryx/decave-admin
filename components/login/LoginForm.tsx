"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess: (email: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAction(email, password);
      
      if (res.success) {
        // Pass email to OTP form
        onSuccess(email);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-[#F9F7F4]">
        Admin Login
      </h2>

      <p className="mt-2 text-sm text-[#b3b3b3]">
        Sign in to manage your event operations
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* Email */}
        <div>
          <p className="mb-2 text-[#b3b3b3]">Email</p>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0F0F0F] p-3"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <p className="mb-2 text-[#b3b3b3]">Password</p>
          <input
            type={show ? "text" : "password"}
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0F0F0F] p-3"
          />

          <div className="absolute right-2 bottom-4 flex items-center gap-2">
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <LuEye size={18} /> : <LuEyeOff size={18} />}
            </button>
            <TbCopy size={18} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#cca33a] p-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-[#b3b3b3]">
          Forgotten Password?{" "}
          <Link href="/" className="text-[#cca33a]">
            Click here
          </Link>
        </p>
      </form>
    </>
  );
}