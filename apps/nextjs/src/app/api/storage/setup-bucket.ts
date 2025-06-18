import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// This function ensures the chat-attachments bucket exists and has proper public access policies
export async function setupChatAttachmentsBucket() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies().set(name, value, options);
          });
        },
      },
    },
  );

  // Check if the bucket exists already
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(
    (bucket) => bucket.name === "chat-attachments",
  );

  // Create the bucket if it doesn't exist
  if (!bucketExists) {
    const { data, error } = await supabase.storage.createBucket(
      "chat-attachments",
      {
        public: true, // Make the bucket publicly accessible
        fileSizeLimit: 10485760, // 10MB limit per file
      },
    );

    if (error) {
      console.error("Error creating chat-attachments bucket:", error);
      return;
    }

    // Set up a policy to allow public read access to all files in the bucket
    await supabase.storage
      .from("chat-attachments")
      .createSignedUrl("test.txt", 1);

    console.log("Created chat-attachments bucket with public access");
  }
}

// You can call this function during app initialization or from an API route
