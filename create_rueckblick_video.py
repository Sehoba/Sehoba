"""Create a nostalgic slideshow video using MoviePy.

The script expects an ``extracted_audio.mp3`` file and a ``clips`` folder
containing at least five images (``.jpg`` or ``.png``). It produces a
video called ``rueckblick_fertig.mp4`` with captions and a subtle film
grain effect.
"""
from __future__ import annotations

import os
import random
import shutil
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
    if not os.path.isdir(folder):
        msg = f"Ordner '{folder}' nicht gefunden."
        raise FileNotFoundError(msg)

    return sorted(
        os.path.join(folder, filename)
        for filename in os.listdir(folder)
        if filename.lower().endswith((".jpg", ".png"))
    )


def _require_binaries() -> None:
    """Ensure ImageMagick/ffmpeg are available before rendering.

    MoviePy's ``TextClip`` depends on ImageMagick (``convert``), while the final
    render requires ``ffmpeg``. A friendly error is raised if either binary is
    missing from ``PATH``.
    """

    missing = [binary for binary in ("convert", "ffmpeg") if not shutil.which(binary)]
    if missing:
        human_list = ", ".join(missing)
        msg = (
            "Bitte installiere die folgenden Programme und stelle sicher, dass sie "
            f"im PATH liegen: {human_list}."
        )
        raise EnvironmentError(msg)


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


def create_outro_clip(duration: float = 4.0) -> CompositeVideoClip:
    fade_duration = min(1.0, duration / 2)
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
        .set_duration(duration)
        .set_position("center")
    )
    outro_bg = ColorClip(size=RESOLUTION, color=(25, 20, 15), duration=duration)
    return (
        CompositeVideoClip([outro_bg, outro_text])
        .fx(fadein, fade_duration)
        .fx(fadeout, fade_duration)
    )


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


def create_slideshow(
    audio_path: str = AUDIO_FILE,
    clip_folder: str = CLIP_FOLDER,
    output_path: str = OUTPUT_FILE,
    texts: Iterable[str] | None = None,
) -> str:
    """Generate the finished slideshow video.

    Parameters
    ----------
    audio_path:
        Path to the narration or soundtrack file.
    clip_folder:
        Folder containing the image files.
    output_path:
        Desired output path for the rendered video.
    texts:
        A list of captions to overlay on the images. Falls back to ``TEXTS`` if
        omitted or empty.
    """

    _require_binaries()

    if not os.path.isfile(audio_path):
        msg = f"Audiodatei '{audio_path}' nicht gefunden."
        raise FileNotFoundError(msg)

    audio = AudioFileClip(audio_path)

    media_files = load_media_files(clip_folder)
    if len(media_files) < 5:
        msg = f"Mindestens 5 Bilder im Ordner '{clip_folder}' erforderlich."
        raise FileNotFoundError(msg)

    captions = list(texts) if texts else TEXTS
    intro_clip = create_intro_clip()
    base_outro = create_outro_clip()

    media_clips = []
    for index, path in enumerate(media_files):
        text = captions[index % len(captions)]
        media_clips.append(create_media_clip(path, text))

    visual_duration = intro_clip.duration + len(media_clips) * DURATION_PER_IMAGE + base_outro.duration
    if audio.duration + 0.01 < visual_duration:
        msg = (
            "Dein Audio ist kürzer als das Video ("
            f"{audio.duration:.1f}s vs. {visual_duration:.1f}s). Kürze die Bilddauer, "
            "verwende weniger Bilder oder nutze ein längeres Audio."
        )
        raise ValueError(msg)

    extra_tail = max(0.0, audio.duration - visual_duration)
    outro_clip = create_outro_clip(duration=base_outro.duration + extra_tail)

    clips = [intro_clip, *media_clips, outro_clip]

    final = concatenate_videoclips(clips, method="compose")
    final = final.set_audio(audio).set_duration(audio.duration)

    final.write_videofile(
        output_path,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        threads=4,
    )

    return output_path


def main() -> None:
    output_path = create_slideshow()
    print(f"✅ Fertig! Dein Video wurde gespeichert als: {output_path}")


if __name__ == "__main__":
    main()
