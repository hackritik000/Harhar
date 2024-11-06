import { ActionError, defineAction } from "astro:actions";
import { uploadImage } from "@/lib/cloudinary";
import { z } from "astro/zod";

export const uploadFile = {
  uploadfile: defineAction({
    accept: "form",
    input: z.object({
      ritik: z.string(),
      file: z.instanceof(File),
    }),
    handler: async (input) => {
      console.log("jhaklsdf")
      try {
        const result = await uploadImage(input.file);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
      return;
    },
  }),
};
