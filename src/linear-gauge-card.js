import { LitElement, html, css } from 'lit';

const ICON_CLOSE = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
const ICON_CHEVRON_DOWN = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
const ICON_CHEVRON_UP = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
const ICON_PLUS = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

// Default gradient palette used by the gradient-track / segments / cursor styles
const LGC_DEFAULT_GRAD = ['#f44336', '#ff9800', '#ffd23f', '#7cb342', '#4caf50'];

// Every gauge style the card can draw, in editor order. Shared by the card and
// the visual editor so a new style only has to be declared once.
const LGC_GAUGE_STYLES = [
  { value: 'bar', label: 'Bar (default)' },
  { value: 'gradient_track', label: 'Gradient track' },
  { value: 'glass', label: 'Glass (glossy)' },
  { value: 'stripes', label: 'Stripes (animated)' },
  { value: 'segments', label: 'Segments (LED)' },
  { value: 'dots', label: 'Dots' },
  { value: 'equalizer', label: 'Equalizer (VU meter)' },
  { value: 'battery', label: 'Battery' },
  { value: 'thermometer', label: 'Thermometer' },
  { value: 'wave', label: 'Wave (liquid)' },
  { value: 'ticks', label: 'Ticks / graduations' },
  { value: 'needle', label: 'Needle scale' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'sparkline', label: 'Sparkline (24h)' },
];

// Styles that only make sense horizontally; they degrade in vertical layout.
const LGC_HORIZONTAL_ONLY_STYLES = new Set(['sparkline', 'ticks', 'equalizer']);

// Thumb shapes offered by the `cursor` style.
const LGC_CURSOR_SHAPES = [
  { value: 'circle', label: 'Circle ●' },
  { value: 'line', label: 'Line |' },
  { value: 'arrow', label: 'Arrow ▾' },
  { value: 'diamond', label: 'Diamond ◆' },
  { value: 'bar', label: 'Bar ▐' },
];

