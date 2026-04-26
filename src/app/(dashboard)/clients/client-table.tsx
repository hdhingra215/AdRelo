"use client";

import { useState } from "react";
import { ClientForm } from "./client-form";

interface Client {
  id: string;
  name: string;
  phone: string;
  gst_number: string;
  address: string;
}

export function ClientTable({ clients }: { clients: Client[] }) {
  const [editing, setEditing] = useState<Client | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <>
      {clients.length === 0 ? (
        <div className="fade-in-up rounded-2xl bg-white/80 backdrop-blur-xl shadow-card px-8 py-24 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04]">
            <svg className="h-6 w-6 text-foreground/25" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 013 17.16V17a6.003 6.003 0 017.212-5.876M15 19.128H9m6 0a5.97 5.97 0 00-.786-3.07M9 19.128A5.97 5.97 0 009.786 16M12 12a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground/40">
            No clients yet
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
            Add your first client to get started
          </p>
          <div className="mt-8">
            <button
              onClick={() => setAdding(true)}
              className="rounded-xl bg-black px-6 py-3 text-[15px] font-semibold text-white transition-all hover:bg-black/90 active:scale-[0.98]"
            >
              Add your first client
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in-up overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-card">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-black/[0.04]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  GST
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-black/[0.03] transition-colors duration-150 hover:bg-black/[0.015]"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-medium text-foreground">
                      {client.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {client.phone || "\u2014"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {client.gst_number || "\u2014"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      onClick={() => setEditing(client)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-black/[0.04] transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      {adding && <ClientForm onClose={() => setAdding(false)} />}

      {/* Edit modal */}
      {editing && (
        <ClientForm client={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
