# Rückblick Video Web App

Erstellt ein nostalgisches Slideshow-Video direkt im Browser. Die Flask-App
nutzt das bestehende Skript `create_rueckblick_video.py`, um aus einer Audiodatei
und mindestens fünf Bildern ein fertig vertontes Video zu rendern.

## Voraussetzungen
- Python 3.10+
- Abhängigkeiten installieren:
  ```bash
  pip install -r requirements.txt
  ```
- System-Tools: ``ffmpeg`` und ``ImageMagick`` (``convert``) müssen installiert
  und im ``PATH`` verfügbar sein, damit MoviePy Audio/Video und Text rendern
  kann.
- Für die Schriftausgabe benötigt MoviePy/ImageMagick eine passende Schriftart
  (Standard: **Arial-Bold**). Stelle sicher, dass sie auf deinem System
  verfügbar ist oder passe den `FONT`-Wert in `create_rueckblick_video.py` an.
- Stelle sicher, dass sich eine Audiodatei (Standard: `extracted_audio.mp3`)
  und mindestens fünf Bilder im Ordner `clips/` befinden.

## Starten
```bash
python app.py
```

Rufe anschließend `http://localhost:5000` im Browser auf, passe Pfade und
Bildunterschriften an und starte den Render-Vorgang. Das Ergebnis wird unter dem
angegebenen Dateinamen gespeichert (Standard: `rueckblick_fertig.mp4`).

Hinweis: Das Audio muss mindestens so lang sein wie die Gesamtdauer der Bilder
und Intro/Outro. Ist es kürzer, bricht die App mit einer verständlichen
Fehlermeldung ab. Bei längerem Audio wird die Outro-Sequenz automatisch
verlängert, damit Bild und Ton synchron bleiben.
