import { NextResponse } from "next/server";
import { setupChatAttachmentsBucket } from "../setup-bucket";

export async function POST() {
  try {
    await setupChatAttachmentsBucket();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up bucket:", error);
    return NextResponse.json(
      { error: "Failed to setup bucket" },
      { status: 500 }
    );
  }
}