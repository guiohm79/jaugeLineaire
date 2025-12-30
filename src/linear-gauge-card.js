import { LitElement, html, css } from 'lit';

class LinearGaugeCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You must define "entities"');
    }
    this._config = config;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      ha-card {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12));
        color: var(--primary-text-color);
        padding: 16px;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      
      /* Better scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
      }
      
      .card-header {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        color: var(--ha-card-header-color, var(--primary-text-color));
      }
      
      .entities-wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .gauge-container {
        position: relative;
      }

      .entity-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        font-size: 14px;
        line-height: normal;
      }
      
      .entity-name {
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 8px;
        max-width: 60%;
      }
      
      .entity-state {
        font-weight: 600;
        color: var(--primary-text-color);
        font-feature-settings: "tnum"; /* Monospaced numbers */
        background: var(--secondary-background-color, rgba(0,0,0,0.05));
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.9em;
      }

      .bar-bg {
        width: 100%;
        height: 16px; /* Slightly taller for modern look */
        background-color: var(--secondary-background-color, #eff0f1);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        /* Subtle inner shadow */
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); 
      }

      .bar-fill {
        height: 100%;
        border-radius: 8px;
        transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.4s ease;
        position: relative;
        min-width: 8px; /* Always show a tiny bit if > 0 */
      }
      
      /* Glass/Glare effect */
      .bar-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05));
        border-radius: 8px 8px 0 0;
        pointer-events: none;
      }
      
      /* Sparkle/Gloss at the tip */
      .bar-fill::before {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: rgba(255,255,255,0.4);
        box-shadow: 0 0 4px rgba(255,255,255,0.5);
      }
    `;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const title = this._config.title;

    return html`
      <ha-card>
        ${title ? html`<div class="card-header">${title}</div>` : ''}
        <div class="entities-wrapper">
          ${this._config.entities.map(ent => this.renderEntity(ent))}
        </div>
      </ha-card>
    `;
  }

  renderEntity(entityConf) {
    // Normalize config
    const conf = typeof entityConf === 'string' ? { entity: entityConf } : entityConf;
    const entityId = conf.entity;
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return html`
        <div class="gauge-container" style="opacity: 0.5;">
          <div class="entity-row">
            <span class="entity-name">${entityId}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    }

    const name = conf.name || stateObj.attributes.friendly_name || entityId;
    const value = parseFloat(stateObj.state);
    const unit = conf.unit || stateObj.attributes.unit_of_measurement || '';

    // Limits
    const min = conf.min ?? this._config.min ?? 0;
    const max = conf.max ?? this._config.max ?? 100;

    let percent = 0;
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, max));
      percent = ((clampedValue - min) / (max - min)) * 100;
    }

    // Color Computation
    const color = this._computeColor(value, conf);

    return html`
      <div class="gauge-container">
        <div class="entity-row">
          <span class="entity-name" title="${name}">${name}</span>
          <span class="entity-state">${isNaN(value) ? stateObj.state : `${value} ${unit}`}</span>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" style="width: ${percent}%; background: ${color};"></div>
        </div>
      </div>
    `;
  }

  _computeColor(value, entityConf) {
    if (isNaN(value)) return 'var(--primary-color, #44739e)';

    // 1. Entity specific color/list
    if (entityConf.color) return entityConf.color;
    // 2. Entity specific ramp
    if (entityConf.severity) return this._computeSeverity(value, entityConf.severity);

    // 3. Global ramp
    if (this._config.severity) return this._computeSeverity(value, this._config.severity);

    // 4. Global gradient (applied as fixed background to bar? or variable color?)
    // If 'colors' is an array, we typically mean a gradient.
    // However, simply setting background: linear-gradient(...) on the fill makes the fill ITSELF a gradient.
    // which looks cool.
    if (Array.isArray(this._config.colors) && this._config.colors.length > 0) {
      return `linear-gradient(90deg, ${this._config.colors.join(', ')})`;
    }

    // 5. Global single color fallback
    return this._config.color || 'var(--primary-color, #03a9f4)';
  }

  _computeSeverity(value, severity) {
    // Severity expected format: [{ from: 0, color: 'green' }, { from: 50, color: 'red' }]
    // Find the matching range. 
    // Usually standard is: value >= from. Sort by from value descending to find the first match.

    if (!Array.isArray(severity)) return 'var(--primary-color)';

    // Clone and sort descending
    const sorted = [...severity].sort((a, b) => b.from - a.from);

    const match = sorted.find(item => value >= item.from);
    return match ? match.color : 'var(--primary-color)';
  }
}

customElements.define('linear-gauge-card', LinearGaugeCard);
