"use client";

import { useState } from "react";
import { ClientForm } from "./client-form";

export function AddClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
      >
        Add Client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Client</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <ClientForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}