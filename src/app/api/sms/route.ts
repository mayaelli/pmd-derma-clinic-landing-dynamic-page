// src/app/api/sms/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    const apiKey = process.env.SEMAPHORE_API_KEY;

    // If key is missing during local dev, log to server console instead of breaking
    if (!apiKey) {
      console.log("----------------------------------------");
      console.log(`[DEV SMS SIMULATION] To: ${phone}`);
      console.log(`[MESSAGE]: ${message}`);
      console.log("----------------------------------------");
      return NextResponse.json({
        success: true,
        simulated: true,
        notice: "No SEMAPHORE_API_KEY found in .env.local. Logged to server console.",
      });
    }

    // Live Semaphore Dispatch
    const response = await fetch("https://api.semaphore.co/api/v4/messages", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        apikey: apiKey,
        number: phone,
        message: message,
        sendername: process.env.SEMAPHORE_SENDER_NAME || "PreciousMD",
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("SMS Delivery Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to deliver SMS" }, { status: 500 });
  }
}