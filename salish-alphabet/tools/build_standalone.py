#!/usr/bin/env python3
"""Build a single-file version of the app.

The CSS, the JavaScript, and the alphabet data all get inlined into one HTML
file. That file opens straight from the filesystem — no local server, no
network — which makes it easy to hand to a teacher on a USB stick or as an
email attachment.

Video clips are NOT inlined; they stay far too large for that. Keep the
`videos/` folder next to the HTML file and the clips load from there.

Usage:
    python3 tools/build_standalone.py                 # writes standalone.html
    python3 tools/build_standalone.py --out FILE
    python3 tools/build_standalone.py --body-only     # fragment, no <html> wrapper
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def build(body_only=False):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    data = json.loads((ROOT / "data" / "alphabet.json").read_text(encoding="utf-8"))

    # `</script>` inside the JSON payload would close the tag early
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")

    html = html.replace(
        '<link rel="stylesheet" href="styles.css">',
        f"<style>\n{css}\n</style>",
    )
    html = html.replace(
        '<script src="app.js"></script>',
        f"<script>\nwindow.__ALPHABET__ = {payload};\n</script>\n<script>\n{js}\n</script>",
    )

    if body_only:
        # Artifacts supply their own <!doctype>/<head>/<body>, so hand back just
        # the page content with the <title> kept at the front.
        title = re.search(r"<title>(.*?)</title>", html, re.S)
        head_extras = "\n".join(
            m.group(0) for m in re.finditer(r"<style>.*?</style>", html, re.S)
        )
        body = re.search(r"<body>(.*?)</body>", html, re.S)
        if not body:
            sys.exit("could not find <body> in index.html")
        parts = []
        if title:
            parts.append(f"<title>{title.group(1)}</title>")
        parts.append(head_extras)
        parts.append(body.group(1).strip())
        return "\n".join(parts)

    return html


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default=None, help="output path")
    parser.add_argument("--body-only", action="store_true",
                        help="emit a fragment with no <html>/<body> wrapper")
    args = parser.parse_args()

    out = Path(args.out) if args.out else ROOT / "standalone.html"
    text = build(body_only=args.body_only)
    out.write_text(text, encoding="utf-8")
    print(f"wrote {out} ({len(text.encode('utf-8')) / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
