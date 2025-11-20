import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseApp } from "./firebase.js";

const db = getFirestore(firebaseApp);

export async function saveResult(uid, payload) {
  const col = collection(db, "users", uid, "history");
  await addDoc(col, { ...payload, createdAt: Timestamp.now() });
}

export function subscribeToHistory(uid, callback) {
  const col = collection(db, "users", uid, "history");
  const q = query(col, orderBy("createdAt", "desc"), limit(20));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
}

export async function saveChatMessage(uid, message) {
  const col = collection(db, "users", uid, "chat");
  await addDoc(col, { message, createdAt: Timestamp.now() });
}
