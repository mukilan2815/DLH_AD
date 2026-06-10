import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const CONTENT_KEY = "landing_page_main";

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("content");
    const doc = await collection.findOne({ key: CONTENT_KEY });
    console.log("[API GET /content] doc:", doc ? "found" : "not found", doc?.headline ?? "");

    if (!doc) {
      return NextResponse.json({ success: true, data: null }, {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const { _id, key, ...data } = doc;
    return NextResponse.json({ success: true, data }, {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[API POST /content] received headline:", body?.headline);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("content");

    await collection.updateOne(
      { key: CONTENT_KEY },
      { $set: { ...body, key: CONTENT_KEY, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log("[API POST /content] saved to DB successfully");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to save content" }, { status: 500 });
  }
}
