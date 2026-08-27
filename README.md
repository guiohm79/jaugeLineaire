# Linear Gauge Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/release/guiohm79/jaugeLineaire.svg)](https://github.com/guiohm79/jaugeLineaire/releases)
[![License](https://img.shields.io/github/license/guiohm79/jaugeLineaire.svg)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/guiohm79)
![downloads-total][github-downloads]
![stars][github-stars]
![downloads-latest][github-latest-downloads]

[github-downloads]: https://img.shields.io/github/downloads/guiohm79/jaugeLineaire/total.svg?style=flat
[github-latest-downloads]: https://img.shields.io/github/downloads/guiohm79/jaugeLineaire/latest/total.svg?style=flat
[github-stars]: https://img.shields.io/github/stars/guiohm79/jaugeLineaire.svg?style=flat


A modern and interactive custom card to display your entities as linear gauges. Enjoy a premium design, smooth animations, and high display flexibility.


### Exemples d'utilisation
<p align="center">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/image5.png" width="350" alt="center 0">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/image6.png" width="350" alt="center 0">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple1.png" width="350" alt="Exemple 1">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple6.png" width="350" alt="Exemple 6">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple2.png" width="350" alt="Exemple 2">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple5.png" width="350" alt="Exemple 5">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple3.png" width="350" alt="Exemple 3">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple4.png" width="350" alt="Exemple 4">
  
</p>

## Features
- **Visual Editor**: Fully configurable via the Home Assistant UI.
- **Theme Integration**: Follows your Home Assistant theme or custom background color with transparency support.
- **Interactive Actions**: Full support for `tap_action` on each entity (toggle, navigation, call-service, URL).
- **Icons**: Material Design icons support.
- **Targets**: Display a target marker, either a fixed value (`target`) or driven by an entity's state (`target_entity`).
- **Visual Alerts**: Pulse animation that blinks the bar for critical states.
- **24h Min/Max**: Visualization of the value range over the last 24 hours.
- **Flexible Layout**: Choose between horizontal (list) or vertical (columns) display.
- **Smart Gradients**: Define a global gradient or specific colors per entity.
- **LED Effect**: Segmented and rectangular display mode for a modern "pixel" style.
- **14 Gauge Styles**: Choose how each gauge is drawn — `bar`, `gradient_track`, `glass`, `stripes`, `segments` (LED), `dots`, `equalizer`, `battery`, `thermometer`, `wave`, `ticks`, `needle`, `cursor` or `sparkline` (24h trend). Set globally or per entity.
- **Compact Mode**: Minimal display with just icon and bar to save space.
- **Value in Bar**: Display the value directly on the progress bar (hides the value next to the name to avoid duplication).
- **Shimmer Effect**: Animated shine effect on bars (can be disabled).

## Installation

### Via HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=guiohm79&repository=jaugeLineaire&category=plugin)

1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click on the menu (⋮) in the top right
4. Select "Custom repositories"
5. Add the URL: `https://github.com/guiohm79/jaugeLineaire`
6. Select category "Lovelace"
7. Click "Install"
8. Restart Home Assistant

### Manual Installation

1. Download the `linear-gauge-card.js` file
2. Copy it to `config/www/linear-gauge-card.js`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **+ Add Resource**
   - URL: `/local/linear-gauge-card.js`
   - Type: **JavaScript Module**
4. Restart Home Assistant


## Configuration

The card can be configured entirely via the Visual Editor.

Type: `custom:linear-gauge-card`

### Global Options

| Option | Type | Description |
|---|---|---|
| `title` | string | Card title |
| `entities` | list | List of entities to display (required) |
| `layout` | string | `horizontal` (default) or `vertical` |
| `min` | number | Global minimum value (default: 0) |
| `max` | number | Global maximum value (default: 100) |
| `show_min_max` | boolean | Show 24h min/max markers (default: false) |
| `colors` | list | List of colors for a global gradient |
| `color` | string | Global fixed color (overrides gradient) |
| `color_negative` | string | Global fixed color for negative values when `center_zero` is active |
| `severity` | list | Global severity configuration |
| `effect` | string | `default` or `led` for a rectangular segmented effect (legacy — prefer `gauge_style`) |
| `gauge_style` | string | How the gauge is drawn: `bar` (default), `gradient_track`, `glass`, `stripes`, `segments`, `dots`, `equalizer`, `battery`, `thermometer`, `wave`, `ticks`, `needle`, `cursor`, `sparkline` |
| `segment_count` | number | Number of elements for the `segments`, `dots` and `equalizer` styles (range 3–120; defaults: 20 segments, 12 dots, 16 equalizer bars) |
| `tick_count` | number | Number of labelled graduations for the `ticks` style, and of graduation marks on the `thermometer` tube (default: 5, min 2) |
| `cursor_shape` | string | Thumb shape for the `cursor` style: `circle` (default), `line`, `arrow`, `diamond`, `bar` |
| `tap_action` | object | Default action on click (e.g., toggle) |
| `transparent` | boolean | Transparent background (default: false) |
| `card_background` | string | Custom card background color (with alpha support) |
| `compact_mode` | boolean | Compact display mode (default: false) |
| `show_value_in_bar` | boolean | Show value inside the bar, hides value next to name (default: false) |
| `disable_shimmer` | boolean | Disable the shimmer animation effect (default: false) |
| `center_zero` | boolean | Start the bar at the zero point. Negative values extend left/bottom, positive extend right/top (default: false) |
| `bar_thickness` | number | Bar thickness in pixels (default: 12) |
| `vertical_height` | number | Vertical bar height in pixels (default: 120) |
| `vertical_width` | number | Vertical bar width in pixels (default: 16) |
| `wave_height` | number | Height of the `wave` style in horizontal layout, in pixels (default: 40) |
| `equalizer_height` | number | Height of the `equalizer` style, in pixels (default: 34) |
| `battery_size` | number | Height of the `battery` body in horizontal layout, in pixels (default: 22) |
| `battery_cells` | number | Number of cells drawn inside the `battery` shell (default: 4, range 2–12) |

### Entity Configuration

Each entity in the list can be configured individually:

| Option | Type | Description |
|---|---|---|
| `entity` | string | Entity ID (e.g., `sensor.cpu_load`) |
| `name` | string | Custom displayed name |
| `icon` | string | Icon (e.g., `mdi:thermometer`) |
| `target` | number | Fixed target marker value |
| `target_entity` | string | Entity whose state drives the target marker (takes priority over `target`) |
| `min` / `max` | number | Specific limits for this entity |
| `color` | string | Fixed color for this gauge (overrides global) |
| `color_negative` | string | Fixed color for negative values when `center_zero` is active |
| `severity` | list | Specific color thresholds |
| `effect` | string | Effect override (`default` or `led`) |
| `gauge_style` | string | Per-entity gauge style override (see global `gauge_style`) |
| `segment_count` | number | Per-entity element count override (segments, dots, equalizer) |
| `tick_count` | number | Number of labelled graduations for the `ticks` style (default 5, min 2) |
| `cursor_shape` | string | Thumb shape for the `cursor` style: `circle` (default), `line`, `arrow`, `diamond`, `bar` |
| `pulse` | object | Pulse alert configuration (see below) |
| `tap_action` | object | Specific action on click |
| `compact_mode` | boolean | Compact mode for this entity |
| `show_value_in_bar` | boolean | Show value in bar for this entity |
| `disable_shimmer` | boolean | Disable shimmer for this entity |
| `center_zero` | boolean | Center zero mode for this entity |

### Severity Configuration

Define color thresholds based on value ranges:

```yaml
severity:
  - from: 0
    color: "#4caf50"    # Green
  - from: 50
    color: "#ffeb3b"    # Yellow
  - from: 80
    color: "#f44336"    # Red
    pulse: true         # Enable pulse animation
```

### Pulse Configuration

Allows triggering an animation if a value exceeds a threshold:

```yaml
pulse:
  value: 80           # Threshold value
  condition: above    # 'above' (>=) or 'below' (<=)
```

Pulse can also be activated via `severity` with `pulse: true`.

### Actions (Tap Action)

Standard Home Assistant configuration:

```yaml
tap_action:
  action: toggle              # or more-info, call-service, navigate, url, none
  # for navigate:
  navigation_path: /lovelace/0
  # for url:
  url_path: https://example.com
  # for call-service:
  service: light.turn_on
  data:
    brightness: 255
```

The action always targets the gauge's own entity.

### Target marker

A marker can be drawn on the gauge, either at a fixed value or driven by an entity:

```yaml
- entity: sensor.temperature
  target: 80                        # Fixed marker at 80
  target_entity: sensor.target_temp # Dynamic marker (takes priority over target)
```

## Examples

### Complete Example

```yaml
type: custom:linear-gauge-card
title: Server
show_min_max: true
colors:
  - "#4caf50"
  - "#ffeb3b"
  - "#f44336"
entities:
  - entity: sensor.cpu_load
    name: CPU
    icon: mdi:cpu-64-bit
    target: 80                    # Marker at 80%
    severity:
      - from: 90
        color: "#d32f2f"
        pulse: true               # Activates pulse animation
  - entity: sensor.temperature
    icon: mdi:thermometer
    target_entity: sensor.target_temp  # Dynamic marker
    tap_action:
      action: toggle
```

### LED Style

```yaml
type: custom:linear-gauge-card
title: Battery
gauge_style: segments
segment_count: 24        # number of LEDs (3–120)
entities:
  - entity: sensor.battery_level
    name: Level
```

> `effect: led` still works and is treated as `gauge_style: segments`.

### Gauge Styles

Set `gauge_style` globally or per entity. Available values:

| Value | Description | Vertical layout |
|---|---|---|
| `bar` | Classic filled bar (default) | ✅ |
| `gradient_track` | Full colour scale shown faintly in the track, crisp fill on top | ✅ |
| `glass` | Glossy capsule with a highlight on the fill — a softer, 3D take on `bar` | ✅ |
| `stripes` | Animated diagonal hazard stripes scrolling over the fill | ✅ |
| `segments` | LED/segment style — number of segments set with `segment_count` | ✅ |
| `dots` | Row of dots that light up one by one; the leading dot fades in progressively | ✅ |
| `equalizer` | VU-meter bars of increasing height | ↩︎ falls back to `segments` |
| `battery` | Battery shell with a terminal cap, filled cell by cell (`battery_cells`); the leading cell drains proportionally | ✅ (cap on top) |
| `thermometer` | Rounded, outlined tube with graduation marks inside (`tick_count`) and an end-of-scale label | ✅ |
| `wave` | Liquid tank with two animated wave layers | ✅ |
| `ticks` | Instrument-style bar with numbered graduations and a labelled target. Set the number of graduations with `tick_count`; enable `show_value_in_bar` to show the current value above the fill | ↩︎ falls back to `bar` |
| `needle` | Full colour scale with a needle pointer and end-of-scale labels | ✅ (needle on the left) |
| `cursor` | Thin gradient track with a slider-like cursor — great for dense dashboards. Pick the thumb shape with `cursor_shape` (`circle`, `line`, `arrow`, `diamond`, `bar`) | ✅ |
| `sparkline` | 24h trend line (requires history; falls back to a bar until data loads) | ↩︎ falls back to `bar` |

All styles honour `color`, `colors`, `severity` and `pulse`. The repeated-element
styles (`segments`, `dots`, `equalizer`, and the cells of `battery`) colour each
element from the gradient palette unless a fixed `color`/`severity` is configured.
`bar`, `gradient_track`, `glass`, `stripes`, `battery`, `thermometer`, `wave`,
`ticks` and `needle` also draw the `target` / `target_entity` marker.

**`center_zero` is supported by every style**: the fill grows out of the zero
point instead of the start of the track (segments, dots, equalizer and battery
cells light up outwards from zero; the wave rises or hangs from it), and a faint
line marks where zero sits.

```yaml
type: custom:linear-gauge-card
title: Server
gauge_style: gradient_track
entities:
  - entity: sensor.cpu_load
    name: CPU
    target: 85
  - entity: sensor.temperature
    name: Temp
    gauge_style: sparkline   # per-entity override
```

Mixing several styles in one card:

```yaml
type: custom:linear-gauge-card
title: Home
entities:
  - entity: sensor.phone_battery
    name: Phone
    gauge_style: battery
  - entity: sensor.living_room_temperature
    name: Living room
    gauge_style: thermometer
    min: 10
    max: 30
  - entity: sensor.water_tank
    name: Tank
    gauge_style: wave
  - entity: sensor.grid_power
    name: Grid
    gauge_style: wave
    min: -3000
    max: 3000
    center_zero: true      # fill grows out of zero, both ways
  - entity: sensor.noise_level
    name: Noise
    gauge_style: equalizer
    segment_count: 20
  - entity: sensor.humidity
    name: Humidity
    gauge_style: needle
```

### Vertical Mode (Columns)

```yaml
type: custom:linear-gauge-card
title: Resources
layout: vertical
entities:
  - entity: sensor.cpu_load
    name: CPU
  - entity: sensor.memory_usage
    name: RAM
  - entity: sensor.disk_use_percent
    name: Disk
```

### Compact Mode with Value in Bar

```yaml
type: custom:linear-gauge-card
title: Battery Levels
compact_mode: true
show_value_in_bar: true
colors:
  - "#f44336"
  - "#ffeb3b"
  - "#4caf50"
entities:
  - entity: sensor.battery_1
    icon: mdi:battery
  - entity: sensor.battery_2
    icon: mdi:battery
  - entity: sensor.battery_3
    icon: mdi:battery
    compact_mode: false           # Override: show full for this entity
```

### Disable Shimmer Effect

```yaml
type: custom:linear-gauge-card
title: Clean Look
disable_shimmer: true           # Disable shimmer globally
entities:
  - entity: sensor.cpu_load
    name: CPU
    icon: mdi:cpu-64-bit
  - entity: sensor.memory_usage
    name: RAM
    icon: mdi:memory
    disable_shimmer: false      # Re-enable for this entity
```

### Custom Background Color

```yaml
type: custom:linear-gauge-card
title: Temperature
card_background: "rgba(255, 0, 0, 0.2)"   # Semi-transparent red
entities:
  - entity: sensor.living_room_temp
    icon: mdi:thermometer
```

### Mixed Layout with Per-Entity Configuration

```yaml
type: custom:linear-gauge-card
title: Energy Monitor
color: "#03a9f4"                # Global fixed blue color
entities:
  - entity: sensor.solar_power
    name: Solar
    icon: mdi:solar-power
    max: 5000
    color: "#ffeb3b"            # Yellow for solar
  - entity: sensor.house_power
    name: House
    icon: mdi:home-lightning-bolt
    max: 5000
  - entity: sensor.grid_power
    name: Grid
    icon: mdi:transmission-tower
    max: 5000
    severity:
      - from: 0
        color: "#4caf50"        # Green when consuming
      - from: 1000
        color: "#f44336"        # Red when high consumption
```

## Priority Order for Colors

When multiple color options are defined, the following priority order is used:

1. **Entity severity** (highest priority)
2. **Entity fixed color** (`color`)
3. **Global severity** (`severity`)
4. **Global fixed color** (`color`)
5. **Global gradient** (`colors`)
6. **Default theme color** (fallback)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history. Latest: **v1.2.0** — six gauge styles, dynamic target marker, blinking pulse, and editor fixes.

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.

If you find this card useful, consider [buying me a coffee](https://buymeacoffee.com/guiohm79)! ☕
