"""Kleine Flask-Webapp zum Erstellen des Rückblick-Videos."""
from __future__ import annotations

import os
from typing import List

from flask import Flask, flash, redirect, render_template, request, url_for

from create_rueckblick_video import (
    AUDIO_FILE,
    CLIP_FOLDER,
    OUTPUT_FILE,
    TEXTS,
    create_slideshow,
)

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key")


def _parse_texts(raw_text: str) -> List[str]:
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    return lines if lines else TEXTS


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        audio_file = request.form.get("audio_file", AUDIO_FILE).strip()
        clip_folder = request.form.get("clip_folder", CLIP_FOLDER).strip()
        output_file = request.form.get("output_file", OUTPUT_FILE).strip() or OUTPUT_FILE
        texts_raw = request.form.get("texts", "\n".join(TEXTS))

        try:
            captions = _parse_texts(texts_raw or "")
            result_path = create_slideshow(
                audio_path=audio_file,
                clip_folder=clip_folder,
                output_path=output_file,
                texts=captions,
            )
            flash(f"✅ Fertig! Dein Video wurde gespeichert als: {result_path}", "success")
            return redirect(url_for("index"))
        except Exception as exc:  # noqa: BLE001
            flash(str(exc), "danger")

    return render_template(
        "index.html",
        defaults={
            "audio_file": AUDIO_FILE,
            "clip_folder": CLIP_FOLDER,
            "output_file": OUTPUT_FILE,
            "texts": "\n".join(TEXTS),
        },
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
