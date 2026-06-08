import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();
    const collection = db.collection("submissions");

    const doc = {
      ...body,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ success: false, error: "Failed to save submission" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const profession = searchParams.get("profession") ?? "All";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const sortField = searchParams.get("sortField") ?? "createdAt";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);

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

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    // Convert ObjectId to string
    const cleaned = data.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: cleaned,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch submissions" }, { status: 500 });
  }
}
