import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Function to download a presigned URL from Supabase storage.
 * @param {SupabaseClient} supabase - The initialized Supabase client.
 * @param {string} filename - The name of the file for which to get the presigned URL.
 * @param {string} bucketName - The name of the bucket where the file is stored.
 * @returns {Promise<string | null>} - A promise that resolves to the presigned URL or null if an error occurs.
 */
export async function downloadPresignedUrl(
  supabase: SupabaseClient,
  filename: string,
  bucketName: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filename, 60); // URL valid for 60 seconds

    if (error) {
      console.error("Error getting presigned URL: ", error);
      return null;
    }

    return data?.signedUrl;
  } catch (error) {
    console.error("Exception when getting presigned URL: ", error);
    return null;
  }
}

/**
 * Helper function to upload an image to Supabase storage.
 * @param {SupabaseClient} supabase - The initialized Supabase client.
 * @param {string} bucketName - The name of the bucket where the file will be stored.
 * @param {string} filename - The name of the file to be uploaded.
 * @param {Blob | ArrayBufferView | ArrayBuffer | string} fileContent - The content of the file to be uploaded.
 * @param {boolean} [upsert=false] - Whether to overwrite an existing file with the same name.
 * @returns {Promise<{data: any, error: any}>} - A promise that resolves to the result of the upload operation.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  bucketName: string,
  filename: string,
  fileContent: Blob | ArrayBufferView | ArrayBuffer | string,
  upsert = false,
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, fileContent, { upsert });
    if (error) {
      console.error("Error uploading image: ", error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error) {
    console.error("Exception when uploading image: ", error);
    return { data: null, error };
  }
}

/**
 * Function to delete an image from Supabase storage.
 * @param {SupabaseClient} supabase - The initialized Supabase client.
 * @param {string} filename - The name of the file to be deleted.
 * @param {string} bucketName - The name of the bucket where the file is stored.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file was successfully deleted, false otherwise.
 */
export async function deleteImage(
  supabase: SupabaseClient,
  filename: string,
  bucketName: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filename]);

    if (error) {
      console.error("Error deleting image: ", error);
      return false;
    }

    console.log("Succeeded in deleting: ", data);
    return true;
  } catch (error) {
    console.error("Exception when deleting image: ", error);
    return false;
  }
}
