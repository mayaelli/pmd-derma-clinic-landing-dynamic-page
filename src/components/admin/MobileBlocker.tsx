"use client";

import { useEffect, useState } from "react";
import { Monitor, Tablet, Smartphone, AlertCircle } from "lucide-react";
import Image from "next/image";

export function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // Check if screen width is less than 768px (mobile devices)
      const isMobileWidth = window.innerWidth < 768;
      setIsMobile(isMobileWidth);
      setIsChecking(false);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Show nothing while checking to prevent flash
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#CD9581]/20" />
        </div>
      </div>
    );
  }

  // Show blocker on mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F3EFEA] to-[#EAE4DC] relative overflow-hidden flex items-center justify-center p-4">
        {/* Decorative Background Blur Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#CD9581]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#E5BCA9]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#908A94]/5 rounded-full blur-3xl" />
        </div>

        {/* Main Content Card */}
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5BCA9]/30 rounded-3xl shadow-2xl overflow-hidden">

            {/* Logo Section */}
            <div className="bg-gradient-to-br from-[#CD9581] to-[#B8846F] px-6 py-8 text-center relative">
              <div className="absolute inset-0 bg-[url('/precious-md-rose-pink-logo.png')] opacity-5 bg-center bg-cover" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-serif text-xl font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-white/80 text-xs mt-1 font-light">
                  Precious MD Dermatology Center
                </p>
              </div>
            </div>

            {/* Message Section */}
            <div className="p-6 space-y-5">

              {/* Alert Box */}
              <div className="bg-[#FFF5F3] border border-[#FADCD9] rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#CD9581] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-[#333D29] mb-1">
                    Desktop Access Required
                  </h3>
                  <p className="text-xs text-[#736C64] leading-relaxed">
                    The admin panel is optimized for larger screens to ensure the best management experience.
                  </p>
                </div>
              </div>

              {/* Supported Devices */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#908A94] uppercase tracking-wider">
                  Supported Devices
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Desktop/Laptop */}
                  <div className="bg-[#F7EFE9] border border-[#E5BCA9]/30 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-[#CD9581]" />
                    </div>
                    <p className="text-xs font-semibold text-[#333D29]">Desktop</p>
                    <p className="text-[10px] text-[#908A94] mt-0.5">Windows & macOS</p>
                  </div>

                  {/* Tablet/iPad */}
                  <div className="bg-[#F7EFE9] border border-[#E5BCA9]/30 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center">
                      <Tablet className="w-5 h-5 text-[#CD9581]" />
                    </div>
                    <p className="text-xs font-semibold text-[#333D29]">Tablet</p>
                    <p className="text-[10px] text-[#908A94] mt-0.5">iPad & Android</p>
                  </div>
                </div>
              </div>

              {/* Not Supported */}
              <div className="bg-[#F3EFEA] border border-[#E8E2D9] rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#908A94]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#333D29]">
                    Mobile Phones Not Supported
                  </p>
                  <p className="text-[10px] text-[#736C64] mt-0.5">
                    Please switch to a desktop, laptop, or tablet to access the admin panel.
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="pt-3 border-t border-[#E8E2D9]">
                <p className="text-[11px] text-[#736C64] text-center leading-relaxed">
                  For the best experience managing bookings, services, and clinic operations, please use a device with a larger screen.
                </p>
              </div>

              {/* Action Button (Optional - can link to main site) */}
              <a
                href="/"
                className="block w-full px-4 py-2.5 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold rounded-xl text-center transition-all shadow-sm"
              >
                Return to Main Website
              </a>

            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[10px] text-[#908A94] mt-4">
            Minimum screen width: 768px (Tablet size)
          </p>
        </div>
      </div>
    );
  }

  // Show admin panel on tablet and larger
  return <>{children}</>;
}
