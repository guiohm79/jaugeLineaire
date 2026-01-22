import { LitElement, html, css } from 'lit';

const ICON_CLOSE = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
const ICON_CHEVRON_DOWN = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
const ICON_CHEVRON_UP = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
const ICON_PLUS = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

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
      
      .entities-wrapper {
        display: flex;
        gap: 20px;
      }
      
      .entities-wrapper.horizontal {
        flex-direction: column;
      }

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
      
      .entities-wrapper.horizontal .gauge-container {
        display: block;
      }
      
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
      
      .entities-wrapper.horizontal .entity-row {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        width: 100%;
      }
      
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

      .entities-wrapper.horizontal .bar-bg {
        width: 100%;
        height: var(--lgc-bar-thickness, 12px);
      }

      .entities-wrapper.vertical .bar-bg {
        width: 16px; 
        height: var(--lgc-vertical-height, 120px); 
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

      .entities-wrapper.horizontal .bar-fill {
        height: 100%;
        min-width: 8px;
      }

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

    const transparent = this._config.transparent_card_background || this._config.transparent || false;
    const thickness = this._config.bar_thickness || 12;
    const verticalHeight = this._config.vertical_height || 120;

    // We bind CSS variables to the host style
    const cardStyle = `
      --lgc-bar-thickness: ${thickness}px;
      --lgc-vertical-height: ${verticalHeight}px;
      ${transparent ? 'background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;' : ''}
    `;

    return html`
      <ha-card style="${cardStyle}">
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

    const effect = conf.effect || this._config.effect || 'default';
    const effectClass = effect === 'led' ? 'effect-led' : '';

    let percent = 0;
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, max));
      percent = ((clampedValue - min) / (max - min)) * 100;
    }

    const color = this._computeColor(value, conf, layout);

    let isPulsing = false;
    const pulseConf = conf.pulse || this._config.pulse;
    if (pulseConf && typeof pulseConf === 'object') {
      const threshold = parseFloat(pulseConf.value);
      const condition = pulseConf.condition || 'above';

      if (!isNaN(threshold)) {
        if (condition === 'above' && value >= threshold) isPulsing = true;
        else if (condition === 'below' && value <= threshold) isPulsing = true;
      }
    }

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
    if (conf.tap_action && conf.tap_action.action === 'none') {
      return;
    }

    e.stopPropagation();

    const config = conf.tap_action || this._config.tap_action || { action: 'more-info' };
    const action = config.action;

    // Allow action to target a different entity
    const targetEntityId = config.target_entity || entityId;

    if (action === 'more-info') {
      const event = new CustomEvent('hass-more-info', {
        detail: { entityId: targetEntityId },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    } else if (action === 'toggle') {
      this.hass.callService('homeassistant', 'toggle', { entity_id: targetEntityId });
    } else if (action === 'navigate' && config.navigation_path) {
      history.pushState(null, '', config.navigation_path);
      const event = new Event('location-changed', { bubbles: true, composed: true });
      window.dispatchEvent(event);
    } else if (action === 'url' && config.url_path) {
      window.open(config.url_path);
    } else if (action === 'call-service' && config.service) {
      const [domain, service] = config.service.split('.');
      const serviceData = { ...config.data };
      if (!serviceData.entity_id) {
        serviceData.entity_id = targetEntityId;
      }
      this.hass.callService(domain, service, serviceData);
    }
  }

  _computeColor(value, entityConf, layout) {
    if (isNaN(value)) return 'var(--primary-color, #44739e)';

    const makeGradient = (colors) => {
      const direction = (layout === 'vertical') ? '0deg' : '90deg';
      return `linear-gradient(${direction}, ${colors.join(', ')})`;
    };

    // Severity priority
    if (entityConf.severity) {
      const match = this._getSeverityMatch(value, entityConf.severity);
      if (match) return match.color;
    }

    if (entityConf.color) return entityConf.color;
    if (this._config.severity) return this._computeSeverity(value, this._config.severity);
    if (Array.isArray(this._config.colors) && this._config.colors.length > 0) {
      return makeGradient(this._config.colors);
    }

    return this._config.color || 'var(--primary-color, #03a9f4)';
  }

  _getSeverityMatch(value, severity) {
    if (!Array.isArray(severity)) return null;
    const val = parseFloat(value);
    // Ensure accurate number comparison by strictly parsing 'from'
    const sorted = [...severity].sort((a, b) => parseFloat(b.from) - parseFloat(a.from));
    return sorted.find(item => val >= parseFloat(item.from));
  }

  static getConfigElement() {
    return document.createElement('linear-gauge-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'My Gauge',
      layout: 'horizontal',
      min: 0,
      max: 100,
      entities: [{ entity: 'sensor.example' }]
    };
  }

  _computeSeverity(value, severity) {
    const match = this._getSeverityMatch(value, severity);
    return match ? match.color : 'var(--primary-color)';
  }
}

class LinearGaugeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _expandedEntities: { state: true },
    };
  }

  constructor() {
    super();
    this._expandedEntities = new Set();
  }

  setConfig(config) {
    this._config = config;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 8px;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        gap: 8px;
      }
      .entities-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: var(--secondary-background-color, rgba(0,0,0,0.05));
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      }
      .entity-header {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        width: 100%;
      }
      .entity-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1));
        margin-top: 4px;
      }
      ha-textfield, ha-selector {
        width: 100%;
        display: block;
      }
      ha-icon-button {
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      ha-icon-button.delete {
        color: var(--error-color);
      }
      .add-button {
        margin-top: 8px;
      }
      .section-title {
        font-weight: 500;
        margin-bottom: 4px;
        color: var(--primary-text-color);
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.8;
      }
      .severity-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .sub-header {
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 4px;
      }
      .color-bubble {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        border: 2px solid #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        cursor: pointer;
      }
      .colors-list {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .entity-color-toggle {
          font-size: 0.8em;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
      }
    `;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const startSelector = {
      select: {
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' }
        ]
      }
    };

    const effectSelector = {
      select: {
        options: [
          { value: 'default', label: 'Default' },
          { value: 'led', label: 'LED' }
        ]
      }
    };

    // Schema for ha-selector
    const sensorSelector = { entity: { domain: "sensor" } };

    const globalColors = this._config.colors || [];

    return html`
      <div class="card-config">
        
        <ha-textfield
          label="Title"
          .value=${this._config.title || ''}
          .configValue=${'title'}
          @input=${this._valueChanged}
        ></ha-textfield>

        <div class="row">
          <ha-selector
            label="Layout"
            .hass=${this.hass}
            .selector=${startSelector}
            .value=${this._config.layout || 'horizontal'}
            .configValue=${'layout'}
            @value-changed=${this._valueChanged}
          ></ha-selector>

          <ha-selector
            label="Effect"
            .hass=${this.hass}
            .selector=${effectSelector}
            .value=${this._config.effect || 'default'}
            .configValue=${'effect'}
            @value-changed=${this._valueChanged}
          ></ha-selector>
        </div>

        <div class="row">
           <ha-textfield
             label="Min"
             type="number"
             .value=${this._config.min ?? 0}
             .configValue=${'min'}
             @input=${this._valueChanged}
           ></ha-textfield>
           
           <ha-textfield
             label="Max"
             type="number"
             .value=${this._config.max ?? 100}
             .configValue=${'max'}
             @input=${this._valueChanged}
           ></ha-textfield>
        </div>

        <div class="row">
           <ha-textfield
             label="Bar Thickness (px)"
             type="number"
             .value=${this._config.bar_thickness ?? 12}
             .configValue=${'bar_thickness'}
             @input=${this._valueChanged}
           ></ha-textfield>
           
           <ha-textfield
             label="Vertical Height (px)"
             type="number"
             .value=${this._config.vertical_height ?? 120}
             .configValue=${'vertical_height'}
             @input=${this._valueChanged}
           ></ha-textfield>
        </div>
        
        <div class="row">
           <div style="flex: 1;">
               <div class="section-title">Gradient Colors (Global)</div>
               <div class="colors-list">
                    ${globalColors.map((color, idx) => html`
                        <div style="position: relative;">
                             <input type="color" 
                                .value=${color} 
                                @input=${(e) => this._globalColorChanged(e, idx)}
                                style="width: 40px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;"
                             >
                             <ha-icon-button
                                .path=${ICON_CLOSE}
                                style="position: absolute; top: -14px; right: -14px; color: grey; --mdc-icon-button-size: 24px;"
                                @click=${() => this._removeGlobalColor(idx)}
                             ></ha-icon-button>
                        </div>
                    `)}
                    <ha-icon-button
                        .path=${ICON_PLUS}
                        style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 40px; height: 40px;"
                        @click=${this._addGlobalColor}
                    ></ha-icon-button>
               </div>
               ${globalColors.length === 0 ? html`<div style="font-size: 0.8em; opacity: 0.6; margin-top: 4px;">Use "+" to add colors. If empty, default blue is used.</div>` : ''}
           </div>
        </div>

        <div class="row">
          <span>Show Min/Max (History)</span>
          <ha-switch
            .checked=${this._config.show_min_max || false}
            .configValue=${'show_min_max'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Transparent Background</span>
          <ha-switch
            .checked=${this._config.transparent || false}
            .configValue=${'transparent'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="entities-section">
          <h3>Entities</h3>
          <div class="entities-list">
            ${(this._config.entities || []).map((entity, index) => this._renderEntityRow(entity, index, sensorSelector))}
          </div>
          <mwc-button class="add-button" outlined @click=${this._addEntity}>
            Add Entity
          </mwc-button>
        </div>

      </div>
    `;
  }

  _renderEntityRow(entity, index, sensorSelector) {
    const entityId = typeof entity === 'string' ? entity : entity.entity;
    const color = typeof entity === 'object' ? entity.color : undefined;
    const useCustomColor = typeof color === 'string' && color !== '';
    const isExpanded = this._expandedEntities.has(index);
    const entityObj = typeof entity === 'object' ? entity : { entity: entity };

    return html`
      <div class="entity-row">
        <div class="entity-header">
          <div style="flex: 1;">
              <ha-selector
                .hass=${this.hass}
                .selector=${sensorSelector}
                .value=${entityId}
                @value-changed=${(e) => this._entityChanged(e, index, 'entity')}
              ></ha-selector>
          </div>
          
           <ha-icon-button
            .path=${isExpanded ? ICON_CHEVRON_UP : ICON_CHEVRON_DOWN}
            @click=${() => this._toggleExpand(index)}
          ></ha-icon-button>

          <ha-icon-button
            class="delete"
            .path=${ICON_CLOSE}
            @click=${() => this._removeEntity(index)}
          ></ha-icon-button>
        </div>

        ${isExpanded ? this._renderEntityDetails(entityObj, index, color, useCustomColor) : ''}
      </div>
    `;
  }

  _renderEntityDetails(entity, index, color, useCustomColor) {
    const pulse = entity.pulse || {};
    const severity = entity.severity || [];
    const tapAction = entity.tap_action || { action: 'more-info' };

    const actionOptions = [
      { value: 'more-info', label: 'More Info' },
      { value: 'toggle', label: 'Toggle' },
      { value: 'navigate', label: 'Navigate' },
      { value: 'url', label: 'Open URL' },
      { value: 'call-service', label: 'Call Service' },
      { value: 'none', label: 'None' },
    ];

    return html`
        <div class="entity-details">
            <div class="row">
                <ha-textfield
                    label="Name (optional)"
                    .value=${entity.name || ''}
                    @input=${(e) => this._entityChanged(e, index, 'name')}
                ></ha-textfield>
                <ha-textfield
                    label="Target"
                    type="number"
                    .value=${entity.target || ''}
                    @input=${(e) => this._entityChanged(e, index, 'target')}
                ></ha-textfield>
            </div>
            
            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Color (override global)</span>
                    <ha-switch
                      .checked=${useCustomColor}
                      @change=${(e) => this._toggleEntityColor(e, index)}
                    ></ha-switch>
                 </div>
                 ${useCustomColor ? html`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${color || '#03a9f4'}
                            @input=${(e) => this._entityChanged(e, index, 'color')}
                            style="height: 40px; width: 100%; padding: 0; border: none; background: none; cursor: pointer;"
                         >
                    </div>
                 ` : ''}
            </div>

            <div>
                 <div class="section-title">Tap Action</div>
                 <ha-selector
                    .hass=${this.hass}
                    .selector=${{ select: { options: actionOptions } }}
                    .value=${tapAction.action}
                    @value-changed=${(e) => this._tapActionChanged(e, index, 'action')}
                 ></ha-selector>
                 
                 <ha-selector
                    label="Target Entity (Optional)"
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${tapAction.target_entity}
                    @value-changed=${(e) => this._tapActionChanged(e, index, 'target_entity')}
                 ></ha-selector>

                 ${tapAction.action === 'navigate' ? html`
                    <ha-textfield
                        label="Navigation Path"
                        .value=${tapAction.navigation_path || ''}
                        @input=${(e) => this._tapActionChanged(e, index, 'navigation_path')}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ''}

                 ${tapAction.action === 'url' ? html`
                    <ha-textfield
                        label="URL"
                        .value=${tapAction.url_path || ''}
                        @input=${(e) => this._tapActionChanged(e, index, 'url_path')}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ''}
                 
                 ${tapAction.action === 'call-service' ? html`
                    <ha-textfield
                        label="Service (e.g., light.turn_on)"
                        .value=${tapAction.service || ''}
                        @input=${(e) => this._tapActionChanged(e, index, 'service')}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ''}
            </div>

            <div>
                <div class="section-title">Pulse (Animation)</div>
                <div class="row">
                     <ha-textfield
                        label="Threshold"
                        type="number"
                        .value=${pulse.value || ''}
                        @input=${(e) => this._pulseChanged(e, index, 'value')}
                    ></ha-textfield>
                    <ha-selector
                        label="Condition"
                        .hass=${this.hass}
                        .selector=${{ select: { options: [{ value: 'above', label: '> Above' }, { value: 'below', label: '< Below' }] } }}
                        .value=${pulse.condition || 'above'}
                        @value-changed=${(e) => this._pulseChanged(e, index, 'condition')}
                    ></ha-selector>
                </div>
            </div>

            <div>
                <div class="section-title">Severity (Local Gradient)</div>
                ${severity.map((band, bandIndex) => html`
                    <div class="severity-row">
                        <ha-textfield
                             label="From"
                             type="number"
                             .value=${band.from ?? 0}
                             @input=${(e) => this._severityChanged(e, index, bandIndex, 'from')}
                             style="width: 80px;"
                        ></ha-textfield>
                         <input
                            type="color"
                            .value=${band.color || '#00ff00'}
                            @input=${(e) => this._severityChanged(e, index, bandIndex, 'color')}
                            style="flex: 1; height: 40px; border: none; background: none; cursor: pointer;"
                         >
                         <ha-icon-button
                            class="delete"
                            .path=${ICON_CLOSE}
                            @click=${() => this._removeSeverityBand(index, bandIndex)}
                         ></ha-icon-button>
                    </div>
                `)}
                <mwc-button outlined @click=${() => this._addSeverityBand(index)}>
                    <ha-icon .icon="mdi:plus" style="margin-right: 8px;"></ha-icon> Add Band
                </mwc-button>
            </div>

        </div>
      `;
  }

  _valueChanged(e) {
    if (!this._config || !this.hass) return;

    // Support both standard events and ha-selector events
    const target = e.target;
    let value = target.value;
    let configValue = target.configValue;

    if (e.detail && e.detail.value !== undefined) {
      value = e.detail.value;
    }

    // For ha-switch
    if (target.tagName === 'HA-SWITCH') {
      value = target.checked;
    }

    if (!configValue && target.configValue) {
      configValue = target.configValue;
    }

    if (configValue === 'min' || configValue === 'max' || configValue === 'bar_thickness' || configValue === 'vertical_height') {
      value = parseFloat(value);
    }

    if (configValue) {
      this._config = {
        ...this._config,
        [configValue]: value,
      };
      this._fireChangedEvent();
    }
  }

  _globalColorChanged(e, index) {
    const newColors = [...(this._config.colors || [])];
    newColors[index] = e.target.value;
    this._config = { ...this._config, colors: newColors };
    this._fireChangedEvent();
  }

  _addGlobalColor() {
    const newColors = [...(this._config.colors || [])];
    newColors.push('#ffeb3b');
    this._config = { ...this._config, colors: newColors };
    this._fireChangedEvent();
  }

  _removeGlobalColor(index) {
    const newColors = [...(this._config.colors || [])];
    newColors.splice(index, 1);
    this._config = { ...this._config, colors: newColors };
    this._fireChangedEvent();
  }

  _entityChanged(e, index, field) {
    const newEntities = [...(this._config.entities || [])];
    let currentValue = newEntities[index];

    // Normalize to object if string
    if (typeof currentValue === 'string') {
      currentValue = { entity: currentValue };
    } else {
      currentValue = { ...currentValue };
    }

    // Get value depends on event type
    let newValue;
    if (e.detail && e.detail.value !== undefined) {
      newValue = e.detail.value;
    } else {
      newValue = e.target.value;
    }

    if (field === 'target') newValue = parseFloat(newValue);

    currentValue[field] = newValue;

    newEntities[index] = currentValue;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _toggleEntityColor(e, index) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };

    if (e.target.checked) {
      row.color = '#03a9f4';
    } else {
      delete row.color;
    }

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _tapActionChanged(e, index, field) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };

    let tapAction = { ...(row.tap_action || { action: 'more-info' }) };

    let newValue;
    if (e.detail && e.detail.value !== undefined) {
      newValue = e.detail.value;
    } else {
      newValue = e.target.value;
    }

    tapAction[field] = newValue;
    row.tap_action = tapAction;

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _pulseChanged(e, index, field) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };

    let pulse = { ...(row.pulse || {}) };

    let newValue;
    if (e.detail && e.detail.value !== undefined) {
      newValue = e.detail.value;
    } else {
      newValue = e.target.value;
    }

    pulse[field] = field === 'value' ? parseFloat(newValue) : newValue;
    row.pulse = pulse;

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _severityChanged(e, index, bandIndex, field) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };

    let severity = [...(row.severity || [])];
    let band = { ...severity[bandIndex] };

    let newValue = e.target.value;

    band[field] = field === 'from' ? parseFloat(newValue) : newValue;
    severity[bandIndex] = band;
    row.severity = severity;

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _addSeverityBand(index) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };
    let severity = [...(row.severity || [])];

    severity.push({ from: 0, color: '#00ff00' });
    row.severity = severity;

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _removeSeverityBand(index, bandIndex) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };
    let severity = [...(row.severity || [])];

    severity.splice(bandIndex, 1);
    row.severity = severity;

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _addEntity() {
    const newEntities = [...(this._config.entities || [])];
    newEntities.push({ entity: '', color: '' });
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _removeEntity(index) {
    const newEntities = [...(this._config.entities || [])];
    newEntities.splice(index, 1);
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _toggleExpand(index) {
    const newExpanded = new Set(this._expandedEntities);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    this._expandedEntities = newExpanded;
    this.requestUpdate();
  }

  _fireChangedEvent() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('linear-gauge-card-editor', LinearGaugeCardEditor);
customElements.define('linear-gauge-card', LinearGaugeCard);
