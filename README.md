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
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple1.png" width="350" alt="Exemple 1">
  <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple2.png" width="350" alt="Exemple 2">
    <img src="https://raw.githubusercontent.com/guiohm79/jaugeLineaire/main/exemple3.png" width="350" alt="Exemple 3">
</p>

## Features
- **Visual Editor**: Fully configurable via the Home Assistant UI.
- **Theme Integration**: Follows your Home Assistant theme or custom background color with transparency support.
- **Interactive Actions**: Full support for `tap_action` on each entity (toggle, navigation, call-service, URL).
- **Target Entity**: Actions can target a different entity than the one displayed.
- **Icons**: Material Design icons support.
- **Targets**: Display a target marker (fixed value or entity).
- **Visual Alerts**: Pulse animation for critical states.
- **24h Min/Max**: Visualization of the value range over the last 24 hours.
- **Flexible Layout**: Choose between horizontal (list) or vertical (columns) display.
- **Smart Gradients**: Define a global gradient or specific colors per entity.
- **LED Effect**: Segmented and rectangular display mode for a modern "pixel" style.
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
| `severity` | list | Global severity configuration |
| `effect` | string | `default` or `led` for a rectangular segmented effect |
| `tap_action` | object | Default action on click (e.g., toggle) |
| `transparent` | boolean | Transparent background (default: false) |
| `card_background` | string | Custom card background color (with alpha support) |
| `compact_mode` | boolean | Compact display mode (default: false) |
| `show_value_in_bar` | boolean | Show value inside the bar, hides value next to name (default: false) |
| `disable_shimmer` | boolean | Disable the shimmer animation effect (default: false) |
| `bar_thickness` | number | Bar thickness in pixels (default: 12) |
| `vertical_height` | number | Vertical bar height in pixels (default: 120) |
| `vertical_width` | number | Vertical bar width in pixels (default: 16) |

### Entity Configuration

Each entity in the list can be configured individually:

| Option | Type | Description |
|---|---|---|
| `entity` | string | Entity ID (e.g., `sensor.cpu_load`) |
| `name` | string | Custom displayed name |
| `icon` | string | Icon (e.g., `mdi:thermometer`) |
| `target` | number/string | Target value or target entity ID |
| `min` / `max` | number | Specific limits for this entity |
| `color` | string | Fixed color for this gauge (overrides global) |
| `severity` | list | Specific color thresholds |
| `effect` | string | Effect override (`default` or `led`) |
| `pulse` | object | Pulse alert configuration (see below) |
| `tap_action` | object | Specific action on click |
| `compact_mode` | boolean | Compact mode for this entity |
| `show_value_in_bar` | boolean | Show value in bar for this entity |
| `disable_shimmer` | boolean | Disable shimmer for this entity |

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
  target_entity: light.bureau # Optional: Action targets this entity instead
  # for navigate:
  navigation_path: /lovelace/0
  # for url:
  url_path: https://example.com
  # for call-service:
  service: light.turn_on
  data:
    brightness: 255
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
    target: sensor.target_temp    # Dynamic marker
    tap_action:
      action: toggle
      target_entity: switch.fan_cooler
```

### LED Style

```yaml
type: custom:linear-gauge-card
title: Battery
effect: led
entities:
  - entity: sensor.battery_level
    name: Level
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

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.

If you find this card useful, consider [buying me a coffee](https://buymeacoffee.com/guiohm79)! ☕
