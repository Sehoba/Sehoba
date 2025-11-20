import { ensureBucket } from "./minioClient.js";

ensureBucket().then(() => {
  console.log("MinIO bucket ready");
});
