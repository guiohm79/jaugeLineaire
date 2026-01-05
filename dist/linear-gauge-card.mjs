/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, K = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = rt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && rt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xt = (n) => new mt(typeof n == "string" ? n : n + "", void 0, Q), wt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new mt(e, n, Q);
}, At = (n, t) => {
  if (K) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = L.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, nt = K ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return xt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Et, defineProperty: St, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Ct, getOwnPropertySymbols: Pt, getPrototypeOf: Nt } = Object, b = globalThis, ot = b.trustedTypes, Mt = ot ? ot.emptyScript : "", Y = b.reactiveElementPolyfillSupport, N = (n, t) => n, J = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Mt : null;
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
} }, $t = (n, t) => !Et(n, t), at = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = at) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && St(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = kt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const l = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? at;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, i = [...Ct(e), ...Pt(e)];
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
      for (const s of i) e.unshift(nt(s));
    } else t !== void 0 && e.push(nt(t));
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
    return At(t, this.constructor.elementStyles), t;
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
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : J).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : J;
      this._$Em = s;
      const d = a.fromAttribute(e, l.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (r = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? $t)(r, e) || i.useDefault && i.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
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
        const { wrapped: l } = o, a = this[r];
        l !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[N("elementProperties")] = /* @__PURE__ */ new Map(), E[N("finalized")] = /* @__PURE__ */ new Map(), Y == null || Y({ ReactiveElement: E }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, lt = (n) => n, I = M.trustedTypes, ht = I ? I.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, _t = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + y, zt = `<${yt}>`, A = document, U = () => A.createComment(""), H = (n) => n === null || typeof n != "object" && typeof n != "function", tt = Array.isArray, Ut = (n) => tt(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, v = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, bt = /^(?:script|style|textarea|title)$/i, Ht = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), $ = Ht(1), S = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function vt(n, t) {
  if (!tt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Ot = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let d, c, h = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, c = o.exec(a), c !== null); ) f = o.lastIndex, o === P ? c[1] === "!--" ? o = ct : c[1] !== void 0 ? o = dt : c[2] !== void 0 ? (bt.test(c[2]) && (s = RegExp("</" + c[2], "g")), o = v) : c[3] !== void 0 && (o = v) : o === v ? c[0] === ">" ? (o = s ?? P, h = -1) : c[1] === void 0 ? h = -2 : (h = o.lastIndex - c[2].length, d = c[1], o = c[3] === void 0 ? v : c[3] === '"' ? ut : pt) : o === ut || o === pt ? o = v : o === ct || o === dt ? o = P : (o = v, s = void 0);
    const m = o === v && n[l + 1].startsWith("/>") ? " " : "";
    r += o === P ? a + zt : h >= 0 ? (i.push(d), a.slice(0, h) + _t + a.slice(h) + y + m) : a + y + (h === -2 ? l : m);
  }
  return [vt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, c] = Ot(t, e);
    if (this.el = O.createElement(d, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = x.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(_t)) {
          const f = c[o++], m = s.getAttribute(h).split(y), g = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: r, name: g[2], strings: m, ctor: g[1] === "." ? Rt : g[1] === "?" ? Dt : g[1] === "@" ? jt : V }), s.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: r }), s.removeAttribute(h));
        if (bt.test(s.tagName)) {
          const h = s.textContent.split(y), f = h.length - 1;
          if (f > 0) {
            s.textContent = I ? I.emptyScript : "";
            for (let m = 0; m < f; m++) s.append(h[m], U()), x.nextNode(), a.push({ type: 2, index: ++r });
            s.append(h[f], U());
          }
        }
      } else if (s.nodeType === 8) if (s.data === yt) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += y.length - 1;
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
  var o, l;
  if (t === S) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = H(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(n, s._$AS(n, t.values), s, i)), t;
}
class Tt {
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
    let r = x.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new T(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Lt(r, this, t)), this._$AV.push(d), a = i[++l];
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
class T {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = k(this, t, e), H(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ut(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(vt(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const o = new Tt(s, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new T(this.O(U()), this.O(U()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = lt(t).nextSibling;
      lt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = k(this, t, e, 0), o = !H(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = k(this, l[i + a], e, a), d === S && (d = this._$AH[a]), o || (o = !H(d) || d !== this._$AH[a]), d === u ? t = u : t !== u && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Dt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class jt extends V {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? u) === S) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Lt {
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
const G = M.litHtmlPolyfillSupport;
G == null || G(O, T), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.2");
const It = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(U(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class z extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
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
var gt;
z._$litElement$ = !0, z.finalized = !0, (gt = w.litElementHydrateSupport) == null || gt.call(w, { LitElement: z });
const Z = w.litElementPolyfillSupport;
Z == null || Z({ LitElement: z });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
class Vt extends z {
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
        const s = e.toISOString(), r = new Date(e.getTime() - 24 * 60 * 60 * 1e3).toISOString(), o = i.join(","), l = await this.hass.callApi(
          "GET",
          `history/period/${r}?end_time=${s}&filter_entity_id=${o}&minimal_response`
        ), a = { ...this._history };
        Array.isArray(l) && l.forEach((d) => {
          if (d && d.length > 0) {
            const c = d[0].entity_id;
            let h = parseFloat(d[0].state), f = h;
            d.forEach((m) => {
              const g = parseFloat(m.state);
              isNaN(g) || (g < h && (h = g), g > f && (f = g));
            }), !isNaN(h) && !isNaN(f) && (a[c] = { min: h, max: f }, this._historyFetched.add(c));
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
    return wt`
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
    if (!this._config || !this.hass)
      return $``;
    const t = this._config.title, e = this._config.layout || "horizontal";
    return $`
      <ha-card>
        ${t ? $`<div class="card-header">${t}</div>` : ""}
        <div class="entities-wrapper ${e}">
          ${this._config.entities.map((i) => this.renderEntity(i, e))}
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
    const o = i.name || r.attributes.friendly_name || s, l = parseFloat(r.state), a = i.unit || r.attributes.unit_of_measurement || "", d = i.icon || r.attributes.icon, c = i.min ?? this._config.min ?? 0, h = i.max ?? this._config.max ?? 100, m = (i.effect || this._config.effect || "default") === "led" ? "effect-led" : "";
    let g = 0;
    isNaN(l) || (g = (Math.max(c, Math.min(l, h)) - c) / (h - c) * 100);
    const R = this._computeColor(l, i, e);
    let C = !1;
    const D = i.pulse || this._config.pulse;
    if (D && typeof D == "object") {
      const p = parseFloat(D.value), _ = D.condition || "above";
      isNaN(p) || (_ === "above" && l >= p || _ === "below" && l <= p) && (C = !0);
    }
    if (!C) {
      const p = this._getSeverityMatch(l, i.severity || this._config.severity);
      p && p.pulse && (C = !0);
    }
    let F = "";
    e === "vertical" ? F = `height: ${g}%; background: ${R}; box-shadow: 0 0 10px ${R};` : F = `width: ${g}%; background: ${R}; box-shadow: 0 0 10px ${R};`;
    let et = $``;
    if (i.target !== void 0) {
      let p = i.target;
      if (typeof p == "string" && isNaN(parseFloat(p))) {
        const _ = this.hass.states[p];
        _ && (p = parseFloat(_.state));
      }
      if (p = parseFloat(p), !isNaN(p)) {
        const j = (Math.max(c, Math.min(p, h)) - c) / (h - c) * 100, B = e === "vertical" ? `bottom: ${j}%` : `left: ${j}%`;
        et = $`<div class="target-marker" style="${B}"></div>`;
      }
    }
    let it = $``;
    if (this._config.show_min_max && this._history[s]) {
      const p = this._history[s].min, _ = this._history[s].max;
      if (p !== void 0 && _ !== void 0) {
        const j = Math.max(c, Math.min(p, h)), B = Math.max(c, Math.min(_, h)), W = (j - c) / (h - c) * 100, st = (B - c) / (h - c) * 100 - W;
        let X = "";
        e === "vertical" ? X = `bottom: ${W}%; height: ${st}%;` : X = `left: ${W}%; width: ${st}%;`, it = $`<div class="min-max-range" style="${X}"></div>`;
      }
    }
    return $`
      <div class="gauge-container ${C ? "pulsing" : ""}" 
           @click=${(p) => this._handleAction(p, i, s)}>
        <div class="entity-row">
          <div class="entity-info-group">
            ${d ? $`<ha-icon class="entity-icon" .icon="${d}"></ha-icon>` : ""}
            <span class="entity-name" title="${o}">${o}</span>
          </div>
          <span class="entity-state">${isNaN(l) ? r.state : `${l} ${a}`}</span>
        </div>
        <div class="bar-bg ${m}">
          ${it}
          <div class="bar-fill ${m}" style="${F}"></div>
          ${et}
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
      const [o, l] = s.service.split("."), a = { entity_id: i, ...s.data };
      this.hass.callService(o, l, a);
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
customElements.define("linear-gauge-card", Vt);
