# Linear Gauge Card pour Home Assistant

Une carte personnalisée pour afficher des entités sous forme de jauges linéaires avec des dégradés et une gestion avancée des couleurs.

## Installation

1. Copiez le fichier `dist/linear-gauge-card.js` dans le dossier `www` de votre configuration Home Assistant (ex: `config/www/linear-gauge-card.js`).
2. Ajoutez la ressource dans votre tableau de bord Lovelace :
   - URL: `/local/linear-gauge-card.js`
   - Type: `Module JavaScript`

## Configuration

Type: `custom:linear-gauge-card`

| Option | Type | Description |
|---|---|---|
| `title` | string | Titre de la carte |
| `entities` | list | Liste des entités à afficher (voir ci-dessous) |
| `min` | number | Valeur minimum globale (défaut: 0) |
| `max` | number | Valeur maximum globale (défaut: 100) |
| `colors` | list | Liste de couleurs pour un dégradé global (ex: `["green", "yellow", "red"]`) |
| `severity` | list | Configuration de sévérité globale |

### Configuration d'Entité

```yaml
type: custom:linear-gauge-card
title: Serveur
entities:
  - entity: sensor.cpu_load
    name: CPU
    max: 100
    color:red
  - entity: sensor.memory_usage
    name: RAM
    severity:
      - from: 0
        color: green
      - from: 50
        color: orange
      - from: 85
        color: red
  - sensor.disk_usage
```
