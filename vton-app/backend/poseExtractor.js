import axios from "axios";

const POSE_URL = process.env.POSE_URL || "http://127.0.0.1:5000/openpose";

export async function extractPose(imageBuffer) {
  const response = await axios.post(
    POSE_URL,
    { image: imageBuffer.toString("base64") },
    { timeout: 60000 },
  );
  return Buffer.from(response.data.pose, "base64");
}
