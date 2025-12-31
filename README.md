# Linear Gauge Card pour Home Assistant

Une carte personnalisée moderne et interactive pour afficher vos entités sous forme de jauges linéaires. Profitez d'un design "Glassmorphism" premium, d'animations fluides et d'une grande flexibilité d'affichage.

## ✨ Fonctionnalités
- 🎨 **Design Glassmorphism** : Look moderne avec effets de flou (backdrop-filter) et de translucidité.
- 👆 **Historique Interactif** : Cliquez sur une jauge pour ouvrir la fenêtre "Plus d'infos" (historique, paramètres) de Home Assistant.
- ↕️ **Layout Flexible** : Choisissez entre un affichage horizontal (liste) ou vertical (colonnes).
- 🌈 **Dégradés Intelligents** : Les dégradés s'adaptent automatiquement à l'orientation des jauges.
- ✨ **Animations** : Effet de brillance (shimmer) sur les jauges et animation d'entrée en cascade.

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
| `colors` | list | Liste de couleurs pour un dégradé (ex: `["#00ff00", "#ff0000"]`) |
| `severity` | list | Configuration de sévérité globale |

### Configuration d'Entité (Optionnel)

Chaque entité de la liste peut être configurée individuellement :

| Option | Type | Description |
|---|---|---|
| `entity` | string | ID de l'entité (ex: `sensor.cpu_load`) |
| `name` | string | Nom personnalisé affiché |
| `min` / `max` | number | Limites spécifiques à cette entité |
| `color` | string | Couleur fixe pour cette jauge |
| `severity` | list | Paliers de couleurs spécifiques |

## 📝 Exemples

### Mode Horizontal (Classique)
```yaml
type: custom:linear-gauge-card
title: Système
colors:
  - "#4caf50"
  - "#ffeb3b"
  - "#f44336"
entities:
  - entity: sensor.cpu_load
    name: Processeur
  - entity: sensor.memory_usage
    name: RAM
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

### Utilisation de la sévérité
```yaml
type: custom:linear-gauge-card
entities:
  - entity: sensor.temperature
    severity:
      - from: 0
        color: "#2196f3"
      - from: 20
        color: "#4caf50"
      - from: 30
        color: "#f44336"
```