// Sample a hex-color array at position t (0..1) -> 'rgb(r,g,b)'. Non-hex stops
// (rgb/rgba) are returned as-is without interpolation.
function lgcSample(colors, t) {
  t = Math.max(0, Math.min(1, t));
  if (!colors || colors.length === 0) return 'var(--primary-color, #03a9f4)';
  if (colors.length === 1) return colors[0];
  const seg = t * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = colors[i], b = colors[i + 1];
  if (typeof a !== 'string' || typeof b !== 'string' || a[0] !== '#' || b[0] !== '#') return a;
  const hx = (h) => { let s = h.slice(1); if (s.length === 3) s = s.split('').map(c => c + c).join(''); const n = parseInt(s.slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const ca = hx(a), cb = hx(b);
  const m = (k) => Math.round(ca[k] + (cb[k] - ca[k]) * f);
  return `rgb(${m(0)},${m(1)},${m(2)})`;
}

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
    if (changedProps.has('hass') && this.hass && (this._config?.show_min_max || this._usesSparkline())) {
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
              // Downsampled numeric series for the sparkline style
              const vals = entityHistory.map(s => parseFloat(s.state)).filter(v => !isNaN(v));
              let series = vals;
              const MAXP = 60;
              if (vals.length > MAXP) {
                series = [];
                const step = vals.length / MAXP;
                for (let k = 0; k < MAXP; k++) series.push(vals[Math.floor(k * step)]);
              }
              newHistory[entityId] = { min, max, series };
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
        background: var(--lgc-card-background, var(--ha-card-background, var(--card-background-color, #fff)));
        color: var(--primary-text-color);
        padding: var(--lgc-card-padding, 16px);
        border-radius: var(--ha-card-border-radius, 12px);
        border: none;
        box-shadow: var(--ha-card-box-shadow, var(--shadow-elevation-2dp, none));
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      ha-card.compact-vertical {
        --lgc-card-padding: 8px;
      }
      
      ha-card.compact-vertical .entities-wrapper.vertical {
        gap: var(--lgc-compact-gap, 4px);
      }
      
      ha-card.compact-vertical .gauge-container {
        padding: 2px;
      }
      
      ha-card.compact-vertical .entity-row {
        margin-bottom: 2px;
      }

      ha-card:hover {
        box-shadow: var(--ha-card-box-shadow, var(--shadow-elevation-4dp, var(--shadow-elevation-2dp, none)));
        transform: translateY(-2px);
      }
      
      .card-header {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: var(--lgc-header-margin, 24px);
        color: var(--ha-card-header-color, var(--primary-text-color));
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      ha-card.compact-vertical .card-header {
        --lgc-header-margin: 4px;
        font-size: 14px;
      }
      
      .entities-wrapper {
        display: flex;
        gap: var(--lgc-entities-gap, 20px);
      }
      
      .entities-wrapper.horizontal {
        flex-direction: column;
      }

      .entities-wrapper.vertical {
        flex-direction: row;
        justify-content: center;
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
        animation: pulse-red 1.4s infinite;
      }

      @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5); }
        70% { box-shadow: 0 0 0 8px rgba(255, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
      }

      /* Pulse: make the active fill itself blink so it's visible on every style */
      .gauge-container.pulsing .bar-fill,
      .gauge-container.pulsing .grad-track-bg,
      .gauge-container.pulsing .cursor-fill,
      .gauge-container.pulsing .cursor-thumb,
      .gauge-container.pulsing .seg,
      .gauge-container.pulsing .dot,
      .gauge-container.pulsing .eq-bar,
      .gauge-container.pulsing .bat-fill,
      .gauge-container.pulsing .thermo-fill,
      .gauge-container.pulsing .thermo-bulb,
      .gauge-container.pulsing .needle-pointer,
      .gauge-container.pulsing .wave-anim,
      .gauge-container.pulsing .tick-target {
        animation: lgc-pulse-blink 1.1s ease-in-out infinite;
      }

      @keyframes lgc-pulse-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
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
      
      /* When entities_gap is set, don't stretch containers */
      .entities-wrapper.vertical.has-custom-gap .gauge-container {
        flex: 0 0 auto;
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

      /* Compact mode styles */
      .gauge-container.compact {
        padding: 4px;
      }
      
      .entity-row.compact {
        justify-content: center;
        margin-bottom: 4px;
      }
      
      .compact-label {
        font-size: 0.75em;
        text-align: center;
        margin-top: 4px;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      
      .entities-wrapper.vertical .compact-label {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        margin-top: 8px;
      }

      /* Value in bar styles */
      .bar-value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75em;
        font-weight: 700;
        color: #fff;
        text-shadow: 
          0 0 4px rgba(0,0,0,0.9),
          0 0 8px rgba(0,0,0,0.7),
          0 1px 2px rgba(0,0,0,1);
        white-space: nowrap;
        z-index: 3;
        pointer-events: none;
        letter-spacing: 0.5px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(0,0,0,0.3);
      }
      
      .entities-wrapper.vertical .bar-value {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: translate(-50%, -50%) rotate(180deg);
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
        width: var(--lgc-vertical-width, 16px); 
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
        min-width: var(--lgc-bar-min-size, 2px);
      }

      .entities-wrapper.vertical .bar-fill {
        width: 100%;
        min-height: var(--lgc-bar-min-size, 2px);
      }
      
      /* When hide_zero_bar is enabled and value is 0, hide the bar completely */
      .bar-fill.hide-at-zero {
        min-width: 0 !important;
        min-height: 0 !important;
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

      /* Disable shimmer effect */
      .bar-fill.no-shimmer::before {
        display: none;
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

      /* ---- Accessibility: keyboard focus + reduced motion ---- */
      .gauge-container:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        background: rgba(127, 127, 127, 0.08);
      }
      @media (prefers-reduced-motion: reduce) {
        .gauge-container { animation: none !important; }
        .gauge-container.pulsing { animation: none !important; }
        .gauge-container.pulsing .bar-fill,
        .gauge-container.pulsing .grad-track-bg,
        .gauge-container.pulsing .cursor-fill,
        .gauge-container.pulsing .cursor-thumb,
        .gauge-container.pulsing .seg,
        .gauge-container.pulsing .dot,
          .gauge-container.pulsing .eq-bar,
        .gauge-container.pulsing .bat-fill,
        .gauge-container.pulsing .thermo-fill,
        .gauge-container.pulsing .thermo-bulb,
        .gauge-container.pulsing .needle-pointer,
        .gauge-container.pulsing .tick-target { animation: none !important; }
        .wave-anim { animation: none !important; }
        .bar-fill.stripes-fill::after { animation: none !important; }
        .bar-fill::before { animation: none !important; display: none !important; }
        ha-card, .gauge-container { transition: none !important; }
      }

      /* ---- Gauge style: gradient track ---- */
      .bar-bg.grad-track { position: relative; }
      .grad-track-bg { position: absolute; inset: 0; opacity: 0.45; pointer-events: none; }

      /* ---- Gauge style: segments (LED, adjustable count) ---- */
      .seg-track {
        display: flex;
        gap: var(--lgc-segment-gap, 3px);
        width: 100%;
        height: var(--lgc-bar-thickness, 12px);
      }
      .seg-track.vertical {
        flex-direction: column-reverse;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
        margin: 0 auto;
      }
      .seg {
        flex: 1 1 0;
        border-radius: 3px;
        background: rgba(127, 127, 127, 0.18);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }

      /* ---- Gauge style: ticks / graduations ---- */
      .ticks-wrap { position: relative; padding-top: 4px; }
      .ticks-bar { width: 100%; height: var(--lgc-bar-thickness, 10px); }
      .ticks { position: relative; height: 16px; margin-top: 3px; }
      .tick { position: absolute; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
      .tick-mark { width: 1px; height: 4px; background: var(--secondary-text-color, rgba(127,127,127,0.6)); opacity: 0.7; }
      .tick-label { font-size: 9.5px; font-family: var(--code-font-family, monospace); color: var(--secondary-text-color); margin-top: 2px; font-feature-settings: "tnum"; }
      .tick-target { position: absolute; top: -12px; transform: translateX(-50%); font-size: 10px; white-space: nowrap; color: var(--secondary-text-color); }
      .ticks-value {
        position: absolute; top: -13px; transform: translateX(-50%);
        font-size: 10.5px; font-weight: 600; white-space: nowrap;
        color: var(--primary-text-color); font-feature-settings: "tnum";
        padding: 0 4px; border-radius: 4px;
        background: var(--lgc-card-background, var(--card-background-color, rgba(0,0,0,0.5)));
      }

      /* ---- Gauge style: cursor ---- */
      .cursor-wrap { position: relative; height: 22px; margin-top: 16px; }
      .cursor-track { position: absolute; top: 9px; left: 0; right: 0; height: 4px; border-radius: 2px; opacity: 0.32; }
      .cursor-fill { position: absolute; top: 9px; left: 0; height: 4px; border-radius: 2px; }
      /* Zero marker sits on the thin rail rather than spanning the whole row. */
      .cursor-wrap .zero-marker { top: 5px; bottom: auto; height: 12px; }
      .cursor-wrap.vertical .zero-marker { left: 50%; right: auto; width: 12px; transform: translateX(-50%); }
      .needle-wrap .zero-marker { top: auto; bottom: -3px; height: calc(var(--lgc-bar-thickness, 12px) + 6px); }
      .cursor-thumb {
        position: absolute; top: 2px; width: 18px; height: 18px; border-radius: 50%;
        transform: translateX(-50%);
        background: var(--lgc-card-background, var(--card-background-color, #fff));
        border: 3px solid var(--lgc-thumb-color, var(--primary-color));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
      }
      /* Cursor thumb shapes */
      .cursor-thumb.shape-line {
        top: 0; width: 4px; height: 22px; border-radius: 2px; border: none;
        background: var(--lgc-thumb-color, var(--primary-color));
      }
      .cursor-thumb.shape-bar {
        top: 2px; width: 11px; height: 18px; border-radius: 3px; border: none;
        background: var(--lgc-thumb-color, var(--primary-color));
      }
      .cursor-thumb.shape-diamond {
        top: 4px; width: 14px; height: 14px; border-radius: 2px; border: none;
        background: var(--lgc-thumb-color, var(--primary-color));
        transform: translateX(-50%) rotate(45deg);
      }
      .cursor-thumb.shape-arrow {
        top: 3px; width: 0; height: 0; border-radius: 0;
        background: none; box-shadow: none;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 11px solid var(--lgc-thumb-color, var(--primary-color));
      }
      .cursor-label {
        position: absolute; top: -16px; transform: translateX(-50%);
        font-size: 11px; font-weight: 600; white-space: nowrap;
        color: var(--primary-text-color); font-feature-settings: "tnum";
      }

      /* Cursor style: vertical variant */
      .cursor-wrap.vertical {
        position: relative; margin: 0 auto;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
      }
      .cursor-wrap.vertical .cursor-track {
        top: 0; bottom: 0; left: 50%; right: auto;
        width: 4px; height: auto; transform: translateX(-50%);
      }
      .cursor-wrap.vertical .cursor-fill {
        top: auto; bottom: 0; left: 50%; right: auto;
        width: 4px; height: 0; transform: translateX(-50%);
      }
      .cursor-wrap.vertical .cursor-thumb {
        top: auto; left: 50%; transform: translate(-50%, 50%);
      }
      .cursor-wrap.vertical .cursor-thumb.shape-diamond {
        transform: translate(-50%, 50%) rotate(45deg);
      }

      /* ---- Gauge style: sparkline 24h ---- */
      .spark-wrap { width: 100%; }
      .spark-wrap svg { display: block; width: 100%; height: 46px; }
      .spark-meta {
        display: flex; justify-content: space-between;
        font-size: 10.5px; font-family: var(--code-font-family, monospace);
        color: var(--secondary-text-color); margin-top: 2px; font-feature-settings: "tnum";
      }

      /* ---- Gauge style: stripes (animated hazard fill) ---- */
      .bar-fill.stripes-fill::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
          -45deg,
          rgba(255, 255, 255, 0.3) 0 8px,
          rgba(255, 255, 255, 0) 8px 16px
        );
        background-size: 22.7px 22.7px;
        animation: lgc-stripes 1.1s linear infinite;
        pointer-events: none;
      }
      @keyframes lgc-stripes {
        from { background-position: 0 0; }
        to   { background-position: 22.7px 0; }
      }

      /* ---- Gauge style: glass (glossy capsule) ---- */
      .bar-bg.glass-track {
        border-radius: 999px;
        background-color: rgba(127, 127, 127, 0.16);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.28), inset 0 -1px 0 rgba(255, 255, 255, 0.1);
      }
      .bar-fill.glass-fill { border-radius: 999px; }
      .bar-fill.glass-fill::after {
        content: '';
        position: absolute;
        left: 0; right: 0; top: 0;
        height: 46%;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.05));
        pointer-events: none;
      }
      .entities-wrapper.vertical .bar-fill.glass-fill::after {
        top: 0; bottom: 0; left: 0; right: auto;
        width: 46%; height: auto;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.04));
      }

      /* ---- Gauge style: dots ---- */
      .dot-track {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lgc-dot-gap, 4px);
        width: 100%;
        height: var(--lgc-bar-thickness, 12px);
      }
      .dot-track.vertical {
        flex-direction: column-reverse;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
        margin: 0 auto;
      }
      .dot {
        flex: 1 1 0;
        height: 100%;
        max-width: var(--lgc-bar-thickness, 12px);
        border-radius: 50%;
        background: rgba(127, 127, 127, 0.18);
        transition: background 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
      }
      .dot-track.vertical .dot {
        width: auto;
        height: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
      }

      /* ---- Gauge style: equalizer (VU meter) ---- */
      .eq-track {
        display: flex;
        align-items: flex-end;
        gap: var(--lgc-segment-gap, 3px);
        width: 100%;
        height: var(--lgc-equalizer-height, 34px);
      }
      .eq-bar {
        flex: 1 1 0;
        border-radius: 2px;
        background: rgba(127, 127, 127, 0.18);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }

      /* ---- Gauge style: battery ---- */
      .bat-wrap { display: flex; align-items: center; width: 100%; }
      .bat-body {
        position: relative;
        flex: 1 1 auto;
        height: var(--lgc-battery-size, 22px);
        border: 2.5px solid var(--lgc-battery-shell, rgba(127, 127, 127, 0.75));
        border-radius: 6px;
        padding: 2.5px;
        box-sizing: border-box;
      }
      .bat-cells {
        display: flex;
        gap: 2px;
        width: 100%;
        height: 100%;
      }
      .bat-cell {
        flex: 1 1 0;
        border-radius: 1.5px;
        background: rgba(127, 127, 127, 0.16);
        transition: background 0.5s ease;
      }
      .bat-cap {
        flex: 0 0 auto;
        width: 3.5px;
        height: 42%;
        margin-left: 1.5px;
        border-radius: 0 2.5px 2.5px 0;
        background: var(--lgc-battery-shell, rgba(127, 127, 127, 0.75));
      }
      .bat-value {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700;
        color: var(--primary-text-color);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55), 0 0 3px rgba(0, 0, 0, 0.4);
        font-feature-settings: "tnum";
        pointer-events: none;
      }
      .bat-wrap.vertical {
        flex-direction: column;
        align-items: center;
        width: auto;
      }
      .bat-wrap.vertical .bat-body {
        flex: 0 0 auto;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
      }
      .bat-wrap.vertical .bat-cells { flex-direction: column-reverse; }
      .bat-wrap.vertical .bat-cap {
        width: 42%;
        height: 3.5px;
        margin: 0 0 1.5px 0;
        border-radius: 2.5px 2.5px 0 0;
      }

      /* ---- Gauge style: thermometer ---- */
      .thermo-wrap { display: flex; align-items: center; width: 100%; }
      /* The bulb is the reservoir: always full, ringed like the tube. */
      .thermo-bulb {
        flex: 0 0 auto;
        width: var(--lgc-thermo-bulb, 20px);
        height: var(--lgc-thermo-bulb, 20px);
        margin-right: -7px;
        border-radius: 50%;
        background: var(--lgc-thermo-color, var(--primary-color));
        border: 2px solid rgba(127, 127, 127, 0.45);
        box-sizing: border-box;
        z-index: 1;
      }
      .thermo-tube {
        position: relative;
        flex: 1 1 auto;
        height: var(--lgc-thermo-tube, 12px);
        border-radius: 999px;
        background: rgba(127, 127, 127, 0.18);
        border: 2px solid rgba(127, 127, 127, 0.45);
        box-sizing: border-box;
        overflow: hidden;
      }
      .thermo-fill {
        position: absolute;
        top: 0; bottom: 0;
        border-radius: 999px;
        transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1), left 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }
      .thermo-tick {
        position: absolute;
        top: 0;
        width: 1px; height: 45%;
        background: var(--secondary-text-color, rgba(127, 127, 127, 0.8));
        opacity: 0.55;
        pointer-events: none;
      }
      .thermo-scale {
        flex: 0 0 auto;
        margin-left: 5px;
        font-size: 9.5px;
        color: var(--secondary-text-color);
        font-feature-settings: "tnum";
      }
      .thermo-value {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 10.5px; font-weight: 700;
        color: var(--primary-text-color);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        font-feature-settings: "tnum";
        pointer-events: none;
      }
      .thermo-wrap.vertical {
        flex-direction: column-reverse;
        justify-content: flex-start;
        width: auto;
      }
      .thermo-wrap.vertical .thermo-bulb {
        width: var(--lgc-thermo-bulb-v, 22px);
        height: var(--lgc-thermo-bulb-v, 22px);
        margin: -7px 0 0 0;
      }
      .thermo-wrap.vertical .thermo-tube {
        flex: 0 0 auto;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
      }
      .thermo-wrap.vertical .thermo-fill {
        left: 0; right: 0; top: auto;
        transition: height 1s cubic-bezier(0.2, 0.8, 0.2, 1), bottom 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }
      .thermo-wrap.vertical .thermo-tick {
        top: auto; left: 0;
        width: 45%; height: 1px;
      }

      /* ---- Gauge style: needle scale ---- */
      .needle-wrap { position: relative; width: 100%; padding-top: 26px; }
      .needle-band {
        height: var(--lgc-bar-thickness, 12px);
        border-radius: 999px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
      }
      .needle-pointer {
        position: absolute;
        top: 15px;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid var(--lgc-needle-color, var(--primary-text-color));
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
        transition: left 1s cubic-bezier(0.2, 0.8, 0.2, 1), bottom 1s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .needle-bubble {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        font-size: 11px; font-weight: 600; white-space: nowrap;
        color: var(--primary-text-color);
        font-feature-settings: "tnum";
      }
      .needle-target {
        position: absolute;
        bottom: -3px;
        width: 2px; height: calc(var(--lgc-bar-thickness, 12px) + 6px);
        transform: translateX(-50%);
        background: var(--primary-text-color);
        opacity: 0.75;
      }
      .needle-scale {
        display: flex; justify-content: space-between;
        font-size: 9.5px; color: var(--secondary-text-color);
        margin-top: 3px; font-feature-settings: "tnum";
      }
      .needle-wrap.vertical {
        padding-top: 0;
        margin: 0 auto;
        width: calc(var(--lgc-vertical-width, 16px) + 16px);
        height: var(--lgc-vertical-height, 120px);
      }
      .needle-wrap.vertical .needle-band {
        position: absolute;
        right: 0; top: 0; bottom: 0;
        width: var(--lgc-vertical-width, 16px);
        height: auto;
      }
      .needle-wrap.vertical .needle-pointer {
        top: auto; left: 0;
        transform: translateY(50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 10px solid var(--lgc-needle-color, var(--primary-text-color));
        border-right: none;
      }
      .needle-wrap.vertical .needle-target {
        right: -3px; left: auto; bottom: 0;
        width: calc(var(--lgc-vertical-width, 16px) + 6px);
        height: 2px;
        transform: translateY(50%);
      }

      /* ---- Gauge style: wave (liquid tank) ---- */
      .wave-wrap {
        position: relative;
        width: 100%;
        height: var(--lgc-wave-height, 40px);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(127, 127, 127, 0.14);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      .wave-wrap.vertical {
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
        margin: 0 auto;
      }
      .wave-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      .wave-anim { animation: lgc-wave-h 2.6s linear infinite; }
      .wave-back { opacity: 0.42; animation-duration: 4.1s; animation-direction: reverse; }
      .wave-front { opacity: 0.92; }
      .wave-wrap.vertical .wave-anim { animation-name: lgc-wave-v; }
      @keyframes lgc-wave-h {
        from { transform: translateY(0); }
        to   { transform: translateY(50px); }
      }
      @keyframes lgc-wave-v {
        from { transform: translateX(0); }
        to   { transform: translateX(50px); }
      }
      /* ---- center_zero: faint line marking the zero point ---- */
      .zero-marker {
        position: absolute;
        background: var(--primary-text-color);
        opacity: 0.35;
        pointer-events: none;
        z-index: 2;
      }
      .entities-wrapper.horizontal .zero-marker {
        top: 0; bottom: 0; width: 1px;
      }
      .entities-wrapper.vertical .zero-marker {
        left: 0; right: 0; height: 1px;
      }

      .wave-value {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 600;
        color: var(--primary-text-color);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        font-feature-settings: "tnum";
        pointer-events: none;
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
    const verticalWidth = this._config.vertical_width || 16;
    const cardBackground = this._config.card_background;
    const compactMode = this._config.compact_mode || false;
    const entitiesGap = this._config.entities_gap;
    // Heights specific to the taller gauge styles (CSS keeps its own defaults).
    const waveHeight = this._config.wave_height;
    const equalizerHeight = this._config.equalizer_height;
    const batterySize = this._config.battery_size;

    // We bind CSS variables to the host style
    let cardStyle = `
      --lgc-bar-thickness: ${thickness}px;
      --lgc-vertical-height: ${verticalHeight}px;
      --lgc-vertical-width: ${verticalWidth}px;
      ${entitiesGap !== undefined ? `--lgc-entities-gap: ${entitiesGap}px;` : ''}
      ${waveHeight !== undefined ? `--lgc-wave-height: ${waveHeight}px;` : ''}
      ${equalizerHeight !== undefined ? `--lgc-equalizer-height: ${equalizerHeight}px;` : ''}
      ${batterySize !== undefined ? `--lgc-battery-size: ${batterySize}px;` : ''}
    `;
    
    if (transparent) {
      cardStyle += 'background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important;';
    } else if (cardBackground) {
      cardStyle += `--lgc-card-background: ${cardBackground};`;
    }

    const cardClass = compactMode ? 'compact-mode' : '';
    const hasCustomGap = entitiesGap !== undefined;
    
    return html`
      <ha-card class="${cardClass}" style="${cardStyle}">
        ${title ? html`<div class="card-header">${title}</div>` : ''}
        <div class="entities-wrapper ${layout} ${hasCustomGap ? 'has-custom-gap' : ''}">
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
    let clampedValue = value;
    if (!isNaN(value)) {
      clampedValue = Math.max(min, Math.min(value, max));
      // Protection contre la division par zéro si min === max
      if (max !== min) {
        percent = ((clampedValue - min) / (max - min)) * 100;
      } else {
        percent = 0;
      }
      // S'assurer que le pourcentage est entre 0 et 100
      percent = Math.max(0, Math.min(100, percent));
    }

    const centerZero = conf.center_zero ?? this._config.center_zero ?? false;

    const color = this._computeColor(value, conf, layout, centerZero);

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
    if (centerZero && !isNaN(value) && min < 0 && max > 0) {
      const zeroPercent = ((0 - min) / (max - min)) * 100;
      const endPercent = ((clampedValue - min) / (max - min)) * 100;
      if (layout === 'vertical') {
        if (value >= 0) {
          barStyle = `bottom: ${zeroPercent}%; height: ${endPercent - zeroPercent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
        } else {
          barStyle = `bottom: ${endPercent}%; height: ${zeroPercent - endPercent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
        }
      } else {
        if (value >= 0) {
          barStyle = `left: ${zeroPercent}%; width: ${endPercent - zeroPercent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
        } else {
          barStyle = `left: ${endPercent}%; width: ${zeroPercent - endPercent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
        }
      }
    } else if (layout === 'vertical') {
      barStyle = `height: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
    } else {
      barStyle = `width: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color};`;
    }

    let targetMarker = html``;
    // Marker source: target_entity (dynamic, from an entity state) takes priority
    // over the fixed numeric target.
    const targetSource = (conf.target_entity !== undefined && conf.target_entity !== '')
      ? conf.target_entity
      : conf.target;
    if (targetSource !== undefined && targetSource !== '') {
      let targetVal = targetSource;
      if (typeof targetVal === 'string' && isNaN(parseFloat(targetVal))) {
        const targetState = this.hass.states[targetVal];
        if (targetState) {
          targetVal = parseFloat(targetState.state);
        }
      }

      targetVal = parseFloat(targetVal);
      if (!isNaN(targetVal) && max !== min) {
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

      if (hMin !== undefined && hMax !== undefined && max !== min) {
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

    const compactMode = conf.compact_mode || this._config.compact_mode || false;
    const showValueInBar = conf.show_value_in_bar || this._config.show_value_in_bar || false;
    const disableShimmer = conf.disable_shimmer || this._config.disable_shimmer || false;
    const hideIcon = conf.hide_icon || this._config.hide_icon || false;
    const hideZeroBar = conf.hide_zero_bar || this._config.hide_zero_bar || false;
    const isZero = !isNaN(value) && value <= min;
    const displayValue = isNaN(value) ? stateObj.state : `${value.toFixed(conf.value_precision ?? this._config.value_precision ?? 1)} ${unit}`;

    const gaugeStyle = this._gaugeStyle(conf);
    const segmentCount = Math.max(3, Math.min(120, parseInt(conf.segment_count ?? this._config.segment_count ?? 20, 10) || 20));
    const tapConf = conf.tap_action || this._config.tap_action || { action: 'more-info' };
    const interactive = tapConf.action !== 'none';

    const visual = this._renderVisual(gaugeStyle, {
      layout, percent, color, barStyle, targetMarker, minMaxMarker,
      displayValue, showValueInBar, disableShimmer, hideZeroBar, isZero,
      value, min, max, clampedValue, entityId, conf, segmentCount,
    });

    return html`
      <div class="gauge-container ${isPulsing ? 'pulsing' : ''} ${compactMode ? 'compact' : ''} ${showValueInBar ? 'value-in-bar' : ''}"
           role="${interactive ? 'button' : 'img'}"
           tabindex="${interactive ? '0' : '-1'}"
           aria-label="${name}: ${displayValue}"
           @keydown=${(e) => this._handleKey(e, conf, entityId)}
           @click=${(e) => this._handleAction(e, conf, entityId)}>
        ${!compactMode ? html`
        <div class="entity-row">
          <div class="entity-info-group">
            ${icon && !hideIcon ? html`<ha-icon class="entity-icon" .icon="${icon}"></ha-icon>` : ''}
            <span class="entity-name" title="${name}">${name}</span>
          </div>
          ${!showValueInBar ? html`<span class="entity-state">${displayValue}</span>` : ''}
        </div>
        ` : html`
        <div class="entity-row compact">
          ${icon && !hideIcon ? html`<ha-icon class="entity-icon" .icon="${icon}"></ha-icon>` : ''}
        </div>
        `}
        ${visual}
      </div>
    `;
  }

  // Resolve the effective gauge style (per-entity > global), keeping the
  // legacy `effect: led` working by mapping it to the new segments style.
  _gaugeStyle(conf) {
    const s = conf.gauge_style || this._config.gauge_style;
    if (s) return s;
    const eff = conf.effect || this._config.effect;
    if (eff === 'led') return 'segments';
    return 'bar';
  }

  _usesSparkline() {
    if (!this._config || !this._config.entities) return false;
    if (this._config.gauge_style === 'sparkline') return true;
    return this._config.entities.some(e => typeof e === 'object' && e && e.gauge_style === 'sparkline');
  }

  _gradientColors() {
    return (Array.isArray(this._config.colors) && this._config.colors.length > 0)
      ? this._config.colors
      : LGC_DEFAULT_GRAD;
  }

  _gradientCssFor(layout) {
    const dir = layout === 'vertical' ? '0deg' : '90deg';
    return `linear-gradient(${dir}, ${this._gradientColors().join(', ')})`;
  }

  // Solid colour for thumbs / strokes: if the computed colour is a gradient
  // string, sample the palette at the current fraction instead.
  _solidColor(color, frac) {
    if (typeof color === 'string' && color.indexOf('gradient') === -1) return color;
    return lgcSample(this._gradientColors(), frac);
  }

  _resolveTarget(conf) {
    // target_entity (dynamic) takes priority over the numeric target.
    let t = (conf.target_entity !== undefined && conf.target_entity !== '')
      ? conf.target_entity
      : conf.target;
    if (t === undefined || t === '') return null;
    if (typeof t === 'string' && isNaN(parseFloat(t))) {
      const s = this.hass.states[t];
      if (s) t = parseFloat(s.state);
    }
    t = parseFloat(t);
    return isNaN(t) ? null : t;
  }

  _handleKey(e, conf, entityId) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this._handleAction(e, conf, entityId);
    }
  }

  _renderVisual(style, p) {
    let s = style;
    // Sparkline, ticks & equalizer are horizontal concepts — fall back vertically.
    if (p.layout === 'vertical' && LGC_HORIZONTAL_ONLY_STYLES.has(s)) {
      s = (s === 'equalizer') ? 'segments' : 'bar';
    }
    switch (s) {
      case 'gradient_track': return this._visualGradientTrack(p);
      case 'glass':          return this._visualGlass(p);
      case 'stripes':        return this._visualStripes(p);
      case 'segments':       return this._visualSegments(p);
      case 'dots':           return this._visualDots(p);
      case 'equalizer':      return this._visualEqualizer(p);
      case 'battery':        return this._visualBattery(p);
      case 'thermometer':    return this._visualThermometer(p);
      case 'wave':           return this._visualWave(p);
      case 'ticks':          return this._visualTicks(p);
      case 'needle':         return this._visualNeedle(p);
      case 'cursor':         return this._visualCursor(p);
      case 'sparkline':      return this._visualSparkline(p);
      default:               return this._visualBar(p);
    }
  }

  _visualBar(p) {
    const { layout, minMaxMarker, disableShimmer, hideZeroBar, isZero, barStyle, targetMarker, showValueInBar, displayValue } = p;
    return html`
      <div class="bar-bg">
        ${minMaxMarker}
        <div class="bar-fill ${disableShimmer ? 'no-shimmer' : ''} ${hideZeroBar && isZero ? 'hide-at-zero' : ''}" style="${barStyle}"></div>
        ${this._zeroMarker(this._fillSpan(p), layout)}
        ${targetMarker}
        ${showValueInBar ? html`<span class="bar-value">${displayValue}</span>` : ''}
      </div>`;
  }

  _visualGradientTrack(p) {
    const { layout, targetMarker, minMaxMarker, showValueInBar, displayValue } = p;
    const grad = this._gradientCssFor(layout);
    const span = this._fillSpan(p);
    // The fill shows the slice of the full-scale gradient it actually covers, so
    // its colours stay aligned with the faint track behind it. The background is
    // blown up to track size, then shifted by the fill's distance from the start
    // edge — as a percentage, that distance is measured against the overflow.
    const size = Math.max(0.0001, span.size);
    const overflow = 100 - size;
    const fromEdge = layout === 'vertical' ? 100 - span.end : span.start;
    const offset = overflow > 0.0001 ? (fromEdge / overflow) * 100 : 0;
    const fillStyle = layout === 'vertical'
      ? `${this._spanStyle(span, layout)} background-image: ${grad}; background-size: 100% ${10000 / size}%; background-repeat: no-repeat; background-position: 0 ${offset}%; box-shadow: none;`
      : `${this._spanStyle(span, layout)} background-image: ${grad}; background-size: ${10000 / size}% 100%; background-repeat: no-repeat; background-position: ${offset}% 0; box-shadow: none;`;
    return html`
      <div class="bar-bg grad-track">
        <div class="grad-track-bg" style="background-image: ${grad};"></div>
        ${minMaxMarker}
        <div class="bar-fill no-shimmer" style="${fillStyle}"></div>
        ${this._zeroMarker(span, layout)}
        ${targetMarker}
        ${showValueInBar ? html`<span class="bar-value">${displayValue}</span>` : ''}
      </div>`;
  }

  _visualSegments(p) {
    const { layout, segmentCount, conf, color } = p;
    const span = this._fillSpan(p);
    const segs = [];
    for (let i = 0; i < segmentCount; i++) {
      const on = this._elementCoverage(span, i, segmentCount) >= 0.5;
      const c = this._elementColor(conf, color, i, segmentCount);
      segs.push(html`<div class="seg" style="${on ? `background: ${c}; box-shadow: 0 0 6px ${c}66;` : ''}"></div>`);
    }
    return html`<div class="seg-track ${layout === 'vertical' ? 'vertical' : ''}">${segs}</div>`;
  }

  _visualTicks(p) {
    const { percent, color, min, max, conf, showValueInBar, displayValue } = p;
    // tick_count = number of labelled graduations (including both ends), min 2.
    const count = Math.max(2, Math.min(21, parseInt(conf.tick_count ?? this._config.tick_count ?? 5, 10) || 5));
    const ticks = [];
    for (let i = 0; i < count; i++) ticks.push((i / (count - 1)) * 100);
    const tv = this._resolveTarget(conf);
    let targetFlag = html``;
    if (tv !== null && max !== min) {
      const tp = Math.max(0, Math.min(100, ((Math.max(min, Math.min(tv, max)) - min) / (max - min)) * 100));
      targetFlag = html`<div class="tick-target" style="left: ${tp}%">▾ ${tv}</div>`;
    }
    const valueLabel = showValueInBar
      ? html`<div class="ticks-value" style="left: ${Math.max(0, Math.min(100, percent))}%">${displayValue}</div>`
      : html``;
    const span = this._fillSpan(p);
    return html`
      <div class="ticks-wrap">
        ${targetFlag}
        ${valueLabel}
        <div class="bar-bg ticks-bar">
          <div class="bar-fill no-shimmer" style="${this._spanStyle(span, 'horizontal')} background: ${color}; box-shadow: none;"></div>
          ${this._zeroMarker(span, 'horizontal')}
        </div>
        <div class="ticks">
          ${ticks.map(tk => html`
            <div class="tick" style="left: ${tk}%">
              <div class="tick-mark"></div>
              <span class="tick-label">${Math.round(min + (max - min) * tk / 100)}</span>
            </div>`)}
        </div>
      </div>`;
  }

  _visualCursor(p) {
    const { layout, percent, color, displayValue, conf } = p;
    const grad = this._gradientCssFor(layout);
    const solid = this._solidColor(color, percent / 100);
    const shape = conf.cursor_shape || this._config.cursor_shape || 'circle';
    const span = this._fillSpan(p);
    if (layout === 'vertical') {
      // Value is already shown in the entity row above; keep the column clean.
      return html`
        <div class="cursor-wrap vertical">
          <div class="cursor-track" style="background-image: ${grad};"></div>
          <div class="cursor-fill" style="${this._spanStyle(span, layout)} background: ${solid};"></div>
          ${this._zeroMarker(span, layout)}
          <div class="cursor-thumb shape-${shape}" style="bottom: ${percent}%; --lgc-thumb-color: ${solid};"></div>
        </div>`;
    }
    return html`
      <div class="cursor-wrap">
        <div class="cursor-label" style="left: ${percent}%">${displayValue}</div>
        <div class="cursor-track" style="background-image: ${grad};"></div>
        <div class="cursor-fill" style="${this._spanStyle(span, layout)} background: ${solid};"></div>
        ${this._zeroMarker(span, layout)}
        <div class="cursor-thumb shape-${shape}" style="left: ${percent}%; --lgc-thumb-color: ${solid};"></div>
      </div>`;
  }

  _visualSparkline(p) {
    const { entityId, percent, color, min, max } = p;
    const h = this._history[entityId];
    if (!h || !Array.isArray(h.series) || h.series.length < 2) return this._visualBar(p);
    const series = h.series;
    const W = 300, H = 46;
    const dmin = Math.min(...series), dmax = Math.max(...series);
    const range = (dmax - dmin) || 1;
    const xs = (i) => (i / (series.length - 1)) * W;
    const ys = (v) => H - 3 - ((v - dmin) / range) * (H - 6);
    const line = series.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ');
    const area = `${line} L${W},${H} L0,${H} Z`;
    const stroke = this._solidColor(color, percent / 100);
    const gid = 'lgcspark-' + String(entityId).replace(/[^a-z0-9]/gi, '');
    return html`
      <div class="spark-wrap">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${stroke}" stop-opacity="0.34"></stop>
              <stop offset="100%" stop-color="${stroke}" stop-opacity="0.02"></stop>
            </linearGradient>
          </defs>
          <path d="${area}" fill="url(#${gid})"></path>
          <path d="${line}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
          <circle cx="${W}" cy="${ys(series[series.length - 1])}" r="3.2" fill="${stroke}"></circle>
        </svg>
        <div class="spark-meta">
          <span>min ${dmin.toFixed(0)}</span>
          <span style="opacity:0.7">24 h</span>
          <span>max ${dmax.toFixed(0)}</span>
        </div>
      </div>`;
  }

  // Segment/dot/bar count for the "repeated element" styles. Each style keeps
  // its own sensible default when `segment_count` isn't explicitly configured.
  _countFor(style, conf) {
    const defaults = { segments: 20, dots: 12, equalizer: 16 };
    const fallback = defaults[style] ?? 20;
    const explicit = conf.segment_count ?? this._config.segment_count;
    const n = parseInt(explicit ?? fallback, 10) || fallback;
    return Math.max(3, Math.min(120, n));
  }

  // Span of the track covered by the fill, in percent: [start, end].
  // With `center_zero` the fill grows out of the zero point in either
  // direction; otherwise it simply starts at the beginning of the track.
  _fillSpan(p) {
    const { min, max, clampedValue, value, conf } = p;
    const centerZero = conf.center_zero ?? this._config.center_zero ?? false;
    const pos = (v) => ((Math.max(min, Math.min(v, max)) - min) / (max - min)) * 100;
    if (max === min || isNaN(value)) {
      return { start: 0, end: 0, size: 0, zero: 0, centered: false, negative: false };
    }
    if (centerZero && min < 0 && max > 0) {
      const zero = pos(0);
      const v = pos(clampedValue);
      const start = Math.min(zero, v);
      const end = Math.max(zero, v);
      return { start, end, size: end - start, zero, centered: true, negative: clampedValue < 0 };
    }
    const end = pos(clampedValue);
    return { start: 0, end, size: end, zero: 0, centered: false, negative: false };
  }

  // CSS for a fill covering `span` along the track.
  _spanStyle(span, layout) {
    return layout === 'vertical'
      ? `bottom: ${span.start}%; height: ${span.size}%;`
      : `left: ${span.start}%; width: ${span.size}%;`;
  }

  // Faint line showing where zero sits; only drawn in center_zero mode.
  _zeroMarker(span, layout) {
    if (!span.centered) return html``;
    const style = layout === 'vertical' ? `bottom: ${span.zero}%` : `left: ${span.zero}%`;
    return html`<div class="zero-marker" style="${style}"></div>`;
  }

  // Colour of the i-th element of a repeated style: a fixed colour when one is
  // configured, otherwise the gradient palette sampled at that position.
  _elementColor(conf, color, i, count) {
    const fixed = !!(conf.color || conf.severity || this._config.color || this._config.severity);
    return fixed ? color : lgcSample(this._gradientColors(), (i + 0.5) / count);
  }

  // How much of element `i` (of `count`) the fill covers, 0..1.
  _elementCoverage(span, i, count) {
    const lo = (i / count) * 100, hi = ((i + 1) / count) * 100;
    const overlap = Math.min(hi, span.end) - Math.max(lo, span.start);
    return Math.max(0, overlap) / (hi - lo);
  }

  _visualStripes(p) {
    const { layout, barStyle, targetMarker, minMaxMarker, showValueInBar, displayValue } = p;
    return html`
      <div class="bar-bg">
        ${minMaxMarker}
        <div class="bar-fill no-shimmer stripes-fill" style="${barStyle}"></div>
        ${this._zeroMarker(this._fillSpan(p), layout)}
        ${targetMarker}
        ${showValueInBar ? html`<span class="bar-value">${displayValue}</span>` : ''}
      </div>`;
  }

  _visualGlass(p) {
    const { layout, barStyle, targetMarker, minMaxMarker, showValueInBar, displayValue } = p;
    return html`
      <div class="bar-bg glass-track">
        ${minMaxMarker}
        <div class="bar-fill no-shimmer glass-fill" style="${barStyle}"></div>
        ${this._zeroMarker(this._fillSpan(p), layout)}
        ${targetMarker}
        ${showValueInBar ? html`<span class="bar-value">${displayValue}</span>` : ''}
      </div>`;
  }

  _visualDots(p) {
    const { layout, conf, color } = p;
    const count = this._countFor('dots', conf);
    const span = this._fillSpan(p);
    const dots = [];
    for (let i = 0; i < count; i++) {
      const c = this._elementColor(conf, color, i, count);
      // Partially covered dots fade in, so small changes stay readable.
      const cover = this._elementCoverage(span, i, count);
      let style = '';
      if (cover >= 0.5) {
        style = `background: ${c}; box-shadow: 0 0 6px ${c}66;`;
      } else if (cover > 0.05) {
        style = `background: ${c}; opacity: ${(0.25 + 1.5 * cover).toFixed(2)}; transform: scale(${(0.7 + 0.6 * cover).toFixed(2)});`;
      }
      dots.push(html`<div class="dot" style="${style}"></div>`);
    }
    return html`<div class="dot-track ${layout === 'vertical' ? 'vertical' : ''}">${dots}</div>`;
  }

  _visualEqualizer(p) {
    const { conf, color } = p;
    const count = this._countFor('equalizer', conf);
    const span = this._fillSpan(p);
    const bars = [];
    for (let i = 0; i < count; i++) {
      const c = this._elementColor(conf, color, i, count);
      const on = this._elementCoverage(span, i, count) >= 0.5;
      // Bars ramp up from 28% to 100% of the track height, VU-meter style —
      // outwards from the zero point when center_zero is on.
      const t = span.centered
        ? Math.abs(((i + 0.5) / count) * 100 - span.zero) / Math.max(span.zero, 100 - span.zero)
        : (i + 1) / count;
      const h = 28 + 72 * Math.min(1, t);
      bars.push(html`<div class="eq-bar" style="height: ${h.toFixed(1)}%; ${on ? `background: ${c}; box-shadow: 0 0 6px ${c}66;` : ''}"></div>`);
    }
    return html`<div class="eq-track">${bars}</div>`;
  }

  // Direction a partially filled cell drains from: away from the start of the
  // fill, which flips when a center_zero value goes negative.
  _drainAngle(layout, span) {
    if (layout === 'vertical') return span.negative ? '180deg' : '0deg';
    return span.negative ? '270deg' : '90deg';
  }

  _visualBattery(p) {
    const { layout, conf, color, showValueInBar, displayValue } = p;
    const vertical = layout === 'vertical';
    const span = this._fillSpan(p);
    // Chunky cells inside the shell — that is what makes it read as a battery
    // rather than as a bordered bar.
    const cells = Math.max(2, Math.min(12, parseInt(conf.battery_cells ?? this._config.battery_cells ?? 4, 10) || 4));
    const items = [];
    for (let i = 0; i < cells; i++) {
      const cover = this._elementCoverage(span, i, cells);
      const c = this._elementColor(conf, color, i, cells);
      // The leading cell drains proportionally so the reading stays precise.
      const pct = (cover * 100).toFixed(1);
      const fill = cover >= 0.999
        ? `background: ${c};`
        : cover > 0.02
          ? `background: linear-gradient(${this._drainAngle(layout, span)}, ${c} ${pct}%, rgba(0,0,0,0) ${pct}%);`
          : '';
      items.push(html`<div class="bat-cell" style="${fill}"></div>`);
    }
    const body = html`
      <div class="bat-body">
        <div class="bat-cells">${items}</div>
        ${showValueInBar ? html`<span class="bat-value">${displayValue}</span>` : ''}
      </div>`;
    const cap = html`<div class="bat-cap"></div>`;
    return html`
      <div class="bat-wrap ${vertical ? 'vertical' : ''}">
        ${vertical ? html`${cap}${body}` : html`${body}${cap}`}
      </div>`;
  }

  _visualThermometer(p) {
    const { layout, percent, color, min, max, conf, showValueInBar, displayValue,
            targetMarker, minMaxMarker } = p;
    const vertical = layout === 'vertical';
    const span = this._fillSpan(p);
    // The bulb is the reservoir: always full, in the colour of the reading.
    const solid = this._solidColor(color, percent / 100);
    // Graduations inside the tube, spaced like the `ticks` style.
    const count = Math.max(2, Math.min(21, parseInt(conf.tick_count ?? this._config.tick_count ?? 5, 10) || 5));
    const ticks = [];
    for (let i = 1; i < count - 1; i++) {
      const at = (i / (count - 1)) * 100;
      ticks.push(html`<div class="thermo-tick" style="${vertical ? `bottom: ${at}%` : `left: ${at}%`}"></div>`);
    }
    return html`
      <div class="thermo-wrap ${vertical ? 'vertical' : ''}">
        <div class="thermo-bulb" style="--lgc-thermo-color: ${solid};"></div>
        <div class="thermo-tube">
          ${minMaxMarker}
          <div class="thermo-fill" style="${this._spanStyle(span, layout)} background: ${color};"></div>
          ${ticks}
          ${this._zeroMarker(span, layout)}
          ${targetMarker}
          ${showValueInBar ? html`<span class="thermo-value">${displayValue}</span>` : ''}
        </div>
        ${vertical ? '' : html`<span class="thermo-scale">${max}</span>`}
      </div>`;
  }

  _visualNeedle(p) {
    const { layout, percent, color, min, max, conf, showValueInBar, displayValue } = p;
    const vertical = layout === 'vertical';
    const grad = this._gradientCssFor(layout);
    const solid = this._solidColor(color, percent / 100);
    const pos = Math.max(0, Math.min(100, percent));
    const tv = this._resolveTarget(conf);
    let targetTick = html``;
    if (tv !== null && max !== min) {
      const tp = Math.max(0, Math.min(100, ((Math.max(min, Math.min(tv, max)) - min) / (max - min)) * 100));
      targetTick = html`<div class="needle-target" style="${vertical ? `bottom: ${tp}%` : `left: ${tp}%`}"></div>`;
    }
    if (vertical) {
      return html`
        <div class="needle-wrap vertical">
          <div class="needle-band" style="background-image: ${grad};"></div>
          ${this._zeroMarker(this._fillSpan(p), layout)}
          ${targetTick}
          <div class="needle-pointer" style="bottom: ${pos}%; --lgc-needle-color: ${solid};"></div>
        </div>`;
    }
    return html`
      <div class="needle-wrap">
        ${showValueInBar ? html`<div class="needle-bubble" style="left: ${pos}%">${displayValue}</div>` : ''}
        <div class="needle-pointer" style="left: ${pos}%; --lgc-needle-color: ${solid};"></div>
        <div class="needle-band" style="background-image: ${grad};"></div>
        ${this._zeroMarker(this._fillSpan(p), layout)}
        ${targetTick}
        <div class="needle-scale"><span>${min}</span><span>${max}</span></div>
      </div>`;
  }

  // Liquid tank: the fill boundary is a sine wave that scrolls sideways. Two
  // layers at different amplitudes and speeds give the surface some depth.
  // Each layer is drawn well outside the 0..100 view box so translating it by
  // exactly one wavelength loops seamlessly.
  _visualWave(p) {
    const { layout, percent, color, displayValue, showValueInBar, targetMarker } = p;
    const vertical = layout === 'vertical';
    const solid = this._solidColor(color, percent / 100);
    const span = this._fillSpan(p);
    // Flat edge of the liquid (the tank floor, or the zero point) and the level
    // the waves ride on. They swap around when a center_zero value goes negative.
    const base = span.centered ? span.zero : 0;
    const level = span.centered && span.negative ? span.start : span.end;
    const dir = level >= base ? 1 : -1;
    const reach = Math.abs((dir > 0 ? 100 : 0) - base) || 1;
    const wavelength = 50, steps = 130, from = -80, to = 180;

    const layer = (amp, phase) => {
      // Push the crests past the ends so "empty" shows nothing and "full" has
      // no gap, then ride the sine on top.
      const t = Math.abs(level - base) / reach;
      const surface = base + dir * (Math.abs(level - base) + amp * (2 * t - 1));
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const u = from + ((to - from) * i) / steps;
        const off = Math.sin((u / wavelength + phase) * Math.PI * 2) * amp;
        // Clamped to the base edge so crests never spill past the zero point
        // (or the tank floor) onto the empty side.
        const v = dir > 0
          ? Math.max(base, surface + off)
          : Math.min(base, surface + off);
        pts.push(vertical ? `${u.toFixed(2)},${(100 - v).toFixed(2)}` : `${v.toFixed(2)},${u.toFixed(2)}`);
      }
      const close = vertical
        ? [`180,${(100 - base).toFixed(2)}`, `-80,${(100 - base).toFixed(2)}`]
        : [`${base.toFixed(2)},180`, `${base.toFixed(2)},-80`];
      return `M${pts.join(' L')} L${close.join(' L')} Z`;
    };

    return html`
      <div class="wave-wrap ${vertical ? 'vertical' : ''}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="wave-anim wave-back" d="${layer(4, 0.35)}" fill="${solid}"></path>
          <path class="wave-anim wave-front" d="${layer(2.4, 0)}" fill="${solid}"></path>
        </svg>
        ${this._zeroMarker(span, layout)}
        ${targetMarker}
        ${showValueInBar ? html`<span class="wave-value">${displayValue}</span>` : ''}
      </div>`;
  }

  _handleAction(e, conf, entityId) {
    if (conf.tap_action && conf.tap_action.action === 'none') {
      return;
    }

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
      const serviceData = { ...config.data };
      if (!serviceData.entity_id) {
        serviceData.entity_id = entityId;
      }
      this.hass.callService(domain, service, serviceData);
    }
  }

  _computeColor(value, entityConf, layout, isCenterZero = false) {
    if (isNaN(value)) return 'var(--primary-color, #44739e)';

    // Negative color override for center_zero mode
    if (isCenterZero && value < 0) {
      if (entityConf.color_negative) return entityConf.color_negative;
      if (this._config.color_negative) return this._config.color_negative;
    }

    const evalValue = (isCenterZero && value < 0) ? Math.abs(value) : value;

    const makeGradient = (colors) => {
      let direction = (layout === 'vertical') ? '0deg' : '90deg';
      if (isCenterZero && value < 0) {
        direction = (layout === 'vertical') ? '180deg' : '270deg';
      }
      return `linear-gradient(${direction}, ${colors.join(', ')})`;
    };

    // Severity priority (highest)
    if (entityConf.severity) {
      const match = this._getSeverityMatch(evalValue, entityConf.severity);
      if (match) return match.color;
    }

    // Entity fixed color
    if (entityConf.color) return entityConf.color;

    // Global severity
    if (this._config.severity) return this._computeSeverity(evalValue, this._config.severity);

    // Global fixed color (NEW: priority over gradient)
    if (this._config.color) return this._config.color;

    // Global gradient colors
    if (Array.isArray(this._config.colors) && this._config.colors.length > 0) {
      return makeGradient(this._config.colors);
    }

    // Default fallback
    return 'var(--primary-color, #03a9f4)';
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
      _haLoaded: { state: true },
    };
  }

  constructor() {
    super();
    this._expandedEntities = new Set();
    this._haLoaded = !!customElements.get('ha-textfield');
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._haLoaded) this._ensureHaComponents();
  }

  // Some HA frontends don't have `ha-textfield` (and other editor inputs)
  // registered when a custom card editor first renders, leaving those fields
  // invisible. Loading the built-in `entities` card config element forces HA
  // to import them; existing <ha-textfield> nodes then upgrade automatically.
  async _ensureHaComponents() {
    try {
      if (window.loadCardHelpers) {
        const helpers = await window.loadCardHelpers();
        const el = await helpers.createCardElement({ type: 'entities', entities: [] });
        if (el && el.constructor && el.constructor.getConfigElement) {
          await el.constructor.getConfigElement();
        }
      }
      await customElements.whenDefined('ha-textfield');
    } catch (e) {
      // best effort — fall back to whatever is already available
    } finally {
      this._haLoaded = true;
    }
  }

  setConfig(config) {
    this._config = config;
  }

  // Native <input> replacement for ha-textfield, which isn't always registered
  // in every HA frontend (it would otherwise render invisibly).
  _plainInput({ label, value, placeholder = '', type = 'text', oninput, configValue, style = '' }) {
    return html`
      <div class="text-input-group" style=${style}>
        <label>${label}</label>
        <input
          class="plain-input"
          type=${type}
          .value=${value ?? ''}
          placeholder=${placeholder}
          .configValue=${configValue}
          @input=${oninput}
        />
      </div>`;
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
      .text-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
      }
      .text-input-group label {
          font-size: 0.85em;
          color: var(--secondary-text-color, #888);
      }
      .text-input-group input.plain-input {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 10px;
          font-size: 1em;
          color: var(--primary-text-color, #fff);
          background: var(--primary-background-color, rgba(255,255,255,0.05));
          border: 1px solid var(--divider-color, rgba(255,255,255,0.2));
          border-radius: 4px;
          outline: none;
      }
      .text-input-group input.plain-input:focus {
          border-color: var(--primary-color, #03a9f4);
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

    const gaugeStyleSelector = {
      select: { mode: 'dropdown', options: LGC_GAUGE_STYLES }
    };

    const cursorShapeSelector = {
      select: { mode: 'dropdown', options: LGC_CURSOR_SHAPES }
    };

    // Schema for ha-selector
    const sensorSelector = { entity: { domain: "sensor" } };

    const globalColors = this._config.colors || [];

    return html`
      <div class="card-config">

        <div class="section-title">Card Settings</div>
        <div class="text-input-group">
          <label>Card Title</label>
          <input
            class="plain-input"
            type="text"
            placeholder="Optional title shown at the top of the card"
            .value=${this._config.title || ''}
            @input=${(e) => this._plainValueChanged(e, 'title')}
          />
        </div>

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
            label="Gauge Style"
            .hass=${this.hass}
            .selector=${gaugeStyleSelector}
            .value=${this._config.gauge_style || (this._config.effect === 'led' ? 'segments' : 'bar')}
            .configValue=${'gauge_style'}
            @value-changed=${this._valueChanged}
          ></ha-selector>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Element count (segments, dots, equalizer)</label>
            <input
              class="plain-input"
              type="number"
              min="3"
              max="120"
              placeholder="20"
              .value=${this._config.segment_count ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'segment_count', 'int')}
            />
          </div>
          <div class="text-input-group">
            <label>Tick count (ticks style)</label>
            <input
              class="plain-input"
              type="number"
              min="2"
              max="21"
              placeholder="5"
              .value=${this._config.tick_count ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'tick_count', 'int')}
            />
          </div>
        </div>

        <div class="row">
          <ha-selector
            label="Cursor shape (cursor style)"
            .hass=${this.hass}
            .selector=${cursorShapeSelector}
            .value=${this._config.cursor_shape || 'circle'}
            .configValue=${'cursor_shape'}
            @value-changed=${this._valueChanged}
          ></ha-selector>
          <div class="text-input-group">
            <label>Wave height (px)</label>
            <input
              class="plain-input"
              type="number"
              min="16"
              placeholder="40"
              .value=${this._config.wave_height ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'wave_height', 'int')}
            />
          </div>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Equalizer height (px)</label>
            <input
              class="plain-input"
              type="number"
              min="12"
              placeholder="34"
              .value=${this._config.equalizer_height ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'equalizer_height', 'int')}
            />
          </div>
          <div class="text-input-group">
            <label>Battery height (px)</label>
            <input
              class="plain-input"
              type="number"
              min="12"
              placeholder="22"
              .value=${this._config.battery_size ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'battery_size', 'int')}
            />
          </div>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Battery cells</label>
            <input
              class="plain-input"
              type="number"
              min="2"
              max="12"
              placeholder="4"
              .value=${this._config.battery_cells ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'battery_cells', 'int')}
            />
          </div>
        </div>

        <div class="section-title">Gauge Size & Range</div>
        <div class="row">
          <div class="text-input-group">
            <label>Min</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.min ?? 0}
              @input=${(e) => this._plainNumberChanged(e, 'min', 'float')}
            />
          </div>
          <div class="text-input-group">
            <label>Max</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.max ?? 100}
              @input=${(e) => this._plainNumberChanged(e, 'max', 'float')}
            />
          </div>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Bar Thickness (px)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.bar_thickness ?? 12}
              @input=${(e) => this._plainNumberChanged(e, 'bar_thickness', 'float')}
            />
          </div>
          <div class="text-input-group">
            <label>Value Precision (decimals)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.value_precision ?? 1}
              @input=${(e) => this._plainNumberChanged(e, 'value_precision', 'int')}
            />
          </div>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Vertical Height (px)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.vertical_height ?? 120}
              @input=${(e) => this._plainNumberChanged(e, 'vertical_height', 'float')}
            />
          </div>
          <div class="text-input-group">
            <label>Vertical Width (px)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.vertical_width ?? 16}
              @input=${(e) => this._plainNumberChanged(e, 'vertical_width', 'float')}
            />
          </div>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Gap between entities (px)</label>
            <input
              class="plain-input"
              type="number"
              placeholder="20"
              .value=${this._config.entities_gap ?? ''}
              @input=${(e) => this._plainNumberChanged(e, 'entities_gap', 'float')}
            />
          </div>
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

        ${!this._config.transparent ? html`
        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Card Background Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Leave empty to use theme default</div>
            ${this._renderColorWithAlpha('card_background', this._config.card_background)}
          </div>
        </div>
        ` : ''}

        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Global Fixed Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Overrides gradient colors. Leave empty to use gradient.</div>
            ${this._renderColorWithAlpha('color', this._config.color)}
          </div>
        </div>

        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Global Negative Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Used when Center Zero is active and value is negative. Leave empty to use symmetric colors.</div>
            ${this._renderColorWithAlpha('color_negative', this._config.color_negative)}
          </div>
        </div>

        <div class="row">
          <span>Compact Mode</span>
          <ha-switch
            .checked=${this._config.compact_mode || false}
            .configValue=${'compact_mode'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Hide Icon</span>
          <ha-switch
            .checked=${this._config.hide_icon || false}
            .configValue=${'hide_icon'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Hide Bar at Zero</span>
          <ha-switch
            .checked=${this._config.hide_zero_bar || false}
            .configValue=${'hide_zero_bar'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Show Value in Bar</span>
          <ha-switch
            .checked=${this._config.show_value_in_bar || false}
            .configValue=${'show_value_in_bar'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Disable Shimmer Effect</span>
          <ha-switch
            .checked=${this._config.disable_shimmer || false}
            .configValue=${'disable_shimmer'}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Center Zero</span>
          <ha-switch
            .checked=${this._config.center_zero || false}
            .configValue=${'center_zero'}
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

        <div class="text-input-group">
          <label>Display name (optional)</label>
          <input
            class="plain-input"
            type="text"
            placeholder="Override the entity friendly name"
            .value=${entityObj.name || ''}
            @input=${(e) => this._entityPlainChanged(e, index, 'name')}
          />
        </div>

        ${isExpanded ? this._renderEntityDetails(entityObj, index, color, useCustomColor) : ''}
      </div>
    `;
  }

  _renderColorWithAlpha(configKey, currentValue) {
    // Parse current color value
    let hexColor = '#ffffff';
    let alpha = 1;
    
    if (currentValue) {
      if (currentValue.startsWith('rgba')) {
        const match = currentValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
          hexColor = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        }
      } else if (currentValue.startsWith('rgb')) {
        const match = currentValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          hexColor = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        }
      } else if (currentValue.startsWith('#')) {
        hexColor = currentValue.substring(0, 7);
        // Check for 8-digit hex (#RRGGBBAA)
        if (currentValue.length === 9) {
          alpha = parseInt(currentValue.substring(7, 9), 16) / 255;
        }
      }
    }
    
    const alphaPercent = Math.round(alpha * 100);
    
    return html`
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="position: relative; width: 50px; height: 40px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
            <!-- Checkerboard pattern for transparency preview -->
            <div style="position: absolute; inset: 0; background: 
              repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px;"></div>
            <!-- Color preview -->
            <div style="position: absolute; inset: 0; background: ${currentValue || 'transparent'};"></div>
            <input
              type="color"
              .value=${hexColor}
              @input=${(e) => this._updateColorWithAlpha(e.target.value, alpha, configKey)}
              style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;"
            >
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 0.85em; opacity: 0.8;">Opacity: ${alphaPercent}%</span>
              ${currentValue ? html`
                <ha-icon-button
                  .path=${ICON_CLOSE}
                  style="color: var(--error-color); --mdc-icon-button-size: 32px;"
                  @click=${() => this._clearColorValue(configKey)}
                ></ha-icon-button>
              ` : ''}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              .value=${alphaPercent}
              @input=${(e) => this._updateColorWithAlpha(hexColor, parseInt(e.target.value) / 100, configKey)}
              style="width: 100%; height: 6px; cursor: pointer;"
            >
          </div>
        </div>
        ${this._plainInput({
          label: 'CSS Color',
          value: currentValue || '',
          configValue: configKey,
          oninput: this._valueChanged,
        })}
      </div>
    `;
  }

  _updateColorWithAlpha(hexColor, alpha, configKey) {
    if (!this._config) return;
    
    // Convert hex to rgb
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    
    // Round alpha to 2 decimal places
    alpha = Math.round(alpha * 100) / 100;
    
    const rgbaValue = alpha === 1 
      ? hexColor 
      : `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
    this._config = {
      ...this._config,
      [configKey]: rgbaValue,
    };
    this._fireChangedEvent();
  }

  _clearColorValue(configKey) {
    if (!this._config) return;
    const newConfig = { ...this._config };
    delete newConfig[configKey];
    this._config = newConfig;
    this._fireChangedEvent();
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

    const effectOptions = [
      { value: 'default', label: 'Default' },
      { value: 'led', label: 'LED' }
    ];

    const gaugeStyleOptions = [
      { value: '', label: '(inherit global)' },
      ...LGC_GAUGE_STYLES,
    ];

    const cursorShapeOptions = LGC_CURSOR_SHAPES;

    return html`
        <div class="entity-details">
            <div class="row">
                ${this._plainInput({
                  label: 'Icon (e.g., mdi:thermometer)',
                  value: entity.icon || '',
                  oninput: (e) => this._entityChanged(e, index, 'icon'),
                })}
            </div>
            <div class="row">
                ${this._plainInput({
                  label: 'Min', type: 'number',
                  value: entity.min ?? '', placeholder: this._config.min ?? 0,
                  oninput: (e) => this._entityChanged(e, index, 'min'),
                })}
                ${this._plainInput({
                  label: 'Max', type: 'number',
                  value: entity.max ?? '', placeholder: this._config.max ?? 100,
                  oninput: (e) => this._entityChanged(e, index, 'max'),
                })}
                ${this._plainInput({
                  label: 'Target', type: 'number',
                  value: entity.target ?? '',
                  oninput: (e) => this._entityChanged(e, index, 'target'),
                })}
                ${this._plainInput({
                  label: 'Precision', type: 'number',
                  value: entity.value_precision ?? '', placeholder: this._config.value_precision ?? 1,
                  oninput: (e) => this._entityChanged(e, index, 'value_precision'),
                })}
            </div>
            <div class="row" style="align-items: center;">
                <ha-selector
                    style="flex: 1;"
                    label="Target Entity (marker)"
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${entity.target_entity || ''}
                    @value-changed=${(e) => this._entityChanged(e, index, 'target_entity')}
                ></ha-selector>
                ${entity.target_entity ? html`
                    <ha-icon-button
                        class="delete"
                        .path=${ICON_CLOSE}
                        @click=${() => this._clearEntityField(index, 'target_entity')}
                        title="Clear target entity"
                    ></ha-icon-button>
                ` : ''}
            </div>
            <div class="row">
                <ha-selector
                    label="Gauge Style"
                    .hass=${this.hass}
                    .selector=${{ select: { mode: 'dropdown', options: gaugeStyleOptions } }}
                    .value=${entity.gauge_style || (entity.effect === 'led' ? 'segments' : '')}
                    @value-changed=${(e) => this._entityChanged(e, index, 'gauge_style')}
                ></ha-selector>
                ${this._plainInput({
                  label: 'Element count', type: 'number',
                  value: entity.segment_count ?? '', placeholder: this._config.segment_count ?? 20,
                  oninput: (e) => this._entityChanged(e, index, 'segment_count'),
                })}
            </div>
            <div class="row">
                ${this._plainInput({
                  label: 'Tick count (ticks style)', type: 'number',
                  value: entity.tick_count ?? '', placeholder: this._config.tick_count ?? 5,
                  oninput: (e) => this._entityChanged(e, index, 'tick_count'),
                })}
                <ha-selector
                    label="Cursor shape"
                    .hass=${this.hass}
                    .selector=${{ select: { mode: 'dropdown', options: cursorShapeOptions } }}
                    .value=${entity.cursor_shape || 'circle'}
                    @value-changed=${(e) => this._entityChanged(e, index, 'cursor_shape')}
                ></ha-selector>
            </div>

            <div class="row">
                <span>Compact Mode</span>
                <ha-switch
                    .checked=${entity.compact_mode || false}
                    @change=${(e) => this._entityChanged(e, index, 'compact_mode')}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Hide Icon</span>
                <ha-switch
                    .checked=${entity.hide_icon || false}
                    @change=${(e) => this._entityChanged(e, index, 'hide_icon')}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Hide Bar at Zero</span>
                <ha-switch
                    .checked=${entity.hide_zero_bar || false}
                    @change=${(e) => this._entityChanged(e, index, 'hide_zero_bar')}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Show Value in Bar</span>
                <ha-switch
                    .checked=${entity.show_value_in_bar || false}
                    @change=${(e) => this._entityChanged(e, index, 'show_value_in_bar')}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Disable Shimmer Effect</span>
                <ha-switch
                    .checked=${entity.disable_shimmer || false}
                    @change=${(e) => this._entityChanged(e, index, 'disable_shimmer')}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Center Zero</span>
                <ha-switch
                    .checked=${entity.center_zero || false}
                    @change=${(e) => this._entityChanged(e, index, 'center_zero')}
                ></ha-switch>
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
                 <div class="entity-color-toggle">
                    <span>Custom Negative Color (center zero)</span>
                    <ha-switch
                      .checked=${!!entity.color_negative}
                      @change=${(e) => this._toggleEntityNegativeColor(e, index)}
                    ></ha-switch>
                 </div>
                 ${entity.color_negative ? html`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${entity.color_negative || '#f44336'}
                            @input=${(e) => this._entityChanged(e, index, 'color_negative')}
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

                 ${tapAction.action === 'navigate' ? this._plainInput({
                    label: 'Navigation Path',
                    value: tapAction.navigation_path || '',
                    oninput: (e) => this._tapActionChanged(e, index, 'navigation_path'),
                    style: 'margin-top: 8px;',
                 }) : ''}

                 ${tapAction.action === 'url' ? this._plainInput({
                    label: 'URL',
                    value: tapAction.url_path || '',
                    oninput: (e) => this._tapActionChanged(e, index, 'url_path'),
                    style: 'margin-top: 8px;',
                 }) : ''}

                 ${tapAction.action === 'call-service' ? this._plainInput({
                    label: 'Service (e.g., light.turn_on)',
                    value: tapAction.service || '',
                    oninput: (e) => this._tapActionChanged(e, index, 'service'),
                    style: 'margin-top: 8px;',
                 }) : ''}
            </div>

            <div>
                <div class="section-title">Pulse (Animation)</div>
                <div class="row">
                     ${this._plainInput({
                        label: 'Threshold', type: 'number',
                        value: pulse.value ?? '',
                        oninput: (e) => this._pulseChanged(e, index, 'value'),
                     })}
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
                        ${this._plainInput({
                          label: 'From', type: 'number',
                          value: band.from ?? 0,
                          oninput: (e) => this._severityChanged(e, index, bandIndex, 'from'),
                          style: 'width: 80px;',
                        })}
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

    if (configValue === 'min' || configValue === 'max' || configValue === 'bar_thickness' || configValue === 'vertical_height' || configValue === 'vertical_width' || configValue === 'entities_gap') {
      value = parseFloat(value);
    }
    
    if (configValue === 'value_precision') {
      value = parseInt(value);
    }
    
    // Handle empty values for optional numeric fields
    if (configValue === 'entities_gap' && (isNaN(value) || target.value === '')) {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
      this._fireChangedEvent();
      return;
    }

    // `circle` is the implicit cursor shape — drop it to keep the YAML clean.
    if (configValue === 'cursor_shape' && (!value || value === 'circle')) {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
      this._fireChangedEvent();
      return;
    }

    if (configValue) {
      this._config = {
        ...this._config,
        [configValue]: value,
      };
      this._fireChangedEvent();
    }
  }

  _plainNumberChanged(e, configKey, parseMode) {
    if (!this._config) return;
    const raw = e.target.value;
    if (raw === '' || raw === undefined || raw === null) {
      const newConfig = { ...this._config };
      delete newConfig[configKey];
      this._config = newConfig;
      this._fireChangedEvent();
      return;
    }
    const parsed = parseMode === 'int' ? parseInt(raw) : parseFloat(raw);
    if (isNaN(parsed)) return;
    this._config = { ...this._config, [configKey]: parsed };
    this._fireChangedEvent();
  }

  _plainValueChanged(e, configKey) {
    if (!this._config) return;
    const value = e.target.value;
    if (value === '' || value === undefined || value === null) {
      const newConfig = { ...this._config };
      delete newConfig[configKey];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [configKey]: value };
    }
    this._fireChangedEvent();
  }

  _entityPlainChanged(e, index, field) {
    const newEntities = [...(this._config.entities || [])];
    let currentValue = newEntities[index];
    if (typeof currentValue === 'string') {
      currentValue = { entity: currentValue };
    } else {
      currentValue = { ...currentValue };
    }
    const newValue = e.target.value;
    if (newValue === '' || newValue === undefined || newValue === null) {
      delete currentValue[field];
    } else {
      currentValue[field] = newValue;
    }
    newEntities[index] = currentValue;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _colorValueChanged(e, configValue) {
    if (!this._config || !this.hass) return;
    const value = e.target.value;
    this._config = {
      ...this._config,
      [configValue]: value,
    };
    this._fireChangedEvent();
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

    // Handle switch/checkbox events
    if (e.target && e.target.tagName === 'HA-SWITCH') {
      newValue = e.target.checked;
    }
    
    // Handle target (numeric marker) - if empty, delete
    if (field === 'target') {
      if (newValue === '' || newValue === undefined || newValue === null) {
        delete currentValue[field];
      } else {
        currentValue[field] = parseFloat(newValue);
      }
    } else
    // Handle target_entity (entity marker) - keep as string, delete if empty
    if (field === 'target_entity') {
      if (!newValue) {
        delete currentValue[field];
      } else {
        currentValue[field] = newValue;
      }
    } else
    // Tick / segment counts - if empty, delete to use global/default
    if (field === 'tick_count' || field === 'segment_count') {
      if (newValue === '' || newValue === undefined || newValue === null || isNaN(newValue)) {
        delete currentValue[field];
      } else {
        currentValue[field] = parseInt(newValue, 10);
      }
    } else
    // gauge_style / cursor_shape - delete when inheriting default
    if ((field === 'gauge_style' && (!newValue || newValue === '')) ||
        (field === 'cursor_shape' && (!newValue || newValue === 'circle'))) {
      delete currentValue[field];
    } else
    // Handle value_precision - if empty, delete to use global value
    if (field === 'value_precision') {
      if (newValue === '' || newValue === undefined || newValue === null || isNaN(newValue)) {
        delete currentValue[field];
      } else {
        newValue = parseInt(newValue);
        currentValue[field] = newValue;
      }
    } else
    // Handle min/max - if empty, delete to use global value
    if (field === 'min' || field === 'max') {
      if (newValue === '' || newValue === undefined || newValue === null) {
        delete currentValue[field];
      } else {
        newValue = parseFloat(newValue);
        currentValue[field] = newValue;
      }
    } else if (field === 'effect' && newValue === 'default') {
      // Don't save 'default' effect, use global or let it be undefined
      delete currentValue[field];
    } else if ((field === 'compact_mode' || field === 'show_value_in_bar' || field === 'disable_shimmer' || field === 'center_zero' || field === 'hide_icon' || field === 'hide_zero_bar') && !newValue) {
      // Delete boolean fields when false to keep config clean
      delete currentValue[field];
    } else if (field === 'color_negative' && (!newValue || newValue === '')) {
      delete currentValue[field];
    } else {
      currentValue[field] = newValue;
    }

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

  _toggleEntityNegativeColor(e, index) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };

    if (e.target.checked) {
      row.color_negative = '#f44336';
    } else {
      delete row.color_negative;
    }

    newEntities[index] = row;
    this._config = { ...this._config, entities: newEntities };
    this._fireChangedEvent();
  }

  _clearEntityField(index, field) {
    const newEntities = [...(this._config.entities || [])];
    let row = { ...(typeof newEntities[index] === 'string' ? { entity: newEntities[index] } : newEntities[index]) };
    delete row[field];
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

const LGC_VERSION = '1.4.0';
console.info(
  `%c LINEAR-GAUGE-CARD %c ${LGC_VERSION} `,
  'color: white; background: #03a9f4; font-weight: 700;',
  'color: #03a9f4; background: #1c1c1c; font-weight: 700;'
);

customElements.define('linear-gauge-card-editor', LinearGaugeCardEditor);
customElements.define('linear-gauge-card', LinearGaugeCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'linear-gauge-card',
  name: 'Linear Gauge Card',
  description: 'A linear gauge card for Home Assistant',
  preview: true,
  documentationURL: 'https://github.com/guiohm79/jaugeLineaire'
});