import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const consultationId = formData.get("consultationId") as string;
    const messageId = formData.get("messageId") as string;

    if (!file || !consultationId || !messageId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Construct the path in the bucket
    const fileExt = file.name.split(".").pop();
    const fileName = `${consultationId}/${messageId}/${Date.now()}.${fileExt}`;

    // Upload to the private bucket
    const { data, error } = await supabase.storage
      .from("chat-images")
      .upload(fileName, file);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a signed URL with 30-day expiry
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("chat-images")
        .createSignedUrl(fileName, 60 * 60 * 24 * 30); // 30 days expiry

    if (signedUrlError) {
      return new Response(JSON.stringify({ error: signedUrlError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        url: signedUrlData.signedUrl,
        path: fileName,
        name: file.name,
        type: file.type,
        size: file.size,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error uploading file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
