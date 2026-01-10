/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Z = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), it = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = it.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && it.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (n) => new ft(typeof n == "string" ? n : n + "", void 0, J), vt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new ft(e, n, J);
}, xt = (n, t) => {
  if (Z) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = j.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, st = Z ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return bt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: At, getOwnPropertyDescriptor: Et, getOwnPropertyNames: St, getOwnPropertySymbols: kt, getPrototypeOf: Ct } = Object, b = globalThis, rt = b.trustedTypes, Pt = rt ? rt.emptyScript : "", W = b.reactiveElementPolyfillSupport, P = (n, t) => n, G = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Pt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, gt = (n, t) => !wt(n, t), nt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && At(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = Et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const h = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, h, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...St(e), ...kt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(st(s));
    } else t !== void 0 && e.push(st(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : G).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const h = i.getPropertyOptions(s), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((r = h.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? h.converter : G;
      this._$Em = s;
      const d = a.fromAttribute(e, h.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    var o;
    if (t !== void 0) {
      const h = this.constructor;
      if (s === !1 && (r = this[t]), i ?? (i = h.getPropertyOptions(t)), !((i.hasChanged ?? gt)(r, e) || i.useDefault && i.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(h._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: h } = o, a = this[r];
        h !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[P("elementProperties")] = /* @__PURE__ */ new Map(), E[P("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: E }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, ot = (n) => n, D = N.trustedTypes, at = D ? D.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, mt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + y, Nt = `<${$t}>`, A = document, z = () => A.createComment(""), U = (n) => n === null || typeof n != "object" && typeof n != "function", K = Array.isArray, Mt = (n) => K(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, lt = />/g, v = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, _t = /^(?:script|style|textarea|title)$/i, zt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), $ = zt(1), S = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function yt(n, t) {
  if (!K(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return at !== void 0 ? at.createHTML(t) : t;
}
const Ut = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
  for (let h = 0; h < e; h++) {
    const a = n[h];
    let d, c, l = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, c = o.exec(a), c !== null); ) u = o.lastIndex, o === C ? c[1] === "!--" ? o = ht : c[1] !== void 0 ? o = lt : c[2] !== void 0 ? (_t.test(c[2]) && (s = RegExp("</" + c[2], "g")), o = v) : c[3] !== void 0 && (o = v) : o === v ? c[0] === ">" ? (o = s ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, d = c[1], o = c[3] === void 0 ? v : c[3] === '"' ? dt : ct) : o === dt || o === ct ? o = v : o === ht || o === lt ? o = C : (o = v, s = void 0);
    const m = o === v && n[h + 1].startsWith("/>") ? " " : "";
    r += o === C ? a + Nt : l >= 0 ? (i.push(d), a.slice(0, l) + mt + a.slice(l) + y + m) : a + y + (l === -2 ? h : m);
  }
  return [yt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const h = t.length - 1, a = this.parts, [d, c] = Ut(t, e);
    if (this.el = H.createElement(d, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = x.nextNode()) !== null && a.length < h; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(mt)) {
          const u = c[o++], m = s.getAttribute(l).split(y), g = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: r, name: g[2], strings: m, ctor: g[1] === "." ? Ot : g[1] === "?" ? Tt : g[1] === "@" ? Rt : L }), s.removeAttribute(l);
        } else l.startsWith(y) && (a.push({ type: 6, index: r }), s.removeAttribute(l));
        if (_t.test(s.tagName)) {
          const l = s.textContent.split(y), u = l.length - 1;
          if (u > 0) {
            s.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < u; m++) s.append(l[m], z()), x.nextNode(), a.push({ type: 2, index: ++r });
            s.append(l[u], z());
          }
        }
      } else if (s.nodeType === 8) if (s.data === $t) a.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(y, l + 1)) !== -1; ) a.push({ type: 7, index: r }), l += y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(n, t, e = n, i) {
  var o, h;
  if (t === S) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((h = s == null ? void 0 : s._$AO) == null || h.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(n, s._$AS(n, t.values), s, i)), t;
}
class Ht {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    x.currentNode = s;
    let r = x.nextNode(), o = 0, h = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new O(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new jt(r, this, t)), this._$AV.push(d), a = i[++h];
      }
      o !== (a == null ? void 0 : a.index) && (r = x.nextNode(), o++);
    }
    return x.currentNode = A, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class O {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), U(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Mt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const o = new Ht(s, this), h = o.u(this.options);
      o.p(e), this.T(h), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = pt.get(t.strings);
    return e === void 0 && pt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new O(this.O(z()), this.O(z()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ot(t).nextSibling;
      ot(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = k(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const h = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = k(this, h[i + a], e, a), d === S && (d = this._$AH[a]), o || (o = !U(d) || d !== this._$AH[a]), d === f ? t = f : t !== f && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class Tt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class Rt extends L {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? f) === S) return;
    const i = this._$AH, s = t === f && i !== f || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== f && (i === f || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class jt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Y = N.litHtmlPolyfillSupport;
Y == null || Y(H, O), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.2");
const Dt = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new O(t.insertBefore(z(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class M extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Dt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return S;
  }
}
var ut;
M._$litElement$ = !0, M.finalized = !0, (ut = w.litElementHydrateSupport) == null || ut.call(w, { LitElement: M });
const q = w.litElementPolyfillSupport;
q == null || q({ LitElement: M });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
class Lt extends M {
  static get properties() {
    return {
      hass: { attribute: !1 },
      _config: { state: !0 },
      _history: { state: !0 }
    };
  }
  constructor() {
    super(), this._history = {}, this._historyFetched = /* @__PURE__ */ new Set();
  }
  setConfig(t) {
    if (!t.entities)
      throw new Error('You must define "entities"');
    this._config = t;
  }
  updated(t) {
    var e;
    t.has("hass") && this.hass && ((e = this._config) != null && e.show_min_max) && this._fetchHistoryIfNeeded();
  }
  async _fetchHistoryIfNeeded() {
    if (!this.hass || !this._config.entities) return;
    const t = this._config.entities.map((s) => typeof s == "string" ? s : s.entity), e = /* @__PURE__ */ new Date();
    if (this._fetching) return;
    const i = t.filter((s) => !this._historyFetched.has(s));
    if (i.length !== 0) {
      this._fetching = !0;
      try {
        const s = e.toISOString(), r = new Date(e.getTime() - 24 * 60 * 60 * 1e3).toISOString(), o = i.join(","), h = await this.hass.callApi(
          "GET",
          `history/period/${r}?end_time=${s}&filter_entity_id=${o}&minimal_response`
        ), a = { ...this._history };
        Array.isArray(h) && h.forEach((d) => {
          if (d && d.length > 0) {
            const c = d[0].entity_id;
            let l = parseFloat(d[0].state), u = l;
            d.forEach((m) => {
              const g = parseFloat(m.state);
              isNaN(g) || (g < l && (l = g), g > u && (u = g));
            }), !isNaN(l) && !isNaN(u) && (a[c] = { min: l, max: u }, this._historyFetched.add(c));
          }
        }), this._history = a;
      } catch (s) {
        console.error("Error fetching history for linear-gauge-card:", s);
      } finally {
        this._fetching = !1;
      }
    }
  }
  static get styles() {
    return vt`
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
    `;
  }
  render() {
    if (!this._config || !this.hass)
      return $``;
    const t = this._config.title, e = this._config.layout || "horizontal", s = this._config.transparent_card_background || this._config.transparent || !1 ? "background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;" : "";
    return $`
      <ha-card style="${s}">
        ${t ? $`<div class="card-header">${t}</div>` : ""}
        <div class="entities-wrapper ${e}">
          ${this._config.entities.map((r) => this.renderEntity(r, e))}
        </div>
      </ha-card>
    `;
  }
  renderEntity(t, e) {
    const i = typeof t == "string" ? { entity: t } : t, s = i.entity, r = this.hass.states[s];
    if (!r)
      return $`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${s}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    const o = i.name || r.attributes.friendly_name || s, h = parseFloat(r.state), a = i.unit || r.attributes.unit_of_measurement || "", d = i.icon || r.attributes.icon, c = i.min ?? this._config.min ?? 0, l = i.max ?? this._config.max ?? 100;
    let u = 0;
    isNaN(h) || (u = (Math.max(c, Math.min(h, l)) - c) / (l - c) * 100);
    const m = this._computeColor(h, i, e);
    let g = !1;
    const T = i.pulse || this._config.pulse;
    if (T && typeof T == "object") {
      const p = parseFloat(T.value), _ = T.condition || "above";
      isNaN(p) || (_ === "above" && h >= p || _ === "below" && h <= p) && (g = !0);
    }
    if (!g) {
      const p = this._getSeverityMatch(h, i.severity || this._config.severity);
      p && p.pulse && (g = !0);
    }
    let I = "";
    e === "vertical" ? I = `height: ${u}%; background: ${m}; box-shadow: 0 0 10px ${m};` : I = `width: ${u}%; background: ${m}; box-shadow: 0 0 10px ${m};`;
    let Q = $``;
    if (i.target !== void 0) {
      let p = i.target;
      if (typeof p == "string" && isNaN(parseFloat(p))) {
        const _ = this.hass.states[p];
        _ && (p = parseFloat(_.state));
      }
      if (p = parseFloat(p), !isNaN(p)) {
        const R = (Math.max(c, Math.min(p, l)) - c) / (l - c) * 100, V = e === "vertical" ? `bottom: ${R}%` : `left: ${R}%`;
        Q = $`<div class="target-marker" style="${V}"></div>`;
      }
    }
    let tt = $``;
    if (this._config.show_min_max && this._history[s]) {
      const p = this._history[s].min, _ = this._history[s].max;
      if (p !== void 0 && _ !== void 0) {
        const R = Math.max(c, Math.min(p, l)), V = Math.max(c, Math.min(_, l)), F = (R - c) / (l - c) * 100, et = (V - c) / (l - c) * 100 - F;
        let B = "";
        e === "vertical" ? B = `bottom: ${F}%; height: ${et}%;` : B = `left: ${F}%; width: ${et}%;`, tt = $`<div class="min-max-range" style="${B}"></div>`;
      }
    }
    return $`
      <div class="gauge-container ${g ? "pulsing" : ""}" 
           @click=${(p) => this._handleAction(p, i, s)}>
        <div class="entity-row">
          <div class="entity-info-group">
            ${d ? $`<ha-icon class="entity-icon" .icon="${d}"></ha-icon>` : ""}
            <span class="entity-name" title="${o}">${o}</span>
          </div>
          <span class="entity-state">${isNaN(h) ? r.state : `${h} ${a}`}</span>
        </div>
        <div class="bar-bg">
          ${tt}
          <div class="bar-fill" style="${I}"></div>
          ${Q}
        </div>
      </div>
    `;
  }
  _handleAction(t, e, i) {
    t.stopPropagation();
    const s = e.tap_action || this._config.tap_action || { action: "more-info" }, r = s.action;
    if (r === "more-info") {
      const o = new CustomEvent("hass-more-info", {
        detail: { entityId: i },
        bubbles: !0,
        composed: !0
      });
      this.dispatchEvent(o);
    } else if (r === "toggle")
      this.hass.callService("homeassistant", "toggle", { entity_id: i });
    else if (r === "navigate" && s.navigation_path) {
      history.pushState(null, "", s.navigation_path);
      const o = new Event("location-changed", { bubbles: !0, composed: !0 });
      window.dispatchEvent(o);
    } else if (r === "url" && s.url_path)
      window.open(s.url_path);
    else if (r === "call-service" && s.service) {
      const [o, h] = s.service.split("."), a = { entity_id: i, ...s.data };
      this.hass.callService(o, h, a);
    }
  }
  _computeColor(t, e, i) {
    if (isNaN(t)) return "var(--primary-color, #44739e)";
    const s = (r) => `linear-gradient(${i === "vertical" ? "0deg" : "90deg"}, ${r.join(", ")})`;
    return e.color ? e.color : e.severity ? this._computeSeverity(t, e.severity) : this._config.severity ? this._computeSeverity(t, this._config.severity) : Array.isArray(this._config.colors) && this._config.colors.length > 0 ? s(this._config.colors) : this._config.color || "var(--primary-color, #03a9f4)";
  }
  _getSeverityMatch(t, e) {
    return Array.isArray(e) ? [...e].sort((s, r) => r.from - s.from).find((s) => t >= s.from) : null;
  }
  _computeSeverity(t, e) {
    const i = this._getSeverityMatch(t, e);
    return i ? i.color : "var(--primary-color)";
  }
}
customElements.define("linear-gauge-card", Lt);
