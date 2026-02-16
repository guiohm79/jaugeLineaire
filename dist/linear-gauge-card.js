/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, et = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== it) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (et && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = lt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && lt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (r) => new bt(typeof r == "string" ? r : r + "", void 0, it), yt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, a) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[a + 1], r[0]);
  return new bt(e, r, it);
}, Mt = (r, t) => {
  if (et) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = j.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, ct = et ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return kt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Nt, defineProperty: Pt, getOwnPropertyDescriptor: zt, getOwnPropertyNames: Ot, getOwnPropertySymbols: Lt, getPrototypeOf: Ht } = Object, b = globalThis, ht = b.trustedTypes, Tt = ht ? ht.emptyScript : "", Z = b.reactiveElementPolyfillSupport, P = (r, t) => r, tt = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Tt : null;
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
} }, xt = (r, t) => !Nt(r, t), dt = { attribute: !0, type: String, converter: tt, reflect: !1, useDefault: !1, hasChanged: xt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = dt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Pt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const o = s == null ? void 0 : s.call(this);
      a == null || a.call(this, n), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ht(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...Ot(e), ...Lt(e)];
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
      for (const s of i) e.unshift(ct(s));
    } else t !== void 0 && e.push(ct(t));
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
    return Mt(t, this.constructor.elementStyles), t;
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
    var a;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : tt).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, n;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((a = o.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? o.converter : tt;
      this._$Em = s;
      const h = c.fromAttribute(e, o.type);
      this[s] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    var n;
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? xt)(a, e) || i.useDefault && i.reflect && a === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, n] of s) {
        const { wrapped: o } = n, c = this[a];
        o !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var a;
        return (a = s.hostUpdate) == null ? void 0 : a.call(s);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[P("elementProperties")] = /* @__PURE__ */ new Map(), C[P("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: C }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, pt = (r) => r, D = z.trustedTypes, gt = D ? D.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, wt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + $, Ut = `<${At}>`, A = document, O = () => A.createComment(""), L = (r) => r === null || typeof r != "object" && typeof r != "function", st = Array.isArray, Vt = (r) => st(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ft = /-->/g, ut = />/g, y = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, mt = /"/g, Ct = /^(?:script|style|textarea|title)$/i, It = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), p = It(1), S = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function Et(r, t) {
  if (!st(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(t) : t;
}
const Rt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = N;
  for (let o = 0; o < e; o++) {
    const c = r[o];
    let h, l, d = -1, f = 0;
    for (; f < c.length && (n.lastIndex = f, l = n.exec(c), l !== null); ) f = n.lastIndex, n === N ? l[1] === "!--" ? n = ft : l[1] !== void 0 ? n = ut : l[2] !== void 0 ? (Ct.test(l[2]) && (s = RegExp("</" + l[2], "g")), n = y) : l[3] !== void 0 && (n = y) : n === y ? l[0] === ">" ? (n = s ?? N, d = -1) : l[1] === void 0 ? d = -2 : (d = n.lastIndex - l[2].length, h = l[1], n = l[3] === void 0 ? y : l[3] === '"' ? mt : vt) : n === mt || n === vt ? n = y : n === ft || n === ut ? n = N : (n = y, s = void 0);
    const m = n === y && r[o + 1].startsWith("/>") ? " " : "";
    a += n === N ? c + Ut : d >= 0 ? (i.push(h), c.slice(0, d) + wt + c.slice(d) + $ + m) : c + $ + (d === -2 ? o : m);
  }
  return [Et(r, a + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, n = 0;
    const o = t.length - 1, c = this.parts, [h, l] = Rt(t, e);
    if (this.el = H.createElement(h, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = x.nextNode()) !== null && c.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(wt)) {
          const f = l[n++], m = s.getAttribute(d).split($), v = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: a, name: v[2], strings: m, ctor: v[1] === "." ? Dt : v[1] === "?" ? Bt : v[1] === "@" ? Ft : B }), s.removeAttribute(d);
        } else d.startsWith($) && (c.push({ type: 6, index: a }), s.removeAttribute(d));
        if (Ct.test(s.tagName)) {
          const d = s.textContent.split($), f = d.length - 1;
          if (f > 0) {
            s.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < f; m++) s.append(d[m], O()), x.nextNode(), c.push({ type: 2, index: ++a });
            s.append(d[f], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === At) c.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = s.data.indexOf($, d + 1)) !== -1; ) c.push({ type: 7, index: a }), d += $.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(r, t, e = r, i) {
  var n, o;
  if (t === S) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const a = L(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), a === void 0 ? s = void 0 : (s = new a(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(r, s._$AS(r, t.values), s, i)), t;
}
class jt {
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
    let a = x.nextNode(), n = 0, o = 0, c = i[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let h;
        c.type === 2 ? h = new T(a, a.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, t) : c.type === 6 && (h = new Wt(a, this, t)), this._$AV.push(h), c = i[++o];
      }
      n !== (c == null ? void 0 : c.index) && (a = x.nextNode(), n++);
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
    t = k(this, t, e), L(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Vt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(Et(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(e);
    else {
      const n = new jt(s, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new T(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = pt(t).nextSibling;
      pt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = k(this, t, e, 0), n = !L(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const o = t;
      let c, h;
      for (t = a[0], c = 0; c < a.length - 1; c++) h = k(this, o[i + c], e, c), h === S && (h = this._$AH[c]), n || (n = !L(h) || h !== this._$AH[c]), h === u ? t = u : t !== u && (t += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Bt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Ft extends B {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? u) === S) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Wt {
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
const Q = z.litHtmlPolyfillSupport;
Q == null || Q(H, T), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.2");
const Gt = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(O(), a), a, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class E extends C {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Gt(e, this.renderRoot, this.renderOptions);
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
var $t;
E._$litElement$ = !0, E.finalized = !0, ($t = w.litElementHydrateSupport) == null || $t.call(w, { LitElement: E });
const K = w.litElementPolyfillSupport;
K == null || K({ LitElement: E });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
const R = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Xt = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Yt = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", qt = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
class Zt extends E {
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
        const s = e.toISOString(), a = new Date(e.getTime() - 24 * 60 * 60 * 1e3).toISOString(), n = i.join(","), o = await this.hass.callApi(
          "GET",
          `history/period/${a}?end_time=${s}&filter_entity_id=${n}&minimal_response`
        ), c = { ...this._history };
        Array.isArray(o) && o.forEach((h) => {
          if (h && h.length > 0) {
            const l = h[0].entity_id;
            let d = parseFloat(h[0].state), f = d;
            h.forEach((m) => {
              const v = parseFloat(m.state);
              isNaN(v) || (v < d && (d = v), v > f && (f = v));
            }), !isNaN(d) && !isNaN(f) && (c[l] = { min: d, max: f }, this._historyFetched.add(l));
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
    return yt`
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
    const t = this._config.title, e = this._config.layout || "horizontal", i = this._config.transparent_card_background || this._config.transparent || !1, s = this._config.bar_thickness || 12, a = this._config.vertical_height || 120, n = this._config.vertical_width || 16, o = this._config.card_background;
    let c = `
      --lgc-bar-thickness: ${s}px;
      --lgc-vertical-height: ${a}px;
      --lgc-vertical-width: ${n}px;
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
    const i = typeof t == "string" ? { entity: t } : t, s = i.entity, a = this.hass.states[s];
    if (!a)
      return p`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${s}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    const n = i.name || a.attributes.friendly_name || s, o = parseFloat(a.state), c = i.unit || a.attributes.unit_of_measurement || "", h = i.icon || a.attributes.icon, l = i.min ?? this._config.min ?? 0, d = i.max ?? this._config.max ?? 100, m = (i.effect || this._config.effect || "default") === "led" ? "effect-led" : "";
    let v = 0;
    isNaN(o) || (v = (Math.max(l, Math.min(o, d)) - l) / (d - l) * 100);
    const U = this._computeColor(o, i, e);
    let M = !1;
    const V = i.pulse || this._config.pulse;
    if (V && typeof V == "object") {
      const g = parseFloat(V.value), _ = V.condition || "above";
      isNaN(g) || (_ === "above" && o >= g || _ === "below" && o <= g) && (M = !0);
    }
    if (!M) {
      const g = this._getSeverityMatch(o, i.severity || this._config.severity);
      g && g.pulse && (M = !0);
    }
    let F = "";
    e === "vertical" ? F = `height: ${v}%; background: ${U}; box-shadow: 0 0 10px ${U};` : F = `width: ${v}%; background: ${U}; box-shadow: 0 0 10px ${U};`;
    let at = p``;
    if (i.target !== void 0) {
      let g = i.target;
      if (typeof g == "string" && isNaN(parseFloat(g))) {
        const _ = this.hass.states[g];
        _ && (g = parseFloat(_.state));
      }
      if (g = parseFloat(g), !isNaN(g)) {
        const I = (Math.max(l, Math.min(g, d)) - l) / (d - l) * 100, X = e === "vertical" ? `bottom: ${I}%` : `left: ${I}%`;
        at = p`<div class="target-marker" style="${X}"></div>`;
      }
    }
    let nt = p``;
    if (this._config.show_min_max && this._history[s]) {
      const g = this._history[s].min, _ = this._history[s].max;
      if (g !== void 0 && _ !== void 0) {
        const I = Math.max(l, Math.min(g, d)), X = Math.max(l, Math.min(_, d)), Y = (I - l) / (d - l) * 100, rt = (X - l) / (d - l) * 100 - Y;
        let q = "";
        e === "vertical" ? q = `bottom: ${Y}%; height: ${rt}%;` : q = `left: ${Y}%; width: ${rt}%;`, nt = p`<div class="min-max-range" style="${q}"></div>`;
      }
    }
    const W = i.compact_mode || this._config.compact_mode || !1, G = i.show_value_in_bar || this._config.show_value_in_bar || !1, St = i.disable_shimmer || this._config.disable_shimmer || !1, ot = isNaN(o) ? a.state : `${o} ${c}`;
    return p`
      <div class="gauge-container ${M ? "pulsing" : ""} ${W ? "compact" : ""} ${G ? "value-in-bar" : ""}" 
           @click=${(g) => this._handleAction(g, i, s)}>
        ${W ? p`
        <div class="entity-row compact">
          ${h ? p`<ha-icon class="entity-icon" .icon="${h}"></ha-icon>` : ""}
        </div>
        ` : p`
        <div class="entity-row">
          <div class="entity-info-group">
            ${h ? p`<ha-icon class="entity-icon" .icon="${h}"></ha-icon>` : ""}
            <span class="entity-name" title="${n}">${n}</span>
          </div>
          ${G ? "" : p`<span class="entity-state">${ot}</span>`}
        </div>
        `}
        <div class="bar-bg ${m}">
          ${nt}
          <div class="bar-fill ${m} ${St ? "no-shimmer" : ""}" style="${F}"></div>
          ${at}
          ${G ? p`<span class="bar-value">${ot}</span>` : ""}
        </div>
        ${W && !h ? p`<span class="compact-label">${n}</span>` : ""}
      </div>
    `;
  }
  _handleAction(t, e, i) {
    if (e.tap_action && e.tap_action.action === "none")
      return;
    t.stopPropagation();
    const s = e.tap_action || this._config.tap_action || { action: "more-info" }, a = s.action, n = s.target_entity || i;
    if (a === "more-info") {
      const o = new CustomEvent("hass-more-info", {
        detail: { entityId: n },
        bubbles: !0,
        composed: !0
      });
      this.dispatchEvent(o);
    } else if (a === "toggle")
      this.hass.callService("homeassistant", "toggle", { entity_id: n });
    else if (a === "navigate" && s.navigation_path) {
      history.pushState(null, "", s.navigation_path);
      const o = new Event("location-changed", { bubbles: !0, composed: !0 });
      window.dispatchEvent(o);
    } else if (a === "url" && s.url_path)
      window.open(s.url_path);
    else if (a === "call-service" && s.service) {
      const [o, c] = s.service.split("."), h = { ...s.data };
      h.entity_id || (h.entity_id = n), this.hass.callService(o, c, h);
    }
  }
  _computeColor(t, e, i) {
    if (isNaN(t)) return "var(--primary-color, #44739e)";
    const s = (a) => `linear-gradient(${i === "vertical" ? "0deg" : "90deg"}, ${a.join(", ")})`;
    if (e.severity) {
      const a = this._getSeverityMatch(t, e.severity);
      if (a) return a.color;
    }
    return e.color ? e.color : this._config.severity ? this._computeSeverity(t, this._config.severity) : this._config.color ? this._config.color : Array.isArray(this._config.colors) && this._config.colors.length > 0 ? s(this._config.colors) : "var(--primary-color, #03a9f4)";
  }
  _getSeverityMatch(t, e) {
    if (!Array.isArray(e)) return null;
    const i = parseFloat(t);
    return [...e].sort((a, n) => parseFloat(n.from) - parseFloat(a.from)).find((a) => i >= parseFloat(a.from));
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
class Jt extends E {
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
    return yt`
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
                    ${s.map((a, n) => p`
                        <div style="position: relative;">
                             <input type="color" 
                                .value=${a} 
                                @input=${(o) => this._globalColorChanged(o, n)}
                                style="width: 40px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;"
                             >
                             <ha-icon-button
                                .path=${R}
                                style="position: absolute; top: -14px; right: -14px; color: grey; --mdc-icon-button-size: 24px;"
                                @click=${() => this._removeGlobalColor(n)}
                             ></ha-icon-button>
                        </div>
                    `)}
                    <ha-icon-button
                        .path=${qt}
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

        <div class="entities-section">
          <h3>Entities</h3>
          <div class="entities-list">
            ${(this._config.entities || []).map((a, n) => this._renderEntityRow(a, n, i))}
          </div>
          <mwc-button class="add-button" outlined @click=${this._addEntity}>
            Add Entity
          </mwc-button>
        </div>

      </div>
    `;
  }
  _renderEntityRow(t, e, i) {
    const s = typeof t == "string" ? t : t.entity, a = typeof t == "object" ? t.color : void 0, n = typeof a == "string" && a !== "", o = this._expandedEntities.has(e), c = typeof t == "object" ? t : { entity: t };
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
            .path=${o ? Yt : Xt}
            @click=${() => this._toggleExpand(e)}
          ></ha-icon-button>

          <ha-icon-button
            class="delete"
            .path=${R}
            @click=${() => this._removeEntity(e)}
          ></ha-icon-button>
        </div>

        ${o ? this._renderEntityDetails(c, e, a, n) : ""}
      </div>
    `;
  }
  _renderColorWithAlpha(t, e) {
    let i = "#ffffff", s = 1;
    if (e)
      if (e.startsWith("rgba")) {
        const n = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (n) {
          const o = parseInt(n[1]), c = parseInt(n[2]), h = parseInt(n[3]);
          s = n[4] !== void 0 ? parseFloat(n[4]) : 1, i = "#" + [o, c, h].map((l) => l.toString(16).padStart(2, "0")).join("");
        }
      } else if (e.startsWith("rgb")) {
        const n = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (n) {
          const o = parseInt(n[1]), c = parseInt(n[2]), h = parseInt(n[3]);
          i = "#" + [o, c, h].map((l) => l.toString(16).padStart(2, "0")).join("");
        }
      } else e.startsWith("#") && (i = e.substring(0, 7), e.length === 9 && (s = parseInt(e.substring(7, 9), 16) / 255));
    const a = Math.round(s * 100);
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
              @input=${(n) => this._updateColorWithAlpha(n.target.value, s, t)}
              style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;"
            >
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 0.85em; opacity: 0.8;">Opacity: ${a}%</span>
              ${e ? p`
                <ha-icon-button
                  .path=${R}
                  style="color: var(--error-color); --mdc-icon-button-size: 32px;"
                  @click=${() => this._clearColorValue(t)}
                ></ha-icon-button>
              ` : ""}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              .value=${a}
              @input=${(n) => this._updateColorWithAlpha(i, parseInt(n.target.value) / 100, t)}
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
    const s = parseInt(t.substring(1, 3), 16), a = parseInt(t.substring(3, 5), 16), n = parseInt(t.substring(5, 7), 16);
    e = Math.round(e * 100) / 100;
    const o = e === 1 ? t : `rgba(${s}, ${a}, ${n}, ${e})`;
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
    const a = t.pulse || {}, n = t.severity || [], o = t.tap_action || { action: "more-info" }, c = [
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
                    @input=${(l) => this._entityChanged(l, e, "name")}
                ></ha-textfield>
                <ha-textfield
                    label="Icon (e.g., mdi:thermometer)"
                    .value=${t.icon || ""}
                    @input=${(l) => this._entityChanged(l, e, "icon")}
                ></ha-textfield>
            </div>
            <div class="row">
                <ha-textfield
                    label="Min"
                    type="number"
                    .value=${t.min ?? ""}
                    placeholder=${this._config.min ?? 0}
                    @input=${(l) => this._entityChanged(l, e, "min")}
                ></ha-textfield>
                <ha-textfield
                    label="Max"
                    type="number"
                    .value=${t.max ?? ""}
                    placeholder=${this._config.max ?? 100}
                    @input=${(l) => this._entityChanged(l, e, "max")}
                ></ha-textfield>
                <ha-textfield
                    label="Target"
                    type="number"
                    .value=${t.target || ""}
                    @input=${(l) => this._entityChanged(l, e, "target")}
                ></ha-textfield>
            </div>
            <div class="row">
                <ha-selector
                    label="Effect"
                    .hass=${this.hass}
                    .selector=${{ select: { options: h } }}
                    .value=${t.effect || "default"}
                    @value-changed=${(l) => this._entityChanged(l, e, "effect")}
                ></ha-selector>
            </div>
            
            <div class="row">
                <span>Compact Mode</span>
                <ha-switch
                    .checked=${t.compact_mode || !1}
                    @change=${(l) => this._entityChanged(l, e, "compact_mode")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Show Value in Bar</span>
                <ha-switch
                    .checked=${t.show_value_in_bar || !1}
                    @change=${(l) => this._entityChanged(l, e, "show_value_in_bar")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Disable Shimmer Effect</span>
                <ha-switch
                    .checked=${t.disable_shimmer || !1}
                    @change=${(l) => this._entityChanged(l, e, "disable_shimmer")}
                ></ha-switch>
            </div>
            
            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Color (override global)</span>
                    <ha-switch
                      .checked=${s}
                      @change=${(l) => this._toggleEntityColor(l, e)}
                    ></ha-switch>
                 </div>
                 ${s ? p`
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

                 ${o.action === "navigate" ? p`
                    <ha-textfield
                        label="Navigation Path"
                        .value=${o.navigation_path || ""}
                        @input=${(l) => this._tapActionChanged(l, e, "navigation_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}

                 ${o.action === "url" ? p`
                    <ha-textfield
                        label="URL"
                        .value=${o.url_path || ""}
                        @input=${(l) => this._tapActionChanged(l, e, "url_path")}
                        style="margin-top: 8px;"
                    ></ha-textfield>
                 ` : ""}
                 
                 ${o.action === "call-service" ? p`
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
                        .value=${a.value || ""}
                        @input=${(l) => this._pulseChanged(l, e, "value")}
                    ></ha-textfield>
                    <ha-selector
                        label="Condition"
                        .hass=${this.hass}
                        .selector=${{ select: { options: [{ value: "above", label: "> Above" }, { value: "below", label: "< Below" }] } }}
                        .value=${a.condition || "above"}
                        @value-changed=${(l) => this._pulseChanged(l, e, "condition")}
                    ></ha-selector>
                </div>
            </div>

            <div>
                <div class="section-title">Severity (Local Gradient)</div>
                ${n.map((l, d) => p`
                    <div class="severity-row">
                        <ha-textfield
                             label="From"
                             type="number"
                             .value=${l.from ?? 0}
                             @input=${(f) => this._severityChanged(f, e, d, "from")}
                             style="width: 80px;"
                        ></ha-textfield>
                         <input
                            type="color"
                            .value=${l.color || "#00ff00"}
                            @input=${(f) => this._severityChanged(f, e, d, "color")}
                            style="flex: 1; height: 40px; border: none; background: none; cursor: pointer;"
                         >
                         <ha-icon-button
                            class="delete"
                            .path=${R}
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
    let a = s[e];
    typeof a == "string" ? a = { entity: a } : a = { ...a };
    let n;
    t.detail && t.detail.value !== void 0 ? n = t.detail.value : n = t.target.value, t.target && t.target.tagName === "HA-SWITCH" && (n = t.target.checked), i === "target" && (n = parseFloat(n)), i === "min" || i === "max" ? n === "" || n === void 0 || n === null ? delete a[i] : (n = parseFloat(n), a[i] = n) : i === "effect" && n === "default" || (i === "compact_mode" || i === "show_value_in_bar" || i === "disable_shimmer") && !n ? delete a[i] : a[i] = n, s[e] = a, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _toggleEntityColor(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? s.color = "#03a9f4" : delete s.color, i[e] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _tapActionChanged(t, e, i) {
    const s = [...this._config.entities || []];
    let a = { ...typeof s[e] == "string" ? { entity: s[e] } : s[e] }, n = { ...a.tap_action || { action: "more-info" } }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, n[i] = o, a.tap_action = n, s[e] = a, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _pulseChanged(t, e, i) {
    const s = [...this._config.entities || []];
    let a = { ...typeof s[e] == "string" ? { entity: s[e] } : s[e] }, n = { ...a.pulse || {} }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, n[i] = i === "value" ? parseFloat(o) : o, a.pulse = n, s[e] = a, this._config = { ...this._config, entities: s }, this._fireChangedEvent();
  }
  _severityChanged(t, e, i, s) {
    const a = [...this._config.entities || []];
    let n = { ...typeof a[e] == "string" ? { entity: a[e] } : a[e] }, o = [...n.severity || []], c = { ...o[i] }, h = t.target.value;
    c[s] = s === "from" ? parseFloat(h) : h, o[i] = c, n.severity = o, a[e] = n, this._config = { ...this._config, entities: a }, this._fireChangedEvent();
  }
  _addSeverityBand(t) {
    const e = [...this._config.entities || []];
    let i = { ...typeof e[t] == "string" ? { entity: e[t] } : e[t] }, s = [...i.severity || []];
    s.push({ from: 0, color: "#00ff00" }), i.severity = s, e[t] = i, this._config = { ...this._config, entities: e }, this._fireChangedEvent();
  }
  _removeSeverityBand(t, e) {
    const i = [...this._config.entities || []];
    let s = { ...typeof i[t] == "string" ? { entity: i[t] } : i[t] }, a = [...s.severity || []];
    a.splice(e, 1), s.severity = a, i[t] = s, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
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
customElements.define("linear-gauge-card-editor", Jt);
customElements.define("linear-gauge-card", Zt);
