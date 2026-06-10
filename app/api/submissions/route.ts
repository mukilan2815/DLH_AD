import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const ipSubmissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 3;

const sanitizeString = (str: string): string => {
  return str
    .trim()
    .slice(0, 100)
    .replace(/[<>\"'`]/g, "")
    .replace(/javascript:/gi, "");
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePhone = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const submissions = ipSubmissions.get(ip) || [];
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentSubmissions.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentSubmissions.push(now);
  ipSubmissions.set(ip, recentSubmissions);
  return true;
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { firstName, email, whatsapp, profession = "", city = "" } = body;

    if (!firstName || !email || !whatsapp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!validatePhone(whatsapp)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("submissions");

    const sanitizedData = {
      firstName: sanitizeString(firstName),
      email: email.toLowerCase(),
      whatsapp: whatsapp.replace(/\D/g, ""),
      profession,
      city: sanitizeString(city),
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(sanitizedData);
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
