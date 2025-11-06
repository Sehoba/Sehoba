"""Create a nostalgic slideshow video using MoviePy.

The script expects an ``extracted_audio.mp3`` file and a ``clips`` folder
containing at least five images (``.jpg`` or ``.png``). It produces a
video called ``rueckblick_fertig.mp4`` with captions and a subtle film
grain effect.
"""
from __future__ import annotations

import os
import random
from typing import Iterable

import numpy as np
from moviepy.editor import (
    AudioFileClip,
    ColorClip,
    CompositeVideoClip,
    ImageClip,
    TextClip,
    VideoClip,
    concatenate_videoclips,
)
from moviepy.video.fx.all import colorx, fadein, fadeout


AUDIO_FILE = "extracted_audio.mp3"
CLIP_FOLDER = "clips"
OUTPUT_FILE = "rueckblick_fertig.mp4"
RESOLUTION = (1080, 1920)
DURATION_PER_IMAGE = 6
FONT = "Arial-Bold"

TEXTS = [
    "Manchmal schau’ ich zurück… und frage mich, wann alles so schnell geworden ist.",
    "Damals dachte ich, es bleibt für immer…",
    "Doch alles ändert sich… schneller, als man denkt.",
    "Heute weiß ich, was wirklich zählt.",
    "Nicht alles war leicht. Aber alles war echt.",
    "Danke an alle, die Teil dieser Geschichte waren.",
]


def add_filmgrain(clip: VideoClip, intensity: float = 0.03) -> VideoClip:
    """Add a subtle animated film grain effect to ``clip``.

    Parameters
    ----------
    clip:
        The clip to modify.
    intensity:
        A value describing the standard deviation of the generated noise.
    """

    def apply_grain(get_frame, t):
        frame = get_frame(t)
        noise = np.random.normal(0, 255 * intensity, frame.shape).astype(np.int16)
        grainy = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        return grainy

    return clip.fl(apply_grain)


def load_media_files(folder: str) -> Iterable[str]:
    """Return a sorted list of image paths from ``folder``."""
    return sorted(
        os.path.join(folder, filename)
        for filename in os.listdir(folder)
        if filename.lower().endswith((".jpg", ".png"))
    )


def create_intro_clip() -> CompositeVideoClip:
    intro_text = (
        TextClip(
            "Rückblick – Eine Geschichte über Veränderung",
            fontsize=72,
            color="white",
            font=FONT,
            method="caption",
            size=(900, None),
            align="center",
        )
        .set_duration(3)
        .set_position("center")
    )
    intro_bg = ColorClip(size=RESOLUTION, color=(20, 15, 10), duration=3)
    return CompositeVideoClip([intro_bg, intro_text]).fx(fadein, 1).fx(fadeout, 1)


def create_outro_clip() -> CompositeVideoClip:
    outro_text = (
        TextClip(
            "Danke… an alle, die Teil dieser Geschichte waren. Denn ohne euch…"
            " wäre sie nie dieselbe gewesen.",
            fontsize=64,
            color="white",
            font=FONT,
            method="caption",
            size=(900, None),
            align="center",
        )
        .set_duration(4)
        .set_position("center")
    )
    outro_bg = ColorClip(size=RESOLUTION, color=(25, 20, 15), duration=4)
    return CompositeVideoClip([outro_bg, outro_text]).fx(fadein, 1).fx(fadeout, 1)


def create_media_clip(path: str, text: str) -> CompositeVideoClip:
    image = ImageClip(path, duration=DURATION_PER_IMAGE).resize(RESOLUTION)
    image = colorx(image, 0.9)  # slight sepia look

    zoom = random.uniform(1.04, 1.10)
    move_x = random.randint(-25, 25)
    move_y = random.randint(-20, 20)

    animated = image.resize(lambda t: zoom ** (t / DURATION_PER_IMAGE))
    animated = animated.set_position(
        lambda t: (
            move_x * (t / DURATION_PER_IMAGE),
            move_y * (t / DURATION_PER_IMAGE),
        )
    )

    text_clip = (
        TextClip(
            text,
            fontsize=60,
            color="white",
            font=FONT,
            method="caption",
            size=(900, None),
            align="center",
        )
        .set_position(("center", 1600))
        .set_duration(DURATION_PER_IMAGE)
    )

    composition = CompositeVideoClip([animated, text_clip]).fx(fadein, 1).fx(fadeout, 1)
    return add_filmgrain(composition, intensity=0.04)


def main() -> None:
    audio = AudioFileClip(AUDIO_FILE)

    media_files = load_media_files(CLIP_FOLDER)
    if len(media_files) < 5:
        msg = f"Mindestens 5 Bilder im Ordner '{CLIP_FOLDER}' erforderlich."
        raise FileNotFoundError(msg)

    clips = [create_intro_clip()]

    for index, path in enumerate(media_files):
        text = TEXTS[index % len(TEXTS)]
        clips.append(create_media_clip(path, text))

    clips.append(create_outro_clip())

    final = concatenate_videoclips(clips, method="compose")
    final = final.set_audio(audio).set_duration(audio.duration)

    final.write_videofile(
        OUTPUT_FILE,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        threads=4,
    )

    print(f"✅ Fertig! Dein Video wurde gespeichert als: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
