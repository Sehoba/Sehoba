import { useEffect, useState } from "react";
import { loginWithGoogle, logout, onAuthStateChanged } from "../firebase/auth.js";
import { subscribeToHistory } from "../firebase/firestore.js";
import { runTryOn, sendChatMessage } from "./api.js";
import UploadArea from "./components/UploadArea.jsx";
import CategorySelect from "./components/CategorySelect.jsx";
import Preview from "./components/Preview.jsx";
import HistoryList from "./components/HistoryList.jsx";

const categories = ["T-Shirt", "Hoodie", "Jacke", "Kleid", "Hemd"];
const styles = ["streetwear", "minimal", "sporty", "business", "bohemian"];

export default function App() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [garment, setGarment] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [style, setStyle] = useState(styles[0]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged((current) => {
      setUser(current);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const unsubscribe = subscribeToHistory(user.uid, setHistory);
    return unsubscribe;
  }, [user]);

  const handleTryOn = async () => {
    if (!photo || !garment || !user) return;
    setBusy(true);
    try {
      const url = await runTryOn({
        photo,
        garment,
        category,
        style,
        uid: user.uid,
      });
      setPreviewUrl(url);
    } finally {
      setBusy(false);
    }
  };

  const handleSendChat = async (message) => {
    const response = await sendChatMessage(message, user?.uid);
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: message },
      { role: response.role, text: response.text },
    ]);
  };

  const loggedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Virtual Try-On</p>
          <h1 className="text-2xl font-bold text-slate-900">SD + ControlNet</h1>
        </div>
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <span className="text-sm text-slate-700">
                {user.email || user.displayName}
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
            >
              Google Login
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <CategorySelect
              categories={categories}
              styles={styles}
              value={{ category, style }}
              onChangeCategory={setCategory}
              onChangeStyle={setStyle}
            />
            <UploadArea
              photo={photo}
              garment={garment}
              onPhotoChange={setPhoto}
              onGarmentChange={setGarment}
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow disabled:bg-slate-300"
                onClick={handleTryOn}
                disabled={!photo || !garment || !loggedIn || busy}
              >
                {busy ? "Wird generiert…" : "Try-On starten"}
              </button>
              <p className="text-sm text-slate-500">
                ControlNet: OpenPose + Cloth Warp | 40 Steps | 768x1152
              </p>
            </div>
          </div>

          <Preview url={previewUrl} />

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Chat mit Gemini</h2>
            <p className="text-sm text-slate-600">
              Sende Prompts an den Google AI Studio Proxy und erhalte Styling-Tipps.
            </p>
            <div className="mt-4 space-y-3">
              <ChatInput onSend={handleSendChat} />
              <div className="space-y-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-indigo-50 text-indigo-900" : "bg-slate-100 text-slate-800"}`}
                  >
                    <strong className="mr-2 uppercase text-[10px] tracking-wide text-slate-500">
                      {msg.role}
                    </strong>
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <HistoryList history={history} />
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-base font-semibold text-slate-900">DSGVO Hinweis</h3>
            <p className="mt-2">
              Uploads werden temporär verarbeitet und in MinIO/S3 gespeichert. Ergebnisse
              erscheinen in deiner persönlichen History in Firestore.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        placeholder="Frag Gemini nach Styling-Ideen…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={() => {
          onSend(value);
          setValue("");
        }}
        disabled={!value}
      >
        Senden
      </button>
    </div>
  );
}
