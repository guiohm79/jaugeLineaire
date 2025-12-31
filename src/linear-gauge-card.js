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
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: var(--primary-text-color);
        padding: 16px;
        border-radius: var(--ha-card-border-radius, 16px);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      ha-card:hover {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
      }
      
      /* Better scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .card-header {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 24px;
        color: var(--ha-card-header-color, var(--primary-text-color));
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .entities-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .gauge-container {
        position: relative;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px;
        border-radius: 12px;
        animation: fadeIn 0.5s ease-out backwards;
      }

      .gauge-container:hover {
        transform: scale(1.02);
        background: rgba(255, 255, 255, 0.05);
      }

      /* Staggered animation for list items */
      .gauge-container:nth-child(1) { animation-delay: 0.1s; }
      .gauge-container:nth-child(2) { animation-delay: 0.15s; }
      .gauge-container:nth-child(3) { animation-delay: 0.2s; }
      .gauge-container:nth-child(4) { animation-delay: 0.25s; }
      .gauge-container:nth-child(5) { animation-delay: 0.3s; }
      .gauge-container:nth-child(n+6) { animation-delay: 0.35s; }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .entity-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: normal;
      }
      
      .entity-name {
        font-weight: 500;
        color: var(--primary-text-color);
        opacity: 0.9;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 8px;
        max-width: 65%;
      }
      
      .entity-state {
        font-weight: 700;
        color: var(--primary-text-color);
        font-feature-settings: "tnum";
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(4px);
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 0.85em;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .bar-bg {
        width: 100%;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
      }

      .bar-fill {
        height: 100%;
        border-radius: 6px;
        transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.4s ease;
        position: relative;
        min-width: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      
      /* Glowing effect */
      .bar-fill::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
        transform: skewX(-20deg) translateX(-150%);
        animation: shimmer 3s infinite linear;
      }

      @keyframes shimmer {
        0% { transform: skewX(-20deg) translateX(-150%); }
        50% { transform: skewX(-20deg) translateX(150%); }
        100% { transform: skewX(-20deg) translateX(150%); }
      }
      
      /* Glass reflection on top half */
      .bar-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
        border-radius: 6px 6px 0 0;
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

    const min = conf.min ?? this._config.min ?? 0;
    const max = conf.max ?? this._config.max ?? 100;

    let percent = 0;
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, max));
      percent = ((clampedValue - min) / (max - min)) * 100;
    }

    const color = this._computeColor(value, conf);

    return html`
      <div class="gauge-container" @click=${() => this._handleEntityClick(entityId)}>
        <div class="entity-row">
          <span class="entity-name" title="${name}">${name}</span>
          <span class="entity-state">${isNaN(value) ? stateObj.state : `${value} ${unit}`}</span>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" style="width: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color};"></div>
        </div>
      </div>
    `;
  }

  _handleEntityClick(entityId) {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _computeColor(value, entityConf) {
    if (isNaN(value)) return 'var(--primary-color, #44739e)';

    if (entityConf.color) return entityConf.color;
    if (entityConf.severity) return this._computeSeverity(value, entityConf.severity);
    if (this._config.severity) return this._computeSeverity(value, this._config.severity);
    
    if (Array.isArray(this._config.colors) && this._config.colors.length > 0) {
      return `linear-gradient(90deg, ${this._config.colors.join(', ')})`;
    }

    return this._config.color || 'var(--primary-color, #03a9f4)';
  }

  _computeSeverity(value, severity) {
    if (!Array.isArray(severity)) return 'var(--primary-color)';
    const sorted = [...severity].sort((a, b) => b.from - a.from);
    const match = sorted.find(item => value >= item.from);
    return match ? match.color : 'var(--primary-color)';
  }
}

customElements.define('linear-gauge-card', LinearGaugeCard);
