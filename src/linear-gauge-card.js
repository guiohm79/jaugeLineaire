import { LitElement, html, css } from 'lit';

class LinearGaugeCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _history: { state: true },
    };
  }

  constructor() {
    super();
    this._history = {};
    this._historyFetched = new Set();
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You must define "entities"');
    }
    this._config = config;
  }

  updated(changedProps) {
    if (changedProps.has('hass') && this.hass && this._config?.show_min_max) {
      this._fetchHistoryIfNeeded();
    }
  }

  async _fetchHistoryIfNeeded() {
    if (!this.hass || !this._config.entities) return;

    const entities = this._config.entities.map(e => (typeof e === 'string' ? e : e.entity));
    const now = new Date();

    // Simple fetch logic: fetch if not already fetched for this session
    if (this._fetching) return;

    const toFetch = entities.filter(id => !this._historyFetched.has(id));
    if (toFetch.length === 0) return;

    this._fetching = true;
    try {
      const endTime = now.toISOString();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

      const ids = toFetch.join(',');
      const history = await this.hass.callApi(
        'GET',
        `history/period/${startTime}?end_time=${endTime}&filter_entity_id=${ids}&minimal_response`
      );

      const newHistory = { ...this._history };

      if (Array.isArray(history)) {
        history.forEach(entityHistory => {
          if (entityHistory && entityHistory.length > 0) {
            const entityId = entityHistory[0].entity_id;
            let min = parseFloat(entityHistory[0].state);
            let max = min;

            entityHistory.forEach(state => {
              const val = parseFloat(state.state);
              if (!isNaN(val)) {
                if (val < min) min = val;
                if (val > max) max = val;
              }
            });

            if (!isNaN(min) && !isNaN(max)) {
              newHistory[entityId] = { min, max };
              this._historyFetched.add(entityId);
            }
          }
        });
      }

      this._history = newHistory;
    } catch (e) {
      console.error("Error fetching history for linear-gauge-card:", e);
    } finally {
      this._fetching = false;
    }
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
      
      .card-header {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 24px;
        color: var(--ha-card-header-color, var(--primary-text-color));
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      /* Layout Container */
      .entities-wrapper {
        display: flex;
        gap: 20px;
      }
      
      /* Horizontal Layout (Default) */
      .entities-wrapper.horizontal {
        flex-direction: column;
      }

      /* Vertical Layout */
      .entities-wrapper.vertical {
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-end;
        flex-wrap: wrap;
      }

      .gauge-container {
        position: relative;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px;
        border-radius: 12px;
        animation: fadeIn 0.5s ease-out backwards;
      }

      .gauge-container.pulsing {
        animation: pulse-red 2s infinite;
      }

      @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
      }
      
      /* Horizontal Gauge Container adjustments */
      .entities-wrapper.horizontal .gauge-container {
        display: block;
      }
      
      /* Vertical Gauge Container adjustments */
      .entities-wrapper.vertical .gauge-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        min-width: 60px;
      }

      .gauge-container:hover {
        transform: scale(1.02);
        background: rgba(255, 255, 255, 0.05);
      }

      /* Staggered animation */
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
        font-size: 14px;
        line-height: normal;
      }
      
      /* Horizontal Layout Entity Row */
      .entities-wrapper.horizontal .entity-row {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        width: 100%;
      }
      
      /* Vertical Layout Entity Row: Stacked text above bar */
      .entities-wrapper.vertical .entity-row {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        gap: 4px;
        text-align: center;
      }

      .entity-info-group {
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 65%;
      }

      .entity-icon {
        color: var(--paper-item-icon-color);
        --mdc-icon-size: 20px;
      }

      .entity-name {
        font-weight: 500;
        color: var(--primary-text-color);
        opacity: 0.9;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .entities-wrapper.horizontal .entity-name {
        margin-right: 8px;
      }
      
      .entities-wrapper.vertical .entity-info-group {
        max-width: 100%;
      }

      .entities-wrapper.vertical .entity-name {
        max-width: 100%;
        font-size: 0.9em;
      }
      
      .entity-state {
        font-weight: 700;
        color: var(--primary-text-color);
        font-feature-settings: "tnum";
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(4px);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.85em;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .bar-bg {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
      }

      /* Horizontal Bar Dimensions */
      .entities-wrapper.horizontal .bar-bg {
        width: 100%;
        height: 12px;
      }

      /* Vertical Bar Dimensions */
      .entities-wrapper.vertical .bar-bg {
        width: 16px; 
        height: 120px; 
        display: flex;
        align-items: flex-end; 
      }

      .bar-fill {
        border-radius: 6px;
        transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        position: relative;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        overflow: hidden; 
      }

      .target-marker {
        position: absolute;
        background-color: var(--primary-text-color);
        opacity: 0.8;
        pointer-events: none;
        z-index: 2;
        box-shadow: 0 0 2px rgba(0,0,0,0.5);
      }
      .entities-wrapper.horizontal .target-marker {
        width: 2px;
        height: 100%;
        top: 0;
      }
      .entities-wrapper.vertical .target-marker {
        height: 2px;
        width: 100%;
        left: 0;
      }

      .min-max-range {
        position: absolute;
        background: rgba(255, 255, 255, 0.15);
        pointer-events: none;
        z-index: 1;
      }
      .entities-wrapper.horizontal .min-max-range {
        height: 100%;
        top: 0;
      }
      .entities-wrapper.vertical .min-max-range {
        width: 100%;
        left: 0;
      }

      /* Horizontal Fill */
      .entities-wrapper.horizontal .bar-fill {
        height: 100%;
        min-width: 8px;
      }

      /* Vertical Fill */
      .entities-wrapper.vertical .bar-fill {
        width: 100%;
        min-height: 8px;
      }
      
      .bar-fill::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
      }

      .entities-wrapper.horizontal .bar-fill::before {
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
        transform: skewX(-20deg) translateX(-150%);
        animation: shimmer-horizontal 3s infinite linear;
      }

      .entities-wrapper.vertical .bar-fill::before {
        background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
        transform: translateY(150%);
        animation: shimmer-vertical 3s infinite linear;
      }

      @keyframes shimmer-horizontal {
        0% { transform: skewX(-20deg) translateX(-150%); }
        50% { transform: skewX(-20deg) translateX(150%); }
        100% { transform: skewX(-20deg) translateX(150%); }
      }

      @keyframes shimmer-vertical {
        0% { transform: translateY(150%); }
        50% { transform: translateY(-150%); }
        100% { transform: translateY(-150%); }
      }
      /* LED Effect Styles */
      .bar-bg.effect-led {
        border-radius: 0;
        background-color: rgba(0, 0, 0, 0.3);
      }
      
      .bar-fill.effect-led {
        border-radius: 0;
        mask-image: linear-gradient(to right, black 2px, transparent 2px, transparent 3px, black 3px);
        mask-size: 3px 100%;
        -webkit-mask-image: linear-gradient(to right, black 2px, transparent 2px, transparent 3px, black 3px);
        -webkit-mask-size: 3px 100%;
      }

      .entities-wrapper.vertical .bar-fill.effect-led {
        mask-image: linear-gradient(to bottom, black 2px, transparent 2px, transparent 3px, black 3px);
        mask-size: 100% 3px;
        -webkit-mask-image: linear-gradient(to bottom, black 2px, transparent 2px, transparent 3px, black 3px);
        -webkit-mask-size: 100% 3px;
      }
    `;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const title = this._config.title;
    const layout = this._config.layout || 'horizontal';

    return html`
      <ha-card>
        ${title ? html`<div class="card-header">${title}</div>` : ''}
        <div class="entities-wrapper ${layout}">
          ${this._config.entities.map(ent => this.renderEntity(ent, layout))}
        </div>
      </ha-card>
    `;
  }

  renderEntity(entityConf, layout) {
    const conf = typeof entityConf === 'string' ? { entity: entityConf } : entityConf;
    const entityId = conf.entity;
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return html`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${entityId}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    }

    const name = conf.name || stateObj.attributes.friendly_name || entityId;
    const value = parseFloat(stateObj.state);
    const unit = conf.unit || stateObj.attributes.unit_of_measurement || '';
    const icon = conf.icon || stateObj.attributes.icon;

    const min = conf.min ?? this._config.min ?? 0;
    const max = conf.max ?? this._config.max ?? 100;

    // Effect Logic
    const effect = conf.effect || this._config.effect || 'default';
    const effectClass = effect === 'led' ? 'effect-led' : '';

    let percent = 0;
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, max));
      percent = ((clampedValue - min) / (max - min)) * 100;
    }

    const color = this._computeColor(value, conf, layout);

    // Pulse Logic
    let isPulsing = false;

    // 1. Explicit Pulse Configuration
    const pulseConf = conf.pulse || this._config.pulse;
    if (pulseConf && typeof pulseConf === 'object') {
      const threshold = parseFloat(pulseConf.value);
      const condition = pulseConf.condition || 'above';

      if (!isNaN(threshold)) {
        if (condition === 'above' && value >= threshold) isPulsing = true;
        else if (condition === 'below' && value <= threshold) isPulsing = true;
      }
    }

    // 2. Severity-based Pulse (Fallback/Additive)
    if (!isPulsing) {
      const severityMatch = this._getSeverityMatch(value, conf.severity || this._config.severity);
      if (severityMatch && severityMatch.pulse) {
        isPulsing = true;
      }
    }

    let barStyle = '';
    if (layout === 'vertical') {
      barStyle = `height: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
    } else {
      barStyle = `width: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
    }

    let targetMarker = html``;
    if (conf.target !== undefined) {
      let targetVal = conf.target;
      if (typeof targetVal === 'string' && isNaN(parseFloat(targetVal))) {
        const targetState = this.hass.states[targetVal];
        if (targetState) {
          targetVal = parseFloat(targetState.state);
        }
      }

      targetVal = parseFloat(targetVal);
      if (!isNaN(targetVal)) {
        const clampedTarget = Math.max(min, Math.min(targetVal, max));
        const targetPercent = ((clampedTarget - min) / (max - min)) * 100;
        const style = layout === 'vertical'
          ? `bottom: ${targetPercent}%`
          : `left: ${targetPercent}%`;
        targetMarker = html`<div class="target-marker" style="${style}"></div>`;
      }
    }

    let minMaxMarker = html``;
    if (this._config.show_min_max && this._history[entityId]) {
      const hMin = this._history[entityId].min;
      const hMax = this._history[entityId].max;

      if (hMin !== undefined && hMax !== undefined) {
        const clampedMin = Math.max(min, Math.min(hMin, max));
        const clampedMax = Math.max(min, Math.min(hMax, max));

        const minPct = ((clampedMin - min) / (max - min)) * 100;
        const maxPct = ((clampedMax - min) / (max - min)) * 100;
        const rangeSize = maxPct - minPct;

        let style = '';
        if (layout === 'vertical') {
          style = `bottom: ${minPct}%; height: ${rangeSize}%;`;
        } else {
          style = `left: ${minPct}%; width: ${rangeSize}%;`;
        }
        minMaxMarker = html`<div class="min-max-range" style="${style}"></div>`;
      }
    }

    return html`
      <div class="gauge-container ${isPulsing ? 'pulsing' : ''}" 
           @click=${(e) => this._handleAction(e, conf, entityId)}>
        <div class="entity-row">
          <div class="entity-info-group">
            ${icon ? html`<ha-icon class="entity-icon" .icon="${icon}"></ha-icon>` : ''}
            <span class="entity-name" title="${name}">${name}</span>
          </div>
          <span class="entity-state">${isNaN(value) ? stateObj.state : `${value} ${unit}`}</span>
        </div>
        <div class="bar-bg ${effectClass}">
          ${minMaxMarker}
          <div class="bar-fill ${effectClass}" style="${barStyle}"></div>
          ${targetMarker}
        </div>
      </div>
    `;
  }

  _handleAction(e, conf, entityId) {
    e.stopPropagation();

    const config = conf.tap_action || this._config.tap_action || { action: 'more-info' };
    const action = config.action;

    if (action === 'more-info') {
      const event = new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    } else if (action === 'toggle') {
      this.hass.callService('homeassistant', 'toggle', { entity_id: entityId });
    } else if (action === 'navigate' && config.navigation_path) {
      history.pushState(null, '', config.navigation_path);
      const event = new Event('location-changed', { bubbles: true, composed: true });
      window.dispatchEvent(event);
    } else if (action === 'url' && config.url_path) {
      window.open(config.url_path);
    } else if (action === 'call-service' && config.service) {
      const [domain, service] = config.service.split('.');
      const serviceData = { entity_id: entityId, ...config.data };
      this.hass.callService(domain, service, serviceData);
    }
  }

  _computeColor(value, entityConf, layout) {
    if (isNaN(value)) return 'var(--primary-color, #44739e)';

    const makeGradient = (colors) => {
      const direction = (layout === 'vertical') ? '0deg' : '90deg';
      return `linear-gradient(${direction}, ${colors.join(', ')})`;
    };

    if (entityConf.color) return entityConf.color;
    if (entityConf.severity) return this._computeSeverity(value, entityConf.severity);
    if (this._config.severity) return this._computeSeverity(value, this._config.severity);
    if (Array.isArray(this._config.colors) && this._config.colors.length > 0) {
      return makeGradient(this._config.colors);
    }

    return this._config.color || 'var(--primary-color, #03a9f4)';
  }

  _getSeverityMatch(value, severity) {
    if (!Array.isArray(severity)) return null;
    const sorted = [...severity].sort((a, b) => b.from - a.from);
    return sorted.find(item => value >= item.from);
  }

  _computeSeverity(value, severity) {
    const match = this._getSeverityMatch(value, severity);
    return match ? match.color : 'var(--primary-color)';
  }
}

customElements.define('linear-gauge-card', LinearGaugeCard);
