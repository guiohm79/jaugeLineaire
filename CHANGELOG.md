# Changelog

All notable changes to the Linear Gauge Card are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## v1.2.0 — 2026-06-18

A big visual update: six gauge styles, a dynamic target marker, a more visible
pulse, and an editor that works on every Home Assistant frontend.

### ✨ Added
- **Gauge styles** (`gauge_style`, global or per entity) — choose how each gauge is drawn:
  - `bar` (default) — classic filled bar
  - `gradient_track` — full colour scale shown faintly behind a crisp fill
  - `segments` — LED/segment style, count set with **`segment_count`** (3–120)
  - `ticks` — instrument-style bar with numbered graduations; count set with **`tick_count`** (min 2)
  - `cursor` — thin gradient track with a slider cursor; shape set with **`cursor_shape`** (`circle`, `line`, `arrow`, `diamond`, `bar`)
  - `sparkline` — 24 h trend line (uses history)
- **`target_entity`** (per entity) — a **dynamic target marker** driven by an entity's state, taking priority over the fixed numeric `target`.
- **`show_value_in_bar`** is now supported by the `ticks` style (value shown above the fill).
- Pulse animation now **blinks the active fill** so it's clearly visible on every gauge style (not just a faint halo).
- Console version banner (`LINEAR-GAUGE-CARD <version>`) to help diagnose caching.

### 🔧 Changed
- **`target_entity` now places the marker** instead of redirecting the tap action. Tap actions always target the gauge's own entity.
- `effect: led` is kept working and is treated as `gauge_style: segments`.
- `gradient_track` background made more visible so it's clearly distinct from `bar`.
- Editor number/text fields rewritten as native inputs (see Fixed).
- Editor gained: "Target Entity (marker)" picker with a clear button, plus **Gauge Style**, **LED count**, **Tick count** and **Cursor shape** fields.

### 🐛 Fixed
- **`cursor` style now works in vertical layout** (previously broken — horizontal-only positioning).
- **Invisible editor fields**: on some HA frontends `ha-textfield` isn't registered, which made Min/Max/Target/Precision/Icon/LED count/Tick count/pulse Threshold render invisibly. These fields are now native inputs and always show.

### ⚠️ Breaking
- `tap_action.target_entity` (redirecting the tap action to another entity) has been **removed**. The action now always targets the gauge's own entity. To place a marker on a gauge, use the entity-level **`target_entity`** instead.

---

## v1.1.3 and earlier

See the [GitHub releases](https://github.com/guiohm79/jaugeLineaire/releases).
