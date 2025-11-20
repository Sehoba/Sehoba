import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

export async function runTryOn({ photo, garment, category, style, uid }) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("garment", garment);
  formData.append("category", category);
  formData.append("style", style);
  formData.append("uid", uid);

  const response = await axios.post(`${API_BASE}/tryon`, formData, {
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
}

export async function sendChatMessage(message, uid) {
  const response = await axios.post(`${API_BASE}/chat`, { message, uid });
  return response.data;
}
