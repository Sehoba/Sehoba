# VTON App

Dieses Repository enthält einen Beispielaufbau für ein Virtual-Try-On-System mit Stable Diffusion und ControlNet. Unter `vton-app/` findest du einen Express-Backend-Server, eine React-Frontend-App (Vite + Tailwind), Firebase-Client-Helfer und MinIO-Skripte für die Medienablage.

## Struktur
- `backend/`: Express-Server mit Try-On-Endpunkt, ControlNet-Aufrufen, MinIO-Uploads und Firestore-Protokollierung.
- `frontend/`: React-Oberfläche mit Uploads, Kategorie- und Stil-Auswahl, History-Feed und Chatbox.
- `firebase/`: Client-SDK-Setup für Auth und Firestore.
- `storage/`: MinIO-Client und Bucket-Setup.

## Schnelleinstieg

1. `.env` im Ordner `backend/` mit diesen Werten anlegen:
   ```bash
   PORT=3001
   SD_URL=http://127.0.0.1:7860
   POSE_URL=http://127.0.0.1:5000/openpose
   GARMENT_URL=http://127.0.0.1:5001/clothflow
   GEMINI_API_KEY=dein-google-ai-api-key
   GEMINI_MODEL=gemini-1.5-flash
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MINIO_BUCKET=vton-media
   FIREBASE_SERVICE_ACCOUNT=Base64-encodete serviceAccount.json
   ```

2. Abhängigkeiten installieren und starten:
   ```bash
   cd vton-app/backend && npm install && npm run dev
   cd ../frontend && npm install && npm run dev
   ```

3. Frontend-Variablen (`frontend/.env`) setzen:
   ```bash
   VITE_API_BASE=http://localhost:3001/api
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. APK bauen (optional): Im Ordner `vton-app/frontend` liegt eine `APK_BUILD.md`, die erklärt, wie du den Vite-Build mit Capacitor verpackst und in Android Studio ein Debug- oder Release-APK erzeugst.

Das Backend stellt `/api/tryon` (Stable Diffusion + ControlNet) und `/api/chat` (Gemini Proxy inkl. Firestore-Logging) bereit. Uploads werden in MinIO/S3 gespeichert und History/Chat in Firestore protokolliert.
