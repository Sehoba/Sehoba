import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
let credential;
if (serviceAccountEnv) {
  const decoded = Buffer.from(serviceAccountEnv, "base64").toString("utf8");
  credential = admin.credential.cert(JSON.parse(decoded));
} else {
  const serviceAccountPath = path.join(__dirname, "serviceAccount.json");
  if (fs.existsSync(serviceAccountPath)) {
    const data = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    credential = admin.credential.cert(data);
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential || admin.credential.applicationDefault(),
  });
}

export const firestore = admin.firestore();
