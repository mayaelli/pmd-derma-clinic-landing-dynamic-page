import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email, patientName, subject, message } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.log("----------------------------------------");
      console.log(`[DEV EMAIL SIMULATION] To: ${email}`);
      console.log(`[SUBJECT]: ${subject}`);
      console.log(`[MESSAGE]: ${message}`);
      console.log("----------------------------------------");
      return NextResponse.json({ success: true, simulated: true });
    }

    // Only instantiate Resend when the key is available
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "Precious MD Clinic <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333D29; max-width: 500px; border: 1px solid #F2ECE4; border-radius: 12px;">
          <h2 style="color: #CD9581; margin-top: 0;">Precious MD Clinic</h2>
          <p>Dear <strong>${patientName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #556365;">${message}</p>
          <hr style="border: none; border-top: 1px solid #F2ECE4; margin: 20px 0;" />
          <p style="font-size: 11px; color: #908A94;">This is an automated operational notice from Precious MD Clinic Management System.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Email delivery failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}