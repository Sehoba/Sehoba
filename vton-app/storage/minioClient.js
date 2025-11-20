import { Client } from "minio";
import {
  STORAGE_ACCESS_KEY,
  STORAGE_BUCKET,
  STORAGE_ENDPOINT,
  STORAGE_PORT,
  STORAGE_SECRET_KEY,
  STORAGE_USE_SSL,
} from "../backend/config/storage.js";

export const minioClient = new Client({
  endPoint: STORAGE_ENDPOINT,
  port: STORAGE_PORT,
  useSSL: STORAGE_USE_SSL,
  accessKey: STORAGE_ACCESS_KEY,
  secretKey: STORAGE_SECRET_KEY,
});

export async function ensureBucket(bucketName = STORAGE_BUCKET) {
  const exists = await minioClient.bucketExists(bucketName).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
  }
}

export async function uploadBuffer(name, buffer, mimeType) {
  await ensureBucket();
  await minioClient.putObject(STORAGE_BUCKET, name, buffer, {
    "Content-Type": mimeType,
  });
  const protocol = STORAGE_USE_SSL ? "https" : "http";
  return `${protocol}://${STORAGE_ENDPOINT}:${STORAGE_PORT}/${STORAGE_BUCKET}/${name}`;
}
