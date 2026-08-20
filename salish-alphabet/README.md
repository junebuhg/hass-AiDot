# Séliš-Ql̓ispé Sounds

A small web app for learning the sounds of the Séliš-Ql̓ispé (Montana Salish /
Salish-Pend d'Oreille) alphabet. Tap a letter and watch a female speaker and a
male speaker each make the sound, with the lips, tongue, and jaw clearly visible.

It is plain HTML, CSS, and JavaScript — no build step, no frameworks, no
dependencies, and no network calls once it is loaded.

## Running it

```
cd salish-alphabet
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Opening `index.html` directly from the file system will not work: browsers block
reading `data/alphabet.json` over `file://`. The app says so if that happens.

## Publishing it

`.github/workflows/pages.yml` publishes this folder to GitHub Pages on every
push to `main` that touches it. It validates `data/alphabet.json` first, so a
typo in the data file cannot take the live site down, and it turns the Pages
site on by itself the first time it runs.

To go live: merge to `main`, then **Actions → Publish Salish alphabet app**,
where the run reports the published URL. The app is served at the site root —
`https://<user>.github.io/<repo>/`.

If you would rather not use Actions, **Settings → Pages → Deploy from a branch**
with the `/ (root)` folder also works; the app is then at
`https://<user>.github.io/<repo>/salish-alphabet/`.

### Size limits worth knowing before the videos arrive

GitHub Pages allows **100 MB per file** and about **1 GB per site**, with a soft
100 GB/month bandwidth limit. Eighty-eight clips at 720p should fit comfortably,
but if the recordings come back large, compress them before committing — and if
the folder ever approaches the limit, move the videos to a media host and put
full URLs in the data file instead. Git also keeps every version of a binary
file forever, so re-committing recut videos repeatedly will bloat the repository;
prefer to get a clip right before committing it.

## Adding the videos

Put the clips in `videos/` named `<letter id>-female.mp4` and
`<letter id>-male.mp4`. That is the whole job — the app picks them up by
filename. `videos/README.md` has the full list of expected filenames plus
recording guidance (framing, length, lighting).

Letters with no clip yet show a "Not recorded yet" card naming the file the app
looked for, so the app is usable from the first recording onward.

To see what is still outstanding:

```
python3 tools/check_media.py
```

## Correcting the alphabet

**Everything the app displays lives in `data/alphabet.json`.** Letters, their
order, the group headings, the IPA values, and the articulation descriptions are
all data — you do not need to touch the code to change them.

Each entry looks like this:

```json
{
  "id": "q-ej",
  "letter": "q̓",
  "ipa": "qʼ",
  "category": "stops",
  "level": null,
  "order": null,
  "glottalized": true,
  "howTo": "Make the deep q closure, close the throat below it, squeeze, and release with a sharp pop.",
  "watchFor": "The whole throat lifts before the release.",
  "example": { "salish": "", "english": "" }
}
```

- `id` — ASCII slug used for the video filenames. Changing it means renaming the
  video files to match, so pick these once and leave them alone.
- `category` — must match one of the `categories` ids at the top of the file.
- `level` / `order` — where the letter falls in the teaching sequence. See below.
- `glottalized` — draws the marker bar under the tile.
- `example` — left empty on purpose (see below). Fill in `salish` and `english`
  and the word appears on the letter's page.

### Teaching order

By default the grid is arranged by sound type, which is how a linguist thinks
about an alphabet. A curriculum introduces letters in a different order — the
order the lessons teach them in.

Set `level` and `order` on the letters, and describe the levels at the top of the
data file:

```json
"levels": [
  { "id": 1, "name": "Level 1", "description": "Sounds introduced in the first unit." }
]
```

A **Teaching order** toggle then appears next to the group filters, arranging the
grid by level instead, and the previous/next arrows on a letter page follow the
lesson sequence rather than the alphabet. Letters you have not sequenced yet
gather in a "Not yet sequenced" group at the end instead of vanishing.

The toggle stays hidden while no letter has a `level` or `order`, so the app is
uncluttered until the sequence is actually filled in.

### Crediting the source

Fill in `source` at the top of the data file and the attribution shows in the
page footer:

```json
"source": {
  "name": "ILFTS",
  "url": "https://ilfts.org/",
  "note": "Used with permission."
}
```

### Before this is used with learners

The letter list in `data/alphabet.json` is a **placeholder**, assembled from
published descriptions of the Montana Salish sound system. It is meant to be
replaced by the Séliš-Ql̓ispé alphabet as taught in the ILFTS curriculum. Until
that swap happens, the linguist should confirm, at minimum:

- [ ] Which letters belong in the alphabet, and whether any here do not
- [ ] The teaching order the letters should appear in
- [ ] The orthographic form of each letter (which diacritics, which spellings)
- [ ] The grouping and the group names
- [ ] Every `howTo` and `watchFor` description
- [ ] Example words for each letter — these were deliberately left blank rather
      than guessed, since wrong vocabulary in a language-learning app does real
      harm

The banner in the page footer states that this is unverified. It is driven by
`reviewStatus` in the data file — **delete that field once the review is done**
and the banner disappears.

## Fonts

The orthography uses combining diacritics (`q̓`, `x̌ʷ`, `ʕ̓ʷ`) that many system
fonts render badly — marks land off-centre or get clipped. The CSS asks for
[Charis SIL](https://software.sil.org/charis/) and other SIL fonts first and
falls back to whatever the device has. Installing Charis SIL on classroom
machines makes the letters noticeably cleaner.

To make the rendering identical on every device with no install step, vendor the
font: download Charis SIL (SIL Open Font License, so redistribution is fine),
put the `.woff2` files in `salish-alphabet/fonts/`, and uncomment the
`@font-face` block at the top of `styles.css`.

## What the app does

- Letter grid, grouped by sound type or by curriculum level, with search and
  group filters
- A page per letter: large glyph, IPA, how-to-make-it description, what to watch
  for, and both speakers' clips side by side
- Playback at normal, 1/2, and 1/4 speed, applied to both clips at once, plus
  loop and a "play both again" button
- Keyboard navigation: `←` / `→` between letters, `Esc` back to the grid
- Shareable links — every letter has its own URL (`#/letter/q-ej`), so a teacher
  can link one sound directly
- Works on phones, tablets, and desktops; light and dark mode

## Layout

```
salish-alphabet/
├── index.html
├── styles.css
├── app.js
├── data/alphabet.json      ← all content lives here
├── videos/                 ← clips go here; README lists every filename
└── tools/check_media.py    ← which clips are recorded, which are missing
```

## A note on ownership

The recordings are the speakers' and the community's. Before publishing this
anywhere public, make sure the speakers have agreed to that use, and check
whether the Séliš-Ql̓ispé Culture Committee has requirements about how the
language and these recordings are shared.
