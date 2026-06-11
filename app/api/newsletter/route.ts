import { NextResponse } from "next/server";

// Simple newsletter signup - stores in DB or sends to email service
// For now, just validates and returns success
export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // In production: integrate with Mailchimp/Klaviyo/Resend
    // For now just return success
    console.log(`Newsletter signup: ${name || "Anonymous"} <${email}>`);
    
    return NextResponse.json({ 
      success: true, 
      message: "You're on the list! Check your email for a welcome gift." 
    });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
