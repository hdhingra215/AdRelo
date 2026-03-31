"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#1a1a1a",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 12,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      Download / Print
    </button>
  );
}
