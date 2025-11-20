export const STORAGE_BUCKET = process.env.MINIO_BUCKET || "vton-media";
export const STORAGE_ENDPOINT = process.env.MINIO_ENDPOINT || "localhost";
export const STORAGE_PORT = parseInt(process.env.MINIO_PORT || "9000", 10);
export const STORAGE_USE_SSL = process.env.MINIO_USE_SSL === "true";
export const STORAGE_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin";
export const STORAGE_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin";
