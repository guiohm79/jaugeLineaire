/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, nt = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), pt = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (nt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = pt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && pt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ut = (h) => new Et(typeof h == "string" ? h : h + "", void 0, ot), At = (h, ...t) => {
  const e = h.length === 1 ? h[0] : t.reduce((i, a, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + h[r + 1], h[0]);
  return new Et(e, h, ot);
}, Ft = (h, t) => {
  if (nt) h.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), a = q.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = e.cssText, h.appendChild(i);
  }
}, gt = nt ? (h) => h : (h) => h instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ut(e);
})(h) : h;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gt, defineProperty: jt, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: Rt, getOwnPropertySymbols: Dt, getPrototypeOf: qt } = Object, E = globalThis, ut = E.trustedTypes, Wt = ut ? ut.emptyScript : "", tt = E.reactiveElementPolyfillSupport, U = (h, t) => h, rt = { toAttribute(h, t) {
  switch (t) {
    case Boolean:
      h = h ? Wt : null;
      break;
    case Object:
    case Array:
      h = h == null ? h : JSON.stringify(h);
  }
  return h;
}, fromAttribute(h, t) {
  let e = h;
  switch (t) {
    case Boolean:
      e = h !== null;
      break;
    case Number:
      e = h === null ? null : Number(h);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(h);
      } catch {
        e = null;
      }
  }
  return e;
} }, St = (h, t) => !Gt(h, t), vt = { attribute: !0, type: String, converter: rt, reflect: !1, useDefault: !1, hasChanged: St };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let L = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = vt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(t, i, e);
      a !== void 0 && jt(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: a, set: r } = Bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: a, set(s) {
      const o = a == null ? void 0 : a.call(this);
      r == null || r.call(this, s), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? vt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, i = [...Rt(e), ...Dt(e)];
      for (const a of i) this.createProperty(a, e[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, a] of e) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const a = this._$Eu(e, i);
      a !== void 0 && this._$Eh.set(a, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const a of i) e.unshift(gt(a));
    } else t !== void 0 && e.push(gt(t));
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
    return Ft(t, this.constructor.elementStyles), t;
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
    const i = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, i);
    if (a !== void 0 && i.reflect === !0) {
      const s = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : rt).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(a) : this.setAttribute(a, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, s;
    const i = this.constructor, a = i._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const o = i.getPropertyOptions(a), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : rt;
      this._$Em = a;
      const c = l.fromAttribute(e, o.type);
      this[a] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(a)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, a = !1, r) {
    var s;
    if (t !== void 0) {
      const o = this.constructor;
      if (a === !1 && (r = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? St)(r, e) || i.useDefault && i.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: a, wrapped: r }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), r !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), a === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, s] of this._$Ep) this[r] = s;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, s] of a) {
        const { wrapped: o } = s, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, s, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((a) => {
        var r;
        return (r = a.hostUpdate) == null ? void 0 : r.call(a);
      }), this.update(e)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var a;
      return (a = i.hostUpdated) == null ? void 0 : a.call(i);
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
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[U("elementProperties")] = /* @__PURE__ */ new Map(), L[U("finalized")] = /* @__PURE__ */ new Map(), tt == null || tt({ ReactiveElement: L }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, ft = (h) => h, W = F.trustedTypes, mt = W ? W.createPolicy("lit-html", { createHTML: (h) => h }) : void 0, Mt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + C, Xt = `<${zt}>`, N = document, G = () => N.createComment(""), j = (h) => h === null || typeof h != "object" && typeof h != "function", lt = Array.isArray, Zt = (h) => lt(h) || typeof (h == null ? void 0 : h[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, _t = />/g, S = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), yt = /'/g, $t = /"/g, Nt = /^(?:script|style|textarea|title)$/i, Yt = (h) => (t, ...e) => ({ _$litType$: h, strings: t, values: e }), p = Yt(1), P = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), xt = /* @__PURE__ */ new WeakMap(), M = N.createTreeWalker(N, 129);
function Lt(h, t) {
  if (!lt(h) || !h.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return mt !== void 0 ? mt.createHTML(t) : t;
}
const Jt = (h, t) => {
  const e = h.length - 1, i = [];
  let a, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = H;
  for (let o = 0; o < e; o++) {
    const l = h[o];
    let c, d, n = -1, g = 0;
    for (; g < l.length && (s.lastIndex = g, d = s.exec(l), d !== null); ) g = s.lastIndex, s === H ? d[1] === "!--" ? s = bt : d[1] !== void 0 ? s = _t : d[2] !== void 0 ? (Nt.test(d[2]) && (a = RegExp("</" + d[2], "g")), s = S) : d[3] !== void 0 && (s = S) : s === S ? d[0] === ">" ? (s = a ?? H, n = -1) : d[1] === void 0 ? n = -2 : (n = s.lastIndex - d[2].length, c = d[1], s = d[3] === void 0 ? S : d[3] === '"' ? $t : yt) : s === $t || s === yt ? s = S : s === bt || s === _t ? s = H : (s = S, a = void 0);
    const u = s === S && h[o + 1].startsWith("/>") ? " " : "";
    r += s === H ? l + Xt : n >= 0 ? (i.push(c), l.slice(0, n) + Mt + l.slice(n) + C + u) : l + C + (n === -2 ? o : u);
  }
  return [Lt(h, r + (h[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: t, _$litType$: e }, i) {
    let a;
    this.parts = [];
    let r = 0, s = 0;
    const o = t.length - 1, l = this.parts, [c, d] = Jt(t, e);
    if (this.el = B.createElement(c, i), M.currentNode = this.el.content, e === 2 || e === 3) {
      const n = this.el.content.firstChild;
      n.replaceWith(...n.childNodes);
    }
    for (; (a = M.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const n of a.getAttributeNames()) if (n.endsWith(Mt)) {
          const g = d[s++], u = a.getAttribute(n).split(C), v = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: r, name: v[2], strings: u, ctor: v[1] === "." ? Kt : v[1] === "?" ? te : v[1] === "@" ? ee : X }), a.removeAttribute(n);
        } else n.startsWith(C) && (l.push({ type: 6, index: r }), a.removeAttribute(n));
        if (Nt.test(a.tagName)) {
          const n = a.textContent.split(C), g = n.length - 1;
          if (g > 0) {
            a.textContent = W ? W.emptyScript : "";
            for (let u = 0; u < g; u++) a.append(n[u], G()), M.nextNode(), l.push({ type: 2, index: ++r });
            a.append(n[g], G());
          }
        }
      } else if (a.nodeType === 8) if (a.data === zt) l.push({ type: 2, index: r });
      else {
        let n = -1;
        for (; (n = a.data.indexOf(C, n + 1)) !== -1; ) l.push({ type: 7, index: r }), n += C.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = N.createElement("template");
    return i.innerHTML = t, i;
  }
}
function V(h, t, e = h, i) {
  var s, o;
  if (t === P) return t;
  let a = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const r = j(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== r && ((o = a == null ? void 0 : a._$AO) == null || o.call(a, !1), r === void 0 ? a = void 0 : (a = new r(h), a._$AT(h, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = a : e._$Cl = a), a !== void 0 && (t = V(h, a._$AS(h, t.values), a, i)), t;
}
class Qt {
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
    const { el: { content: e }, parts: i } = this._$AD, a = ((t == null ? void 0 : t.creationScope) ?? N).importNode(e, !0);
    M.currentNode = a;
    let r = M.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new R(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new ie(r, this, t)), this._$AV.push(c), l = i[++o];
      }
      s !== (l == null ? void 0 : l.index) && (r = M.nextNode(), s++);
    }
    return M.currentNode = N, a;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, a) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    t = V(this, t, e), j(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(N.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, a = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = B.createElement(Lt(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === a) this._$AH.p(e);
    else {
      const s = new Qt(a, this), o = s.u(this.options);
      s.p(e), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = xt.get(t.strings);
    return e === void 0 && xt.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, a = 0;
    for (const r of t) a === e.length ? e.push(i = new R(this.O(G()), this.O(G()), this, this.options)) : i = e[a], i._$AI(r), a++;
    a < e.length && (this._$AR(i && i._$AB.nextSibling, a), e.length = a);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const a = ft(t).nextSibling;
      ft(t).remove(), t = a;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, a, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = e, this._$AM = a, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(t, e = this, i, a) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) t = V(this, t, e, 0), s = !j(t) || t !== this._$AH && t !== P, s && (this._$AH = t);
    else {
      const o = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = V(this, o[i + l], e, l), c === P && (c = this._$AH[l]), s || (s = !j(c) || c !== this._$AH[l]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    s && !a && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Kt extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class te extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class ee extends X {
  constructor(t, e, i, a, r) {
    super(t, e, i, a, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = V(this, t, e, 0) ?? _) === P) return;
    const i = this._$AH, a = t === _ && i !== _ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== _ && (i === _ || a);
    a && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ie {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    V(this, t);
  }
}
const it = F.litHtmlPolyfillSupport;
it == null || it(B, R), (F.litHtmlVersions ?? (F.litHtmlVersions = [])).push("3.3.2");
const ae = (h, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let a = i._$litPart$;
  if (a === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = a = new R(t.insertBefore(G(), r), r, void 0, e ?? {});
  }
  return a._$AI(h), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis;
class I extends L {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(e, this.renderRoot, this.renderOptions);
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
    return P;
  }
}
var Ct;
I._$litElement$ = !0, I.finalized = !0, (Ct = z.litElementHydrateSupport) == null || Ct.call(z, { LitElement: I });
const at = z.litElementPolyfillSupport;
at == null || at({ LitElement: I });
(z.litElementVersions ?? (z.litElementVersions = [])).push("4.2.2");
const O = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", se = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", re = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", ne = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", oe = ["#f44336", "#ff9800", "#ffd23f", "#7cb342", "#4caf50"], wt = [
  { value: "bar", label: "Bar (default)" },
  { value: "gradient_track", label: "Gradient track" },
  { value: "glass", label: "Glass (glossy)" },
  { value: "stripes", label: "Stripes (animated)" },
  { value: "segments", label: "Segments (LED)" },
  { value: "dots", label: "Dots" },
  { value: "chevrons", label: "Chevrons" },
  { value: "equalizer", label: "Equalizer (VU meter)" },
  { value: "battery", label: "Battery" },
  { value: "thermometer", label: "Thermometer" },
  { value: "wave", label: "Wave (liquid)" },
  { value: "ticks", label: "Ticks / graduations" },
  { value: "needle", label: "Needle scale" },
  { value: "cursor", label: "Cursor" },
  { value: "sparkline", label: "Sparkline (24h)" }
], le = /* @__PURE__ */ new Set(["sparkline", "ticks", "equalizer"]), kt = [
  { value: "circle", label: "Circle ●" },
  { value: "line", label: "Line |" },
  { value: "arrow", label: "Arrow ▾" },
  { value: "diamond", label: "Diamond ◆" },
  { value: "bar", label: "Bar ▐" }
];
function st(h, t) {
  if (t = Math.max(0, Math.min(1, t)), !h || h.length === 0) return "var(--primary-color, #03a9f4)";
  if (h.length === 1) return h[0];
  const e = t * (h.length - 1), i = Math.min(h.length - 2, Math.floor(e)), a = e - i, r = h[i], s = h[i + 1];
  if (typeof r != "string" || typeof s != "string" || r[0] !== "#" || s[0] !== "#") return r;
  const o = (n) => {
    let g = n.slice(1);
    g.length === 3 && (g = g.split("").map((v) => v + v).join(""));
    const u = parseInt(g.slice(0, 6), 16);
    return [u >> 16 & 255, u >> 8 & 255, u & 255];
  }, l = o(r), c = o(s), d = (n) => Math.round(l[n] + (c[n] - l[n]) * a);
  return `rgb(${d(0)},${d(1)},${d(2)})`;
}
class ce extends I {
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
    t.has("hass") && this.hass && ((e = this._config) != null && e.show_min_max || this._usesSparkline()) && this._fetchHistoryIfNeeded();
  }
  async _fetchHistoryIfNeeded() {
    if (!this.hass || !this._config.entities) return;
    const t = this._config.entities.map((a) => typeof a == "string" ? a : a.entity), e = /* @__PURE__ */ new Date();
    if (this._fetching) return;
    const i = t.filter((a) => !this._historyFetched.has(a));
    if (i.length !== 0) {
      this._fetching = !0;
      try {
        const a = e.toISOString(), r = new Date(e.getTime() - 24 * 60 * 60 * 1e3).toISOString(), s = i.join(","), o = await this.hass.callApi(
          "GET",
          `history/period/${r}?end_time=${a}&filter_entity_id=${s}&minimal_response`
        ), l = { ...this._history };
        Array.isArray(o) && o.forEach((c) => {
          if (c && c.length > 0) {
            const d = c[0].entity_id;
            let n = parseFloat(c[0].state), g = n;
            if (c.forEach((u) => {
              const v = parseFloat(u.state);
              isNaN(v) || (v < n && (n = v), v > g && (g = v));
            }), !isNaN(n) && !isNaN(g)) {
              const u = c.map((b) => parseFloat(b.state)).filter((b) => !isNaN(b));
              let v = u;
              const m = 60;
              if (u.length > m) {
                v = [];
                const b = u.length / m;
                for (let x = 0; x < m; x++) v.push(u[Math.floor(x * b)]);
              }
              l[d] = { min: n, max: g, series: v }, this._historyFetched.add(d);
            }
          }
        }), this._history = l;
      } catch (a) {
        console.error("Error fetching history for linear-gauge-card:", a);
      } finally {
        this._fetching = !1;
      }
    }
  }
  static get styles() {
    return At`
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
      .gauge-container.pulsing .chev,
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
        .gauge-container.pulsing .chev,
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

      /* ---- Gauge style: chevrons ---- */
      .chev-track {
        display: flex;
        gap: var(--lgc-segment-gap, 3px);
        width: 100%;
        height: var(--lgc-bar-thickness, 12px);
      }
      .chev {
        flex: 1 1 0;
        background: rgba(127, 127, 127, 0.18);
        clip-path: polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .chev-track.vertical {
        flex-direction: column-reverse;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
        margin: 0 auto;
      }
      .chev-track.vertical .chev {
        clip-path: polygon(0 100%, 0 30%, 50% 0, 100% 30%, 100% 100%);
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
      .bat-wrap { display: flex; align-items: center; gap: 2px; width: 100%; }
      .bat-body {
        position: relative;
        flex: 1 1 auto;
        height: var(--lgc-battery-size, 22px);
        border: 2px solid rgba(127, 127, 127, 0.55);
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
      }
      .bat-cap {
        flex: 0 0 auto;
        width: 4px;
        height: 40%;
        border-radius: 0 2px 2px 0;
        background: rgba(127, 127, 127, 0.55);
      }
      .bat-fill {
        position: absolute;
        left: 2px; top: 2px; bottom: 2px;
        border-radius: 2px;
        transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }
      .bat-value {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 600;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
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
      .bat-wrap.vertical .bat-cap {
        width: 40%;
        height: 4px;
        border-radius: 2px 2px 0 0;
      }
      .bat-wrap.vertical .bat-fill {
        left: 2px; right: 2px; bottom: 2px; top: auto;
        transition: height 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }

      /* ---- Gauge style: thermometer ---- */
      .thermo-wrap { display: flex; align-items: center; width: 100%; }
      .thermo-bulb {
        flex: 0 0 auto;
        width: var(--lgc-thermo-bulb, 18px);
        height: var(--lgc-thermo-bulb, 18px);
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
        z-index: 1;
      }
      .thermo-tube {
        position: relative;
        flex: 1 1 auto;
        height: var(--lgc-bar-thickness, 12px);
        margin-left: -6px;
        border-radius: 0 999px 999px 0;
        background: rgba(127, 127, 127, 0.18);
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      .thermo-fill {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        border-radius: 0 999px 999px 0;
        transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }
      .thermo-grad {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(90deg, rgba(127, 127, 127, 0.5) 0 1px, rgba(0, 0, 0, 0) 1px 10%);
        pointer-events: none;
      }
      .thermo-value {
        position: absolute;
        inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 10.5px; font-weight: 600;
        color: var(--primary-text-color);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
        font-feature-settings: "tnum";
        pointer-events: none;
      }
      .thermo-wrap.vertical {
        flex-direction: column-reverse;
        justify-content: flex-start;
        width: auto;
      }
      .thermo-wrap.vertical .thermo-tube {
        flex: 0 0 auto;
        width: var(--lgc-vertical-width, 16px);
        height: var(--lgc-vertical-height, 120px);
        margin-left: 0;
        margin-bottom: -6px;
        border-radius: 999px 999px 0 0;
      }
      .thermo-wrap.vertical .thermo-fill {
        left: 0; right: 0; bottom: 0; top: auto;
        border-radius: 999px 999px 0 0;
        transition: height 1s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
      }
      .thermo-wrap.vertical .thermo-grad {
        background-image: repeating-linear-gradient(0deg, rgba(127, 127, 127, 0.5) 0 1px, rgba(0, 0, 0, 0) 1px 10%);
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
      .wave-wrap.vertical .wave-anim { animation-name: lgc-wave-v; }
      @keyframes lgc-wave-h {
        from { transform: translateY(0); }
        to   { transform: translateY(50px); }
      }
      @keyframes lgc-wave-v {
        from { transform: translateX(0); }
        to   { transform: translateX(50px); }
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
    if (!this._config || !this.hass)
      return p``;
    const t = this._config.title, e = this._config.layout || "horizontal", i = this._config.transparent_card_background || this._config.transparent || !1, a = this._config.bar_thickness || 12, r = this._config.vertical_height || 120, s = this._config.vertical_width || 16, o = this._config.card_background, l = this._config.compact_mode || !1, c = this._config.entities_gap, d = this._config.wave_height, n = this._config.equalizer_height, g = this._config.battery_size;
    let u = `
      --lgc-bar-thickness: ${a}px;
      --lgc-vertical-height: ${r}px;
      --lgc-vertical-width: ${s}px;
      ${c !== void 0 ? `--lgc-entities-gap: ${c}px;` : ""}
      ${d !== void 0 ? `--lgc-wave-height: ${d}px;` : ""}
      ${n !== void 0 ? `--lgc-equalizer-height: ${n}px;` : ""}
      ${g !== void 0 ? `--lgc-battery-size: ${g}px;` : ""}
    `;
    i ? u += "background: none !important; background-color: transparent !important; border: none !important; box-shadow: none !important;" : o && (u += `--lgc-card-background: ${o};`);
    const v = l ? "compact-mode" : "", m = c !== void 0;
    return p`
      <ha-card class="${v}" style="${u}">
        ${t ? p`<div class="card-header">${t}</div>` : ""}
        <div class="entities-wrapper ${e} ${m ? "has-custom-gap" : ""}">
          ${this._config.entities.map((b) => this.renderEntity(b, e))}
        </div>
      </ha-card>
    `;
  }
  renderEntity(t, e) {
    const i = typeof t == "string" ? { entity: t } : t, a = i.entity, r = this.hass.states[a];
    if (!r)
      return p`
        <div class="gauge-container">
          <div class="entity-row">
            <span class="entity-name">${a}</span>
            <span class="entity-state">N/A</span>
          </div>
        </div>`;
    const s = i.name || r.attributes.friendly_name || a, o = parseFloat(r.state), l = i.unit || r.attributes.unit_of_measurement || "", c = i.icon || r.attributes.icon, d = i.min ?? this._config.min ?? 0, n = i.max ?? this._config.max ?? 100;
    i.effect || this._config.effect;
    let g = 0, u = o;
    isNaN(o) || (u = Math.max(d, Math.min(o, n)), n !== d ? g = (u - d) / (n - d) * 100 : g = 0, g = Math.max(0, Math.min(100, g)));
    const v = i.center_zero ?? this._config.center_zero ?? !1, m = this._computeColor(o, i, e, v);
    let b = !1;
    const x = i.pulse || this._config.pulse;
    if (x && typeof x == "object") {
      const f = parseFloat(x.value), y = x.condition || "above";
      isNaN(f) || (y === "above" && o >= f || y === "below" && o <= f) && (b = !0);
    }
    if (!b) {
      const f = this._getSeverityMatch(o, i.severity || this._config.severity);
      f && f.pulse && (b = !0);
    }
    let $ = "";
    if (v && !isNaN(o) && d < 0 && n > 0) {
      const f = (0 - d) / (n - d) * 100, y = (u - d) / (n - d) * 100;
      e === "vertical" ? o >= 0 ? $ = `bottom: ${f}%; height: ${y - f}%; background: ${m}; box-shadow: 0 0 10px ${m};` : $ = `bottom: ${y}%; height: ${f - y}%; background: ${m}; box-shadow: 0 0 10px ${m};` : o >= 0 ? $ = `left: ${f}%; width: ${y - f}%; background: ${m}; box-shadow: 0 0 10px ${m};` : $ = `left: ${y}%; width: ${f - y}%; background: ${m}; box-shadow: 0 0 10px ${m};`;
    } else e === "vertical" ? $ = `height: ${g}%; background: ${m}; box-shadow: 0 0 10px ${m};` : $ = `width: ${g}%; background: ${m}; box-shadow: 0 0 10px ${m};`;
    let A = p``;
    const w = i.target_entity !== void 0 && i.target_entity !== "" ? i.target_entity : i.target;
    if (w !== void 0 && w !== "") {
      let f = w;
      if (typeof f == "string" && isNaN(parseFloat(f))) {
        const y = this.hass.states[f];
        y && (f = parseFloat(y.state));
      }
      if (f = parseFloat(f), !isNaN(f) && n !== d) {
        const D = (Math.max(d, Math.min(f, n)) - d) / (n - d) * 100, J = e === "vertical" ? `bottom: ${D}%` : `left: ${D}%`;
        A = p`<div class="target-marker" style="${J}"></div>`;
      }
    }
    let k = p``;
    if (this._config.show_min_max && this._history[a]) {
      const f = this._history[a].min, y = this._history[a].max;
      if (f !== void 0 && y !== void 0 && n !== d) {
        const D = Math.max(d, Math.min(f, n)), J = Math.max(d, Math.min(y, n)), Q = (D - d) / (n - d) * 100, dt = (J - d) / (n - d) * 100 - Q;
        let K = "";
        e === "vertical" ? K = `bottom: ${Q}%; height: ${dt}%;` : K = `left: ${Q}%; width: ${dt}%;`, k = p`<div class="min-max-range" style="${K}"></div>`;
      }
    }
    const T = i.compact_mode || this._config.compact_mode || !1, Z = i.show_value_in_bar || this._config.show_value_in_bar || !1, It = i.disable_shimmer || this._config.disable_shimmer || !1, ct = i.hide_icon || this._config.hide_icon || !1, Pt = i.hide_zero_bar || this._config.hide_zero_bar || !1, Vt = !isNaN(o) && o <= d, Y = isNaN(o) ? r.state : `${o.toFixed(i.value_precision ?? this._config.value_precision ?? 1)} ${l}`, Tt = this._gaugeStyle(i), Ht = Math.max(3, Math.min(120, parseInt(i.segment_count ?? this._config.segment_count ?? 20, 10) || 20)), ht = (i.tap_action || this._config.tap_action || { action: "more-info" }).action !== "none", Ot = this._renderVisual(Tt, {
      layout: e,
      percent: g,
      color: m,
      barStyle: $,
      targetMarker: A,
      minMaxMarker: k,
      displayValue: Y,
      showValueInBar: Z,
      disableShimmer: It,
      hideZeroBar: Pt,
      isZero: Vt,
      value: o,
      min: d,
      max: n,
      clampedValue: u,
      entityId: a,
      conf: i,
      segmentCount: Ht
    });
    return p`
      <div class="gauge-container ${b ? "pulsing" : ""} ${T ? "compact" : ""} ${Z ? "value-in-bar" : ""}"
           role="${ht ? "button" : "img"}"
           tabindex="${ht ? "0" : "-1"}"
           aria-label="${s}: ${Y}"
           @keydown=${(f) => this._handleKey(f, i, a)}
           @click=${(f) => this._handleAction(f, i, a)}>
        ${T ? p`
        <div class="entity-row compact">
          ${c && !ct ? p`<ha-icon class="entity-icon" .icon="${c}"></ha-icon>` : ""}
        </div>
        ` : p`
        <div class="entity-row">
          <div class="entity-info-group">
            ${c && !ct ? p`<ha-icon class="entity-icon" .icon="${c}"></ha-icon>` : ""}
            <span class="entity-name" title="${s}">${s}</span>
          </div>
          ${Z ? "" : p`<span class="entity-state">${Y}</span>`}
        </div>
        `}
        ${Ot}
      </div>
    `;
  }
  // Resolve the effective gauge style (per-entity > global), keeping the
  // legacy `effect: led` working by mapping it to the new segments style.
  _gaugeStyle(t) {
    const e = t.gauge_style || this._config.gauge_style;
    return e || ((t.effect || this._config.effect) === "led" ? "segments" : "bar");
  }
  _usesSparkline() {
    return !this._config || !this._config.entities ? !1 : this._config.gauge_style === "sparkline" ? !0 : this._config.entities.some((t) => typeof t == "object" && t && t.gauge_style === "sparkline");
  }
  _gradientColors() {
    return Array.isArray(this._config.colors) && this._config.colors.length > 0 ? this._config.colors : oe;
  }
  _gradientCssFor(t) {
    return `linear-gradient(${t === "vertical" ? "0deg" : "90deg"}, ${this._gradientColors().join(", ")})`;
  }
  // Solid colour for thumbs / strokes: if the computed colour is a gradient
  // string, sample the palette at the current fraction instead.
  _solidColor(t, e) {
    return typeof t == "string" && t.indexOf("gradient") === -1 ? t : st(this._gradientColors(), e);
  }
  _resolveTarget(t) {
    let e = t.target_entity !== void 0 && t.target_entity !== "" ? t.target_entity : t.target;
    if (e === void 0 || e === "") return null;
    if (typeof e == "string" && isNaN(parseFloat(e))) {
      const i = this.hass.states[e];
      i && (e = parseFloat(i.state));
    }
    return e = parseFloat(e), isNaN(e) ? null : e;
  }
  _handleKey(t, e, i) {
    (t.key === "Enter" || t.key === " " || t.key === "Spacebar") && (t.preventDefault(), this._handleAction(t, e, i));
  }
  _renderVisual(t, e) {
    let i = t;
    switch (e.layout === "vertical" && le.has(i) && (i = i === "equalizer" ? "segments" : "bar"), i) {
      case "gradient_track":
        return this._visualGradientTrack(e);
      case "glass":
        return this._visualGlass(e);
      case "stripes":
        return this._visualStripes(e);
      case "segments":
        return this._visualSegments(e);
      case "dots":
        return this._visualDots(e);
      case "chevrons":
        return this._visualChevrons(e);
      case "equalizer":
        return this._visualEqualizer(e);
      case "battery":
        return this._visualBattery(e);
      case "thermometer":
        return this._visualThermometer(e);
      case "wave":
        return this._visualWave(e);
      case "ticks":
        return this._visualTicks(e);
      case "needle":
        return this._visualNeedle(e);
      case "cursor":
        return this._visualCursor(e);
      case "sparkline":
        return this._visualSparkline(e);
      default:
        return this._visualBar(e);
    }
  }
  _visualBar(t) {
    const { minMaxMarker: e, disableShimmer: i, hideZeroBar: a, isZero: r, barStyle: s, targetMarker: o, showValueInBar: l, displayValue: c } = t;
    return p`
      <div class="bar-bg">
        ${e}
        <div class="bar-fill ${i ? "no-shimmer" : ""} ${a && r ? "hide-at-zero" : ""}" style="${s}"></div>
        ${o}
        ${l ? p`<span class="bar-value">${c}</span>` : ""}
      </div>`;
  }
  _visualGradientTrack(t) {
    const { layout: e, percent: i, targetMarker: a, minMaxMarker: r, showValueInBar: s, displayValue: o } = t, l = this._gradientCssFor(e), c = Math.max(1e-4, i), d = e === "vertical" ? `height: ${i}%; background-image: ${l}; background-size: 100% ${1e4 / c}%; background-repeat: no-repeat; background-position: bottom; box-shadow: none;` : `width: ${i}%; background-image: ${l}; background-size: ${1e4 / c}% 100%; background-repeat: no-repeat; box-shadow: none;`;
    return p`
      <div class="bar-bg grad-track">
        <div class="grad-track-bg" style="background-image: ${l};"></div>
        ${r}
        <div class="bar-fill no-shimmer" style="${d}"></div>
        ${a}
        ${s ? p`<span class="bar-value">${o}</span>` : ""}
      </div>`;
  }
  _visualSegments(t) {
    const { layout: e, percent: i, segmentCount: a, conf: r, color: s } = t, o = this._gradientColors(), l = !!(r.color || r.severity || this._config.color || this._config.severity), c = Math.round(i / 100 * a), d = [];
    for (let n = 0; n < a; n++) {
      const g = n < c, u = l ? s : st(o, (n + 0.5) / a);
      d.push(p`<div class="seg" style="${g ? `background: ${u}; box-shadow: 0 0 6px ${u}66;` : ""}"></div>`);
    }
    return p`<div class="seg-track ${e === "vertical" ? "vertical" : ""}">${d}</div>`;
  }
  _visualTicks(t) {
    const { percent: e, color: i, min: a, max: r, conf: s, showValueInBar: o, displayValue: l } = t, c = Math.max(2, Math.min(21, parseInt(s.tick_count ?? this._config.tick_count ?? 5, 10) || 5)), d = [];
    for (let v = 0; v < c; v++) d.push(v / (c - 1) * 100);
    const n = this._resolveTarget(s);
    let g = p``;
    if (n !== null && r !== a) {
      const v = Math.max(0, Math.min(100, (Math.max(a, Math.min(n, r)) - a) / (r - a) * 100));
      g = p`<div class="tick-target" style="left: ${v}%">▾ ${n}</div>`;
    }
    const u = o ? p`<div class="ticks-value" style="left: ${Math.max(0, Math.min(100, e))}%">${l}</div>` : p``;
    return p`
      <div class="ticks-wrap">
        ${g}
        ${u}
        <div class="bar-bg ticks-bar">
          <div class="bar-fill no-shimmer" style="width: ${e}%; background: ${i}; box-shadow: none;"></div>
        </div>
        <div class="ticks">
          ${d.map((v) => p`
            <div class="tick" style="left: ${v}%">
              <div class="tick-mark"></div>
              <span class="tick-label">${Math.round(a + (r - a) * v / 100)}</span>
            </div>`)}
        </div>
      </div>`;
  }
  _visualCursor(t) {
    const { layout: e, percent: i, color: a, displayValue: r, conf: s } = t, o = this._gradientCssFor(e), l = this._solidColor(a, i / 100), c = s.cursor_shape || this._config.cursor_shape || "circle";
    return e === "vertical" ? p`
        <div class="cursor-wrap vertical">
          <div class="cursor-track" style="background-image: ${o};"></div>
          <div class="cursor-fill" style="height: ${i}%; background: ${l};"></div>
          <div class="cursor-thumb shape-${c}" style="bottom: ${i}%; --lgc-thumb-color: ${l};"></div>
        </div>` : p`
      <div class="cursor-wrap">
        <div class="cursor-label" style="left: ${i}%">${r}</div>
        <div class="cursor-track" style="background-image: ${o};"></div>
        <div class="cursor-fill" style="width: ${i}%; background: ${l};"></div>
        <div class="cursor-thumb shape-${c}" style="left: ${i}%; --lgc-thumb-color: ${l};"></div>
      </div>`;
  }
  _visualSparkline(t) {
    const { entityId: e, percent: i, color: a, min: r, max: s } = t, o = this._history[e];
    if (!o || !Array.isArray(o.series) || o.series.length < 2) return this._visualBar(t);
    const l = o.series, c = 300, d = 46, n = Math.min(...l), g = Math.max(...l), u = g - n || 1, v = (w) => w / (l.length - 1) * c, m = (w) => d - 3 - (w - n) / u * (d - 6), b = l.map((w, k) => `${k ? "L" : "M"}${v(k).toFixed(1)},${m(w).toFixed(1)}`).join(" "), x = `${b} L${c},${d} L0,${d} Z`, $ = this._solidColor(a, i / 100), A = "lgcspark-" + String(e).replace(/[^a-z0-9]/gi, "");
    return p`
      <div class="spark-wrap">
        <svg viewBox="0 0 ${c} ${d}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="${A}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${$}" stop-opacity="0.34"></stop>
              <stop offset="100%" stop-color="${$}" stop-opacity="0.02"></stop>
            </linearGradient>
          </defs>
          <path d="${x}" fill="url(#${A})"></path>
          <path d="${b}" fill="none" stroke="${$}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
          <circle cx="${c}" cy="${m(l[l.length - 1])}" r="3.2" fill="${$}"></circle>
        </svg>
        <div class="spark-meta">
          <span>min ${n.toFixed(0)}</span>
          <span style="opacity:0.7">24 h</span>
          <span>max ${g.toFixed(0)}</span>
        </div>
      </div>`;
  }
  // Segment/dot/bar count for the "repeated element" styles. Each style keeps
  // its own sensible default when `segment_count` isn't explicitly configured.
  _countFor(t, e) {
    const a = { segments: 20, dots: 12, chevrons: 10, equalizer: 16 }[t] ?? 20, r = e.segment_count ?? this._config.segment_count, s = parseInt(r ?? a, 10) || a;
    return Math.max(3, Math.min(120, s));
  }
  // Colour of the i-th element of a repeated style: a fixed colour when one is
  // configured, otherwise the gradient palette sampled at that position.
  _elementColor(t, e, i, a) {
    return !!(t.color || t.severity || this._config.color || this._config.severity) ? e : st(this._gradientColors(), (i + 0.5) / a);
  }
  _visualStripes(t) {
    const { barStyle: e, targetMarker: i, minMaxMarker: a, showValueInBar: r, displayValue: s } = t;
    return p`
      <div class="bar-bg">
        ${a}
        <div class="bar-fill no-shimmer stripes-fill" style="${e}"></div>
        ${i}
        ${r ? p`<span class="bar-value">${s}</span>` : ""}
      </div>`;
  }
  _visualGlass(t) {
    const { barStyle: e, targetMarker: i, minMaxMarker: a, showValueInBar: r, displayValue: s } = t;
    return p`
      <div class="bar-bg glass-track">
        ${a}
        <div class="bar-fill no-shimmer glass-fill" style="${e}"></div>
        ${i}
        ${r ? p`<span class="bar-value">${s}</span>` : ""}
      </div>`;
  }
  _visualDots(t) {
    const { layout: e, percent: i, conf: a, color: r } = t, s = this._countFor("dots", a), o = i / 100 * s, l = Math.floor(o), c = o - l, d = [];
    for (let n = 0; n < s; n++) {
      const g = this._elementColor(a, r, n, s);
      let u = "";
      n < l ? u = `background: ${g}; box-shadow: 0 0 6px ${g}66;` : n === l && c > 0.05 && (u = `background: ${g}; opacity: ${(0.25 + 0.75 * c).toFixed(2)}; transform: scale(${(0.7 + 0.3 * c).toFixed(2)});`), d.push(p`<div class="dot" style="${u}"></div>`);
    }
    return p`<div class="dot-track ${e === "vertical" ? "vertical" : ""}">${d}</div>`;
  }
  _visualChevrons(t) {
    const { layout: e, percent: i, conf: a, color: r } = t, s = this._countFor("chevrons", a), o = Math.round(i / 100 * s), l = [];
    for (let c = 0; c < s; c++) {
      const d = this._elementColor(a, r, c, s);
      l.push(p`<div class="chev" style="${c < o ? `background: ${d}; box-shadow: 0 0 6px ${d}55;` : ""}"></div>`);
    }
    return p`<div class="chev-track ${e === "vertical" ? "vertical" : ""}">${l}</div>`;
  }
  _visualEqualizer(t) {
    const { percent: e, conf: i, color: a } = t, r = this._countFor("equalizer", i), s = Math.round(e / 100 * r), o = [];
    for (let l = 0; l < r; l++) {
      const c = this._elementColor(i, a, l, r), d = 28 + 72 * ((l + 1) / r);
      o.push(p`<div class="eq-bar" style="height: ${d.toFixed(1)}%; ${l < s ? `background: ${c}; box-shadow: 0 0 6px ${c}66;` : ""}"></div>`);
    }
    return p`<div class="eq-track">${o}</div>`;
  }
  _visualBattery(t) {
    const { layout: e, percent: i, color: a, showValueInBar: r, displayValue: s, targetMarker: o, minMaxMarker: l } = t, c = e === "vertical", d = c ? `height: ${i}%; background: ${a};` : `width: ${i}%; background: ${a};`, n = p`
      <div class="bat-body">
        ${l}
        <div class="bat-fill" style="${d}"></div>
        ${o}
        ${r ? p`<span class="bat-value">${s}</span>` : ""}
      </div>`, g = p`<div class="bat-cap"></div>`;
    return p`
      <div class="bat-wrap ${c ? "vertical" : ""}">
        ${c ? p`${g}${n}` : p`${n}${g}`}
      </div>`;
  }
  _visualThermometer(t) {
    const { layout: e, percent: i, color: a, showValueInBar: r, displayValue: s, targetMarker: o, minMaxMarker: l } = t, c = e === "vertical", d = this._solidColor(a, i / 100), n = c ? `height: ${i}%; background: ${a};` : `width: ${i}%; background: ${a};`;
    return p`
      <div class="thermo-wrap ${c ? "vertical" : ""}">
        <div class="thermo-bulb" style="background: ${d};"></div>
        <div class="thermo-tube">
          ${l}
          <div class="thermo-fill" style="${n}"></div>
          <div class="thermo-grad"></div>
          ${o}
          ${r ? p`<span class="thermo-value">${s}</span>` : ""}
        </div>
      </div>`;
  }
  _visualNeedle(t) {
    const { layout: e, percent: i, color: a, min: r, max: s, conf: o, showValueInBar: l, displayValue: c } = t, d = e === "vertical", n = this._gradientCssFor(e), g = this._solidColor(a, i / 100), u = Math.max(0, Math.min(100, i)), v = this._resolveTarget(o);
    let m = p``;
    if (v !== null && s !== r) {
      const b = Math.max(0, Math.min(100, (Math.max(r, Math.min(v, s)) - r) / (s - r) * 100));
      m = p`<div class="needle-target" style="${d ? `bottom: ${b}%` : `left: ${b}%`}"></div>`;
    }
    return d ? p`
        <div class="needle-wrap vertical">
          <div class="needle-band" style="background-image: ${n};"></div>
          ${m}
          <div class="needle-pointer" style="bottom: ${u}%; --lgc-needle-color: ${g};"></div>
        </div>` : p`
      <div class="needle-wrap">
        ${l ? p`<div class="needle-bubble" style="left: ${u}%">${c}</div>` : ""}
        <div class="needle-pointer" style="left: ${u}%; --lgc-needle-color: ${g};"></div>
        <div class="needle-band" style="background-image: ${n};"></div>
        ${m}
        <div class="needle-scale"><span>${r}</span><span>${s}</span></div>
      </div>`;
  }
  // Liquid tank: the fill boundary is a sine wave that scrolls sideways.
  // The polygon is drawn well outside the 0..100 view box so the CSS
  // translation of exactly one wavelength loops seamlessly.
  _visualWave(t) {
    const { layout: e, percent: i, color: a, displayValue: r, showValueInBar: s, targetMarker: o } = t, l = e === "vertical", c = this._solidColor(a, i / 100), d = Math.max(0, Math.min(100, i)), n = 3, g = 50, u = 130, v = -80, m = 180, b = d / 100 * (100 + 2 * n) - n, x = [];
    for (let w = 0; w <= u; w++) {
      const k = v + (m - v) * w / u, T = Math.sin(k / g * Math.PI * 2) * n;
      x.push(l ? `${k.toFixed(2)},${(100 - b + T).toFixed(2)}` : `${(b + T).toFixed(2)},${k.toFixed(2)}`);
    }
    const $ = l ? "180,180 -80,180" : "-80,180 -80,-80", A = `M${x.join(" L")} L${$.split(" ").join(" L")} Z`;
    return p`
      <div class="wave-wrap ${l ? "vertical" : ""}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="wave-anim" d="${A}" fill="${c}" opacity="0.9"></path>
        </svg>
        ${o}
        ${s ? p`<span class="wave-value">${r}</span>` : ""}
      </div>`;
  }
  _handleAction(t, e, i) {
    if (e.tap_action && e.tap_action.action === "none")
      return;
    t.stopPropagation();
    const a = e.tap_action || this._config.tap_action || { action: "more-info" }, r = a.action;
    if (r === "more-info") {
      const s = new CustomEvent("hass-more-info", {
        detail: { entityId: i },
        bubbles: !0,
        composed: !0
      });
      this.dispatchEvent(s);
    } else if (r === "toggle")
      this.hass.callService("homeassistant", "toggle", { entity_id: i });
    else if (r === "navigate" && a.navigation_path) {
      history.pushState(null, "", a.navigation_path);
      const s = new Event("location-changed", { bubbles: !0, composed: !0 });
      window.dispatchEvent(s);
    } else if (r === "url" && a.url_path)
      window.open(a.url_path);
    else if (r === "call-service" && a.service) {
      const [s, o] = a.service.split("."), l = { ...a.data };
      l.entity_id || (l.entity_id = i), this.hass.callService(s, o, l);
    }
  }
  _computeColor(t, e, i, a = !1) {
    if (isNaN(t)) return "var(--primary-color, #44739e)";
    if (a && t < 0) {
      if (e.color_negative) return e.color_negative;
      if (this._config.color_negative) return this._config.color_negative;
    }
    const r = a && t < 0 ? Math.abs(t) : t, s = (o) => {
      let l = i === "vertical" ? "0deg" : "90deg";
      return a && t < 0 && (l = i === "vertical" ? "180deg" : "270deg"), `linear-gradient(${l}, ${o.join(", ")})`;
    };
    if (e.severity) {
      const o = this._getSeverityMatch(r, e.severity);
      if (o) return o.color;
    }
    return e.color ? e.color : this._config.severity ? this._computeSeverity(r, this._config.severity) : this._config.color ? this._config.color : Array.isArray(this._config.colors) && this._config.colors.length > 0 ? s(this._config.colors) : "var(--primary-color, #03a9f4)";
  }
  _getSeverityMatch(t, e) {
    if (!Array.isArray(e)) return null;
    const i = parseFloat(t);
    return [...e].sort((r, s) => parseFloat(s.from) - parseFloat(r.from)).find((r) => i >= parseFloat(r.from));
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
class he extends I {
  static get properties() {
    return {
      hass: { attribute: !1 },
      _config: { state: !0 },
      _expandedEntities: { state: !0 },
      _haLoaded: { state: !0 }
    };
  }
  constructor() {
    super(), this._expandedEntities = /* @__PURE__ */ new Set(), this._haLoaded = !!customElements.get("ha-textfield");
  }
  connectedCallback() {
    super.connectedCallback(), this._haLoaded || this._ensureHaComponents();
  }
  // Some HA frontends don't have `ha-textfield` (and other editor inputs)
  // registered when a custom card editor first renders, leaving those fields
  // invisible. Loading the built-in `entities` card config element forces HA
  // to import them; existing <ha-textfield> nodes then upgrade automatically.
  async _ensureHaComponents() {
    try {
      if (window.loadCardHelpers) {
        const e = await (await window.loadCardHelpers()).createCardElement({ type: "entities", entities: [] });
        e && e.constructor && e.constructor.getConfigElement && await e.constructor.getConfigElement();
      }
      await customElements.whenDefined("ha-textfield");
    } catch {
    } finally {
      this._haLoaded = !0;
    }
  }
  setConfig(t) {
    this._config = t;
  }
  // Native <input> replacement for ha-textfield, which isn't always registered
  // in every HA frontend (it would otherwise render invisibly).
  _plainInput({ label: t, value: e, placeholder: i = "", type: a = "text", oninput: r, configValue: s, style: o = "" }) {
    return p`
      <div class="text-input-group" style=${o}>
        <label>${t}</label>
        <input
          class="plain-input"
          type=${a}
          .value=${e ?? ""}
          placeholder=${i}
          .configValue=${s}
          @input=${r}
        />
      </div>`;
  }
  static get styles() {
    return At`
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
      select: { mode: "dropdown", options: wt }
    }, i = {
      select: { mode: "dropdown", options: kt }
    }, a = { entity: { domain: "sensor" } }, r = this._config.colors || [];
    return p`
      <div class="card-config">

        <div class="section-title">Card Settings</div>
        <div class="text-input-group">
          <label>Card Title</label>
          <input
            class="plain-input"
            type="text"
            placeholder="Optional title shown at the top of the card"
            .value=${this._config.title || ""}
            @input=${(s) => this._plainValueChanged(s, "title")}
          />
        </div>

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
            label="Gauge Style"
            .hass=${this.hass}
            .selector=${e}
            .value=${this._config.gauge_style || (this._config.effect === "led" ? "segments" : "bar")}
            .configValue=${"gauge_style"}
            @value-changed=${this._valueChanged}
          ></ha-selector>
        </div>

        <div class="row">
          <div class="text-input-group">
            <label>Element count (segments, dots, chevrons, equalizer)</label>
            <input
              class="plain-input"
              type="number"
              min="3"
              max="120"
              placeholder="20"
              .value=${this._config.segment_count ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "segment_count", "int")}
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
              .value=${this._config.tick_count ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "tick_count", "int")}
            />
          </div>
        </div>

        <div class="row">
          <ha-selector
            label="Cursor shape (cursor style)"
            .hass=${this.hass}
            .selector=${i}
            .value=${this._config.cursor_shape || "circle"}
            .configValue=${"cursor_shape"}
            @value-changed=${this._valueChanged}
          ></ha-selector>
          <div class="text-input-group">
            <label>Wave height (px)</label>
            <input
              class="plain-input"
              type="number"
              min="16"
              placeholder="40"
              .value=${this._config.wave_height ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "wave_height", "int")}
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
              .value=${this._config.equalizer_height ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "equalizer_height", "int")}
            />
          </div>
          <div class="text-input-group">
            <label>Battery height (px)</label>
            <input
              class="plain-input"
              type="number"
              min="12"
              placeholder="22"
              .value=${this._config.battery_size ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "battery_size", "int")}
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
              @input=${(s) => this._plainNumberChanged(s, "min", "float")}
            />
          </div>
          <div class="text-input-group">
            <label>Max</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.max ?? 100}
              @input=${(s) => this._plainNumberChanged(s, "max", "float")}
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
              @input=${(s) => this._plainNumberChanged(s, "bar_thickness", "float")}
            />
          </div>
          <div class="text-input-group">
            <label>Value Precision (decimals)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.value_precision ?? 1}
              @input=${(s) => this._plainNumberChanged(s, "value_precision", "int")}
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
              @input=${(s) => this._plainNumberChanged(s, "vertical_height", "float")}
            />
          </div>
          <div class="text-input-group">
            <label>Vertical Width (px)</label>
            <input
              class="plain-input"
              type="number"
              .value=${this._config.vertical_width ?? 16}
              @input=${(s) => this._plainNumberChanged(s, "vertical_width", "float")}
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
              .value=${this._config.entities_gap ?? ""}
              @input=${(s) => this._plainNumberChanged(s, "entities_gap", "float")}
            />
          </div>
        </div>

        <div class="row">
           <div style="flex: 1;">
               <div class="section-title">Gradient Colors (Global)</div>
               <div class="colors-list">
                    ${r.map((s, o) => p`
                        <div style="position: relative;">
                             <input type="color" 
                                .value=${s} 
                                @input=${(l) => this._globalColorChanged(l, o)}
                                style="width: 40px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;"
                             >
                             <ha-icon-button
                                .path=${O}
                                style="position: absolute; top: -14px; right: -14px; color: grey; --mdc-icon-button-size: 24px;"
                                @click=${() => this._removeGlobalColor(o)}
                             ></ha-icon-button>
                        </div>
                    `)}
                    <ha-icon-button
                        .path=${ne}
                        style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 40px; height: 40px;"
                        @click=${this._addGlobalColor}
                    ></ha-icon-button>
               </div>
               ${r.length === 0 ? p`<div style="font-size: 0.8em; opacity: 0.6; margin-top: 4px;">Use "+" to add colors. If empty, default blue is used.</div>` : ""}
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
          <span>Hide Icon</span>
          <ha-switch
            .checked=${this._config.hide_icon || !1}
            .configValue=${"hide_icon"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>

        <div class="row">
          <span>Hide Bar at Zero</span>
          <ha-switch
            .checked=${this._config.hide_zero_bar || !1}
            .configValue=${"hide_zero_bar"}
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
            ${(this._config.entities || []).map((s, o) => this._renderEntityRow(s, o, a))}
          </div>
          <mwc-button class="add-button" outlined @click=${this._addEntity}>
            Add Entity
          </mwc-button>
        </div>

      </div>
    `;
  }
  _renderEntityRow(t, e, i) {
    const a = typeof t == "string" ? t : t.entity, r = typeof t == "object" ? t.color : void 0, s = typeof r == "string" && r !== "", o = this._expandedEntities.has(e), l = typeof t == "object" ? t : { entity: t };
    return p`
      <div class="entity-row">
        <div class="entity-header">
          <div style="flex: 1;">
              <ha-selector
                .hass=${this.hass}
                .selector=${i}
                .value=${a}
                @value-changed=${(c) => this._entityChanged(c, e, "entity")}
              ></ha-selector>
          </div>

           <ha-icon-button
            .path=${o ? re : se}
            @click=${() => this._toggleExpand(e)}
          ></ha-icon-button>

          <ha-icon-button
            class="delete"
            .path=${O}
            @click=${() => this._removeEntity(e)}
          ></ha-icon-button>
        </div>

        <div class="text-input-group">
          <label>Display name (optional)</label>
          <input
            class="plain-input"
            type="text"
            placeholder="Override the entity friendly name"
            .value=${l.name || ""}
            @input=${(c) => this._entityPlainChanged(c, e, "name")}
          />
        </div>

        ${o ? this._renderEntityDetails(l, e, r, s) : ""}
      </div>
    `;
  }
  _renderColorWithAlpha(t, e) {
    let i = "#ffffff", a = 1;
    if (e)
      if (e.startsWith("rgba")) {
        const s = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (s) {
          const o = parseInt(s[1]), l = parseInt(s[2]), c = parseInt(s[3]);
          a = s[4] !== void 0 ? parseFloat(s[4]) : 1, i = "#" + [o, l, c].map((d) => d.toString(16).padStart(2, "0")).join("");
        }
      } else if (e.startsWith("rgb")) {
        const s = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (s) {
          const o = parseInt(s[1]), l = parseInt(s[2]), c = parseInt(s[3]);
          i = "#" + [o, l, c].map((d) => d.toString(16).padStart(2, "0")).join("");
        }
      } else e.startsWith("#") && (i = e.substring(0, 7), e.length === 9 && (a = parseInt(e.substring(7, 9), 16) / 255));
    const r = Math.round(a * 100);
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
              @input=${(s) => this._updateColorWithAlpha(s.target.value, a, t)}
              style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;"
            >
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 0.85em; opacity: 0.8;">Opacity: ${r}%</span>
              ${e ? p`
                <ha-icon-button
                  .path=${O}
                  style="color: var(--error-color); --mdc-icon-button-size: 32px;"
                  @click=${() => this._clearColorValue(t)}
                ></ha-icon-button>
              ` : ""}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              .value=${r}
              @input=${(s) => this._updateColorWithAlpha(i, parseInt(s.target.value) / 100, t)}
              style="width: 100%; height: 6px; cursor: pointer;"
            >
          </div>
        </div>
        ${this._plainInput({
      label: "CSS Color",
      value: e || "",
      configValue: t,
      oninput: this._valueChanged
    })}
      </div>
    `;
  }
  _updateColorWithAlpha(t, e, i) {
    if (!this._config) return;
    const a = parseInt(t.substring(1, 3), 16), r = parseInt(t.substring(3, 5), 16), s = parseInt(t.substring(5, 7), 16);
    e = Math.round(e * 100) / 100;
    const o = e === 1 ? t : `rgba(${a}, ${r}, ${s}, ${e})`;
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
  _renderEntityDetails(t, e, i, a) {
    const r = t.pulse || {}, s = t.severity || [], o = t.tap_action || { action: "more-info" }, l = [
      { value: "more-info", label: "More Info" },
      { value: "toggle", label: "Toggle" },
      { value: "navigate", label: "Navigate" },
      { value: "url", label: "Open URL" },
      { value: "call-service", label: "Call Service" },
      { value: "none", label: "None" }
    ], c = [
      { value: "", label: "(inherit global)" },
      ...wt
    ], d = kt;
    return p`
        <div class="entity-details">
            <div class="row">
                ${this._plainInput({
      label: "Icon (e.g., mdi:thermometer)",
      value: t.icon || "",
      oninput: (n) => this._entityChanged(n, e, "icon")
    })}
            </div>
            <div class="row">
                ${this._plainInput({
      label: "Min",
      type: "number",
      value: t.min ?? "",
      placeholder: this._config.min ?? 0,
      oninput: (n) => this._entityChanged(n, e, "min")
    })}
                ${this._plainInput({
      label: "Max",
      type: "number",
      value: t.max ?? "",
      placeholder: this._config.max ?? 100,
      oninput: (n) => this._entityChanged(n, e, "max")
    })}
                ${this._plainInput({
      label: "Target",
      type: "number",
      value: t.target ?? "",
      oninput: (n) => this._entityChanged(n, e, "target")
    })}
                ${this._plainInput({
      label: "Precision",
      type: "number",
      value: t.value_precision ?? "",
      placeholder: this._config.value_precision ?? 1,
      oninput: (n) => this._entityChanged(n, e, "value_precision")
    })}
            </div>
            <div class="row" style="align-items: center;">
                <ha-selector
                    style="flex: 1;"
                    label="Target Entity (marker)"
                    .hass=${this.hass}
                    .selector=${{ entity: {} }}
                    .value=${t.target_entity || ""}
                    @value-changed=${(n) => this._entityChanged(n, e, "target_entity")}
                ></ha-selector>
                ${t.target_entity ? p`
                    <ha-icon-button
                        class="delete"
                        .path=${O}
                        @click=${() => this._clearEntityField(e, "target_entity")}
                        title="Clear target entity"
                    ></ha-icon-button>
                ` : ""}
            </div>
            <div class="row">
                <ha-selector
                    label="Gauge Style"
                    .hass=${this.hass}
                    .selector=${{ select: { mode: "dropdown", options: c } }}
                    .value=${t.gauge_style || (t.effect === "led" ? "segments" : "")}
                    @value-changed=${(n) => this._entityChanged(n, e, "gauge_style")}
                ></ha-selector>
                ${this._plainInput({
      label: "Element count",
      type: "number",
      value: t.segment_count ?? "",
      placeholder: this._config.segment_count ?? 20,
      oninput: (n) => this._entityChanged(n, e, "segment_count")
    })}
            </div>
            <div class="row">
                ${this._plainInput({
      label: "Tick count (ticks style)",
      type: "number",
      value: t.tick_count ?? "",
      placeholder: this._config.tick_count ?? 5,
      oninput: (n) => this._entityChanged(n, e, "tick_count")
    })}
                <ha-selector
                    label="Cursor shape"
                    .hass=${this.hass}
                    .selector=${{ select: { mode: "dropdown", options: d } }}
                    .value=${t.cursor_shape || "circle"}
                    @value-changed=${(n) => this._entityChanged(n, e, "cursor_shape")}
                ></ha-selector>
            </div>

            <div class="row">
                <span>Compact Mode</span>
                <ha-switch
                    .checked=${t.compact_mode || !1}
                    @change=${(n) => this._entityChanged(n, e, "compact_mode")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Hide Icon</span>
                <ha-switch
                    .checked=${t.hide_icon || !1}
                    @change=${(n) => this._entityChanged(n, e, "hide_icon")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Hide Bar at Zero</span>
                <ha-switch
                    .checked=${t.hide_zero_bar || !1}
                    @change=${(n) => this._entityChanged(n, e, "hide_zero_bar")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Show Value in Bar</span>
                <ha-switch
                    .checked=${t.show_value_in_bar || !1}
                    @change=${(n) => this._entityChanged(n, e, "show_value_in_bar")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Disable Shimmer Effect</span>
                <ha-switch
                    .checked=${t.disable_shimmer || !1}
                    @change=${(n) => this._entityChanged(n, e, "disable_shimmer")}
                ></ha-switch>
            </div>
            
            <div class="row">
                <span>Center Zero</span>
                <ha-switch
                    .checked=${t.center_zero || !1}
                    @change=${(n) => this._entityChanged(n, e, "center_zero")}
                ></ha-switch>
            </div>
            
            <div>
                 <div class="entity-color-toggle">
                    <span>Custom Color (override global)</span>
                    <ha-switch
                      .checked=${a}
                      @change=${(n) => this._toggleEntityColor(n, e)}
                    ></ha-switch>
                 </div>
                 ${a ? p`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${i || "#03a9f4"}
                            @input=${(n) => this._entityChanged(n, e, "color")}
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
                      @change=${(n) => this._toggleEntityNegativeColor(n, e)}
                    ></ha-switch>
                 </div>
                 ${t.color_negative ? p`
                    <div style="display: flex; align-items: center; justify-content: flex-end;">
                         <input
                            type="color"
                            .value=${t.color_negative || "#f44336"}
                            @input=${(n) => this._entityChanged(n, e, "color_negative")}
                            style="height: 40px; width: 100%; padding: 0; border: none; background: none; cursor: pointer;"
                         >
                    </div>
                 ` : ""}
            </div>

            <div>
                 <div class="section-title">Tap Action</div>
                 <ha-selector
                    .hass=${this.hass}
                    .selector=${{ select: { options: l } }}
                    .value=${o.action}
                    @value-changed=${(n) => this._tapActionChanged(n, e, "action")}
                 ></ha-selector>

                 ${o.action === "navigate" ? this._plainInput({
      label: "Navigation Path",
      value: o.navigation_path || "",
      oninput: (n) => this._tapActionChanged(n, e, "navigation_path"),
      style: "margin-top: 8px;"
    }) : ""}

                 ${o.action === "url" ? this._plainInput({
      label: "URL",
      value: o.url_path || "",
      oninput: (n) => this._tapActionChanged(n, e, "url_path"),
      style: "margin-top: 8px;"
    }) : ""}

                 ${o.action === "call-service" ? this._plainInput({
      label: "Service (e.g., light.turn_on)",
      value: o.service || "",
      oninput: (n) => this._tapActionChanged(n, e, "service"),
      style: "margin-top: 8px;"
    }) : ""}
            </div>

            <div>
                <div class="section-title">Pulse (Animation)</div>
                <div class="row">
                     ${this._plainInput({
      label: "Threshold",
      type: "number",
      value: r.value ?? "",
      oninput: (n) => this._pulseChanged(n, e, "value")
    })}
                    <ha-selector
                        label="Condition"
                        .hass=${this.hass}
                        .selector=${{ select: { options: [{ value: "above", label: "> Above" }, { value: "below", label: "< Below" }] } }}
                        .value=${r.condition || "above"}
                        @value-changed=${(n) => this._pulseChanged(n, e, "condition")}
                    ></ha-selector>
                </div>
            </div>

            <div>
                <div class="section-title">Severity (Local Gradient)</div>
                ${s.map((n, g) => p`
                    <div class="severity-row">
                        ${this._plainInput({
      label: "From",
      type: "number",
      value: n.from ?? 0,
      oninput: (u) => this._severityChanged(u, e, g, "from"),
      style: "width: 80px;"
    })}
                         <input
                            type="color"
                            .value=${n.color || "#00ff00"}
                            @input=${(u) => this._severityChanged(u, e, g, "color")}
                            style="flex: 1; height: 40px; border: none; background: none; cursor: pointer;"
                         >
                         <ha-icon-button
                            class="delete"
                            .path=${O}
                            @click=${() => this._removeSeverityBand(e, g)}
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
    let i = e.value, a = e.configValue;
    if (t.detail && t.detail.value !== void 0 && (i = t.detail.value), e.tagName === "HA-SWITCH" && (i = e.checked), !a && e.configValue && (a = e.configValue), (a === "min" || a === "max" || a === "bar_thickness" || a === "vertical_height" || a === "vertical_width" || a === "entities_gap") && (i = parseFloat(i)), a === "value_precision" && (i = parseInt(i)), a === "entities_gap" && (isNaN(i) || e.value === "")) {
      const r = { ...this._config };
      delete r[a], this._config = r, this._fireChangedEvent();
      return;
    }
    if (a === "cursor_shape" && (!i || i === "circle")) {
      const r = { ...this._config };
      delete r[a], this._config = r, this._fireChangedEvent();
      return;
    }
    a && (this._config = {
      ...this._config,
      [a]: i
    }, this._fireChangedEvent());
  }
  _plainNumberChanged(t, e, i) {
    if (!this._config) return;
    const a = t.target.value;
    if (a === "" || a === void 0 || a === null) {
      const s = { ...this._config };
      delete s[e], this._config = s, this._fireChangedEvent();
      return;
    }
    const r = i === "int" ? parseInt(a) : parseFloat(a);
    isNaN(r) || (this._config = { ...this._config, [e]: r }, this._fireChangedEvent());
  }
  _plainValueChanged(t, e) {
    if (!this._config) return;
    const i = t.target.value;
    if (i === "" || i === void 0 || i === null) {
      const a = { ...this._config };
      delete a[e], this._config = a;
    } else
      this._config = { ...this._config, [e]: i };
    this._fireChangedEvent();
  }
  _entityPlainChanged(t, e, i) {
    const a = [...this._config.entities || []];
    let r = a[e];
    typeof r == "string" ? r = { entity: r } : r = { ...r };
    const s = t.target.value;
    s === "" || s === void 0 || s === null ? delete r[i] : r[i] = s, a[e] = r, this._config = { ...this._config, entities: a }, this._fireChangedEvent();
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
    const a = [...this._config.entities || []];
    let r = a[e];
    typeof r == "string" ? r = { entity: r } : r = { ...r };
    let s;
    t.detail && t.detail.value !== void 0 ? s = t.detail.value : s = t.target.value, t.target && t.target.tagName === "HA-SWITCH" && (s = t.target.checked), i === "target" ? s === "" || s === void 0 || s === null ? delete r[i] : r[i] = parseFloat(s) : i === "target_entity" ? s ? r[i] = s : delete r[i] : i === "tick_count" || i === "segment_count" ? s === "" || s === void 0 || s === null || isNaN(s) ? delete r[i] : r[i] = parseInt(s, 10) : i === "gauge_style" && (!s || s === "") || i === "cursor_shape" && (!s || s === "circle") ? delete r[i] : i === "value_precision" ? s === "" || s === void 0 || s === null || isNaN(s) ? delete r[i] : (s = parseInt(s), r[i] = s) : i === "min" || i === "max" ? s === "" || s === void 0 || s === null ? delete r[i] : (s = parseFloat(s), r[i] = s) : i === "effect" && s === "default" || (i === "compact_mode" || i === "show_value_in_bar" || i === "disable_shimmer" || i === "center_zero" || i === "hide_icon" || i === "hide_zero_bar") && !s || i === "color_negative" && (!s || s === "") ? delete r[i] : r[i] = s, a[e] = r, this._config = { ...this._config, entities: a }, this._fireChangedEvent();
  }
  _toggleEntityColor(t, e) {
    const i = [...this._config.entities || []];
    let a = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? a.color = "#03a9f4" : delete a.color, i[e] = a, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _toggleEntityNegativeColor(t, e) {
    const i = [...this._config.entities || []];
    let a = { ...typeof i[e] == "string" ? { entity: i[e] } : i[e] };
    t.target.checked ? a.color_negative = "#f44336" : delete a.color_negative, i[e] = a, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _clearEntityField(t, e) {
    const i = [...this._config.entities || []];
    let a = { ...typeof i[t] == "string" ? { entity: i[t] } : i[t] };
    delete a[e], i[t] = a, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
  }
  _tapActionChanged(t, e, i) {
    const a = [...this._config.entities || []];
    let r = { ...typeof a[e] == "string" ? { entity: a[e] } : a[e] }, s = { ...r.tap_action || { action: "more-info" } }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, s[i] = o, r.tap_action = s, a[e] = r, this._config = { ...this._config, entities: a }, this._fireChangedEvent();
  }
  _pulseChanged(t, e, i) {
    const a = [...this._config.entities || []];
    let r = { ...typeof a[e] == "string" ? { entity: a[e] } : a[e] }, s = { ...r.pulse || {} }, o;
    t.detail && t.detail.value !== void 0 ? o = t.detail.value : o = t.target.value, s[i] = i === "value" ? parseFloat(o) : o, r.pulse = s, a[e] = r, this._config = { ...this._config, entities: a }, this._fireChangedEvent();
  }
  _severityChanged(t, e, i, a) {
    const r = [...this._config.entities || []];
    let s = { ...typeof r[e] == "string" ? { entity: r[e] } : r[e] }, o = [...s.severity || []], l = { ...o[i] }, c = t.target.value;
    l[a] = a === "from" ? parseFloat(c) : c, o[i] = l, s.severity = o, r[e] = s, this._config = { ...this._config, entities: r }, this._fireChangedEvent();
  }
  _addSeverityBand(t) {
    const e = [...this._config.entities || []];
    let i = { ...typeof e[t] == "string" ? { entity: e[t] } : e[t] }, a = [...i.severity || []];
    a.push({ from: 0, color: "#00ff00" }), i.severity = a, e[t] = i, this._config = { ...this._config, entities: e }, this._fireChangedEvent();
  }
  _removeSeverityBand(t, e) {
    const i = [...this._config.entities || []];
    let a = { ...typeof i[t] == "string" ? { entity: i[t] } : i[t] }, r = [...a.severity || []];
    r.splice(e, 1), a.severity = r, i[t] = a, this._config = { ...this._config, entities: i }, this._fireChangedEvent();
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
const de = "1.3.0";
console.info(
  `%c LINEAR-GAUGE-CARD %c ${de} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: #1c1c1c; font-weight: 700;"
);
customElements.define("linear-gauge-card-editor", he);
customElements.define("linear-gauge-card", ce);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "linear-gauge-card",
  name: "Linear Gauge Card",
  description: "A linear gauge card for Home Assistant",
  preview: !0,
  documentationURL: "https://github.com/guiohm79/jaugeLineaire"
});
