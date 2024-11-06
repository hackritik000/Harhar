export const prerender = true;

import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import fs, { unlink } from "fs";
import path from "path";

cloudinary.config({
  cloud_name: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: File): Promise<UploadApiResponse> => {
  console.log("hello")
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = Date.now() + Math.round(Math.random() * 5) + ".png";
  const filePath = path.join(process.cwd(), "/public/uploads/", fileName);
  fs.writeFile(filePath, buffer, (error) => {
    if (error) {
      console.log(error);
    }
  });

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "astro_uploads", // Specify the folder in Cloudinary
    });
    // if (result) {
    //   unlink(filePath, (error) => {
    //     console.log(error);
    //   });
    // }
    return result;
  } catch (error) {
    const uploadError = error as UploadApiErrorResponse;
    console.error("Cloudinary Upload Error:", uploadError.message);
    // unlink(filePath, (error) => {
    //   console.log(error);
    // });
    throw uploadError;
  }
};
