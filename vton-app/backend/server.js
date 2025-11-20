import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import tryonRouter from "./routes/tryon.js";
import { sendGeminiMessage } from "./geminiClient.js";
import { firestore } from "./firebaseAdmin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });

app.use(
  "/api/tryon",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "garment", maxCount: 1 },
  ]),
  tryonRouter,
);

app.post("/api/chat", async (req, res) => {
  try {
    const { message, uid = "anonymous" } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const text = await sendGeminiMessage(message);

    await firestore
      .collection("users")
      .doc(uid)
      .collection("chat")
      .add({
        message,
        response: text,
        createdAt: new Date().toISOString(),
      });

    res.json({ role: "assistant", text });
  } catch (error) {
    console.error("chat proxy failed", error.message);
    res.status(500).json({ error: "Chat proxy failed" });
  }
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
