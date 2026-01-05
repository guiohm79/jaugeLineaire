# Linear Gauge Card for Home Assistant

A modern and interactive custom card to display your entities as linear gauges. Enjoy a premium Glassmorphism design, smooth animations, and high display flexibility.

## Features
- **Glassmorphism Design**: Modern look with blur effects (backdrop-filter) and translucency.
- **Interactive Actions**: Full support for `tap_action` (toggle, navigation, call-service, URL).
- **Icons**: Material Design icons support.
- **Targets**: Display a target marker (fixed value or entity).
- **Visual Alerts**: Pulse animation for critical states.
- **24h Min/Max**: Visualization of the value range over the last 24 hours.
- **Flexible Layout**: Choose between horizontal (list) or vertical (columns) display.
- **Smart Gradients**: Gradients automatically adapt to gauge orientation.
- **LED Effect**: Segmented and rectangular display mode for a modern "pixel" style.

## Installation

1. Copy the `dist/linear-gauge-card.mjs` file into the `www` folder of your Home Assistant configuration (e.g., `config/www/linear-gauge-card.js`).
2. Add the resource in your Lovelace dashboard:
   - URL: `/local/linear-gauge-card.js`
   - Type: `JavaScript Module`

## Configuration

Type: `custom:linear-gauge-card`

| Option | Type | Description |
|---|---|---|
| `title` | string | Card title |
| `entities` | list | List of entities to display (required) |
| `layout` | string | `horizontal` (default) or `vertical` |
| `min` | number | Global minimum value (default: 0) |
| `max` | number | Global maximum value (default: 100) |
| `show_min_max` | boolean | Show 24h min/max markers (default: false) |
| `colors` | list | List of colors for a global gradient |
| `severity` | list | Global severity configuration |
| `effect` | string | `default` or `led` for a rectangular segmented effect |
| `tap_action` | object | Default action on click (e.g., toggle) |

### Entity Configuration

Each entity in the list can be configured individually:

| Option | Type | Description |
|---|---|---|
| `entity` | string | Entity ID (e.g., `sensor.cpu_load`) |
| `name` | string | Custom displayed name |
| `icon` | string | Icon (e.g., `mdi:thermometer`) |
| `target` | number/string | Target value or target entity ID |
| `min` / `max` | number | Specific limits for this entity |
| `color` | string | Fixed color for this gauge |
| `severity` | list | Specific color thresholds |
| `effect` | string | Effect override (`default` or `led`) |
| `pulse` | object | Pulse alert configuration (see below) |
| `tap_action` | object | Specific action on click |

### Pulse Configuration
Allows triggering an animation if a value exceeds a threshold.
```yaml
pulse:
  value: 80 # Threshold value
  condition: above # 'above' (>=) or 'below' (<=)
```
Pulse can also be activated via `severity` with `pulse: true`.

### Actions (Tap Action)
Standard Home Assistant configuration:
```yaml
tap_action:
  action: toggle # or more-info, call-service, navigate, url
  # for navigate:
  navigation_path: /lovelace/0
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
entities:
  - entity: sensor.cpu_load
    name: CPU
    icon: mdi:cpu-64-bit
    target: 80 # Marker at 80%
    severity:
      - from: 0
        color: "#4caf50"
      - from: 80
        color: "#f44336"
        pulse: true # Activates pulse animation
  - entity: sensor.temperature
    icon: mdi:thermometer
    target: sensor.target_temp # Dynamic marker
    tap_action:
      action: more-info
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
