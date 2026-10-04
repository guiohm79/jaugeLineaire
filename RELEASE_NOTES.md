# Linear Gauge Card v1.4.0

Eight new gauge styles (14 in total), `center_zero` on every style, and a round of
polish from testing feedback. This release rolls up v1.3.0 and v1.4.0, so it is
the full set of changes since v1.2.0.

## ✨ New gauge styles

Set `gauge_style` globally or per entity:

| Style | Description |
|---|---|
| `glass` | Glossy capsule with a highlight on the fill |
| `stripes` | Animated diagonal hazard stripes over the fill |
| `dots` | Row of dots lighting up one by one, the leading dot fading in progressively |
| `equalizer` | VU-meter bars of increasing height |
| `battery` | Thick battery shell with a terminal cap, filled cell by cell; the leading cell drains proportionally so the reading stays precise |
| `thermometer` | Rounded, outlined tube with graduation marks inside and an end-of-scale label |
| `wave` | Liquid tank with two animated wave layers of different amplitude and speed |
| `needle` | Full colour scale with a needle pointer and end-of-scale labels |

## ✨ Other additions

- **`center_zero` works with every style.** The fill grows out of the zero point
  instead of the start of the track: `segments`, `dots`, `equalizer` and the
  `battery` cells light up outwards from zero, the `wave` rises above or hangs
  below it, and `gradient_track` keeps its colours aligned with the scale. A faint
  line marks where zero sits.
- **New sizing options** for the taller styles: `wave_height`, `equalizer_height`
  and `battery_size`.
- **`battery_cells`** (default 4, range 2–12) sets the number of cells in the
  battery shell.
- **`tick_count`** now also sets the number of graduation marks on the
  `thermometer` tube.
- **`segment_count`** now also drives `dots` and `equalizer`, each with its own
  default when left unset (12 dots, 16 equalizer bars; 20 for `segments`).
- **Visual editor:** new global **Tick count** and **Cursor shape** fields
  (previously per entity only), plus fields for the new options.

## 🔧 Improvements

- `target` / `target_entity` markers and the 24 h min/max range also render on
  `battery`, `thermometer` and `wave`.
- Pulse alerts blink the fill on every new style, and all new animations respect
  `prefers-reduced-motion`.
- In vertical layout every new style has a native rendering, except `equalizer`,
  which falls back to `segments`.
- Gauge style and cursor shape lists are declared once and shared by the card and
  its editor.

## ⬆️ Upgrading

No breaking changes and no configuration changes are required. Existing cards
render exactly as before. After updating, do a hard refresh (Ctrl+F5) or clear the
frontend cache if the console banner doesn't show `1.4.0`.

## Full changelog

See [CHANGELOG.md](CHANGELOG.md) for the detailed history.
