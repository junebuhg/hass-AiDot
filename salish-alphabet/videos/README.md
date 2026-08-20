# Video clips

Drop the recordings straight into this folder. The app finds them by filename —
nothing else needs to be edited.

## Naming

```
<letter id>-female.mp4
<letter id>-male.mp4
```

The letter ids are plain ASCII on purpose: filenames containing `q̓` or `x̌ʷ` get
mangled when they move between Windows, macOS, and phones. The table below maps
every letter to its id.

`.webm` also works if you prefer it (see `videoExtensions` in `data/alphabet.json`).

## Recording notes

- **Frame tight on the face** — chin to just above the eyebrows. The point of the
  clip is to see the lips, tongue, and jaw, so a head-and-shoulders shot is too wide.
- **Front-on, even light on the face.** Avoid a window behind the speaker.
- **2–4 seconds** per clip: settle, make the sound, hold still briefly at the end.
  The app can loop and play at 1/2 and 1/4 speed, so short clips work best.
- **One sound per clip.** Isolated sound first; example words can come later as a
  separate feature.
- Keep the original full-quality files somewhere safe. Compress copies for this
  folder to roughly 720p — clips over a few MB each make the app slow on phones.

## Checking progress

From the `salish-alphabet` folder:

```
python3 tools/check_media.py          # what is still missing
python3 tools/check_media.py --list   # every clip, recorded or not
python3 tools/check_media.py --csv    # for a tracking spreadsheet
```

## Every clip needed

### Stops & Affricates

| Letter | id | Female clip | Male clip |
| --- | --- | --- | --- |
| p | `p` | `p-female.mp4` | `p-male.mp4` |
| p̓ | `p-ej` | `p-ej-female.mp4` | `p-ej-male.mp4` |
| t | `t` | `t-female.mp4` | `t-male.mp4` |
| t̓ | `t-ej` | `t-ej-female.mp4` | `t-ej-male.mp4` |
| c | `c` | `c-female.mp4` | `c-male.mp4` |
| c̓ | `c-ej` | `c-ej-female.mp4` | `c-ej-male.mp4` |
| č | `ch` | `ch-female.mp4` | `ch-male.mp4` |
| č̓ | `ch-ej` | `ch-ej-female.mp4` | `ch-ej-male.mp4` |
| kʷ | `kw` | `kw-female.mp4` | `kw-male.mp4` |
| k̓ʷ | `kw-ej` | `kw-ej-female.mp4` | `kw-ej-male.mp4` |
| q | `q` | `q-female.mp4` | `q-male.mp4` |
| q̓ | `q-ej` | `q-ej-female.mp4` | `q-ej-male.mp4` |
| qʷ | `qw` | `qw-female.mp4` | `qw-male.mp4` |
| q̓ʷ | `qw-ej` | `qw-ej-female.mp4` | `qw-ej-male.mp4` |
| ʔ | `glottal` | `glottal-female.mp4` | `glottal-male.mp4` |

### Fricatives

| Letter | id | Female clip | Male clip |
| --- | --- | --- | --- |
| s | `s` | `s-female.mp4` | `s-male.mp4` |
| ł | `lh` | `lh-female.mp4` | `lh-male.mp4` |
| š | `sh` | `sh-female.mp4` | `sh-male.mp4` |
| xʷ | `xw` | `xw-female.mp4` | `xw-male.mp4` |
| x̌ | `xh` | `xh-female.mp4` | `xh-male.mp4` |
| x̌ʷ | `xhw` | `xhw-female.mp4` | `xhw-male.mp4` |
| h | `h` | `h-female.mp4` | `h-male.mp4` |

### Resonants

| Letter | id | Female clip | Male clip |
| --- | --- | --- | --- |
| m | `m` | `m-female.mp4` | `m-male.mp4` |
| m̓ | `m-glot` | `m-glot-female.mp4` | `m-glot-male.mp4` |
| n | `n` | `n-female.mp4` | `n-male.mp4` |
| n̓ | `n-glot` | `n-glot-female.mp4` | `n-glot-male.mp4` |
| l | `l` | `l-female.mp4` | `l-male.mp4` |
| l̓ | `l-glot` | `l-glot-female.mp4` | `l-glot-male.mp4` |
| r | `r` | `r-female.mp4` | `r-male.mp4` |
| r̓ | `r-glot` | `r-glot-female.mp4` | `r-glot-male.mp4` |
| w | `w` | `w-female.mp4` | `w-male.mp4` |
| w̓ | `w-glot` | `w-glot-female.mp4` | `w-glot-male.mp4` |
| y | `y` | `y-female.mp4` | `y-male.mp4` |
| y̓ | `y-glot` | `y-glot-female.mp4` | `y-glot-male.mp4` |
| ʕ | `ain` | `ain-female.mp4` | `ain-male.mp4` |
| ʕ̓ | `ain-glot` | `ain-glot-female.mp4` | `ain-glot-male.mp4` |
| ʕʷ | `ainw` | `ainw-female.mp4` | `ainw-male.mp4` |
| ʕ̓ʷ | `ainw-glot` | `ainw-glot-female.mp4` | `ainw-glot-male.mp4` |

### Vowels

| Letter | id | Female clip | Male clip |
| --- | --- | --- | --- |
| a | `a` | `a-female.mp4` | `a-male.mp4` |
| e | `e` | `e-female.mp4` | `e-male.mp4` |
| i | `i` | `i-female.mp4` | `i-male.mp4` |
| o | `o` | `o-female.mp4` | `o-male.mp4` |
| u | `u` | `u-female.mp4` | `u-male.mp4` |
| ə | `schwa` | `schwa-female.mp4` | `schwa-male.mp4` |
