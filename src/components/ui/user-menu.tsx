"use client";

import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { logout } from "@/app/(auth)/actions";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur border border-black/[0.06] py-1.5 pl-3.5 pr-2 transition-all duration-200 hover:bg-white hover:shadow-soft"
      >
        <span className="text-sm text-muted hidden sm:inline">{email}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
          {initials}
        </div>
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 w-56 rounded-xl bg-white/90 backdrop-blur-xl border border-black/[0.06] shadow-card-lg animate-fade-in p-1.5"
          >
            <div className="px-3 py-2.5 border-b border-black/[0.04]">
              <p className="text-sm font-medium text-foreground truncate">
                {email}
              </p>
              <p className="text-xs text-muted mt-0.5">Signed in</p>
            </div>
            <div className="pt-1.5">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                {loggingOut ? "Signing out\u2026" : "Sign Out"}
              </button>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
