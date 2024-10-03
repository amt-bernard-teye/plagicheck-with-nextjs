import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "@/lib/utils/uploadthing";

export default createRouteHandler({
  router: ourFileRouter,
});