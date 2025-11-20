import axios from "axios";

const SD_URL = process.env.SD_URL || "http://127.0.0.1:7860";

export async function runStableDiffusion(payload) {
  const endpoint = `${SD_URL}/sdapi/v1/img2img`;
  const response = await axios.post(endpoint, payload, {
    timeout: 120000,
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
}
