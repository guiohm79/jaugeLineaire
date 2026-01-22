/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, Q = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), at = /* @__PURE__ */ new WeakMap();
let vt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Q && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = at.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && at.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const At = (r) => new vt(typeof r == "string" ? r : r + "", void 0, tt), mt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[n + 1], r[0]);
  return new vt(e, r, tt);
}, Et = (r, t) => {
  if (Q) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = I.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, rt = Q ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return At(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ct, defineProperty: St, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Nt, getOwnPropertySymbols: Mt, getPrototypeOf: Pt } = Object, y = globalThis, ot = y.trustedTypes, Ot = ot ? ot.emptyScript : "", X = y.reactiveElementPolyfillSupport, P = (r, t) => r, K = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Ot : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, $t = (r, t) => !Ct(r, t), lt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && St(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: n } = kt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: s, set(a) {
      const o = s == null ? void 0 : s.call(this);
      n == null || n.call(this, a), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Pt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...Nt(e), ...Mt(e)];
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
      for (const s of i) e.unshift(rt(s));
    } else t !== void 0 && e.push(rt(t));
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
    return Et(t, this.constructor.elementStyles), t;
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
    var n;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : K).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, a;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : K;
      this._$Em = s;
      const l = c.fromAttribute(e, o.type);
      this[s] = l ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, n) {
    var a;
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? $t)(n, e) || i.useDefault && i.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: n }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, a] of s) {
        const { wrapped: o } = a, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, a, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[P("elementProperties")] = /* @__PURE__ */ new Map(), E[P("finalized")] = /* @__PURE__ */ new Map(), X == null || X({ ReactiveElement: E }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, ct = (r) => r, j = O.trustedTypes, ht = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, yt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + $, zt = `<${bt}>`, A = document, z = () => A.createComment(""), H = (r) => r === null || typeof r != "object" && typeof r != "function", et = Array.isArray, Ht = (r) => et(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, pt = />/g, b = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, ut = /"/g, xt = /^(?:script|style|textarea|title)$/i, Lt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), g = Lt(1), S = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function wt(r, t) {
  if (!et(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Tt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = M;
  for (let o = 0; o < e; o++) {
    const c = r[o];
    let l, d, h = -1, f = 0;
    for (; f < c.length && (a.lastIndex = f, d = a.exec(c), d !== null); ) f = a.lastIndex, a === M ? d[1] === "!--" ? a = dt : d[1] !== void 0 ? a = pt : d[2] !== void 0 ? (xt.test(d[2]) && (s = RegExp("</" + d[2], "g")), a = b) : d[3] !== void 0 && (a = b) : a === b ? d[0] === ">" ? (a = s ?? M, h = -1) : d[1] === void 0 ? h = -2 : (h = a.lastIndex - d[2].length, l = d[1], a = d[3] === void 0 ? b : d[3] === '"' ? ut : gt) : a === ut || a === gt ? a = b : a === dt || a === pt ? a = M : (a = b, s = void 0);
    const v = a === b && r[o + 1].startsWith("/>") ? " " : "";
    n += a === M ? c + zt : h >= 0 ? (i.push(l), c.slice(0, h) + yt + c.slice(h) + $ + v) : c + $ + (h === -2 ? o : v);
  }
  return [wt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class L {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const o = t.length - 1, c = this.parts, [l, d] = Tt(t, e);
    if (this.el = L.createElement(l, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = x.nextNode()) !== null && c.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(yt)) {
          const f = d[a++], v = s.getAttribute(h).split($), _ = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: n, name: _[2], strings: v, ctor: _[1] === "." ? Vt : _[1] === "?" ? Rt : _[1] === "@" ? It : D }), s.removeAttribute(h);
        } else h.startsWith($) && (c.push({ type: 6, index: n }), s.removeAttribute(h));
        if (xt.test(s.tagName)) {
          const h = s.textContent.split($), f = h.length - 1;
          if (f > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let v = 0; v < f; v++) s.append(h[v], z()), x.nextNode(), c.push({ type: 2, index: ++n });
            s.append(h[f], z());
          }
        }
      } else if (s.nodeType === 8) if (s.data === bt) c.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf($, h + 1)) !== -1; ) c.push({ type: 7, index: n }), h += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(r, t, e = r, i) {
  var a, o;
  if (t === S) return t;
  let s = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const n = H(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), n === void 0 ? s = void 0 : (s = new n(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(r, s._$AS(r, t.values), s, i)), t;
}
class Ut {
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
    let n = x.nextNode(), a = 0, o = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let l;
        c.type === 2 ? l = new T(n, n.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (l = new jt(n, this, t)), this._$AV.push(l), c = i[++o];
      }
      a !== (c == null ? void 0 : c.index) && (n = x.nextNode(), a++);
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
    t = k(this, t, e), H(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ht(t) ? this.k(t) : this._(t);
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
    var n;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = L.createElement(wt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(e);
    else {
      const a = new Ut(s, this), o = a.u(this.options);
      a.p(e), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new L(t)), e;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t) s === e.length ? e.push(i = new T(this.O(z()), this.O(z()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ct(t).nextSibling;
      ct(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = k(this, t, e, 0), a = !H(t) || t !== this._$AH && t !== S, a && (this._$AH = t);
    else {
      const o = t;
      let c, l;
      for (t = n[0], c = 0; c < n.length - 1; c++) l = k(this, o[i + c], e, c), l === S && (l = this._$AH[c]), a || (a = !H(l) || l !== this._$AH[c]), l === u ? t = u : t !== u && (t += (l ?? "") + n[c + 1]), this._$AH[c] = l;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Vt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Rt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class It extends D {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? u) === S) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
const q = O.litHtmlPolyfillSupport;
q == null || q(L, T), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.2");
const Dt = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(z(), n), n, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class C extends E {
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
var _t;
C._$litElement$ = !0, C.finalized = !0, (_t = w.litElementHydrateSupport) == null || _t.call(w, { LitElement: C });
const Z = w.litElementPolyfillSupport;
Z == null || Z({ LitElement: C });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
const J = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Ft = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Bt = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", Gt = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
class Wt extends C {
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
        const s = e.toISOString(), n = new Date(e.getTime() - 24 * 60 * 60 * 1e3).toISOString(), a = i.join(","), o = await this.hass.callApi(
          "GET",
          `history/period/${n}?end_time=${s}&filter_entity_id=${a}&minimal_response`
        ), c = { ...this._history };
        Array.isArray(o) && o.forEach((l) => {
          if (l && l.length > 0) {
            const d = l[0].entity_id;
            let h = parseFloat(l[0].state), f = h;
            l.forEach((v) => {
              const _ = parseFloat(v.state);
              isNaN(_) || (_ < h && (h = _), _ > f && (f = _));
            }), !isNaN(h) && !isNaN(f) && (c[d] = { min: h, max: f }, this._historyFetched.add(d));
          }
        }), this._history = c;
      } catch (s) {
        console.error("Error fetching history for linear-gauge-card:", s);
      } finally {
        this._fetching = !1;
      }
    }
  }
  static get styles() {
    return mt`
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
    if (!this._config || !this.hass)
      return g``;
    const t = this._config.title, e = this._config.layout || "horizontal", i = this._config.transparent_card_background || this._config.transparent || !1, s = this._config.bar_thickness || 12, n = this._config.vertical_height || 120, a = this._config.vertical_width || 16, o = `
      --lgc-bar-thickness: ${s}px;
      --lgc-vertical-height: ${n}px;
      --lgc-vertical-width: ${a}px;
      ${i ? "background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;" : ""}
    `;
    return g`
      <ha-card style="${o}">
        ${t ? g`<div class="card-header">${t}</div>` : ""}
        <div class="entities-wrapper ${e}">
          ${this._config.entities.map((c) => this.renderEntity(c, e))}
        </div>
      </ha-card>
    `;
  }
  renderEntity(t, e) {
    const i = typeof t == "string" ? { entity: t } : t, s = i.entity, n = this.hass.states[s];
    if (!n)
      return g`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${s}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    const a = i.name || n.attributes.friendly_name || s, o = parseFloat(n.state), c = i.unit || n.attributes.unit_of_measurement || "", l = i.icon || n.attributes.icon, d = i.min ?? this._config.min ?? 0, h = i.max ?? this._config.max ?? 100, v = (i.effect || this._config.effect || "default") === "led" ? "effect-led" : "";
    let _ = 0;
    isNaN(o) || (_ = (Math.max(d, Math.min(o, h)) - d) / (h - d) * 100);
    const U = this._computeColor(o, i, e);
    let N = !1;
    const V = i.pulse || this._config.pulse;
    if (V && typeof V == "object") {
      const p = parseFloat(V.value), m = V.condition || "above";
      isNaN(p) || (m === "above" && o >= p || m === "below" && o <= p) && (N = !0);
    }
    if (!N) {
      const p = this._getSeverityMatch(o, i.severity || this._config.severity);
      p && p.pulse && (N = !0);
    }
    let F = "";
    e === "vertical" ? F = `height: ${_}%; background: ${U}; box-shadow: 0 0 10px ${U};` : F = `width: ${_}%; background: ${U}; box-shadow: 0 0 10px ${U};`;
    let it = g``;
    if (i.target !== void 0) {
      let p = i.target;
      if (typeof p == "string" && isNaN(parseFloat(p))) {
        const m = this.hass.states[p];
        m && (p = parseFloat(m.state));
      }
      if (p = parseFloat(p), !isNaN(p)) {
        const R = (Math.max(d, Math.min(p, h)) - d) / (h - d) * 100, B = e === "vertical" ? `bottom: ${R}%` : `left: ${R}%`;
        it = g`<div class="target-marker" style="${B}"></div>`;
      }
    }
    let st = g``;
    if (this._config.show_min_max && this._history[s]) {
      const p = this._history[s].min, m = this._history[s].max;
      if (p !== void 0 && m !== void 0) {
        const R = Math.max(d, Math.min(p, h)), B = Math.max(d, Math.min(m, h)), G = (R - d) / (h - d) * 100, nt = (B - d) / (h - d) * 100 - G;
        let W = "";
        e === "vertical" ? W = `bottom: ${G}%; height: ${nt}%;` : W = `left: ${G}%; width: ${nt}%;`, st = g`<div class="min-max-range" style="${W}"></div>`;
      }
    }
    return g`
      <div class="gauge-container ${N ? "pulsing" : ""}" 
           @click=${(p) => this._handleAction(p, i, s)}>
        <div class="entity-row">
          <div class="entity-info-group">
            ${l ? g`<ha-icon class="entity-icon" .icon="${l}"></ha-icon>` : ""}
            <span class="entity-name" title="${a}">${a}</span>
          </div>
          <span class="entity-state">${isNaN(o) ? n.state : `${o} ${c}`}</span>
        </div>
        <div class="bar-bg ${v}">
          ${st}
          <div class="bar-fill ${v}" style="${F}"></div>
          ${it}
        </div>
      </div>
    `;
  }
  _handleAction(t, e, i) {
    if (e.tap_action && e.tap_action.action === "none")
      return;
    t.stopPropagation();
    const s = e.tap_action || this._config.tap_action || { action: "more-info" }, n = s.action, a = s.target_entity || i;
    if (n === "more-info") {
      const o = new CustomEvent("hass-more-info", {
        detail: { entityId: a },
        bubbles: !0,
        composed: !0
      });
      this.dispatchEvent(o);
    } else if (n === "toggle")
      this.hass.callService("homeassistant", "toggle", { entity_id: a });
    else if (n === "navigate" && s.navigation_path) {
      history.pushState(null, "", s.navigation_path);
      const o = new Event("location-changed", { bubbles: !0, composed: !0 });
      window.dispatchEvent(o);
    } else if (n === "url" && s.url_path)
      window.open(s.url_path);
    else if (n === "call-service" && s.service) {
      const [o, c] = s.service.split("."), l = { ...s.data };
      l.entity_id || (l.entity_id = a), this.hass.callService(o, c, l);
    }
  }
  _computeColor(t, e, i) {
    if (isNaN(t)) return "var(--primary-color, #44739e)";
    const s = (n) => `linear-gradient(${i === "vertical" ? "0deg" : "90deg"}, ${n.join(", ")})`;
    if (e.severity) {
      const n = this._getSeverityMatch(t, e.severity);
      if (n) return n.color;
    }
    return e.color ? e.color : this._config.severity ? this._computeSeverity(t, this._config.severity) : Array.isArray(this._config.colors) && this._config.colors.length > 0 ? s(this._config.colors) : this._config.color || "var(--primary-color, #03a9f4)";
  }
  _getSeverityMatch(t, e) {
    if (!Array.isArray(e)) return null;
    const i = parseFloat(t);
    return [...e].sort((n, a) => parseFloat(a.from) - parseFloat(n.from)).find((n) => i >= parseFloat(n.from));
  }
  static getConfigElement() {
    return document.createElement("linear-gauge-card-editor");
  }
  static getStubConfig() {
    return {
      title: "My Gauge",
      layout: "horizontal",
      min: 0,
      max: 100,
      entities: [{ entity: "sensor.example" }]
    };
  }
  _computeSeverity(t, e) {
    const i = this._getSeverityMatch(t, e);
    return i ? i.color : "var(--primary-color)";
  }
}
class Xt extends C {
  static get properties() {
    return {
      hass: { attribute: !1 },
      _config: { state: !0 },
      _expandedEntities: { state: !0 }
    };
  }
  constructor() {
    super(), this._expandedEntities = /* @__PURE__ */ new Set();
  }
  setConfig(t) {
    this._config = t;
  }
  static get styles() {
    return mt`
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
    if (!this.hass || !this._config)
      return g``;
    const t = {
      select: {
        options: [
          { value: "horizontal", label: "Horizontal" },
          { value: "vertical", label: "Vertical" }
        ]
      }
    }, e = {
      select: {
        options: [
          { value: "default", label: "Default" },
          { value: "led", label: "LED" }
        ]
      }
    }, i = { entity: { domain: "sensor" } }, s = this._config.colors || [];
    return g`
      <div class="card-config">
        
        <ha-textfield
          label="Title"
          .value=${this._config.title || ""}
          .configValue=${"title"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <div class="row">
          <ha-selector
            label="Layout"
            .hass=${this.hass}
            .selector=${t}
            .value=${this._config.layout || "horizontal"}
            .configValue=${"layout"}
            @value-changed=${this._valueChanged}
          ></ha-selector>

          <ha-selector
            label="Effect"
            .hass=${this.hass}
            .selector=${e}
            .value=${this._config.effect || "default"}
            .configValue=${"effect"}
            @value-changed=${this._valueChanged}
          ></ha-selector>
        </div>

        <div class="row">
           <ha-textfield
             label="Min"
             type="number"
             .value=${this._config.min ?? 0}
             .configValue=${"min"}
             @input=${this._valueChanged}
           ></ha-textfield>
           
           <ha-textfield
             label="Max"
             type="number"
             .value=${this._config.max ?? 100}
             .configValue=${"max"}
             @input=${this._valueChanged}
           ></ha-textfield>
        </div>

        <div class="row">
           <ha-textfield
             label="Bar Thickness (px)"
             type="number"
             .value=${this._config.bar_thickness ?? 12}
             .configValue=${"bar_thickness"}
             @input=${this._valueChanged}
           ></ha-textfield>
           
           <ha-textfield
             label="Vertical Height (px)"
             type="number"
             .value=${this._config.vertical_height ?? 120}
             .configValue=${"vertical_height"}
             @input=${this._valueChanged}
           ></ha-textfield>

           <ha-textfield
             label="Vertical Width (px)"
             type="number"
             .value=${this._config.vertical_width ?? 16}
             .configValue=${"vertical_width"}
             @input=${this._valueChanged}
           ></ha-textfield>
        </div>
        
        <div class="row">
           <div style="flex: 1;">
               <div class="section-title">Gradient Colors (Global)</div>
               <div class="colors-list">
                    ${s.map((n, a) => g`
                        <div style="position: relative;">
                             <input type="color" 
                                .value=${n} 
                                @input=${(o) => this._globalColorChanged(o, a)}
                                style="width: 40px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;"
                             >
                             <ha-icon-button
                                .path=${J}
                                style="position: absolute; top: -14px; right: -14px; color: grey; --mdc-icon-button-size: 24px;"
                                @click=${() => this._removeGlobalColor(a)}
                             ></ha-icon-button>
                        </div>
                    `)}
                    <ha-icon-button
                        .path=${Gt}
                        style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 40px; height: 40px;"
                        @click=${this._addGlobalColor}
                    ></ha-icon-button>
               </div>
               ${s.length === 0 ? g`<div style="font-size: 0.8em; opacity: 0.6; margin-top: 4px;">Use "+" to add colors. If empty, default blue is used.</div>` : ""}
           </div>
        </div>

        <div class="row">
          <span>Show Min/Max (History)</span>
          <ha-switch
            .checked=${this._config.show_min_max || !1}
            .configValue=${"show_min_max"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Transparent Background</span>
          <ha-switch
            .checked=${this._config.transparent || !1}
            .configValue=${"transparent"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="entities-section">
          <h3>Entities</h3>
          <div class="entities-list">
            ${(this._config.entities || []).map((n, a) => this._renderEntityRow(n, a, i))}
          </div>
          <mwc-button class="add-button" outlined @click=${this._addEntity}>
            Add Entity
          </mwc-button>
        </div>

      </div>
    `;
  }
  _renderEntityRow(t, e, i) {
    const s = typeof t == "string" ? t : t.entity, n = typeof t == "object" ? t.color : void 0, a = typeof n == "string" && n !== "", o = this._expandedEntities.has(e), c = typeof t == "object" ? t : { entity: t };
    return g`
      <div class="entity-row">
        <div class="entity-header">
          <div style="flex: 1;">
              <ha-selector
                .hass=${this.hass}
                .selector=${i}
                .value=${s}
                @value-changed=${(l) => this._entityChanged(l, e, "entity")}
              ></ha-selector>
          </div>
          
           <ha-icon-button
            .path=${o ? Bt : Ft}
            @click=${() => this._toggleExpand(e)}
          ></ha-icon-button>

          <ha-icon-button
            class="delete"
            .path=${J}
            @click=${() => this._removeEntity(e)}
          ></ha-icon-button>
        </div>

        ${o ? this._renderEntityDetails(c, e, n, a) : ""}
      </div>
    `;
  }
  _renderEntityDetails(t, e, i, s) {
    const n = t.pulse || {}, a = t.severity || [], o = t.tap_action || { action: "more-info" }, c = [
      { value: "more-info", label: "More Info" },
      { value: "toggle", label: "Toggle" },
      { value: "navigate", label: "Navigate" },
      { value: "url", label: "Open URL" },
      { value: "call-service", label: "Call Service" },
      { value: "none", label: "None" }
    ];
    return g`
        <div class="entity-details">
            <div class="row">
                <ha-textfield
                    label="Name (optional)"
                    .value=${t.name || ""}
                    @input=${(l) => this._entityChanged(l, e, "name")}
                ></ha-textfield>
                <ha-textfield
                    label="Target"
                    type="number"
                    .value=${t.target || ""}
                    @input=${(l) => this._entityChanged(l, e, "target")}
                ></ha-textfield>
            </div>
            
            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Color (override global)</span>
                    <ha-switch
                      .checked=${s}
                      @change=${(l) => this._toggleEntityColor(l, e)}
                    ></ha-switch>
                 </div>
                 ${s ? g`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${i || "#03a9f4"}
                            @input=${(l) => this._entityChanged(l, e, "color")}
                            style="height: 40px; width: 100%; padding: 0; border: none; background: none; cursor: pointer;"
                         >
                    </div>
                 ` : ""}
            </div>

            <div>
                 <div class="section-title">Tap Action</div>
                 <ha-selector
                    .hass=${this.hass}
                    .selector=${{ select: { options: c } }}
                    .value=${o.action}
                    @value-changed=${(l) => this._tapActionChanged(l, e, "action")}
                 ></ha-selector>
                 
                 <ha-selector
                    label="Target Entity (Optional)"
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${o.target_entity}
                    @value-changed=${(l) => this._tapActionChanged(l, e, "target_entity")}
                 ></ha-selector>

                 ${o.action === "navigate" ? g`
                    <ha-textfield
                        label="Navigation Path"
                        .value=${o.navigation_path || ""}
                        @input=${(l) => this._tapActionChanged(l, e, "navigation_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}

                 ${o.action === "url" ? g`
                    <ha-textfield
                        label="URL"
                        .value=${o.url_path || ""}
                        @input=${(l) => this._tapActionChanged(l, e, "url_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}
                 
                 ${o.action === "call-service" ? g`
                    <ha-textfield
                        label="Service (e.g., light.turn_on)"
                        .value=${o.service || ""}
                        @input=${(l) => this._tapActionChanged(l, e, "service")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}
            </div>

            <div>
                <div class="section-title">Pulse (Animation)</div>
                <div class="row">
                     <ha-textfield
                        label="Threshold"
                        type="number"
                        .value=${n.value || ""}
                        @input=${(l) => this._pulseChanged(l, e, "value")}
                    ></ha-textfield>
                    <ha-selector
                        label="Condition"
                        .hass=${this.hass}
                        .selector=${{ select: { options: [{ value: "above", label: "> Above" }, { value: "below", label: "< Below" }] } }}
                        .value=${n.condition || "above"}
                        @value-changed=${(l) => this._pulseChanged(l, e, "condition")}
                    ></ha-selector>
                </div>
            </div>

            <div>
                <div class="section-title">Severity (Local Gradient)</div>
                ${a.map((l, d) => g`
                    <div class="severity-row">
                        <ha-textfield
                             label="From"
                             type="number"
                             .value=${l.from ?? 0}
                             @input=${(h) => this._severityChanged(h, e, d, "from")}
                             style="width: 80px;"
                        ></ha-textfield>
                         <input
                            type="color"
                            .value=${l.color || "#00ff00"}
                            @input=${(h) => this._severityChanged(h, e, d, "color")}
                            style="flex: 1; height: 40px; border: none; background: none; cursor: pointer;"
                         >
                         <ha-icon-button
                            class="delete"
                            .path=${J}
                            @click=${() => this._removeSeverityBand(e, d)}
                         ></ha-icon-button>
                    </div>
                `)}
                <mwc-button outlined @click=${() => this._addSeverityBand(e)}>
                    <ha-icon .icon="mdi:plus" style="margin-right: 8px;"></ha-icon> Add Band
                </mwc-button>
            </div>

        </div>
      `;
  }
  _valueChanged(t) {
    if (!this._config || !this.hass) return;
    const e = t.target;
    let i = e.value, s = e.configValue;
    t.detail && t.detail.value !== void 0 && (i = t.detail.value), e.tagName === "HA-SWITCH" && (i = e.checked), !s && e.configValue && (s = e.configValue), (s === "min" || s === "max" || s === "bar_thickness" || s === "vertical_height" || s === "vertical_width") && (i = parseFloat(i)), s && (this._config = {
      ...this._config,
      [s]: i
    }, this._fireChangedEvent());
  }
  _globalColorChanged(t, e) {
    const i = [...this._config.colors || []];
    i[e] = t.target.value, this._config = { ...this._config, colors: i }, this._fireChangedEvent();
  }
  _addGlobalColor() {
    const t = [...this._config.colors || []];
    t.push("#ffeb3b"), this._config = { ...this._config, colors: t }, this._fireChangedEvent();
  }
  _removeGlobalColor(t) {
    const e = [...this._config.colors || []];
    e.splice(t, 1), this._config = { ...this._config, colors: e }, this._fireChangedEvent();
  }
  _entityChanged(t, e, i) {
    const s = [...this._config.entities || []];
    let n = s[e];
    typeof n == "string" ? n = { entity: n } : n = { ...n };
    let a;
    t.detail && t.detail.value !== void 0 ? a = t.detail.value : a = t.target.value, i === "target" && (a = parseFloat(a)), n[i] = a, s[e] = n, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _toggleEntityColor(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? s.color = "#03a9f4" : delete s.color, i[e] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _tapActionChanged(t, e, i) {
    const s = [...this._config.entities || []];
    let n = { ...typeof s[e] == "string" ? { entity: s[e] } : s[e] }, a = { ...n.tap_action || { action: "more-info" } }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, a[i] = o, n.tap_action = a, s[e] = n, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _pulseChanged(t, e, i) {
    const s = [...this._config.entities || []];
    let n = { ...typeof s[e] == "string" ? { entity: s[e] } : s[e] }, a = { ...n.pulse || {} }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, a[i] = i === "value" ? parseFloat(o) : o, n.pulse = a, s[e] = n, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _severityChanged(t, e, i, s) {
    const n = [...this._config.entities || []];
    let a = { ...typeof n[e] == "string" ? { entity: n[e] } : n[e] }, o = [...a.severity || []], c = { ...o[i] }, l = t.target.value;
    c[s] = s === "from" ? parseFloat(l) : l, o[i] = c, a.severity = o, n[e] = a, this._config = { ...this._config, entities: n }, this._fireChangedEvent();
  }
  _addSeverityBand(t) {
    const e = [...this._config.entities || []];
    let i = { ...typeof e[t] == "string" ? { entity: e[t] } : e[t] }, s = [...i.severity || []];
    s.push({ from: 0, color: "#00ff00" }), i.severity = s, e[t] = i, this._config = { ...this._config, entities: e }, this._fireChangedEvent();
  }
  _removeSeverityBand(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[t] == "string" ? { entity: i[t] } : i[t] }, n = [...s.severity || []];
    n.splice(e, 1), s.severity = n, i[t] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _addEntity() {
    const t = [...this._config.entities || []];
    t.push({ entity: "", color: "" }), this._config = { ...this._config, entities: t }, this._fireChangedEvent();
  }
  _removeEntity(t) {
    const e = [...this._config.entities || []];
    e.splice(t, 1), this._config = { ...this._config, entities: e }, this._fireChangedEvent();
  }
  _toggleExpand(t) {
    const e = new Set(this._expandedEntities);
    e.has(t) ? e.delete(t) : e.add(t), this._expandedEntities = e, this.requestUpdate();
  }
  _fireChangedEvent() {
    const t = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(t);
  }
}
customElements.define("linear-gauge-card-editor", Xt);
customElements.define("linear-gauge-card", Wt);
