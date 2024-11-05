import { uploadImage } from "@/lib/cloudinary";
import type { APIRoute } from "astro";
export const prerender = "false";
export const post: APIRoute = async ({ request }) => {
  console.log("hello");
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: "File not provided" }), {
      status: 400,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadImage(buffer);
    return new Response(JSON.stringify({ url: result.secure_url }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
};
