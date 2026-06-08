import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import * as xlsx from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const profession = searchParams.get("profession") ?? "All";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const db = await getDb();
    const collection = db.collection("submissions");

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { whatsapp: { $regex: search, $options: "i" } },
      ];
    }

    if (profession !== "All") {
      query.profession = profession;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) (query.createdAt as Record<string, Date>).$gte = new Date(from);
      if (to) (query.createdAt as Record<string, Date>).$lte = new Date(to + "T23:59:59.999Z");
    }

    const data = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const rows = data.map((doc, i) => ({
      "#": i + 1,
      "First Name": doc.firstName ?? "",
      "Email": doc.email ?? "",
      "WhatsApp": doc.whatsapp ?? "",
      "Profession": doc.profession ?? "",
      "City": doc.city ?? "",
      "Registered At": doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-IN") : "",
    }));

    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Submissions");

    // Auto-width columns
    const colWidths = [
      { wch: 5 },   // #
      { wch: 20 },  // First Name
      { wch: 30 },  // Email
      { wch: 15 },  // WhatsApp
      { wch: 18 },  // Profession
      { wch: 15 },  // City
      { wch: 22 },  // Registered At
    ];
    ws["!cols"] = colWidths;

    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="dlh_submissions_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate export" }, { status: 500 });
  }
}
