import axios from "axios";

const GARMENT_URL = process.env.GARMENT_URL || "http://127.0.0.1:5001/clothflow";

export async function processGarment(imageBuffer) {
  const response = await axios.post(
    GARMENT_URL,
    { image: imageBuffer.toString("base64") },
    { timeout: 60000 },
  );
  return Buffer.from(response.data.mask, "base64");
}
