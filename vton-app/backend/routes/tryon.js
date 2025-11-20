import express from "express";
import { extractPose } from "../poseExtractor.js";
import { processGarment } from "../garmentProcessor.js";
import { runStableDiffusion } from "../sdClient.js";
import { uploadBuffer } from "../../storage/minioClient.js";
import { firestore } from "../firebaseAdmin.js";

const router = express.Router();

function buildPrompt(category, style) {
  const basePrompt =
    "high-resolution full-body photo of the same person, realistic fabric, correct shadows, studio lighting, 4K photorealism";
  const categoryText = category ? ` wearing a ${category}` : "";
  const styleText = style ? ` styled as ${style}` : "";
  return `${basePrompt}${categoryText}${styleText}`.trim();
}

router.post("/", async (req, res) => {
  try {
    if (!req.files?.photo?.[0] || !req.files?.garment?.[0]) {
      return res.status(400).json({ error: "photo and garment are required" });
    }

    const photo = req.files.photo[0].buffer;
    const garment = req.files.garment[0].buffer;
    const { category = "", style = "", uid = "anonymous" } = req.body;

    const poseMap = await extractPose(photo);
    const garmentMask = await processGarment(garment);

    const payload = {
      prompt: buildPrompt(category, style),
      negative_prompt:
        "nsfw, erotic, explicit, distorted body, extra fingers, text, watermark",
      steps: 40,
      sampler_name: "DPM++ 2M Karras",
      width: 768,
      height: 1152,
      controlnet_units: [
        {
          module: "openpose",
          input_image: poseMap.toString("base64"),
          weight: 1.0,
        },
        {
          module: "cloth_warp",
          input_image: garmentMask.toString("base64"),
          weight: 0.8,
        },
      ],
    };

    const generated = await runStableDiffusion(payload);

    const photoUrl = await uploadBuffer(
      `photos/${Date.now()}-photo.jpg`,
      photo,
      "image/jpeg",
    );
    const garmentUrl = await uploadBuffer(
      `garments/${Date.now()}-garment.png`,
      garment,
      "image/png",
    );
    const resultUrl = await uploadBuffer(
      `results/${Date.now()}-result.jpg`,
      generated,
      "image/jpeg",
    );

    await firestore
      .collection("users")
      .doc(uid)
      .collection("history")
      .add({
        createdAt: new Date().toISOString(),
        category,
        style,
        photoUrl,
        garmentUrl,
        resultUrl,
      });

    res.set("Content-Type", "image/jpeg");
    res.send(generated);
  } catch (error) {
    console.error("try-on failed", error.message);
    res.status(500).json({ error: "Try-On Fehler", details: error.message });
  }
});

export default router;
