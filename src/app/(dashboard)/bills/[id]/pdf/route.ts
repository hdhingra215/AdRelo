import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PDFDocument from "pdfkit";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: bill, error } = await supabase
    .from("bills")
    .select(
      "*, clients(name), release_orders(ro_number, advertisement_category, publication, edition, size)"
    )
    .eq("id", params.id)
    .single();

  if (error || !bill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: settings } = await supabase
    .from("agency_settings")
    .select("firm_name, gst_number, bank_account, ifsc, branch, upi_id")
    .eq("user_id", user.id)
    .single();

  const clientName =
    bill.clients &&
    typeof bill.clients === "object" &&
    !Array.isArray(bill.clients)
      ? (bill.clients as { name: string }).name
      : "\u2014";

  const ro =
    bill.release_orders &&
    typeof bill.release_orders === "object" &&
    !Array.isArray(bill.release_orders)
      ? (bill.release_orders as {
          ro_number: string;
          advertisement_category: string;
          publication: string;
          edition: string;
          size: string;
        })
      : null;

  const pdf = await generatePDF(bill, clientName, ro, settings);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Invoice-${bill.bill_number}.pdf"`,
    },
  });
}

function fmt(value: number | string): string {
  return Number(value).toFixed(2);
}

interface ROInfo {
  ro_number: string;
  advertisement_category: string;
  publication: string;
  edition: string;
  size: string;
}

interface AgencySettings {
  firm_name: string;
  gst_number: string;
  bank_account: string;
  ifsc: string;
  branch: string;
  upi_id: string;
}

function generatePDF(
  bill: Record<string, unknown>,
  clientName: string,
  ro: ROInfo | null,
  settings: AgencySettings | null
): Promise<Buffer> {
  const firmName = settings?.firm_name || "Sai Kripa Publicity";

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ──
    doc.fontSize(20).text(firmName, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(14).text("Invoice", { align: "center" });
    doc.moveDown(1.5);

    // ── Helpers ──
    const sectionTitle = (title: string) => {
      doc.fontSize(12).text(title);
      doc.moveDown(0.3);
      doc
        .moveTo(doc.x, doc.y)
        .lineTo(doc.x + 495, doc.y)
        .strokeColor("#cccccc")
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.4);
    };

    const row = (label: string, value: string) => {
      const y = doc.y;
      doc.fontSize(10).text(label, 50, y, { width: 200 });
      doc.fontSize(10).text(value, 260, y, { width: 280 });
      doc.moveDown(0.6);
    };

    const divider = () => {
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#eeeeee")
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.4);
    };

    // ── Bill Info ──
    sectionTitle("Bill Information");
    row("Bill Number", String(bill.bill_number));
    row("Date", String(bill.date));
    doc.moveDown(0.5);

    // ── Client ──
    sectionTitle("Client");
    row("Client Name", clientName);
    doc.moveDown(0.5);

    // ── Release Order Details ──
    if (ro) {
      sectionTitle("Release Order Details");
      row("RO Number", ro.ro_number);
      row("Publication", ro.publication);
      row("Edition", ro.edition);
      row("Category", ro.advertisement_category);
      row("Size", ro.size);
      doc.moveDown(0.5);
    }

    // ── Pricing ──
    sectionTitle("Pricing");
    row("Amount (Rate)", fmt(bill.amount as number));
    row("Discount", fmt(bill.discount as number));
    divider();
    row("Net Amount", fmt(bill.net_amount as number));
    row("GST (5%)", fmt(bill.gst as number));
    divider();

    // Total — emphasized
    const totalY = doc.y;
    doc.fontSize(11).text("Total Amount", 50, totalY, { width: 200 });
    doc.fontSize(14).text(fmt(bill.total_amount as number), 260, totalY - 1, {
      width: 280,
    });
    doc.moveDown(1.5);

    // ── Amount in Words ──
    sectionTitle("Amount in Words");
    doc.fontSize(10).text(String(bill.amount_in_words ?? ""), { width: 495 });

    // ── Agency & Bank Details ──
    if (settings) {
      doc.moveDown(1.5);
      sectionTitle("Agency Details");
      row("Firm Name", settings.firm_name || "—");
      row("GST Number", settings.gst_number || "—");
      doc.moveDown(0.5);

      sectionTitle("Bank Details");
      row("Account Number", settings.bank_account || "—");
      row("IFSC Code", settings.ifsc || "—");
      row("Branch", settings.branch || "—");
      row("UPI ID", settings.upi_id || "—");
    }

    doc.end();
  });
}
