import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ message: "Git pull not available on Vercel" }); }
