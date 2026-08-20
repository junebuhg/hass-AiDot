#!/usr/bin/env python3
"""Report which pronunciation clips have been recorded and which are still missing.

Usage:
    python3 tools/check_media.py            # summary + list of missing clips
    python3 tools/check_media.py --list     # every expected filename, recorded or not
    python3 tools/check_media.py --csv      # machine-readable, for a tracking sheet
"""

import argparse
import csv
import json
import signal
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEAKERS = ("female", "male")


def load():
    with open(ROOT / "data" / "alphabet.json", encoding="utf-8") as fh:
        return json.load(fh)


def expected(data):
    """Yield (letter, speaker, candidate paths, first existing path or None)."""
    video_dir = data.get("videoDir", "videos")
    extensions = data.get("videoExtensions", ["mp4"])
    for letter in data["letters"]:
        for speaker in SPEAKERS:
            candidates = [
                Path(video_dir) / f"{letter['id']}-{speaker}.{ext}" for ext in extensions
            ]
            found = next((c for c in candidates if (ROOT / c).is_file()), None)
            yield letter, speaker, candidates, found


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="show every expected clip")
    parser.add_argument("--csv", action="store_true", help="output CSV")
    args = parser.parse_args()

    # let `| head` close the pipe without a traceback
    if hasattr(signal, "SIGPIPE"):
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)

    data = load()
    rows = list(expected(data))
    missing = [r for r in rows if r[3] is None]

    if args.csv:
        writer = csv.writer(sys.stdout)
        writer.writerow(["letter", "id", "speaker", "expected_file", "recorded"])
        for letter, speaker, candidates, found in rows:
            writer.writerow(
                [letter["letter"], letter["id"], speaker,
                 str(found or candidates[0]), "yes" if found else "no"]
            )
        return 0

    if args.list:
        for letter, speaker, candidates, found in rows:
            mark = "✓" if found else "·"
            print(f"{mark} {letter['letter']:<4} {str(found or candidates[0])}")
        print()

    recorded = len(rows) - len(missing)
    print(f"{recorded} of {len(rows)} clips recorded "
          f"({len(data['letters'])} letters × {len(SPEAKERS)} speakers).")

    if missing and not args.list:
        print("\nStill needed:")
        for letter, speaker, candidates, _ in missing:
            print(f"  {letter['letter']:<4} {candidates[0]}")

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
