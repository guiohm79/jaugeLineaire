# Linear Gauge Card pour Home Assistant

Une carte personnalisée moderne et interactive pour afficher vos entités sous forme de jauges linéaires. Profitez d'un design "Glassmorphism" premium, d'animations fluides et d'une grande flexibilité d'affichage.

## ✨ Fonctionnalités
- 🎨 **Design Glassmorphism** : Look moderne avec effets de flou (backdrop-filter) et de translucidité.
- 👆 **Actions Interactives** : Support complet des `tap_action` (toggle, navigation, call-service, URL).
- 🖼️ **Icônes** : Support des icônes Material Design.
- 🎯 **Cibles** : Affichage d'un marqueur de cible (valeur fixe ou entité).
- 🚨 **Alertes Visuelles** : Animation de pulsation pour les états critiques.
- 📈 **Min/Max 24h** : Visualisation de la plage des valeurs sur les dernières 24h.
- ↕️ **Layout Flexible** : Choisissez entre un affichage horizontal (liste) ou vertical (colonnes).
- 🌈 **Dégradés Intelligents** : Les dégradés s'adaptent automatiquement à l'orientation des jauges.

## 🚀 Installation

1. Copiez le fichier `dist/linear-gauge-card.mjs` dans le dossier `www` de votre configuration Home Assistant (ex: `config/www/linear-gauge-card.js`).
2. Ajoutez la ressource dans votre tableau de bord Lovelace :
   - URL: `/local/linear-gauge-card.js`
   - Type: `Module JavaScript`

## ⚙️ Configuration

Type: `custom:linear-gauge-card`

| Option | Type | Description |
|---|---|---|
| `title` | string | Titre de la carte |
| `entities` | list | Liste des entités à afficher (obligatoire) |
| `layout` | string | `horizontal` (défaut) ou `vertical` |
| `min` | number | Valeur minimum globale (défaut: 0) |
| `max` | number | Valeur maximum globale (défaut: 100) |
| `show_min_max` | boolean | Afficher les marqueurs min/max des dernières 24h (défaut: false) |
| `colors` | list | Liste de couleurs pour un dégradé global |
| `severity` | list | Configuration de sévérité globale |
| `tap_action` | object | Action par défaut au clic (ex: toggle) |

### Configuration d'Entité

Chaque entité de la liste peut être configurée individuellement :

| Option | Type | Description |
|---|---|---|
| `entity` | string | ID de l'entité (ex: `sensor.cpu_load`) |
| `name` | string | Nom personnalisé affiché |
| `icon` | string | Icône (ex: `mdi:thermometer`) |
| `target` | number/string | Valeur cible ou ID d'entité cible |
| `min` / `max` | number | Limites spécifiques à cette entité |
| `color` | string | Couleur fixe pour cette jauge |
| `severity` | list | Paliers de couleurs spécifiques |
| `pulse` | object | Configuration d'alerte pulsation (voir ci-dessous) |
| `tap_action` | object | Action spécifique au clic |

### Configuration Pulse
Permet de déclencher une animation si une valeur dépasse un seuil.
```yaml
pulse:
  value: 80 # Valeur seuil
  condition: above # 'above' (>=) ou 'below' (<=)
```
La pulsation peut aussi être activée via la `severity` avec `pulse: true`.

### Actions (Tap Action)
Configuration standard Home Assistant :
```yaml
tap_action:
  action: toggle # ou more-info, call-service, navigate, url
  # pour navigate:
  navigation_path: /lovelace/0
  # pour call-service:
  service: light.turn_on
  data:
    brightness: 255
```

## 📝 Exemples

### Exemple Complet
```yaml
type: custom:linear-gauge-card
title: Serveur
show_min_max: true
entities:
  - entity: sensor.cpu_load
    name: CPU
    icon: mdi:cpu-64-bit
    target: 80 # Marqueur à 80%
    severity:
      - from: 0
        color: "#4caf50"
      - from: 80
        color: "#f44336"
        pulse: true # Active l'animation de pulsation
  - entity: sensor.temperature
    icon: mdi:thermometer
    target: sensor.target_temp # Marqueur dynamique
    tap_action:
      action: more-info
```

### Mode Vertical (Colonnes)
```yaml
type: custom:linear-gauge-card
title: Ressources
layout: vertical
entities:
  - entity: sensor.cpu_load
    name: CPU
  - entity: sensor.memory_usage
    name: RAM
  - entity: sensor.disk_use_percent
    name: Disque
```

