"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ShieldAlert, Lock } from "lucide-react";
import { MobileBlocker } from "@/components/admin/MobileBlocker";
import Image from "next/image";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000;
const STORAGE_KEY = "pmd_login_attempts";

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

function getAttemptRecord(): AttemptRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lockedUntil: null, lastAttempt: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: null, lastAttempt: 0 };
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch { }
}

function clearAttemptRecord() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { }
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Rate limiting state
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedOut, setLockedOut] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0); // seconds remaining

  const router = useRouter();
  const supabase = createClient();

  // ── Init rate limit state from localStorage ───────────────────────────────
  useEffect(() => {
    const record = getAttemptRecord();
    const now = Date.now();

    if (record.lockedUntil && now < record.lockedUntil) {
      setLockedOut(true);
      setLockCountdown(Math.ceil((record.lockedUntil - now) / 1000));
      setAttemptsLeft(0);
    } else if (record.lockedUntil && now >= record.lockedUntil) {
      // Lockout expired — reset
      clearAttemptRecord();
    } else {
      setAttemptsLeft(MAX_ATTEMPTS - record.count);
    }
  }, []);

  // ── Countdown ticker ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!lockedOut || lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLockedOut(false);
          clearAttemptRecord();
          setAttemptsLeft(MAX_ATTEMPTS);
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedOut, lockCountdown]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedOut || loading) return;

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        // Always show generic message — never reveal whether email or password was wrong
        const record = getAttemptRecord();
        const newCount = record.count + 1;

        if (newCount >= MAX_ATTEMPTS) {
          const lockedUntil = Date.now() + LOCKOUT_MS;
          saveAttemptRecord({ count: newCount, lockedUntil, lastAttempt: Date.now() });
          setLockedOut(true);
          setLockCountdown(LOCKOUT_MS / 1000);
          setAttemptsLeft(0);
          setError(`Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`);
        } else {
          saveAttemptRecord({ count: newCount, lockedUntil: null, lastAttempt: Date.now() });
          const remaining = MAX_ATTEMPTS - newCount;
          setAttemptsLeft(remaining);
          setError(
            remaining === 1
              ? "Invalid credentials. 1 attempt remaining before lockout."
              : `Invalid credentials. ${remaining} attempts remaining.`
          );
        }

        setLoading(false);
        return;
      }

      // Success — clear any recorded attempts
      clearAttemptRecord();
      router.push("/admin/manage");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const isDisabled = loading || lockedOut;

  return (
    <MobileBlocker>
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FCE8E6]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F7F4EF]/80 blur-2xl pointer-events-none" />

        <div className="relative w-full max-w-sm">

          {/* Logo + header */}
          <div className="text-center mb-8 space-y-3">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <Image
                  src="/precious-md-rose-pink-logo.png"
                  alt="Precious MD"
                  fill
                  sizes="64px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-[#1A1817]">
                Admin Portal
              </h1>
              <p className="text-xs text-[#706A63] mt-1">
                Precious MD Dermatology Center
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white border border-[#E8E2D9] rounded-3xl p-7 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Lockout banner */}
              {lockedOut && (
                <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Account temporarily locked</p>
                    <p className="text-[11px] text-red-600 mt-0.5">
                      Too many failed attempts. Try again in{" "}
                      <span className="font-bold font-mono">{formatCountdown(lockCountdown)}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Generic error (non-lockout) */}
              {error && !lockedOut && (
                <div className="flex items-start gap-3 p-3.5 bg-[#FFF5F5] border border-red-100 rounded-2xl">
                  <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Attempts warning */}
              {!lockedOut && attemptsLeft < MAX_ATTEMPTS && attemptsLeft > 0 && (
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#706A63]">
                    {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isDisabled}
                  placeholder="admin@preciousmd.com"
                  className="w-full px-3.5 py-2.5 text-[13px] bg-[#FDFCFA] border border-[#E8E2D9] rounded-xl text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[11px] font-medium text-[#706A63] tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isDisabled}
                    placeholder="••••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 text-[13px] bg-[#FDFCFA] border border-[#E8E2D9] rounded-xl text-[#1A1817] focus:outline-none focus:border-[#C87D87] focus:ring-2 focus:ring-[#C87D87]/10 transition-all placeholder:text-[#C8C3BC] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isDisabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0AAA4] hover:text-[#706A63] transition-colors disabled:opacity-50"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full flex items-center justify-center gap-2 bg-[#C87D87] hover:bg-[#b8707a] text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : lockedOut ? (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Locked — {formatCountdown(lockCountdown)}</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[#F2ECE4]">
              <p className="text-[11px] text-[#B0AAA4] text-center leading-relaxed">
                Authorized access only. Suspicious activity is logged.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <a href="/" className="text-xs text-[#706A63] hover:text-[#C87D87] transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </MobileBlocker>
  );
}
