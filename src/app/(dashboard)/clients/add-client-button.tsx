"use client";

import { useState } from "react";
import { SoftButton } from "@/components/ui/soft-button";
import { ClientForm } from "./client-form";

export function AddClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SoftButton size="sm" onClick={() => setOpen(true)}>
        + Add Client
      </SoftButton>
      {open && <ClientForm onClose={() => setOpen(false)} />}
    </>
  );
}
