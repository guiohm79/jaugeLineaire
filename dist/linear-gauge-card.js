/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, it = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), ht = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (it && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = ht.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ht.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Nt = (l) => new wt(typeof l == "string" ? l : l + "", void 0, st), xt = (l, ...t) => {
  const e = l.length === 1 ? l[0] : t.reduce((i, s, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + l[n + 1], l[0]);
  return new wt(e, l, st);
}, zt = (l, t) => {
  if (it) l.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = D.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, l.appendChild(i);
  }
}, dt = it ? (l) => l : (l) => l instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Nt(e);
})(l) : l;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pt, defineProperty: Lt, getOwnPropertyDescriptor: Ot, getOwnPropertyNames: Ht, getOwnPropertySymbols: Ut, getPrototypeOf: Tt } = Object, y = globalThis, pt = y.trustedTypes, Vt = pt ? pt.emptyScript : "", J = y.reactiveElementPolyfillSupport, L = (l, t) => l, et = { toAttribute(l, t) {
  switch (t) {
    case Boolean:
      l = l ? Vt : null;
      break;
    case Object:
    case Array:
      l = l == null ? l : JSON.stringify(l);
  }
  return l;
}, fromAttribute(l, t) {
  let e = l;
  switch (t) {
    case Boolean:
      e = l !== null;
      break;
    case Number:
      e = l === null ? null : Number(l);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(l);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ct = (l, t) => !Pt(l, t), gt = { attribute: !0, type: String, converter: et, reflect: !1, useDefault: !1, hasChanged: Ct };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = gt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Lt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: n } = Ot(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? gt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = Tt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const e = this.properties, i = [...Ht(e), ...Ut(e)];
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
      for (const s of i) e.unshift(dt(s));
    } else t !== void 0 && e.push(dt(t));
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
    return zt(t, this.constructor.elementStyles), t;
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
      const a = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : et).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, a;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : et;
      this._$Em = s;
      const h = c.fromAttribute(e, o.type);
      this[s] = h ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, n) {
    var a;
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? Ct)(n, e) || i.useDefault && i.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[L("elementProperties")] = /* @__PURE__ */ new Map(), k[L("finalized")] = /* @__PURE__ */ new Map(), J == null || J({ ReactiveElement: k }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, ft = (l) => l, B = O.trustedTypes, ut = B ? B.createPolicy("lit-html", { createHTML: (l) => l }) : void 0, At = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, Et = "?" + b, It = `<${Et}>`, E = document, H = () => E.createComment(""), U = (l) => l === null || typeof l != "object" && typeof l != "function", at = Array.isArray, Rt = (l) => at(l) || typeof (l == null ? void 0 : l[Symbol.iterator]) == "function", Q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vt = /-->/g, _t = />/g, x = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), mt = /'/g, $t = /"/g, kt = /^(?:script|style|textarea|title)$/i, jt = (l) => (t, ...e) => ({ _$litType$: l, strings: t, values: e }), p = jt(1), M = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), bt = /* @__PURE__ */ new WeakMap(), C = E.createTreeWalker(E, 129);
function St(l, t) {
  if (!at(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const Dt = (l, t) => {
  const e = l.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = P;
  for (let o = 0; o < e; o++) {
    const c = l[o];
    let h, r, d = -1, f = 0;
    for (; f < c.length && (a.lastIndex = f, r = a.exec(c), r !== null); ) f = a.lastIndex, a === P ? r[1] === "!--" ? a = vt : r[1] !== void 0 ? a = _t : r[2] !== void 0 ? (kt.test(r[2]) && (s = RegExp("</" + r[2], "g")), a = x) : r[3] !== void 0 && (a = x) : a === x ? r[0] === ">" ? (a = s ?? P, d = -1) : r[1] === void 0 ? d = -2 : (d = a.lastIndex - r[2].length, h = r[1], a = r[3] === void 0 ? x : r[3] === '"' ? $t : mt) : a === $t || a === mt ? a = x : a === vt || a === _t ? a = P : (a = x, s = void 0);
    const m = a === x && l[o + 1].startsWith("/>") ? " " : "";
    n += a === P ? c + It : d >= 0 ? (i.push(h), c.slice(0, d) + At + c.slice(d) + b + m) : c + b + (d === -2 ? o : m);
  }
  return [St(l, n + (l[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const o = t.length - 1, c = this.parts, [h, r] = Dt(t, e);
    if (this.el = T.createElement(h, i), C.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = C.nextNode()) !== null && c.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(At)) {
          const f = r[a++], m = s.getAttribute(d).split(b), v = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: n, name: v[2], strings: m, ctor: v[1] === "." ? Ft : v[1] === "?" ? Wt : v[1] === "@" ? Gt : F }), s.removeAttribute(d);
        } else d.startsWith(b) && (c.push({ type: 6, index: n }), s.removeAttribute(d));
        if (kt.test(s.tagName)) {
          const d = s.textContent.split(b), f = d.length - 1;
          if (f > 0) {
            s.textContent = B ? B.emptyScript : "";
            for (let m = 0; m < f; m++) s.append(d[m], H()), C.nextNode(), c.push({ type: 2, index: ++n });
            s.append(d[f], H());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Et) c.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(b, d + 1)) !== -1; ) c.push({ type: 7, index: n }), d += b.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function N(l, t, e = l, i) {
  var a, o;
  if (t === M) return t;
  let s = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), n === void 0 ? s = void 0 : (s = new n(l), s._$AT(l, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = N(l, s._$AS(l, t.values), s, i)), t;
}
class Bt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? E).importNode(e, !0);
    C.currentNode = s;
    let n = C.nextNode(), a = 0, o = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let h;
        c.type === 2 ? h = new V(n, n.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (h = new Zt(n, this, t)), this._$AV.push(h), c = i[++o];
      }
      a !== (c == null ? void 0 : c.index) && (n = C.nextNode(), a++);
    }
    return C.currentNode = E, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class V {
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
    t = N(this, t, e), U(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(St(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(e);
    else {
      const a = new Bt(s, this), o = a.u(this.options);
      a.p(e), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = bt.get(t.strings);
    return e === void 0 && bt.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t) s === e.length ? e.push(i = new V(this.O(H()), this.O(H()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ft(t).nextSibling;
      ft(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class F {
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
    if (n === void 0) t = N(this, t, e, 0), a = !U(t) || t !== this._$AH && t !== M, a && (this._$AH = t);
    else {
      const o = t;
      let c, h;
      for (t = n[0], c = 0; c < n.length - 1; c++) h = N(this, o[i + c], e, c), h === M && (h = this._$AH[c]), a || (a = !U(h) || h !== this._$AH[c]), h === u ? t = u : t !== u && (t += (h ?? "") + n[c + 1]), this._$AH[c] = h;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ft extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Wt extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Gt extends F {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? u) === M) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const K = O.litHtmlPolyfillSupport;
K == null || K(T, V), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.2");
const Xt = (l, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new V(t.insertBefore(H(), n), n, void 0, e ?? {});
  }
  return s._$AI(l), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class S extends k {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xt(e, this.renderRoot, this.renderOptions);
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
    return M;
  }
}
var yt;
S._$litElement$ = !0, S.finalized = !0, (yt = A.litElementHydrateSupport) == null || yt.call(A, { LitElement: S });
const tt = A.litElementPolyfillSupport;
tt == null || tt({ LitElement: S });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
const j = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Yt = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", qt = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", Jt = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
class Qt extends S {
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
        Array.isArray(o) && o.forEach((h) => {
          if (h && h.length > 0) {
            const r = h[0].entity_id;
            let d = parseFloat(h[0].state), f = d;
            h.forEach((m) => {
              const v = parseFloat(m.state);
              isNaN(v) || (v < d && (d = v), v > f && (f = v));
            }), !isNaN(d) && !isNaN(f) && (c[r] = { min: d, max: f }, this._historyFetched.add(r));
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
    return xt`
      :host {
        display: block;
      }
      
      ha-card {
        background: var(--lgc-card-background, var(--ha-card-background, var(--card-background-color, #fff)));
        color: var(--primary-text-color);
        padding: 16px;
        border-radius: var(--ha-card-border-radius, 12px);
        border: none;
        box-shadow: var(--ha-card-box-shadow, var(--shadow-elevation-2dp, none));
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      ha-card:hover {
        box-shadow: var(--ha-card-box-shadow, var(--shadow-elevation-4dp, var(--shadow-elevation-2dp, none)));
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
    `;
  }
  render() {
    if (!this._config || !this.hass)
      return p``;
    const t = this._config.title, e = this._config.layout || "horizontal", i = this._config.transparent_card_background || this._config.transparent || !1, s = this._config.bar_thickness || 12, n = this._config.vertical_height || 120, a = this._config.vertical_width || 16, o = this._config.card_background;
    let c = `
      --lgc-bar-thickness: ${s}px;
      --lgc-vertical-height: ${n}px;
      --lgc-vertical-width: ${a}px;
    `;
    return i ? c += "background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important;" : o && (c += `--lgc-card-background: ${o};`), p`
      <ha-card style="${c}">
        ${t ? p`<div class="card-header">${t}</div>` : ""}
        <div class="entities-wrapper ${e}">
          ${this._config.entities.map((h) => this.renderEntity(h, e))}
        </div>
      </ha-card>
    `;
  }
  renderEntity(t, e) {
    const i = typeof t == "string" ? { entity: t } : t, s = i.entity, n = this.hass.states[s];
    if (!n)
      return p`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${s}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    const a = i.name || n.attributes.friendly_name || s, o = parseFloat(n.state), c = i.unit || n.attributes.unit_of_measurement || "", h = i.icon || n.attributes.icon, r = i.min ?? this._config.min ?? 0, d = i.max ?? this._config.max ?? 100, m = (i.effect || this._config.effect || "default") === "led" ? "effect-led" : "";
    let v = 0, W = o;
    isNaN(o) || (W = Math.max(r, Math.min(o, d)), d !== r ? v = (W - r) / (d - r) * 100 : v = 0, v = Math.max(0, Math.min(100, v)));
    const nt = i.center_zero ?? this._config.center_zero ?? !1, $ = this._computeColor(o, i, e, nt);
    let z = !1;
    const I = i.pulse || this._config.pulse;
    if (I && typeof I == "object") {
      const g = parseFloat(I.value), _ = I.condition || "above";
      isNaN(g) || (_ === "above" && o >= g || _ === "below" && o <= g) && (z = !0);
    }
    if (!z) {
      const g = this._getSeverityMatch(o, i.severity || this._config.severity);
      g && g.pulse && (z = !0);
    }
    let w = "";
    if (nt && !isNaN(o) && r < 0 && d > 0) {
      const g = (0 - r) / (d - r) * 100, _ = (W - r) / (d - r) * 100;
      e === "vertical" ? o >= 0 ? w = `bottom: ${g}%; height: ${_ - g}%; background: ${$}; box-shadow: 0 0 10px ${$};` : w = `bottom: ${_}%; height: ${g - _}%; background: ${$}; box-shadow: 0 0 10px ${$};` : o >= 0 ? w = `left: ${g}%; width: ${_ - g}%; background: ${$}; box-shadow: 0 0 10px ${$};` : w = `left: ${_}%; width: ${g - _}%; background: ${$}; box-shadow: 0 0 10px ${$};`;
    } else e === "vertical" ? w = `height: ${v}%; background: ${$}; box-shadow: 0 0 10px ${$};` : w = `width: ${v}%; background: ${$}; box-shadow: 0 0 10px ${$};`;
    let ot = p``;
    if (i.target !== void 0) {
      let g = i.target;
      if (typeof g == "string" && isNaN(parseFloat(g))) {
        const _ = this.hass.states[g];
        _ && (g = parseFloat(_.state));
      }
      if (g = parseFloat(g), !isNaN(g) && d !== r) {
        const R = (Math.max(r, Math.min(g, d)) - r) / (d - r) * 100, X = e === "vertical" ? `bottom: ${R}%` : `left: ${R}%`;
        ot = p`<div class="target-marker" style="${X}"></div>`;
      }
    }
    let rt = p``;
    if (this._config.show_min_max && this._history[s]) {
      const g = this._history[s].min, _ = this._history[s].max;
      if (g !== void 0 && _ !== void 0 && d !== r) {
        const R = Math.max(r, Math.min(g, d)), X = Math.max(r, Math.min(_, d)), Y = (R - r) / (d - r) * 100, ct = (X - r) / (d - r) * 100 - Y;
        let q = "";
        e === "vertical" ? q = `bottom: ${Y}%; height: ${ct}%;` : q = `left: ${Y}%; width: ${ct}%;`, rt = p`<div class="min-max-range" style="${q}"></div>`;
      }
    }
    const G = i.compact_mode || this._config.compact_mode || !1, Z = i.show_value_in_bar || this._config.show_value_in_bar || !1, Mt = i.disable_shimmer || this._config.disable_shimmer || !1, lt = isNaN(o) ? n.state : `${o} ${c}`;
    return p`
      <div class="gauge-container ${z ? "pulsing" : ""} ${G ? "compact" : ""} ${Z ? "value-in-bar" : ""}" 
           @click=${(g) => this._handleAction(g, i, s)}>
        ${G ? p`
        <div class="entity-row compact">
          ${h ? p`<ha-icon class="entity-icon" .icon="${h}"></ha-icon>` : ""}
        </div>
        ` : p`
        <div class="entity-row">
          <div class="entity-info-group">
            ${h ? p`<ha-icon class="entity-icon" .icon="${h}"></ha-icon>` : ""}
            <span class="entity-name" title="${a}">${a}</span>
          </div>
          ${Z ? "" : p`<span class="entity-state">${lt}</span>`}
        </div>
        `}
        <div class="bar-bg ${m}">
          ${rt}
          <div class="bar-fill ${m} ${Mt ? "no-shimmer" : ""}" style="${w}"></div>
          ${ot}
          ${Z ? p`<span class="bar-value">${lt}</span>` : ""}
        </div>
        ${G && !h ? p`<span class="compact-label">${a}</span>` : ""}
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
      const [o, c] = s.service.split("."), h = { ...s.data };
      h.entity_id || (h.entity_id = a), this.hass.callService(o, c, h);
    }
  }
  _computeColor(t, e, i, s = !1) {
    if (isNaN(t)) return "var(--primary-color, #44739e)";
    if (s && t < 0) {
      if (e.color_negative) return e.color_negative;
      if (this._config.color_negative) return this._config.color_negative;
    }
    const n = s && t < 0 ? Math.abs(t) : t, a = (o) => {
      let c = i === "vertical" ? "0deg" : "90deg";
      return s && t < 0 && (c = i === "vertical" ? "180deg" : "270deg"), `linear-gradient(${c}, ${o.join(", ")})`;
    };
    if (e.severity) {
      const o = this._getSeverityMatch(n, e.severity);
      if (o) return o.color;
    }
    return e.color ? e.color : this._config.severity ? this._computeSeverity(n, this._config.severity) : this._config.color ? this._config.color : Array.isArray(this._config.colors) && this._config.colors.length > 0 ? a(this._config.colors) : "var(--primary-color, #03a9f4)";
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
class Kt extends S {
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
    return xt`
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
      return p``;
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
    return p`
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
                    ${s.map((n, a) => p`
                        <div style="position: relative;">
                             <input type="color" 
                                .value=${n} 
                                @input=${(o) => this._globalColorChanged(o, a)}
                                style="width: 40px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;"
                             >
                             <ha-icon-button
                                .path=${j}
                                style="position: absolute; top: -14px; right: -14px; color: grey; --mdc-icon-button-size: 24px;"
                                @click=${() => this._removeGlobalColor(a)}
                             ></ha-icon-button>
                        </div>
                    `)}
                    <ha-icon-button
                        .path=${Jt}
                        style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 40px; height: 40px;"
                        @click=${this._addGlobalColor}
                    ></ha-icon-button>
               </div>
               ${s.length === 0 ? p`<div style="font-size: 0.8em; opacity: 0.6; margin-top: 4px;">Use "+" to add colors. If empty, default blue is used.</div>` : ""}
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

        ${this._config.transparent ? "" : p`
        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Card Background Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Leave empty to use theme default</div>
            ${this._renderColorWithAlpha("card_background", this._config.card_background)}
          </div>
        </div>
        `}

        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Global Fixed Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Overrides gradient colors. Leave empty to use gradient.</div>
            ${this._renderColorWithAlpha("color", this._config.color)}
          </div>
        </div>

        <div class="row" style="align-items: flex-start;">
          <div style="flex: 1;">
            <div class="section-title">Global Negative Color (optional)</div>
            <div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px;">Used when Center Zero is active and value is negative. Leave empty to use symmetric colors.</div>
            ${this._renderColorWithAlpha("color_negative", this._config.color_negative)}
          </div>
        </div>

        <div class="row">
          <span>Compact Mode</span>
          <ha-switch
            .checked=${this._config.compact_mode || !1}
            .configValue=${"compact_mode"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Show Value in Bar</span>
          <ha-switch
            .checked=${this._config.show_value_in_bar || !1}
            .configValue=${"show_value_in_bar"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Disable Shimmer Effect</span>
          <ha-switch
            .checked=${this._config.disable_shimmer || !1}
            .configValue=${"disable_shimmer"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Center Zero</span>
          <ha-switch
            .checked=${this._config.center_zero || !1}
            .configValue=${"center_zero"}
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
    return p`
      <div class="entity-row">
        <div class="entity-header">
          <div style="flex: 1;">
              <ha-selector
                .hass=${this.hass}
                .selector=${i}
                .value=${s}
                @value-changed=${(h) => this._entityChanged(h, e, "entity")}
              ></ha-selector>
          </div>
          
           <ha-icon-button
            .path=${o ? qt : Yt}
            @click=${() => this._toggleExpand(e)}
          ></ha-icon-button>

          <ha-icon-button
            class="delete"
            .path=${j}
            @click=${() => this._removeEntity(e)}
          ></ha-icon-button>
        </div>

        ${o ? this._renderEntityDetails(c, e, n, a) : ""}
      </div>
    `;
  }
  _renderColorWithAlpha(t, e) {
    let i = "#ffffff", s = 1;
    if (e)
      if (e.startsWith("rgba")) {
        const a = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (a) {
          const o = parseInt(a[1]), c = parseInt(a[2]), h = parseInt(a[3]);
          s = a[4] !== void 0 ? parseFloat(a[4]) : 1, i = "#" + [o, c, h].map((r) => r.toString(16).padStart(2, "0")).join("");
        }
      } else if (e.startsWith("rgb")) {
        const a = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (a) {
          const o = parseInt(a[1]), c = parseInt(a[2]), h = parseInt(a[3]);
          i = "#" + [o, c, h].map((r) => r.toString(16).padStart(2, "0")).join("");
        }
      } else e.startsWith("#") && (i = e.substring(0, 7), e.length === 9 && (s = parseInt(e.substring(7, 9), 16) / 255));
    const n = Math.round(s * 100);
    return p`
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="position: relative; width: 50px; height: 40px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
            <!-- Checkerboard pattern for transparency preview -->
            <div style="position: absolute; inset: 0; background: 
              repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px;"></div>
            <!-- Color preview -->
            <div style="position: absolute; inset: 0; background: ${e || "transparent"};"></div>
            <input
              type="color"
              .value=${i}
              @input=${(a) => this._updateColorWithAlpha(a.target.value, s, t)}
              style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;"
            >
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 0.85em; opacity: 0.8;">Opacity: ${n}%</span>
              ${e ? p`
                <ha-icon-button
                  .path=${j}
                  style="color: var(--error-color); --mdc-icon-button-size: 32px;"
                  @click=${() => this._clearColorValue(t)}
                ></ha-icon-button>
              ` : ""}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              .value=${n}
              @input=${(a) => this._updateColorWithAlpha(i, parseInt(a.target.value) / 100, t)}
              style="width: 100%; height: 6px; cursor: pointer;"
            >
          </div>
        </div>
        <ha-textfield
          label="CSS Color"
          .value=${e || ""}
          .configValue=${t}
          @input=${this._valueChanged}
          style="width: 100%;"
        ></ha-textfield>
      </div>
    `;
  }
  _updateColorWithAlpha(t, e, i) {
    if (!this._config) return;
    const s = parseInt(t.substring(1, 3), 16), n = parseInt(t.substring(3, 5), 16), a = parseInt(t.substring(5, 7), 16);
    e = Math.round(e * 100) / 100;
    const o = e === 1 ? t : `rgba(${s}, ${n}, ${a}, ${e})`;
    this._config = {
      ...this._config,
      [i]: o
    }, this._fireChangedEvent();
  }
  _clearColorValue(t) {
    if (!this._config) return;
    const e = { ...this._config };
    delete e[t], this._config = e, this._fireChangedEvent();
  }
  _renderEntityDetails(t, e, i, s) {
    const n = t.pulse || {}, a = t.severity || [], o = t.tap_action || { action: "more-info" }, c = [
      { value: "more-info", label: "More Info" },
      { value: "toggle", label: "Toggle" },
      { value: "navigate", label: "Navigate" },
      { value: "url", label: "Open URL" },
      { value: "call-service", label: "Call Service" },
      { value: "none", label: "None" }
    ], h = [
      { value: "default", label: "Default" },
      { value: "led", label: "LED" }
    ];
    return p`
        <div class="entity-details">
            <div class="row">
                <ha-textfield
                    label="Name (optional)"
                    .value=${t.name || ""}
                    @input=${(r) => this._entityChanged(r, e, "name")}
                ></ha-textfield>
                <ha-textfield
                    label="Icon (e.g., mdi:thermometer)"
                    .value=${t.icon || ""}
                    @input=${(r) => this._entityChanged(r, e, "icon")}
                ></ha-textfield>
            </div>
            <div class="row">
                <ha-textfield
                    label="Min"
                    type="number"
                    .value=${t.min ?? ""}
                    placeholder=${this._config.min ?? 0}
                    @input=${(r) => this._entityChanged(r, e, "min")}
                ></ha-textfield>
                <ha-textfield
                    label="Max"
                    type="number"
                    .value=${t.max ?? ""}
                    placeholder=${this._config.max ?? 100}
                    @input=${(r) => this._entityChanged(r, e, "max")}
                ></ha-textfield>
                <ha-textfield
                    label="Target"
                    type="number"
                    .value=${t.target || ""}
                    @input=${(r) => this._entityChanged(r, e, "target")}
                ></ha-textfield>
            </div>
            <div class="row">
                <ha-selector
                    label="Effect"
                    .hass=${this.hass}
                    .selector=${{ select: { options: h } }}
                    .value=${t.effect || "default"}
                    @value-changed=${(r) => this._entityChanged(r, e, "effect")}
                ></ha-selector>
            </div>
            
            <div class="row">
                <span>Compact Mode</span>
                <ha-switch
                    .checked=${t.compact_mode || !1}
                    @change=${(r) => this._entityChanged(r, e, "compact_mode")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Show Value in Bar</span>
                <ha-switch
                    .checked=${t.show_value_in_bar || !1}
                    @change=${(r) => this._entityChanged(r, e, "show_value_in_bar")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Disable Shimmer Effect</span>
                <ha-switch
                    .checked=${t.disable_shimmer || !1}
                    @change=${(r) => this._entityChanged(r, e, "disable_shimmer")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Center Zero</span>
                <ha-switch
                    .checked=${t.center_zero || !1}
                    @change=${(r) => this._entityChanged(r, e, "center_zero")}
                ></ha-switch>
            </div>
            
            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Color (override global)</span>
                    <ha-switch
                      .checked=${s}
                      @change=${(r) => this._toggleEntityColor(r, e)}
                    ></ha-switch>
                 </div>
                 ${s ? p`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${i || "#03a9f4"}
                            @input=${(r) => this._entityChanged(r, e, "color")}
                            style="height: 40px; width: 100%; padding: 0; border: none; background: none; cursor: pointer;"
                         >
                    </div>
                 ` : ""}
            </div>

            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Negative Color (center zero)</span>
                    <ha-switch
                      .checked=${!!t.color_negative}
                      @change=${(r) => this._toggleEntityNegativeColor(r, e)}
                    ></ha-switch>
                 </div>
                 ${t.color_negative ? p`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${t.color_negative || "#f44336"}
                            @input=${(r) => this._entityChanged(r, e, "color_negative")}
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
                    @value-changed=${(r) => this._tapActionChanged(r, e, "action")}
                 ></ha-selector>
                 
                 <ha-selector
                    label="Target Entity (Optional)"
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${o.target_entity}
                    @value-changed=${(r) => this._tapActionChanged(r, e, "target_entity")}
                 ></ha-selector>

                 ${o.action === "navigate" ? p`
                    <ha-textfield
                        label="Navigation Path"
                        .value=${o.navigation_path || ""}
                        @input=${(r) => this._tapActionChanged(r, e, "navigation_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}

                 ${o.action === "url" ? p`
                    <ha-textfield
                        label="URL"
                        .value=${o.url_path || ""}
                        @input=${(r) => this._tapActionChanged(r, e, "url_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}
                 
                 ${o.action === "call-service" ? p`
                    <ha-textfield
                        label="Service (e.g., light.turn_on)"
                        .value=${o.service || ""}
                        @input=${(r) => this._tapActionChanged(r, e, "service")}
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
                        @input=${(r) => this._pulseChanged(r, e, "value")}
                    ></ha-textfield>
                    <ha-selector
                        label="Condition"
                        .hass=${this.hass}
                        .selector=${{ select: { options: [{ value: "above", label: "> Above" }, { value: "below", label: "< Below" }] } }}
                        .value=${n.condition || "above"}
                        @value-changed=${(r) => this._pulseChanged(r, e, "condition")}
                    ></ha-selector>
                </div>
            </div>

            <div>
                <div class="section-title">Severity (Local Gradient)</div>
                ${a.map((r, d) => p`
                    <div class="severity-row">
                        <ha-textfield
                             label="From"
                             type="number"
                             .value=${r.from ?? 0}
                             @input=${(f) => this._severityChanged(f, e, d, "from")}
                             style="width: 80px;"
                        ></ha-textfield>
                         <input
                            type="color"
                            .value=${r.color || "#00ff00"}
                            @input=${(f) => this._severityChanged(f, e, d, "color")}
                            style="flex: 1; height: 40px; border: none; background: none; cursor: pointer;"
                         >
                         <ha-icon-button
                            class="delete"
                            .path=${j}
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
  _colorValueChanged(t, e) {
    if (!this._config || !this.hass) return;
    const i = t.target.value;
    this._config = {
      ...this._config,
      [e]: i
    }, this._fireChangedEvent();
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
    t.detail && t.detail.value !== void 0 ? a = t.detail.value : a = t.target.value, t.target && t.target.tagName === "HA-SWITCH" && (a = t.target.checked), i === "target" && (a = parseFloat(a)), i === "min" || i === "max" ? a === "" || a === void 0 || a === null ? delete n[i] : (a = parseFloat(a), n[i] = a) : i === "effect" && a === "default" || (i === "compact_mode" || i === "show_value_in_bar" || i === "disable_shimmer" || i === "center_zero") && !a || i === "color_negative" && (!a || a === "") ? delete n[i] : n[i] = a, s[e] = n, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _toggleEntityColor(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? s.color = "#03a9f4" : delete s.color, i[e] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _toggleEntityNegativeColor(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? s.color_negative = "#f44336" : delete s.color_negative, i[e] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
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
    let a = { ...typeof n[e] == "string" ? { entity: n[e] } : n[e] }, o = [...a.severity || []], c = { ...o[i] }, h = t.target.value;
    c[s] = s === "from" ? parseFloat(h) : h, o[i] = c, a.severity = o, n[e] = a, this._config = { ...this._config, entities: n }, this._fireChangedEvent();
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
customElements.define("linear-gauge-card-editor", Kt);
customElements.define("linear-gauge-card", Qt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "linear-gauge-card",
  name: "Linear Gauge Card",
  description: "A linear gauge card for Home Assistant",
  preview: !0,
  documentationURL: "https://github.com/guiohm79/jaugeLineaire"
});
