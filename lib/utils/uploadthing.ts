import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({image: {maxFileSize: "4MB"}})
    .onUploadComplete(async ({metadata, file}) => {
      console.log(file);

      return {message: "File uploaded"}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;