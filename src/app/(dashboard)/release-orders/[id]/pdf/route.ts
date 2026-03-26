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

  const { data: order, error } = await supabase
    .from("release_orders")
    .select("*, clients(name)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: settings } = await supabase
    .from("agency_settings")
    .select("firm_name, gst_number, bank_account, ifsc, branch, upi_id")
    .eq("user_id", user.id)
    .single();

  const clientName =
    order.clients &&
    typeof order.clients === "object" &&
    !Array.isArray(order.clients)
      ? (order.clients as { name: string }).name
      : "—";

  const pdf = await generatePDF(order, clientName, settings);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="RO-${order.ro_number}.pdf"`,
    },
  });
}

function fmt(value: number | string): string {
  return Number(value).toFixed(2);
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
  order: Record<string, unknown>,
  clientName: string,
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

    // Title
    doc.fontSize(20).text(firmName, { align: "center" });
    doc.moveDown(0.3);
    doc
      .fontSize(14)
      .text("Release Order", { align: "center" });

    doc.moveDown(0.5);

    // RO Number & Date line
    doc
      .fontSize(10)
      .text(`RO Number: ${order.ro_number}        Date: ${order.date}`, {
        align: "center",
      });

    doc.moveDown(1.5);

    // Helper to draw a section
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

    const boldRow = (label: string, value: string) => {
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

    // Client
    sectionTitle("Client");
    row("Client Name", clientName);
    doc.moveDown(0.5);

    // Publication Details
    sectionTitle("Publication Details");
    row("Publication", String(order.publication ?? "—"));
    row("Edition", String(order.edition ?? "—"));
    row("Category", String(order.advertisement_category ?? "—"));
    row("Caption", String(order.caption ?? "—"));
    row("Size", String(order.size ?? "—"));
    row("Publishing Date", String(order.publishing_date ?? "—"));
    doc.moveDown(0.5);

    // Pricing
    sectionTitle("Pricing");
    row("Rate", fmt(order.rate as number));
    row("Card Rate", fmt(order.card_rate as number));
    row("Discount", fmt(order.discount as number));
    divider();
    boldRow("Net Amount", fmt(order.net_amount as number));
    row("GST (5%)", fmt(order.gst as number));
    divider();
    boldRow("Total Amount", fmt(order.total_amount as number));

    // Special Comment
    if (order.special_comment) {
      doc.moveDown(1);
      sectionTitle("Special Comment");
      doc
        .fontSize(10)
        .text(String(order.special_comment), { width: 495 });
    }

    // Agency & Bank Details
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
