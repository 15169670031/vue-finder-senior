var rr = Object.defineProperty;
var lr = (t, e, n) => e in t ? rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var En = (t, e, n) => lr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as St, watch as Ve, ref as A, shallowRef as ar, onMounted as Ce, onUnmounted as Jn, onUpdated as Rs, nextTick as vt, computed as wt, inject as re, createElementBlock as g, openBlock as f, withKeys as $t, unref as r, createElementVNode as l, withModifiers as et, renderSlot as Lt, normalizeClass as ae, toDisplayString as b, createBlock as K, resolveDynamicComponent as Us, withCtx as J, createVNode as q, createCommentVNode as R, Fragment as we, renderList as xe, withDirectives as ve, vModelCheckbox as Xt, createTextVNode as Z, vModelSelect as In, vModelText as Ct, onBeforeUnmount as Ns, customRef as ir, vShow as ze, isRef as cr, TransitionGroup as dr, normalizeStyle as vn, mergeModels as ur, useModel as Ps, resolveComponent as vr, provide as fr, Transition as _r } from "vue";
import mr from "mitt";
import pr from "dragselect";
import hr from "@uppy/core";
import gr from "@uppy/xhr-upload";
import br from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import wr from "cropperjs";
var Bs;
const Tn = (Bs = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Bs.getAttribute("content");
class yr {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    En(this, "config");
    En(this, "customFetch", async (...e) => {
      let [n, o] = e;
      this.config.fetchRequestInterceptor && (o = this.config.fetchRequestInterceptor(o));
      let s = await fetch(n, o);
      return this.config.fetchResponseInterceptor && (s = await this.config.fetchResponseInterceptor(s)), s;
    });
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const n = this.config, o = {};
    Tn != null && Tn !== "" && (o[n.xsrfHeaderName] = Tn);
    const s = Object.assign({}, n.headers, o, e.headers), i = Object.assign({}, n.params, e.params), c = e.body, u = n.baseUrl + e.url, a = e.method;
    let d;
    a !== "get" && (c instanceof FormData ? (d = c, n.body != null && Object.entries(this.config.body).forEach(([v, p]) => {
      d.append(v, p);
    })) : (d = { ...c }, n.body != null && Object.assign(d, this.config.body)));
    const _ = {
      url: u,
      method: a,
      headers: s,
      params: i,
      body: d
    };
    if (n.transformRequest != null) {
      const v = n.transformRequest({
        url: u,
        method: a,
        headers: s,
        params: i,
        body: d
      });
      v.url != null && (_.url = v.url), v.method != null && (_.method = v.method), v.params != null && (_.params = v.params ?? {}), v.headers != null && (_.headers = v.headers ?? {}), v.body != null && (_.body = v.body);
    }
    return _;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, n) {
    if (n.url != null)
      return n.url;
    const o = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return o.url + "?" + new URLSearchParams(o.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, n) {
    if (n.url != null)
      return n.url;
    const o = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return o.url + "?" + new URLSearchParams(o.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    const n = this.transformRequestParams(e), o = e.responseType || "json", s = {
      method: e.method,
      headers: n.headers,
      signal: e.abortSignal
    }, i = n.url + "?" + new URLSearchParams(n.params);
    if (n.method !== "get" && n.body != null) {
      let u;
      n.body instanceof FormData ? u = e.body : (u = JSON.stringify(n.body), s.headers["Content-Type"] = "application/json"), s.body = u;
    }
    this.config.fetchParams && Object.assign(s, this.config.fetchParams);
    const c = await this.customFetch(i, s);
    if (c.ok)
      return await c[o]();
    throw await c.json();
  }
}
function kr(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token",
    fetchParams: {}
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new yr(e);
}
function xr(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = St(JSON.parse(e ?? "{}"));
  Ve(n, o);
  function o() {
    Object.keys(n).length ? localStorage.setItem(t + "_storage", JSON.stringify(n)) : localStorage.removeItem(t + "_storage");
  }
  function s(a, d) {
    n[a] = d;
  }
  function i(a) {
    delete n[a];
  }
  function c() {
    Object.keys(n).map((a) => i(a));
  }
  return { getStore: (a, d = null) => n.hasOwnProperty(a) ? n[a] : d, setStore: s, removeStore: i, clearStore: c };
}
async function Sr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function $r(t, e, n, o) {
  const { getStore: s, setStore: i } = t, c = A({}), u = A(s("locale", e)), a = (v, p = e) => {
    Sr(v, o).then((m) => {
      c.value = m, i("locale", v), u.value = v, i("translations", m), Object.values(o).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + v }), n.emit("vf-language-saved"));
    }).catch((m) => {
      p ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), a(p, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  Ve(u, (v) => {
    a(v);
  }), !s("locale") && !o.length ? a(e) : c.value = s("translations");
  const d = (v, ...p) => p.length ? d(v = v.replace("%s", p.shift()), ...p) : v;
  function _(v, ...p) {
    return c.value && c.value.hasOwnProperty(v) ? d(c.value[v], ...p) : d(v, ...p);
  }
  return St({ t: _, locale: u });
}
const ue = {
  EDIT: "edit",
  NEW_FILE: "newfile",
  NEW_FOLDER: "newfolder",
  PREVIEW: "preview",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  SEARCH: "search",
  RENAME: "rename",
  UPLOAD: "upload",
  DELETE: "delete",
  FULL_SCREEN: "fullscreen",
  DOWNLOAD: "download",
  LANGUAGE: "language"
}, Cr = Object.values(ue), Er = "2.7.1";
function qs(t, e, n, o, s) {
  return (e = Math, n = e.log, o = 1024, s = n(t) / n(o) | 0, t / e.pow(o, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function zs(t, e, n, o, s) {
  return (e = Math, n = e.log, o = 1e3, s = n(t) / n(o) | 0, t / e.pow(o, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function Tr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, o = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return o[1] * Math.pow(1024, e[o[2].toLowerCase()]);
}
const ot = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Mr(t, e) {
  const n = A(ot.SYSTEM), o = A(ot.LIGHT);
  n.value = t.getStore("theme", e ?? ot.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), i = (c) => {
    n.value === ot.DARK || n.value === ot.SYSTEM && c.matches ? o.value = ot.DARK : o.value = ot.LIGHT;
  };
  return i(s), s.addEventListener("change", i), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: o,
    /**
     * @param {Theme} value
     */
    set(c) {
      n.value = c, c !== ot.SYSTEM ? t.setStore("theme", c) : t.removeStore("theme"), i(s);
    }
  };
}
function Ar() {
  const t = ar(null), e = A(!1), n = A();
  return { visible: e, type: t, data: n, open: (i, c = null) => {
    document.querySelector("body").style.overflow = "hidden", e.value = !0, t.value = i, n.value = c;
  }, close: () => {
    document.querySelector("body").style.overflow = "", e.value = !1, t.value = null;
  } };
}
/*!
 * OverlayScrollbars
 * Version: 2.11.1
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const Oe = (t, e) => {
  const { o: n, i: o, u: s } = t;
  let i = n, c;
  const u = (_, v) => {
    const p = i, m = _, h = v || (o ? !o(p, m) : p !== m);
    return (h || s) && (i = m, c = p), [i, h, c];
  };
  return [e ? (_) => u(e(i, c), _) : u, (_) => [i, !!_, c]];
}, Dr = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, Le = Dr ? window : {}, js = Math.max, Vr = Math.min, Hn = Math.round, sn = Math.abs, bs = Math.sign, Gs = Le.cancelAnimationFrame, es = Le.requestAnimationFrame, on = Le.setTimeout, Bn = Le.clearTimeout, fn = (t) => typeof Le[t] < "u" ? Le[t] : void 0, Lr = fn("MutationObserver"), ws = fn("IntersectionObserver"), mt = fn("ResizeObserver"), Vt = fn("ScrollTimeline"), ts = (t) => t === void 0, _n = (t) => t === null, Ge = (t) => typeof t == "number", Ht = (t) => typeof t == "string", mn = (t) => typeof t == "boolean", Re = (t) => typeof t == "function", We = (t) => Array.isArray(t), rn = (t) => typeof t == "object" && !We(t) && !_n(t), ns = (t) => {
  const e = !!t && t.length, n = Ge(e) && e > -1 && e % 1 == 0;
  return We(t) || !Re(t) && n ? e > 0 && rn(t) ? e - 1 in t : !0 : !1;
}, ln = (t) => !!t && t.constructor === Object, an = (t) => t instanceof HTMLElement, pn = (t) => t instanceof Element;
function ie(t, e) {
  if (ns(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && ie(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const Ws = (t, e) => t.indexOf(e) >= 0, Ot = (t, e) => t.concat(e), he = (t, e, n) => (!Ht(e) && ns(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), it = (t) => Array.from(t || []), ss = (t) => We(t) ? t : !Ht(t) && ns(t) ? it(t) : [t], Rn = (t) => !!t && !t.length, Un = (t) => it(new Set(t)), Ie = (t, e, n) => {
  ie(t, (s) => s ? s.apply(void 0, e || []) : !0), n || (t.length = 0);
}, Ks = "paddingTop", Ys = "paddingRight", Xs = "paddingLeft", Zs = "paddingBottom", Qs = "marginLeft", Js = "marginRight", eo = "marginBottom", to = "overflowX", no = "overflowY", hn = "width", gn = "height", rt = "visible", ut = "hidden", yt = "scroll", Or = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, bn = (t, e, n, o) => {
  if (t && e) {
    let s = !0;
    return ie(n, (i) => {
      const c = t[i], u = e[i];
      c !== u && (s = !1);
    }), s;
  }
  return !1;
}, so = (t, e) => bn(t, e, ["w", "h"]), en = (t, e) => bn(t, e, ["x", "y"]), Fr = (t, e) => bn(t, e, ["t", "r", "b", "l"]), lt = () => {
}, X = (t, ...e) => t.bind(0, ...e), pt = (t) => {
  let e;
  const n = t ? on : es, o = t ? Bn : Gs;
  return [(s) => {
    o(e), e = n(() => s(), Re(t) ? t() : t);
  }, () => o(e)];
}, cn = (t, e) => {
  const { _: n, p: o, v: s, S: i } = e || {};
  let c, u, a, d, _ = lt;
  const v = function($) {
    _(), Bn(c), d = c = u = void 0, _ = lt, t.apply(this, $);
  }, p = (x) => i && u ? i(u, x) : x, m = () => {
    _ !== lt && v(p(a) || a);
  }, h = function() {
    const $ = it(arguments), M = Re(n) ? n() : n;
    if (Ge(M) && M >= 0) {
      const D = Re(o) ? o() : o, C = Ge(D) && D >= 0, V = M > 0 ? on : es, F = M > 0 ? Bn : Gs, O = p($) || $, w = v.bind(0, O);
      let y;
      _(), s && !d ? (w(), d = !0, y = V(() => d = void 0, M)) : (y = V(w, M), C && !c && (c = on(m, D))), _ = () => F(y), u = a = O;
    } else
      v($);
  };
  return h.m = m, h;
}, oo = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ue = (t) => t ? Object.keys(t) : [], oe = (t, e, n, o, s, i, c) => {
  const u = [e, n, o, s, i, c];
  return (typeof t != "object" || _n(t)) && !Re(t) && (t = {}), ie(u, (a) => {
    ie(a, (d, _) => {
      const v = a[_];
      if (t === v)
        return !0;
      const p = We(v);
      if (v && ln(v)) {
        const m = t[_];
        let h = m;
        p && !We(m) ? h = [] : !p && !ln(m) && (h = {}), t[_] = oe(h, v);
      } else
        t[_] = p ? v.slice() : v;
    });
  }), t;
}, ro = (t, e) => ie(oe({}, t), (n, o, s) => {
  n === void 0 ? delete s[o] : n && ln(n) && (s[o] = ro(n));
}), os = (t) => !Ue(t).length, lo = (t, e, n) => js(t, Vr(e, n)), ft = (t) => Un((We(t) ? t : (t || "").split(" ")).filter((e) => e)), rs = (t, e) => t && t.getAttribute(e), ys = (t, e) => t && t.hasAttribute(e), Qe = (t, e, n) => {
  ie(ft(e), (o) => {
    t && t.setAttribute(o, String(n || ""));
  });
}, qe = (t, e) => {
  ie(ft(e), (n) => t && t.removeAttribute(n));
}, wn = (t, e) => {
  const n = ft(rs(t, e)), o = X(Qe, t, e), s = (i, c) => {
    const u = new Set(n);
    return ie(ft(i), (a) => {
      u[c](a);
    }), it(u).join(" ");
  };
  return {
    O: (i) => o(s(i, "delete")),
    $: (i) => o(s(i, "add")),
    C: (i) => {
      const c = ft(i);
      return c.reduce((u, a) => u && n.includes(a), c.length > 0);
    }
  };
}, ao = (t, e, n) => (wn(t, e).O(n), X(ls, t, e, n)), ls = (t, e, n) => (wn(t, e).$(n), X(ao, t, e, n)), dn = (t, e, n, o) => (o ? ls : ao)(t, e, n), as = (t, e, n) => wn(t, e).C(n), io = (t) => wn(t, "class"), co = (t, e) => {
  io(t).O(e);
}, is = (t, e) => (io(t).$(e), X(co, t, e)), uo = (t, e) => {
  const n = e ? pn(e) && e : document;
  return n ? it(n.querySelectorAll(t)) : [];
}, Ir = (t, e) => {
  const n = e ? pn(e) && e : document;
  return n && n.querySelector(t);
}, Nn = (t, e) => pn(t) && t.matches(e), vo = (t) => Nn(t, "body"), Pn = (t) => t ? it(t.childNodes) : [], Ft = (t) => t && t.parentElement, ht = (t, e) => pn(t) && t.closest(e), qn = (t) => document.activeElement, Hr = (t, e, n) => {
  const o = ht(t, e), s = t && Ir(n, o), i = ht(s, e) === o;
  return o && s ? o === t || s === t || i && ht(ht(t, n), e) !== o : !1;
}, kt = (t) => {
  ie(ss(t), (e) => {
    const n = Ft(e);
    e && n && n.removeChild(e);
  });
}, De = (t, e) => X(kt, t && e && ie(ss(e), (n) => {
  n && t.appendChild(n);
}));
let fo;
const Br = () => fo, Rr = (t) => {
  fo = t;
}, gt = (t) => {
  const e = document.createElement("div");
  return Qe(e, "class", t), e;
}, _o = (t) => {
  const e = gt(), n = Br(), o = t.trim();
  return e.innerHTML = n ? n.createHTML(o) : o, ie(Pn(e), (s) => kt(s));
}, ks = (t, e) => t.getPropertyValue(e) || t[e] || "", mo = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, Zt = (t) => mo(parseFloat(t || "")), zn = (t) => Math.round(t * 1e4) / 1e4, po = (t) => `${zn(mo(t))}px`;
function It(t, e) {
  t && e && ie(e, (n, o) => {
    try {
      const s = t.style, i = _n(n) || mn(n) ? "" : Ge(n) ? po(n) : n;
      o.indexOf("--") === 0 ? s.setProperty(o, i) : s[o] = i;
    } catch {
    }
  });
}
function tt(t, e, n) {
  const o = Ht(e);
  let s = o ? "" : {};
  if (t) {
    const i = Le.getComputedStyle(t, n) || t.style;
    s = o ? ks(i, e) : it(e).reduce((c, u) => (c[u] = ks(i, u), c), s);
  }
  return s;
}
const xs = (t, e, n) => {
  const o = e ? `${e}-` : "", s = n ? `-${n}` : "", i = `${o}top${s}`, c = `${o}right${s}`, u = `${o}bottom${s}`, a = `${o}left${s}`, d = tt(t, [i, c, u, a]);
  return {
    t: Zt(d[i]),
    r: Zt(d[c]),
    b: Zt(d[u]),
    l: Zt(d[a])
  };
}, Mn = (t, e) => `translate${rn(t) ? `(${t.x},${t.y})` : `${e ? "X" : "Y"}(${t})`}`, Ur = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Nr = {
  w: 0,
  h: 0
}, yn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Nr, Pr = (t) => yn("inner", t || Le), bt = X(yn, "offset"), ho = X(yn, "client"), un = X(yn, "scroll"), cs = (t) => {
  const e = parseFloat(tt(t, hn)) || 0, n = parseFloat(tt(t, gn)) || 0;
  return {
    w: e - Hn(e),
    h: n - Hn(n)
  };
}, An = (t) => t.getBoundingClientRect(), qr = (t) => !!t && Ur(t), jn = (t) => !!(t && (t[gn] || t[hn])), go = (t, e) => {
  const n = jn(t);
  return !jn(e) && n;
}, Ss = (t, e, n, o) => {
  ie(ft(e), (s) => {
    t && t.removeEventListener(s, n, o);
  });
}, _e = (t, e, n, o) => {
  var s;
  const i = (s = o && o.H) != null ? s : !0, c = o && o.I || !1, u = o && o.A || !1, a = {
    passive: i,
    capture: c
  };
  return X(Ie, ft(e).map((d) => {
    const _ = u ? (v) => {
      Ss(t, d, _, c), n && n(v);
    } : n;
    return t && t.addEventListener(d, _, a), X(Ss, t, d, _, c);
  }));
}, bo = (t) => t.stopPropagation(), Gn = (t) => t.preventDefault(), wo = (t) => bo(t) || Gn(t), je = (t, e) => {
  const { x: n, y: o } = Ge(e) ? {
    x: e,
    y: e
  } : e || {};
  Ge(n) && (t.scrollLeft = n), Ge(o) && (t.scrollTop = o);
}, Fe = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), yo = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), zr = (t, e) => {
  const { D: n, M: o } = t, { w: s, h: i } = e, c = (v, p, m) => {
    let h = bs(v) * m, x = bs(p) * m;
    if (h === x) {
      const $ = sn(v), M = sn(p);
      x = $ > M ? 0 : x, h = $ < M ? 0 : h;
    }
    return h = h === x ? 0 : h, [h + 0, x + 0];
  }, [u, a] = c(n.x, o.x, s), [d, _] = c(n.y, o.y, i);
  return {
    D: {
      x: u,
      y: d
    },
    M: {
      x: a,
      y: _
    }
  };
}, Dn = ({ D: t, M: e }) => {
  const n = (o, s) => o === 0 && o <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, $s = ({ D: t, M: e }, n) => {
  const o = (s, i, c) => lo(0, 1, (s - c) / (s - i) || 0);
  return {
    x: o(t.x, e.x, n.x),
    y: o(t.y, e.y, n.y)
  };
}, Wn = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, Cs = (t, e) => {
  ie(ss(e), t);
}, Kn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (i, c) => {
    if (i) {
      const u = e.get(i);
      Cs((a) => {
        u && u[a ? "delete" : "clear"](a);
      }, c);
    } else
      e.forEach((u) => {
        u.clear();
      }), e.clear();
  }, o = (i, c) => {
    if (Ht(i)) {
      const d = e.get(i) || /* @__PURE__ */ new Set();
      return e.set(i, d), Cs((_) => {
        Re(_) && d.add(_);
      }, c), X(n, i, c);
    }
    mn(c) && c && n();
    const u = Ue(i), a = [];
    return ie(u, (d) => {
      const _ = i[d];
      _ && he(a, o(d, _));
    }), X(Ie, a);
  }, s = (i, c) => {
    ie(it(e.get(i)), (u) => {
      c && !Rn(c) ? u.apply(0, c) : u();
    });
  };
  return o(t || {}), [o, n, s];
}, ko = {}, xo = {}, jr = (t) => {
  ie(t, (e) => ie(e, (n, o) => {
    ko[o] = e[o];
  }));
}, So = (t, e, n) => Ue(t).map((o) => {
  const { static: s, instance: i } = t[o], [c, u, a] = n || [], d = n ? i : s;
  if (d) {
    const _ = n ? d(c, u, e) : d(e);
    return (a || xo)[o] = _;
  }
}), Bt = (t) => xo[t], Gr = "__osOptionsValidationPlugin", Et = "data-overlayscrollbars", tn = "os-environment", Qt = `${tn}-scrollbar-hidden`, Vn = `${Et}-initialize`, nn = "noClipping", Es = `${Et}-body`, at = Et, Wr = "host", Je = `${Et}-viewport`, Kr = to, Yr = no, Xr = "arrange", $o = "measuring", Zr = "scrolling", Co = "scrollbarHidden", Qr = "noContent", Yn = `${Et}-padding`, Ts = `${Et}-content`, ds = "os-size-observer", Jr = `${ds}-appear`, el = `${ds}-listener`, tl = "os-trinsic-observer", nl = "os-theme-none", He = "os-scrollbar", sl = `${He}-rtl`, ol = `${He}-horizontal`, rl = `${He}-vertical`, Eo = `${He}-track`, us = `${He}-handle`, ll = `${He}-visible`, al = `${He}-cornerless`, Ms = `${He}-interaction`, As = `${He}-unusable`, Xn = `${He}-auto-hide`, Ds = `${Xn}-hidden`, Vs = `${He}-wheel`, il = `${Eo}-interactive`, cl = `${us}-interactive`, dl = "__osSizeObserverPlugin", ul = (t, e) => {
  const { T: n } = e, [o, s] = t("showNativeOverlaidScrollbars");
  return [o && n.x && n.y, s];
}, xt = (t) => t.indexOf(rt) === 0, vl = (t, e) => {
  const n = (s, i, c, u) => {
    const a = s === rt ? ut : s.replace(`${rt}-`, ""), d = xt(s), _ = xt(c);
    return !i && !u ? ut : d && _ ? rt : d ? i && u ? a : i ? rt : ut : i ? a : _ && u ? rt : ut;
  }, o = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    k: o,
    R: {
      x: o.x === yt,
      y: o.y === yt
    }
  };
}, To = "__osScrollbarsHidingPlugin", fl = "__osClickScrollPlugin", Ls = (t) => JSON.stringify(t, (e, n) => {
  if (Re(n))
    throw 0;
  return n;
}), Os = (t, e) => t ? `${e}`.split(".").reduce((n, o) => n && oo(n, o) ? n[o] : void 0, t) : void 0, _l = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: !1,
    dragScroll: !0,
    clickScroll: !1,
    pointers: ["mouse", "touch", "pen"]
  }
}, Mo = (t, e) => {
  const n = {}, o = Ot(Ue(e), Ue(t));
  return ie(o, (s) => {
    const i = t[s], c = e[s];
    if (rn(i) && rn(c))
      oe(n[s] = {}, Mo(i, c)), os(n[s]) && delete n[s];
    else if (oo(e, s) && c !== i) {
      let u = !0;
      if (We(i) || We(c))
        try {
          Ls(i) === Ls(c) && (u = !1);
        } catch {
        }
      u && (n[s] = c);
    }
  }), n;
}, Fs = (t, e, n) => (o) => [Os(t, o), n || Os(e, o) !== void 0];
let Ao;
const ml = () => Ao, pl = (t) => {
  Ao = t;
};
let Ln;
const hl = () => {
  const t = (C, V, F) => {
    De(document.body, C), De(document.body, C);
    const j = ho(C), O = bt(C), w = cs(V);
    return F && kt(C), {
      x: O.h - j.h + w.h,
      y: O.w - j.w + w.w
    };
  }, e = (C) => {
    let V = !1;
    const F = is(C, Qt);
    try {
      V = tt(C, "scrollbar-width") === "none" || tt(C, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return F(), V;
  }, n = `.${tn}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${tn} div{width:200%;height:200%;margin:10px 0}.${Qt}{scrollbar-width:none!important}.${Qt}::-webkit-scrollbar,.${Qt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = _o(`<div class="${tn}"><div></div><style>${n}</style></div>`)[0], i = s.firstChild, c = s.lastChild, u = ml();
  u && (c.nonce = u);
  const [a, , d] = Kn(), [_, v] = Oe({
    o: t(s, i),
    i: en
  }, X(t, s, i, !0)), [p] = v(), m = e(s), h = {
    x: p.x === 0,
    y: p.y === 0
  }, x = {
    elements: {
      host: null,
      padding: !m,
      viewport: (C) => m && vo(C) && C,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, $ = oe({}, _l), M = X(oe, {}, $), I = X(oe, {}, x), D = {
    N: p,
    T: h,
    P: m,
    G: !!Vt,
    K: X(a, "r"),
    Z: I,
    tt: (C) => oe(x, C) && I(),
    nt: M,
    ot: (C) => oe($, C) && M(),
    st: oe({}, x),
    et: oe({}, $)
  };
  if (qe(s, "style"), kt(s), _e(Le, "resize", () => {
    d("r", []);
  }), Re(Le.matchMedia) && !m && (!h.x || !h.y)) {
    const C = (V) => {
      const F = Le.matchMedia(`(resolution: ${Le.devicePixelRatio}dppx)`);
      _e(F, "change", () => {
        V(), C(V);
      }, {
        A: !0
      });
    };
    C(() => {
      const [V, F] = _();
      oe(D.N, V), d("r", [F]);
    });
  }
  return D;
}, Ke = () => (Ln || (Ln = hl()), Ln), gl = (t, e, n) => {
  let o = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, i = () => {
    o = !0;
  }, c = (u) => {
    if (s && n) {
      const a = n.map((d) => {
        const [_, v] = d || [];
        return [v && _ ? (u || uo)(_, t) : [], v];
      });
      ie(a, (d) => ie(d[0], (_) => {
        const v = d[1], p = s.get(_) || [];
        if (t.contains(_) && v) {
          const h = _e(_, v, (x) => {
            o ? (h(), s.delete(_)) : e(x);
          });
          s.set(_, he(p, h));
        } else
          Ie(p), s.delete(_);
      }));
    }
  };
  return c(), [i, c];
}, Is = (t, e, n, o) => {
  let s = !1;
  const { ct: i, rt: c, lt: u, it: a, ut: d, ft: _ } = o || {}, v = cn(() => s && n(!0), {
    _: 33,
    p: 99
  }), [p, m] = gl(t, v, u), h = i || [], x = c || [], $ = Ot(h, x), M = (D, C) => {
    if (!Rn(C)) {
      const V = d || lt, F = _ || lt, j = [], O = [];
      let w = !1, y = !1;
      if (ie(C, (L) => {
        const { attributeName: k, target: B, type: S, oldValue: U, addedNodes: N, removedNodes: ee } = L, se = S === "attributes", ne = S === "childList", me = t === B, Y = se && k, E = Y && rs(B, k || ""), H = Ht(E) ? E : null, P = Y && U !== H, T = Ws(x, k) && P;
        if (e && (ne || !me)) {
          const G = se && P, z = G && a && Nn(B, a), Q = (z ? !V(B, k, U, H) : !se || G) && !F(L, !!z, t, o);
          ie(N, (le) => he(j, le)), ie(ee, (le) => he(j, le)), y = y || Q;
        }
        !e && me && P && !V(B, k, U, H) && (he(O, k), w = w || T);
      }), m((L) => Un(j).reduce((k, B) => (he(k, uo(L, B)), Nn(B, L) ? he(k, B) : k), [])), e)
        return !D && y && n(!1), [!1];
      if (!Rn(O) || w) {
        const L = [Un(O), w];
        return D || n.apply(0, L), L;
      }
    }
  }, I = new Lr(X(M, !1));
  return [() => (I.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: $,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (p(), I.disconnect(), s = !1);
  }), () => {
    if (s)
      return v.m(), M(!0, I.takeRecords());
  }];
};
let dt = null;
const Do = (t, e, n) => {
  const { _t: o } = n || {}, s = Bt(dl), [i] = Oe({
    o: !1,
    u: !0
  });
  return () => {
    const c = [], a = _o(`<div class="${ds}"><div class="${el}"></div></div>`)[0], d = a.firstChild, _ = (v) => {
      const p = v instanceof ResizeObserverEntry;
      let m = !1, h = !1;
      if (p) {
        const [x, , $] = i(v.contentRect), M = jn(x);
        h = go(x, $), m = !h && !M;
      } else
        h = v === !0;
      m || e({
        dt: !0,
        _t: h
      });
    };
    if (mt) {
      if (!mn(dt)) {
        const h = new mt(lt);
        h.observe(t, {
          get box() {
            dt = !0;
          }
        }), dt = dt || !1, h.disconnect();
      }
      const v = cn(_, {
        _: 0,
        p: 0
      }), p = (h) => v(h.pop()), m = new mt(p);
      if (m.observe(dt ? t : d), he(c, [() => m.disconnect(), !dt && De(t, a)]), dt) {
        const h = new mt(p);
        h.observe(t, {
          box: "border-box"
        }), he(c, () => h.disconnect());
      }
    } else if (s) {
      const [v, p] = s(d, _, o);
      he(c, Ot([is(a, Jr), _e(a, "animationstart", v), De(t, a)], p));
    } else
      return lt;
    return X(Ie, c);
  };
}, bl = (t, e) => {
  let n;
  const o = (a) => a.h === 0 || a.isIntersecting || a.intersectionRatio > 0, s = gt(tl), [i] = Oe({
    o: !1
  }), c = (a, d) => {
    if (a) {
      const _ = i(o(a)), [, v] = _;
      return v && !d && e(_) && [_];
    }
  }, u = (a, d) => c(d.pop(), a);
  return [() => {
    const a = [];
    if (ws)
      n = new ws(X(u, !1), {
        root: t
      }), n.observe(s), he(a, () => {
        n.disconnect();
      });
    else {
      const d = () => {
        const _ = bt(s);
        c(_);
      };
      he(a, Do(s, d)()), d();
    }
    return X(Ie, he(a, De(t, s)));
  }, () => n && u(!0, n.takeRecords())];
}, wl = (t, e, n, o) => {
  let s, i, c, u, a, d;
  const _ = `[${at}]`, v = `[${Je}]`, p = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: m, ht: h, U: x, gt: $, bt: M, L: I, wt: D, yt: C, St: V, Ot: F } = t, j = (T) => tt(T, "direction") === "rtl", O = {
    $t: !1,
    F: j(m)
  }, w = Ke(), y = Bt(To), [L] = Oe({
    i: so,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const T = y && y.V(t, e, O, w, n).W, z = !(D && I) && as(h, at, nn), W = !I && C(Xr), Q = W && Fe($), le = Q && F(), fe = V($o, z), ce = W && T && T()[0], Ee = un(x), te = cs(x);
    return ce && ce(), je($, Q), le && le(), z && fe(), {
      w: Ee.w + te.w,
      h: Ee.h + te.h
    };
  }), k = cn(o, {
    _: () => s,
    p: () => i,
    S(T, G) {
      const [z] = T, [W] = G;
      return [Ot(Ue(z), Ue(W)).reduce((Q, le) => (Q[le] = z[le] || W[le], Q), {})];
    }
  }), B = (T) => {
    const G = j(m);
    oe(T, {
      Ct: d !== G
    }), oe(O, {
      F: G
    }), d = G;
  }, S = (T, G) => {
    const [z, W] = T, Q = {
      xt: W
    };
    return oe(O, {
      $t: z
    }), G || o(Q), Q;
  }, U = ({ dt: T, _t: G }) => {
    const W = !(T && !G) && w.P ? k : o, Q = {
      dt: T || G,
      _t: G
    };
    B(Q), W(Q);
  }, N = (T, G) => {
    const [, z] = L(), W = {
      Ht: z
    };
    return B(W), z && !G && (T ? o : k)(W), W;
  }, ee = (T, G, z) => {
    const W = {
      Et: G
    };
    return B(W), G && !z && k(W), W;
  }, [se, ne] = M ? bl(h, S) : [], me = !I && Do(h, U, {
    _t: !0
  }), [Y, E] = Is(h, !1, ee, {
    rt: p,
    ct: p
  }), H = I && mt && new mt((T) => {
    const G = T[T.length - 1].contentRect;
    U({
      dt: !0,
      _t: go(G, a)
    }), a = G;
  }), P = cn(() => {
    const [, T] = L();
    o({
      Ht: T
    });
  }, {
    _: 222,
    v: !0
  });
  return [() => {
    H && H.observe(h);
    const T = me && me(), G = se && se(), z = Y(), W = w.K((Q) => {
      Q ? k({
        zt: Q
      }) : P();
    });
    return () => {
      H && H.disconnect(), T && T(), G && G(), u && u(), z(), W();
    };
  }, ({ It: T, At: G, Dt: z }) => {
    const W = {}, [Q] = T("update.ignoreMutation"), [le, fe] = T("update.attributes"), [ce, Ee] = T("update.elementEvents"), [te, ye] = T("update.debounce"), Ae = Ee || fe, ke = G || z, Se = (ge) => Re(Q) && Q(ge);
    if (Ae) {
      c && c(), u && u();
      const [ge, be] = Is(M || x, !0, N, {
        ct: Ot(p, le || []),
        lt: ce,
        it: _,
        ft: (pe, de) => {
          const { target: $e, attributeName: Me } = pe;
          return (!de && Me && !I ? Hr($e, _, v) : !1) || !!ht($e, `.${He}`) || !!Se(pe);
        }
      });
      u = ge(), c = be;
    }
    if (ye)
      if (k.m(), We(te)) {
        const ge = te[0], be = te[1];
        s = Ge(ge) && ge, i = Ge(be) && be;
      } else Ge(te) ? (s = te, i = !1) : (s = !1, i = !1);
    if (ke) {
      const ge = E(), be = ne && ne(), pe = c && c();
      ge && oe(W, ee(ge[0], ge[1], ke)), be && oe(W, S(be[0], ke)), pe && oe(W, N(pe[0], ke));
    }
    return B(W), W;
  }, O];
}, Vo = (t, e) => Re(e) ? e.apply(0, t) : e, yl = (t, e, n, o) => {
  const s = ts(o) ? n : o;
  return Vo(t, s) || e.apply(0, t);
}, Lo = (t, e, n, o) => {
  const s = ts(o) ? n : o, i = Vo(t, s);
  return !!i && (an(i) ? i : e.apply(0, t));
}, kl = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: o } = e || {}, { T: s, P: i, Z: c } = Ke(), { nativeScrollbarsOverlaid: u, body: a } = c().cancel, d = n ?? u, _ = ts(o) ? a : o, v = (s.x || s.y) && d, p = t && (_n(_) ? !i : _);
  return !!v || !!p;
}, xl = (t, e, n, o) => {
  const s = "--os-viewport-percent", i = "--os-scroll-percent", c = "--os-scroll-direction", { Z: u } = Ke(), { scrollbars: a } = u(), { slot: d } = a, { vt: _, ht: v, U: p, Mt: m, gt: h, wt: x, L: $ } = e, { scrollbars: M } = m ? {} : t, { slot: I } = M || {}, D = [], C = [], V = [], F = Lo([_, v, p], () => $ && x ? _ : v, d, I), j = (Y) => {
    if (Vt) {
      let E = null, H = [];
      const P = new Vt({
        source: h,
        axis: Y
      }), T = () => {
        E && E.cancel(), E = null;
      };
      return {
        Rt: (z) => {
          const { Tt: W } = n, Q = Dn(W)[Y], le = Y === "x", fe = [Mn(0, le), Mn(`calc(100cq${le ? "w" : "h"} + -100%)`, le)], ce = Q ? fe : fe.reverse();
          return H[0] === ce[0] && H[1] === ce[1] || (T(), H = ce, E = z.kt.animate({
            clear: ["left"],
            transform: ce
          }, {
            timeline: P
          })), T;
        }
      };
    }
  }, O = {
    x: j("x"),
    y: j("y")
  }, w = () => {
    const { Vt: Y, Lt: E } = n, H = (P, T) => lo(0, 1, P / (P + T) || 0);
    return {
      x: H(E.x, Y.x),
      y: H(E.y, Y.y)
    };
  }, y = (Y, E, H) => {
    const P = H ? is : co;
    ie(Y, (T) => {
      P(T.Ut, E);
    });
  }, L = (Y, E) => {
    ie(Y, (H) => {
      const [P, T] = E(H);
      It(P, T);
    });
  }, k = (Y, E, H) => {
    const P = mn(H), T = P ? H : !0, G = P ? !H : !0;
    T && y(C, Y, E), G && y(V, Y, E);
  }, B = () => {
    const Y = w(), E = (H) => (P) => [P.Ut, {
      [s]: zn(H) + ""
    }];
    L(C, E(Y.x)), L(V, E(Y.y));
  }, S = () => {
    if (!Vt) {
      const { Tt: Y } = n, E = $s(Y, Fe(h)), H = (P) => (T) => [T.Ut, {
        [i]: zn(P) + ""
      }];
      L(C, H(E.x)), L(V, H(E.y));
    }
  }, U = () => {
    const { Tt: Y } = n, E = Dn(Y), H = (P) => (T) => [T.Ut, {
      [c]: P ? "0" : "1"
    }];
    L(C, H(E.x)), L(V, H(E.y)), Vt && (C.forEach(O.x.Rt), V.forEach(O.y.Rt));
  }, N = () => {
    if ($ && !x) {
      const { Vt: Y, Tt: E } = n, H = Dn(E), P = $s(E, Fe(h)), T = (G) => {
        const { Ut: z } = G, W = Ft(z) === p && z, Q = (le, fe, ce) => {
          const Ee = fe * le;
          return po(ce ? Ee : -Ee);
        };
        return [W, W && {
          transform: Mn({
            x: Q(P.x, Y.x, H.x),
            y: Q(P.y, Y.y, H.y)
          })
        }];
      };
      L(C, T), L(V, T);
    }
  }, ee = (Y) => {
    const E = Y ? "x" : "y", P = gt(`${He} ${Y ? ol : rl}`), T = gt(Eo), G = gt(us), z = {
      Ut: P,
      Pt: T,
      kt: G
    }, W = O[E];
    return he(Y ? C : V, z), he(D, [De(P, T), De(T, G), X(kt, P), W && W.Rt(z), o(z, k, Y)]), z;
  }, se = X(ee, !0), ne = X(ee, !1), me = () => (De(F, C[0].Ut), De(F, V[0].Ut), X(Ie, D));
  return se(), ne(), [{
    Nt: B,
    qt: S,
    Bt: U,
    Ft: N,
    jt: k,
    Xt: {
      Yt: C,
      Wt: se,
      Jt: X(L, C)
    },
    Gt: {
      Yt: V,
      Wt: ne,
      Jt: X(L, V)
    }
  }, me];
}, Sl = (t, e, n, o) => (s, i, c) => {
  const { ht: u, U: a, L: d, gt: _, Kt: v, Ot: p } = e, { Ut: m, Pt: h, kt: x } = s, [$, M] = pt(333), [I, D] = pt(444), C = (j) => {
    Re(_.scrollBy) && _.scrollBy({
      behavior: "smooth",
      left: j.x,
      top: j.y
    });
  }, V = () => {
    const j = "pointerup pointercancel lostpointercapture", O = `client${c ? "X" : "Y"}`, w = c ? hn : gn, y = c ? "left" : "top", L = c ? "w" : "h", k = c ? "x" : "y", B = (U, N) => (ee) => {
      const { Vt: se } = n, ne = bt(h)[L] - bt(x)[L], Y = N * ee / ne * se[k];
      je(_, {
        [k]: U + Y
      });
    }, S = [];
    return _e(h, "pointerdown", (U) => {
      const N = ht(U.target, `.${us}`) === x, ee = N ? x : h, se = t.scrollbars, ne = se[N ? "dragScroll" : "clickScroll"], { button: me, isPrimary: Y, pointerType: E } = U, { pointers: H } = se;
      if (me === 0 && Y && ne && (H || []).includes(E)) {
        Ie(S), D();
        const T = !N && (U.shiftKey || ne === "instant"), G = X(An, x), z = X(An, h), W = (de, $e) => (de || G())[y] - ($e || z())[y], Q = Hn(An(_)[w]) / bt(_)[L] || 1, le = B(Fe(_)[k], 1 / Q), fe = U[O], ce = G(), Ee = z(), te = ce[w], ye = W(ce, Ee) + te / 2, Ae = fe - Ee[y], ke = N ? 0 : Ae - ye, Se = (de) => {
          Ie(pe), ee.releasePointerCapture(de.pointerId);
        }, ge = N || T, be = p(), pe = [_e(v, j, Se), _e(v, "selectstart", (de) => Gn(de), {
          H: !1
        }), _e(h, j, Se), ge && _e(h, "pointermove", (de) => le(ke + (de[O] - fe))), ge && (() => {
          const de = Fe(_);
          be();
          const $e = Fe(_), Me = {
            x: $e.x - de.x,
            y: $e.y - de.y
          };
          (sn(Me.x) > 3 || sn(Me.y) > 3) && (p(), je(_, de), C(Me), I(be));
        })];
        if (ee.setPointerCapture(U.pointerId), T)
          le(ke);
        else if (!N) {
          const de = Bt(fl);
          if (de) {
            const $e = de(le, ke, te, (Me) => {
              Me ? be() : he(pe, be);
            });
            he(pe, $e), he(S, X($e, !0));
          }
        }
      }
    });
  };
  let F = !0;
  return X(Ie, [_e(x, "pointermove pointerleave", o), _e(m, "pointerenter", () => {
    i(Ms, !0);
  }), _e(m, "pointerleave pointercancel", () => {
    i(Ms, !1);
  }), !d && _e(m, "mousedown", () => {
    const j = qn();
    (ys(j, Je) || ys(j, at) || j === document.body) && on(X(Wn, a), 25);
  }), _e(m, "wheel", (j) => {
    const { deltaX: O, deltaY: w, deltaMode: y } = j;
    F && y === 0 && Ft(m) === u && C({
      x: O,
      y: w
    }), F = !1, i(Vs, !0), $(() => {
      F = !0, i(Vs);
    }), Gn(j);
  }, {
    H: !1,
    I: !0
  }), _e(m, "pointerdown", X(_e, v, "click", wo, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), V(), M, D]);
}, $l = (t, e, n, o, s, i) => {
  let c, u, a, d, _, v = lt, p = 0;
  const m = ["mouse", "pen"], h = (E) => m.includes(E.pointerType), [x, $] = pt(), [M, I] = pt(100), [D, C] = pt(100), [V, F] = pt(() => p), [j, O] = xl(t, s, o, Sl(e, s, o, (E) => h(E) && se())), { ht: w, Qt: y, wt: L } = s, { jt: k, Nt: B, qt: S, Bt: U, Ft: N } = j, ee = (E, H) => {
    if (F(), E)
      k(Ds);
    else {
      const P = X(k, Ds, !0);
      p > 0 && !H ? V(P) : P();
    }
  }, se = () => {
    (a ? !c : !d) && (ee(!0), M(() => {
      ee(!1);
    }));
  }, ne = (E) => {
    k(Xn, E, !0), k(Xn, E, !1);
  }, me = (E) => {
    h(E) && (c = a, a && ee(!0));
  }, Y = [F, I, C, $, () => v(), _e(w, "pointerover", me, {
    A: !0
  }), _e(w, "pointerenter", me), _e(w, "pointerleave", (E) => {
    h(E) && (c = !1, a && ee(!1));
  }), _e(w, "pointermove", (E) => {
    h(E) && u && se();
  }), _e(y, "scroll", (E) => {
    x(() => {
      S(), se();
    }), i(E), N();
  })];
  return [() => X(Ie, he(Y, O())), ({ It: E, Dt: H, Zt: P, tn: T }) => {
    const { nn: G, sn: z, en: W, cn: Q } = T || {}, { Ct: le, _t: fe } = P || {}, { F: ce } = n, { T: Ee } = Ke(), { k: te, rn: ye } = o, [Ae, ke] = E("showNativeOverlaidScrollbars"), [Se, ge] = E("scrollbars.theme"), [be, pe] = E("scrollbars.visibility"), [de, $e] = E("scrollbars.autoHide"), [Me, Tt] = E("scrollbars.autoHideSuspend"), [Rt] = E("scrollbars.autoHideDelay"), [Ut, Nt] = E("scrollbars.dragScroll"), [ct, Mt] = E("scrollbars.clickScroll"), [Pt, xn] = E("overflow"), Sn = fe && !H, $n = ye.x || ye.y, Pe = G || z || Q || le || H, Cn = W || pe || xn, qt = Ae && Ee.x && Ee.y, zt = (st, At, Dt) => {
      const jt = st.includes(yt) && (be === rt || be === "auto" && At === yt);
      return k(ll, jt, Dt), jt;
    };
    if (p = Rt, Sn && (Me && $n ? (ne(!1), v(), D(() => {
      v = _e(y, "scroll", X(ne, !0), {
        A: !0
      });
    })) : ne(!0)), ke && k(nl, qt), ge && (k(_), k(Se, !0), _ = Se), Tt && !Me && ne(!0), $e && (u = de === "move", a = de === "leave", d = de === "never", ee(d, !0)), Nt && k(cl, Ut), Mt && k(il, !!ct), Cn) {
      const st = zt(Pt.x, te.x, !0), At = zt(Pt.y, te.y, !1);
      k(al, !(st && At));
    }
    Pe && (S(), B(), N(), Q && U(), k(As, !ye.x, !0), k(As, !ye.y, !1), k(sl, ce && !L));
  }, {}, j];
}, Cl = (t) => {
  const e = Ke(), { Z: n, P: o } = e, { elements: s } = n(), { padding: i, viewport: c, content: u } = s, a = an(t), d = a ? {} : t, { elements: _ } = d, { padding: v, viewport: p, content: m } = _ || {}, h = a ? t : d.target, x = vo(h), $ = h.ownerDocument, M = $.documentElement, I = () => $.defaultView || Le, D = X(yl, [h]), C = X(Lo, [h]), V = X(gt, ""), F = X(D, V, c), j = X(C, V, u), O = (te) => {
    const ye = bt(te), Ae = un(te), ke = tt(te, to), Se = tt(te, no);
    return Ae.w - ye.w > 0 && !xt(ke) || Ae.h - ye.h > 0 && !xt(Se);
  }, w = F(p), y = w === h, L = y && x, k = !y && j(m), B = !y && w === k, S = L ? M : w, U = L ? S : h, N = !y && C(V, i, v), ee = !B && k, se = [ee, S, N, U].map((te) => an(te) && !Ft(te) && te), ne = (te) => te && Ws(se, te), me = !ne(S) && O(S) ? S : h, Y = L ? M : S, H = {
    vt: h,
    ht: U,
    U: S,
    ln: N,
    bt: ee,
    gt: Y,
    Qt: L ? $ : S,
    an: x ? M : me,
    Kt: $,
    wt: x,
    Mt: a,
    L: y,
    un: I,
    yt: (te) => as(S, Je, te),
    St: (te, ye) => dn(S, Je, te, ye),
    Ot: () => dn(Y, Je, Zr, !0)
  }, { vt: P, ht: T, ln: G, U: z, bt: W } = H, Q = [() => {
    qe(T, [at, Vn]), qe(P, Vn), x && qe(M, [Vn, at]);
  }];
  let le = Pn([W, z, G, T, P].find((te) => te && !ne(te)));
  const fe = L ? P : W || z, ce = X(Ie, Q);
  return [H, () => {
    const te = I(), ye = qn(), Ae = (pe) => {
      De(Ft(pe), Pn(pe)), kt(pe);
    }, ke = (pe) => _e(pe, "focusin focusout focus blur", wo, {
      I: !0,
      H: !1
    }), Se = "tabindex", ge = rs(z, Se), be = ke(ye);
    return Qe(T, at, y ? "" : Wr), Qe(G, Yn, ""), Qe(z, Je, ""), Qe(W, Ts, ""), y || (Qe(z, Se, ge || "-1"), x && Qe(M, Es, "")), De(fe, le), De(T, G), De(G || T, !y && z), De(z, W), he(Q, [be, () => {
      const pe = qn(), de = ne(z), $e = de && pe === z ? P : pe, Me = ke($e);
      qe(G, Yn), qe(W, Ts), qe(z, Je), x && qe(M, Es), ge ? Qe(z, Se, ge) : qe(z, Se), ne(W) && Ae(W), de && Ae(z), ne(G) && Ae(G), Wn($e), Me();
    }]), o && !y && (ls(z, Je, Co), he(Q, X(qe, z, Je))), Wn(!y && x && ye === P && te.top === te ? z : ye), be(), le = 0, ce;
  }, ce];
}, El = ({ bt: t }) => ({ Zt: e, fn: n, Dt: o }) => {
  const { xt: s } = e || {}, { $t: i } = n;
  t && (s || o) && It(t, {
    [gn]: i && "100%"
  });
}, Tl = ({ ht: t, ln: e, U: n, L: o }, s) => {
  const [i, c] = Oe({
    i: Fr,
    o: xs()
  }, X(xs, t, "padding", ""));
  return ({ It: u, Zt: a, fn: d, Dt: _ }) => {
    let [v, p] = c(_);
    const { P: m } = Ke(), { dt: h, Ht: x, Ct: $ } = a || {}, { F: M } = d, [I, D] = u("paddingAbsolute");
    (h || p || (_ || x)) && ([v, p] = i(_));
    const V = !o && (D || $ || p);
    if (V) {
      const F = !I || !e && !m, j = v.r + v.l, O = v.t + v.b, w = {
        [Js]: F && !M ? -j : 0,
        [eo]: F ? -O : 0,
        [Qs]: F && M ? -j : 0,
        top: F ? -v.t : 0,
        right: F ? M ? -v.r : "auto" : 0,
        left: F ? M ? "auto" : -v.l : 0,
        [hn]: F && `calc(100% + ${j}px)`
      }, y = {
        [Ks]: F ? v.t : 0,
        [Ys]: F ? v.r : 0,
        [Zs]: F ? v.b : 0,
        [Xs]: F ? v.l : 0
      };
      It(e || n, w), It(n, y), oe(s, {
        ln: v,
        _n: !F,
        j: e ? y : oe({}, w, y)
      });
    }
    return {
      dn: V
    };
  };
}, Ml = (t, e) => {
  const n = Ke(), { ht: o, ln: s, U: i, L: c, Qt: u, gt: a, wt: d, St: _, un: v } = t, { P: p } = n, m = d && c, h = X(js, 0), x = {
    display: () => !1,
    direction: (E) => E !== "ltr",
    flexDirection: (E) => E.endsWith("-reverse"),
    writingMode: (E) => E !== "horizontal-tb"
  }, $ = Ue(x), M = {
    i: so,
    o: {
      w: 0,
      h: 0
    }
  }, I = {
    i: en,
    o: {}
  }, D = (E) => {
    _($o, !m && E);
  }, C = (E) => {
    if (!$.some((fe) => {
      const ce = E[fe];
      return ce && x[fe](ce);
    }))
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    D(!0);
    const P = Fe(a), T = _(Qr, !0), G = _e(u, yt, (fe) => {
      const ce = Fe(a);
      fe.isTrusted && ce.x === P.x && ce.y === P.y && bo(fe);
    }, {
      I: !0,
      A: !0
    });
    je(a, {
      x: 0,
      y: 0
    }), T();
    const z = Fe(a), W = un(a);
    je(a, {
      x: W.w,
      y: W.h
    });
    const Q = Fe(a);
    je(a, {
      x: Q.x - z.x < 1 && -W.w,
      y: Q.y - z.y < 1 && -W.h
    });
    const le = Fe(a);
    return je(a, P), es(() => G()), {
      D: z,
      M: le
    };
  }, V = (E, H) => {
    const P = Le.devicePixelRatio % 1 !== 0 ? 1 : 0, T = {
      w: h(E.w - H.w),
      h: h(E.h - H.h)
    };
    return {
      w: T.w > P ? T.w : 0,
      h: T.h > P ? T.h : 0
    };
  }, [F, j] = Oe(M, X(cs, i)), [O, w] = Oe(M, X(un, i)), [y, L] = Oe(M), [k] = Oe(I), [B, S] = Oe(M), [U] = Oe(I), [N] = Oe({
    i: (E, H) => bn(E, H, $),
    o: {}
  }, () => qr(i) ? tt(i, $) : {}), [ee, se] = Oe({
    i: (E, H) => en(E.D, H.D) && en(E.M, H.M),
    o: yo()
  }), ne = Bt(To), me = (E, H) => `${H ? Kr : Yr}${Or(E)}`, Y = (E) => {
    const H = (T) => [rt, ut, yt].map((G) => me(G, T)), P = H(!0).concat(H()).join(" ");
    _(P), _(Ue(E).map((T) => me(E[T], T === "x")).join(" "), !0);
  };
  return ({ It: E, Zt: H, fn: P, Dt: T }, { dn: G }) => {
    const { dt: z, Ht: W, Ct: Q, _t: le, zt: fe } = H || {}, ce = ne && ne.V(t, e, P, n, E), { Y: Ee, W: te, J: ye } = ce || {}, [Ae, ke] = ul(E, n), [Se, ge] = E("overflow"), be = xt(Se.x), pe = xt(Se.y), de = z || G || W || Q || fe || ke;
    let $e = j(T), Me = w(T), Tt = L(T), Rt = S(T);
    if (ke && p && _(Co, !Ae), de) {
      as(o, at, nn) && D(!0);
      const [hs] = te ? te() : [], [Gt] = $e = F(T), [Wt] = Me = O(T), Kt = ho(i), Yt = m && Pr(v()), or = {
        w: h(Wt.w + Gt.w),
        h: h(Wt.h + Gt.h)
      }, gs = {
        w: h((Yt ? Yt.w : Kt.w + h(Kt.w - Wt.w)) + Gt.w),
        h: h((Yt ? Yt.h : Kt.h + h(Kt.h - Wt.h)) + Gt.h)
      };
      hs && hs(), Rt = B(gs), Tt = y(V(or, gs), T);
    }
    const [Ut, Nt] = Rt, [ct, Mt] = Tt, [Pt, xn] = Me, [Sn, $n] = $e, [Pe, Cn] = k({
      x: ct.w > 0,
      y: ct.h > 0
    }), qt = be && pe && (Pe.x || Pe.y) || be && Pe.x && !Pe.y || pe && Pe.y && !Pe.x, zt = G || Q || fe || $n || xn || Nt || Mt || ge || ke || de, st = vl(Pe, Se), [At, Dt] = U(st.k), [jt, tr] = N(T), ps = Q || le || tr || Cn || T, [nr, sr] = ps ? ee(C(jt), T) : se();
    return zt && (Dt && Y(st.k), ye && Ee && It(i, ye(st, P, Ee(st, Pt, Sn)))), D(!1), dn(o, at, nn, qt), dn(s, Yn, nn, qt), oe(e, {
      k: At,
      Lt: {
        x: Ut.w,
        y: Ut.h
      },
      Vt: {
        x: ct.w,
        y: ct.h
      },
      rn: Pe,
      Tt: zr(nr, ct)
    }), {
      en: Dt,
      nn: Nt,
      sn: Mt,
      cn: sr || Mt,
      pn: ps
    };
  };
}, Al = (t) => {
  const [e, n, o] = Cl(t), s = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    _n: !1,
    j: {
      [Js]: 0,
      [eo]: 0,
      [Qs]: 0,
      [Ks]: 0,
      [Ys]: 0,
      [Zs]: 0,
      [Xs]: 0
    },
    Lt: {
      x: 0,
      y: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    k: {
      x: ut,
      y: ut
    },
    rn: {
      x: !1,
      y: !1
    },
    Tt: yo()
  }, { vt: i, gt: c, L: u, Ot: a } = e, { P: d, T: _ } = Ke(), v = !d && (_.x || _.y), p = [El(e), Tl(e, s), Ml(e, s)];
  return [n, (m) => {
    const h = {}, $ = v && Fe(c), M = $ && a();
    return ie(p, (I) => {
      oe(h, I(m, h) || {});
    }), je(c, $), M && M(), u || je(i, 0), h;
  }, s, e, o];
}, Dl = (t, e, n, o, s) => {
  let i = !1;
  const c = Fs(e, {}), [u, a, d, _, v] = Al(t), [p, m, h] = wl(_, d, c, (C) => {
    D({}, C);
  }), [x, $, , M] = $l(t, e, h, d, _, s), I = (C) => Ue(C).some((V) => !!C[V]), D = (C, V) => {
    if (n())
      return !1;
    const { vn: F, Dt: j, At: O, hn: w } = C, y = F || {}, L = !!j || !i, k = {
      It: Fs(e, y, L),
      vn: y,
      Dt: L
    };
    if (w)
      return $(k), !1;
    const B = V || m(oe({}, k, {
      At: O
    })), S = a(oe({}, k, {
      fn: h,
      Zt: B
    }));
    $(oe({}, k, {
      Zt: B,
      tn: S
    }));
    const U = I(B), N = I(S), ee = U || N || !os(y) || L;
    return i = !0, ee && o(C, {
      Zt: B,
      tn: S
    }), ee;
  };
  return [() => {
    const { an: C, gt: V, Ot: F } = _, j = Fe(C), O = [p(), u(), x()], w = F();
    return je(V, j), w(), X(Ie, O);
  }, D, () => ({
    gn: h,
    bn: d
  }), {
    wn: _,
    yn: M
  }, v];
}, vs = /* @__PURE__ */ new WeakMap(), Vl = (t, e) => {
  vs.set(t, e);
}, Ll = (t) => {
  vs.delete(t);
}, Oo = (t) => vs.get(t), Ne = (t, e, n) => {
  const { nt: o } = Ke(), s = an(t), i = s ? t : t.target, c = Oo(i);
  if (e && !c) {
    let u = !1;
    const a = [], d = {}, _ = (y) => {
      const L = ro(y), k = Bt(Gr);
      return k ? k(L, !0) : L;
    }, v = oe({}, o(), _(e)), [p, m, h] = Kn(), [x, $, M] = Kn(n), I = (y, L) => {
      M(y, L), h(y, L);
    }, [D, C, V, F, j] = Dl(t, v, () => u, ({ vn: y, Dt: L }, { Zt: k, tn: B }) => {
      const { dt: S, Ct: U, xt: N, Ht: ee, Et: se, _t: ne } = k, { nn: me, sn: Y, en: E, cn: H } = B;
      I("updated", [w, {
        updateHints: {
          sizeChanged: !!S,
          directionChanged: !!U,
          heightIntrinsicChanged: !!N,
          overflowEdgeChanged: !!me,
          overflowAmountChanged: !!Y,
          overflowStyleChanged: !!E,
          scrollCoordinatesChanged: !!H,
          contentMutation: !!ee,
          hostMutation: !!se,
          appear: !!ne
        },
        changedOptions: y || {},
        force: !!L
      }]);
    }, (y) => I("scroll", [w, y])), O = (y) => {
      Ll(i), Ie(a), u = !0, I("destroyed", [w, y]), m(), $();
    }, w = {
      options(y, L) {
        if (y) {
          const k = L ? o() : {}, B = Mo(v, oe(k, _(y)));
          os(B) || (oe(v, B), C({
            vn: B
          }));
        }
        return oe({}, v);
      },
      on: x,
      off: (y, L) => {
        y && L && $(y, L);
      },
      state() {
        const { gn: y, bn: L } = V(), { F: k } = y, { Lt: B, Vt: S, k: U, rn: N, ln: ee, _n: se, Tt: ne } = L;
        return oe({}, {
          overflowEdge: B,
          overflowAmount: S,
          overflowStyle: U,
          hasOverflow: N,
          scrollCoordinates: {
            start: ne.D,
            end: ne.M
          },
          padding: ee,
          paddingAbsolute: se,
          directionRTL: k,
          destroyed: u
        });
      },
      elements() {
        const { vt: y, ht: L, ln: k, U: B, bt: S, gt: U, Qt: N } = F.wn, { Xt: ee, Gt: se } = F.yn, ne = (Y) => {
          const { kt: E, Pt: H, Ut: P } = Y;
          return {
            scrollbar: P,
            track: H,
            handle: E
          };
        }, me = (Y) => {
          const { Yt: E, Wt: H } = Y, P = ne(E[0]);
          return oe({}, P, {
            clone: () => {
              const T = ne(H());
              return C({
                hn: !0
              }), T;
            }
          });
        };
        return oe({}, {
          target: y,
          host: L,
          padding: k || B,
          viewport: B,
          content: S || B,
          scrollOffsetElement: U,
          scrollEventElement: N,
          scrollbarHorizontal: me(ee),
          scrollbarVertical: me(se)
        });
      },
      update: (y) => C({
        Dt: y,
        At: !0
      }),
      destroy: X(O, !1),
      plugin: (y) => d[Ue(y)[0]]
    };
    return he(a, [j]), Vl(i, w), So(ko, Ne, [w, p, d]), kl(F.wn.wt, !s && t.cancel) ? (O(!0), w) : (he(a, D()), I("initialized", [w]), w.update(), w);
  }
  return c;
};
Ne.plugin = (t) => {
  const e = We(t), n = e ? t : [t], o = n.map((s) => So(s, Ne)[0]);
  return jr(n), e ? o : o[0];
};
Ne.valid = (t) => {
  const e = t && t.elements, n = Re(e) && e();
  return ln(n) && !!Oo(n.target);
};
Ne.env = () => {
  const { N: t, T: e, P: n, G: o, st: s, et: i, Z: c, tt: u, nt: a, ot: d } = Ke();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: o,
    staticDefaultInitialization: s,
    staticDefaultOptions: i,
    getDefaultInitialization: c,
    setDefaultInitialization: u,
    getDefaultOptions: a,
    setDefaultOptions: d
  });
};
Ne.nonce = pl;
Ne.trustedTypePolicy = Rr;
function Ol() {
  let t;
  const e = A(null), n = Math.floor(Math.random() * 2 ** 32), o = A(!1), s = A([]), i = () => s.value, c = () => t.getSelection(), u = () => s.value.length, a = () => t.clearSelection(!0), d = A(), _ = A(null), v = A(null), p = A(null), m = A(null);
  function h() {
    t = new pr({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe("DS:start:pre", ({ items: V, event: F, isDragging: j }) => {
      if (j)
        t.Interaction._reset(F);
      else {
        o.value = !1;
        const O = e.value.offsetWidth - F.offsetX, w = e.value.offsetHeight - F.offsetY;
        O < 15 && w < 15 && t.Interaction._reset(F), F.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(F);
      }
    }), document.addEventListener("dragleave", (V) => {
      !V.buttons && o.value && (o.value = !1);
    });
  }
  const x = () => vt(() => {
    t.addSelection(
      t.getSelectables()
    ), $();
  }), $ = () => {
    s.value = t.getSelection().map((V) => JSON.parse(V.dataset.item)), d.value(s.value);
  }, M = () => vt(() => {
    const V = i().map((F) => F.path);
    a(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter((F) => V.includes(JSON.parse(F.dataset.item).path))
    ), $(), D();
  }), I = (V) => {
    d.value = V, t.subscribe("DS:end", ({ items: F, event: j, isDragging: O }) => {
      s.value = F.map((w) => JSON.parse(w.dataset.item)), V(F.map((w) => JSON.parse(w.dataset.item)));
    });
  }, D = () => {
    _.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (v.value.style.height = e.value.scrollHeight + "px", v.value.style.display = "block") : (v.value.style.height = "100%", v.value.style.display = "none"));
  }, C = (V) => {
    if (!_.value)
      return;
    const { scrollOffsetElement: F } = _.value.elements();
    F.scrollTo(
      {
        top: e.value.scrollTop,
        left: 0
      }
    );
  };
  return Ce(() => {
    Ne(p.value, {
      scrollbars: {
        theme: "vf-theme-dark dark:vf-theme-light"
      },
      plugins: {
        OverlayScrollbars: Ne
        // ScrollbarsHidingPlugin,
        // SizeObserverPlugin,
        // ClickScrollPlugin
      }
    }, {
      initialized: (V) => {
        _.value = V;
      },
      scroll: (V, F) => {
        const { scrollOffsetElement: j } = V.elements();
        e.value.scrollTo({
          top: j.scrollTop,
          left: 0
        });
      }
    }), h(), D(), m.value = new ResizeObserver(D), m.value.observe(e.value), e.value.addEventListener("scroll", C), t.subscribe("DS:scroll", ({ isDragging: V }) => V || C());
  }), Jn(() => {
    t && t.stop(), m.value && m.value.disconnect();
  }), Rs(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: o,
    scrollBar: v,
    scrollBarContainer: p,
    getSelected: i,
    getSelection: c,
    selectAll: x,
    clearSelection: a,
    refreshSelection: M,
    getCount: u,
    onSelect: I
  };
}
function Fl(t, e) {
  const n = A(t), o = A(e), s = A([]), i = A([]), c = A([]), u = A(!1), a = A(5);
  let d = !1, _ = !1;
  const v = St({
    adapter: n,
    storages: [],
    dirname: o,
    files: []
  });
  function p() {
    let I = [], D = [], C = o.value ?? n.value + "://";
    C.length === 0 && (s.value = []), C.replace(n.value + "://", "").split("/").forEach(function(j) {
      I.push(j), I.join("/") !== "" && D.push({
        basename: j,
        name: j,
        path: n.value + "://" + I.join("/"),
        type: "dir"
      });
    }), i.value = D;
    const [V, F] = h(D, a.value);
    c.value = F, s.value = V;
  }
  function m(I) {
    a.value = I, p();
  }
  function h(I, D) {
    return I.length > D ? [I.slice(-D), I.slice(0, -D)] : [I, []];
  }
  function x(I = null) {
    u.value = I ?? !u.value;
  }
  function $() {
    return s.value && s.value.length && !0;
  }
  const M = wt(() => {
    var I;
    return ((I = s.value[s.value.length - 2]) == null ? void 0 : I.path) ?? n.value + "://";
  });
  return Ce(() => {
  }), Ve(o, p), Ce(p), {
    adapter: n,
    path: o,
    loading: d,
    searchMode: _,
    data: v,
    breadcrumbs: s,
    breadcrumbItems: i,
    limitBreadcrumbItems: m,
    hiddenBreadcrumbs: c,
    showHiddenBreadcrumbs: u,
    toggleHiddenBreadcrumbs: x,
    isGoUpAvailable: $,
    parentFolderPath: M
  };
}
const Il = (t, e) => {
  const n = xr(t.id), o = mr(), s = n.getStore("metricUnits", !1), i = Mr(n, t.theme), c = e.i18n, u = t.locale ?? e.locale, a = (m) => Array.isArray(m) ? m : Cr, d = n.getStore("persist-path", t.persist), _ = d ? n.getStore("path", t.path) : t.path, v = d ? n.getStore("adapter") : null, p = Ol();
  return St({
    /** 
    * Core properties
    * */
    // app version
    version: Er,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: o,
    // storage
    storage: n,
    // localization object
    i18n: $r(n, u, o, c),
    // modal state
    modal: Ar(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: wt(() => p),
    // http object
    requester: kr(t.request),
    // active features
    features: a(t.features),
    // view state
    view: n.getStore("viewport", "grid"),
    // fullscreen state
    fullScreen: n.getStore("full-screen", t.fullScreen),
    // show tree view
    showTreeView: n.getStore("show-tree-view", t.showTreeView),
    // pinnedFolders
    pinnedFolders: n.getStore("pinned-folders", t.pinnedFolders),
    // treeViewData
    treeViewData: [],
    // selectButton state
    selectButton: t.selectButton,
    // max file size
    maxFileSize: t.maxFileSize,
    /**
    * Settings
    * */
    // theme state
    theme: i,
    // unit state - for example: GB or GiB
    metricUnits: s,
    // human readable file sizes
    filesize: s ? zs : qs,
    // show large icons in list view
    compactListView: n.getStore("compact-list-view", !0),
    // persist state
    persist: d,
    // show thumbnails
    showThumbnails: n.getStore("show-thumbnails", t.showThumbnails),
    // type of progress indicator
    loadingIndicator: t.loadingIndicator,
    // possible items of the context menu
    contextMenuItems: t.contextMenuItems,
    // file system
    fs: Fl(v, _)
  });
}, Hl = { class: "vuefinder__modal-layout__container" }, Bl = { class: "vuefinder__modal-layout__content" }, Rl = { class: "vuefinder__modal-layout__footer" }, Ye = {
  __name: "ModalLayout",
  setup(t) {
    const e = A(null), n = re("ServiceContainer");
    return Ce(() => {
      const o = document.querySelector(".v-f-modal input");
      o && o.focus(), vt(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (o, s) => (f(), g("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = $t((i) => r(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = l("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      l("div", Hl, [
        l("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = et((i) => r(n).modal.close(), ["self"]))
        }, [
          l("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            l("div", Bl, [
              Lt(o.$slots, "default")
            ]),
            l("div", Rl, [
              Lt(o.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, Ul = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, s] of e)
    n[o] = s;
  return n;
}, Nl = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const o = re("ServiceContainer"), s = A(!1), { t: i } = o.i18n;
    let c = null;
    const u = () => {
      clearTimeout(c), s.value = !0, c = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return Ce(() => {
      o.emitter.on(t.on, u);
    }), Jn(() => {
      clearTimeout(c);
    }), {
      shown: s,
      t: i
    };
  }
}, Pl = { key: 1 };
function ql(t, e, n, o, s, i) {
  return f(), g("div", {
    class: ae(["vuefinder__action-message", { "vuefinder__action-message--hidden": !o.shown }])
  }, [
    t.$slots.default ? Lt(t.$slots, "default", { key: 0 }) : (f(), g("span", Pl, b(o.t("Saved.")), 1))
  ], 2);
}
const _t = /* @__PURE__ */ Ul(Nl, [["render", ql]]), zl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function jl(t, e) {
  return f(), g("svg", zl, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ]));
}
const Gl = { render: jl }, Wl = { class: "vuefinder__modal-header" }, Kl = { class: "vuefinder__modal-header__icon-container" }, Yl = {
  class: "vuefinder__modal-header__title",
  id: "modal-title"
}, nt = {
  __name: "ModalHeader",
  props: {
    title: {
      type: String,
      required: !0
    },
    icon: {
      type: Object,
      required: !0
    }
  },
  setup(t) {
    return (e, n) => (f(), g("div", Wl, [
      l("div", Kl, [
        (f(), K(Us(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      l("h3", Yl, b(t.title), 1)
    ]));
  }
}, Xl = { class: "vuefinder__about-modal__content" }, Zl = { class: "vuefinder__about-modal__main" }, Ql = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, Jl = ["onClick", "aria-current"], ea = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, ta = { class: "vuefinder__about-modal__description" }, na = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, sa = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, oa = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, ra = { class: "vuefinder__about-modal__description" }, la = { class: "vuefinder__about-modal__settings" }, aa = { class: "vuefinder__about-modal__setting flex" }, ia = { class: "vuefinder__about-modal__setting-input" }, ca = { class: "vuefinder__about-modal__setting-label" }, da = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, ua = { class: "vuefinder__about-modal__setting flex" }, va = { class: "vuefinder__about-modal__setting-input" }, fa = { class: "vuefinder__about-modal__setting-label" }, _a = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, ma = { class: "vuefinder__about-modal__setting flex" }, pa = { class: "vuefinder__about-modal__setting-input" }, ha = { class: "vuefinder__about-modal__setting-label" }, ga = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, ba = { class: "vuefinder__about-modal__setting flex" }, wa = { class: "vuefinder__about-modal__setting-input" }, ya = { class: "vuefinder__about-modal__setting-label" }, ka = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, xa = { class: "vuefinder__about-modal__setting" }, Sa = { class: "vuefinder__about-modal__setting-input" }, $a = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, Ca = { class: "vuefinder__about-modal__setting-label" }, Ea = ["label"], Ta = ["value"], Ma = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Aa = { class: "vuefinder__about-modal__setting-input" }, Da = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, Va = { class: "vuefinder__about-modal__setting-label" }, La = ["label"], Oa = ["value"], Fa = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Ia = { class: "vuefinder__about-modal__shortcuts" }, Ha = { class: "vuefinder__about-modal__shortcut" }, Ba = { class: "vuefinder__about-modal__shortcut" }, Ra = { class: "vuefinder__about-modal__shortcut" }, Ua = { class: "vuefinder__about-modal__shortcut" }, Na = { class: "vuefinder__about-modal__shortcut" }, Pa = { class: "vuefinder__about-modal__shortcut" }, qa = { class: "vuefinder__about-modal__shortcut" }, za = { class: "vuefinder__about-modal__shortcut" }, ja = { class: "vuefinder__about-modal__shortcut" }, Ga = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, Wa = { class: "vuefinder__about-modal__description" }, Fo = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: o } = e.storage, { t: s } = e.i18n, i = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, c = wt(() => [
      { name: s("About"), key: i.ABOUT },
      { name: s("Settings"), key: i.SETTINGS },
      { name: s("Shortcuts"), key: i.SHORTCUTS },
      { name: s("Reset"), key: i.RESET }
    ]), u = A("about"), a = async () => {
      o(), location.reload();
    }, d = (I) => {
      e.theme.set(I), e.emitter.emit("vf-theme-saved");
    }, _ = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? zs : qs, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, v = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, p = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, m = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: h } = re("VueFinderOptions"), $ = Object.fromEntries(
      Object.entries({
        ar: "Arabic (العربيّة)",
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        fa: "Persian (فارسی)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        pl: "Polish (Polski)",
        ru: "Russian (Pусский)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)",
        nl: "Dutch (Nederlands)",
        zhCN: "Simplified Chinese (简体中文)",
        zhTW: "Traditional Chinese (繁體中文)"
      }).filter(([I]) => Object.keys(h).includes(I))
    ), M = wt(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (I, D) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: D[7] || (D[7] = (C) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(s)("Close")), 1)
      ]),
      default: J(() => [
        l("div", Xl, [
          q(nt, {
            icon: r(Gl),
            title: "Vuefinder " + r(e).version
          }, null, 8, ["icon", "title"]),
          l("div", Zl, [
            l("div", null, [
              l("div", null, [
                l("nav", Ql, [
                  (f(!0), g(we, null, xe(c.value, (C) => (f(), g("button", {
                    key: C.name,
                    onClick: (V) => u.value = C.key,
                    class: ae([C.key === u.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": C.current ? "page" : void 0
                  }, b(C.name), 11, Jl))), 128))
                ])
              ])
            ]),
            u.value === i.ABOUT ? (f(), g("div", ea, [
              l("div", ta, b(r(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              l("a", na, b(r(s)("Project home")), 1),
              l("a", sa, b(r(s)("Follow on GitHub")), 1)
            ])) : R("", !0),
            u.value === i.SETTINGS ? (f(), g("div", oa, [
              l("div", ra, b(r(s)("Customize your experience with the following settings")), 1),
              l("div", la, [
                l("fieldset", null, [
                  l("div", aa, [
                    l("div", ia, [
                      ve(l("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": D[0] || (D[0] = (C) => r(e).metricUnits = C),
                        onClick: _,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [Xt, r(e).metricUnits]
                      ])
                    ]),
                    l("div", ca, [
                      l("label", da, [
                        Z(b(r(s)("Use Metric Units")) + " ", 1),
                        q(_t, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: J(() => [
                            Z(b(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ua, [
                    l("div", va, [
                      ve(l("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": D[1] || (D[1] = (C) => r(e).compactListView = C),
                        onClick: v,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [Xt, r(e).compactListView]
                      ])
                    ]),
                    l("div", fa, [
                      l("label", _a, [
                        Z(b(r(s)("Compact list view")) + " ", 1),
                        q(_t, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: J(() => [
                            Z(b(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ma, [
                    l("div", pa, [
                      ve(l("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": D[2] || (D[2] = (C) => r(e).persist = C),
                        onClick: m,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [Xt, r(e).persist]
                      ])
                    ]),
                    l("div", ha, [
                      l("label", ga, [
                        Z(b(r(s)("Persist path on reload")) + " ", 1),
                        q(_t, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: J(() => [
                            Z(b(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ba, [
                    l("div", wa, [
                      ve(l("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": D[3] || (D[3] = (C) => r(e).showThumbnails = C),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [Xt, r(e).showThumbnails]
                      ])
                    ]),
                    l("div", ya, [
                      l("label", ka, [
                        Z(b(r(s)("Show thumbnails")) + " ", 1),
                        q(_t, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: J(() => [
                            Z(b(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", xa, [
                    l("div", Sa, [
                      l("label", $a, b(r(s)("Theme")), 1)
                    ]),
                    l("div", Ca, [
                      ve(l("select", {
                        id: "theme",
                        "onUpdate:modelValue": D[4] || (D[4] = (C) => r(e).theme.value = C),
                        onChange: D[5] || (D[5] = (C) => d(C.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: r(s)("Theme")
                        }, [
                          (f(!0), g(we, null, xe(M.value, (C, V) => (f(), g("option", { value: V }, b(C), 9, Ta))), 256))
                        ], 8, Ea)
                      ], 544), [
                        [In, r(e).theme.value]
                      ]),
                      q(_t, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: J(() => [
                          Z(b(r(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  r(e).features.includes(r(ue).LANGUAGE) && Object.keys(r($)).length > 1 ? (f(), g("div", Ma, [
                    l("div", Aa, [
                      l("label", Da, b(r(s)("Language")), 1)
                    ]),
                    l("div", Va, [
                      ve(l("select", {
                        id: "language",
                        "onUpdate:modelValue": D[6] || (D[6] = (C) => r(e).i18n.locale = C),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: r(s)("Language")
                        }, [
                          (f(!0), g(we, null, xe(r($), (C, V) => (f(), g("option", { value: V }, b(C), 9, Oa))), 256))
                        ], 8, La)
                      ], 512), [
                        [In, r(e).i18n.locale]
                      ]),
                      q(_t, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: J(() => [
                          Z(b(r(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : R("", !0)
                ])
              ])
            ])) : R("", !0),
            u.value === i.SHORTCUTS ? (f(), g("div", Fa, [
              l("div", Ia, [
                l("div", Ha, [
                  l("div", null, b(r(s)("Rename")), 1),
                  D[8] || (D[8] = l("kbd", null, "F2", -1))
                ]),
                l("div", Ba, [
                  l("div", null, b(r(s)("Refresh")), 1),
                  D[9] || (D[9] = l("kbd", null, "F5", -1))
                ]),
                l("div", Ra, [
                  Z(b(r(s)("Delete")) + " ", 1),
                  D[10] || (D[10] = l("kbd", null, "Del", -1))
                ]),
                l("div", Ua, [
                  Z(b(r(s)("Escape")) + " ", 1),
                  D[11] || (D[11] = l("div", null, [
                    l("kbd", null, "Esc")
                  ], -1))
                ]),
                l("div", Na, [
                  Z(b(r(s)("Select All")) + " ", 1),
                  D[12] || (D[12] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "A")
                  ], -1))
                ]),
                l("div", Pa, [
                  Z(b(r(s)("Search")) + " ", 1),
                  D[13] || (D[13] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "F")
                  ], -1))
                ]),
                l("div", qa, [
                  Z(b(r(s)("Toggle Sidebar")) + " ", 1),
                  D[14] || (D[14] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "E")
                  ], -1))
                ]),
                l("div", za, [
                  Z(b(r(s)("Open Settings")) + " ", 1),
                  D[15] || (D[15] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, ",")
                  ], -1))
                ]),
                l("div", ja, [
                  Z(b(r(s)("Toggle Full Screen")) + " ", 1),
                  D[16] || (D[16] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : R("", !0),
            u.value === i.RESET ? (f(), g("div", Ga, [
              l("div", Wa, b(r(s)("Reset all settings to default")), 1),
              l("button", {
                onClick: a,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(r(s)("Reset Settings")), 1)
            ])) : R("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ka = ["title"], Xe = {
  __name: "Message",
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(t, { emit: e }) {
    var d;
    const n = e, o = re("ServiceContainer"), { t: s } = o.i18n, i = A(!1), c = A(null), u = A((d = c.value) == null ? void 0 : d.strMessage);
    Ve(u, () => i.value = !1);
    const a = () => {
      n("hidden"), i.value = !0;
    };
    return (_, v) => (f(), g("div", null, [
      i.value ? R("", !0) : (f(), g("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: ae(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        Lt(_.$slots, "default"),
        l("div", {
          class: "vuefinder__message__close",
          onClick: a,
          title: r(s)("Close")
        }, v[0] || (v[0] = [
          l("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            l("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ]), 8, Ka)
      ], 2))
    ]));
  }
}, Ya = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Xa(t, e) {
  return f(), g("svg", Ya, e[0] || (e[0] = [
    l("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Io = { render: Xa }, Za = { class: "vuefinder__delete-modal__content" }, Qa = { class: "vuefinder__delete-modal__form" }, Ja = { class: "vuefinder__delete-modal__description" }, ei = { class: "vuefinder__delete-modal__files vf-scrollbar" }, ti = { class: "vuefinder__delete-modal__file" }, ni = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, si = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, oi = { class: "vuefinder__delete-modal__file-name" }, ri = { class: "vuefinder__delete-modal__warning" }, fs = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(e.modal.data.items), s = A(""), i = () => {
      o.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: o.value.map(({ path: c, type: u }) => ({ path: c, type: u }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-danger"
        }, b(r(n)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (a) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Cancel")), 1),
        l("div", ri, b(r(n)("This action cannot be undone.")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(Io),
            title: r(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          l("div", Za, [
            l("div", Qa, [
              l("p", Ja, b(r(n)("Are you sure you want to delete these files?")), 1),
              l("div", ei, [
                (f(!0), g(we, null, xe(o.value, (a) => (f(), g("p", ti, [
                  a.type === "dir" ? (f(), g("svg", ni, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), g("svg", si, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", oi, b(a.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: u[0] || (u[0] = (a) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, li = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function ai(t, e) {
  return f(), g("svg", li, e[0] || (e[0] = [
    l("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Ho = { render: ai }, ii = { class: "vuefinder__rename-modal__content" }, ci = { class: "vuefinder__rename-modal__item" }, di = { class: "vuefinder__rename-modal__item-info" }, ui = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, vi = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, fi = { class: "vuefinder__rename-modal__item-name" }, _s = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(e.modal.data.items[0]), s = A(e.modal.data.items[0].basename), i = A(""), c = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: o.value.path,
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is renamed.", s.value) });
        },
        onError: (u) => {
          i.value = n(u.message);
        }
      });
    };
    return (u, a) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(r(n)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(Ho),
            title: r(n)("Rename")
          }, null, 8, ["icon", "title"]),
          l("div", ii, [
            l("div", ci, [
              l("p", di, [
                o.value.type === "dir" ? (f(), g("svg", ui, a[3] || (a[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), g("svg", vi, a[4] || (a[4] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", fi, b(o.value.basename), 1)
              ]),
              ve(l("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (d) => s.value = d),
                onKeyup: $t(c, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [Ct, s.value]
              ]),
              i.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => i.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(i.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ze = {
  ESCAPE: "Escape",
  F2: "F2",
  F5: "F5",
  DELETE: "Delete",
  ENTER: "Enter",
  BACKSLASH: "Backslash",
  KEY_A: "KeyA",
  KEY_E: "KeyE",
  KEY_F: "KeyF"
};
function _i(t) {
  const e = (n) => {
    n.code === Ze.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Ze.F2 && t.features.includes(ue.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(_s, { items: t.dragSelect.getSelected() })), n.code === Ze.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Ze.DELETE && (!t.dragSelect.getCount() || t.modal.open(fs, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Ze.BACKSLASH && t.modal.open(Fo), n.metaKey && n.code === Ze.KEY_F && t.features.includes(ue.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Ze.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Ze.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Ze.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
  };
  Ce(() => {
    t.root.addEventListener("keydown", e);
  });
}
const mi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function pi(t, e) {
  return f(), g("svg", mi, e[0] || (e[0] = [
    l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Bo = { render: pi }, hi = { class: "vuefinder__new-folder-modal__content" }, gi = { class: "vuefinder__new-folder-modal__form" }, bi = { class: "vuefinder__new-folder-modal__description" }, wi = ["placeholder"], Ro = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, { t: o } = e.i18n, s = A(""), i = A(""), c = () => {
      s.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: o("%s is created.", s.value) });
        },
        onError: (u) => {
          i.value = o(u.message);
        }
      });
    };
    return (u, a) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(r(o)("Create")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(o)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(Bo),
            title: r(o)("New Folder")
          }, null, 8, ["icon", "title"]),
          l("div", hi, [
            l("div", gi, [
              l("p", bi, b(r(o)("Create a new folder")), 1),
              ve(l("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (d) => s.value = d),
                onKeyup: $t(c, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: r(o)("Folder Name"),
                type: "text"
              }, null, 40, wi), [
                [Ct, s.value]
              ]),
              i.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => i.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(i.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, yi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function ki(t, e) {
  return f(), g("svg", yi, e[0] || (e[0] = [
    l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Uo = { render: ki }, xi = { class: "vuefinder__new-file-modal__content" }, Si = { class: "vuefinder__new-file-modal__form" }, $i = { class: "vuefinder__new-file-modal__description" }, Ci = ["placeholder"], Ei = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, { t: o } = e.i18n, s = A(""), i = A(""), c = () => {
      s.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: o("%s is created.", s.value) });
        },
        onError: (u) => {
          i.value = o(u.message);
        }
      });
    };
    return (u, a) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(r(o)("Create")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(o)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(Uo),
            title: r(o)("New File")
          }, null, 8, ["icon", "title"]),
          l("div", xi, [
            l("div", Si, [
              l("p", $i, b(r(o)("Create a new file")), 1),
              ve(l("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (d) => s.value = d),
                onKeyup: $t(c, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: r(o)("File Name"),
                type: "text"
              }, null, 40, Ci), [
                [Ct, s.value]
              ]),
              i.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => i.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(i.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function Zn(t, e = 14) {
  let n = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(n), "$2..$4");
}
const Ti = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Mi(t, e) {
  return f(), g("svg", Ti, e[0] || (e[0] = [
    l("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const No = { render: Mi }, Ai = { class: "vuefinder__upload-modal__content" }, Di = {
  key: 0,
  class: "pointer-events-none"
}, Vi = {
  key: 1,
  class: "pointer-events-none"
}, Li = ["disabled"], Oi = ["disabled"], Fi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Ii = ["textContent"], Hi = { class: "vuefinder__upload-modal__file-info" }, Bi = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Ri = { class: "vuefinder__upload-modal__file-name md:hidden" }, Ui = {
  key: 0,
  class: "ml-auto"
}, Ni = ["title", "disabled", "onClick"], Pi = {
  key: 0,
  class: "py-2"
}, qi = ["disabled"], zi = {
  __name: "ModalUpload",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = n("uppy"), s = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, i = A({ QUEUE_ENTRY_STATUS: s }), c = A(null), u = A(null), a = A(null), d = A(null), _ = A(null), v = A(null), p = A([]), m = A(""), h = A(!1), x = A(!1);
    let $;
    function M(k) {
      return p.value.findIndex((B) => B.id === k);
    }
    function I(k, B = null) {
      B = B ?? (k.webkitRelativePath || k.name), $.addFile({
        name: B,
        type: k.type,
        data: k,
        source: "Local"
      });
    }
    function D(k) {
      switch (k.status) {
        case s.DONE:
          return "text-green-600";
        case s.ERROR:
          return "text-red-600";
        case s.CANCELED:
          return "text-red-600";
        case s.PENDING:
        default:
          return "";
      }
    }
    const C = (k) => {
      switch (k.status) {
        case s.DONE:
          return "✓";
        case s.ERROR:
        case s.CANCELED:
          return "!";
        case s.PENDING:
        default:
          return "...";
      }
    };
    function V() {
      d.value.click();
    }
    function F() {
      if (!h.value) {
        if (!p.value.filter((k) => k.status !== s.DONE).length) {
          m.value = n("Please select file to upload first.");
          return;
        }
        m.value = "", $.retryAll(), $.upload();
      }
    }
    function j() {
      $.cancelAll({ reason: "user" }), p.value.forEach((k) => {
        k.status !== s.DONE && (k.status = s.CANCELED, k.statusName = n("Canceled"));
      }), h.value = !1;
    }
    function O(k) {
      h.value || ($.removeFile(k.id, "removed-by-user"), p.value.splice(M(k.id), 1));
    }
    function w(k) {
      if (!h.value) {
        if ($.cancelAll({ reason: "user" }), k) {
          const B = [];
          p.value.forEach((S) => {
            S.status !== s.DONE && B.push(S);
          }), p.value = [], B.forEach((S) => {
            I(S.originalFile, S.name);
          });
          return;
        }
        p.value.splice(0);
      }
    }
    function y() {
      e.modal.close();
    }
    function L() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    }
    return Ce(async () => {
      $ = new hr({
        debug: e.debug,
        restrictions: {
          maxFileSize: Tr(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: o,
        onBeforeFileAdded(S, U) {
          if (U[S.id] != null) {
            const ee = M(S.id);
            p.value[ee].status === s.PENDING && (m.value = $.i18n("noDuplicates", { fileName: S.name })), p.value = p.value.filter((se) => se.id !== S.id);
          }
          return p.value.push({
            id: S.id,
            name: S.name,
            size: e.filesize(S.size),
            status: s.PENDING,
            statusName: n("Pending upload"),
            percent: null,
            originalFile: S.data
          }), !0;
        }
      }), $.use(gr, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(S, U) {
          let N;
          try {
            N = JSON.parse(S).message;
          } catch {
            N = n("Cannot parse server response.");
          }
          return new Error(N);
        }
      }), $.on("restriction-failed", (S, U) => {
        const N = p.value[M(S.id)];
        O(N), m.value = U.message;
      }), $.on("upload", () => {
        const S = L();
        $.setMeta({ ...S.body });
        const U = $.getPlugin("XHRUpload");
        U.opts.method = S.method, U.opts.endpoint = S.url + "?" + new URLSearchParams(S.params), U.opts.headers = S.headers, delete S.headers["Content-Type"], h.value = !0, p.value.forEach((N) => {
          N.status !== s.DONE && (N.percent = null, N.status = s.UPLOADING, N.statusName = n("Pending upload"));
        });
      }), $.on("upload-progress", (S, U) => {
        const N = Math.floor(U.bytesUploaded / U.bytesTotal * 100);
        p.value[M(S.id)].percent = `${N}%`;
      }), $.on("upload-success", (S) => {
        const U = p.value[M(S.id)];
        U.status = s.DONE, U.statusName = n("Done");
      }), $.on("upload-error", (S, U) => {
        const N = p.value[M(S.id)];
        N.percent = null, N.status = s.ERROR, U.isNetworkError ? N.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : N.statusName = U ? U.message : n("Unknown Error");
      }), $.on("error", (S) => {
        m.value = S.message, h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), $.on("complete", () => {
        h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), d.value.addEventListener("click", () => {
        u.value.click();
      }), _.value.addEventListener("click", () => {
        a.value.click();
      }), v.value.addEventListener("dragover", (S) => {
        S.preventDefault(), x.value = !0;
      }), v.value.addEventListener("dragleave", (S) => {
        S.preventDefault(), x.value = !1;
      });
      function k(S, U) {
        U.isFile && U.file((N) => S(U, N)), U.isDirectory && U.createReader().readEntries((N) => {
          N.forEach((ee) => {
            k(S, ee);
          });
        });
      }
      v.value.addEventListener("drop", (S) => {
        S.preventDefault(), x.value = !1;
        const U = /^[/\\](.+)/;
        [...S.dataTransfer.items].forEach((N) => {
          N.kind === "file" && k((ee, se) => {
            const ne = U.exec(ee.fullPath);
            I(se, ne[1]);
          }, N.webkitGetAsEntry());
        });
      });
      const B = ({ target: S }) => {
        const U = S.files;
        for (const N of U)
          I(N);
        S.value = "";
      };
      u.value.addEventListener("change", B), a.value.addEventListener("change", B);
    }), Ns(() => {
      $ == null || $.close({ reason: "unmount" });
    }), (k, B) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: h.value,
          onClick: et(F, ["prevent"])
        }, b(r(n)("Upload")), 9, qi),
        h.value ? (f(), g("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(j, ["prevent"])
        }, b(r(n)("Cancel")), 1)) : (f(), g("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(y, ["prevent"])
        }, b(r(n)("Close")), 1))
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(No),
            title: r(n)("Upload Files")
          }, null, 8, ["icon", "title"]),
          l("div", Ai, [
            l("div", {
              class: "vuefinder__upload-modal__drop-area",
              ref_key: "dropArea",
              ref: v,
              onClick: V
            }, [
              x.value ? (f(), g("div", Di, b(r(n)("Release to drop these files.")), 1)) : (f(), g("div", Vi, b(r(n)("Drag and drop the files/folders to here or click here.")), 1))
            ], 512),
            l("div", {
              ref_key: "container",
              ref: c,
              class: "vuefinder__upload-modal__buttons"
            }, [
              l("button", {
                ref_key: "pickFiles",
                ref: d,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(r(n)("Select Files")), 513),
              l("button", {
                ref_key: "pickFolders",
                ref: _,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(r(n)("Select Folders")), 513),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: B[0] || (B[0] = (S) => w(!1))
              }, b(r(n)("Clear all")), 9, Li),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: B[1] || (B[1] = (S) => w(!0))
              }, b(r(n)("Clear only successful")), 9, Oi)
            ], 512),
            l("div", Fi, [
              (f(!0), g(we, null, xe(p.value, (S) => (f(), g("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: S.id
              }, [
                l("span", {
                  class: ae(["vuefinder__upload-modal__file-icon", D(S)])
                }, [
                  l("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: b(C(S))
                  }, null, 8, Ii)
                ], 2),
                l("div", Hi, [
                  l("div", Bi, b(r(Zn)(S.name, 40)) + " (" + b(S.size) + ")", 1),
                  l("div", Ri, b(r(Zn)(S.name, 16)) + " (" + b(S.size) + ")", 1),
                  l("div", {
                    class: ae(["vuefinder__upload-modal__file-status", D(S)])
                  }, [
                    Z(b(S.statusName) + " ", 1),
                    S.status === i.value.QUEUE_ENTRY_STATUS.UPLOADING ? (f(), g("b", Ui, b(S.percent), 1)) : R("", !0)
                  ], 2)
                ]),
                l("button", {
                  type: "button",
                  class: ae(["vuefinder__upload-modal__file-remove", h.value ? "disabled" : ""]),
                  title: r(n)("Delete"),
                  disabled: h.value,
                  onClick: (U) => O(S)
                }, B[3] || (B[3] = [
                  l("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ]), 10, Ni)
              ]))), 128)),
              p.value.length ? R("", !0) : (f(), g("div", Pi, b(r(n)("No files selected!")), 1))
            ]),
            m.value.length ? (f(), K(Xe, {
              key: 0,
              onHidden: B[2] || (B[2] = (S) => m.value = ""),
              error: ""
            }, {
              default: J(() => [
                Z(b(m.value), 1)
              ]),
              _: 1
            })) : R("", !0)
          ])
        ]),
        l("input", {
          ref_key: "internalFileInput",
          ref: u,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        l("input", {
          ref_key: "internalFolderInput",
          ref: a,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, ji = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Gi(t, e) {
  return f(), g("svg", ji, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Po = { render: Gi }, Wi = { class: "vuefinder__unarchive-modal__content" }, Ki = { class: "vuefinder__unarchive-modal__items" }, Yi = { class: "vuefinder__unarchive-modal__item" }, Xi = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Zi = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qi = { class: "vuefinder__unarchive-modal__item-name" }, Ji = { class: "vuefinder__unarchive-modal__info" }, qo = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(e.modal.data.items[0]), s = A(""), i = A([]), c = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: o.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (u) => {
          s.value = n(u.message);
        }
      });
    };
    return (u, a) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(r(n)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: a[1] || (a[1] = (d) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(Po),
            title: r(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          l("div", Wi, [
            l("div", Ki, [
              (f(!0), g(we, null, xe(i.value, (d) => (f(), g("p", Yi, [
                d.type === "dir" ? (f(), g("svg", Xi, a[2] || (a[2] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), g("svg", Zi, a[3] || (a[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", Qi, b(d.basename), 1)
              ]))), 256)),
              l("p", Ji, b(r(n)("The archive will be unarchived at")) + " (" + b(r(e).fs.data.dirname) + ")", 1),
              s.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: a[0] || (a[0] = (d) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ec = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function tc(t, e) {
  return f(), g("svg", ec, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const zo = { render: tc }, nc = { class: "vuefinder__archive-modal__content" }, sc = { class: "vuefinder__archive-modal__form" }, oc = { class: "vuefinder__archive-modal__files vf-scrollbar" }, rc = { class: "vuefinder__archive-modal__file" }, lc = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ac = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ic = { class: "vuefinder__archive-modal__file-name" }, cc = ["placeholder"], jo = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(""), s = A(""), i = A(e.modal.data.items), c = () => {
      i.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: i.value.map(({ path: u, type: a }) => ({ path: u, type: a })),
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (u) => {
          s.value = n(u.message);
        }
      });
    };
    return (u, a) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(r(n)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(zo),
            title: r(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          l("div", nc, [
            l("div", sc, [
              l("div", oc, [
                (f(!0), g(we, null, xe(i.value, (d) => (f(), g("p", rc, [
                  d.type === "dir" ? (f(), g("svg", lc, a[3] || (a[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), g("svg", ac, a[4] || (a[4] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", ic, b(d.basename), 1)
                ]))), 256))
              ]),
              ve(l("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (d) => o.value = d),
                onKeyup: $t(c, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: r(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, cc), [
                [Ct, o.value]
              ]),
              s.value.length ? (f(), K(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : R("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, dc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function uc(t, e) {
  return f(), g("svg", dc, e[0] || (e[0] = [
    l("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    }, null, -1),
    l("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ]));
}
const ms = { render: uc }, vc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function fc(t, e) {
  return f(), g("svg", vc, e[0] || (e[0] = [
    l("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ]));
}
const _c = { render: fc }, mc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function pc(t, e) {
  return f(), g("svg", mc, e[0] || (e[0] = [
    l("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ]));
}
const hc = { render: pc }, gc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function bc(t, e) {
  return f(), g("svg", gc, e[0] || (e[0] = [
    l("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ]));
}
const wc = { render: bc }, yc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function kc(t, e) {
  return f(), g("svg", yc, e[0] || (e[0] = [
    l("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const xc = { render: kc }, Sc = { class: "vuefinder__toolbar" }, $c = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, Cc = ["title"], Ec = ["title"], Tc = ["title"], Mc = ["title"], Ac = ["title"], Dc = ["title"], Vc = ["title"], Lc = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Oc = { class: "pl-2" }, Fc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Ic = { class: "vuefinder__toolbar__controls" }, Hc = ["title"], Bc = ["title"], Rc = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: o } = e.i18n, s = e.dragSelect, i = A("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      i.value = a;
    });
    const c = () => {
      e.fullScreen = !e.fullScreen;
    };
    Ve(() => e.fullScreen, () => {
      e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    });
    const u = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (a, d) => (f(), g("div", Sc, [
      i.value.length ? (f(), g("div", Lc, [
        l("div", Oc, [
          Z(b(r(o)("Search results for")) + " ", 1),
          l("span", Fc, b(i.value), 1)
        ]),
        r(e).loadingIndicator === "circular" && r(e).fs.loading ? (f(), K(r(ms), { key: 0 })) : R("", !0)
      ])) : (f(), g("div", $c, [
        r(e).features.includes(r(ue).NEW_FOLDER) ? (f(), g("div", {
          key: 0,
          class: "mx-1.5",
          title: r(o)("New Folder"),
          onClick: d[0] || (d[0] = (_) => r(e).modal.open(Ro, { items: r(s).getSelected() }))
        }, [
          q(r(Bo))
        ], 8, Cc)) : R("", !0),
        r(e).features.includes(r(ue).NEW_FILE) ? (f(), g("div", {
          key: 1,
          class: "mx-1.5",
          title: r(o)("New File"),
          onClick: d[1] || (d[1] = (_) => r(e).modal.open(Ei, { items: r(s).getSelected() }))
        }, [
          q(r(Uo))
        ], 8, Ec)) : R("", !0),
        r(e).features.includes(r(ue).RENAME) ? (f(), g("div", {
          key: 2,
          class: "mx-1.5",
          title: r(o)("Rename"),
          onClick: d[2] || (d[2] = (_) => r(s).getCount() !== 1 || r(e).modal.open(_s, { items: r(s).getSelected() }))
        }, [
          q(r(Ho), {
            class: ae(r(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Tc)) : R("", !0),
        r(e).features.includes(r(ue).DELETE) ? (f(), g("div", {
          key: 3,
          class: "mx-1.5",
          title: r(o)("Delete"),
          onClick: d[3] || (d[3] = (_) => !r(s).getCount() || r(e).modal.open(fs, { items: r(s).getSelected() }))
        }, [
          q(r(Io), {
            class: ae(r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Mc)) : R("", !0),
        r(e).features.includes(r(ue).UPLOAD) ? (f(), g("div", {
          key: 4,
          class: "mx-1.5",
          title: r(o)("Upload"),
          onClick: d[4] || (d[4] = (_) => r(e).modal.open(zi, { items: r(s).getSelected() }))
        }, [
          q(r(No))
        ], 8, Ac)) : R("", !0),
        r(e).features.includes(r(ue).UNARCHIVE) && r(s).getCount() === 1 && r(s).getSelected()[0].mime_type === "application/zip" ? (f(), g("div", {
          key: 5,
          class: "mx-1.5",
          title: r(o)("Unarchive"),
          onClick: d[5] || (d[5] = (_) => !r(s).getCount() || r(e).modal.open(qo, { items: r(s).getSelected() }))
        }, [
          q(r(Po), {
            class: ae(r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Dc)) : R("", !0),
        r(e).features.includes(r(ue).ARCHIVE) ? (f(), g("div", {
          key: 6,
          class: "mx-1.5",
          title: r(o)("Archive"),
          onClick: d[6] || (d[6] = (_) => !r(s).getCount() || r(e).modal.open(jo, { items: r(s).getSelected() }))
        }, [
          q(r(zo), {
            class: ae(r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Vc)) : R("", !0)
      ])),
      l("div", Ic, [
        r(e).features.includes(r(ue).FULL_SCREEN) ? (f(), g("div", {
          key: 0,
          onClick: c,
          class: "mx-1.5",
          title: r(o)("Toggle Full Screen")
        }, [
          r(e).fullScreen ? (f(), K(r(hc), { key: 0 })) : (f(), K(r(_c), { key: 1 }))
        ], 8, Hc)) : R("", !0),
        l("div", {
          class: "mx-1.5",
          title: r(o)("Change View"),
          onClick: d[7] || (d[7] = (_) => i.value.length || u())
        }, [
          r(e).view === "grid" ? (f(), K(r(wc), {
            key: 0,
            class: ae(["vf-toolbar-icon", i.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : R("", !0),
          r(e).view === "list" ? (f(), K(r(xc), {
            key: 1,
            class: ae(["vf-toolbar-icon", i.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : R("", !0)
        ], 8, Bc)
      ])
    ]));
  }
}, Uc = (t, e = 0, n = !1) => {
  let o;
  return (...s) => {
    n && !o && t(...s), clearTimeout(o), o = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Hs = (t, e, n) => {
  const o = A(t);
  return ir((s, i) => ({
    get() {
      return s(), o.value;
    },
    set: Uc(
      (c) => {
        o.value = c, i();
      },
      e,
      n
    )
  }));
}, Nc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Pc(t, e) {
  return f(), g("svg", Nc, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const qc = { render: Pc }, zc = { class: "vuefinder__move-modal__content" }, jc = { class: "vuefinder__move-modal__description" }, Gc = { class: "vuefinder__move-modal__files vf-scrollbar" }, Wc = { class: "vuefinder__move-modal__file" }, Kc = {
  key: 0,
  class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Yc = {
  key: 1,
  class: "vuefinder__move-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Xc = { class: "vuefinder__move-modal__file-name" }, Zc = { class: "vuefinder__move-modal__target-title" }, Qc = { class: "vuefinder__move-modal__target-directory" }, Jc = { class: "vuefinder__move-modal__target-path" }, ed = { class: "vuefinder__move-modal__selected-items" }, Qn = {
  __name: "ModalMove",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(e.modal.data.items.from), s = A(""), i = () => {
      o.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: o.value.map(({ path: c, type: u }) => ({ path: c, type: u })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(r(n)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (a) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Cancel")), 1),
        l("div", ed, b(r(n)("%s item(s) selected.", o.value.length)), 1)
      ]),
      default: J(() => [
        l("div", null, [
          q(nt, {
            icon: r(qc),
            title: r(n)("Move files")
          }, null, 8, ["icon", "title"]),
          l("div", zc, [
            l("p", jc, b(r(n)("Are you sure you want to move these files?")), 1),
            l("div", Gc, [
              (f(!0), g(we, null, xe(o.value, (a) => (f(), g("div", Wc, [
                l("div", null, [
                  a.type === "dir" ? (f(), g("svg", Kc, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), g("svg", Yc, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                l("div", Xc, b(a.path), 1)
              ]))), 256))
            ]),
            l("h4", Zc, b(r(n)("Target Directory")), 1),
            l("p", Qc, [
              u[4] || (u[4] = l("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1"
              }, [
                l("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                })
              ], -1)),
              l("span", Jc, b(r(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (f(), K(Xe, {
              key: 0,
              onHidden: u[0] || (u[0] = (a) => s.value = ""),
              error: ""
            }, {
              default: J(() => [
                Z(b(s.value), 1)
              ]),
              _: 1
            })) : R("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, td = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
};
function nd(t, e) {
  return f(), g("svg", td, e[0] || (e[0] = [
    l("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const sd = { render: nd }, od = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function rd(t, e) {
  return f(), g("svg", od, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const ld = { render: rd }, ad = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
};
function id(t, e) {
  return f(), g("svg", ad, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const cd = { render: id }, dd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function ud(t, e) {
  return f(), g("svg", dd, e[0] || (e[0] = [
    l("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const vd = { render: ud }, fd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function _d(t, e) {
  return f(), g("svg", fd, e[0] || (e[0] = [
    l("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ]));
}
const md = { render: _d }, pd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function hd(t, e) {
  return f(), g("svg", pd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const gd = { render: hd }, bd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
};
function wd(t, e) {
  return f(), g("svg", bd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ]));
}
const kn = { render: wd }, yd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
  viewBox: "0 0 24 24"
};
function kd(t, e) {
  return f(), g("svg", yd, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const xd = { render: kd }, Sd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function $d(t, e) {
  return f(), g("svg", Sd, e[0] || (e[0] = [
    l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const Cd = { render: $d }, Ed = { class: "vuefinder__breadcrumb__container" }, Td = ["title"], Md = ["title"], Ad = ["title"], Dd = ["title"], Vd = { class: "vuefinder__breadcrumb__list" }, Ld = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Od = { class: "relative" }, Fd = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Id = { class: "vuefinder__breadcrumb__search-mode" }, Hd = ["placeholder"], Bd = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Rd = ["onDrop", "onClick"], Ud = { class: "vuefinder__breadcrumb__hidden-item-content" }, Nd = { class: "vuefinder__breadcrumb__hidden-item-text" }, Pd = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = e.dragSelect, { setStore: s } = e.storage, i = A(null), c = Hs(0, 100);
    Ve(c, (O) => {
      const w = i.value.children;
      let y = 0, L = 0, k = 5, B = 1;
      e.fs.limitBreadcrumbItems(k), vt(() => {
        for (let S = w.length - 1; S >= 0 && !(y + w[S].offsetWidth > c.value - 40); S--)
          y += parseInt(w[S].offsetWidth, 10), L++;
        L < B && (L = B), L > k && (L = k), e.fs.limitBreadcrumbItems(L);
      });
    });
    const u = () => {
      c.value = i.value.offsetWidth;
    };
    let a = A(null);
    Ce(() => {
      a.value = new ResizeObserver(u), a.value.observe(i.value);
    }), Jn(() => {
      a.value.disconnect();
    });
    const d = (O, w = null) => {
      O.preventDefault(), o.isDraggingRef.value = !1, p(O), w ?? (w = e.fs.hiddenBreadcrumbs.length - 1);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Qn, {
        items: {
          from: y,
          to: e.fs.hiddenBreadcrumbs[w] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, _ = (O, w = null) => {
      O.preventDefault(), o.isDraggingRef.value = !1, p(O), w ?? (w = e.fs.breadcrumbs.length - 2);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Qn, {
        items: {
          from: y,
          to: e.fs.breadcrumbs[w] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, v = (O) => {
      O.preventDefault(), e.fs.isGoUpAvailable() ? (O.dataTransfer.dropEffect = "copy", O.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (O.dataTransfer.dropEffect = "none", O.dataTransfer.effectAllowed = "none");
    }, p = (O) => {
      O.preventDefault(), O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, m = () => {
      F(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, h = () => {
      F(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, x = (O) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: O.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, $ = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, M = {
      mounted(O, w, y, L) {
        O.clickOutsideEvent = function(k) {
          O === k.target || O.contains(k.target) || w.value();
        }, document.body.addEventListener("click", O.clickOutsideEvent);
      },
      beforeUnmount(O, w, y, L) {
        document.body.removeEventListener("click", O.clickOutsideEvent);
      }
    }, I = () => {
      e.showTreeView = !e.showTreeView;
    };
    Ve(() => e.showTreeView, (O, w) => {
      O !== w && s("show-tree-view", O);
    });
    const D = A(null), C = () => {
      e.features.includes(ue.SEARCH) && (e.fs.searchMode = !0, vt(() => D.value.focus()));
    }, V = Hs("", 400);
    Ve(V, (O) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: O });
    }), Ve(() => e.fs.searchMode, (O) => {
      O && vt(() => D.value.focus());
    });
    const F = () => {
      e.fs.searchMode = !1, V.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      F();
    });
    const j = () => {
      V.value === "" && F();
    };
    return (O, w) => (f(), g("div", Ed, [
      l("span", {
        title: r(n)("Toggle Tree View")
      }, [
        q(r(xd), {
          onClick: I,
          class: ae(["vuefinder__breadcrumb__toggle-tree", r(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, Td),
      l("span", {
        title: r(n)("Go up a directory")
      }, [
        q(r(ld), {
          onDragover: w[0] || (w[0] = (y) => v(y)),
          onDragleave: w[1] || (w[1] = (y) => p(y)),
          onDrop: w[2] || (w[2] = (y) => _(y)),
          onClick: h,
          class: ae(r(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, Md),
      r(e).fs.loading ? (f(), g("span", {
        key: 1,
        title: r(n)("Cancel")
      }, [
        q(r(cd), {
          onClick: w[3] || (w[3] = (y) => r(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Dd)) : (f(), g("span", {
        key: 0,
        title: r(n)("Refresh")
      }, [
        q(r(sd), { onClick: m })
      ], 8, Ad)),
      ve(l("div", {
        onClick: et(C, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        l("div", null, [
          q(r(vd), {
            onDragover: w[4] || (w[4] = (y) => v(y)),
            onDragleave: w[5] || (w[5] = (y) => p(y)),
            onDrop: w[6] || (w[6] = (y) => _(y, -1)),
            onClick: w[7] || (w[7] = (y) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r(e).fs.adapter } }))
          })
        ]),
        l("div", Vd, [
          r(e).fs.hiddenBreadcrumbs.length ? ve((f(), g("div", Ld, [
            w[13] || (w[13] = l("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("div", Od, [
              l("span", {
                onDragenter: w[8] || (w[8] = (y) => r(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: w[9] || (w[9] = (y) => r(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                q(r(Cd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [M, $]
          ]) : R("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: i,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: et(C, ["self"])
        }, [
          (f(!0), g(we, null, xe(r(e).fs.breadcrumbs, (y, L) => (f(), g("div", { key: L }, [
            w[14] || (w[14] = l("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("span", {
              onDragover: (k) => L === r(e).fs.breadcrumbs.length - 1 || v(k),
              onDragleave: (k) => L === r(e).fs.breadcrumbs.length - 1 || p(k),
              onDrop: (k) => L === r(e).fs.breadcrumbs.length - 1 || _(k, L),
              class: "vuefinder__breadcrumb__item",
              title: y.basename,
              onClick: (k) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r(e).fs.adapter, path: y.path } })
            }, b(y.name), 41, Fd)
          ]))), 128))
        ], 512),
        r(e).loadingIndicator === "circular" && r(e).fs.loading ? (f(), K(r(ms), { key: 0 })) : R("", !0)
      ], 512), [
        [ze, !r(e).fs.searchMode]
      ]),
      ve(l("div", Id, [
        l("div", null, [
          q(r(md))
        ]),
        ve(l("input", {
          ref_key: "searchInput",
          ref: D,
          onKeydown: $t(F, ["esc"]),
          onBlur: j,
          "onUpdate:modelValue": w[10] || (w[10] = (y) => cr(V) ? V.value = y : null),
          placeholder: r(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, Hd), [
          [Ct, r(V)]
        ]),
        q(r(gd), { onClick: F })
      ], 512), [
        [ze, r(e).fs.searchMode]
      ]),
      ve(l("div", Bd, [
        (f(!0), g(we, null, xe(r(e).fs.hiddenBreadcrumbs, (y, L) => (f(), g("div", {
          key: L,
          onDragover: w[11] || (w[11] = (k) => v(k)),
          onDragleave: w[12] || (w[12] = (k) => p(k)),
          onDrop: (k) => d(k, L),
          onClick: (k) => x(y),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          l("div", Ud, [
            l("span", null, [
              q(r(kn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            w[15] || (w[15] = Z()),
            l("span", Nd, b(y.name), 1)
          ])
        ], 40, Rd))), 128))
      ], 512), [
        [ze, r(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
}, Go = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), qd = ["onClick"], zd = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, o = A(n("full-screen", !1)), s = A([]), i = (a) => a === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (a) => {
      s.value.splice(a, 1);
    }, u = (a) => {
      let d = s.value.findIndex((_) => _.id === a);
      d !== -1 && c(d);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (a) => {
      let d = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      a.id = d, s.value.push(a), setTimeout(() => {
        u(d);
      }, 5e3);
    }), (a, d) => (f(), g("div", {
      class: ae(["vuefinder__toast", o.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      q(dr, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: J(() => [
          (f(!0), g(we, null, xe(s.value, (_, v) => (f(), g("div", {
            key: v,
            onClick: (p) => c(v),
            class: ae(["vuefinder__toast__message", i(_.type)])
          }, b(_.label), 11, qd))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, jd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function Gd(t, e) {
  return f(), g("svg", jd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const Wd = { render: Gd }, Kd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function Yd(t, e) {
  return f(), g("svg", Kd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const Xd = { render: Yd }, Jt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, n) => (f(), g("div", null, [
      t.direction === "asc" ? (f(), K(r(Wd), { key: 0 })) : R("", !0),
      t.direction === "desc" ? (f(), K(r(Xd), { key: 1 })) : R("", !0)
    ]));
  }
}, Zd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
};
function Qd(t, e) {
  return f(), g("svg", Zd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Jd = { render: Qd }, eu = { class: "vuefinder__item-icon" }, On = {
  __name: "ItemIcon",
  props: {
    type: {
      type: String,
      required: !0
    },
    small: {
      type: Boolean,
      default: !1
    }
  },
  setup(t) {
    return (e, n) => (f(), g("span", eu, [
      t.type === "dir" ? (f(), K(r(kn), {
        key: 0,
        class: ae(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"])) : (f(), K(r(Jd), {
        key: 1,
        class: ae(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"]))
    ]));
  }
}, tu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
};
function nu(t, e) {
  return f(), g("svg", tu, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const su = { render: nu }, ou = { class: "vuefinder__drag-item__container" }, ru = { class: "vuefinder__drag-item__count" }, lu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (n, o) => (f(), g("div", ou, [
      q(r(su)),
      l("div", ru, b(e.count), 1)
    ]));
  }
}, au = { class: "vuefinder__text-preview" }, iu = { class: "vuefinder__text-preview__header" }, cu = ["title"], du = { class: "vuefinder__text-preview__actions" }, uu = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, vu = { key: 1 }, fu = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = A(""), s = A(""), i = A(null), c = A(!1), u = A(""), a = A(!1), d = re("ServiceContainer"), { t: _ } = d.i18n;
    Ce(() => {
      d.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: d.modal.data.adapter, path: d.modal.data.item.path },
        responseType: "text"
      }).then((m) => {
        o.value = m, n("success");
      });
    });
    const v = () => {
      c.value = !c.value, s.value = o.value;
    }, p = () => {
      u.value = "", a.value = !1, d.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: d.modal.data.adapter,
          path: d.modal.data.item.path
        },
        body: {
          content: s.value
        },
        responseType: "text"
      }).then((m) => {
        u.value = _("Updated."), o.value = m, n("success"), c.value = !c.value;
      }).catch((m) => {
        u.value = _(m.message), a.value = !0;
      });
    };
    return (m, h) => (f(), g("div", au, [
      l("div", iu, [
        l("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: r(d).modal.data.item.path
        }, b(r(d).modal.data.item.basename), 9, cu),
        l("div", du, [
          c.value ? (f(), g("button", {
            key: 0,
            onClick: p,
            class: "vuefinder__text-preview__save-button"
          }, b(r(_)("Save")), 1)) : R("", !0),
          r(d).features.includes(r(ue).EDIT) ? (f(), g("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: h[0] || (h[0] = (x) => v())
          }, b(c.value ? r(_)("Cancel") : r(_)("Edit")), 1)) : R("", !0)
        ])
      ]),
      l("div", null, [
        c.value ? (f(), g("div", vu, [
          ve(l("textarea", {
            ref_key: "editInput",
            ref: i,
            "onUpdate:modelValue": h[1] || (h[1] = (x) => s.value = x),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [Ct, s.value]
          ])
        ])) : (f(), g("pre", uu, b(o.value), 1)),
        u.value.length ? (f(), K(Xe, {
          key: 2,
          onHidden: h[2] || (h[2] = (x) => u.value = ""),
          error: a.value
        }, {
          default: J(() => [
            Z(b(u.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : R("", !0)
      ])
    ]));
  }
}, _u = { class: "vuefinder__image-preview" }, mu = { class: "vuefinder__image-preview__header" }, pu = ["title"], hu = { class: "vuefinder__image-preview__actions" }, gu = { class: "vuefinder__image-preview__image-container" }, bu = ["src"], wu = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = re("ServiceContainer"), { t: s } = o.i18n, i = A(null), c = A(null), u = A(!1), a = A(""), d = A(!1), _ = () => {
      u.value = !u.value, u.value ? c.value = new wr(i.value, {
        crop(p) {
        }
      }) : c.value.destroy();
    }, v = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          a.value = "", d.value = !1;
          const m = new FormData();
          m.set("file", p), o.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: o.modal.data.adapter,
              path: o.modal.data.item.path
            },
            body: m
          }).then((h) => {
            a.value = s("Updated."), i.value.src = o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item), _(), n("success");
          }).catch((h) => {
            a.value = s(h.message), d.value = !0;
          });
        }
      );
    };
    return Ce(() => {
      n("success");
    }), (p, m) => (f(), g("div", _u, [
      l("div", mu, [
        l("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: r(o).modal.data.item.path
        }, b(r(o).modal.data.item.basename), 9, pu),
        l("div", hu, [
          u.value ? (f(), g("button", {
            key: 0,
            onClick: v,
            class: "vuefinder__image-preview__crop-button"
          }, b(r(s)("Crop")), 1)) : R("", !0),
          r(o).features.includes(r(ue).EDIT) ? (f(), g("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: m[0] || (m[0] = (h) => _())
          }, b(u.value ? r(s)("Cancel") : r(s)("Edit")), 1)) : R("", !0)
        ])
      ]),
      l("div", gu, [
        l("img", {
          ref_key: "image",
          ref: i,
          class: "vuefinder__image-preview__image",
          src: r(o).requester.getPreviewUrl(r(o).modal.data.adapter, r(o).modal.data.item),
          alt: ""
        }, null, 8, bu)
      ]),
      a.value.length ? (f(), K(Xe, {
        key: 0,
        onHidden: m[1] || (m[1] = (h) => a.value = ""),
        error: d.value
      }, {
        default: J(() => [
          Z(b(a.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : R("", !0)
    ]));
  }
}, yu = { class: "vuefinder__default-preview" }, ku = { class: "vuefinder__default-preview__header" }, xu = ["title"], Su = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e;
    return Ce(() => {
      o("success");
    }), (s, i) => (f(), g("div", yu, [
      l("div", ku, [
        l("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: r(n).modal.data.item.path
        }, b(r(n).modal.data.item.basename), 9, xu)
      ]),
      i[0] || (i[0] = l("div", null, null, -1))
    ]));
  }
}, $u = { class: "vuefinder__video-preview" }, Cu = ["title"], Eu = {
  class: "vuefinder__video-preview__video",
  preload: "",
  controls: ""
}, Tu = ["src"], Mu = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Ce(() => {
      o("success");
    }), (i, c) => (f(), g("div", $u, [
      l("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: r(n).modal.data.item.path
      }, b(r(n).modal.data.item.basename), 9, Cu),
      l("div", null, [
        l("video", Eu, [
          l("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, Tu),
          c[0] || (c[0] = Z(" Your browser does not support the video tag. "))
        ])
      ])
    ]));
  }
}, Au = { class: "vuefinder__audio-preview" }, Du = ["title"], Vu = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, Lu = ["src"], Ou = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = re("ServiceContainer"), s = () => o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item);
    return Ce(() => {
      n("success");
    }), (i, c) => (f(), g("div", Au, [
      l("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: r(o).modal.data.item.path
      }, b(r(o).modal.data.item.basename), 9, Du),
      l("div", null, [
        l("audio", Vu, [
          l("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, Lu),
          c[0] || (c[0] = Z(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, Fu = { class: "vuefinder__pdf-preview" }, Iu = ["title"], Hu = ["data"], Bu = ["src"], Ru = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Ce(() => {
      o("success");
    }), (i, c) => (f(), g("div", Fu, [
      l("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: r(n).modal.data.item.path
      }, b(r(n).modal.data.item.basename), 9, Iu),
      l("div", null, [
        l("object", {
          class: "vuefinder__pdf-preview__object",
          data: s(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          l("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: s(),
            width: "100%",
            height: "100%"
          }, " Your browser does not support PDFs ", 8, Bu)
        ], 8, Hu)
      ])
    ]));
  }
}, Uu = { class: "vuefinder__preview-modal__content" }, Nu = { key: 0 }, Pu = { class: "vuefinder__preview-modal__loading" }, qu = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, zu = { class: "vuefinder__preview-modal__details" }, ju = { class: "font-bold" }, Gu = { class: "font-bold pl-2" }, Wu = {
  key: 0,
  class: "vuefinder__preview-modal__note"
}, Ku = ["download", "href"], Wo = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = A(!1), s = (c) => (e.modal.data.item.mime_type ?? "").startsWith(c), i = e.features.includes(ue.PREVIEW);
    return i || (o.value = !0), (c, u) => (f(), K(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: u[6] || (u[6] = (a) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(r(n)("Close")), 1),
        r(e).features.includes(r(ue).DOWNLOAD) ? (f(), g("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: r(e).requester.getDownloadUrl(r(e).modal.data.adapter, r(e).modal.data.item),
          href: r(e).requester.getDownloadUrl(r(e).modal.data.adapter, r(e).modal.data.item)
        }, b(r(n)("Download")), 9, Ku)) : R("", !0)
      ]),
      default: J(() => [
        l("div", null, [
          l("div", Uu, [
            r(i) ? (f(), g("div", Nu, [
              s("text") ? (f(), K(fu, {
                key: 0,
                onSuccess: u[0] || (u[0] = (a) => o.value = !0)
              })) : s("image") ? (f(), K(wu, {
                key: 1,
                onSuccess: u[1] || (u[1] = (a) => o.value = !0)
              })) : s("video") ? (f(), K(Mu, {
                key: 2,
                onSuccess: u[2] || (u[2] = (a) => o.value = !0)
              })) : s("audio") ? (f(), K(Ou, {
                key: 3,
                onSuccess: u[3] || (u[3] = (a) => o.value = !0)
              })) : s("application/pdf") ? (f(), K(Ru, {
                key: 4,
                onSuccess: u[4] || (u[4] = (a) => o.value = !0)
              })) : (f(), K(Su, {
                key: 5,
                onSuccess: u[5] || (u[5] = (a) => o.value = !0)
              }))
            ])) : R("", !0),
            l("div", Pu, [
              o.value === !1 ? (f(), g("div", qu, [
                u[7] || (u[7] = l("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  l("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  l("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                l("span", null, b(r(n)("Loading")), 1)
              ])) : R("", !0)
            ])
          ])
        ]),
        l("div", zu, [
          l("div", null, [
            l("span", ju, b(r(n)("File Size")) + ": ", 1),
            Z(b(r(e).filesize(r(e).modal.data.item.file_size)), 1)
          ]),
          l("div", null, [
            l("span", Gu, b(r(n)("Last Modified")) + ": ", 1),
            Z(" " + b(r(Go)(r(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        r(e).features.includes(r(ue).DOWNLOAD) ? (f(), g("div", Wu, [
          l("span", null, b(r(n)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
        ])) : R("", !0)
      ]),
      _: 1
    }));
  }
}, Yu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Xu(t, e) {
  return f(), g("svg", Yu, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const Ko = { render: Xu }, Zu = ["data-type", "data-item", "data-index"], Fn = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = e.dragSelect, o = t, s = (m) => {
      m.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: m.path } })) : e.modal.open(Wo, { adapter: e.fs.adapter, item: m });
    }, i = {
      mounted(m, h, x, $) {
        x.props.draggable && (m.addEventListener("dragstart", (M) => c(M, h.value)), m.addEventListener("dragover", (M) => a(M, h.value)), m.addEventListener("drop", (M) => u(M, h.value)));
      },
      beforeUnmount(m, h, x, $) {
        x.props.draggable && (m.removeEventListener("dragstart", c), m.removeEventListener("dragover", a), m.removeEventListener("drop", u));
      }
    }, c = (m, h) => {
      if (m.altKey || m.ctrlKey || m.metaKey)
        return m.preventDefault(), !1;
      n.isDraggingRef.value = !0, m.dataTransfer.setDragImage(o.dragImage.$el, 0, 15), m.dataTransfer.effectAllowed = "all", m.dataTransfer.dropEffect = "copy", m.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, u = (m, h) => {
      m.preventDefault(), n.isDraggingRef.value = !1;
      let x = JSON.parse(m.dataTransfer.getData("items"));
      if (x.find(($) => $.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Qn, { items: { from: x, to: h } });
    }, a = (m, h) => {
      m.preventDefault(), !h || h.type !== "dir" || n.getSelection().find((x) => x === m.currentTarget) ? (m.dataTransfer.dropEffect = "none", m.dataTransfer.effectAllowed = "none") : m.dataTransfer.dropEffect = "copy";
    };
    let d = null, _ = !1;
    const v = () => {
      d && clearTimeout(d);
    }, p = (m) => {
      if (!_)
        _ = !0, setTimeout(() => _ = !1, 300);
      else
        return _ = !1, s(o.item), clearTimeout(d), !1;
      d = setTimeout(() => {
        const h = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: m.target.getBoundingClientRect().x,
          clientY: m.target.getBoundingClientRect().y
        });
        m.target.dispatchEvent(h);
      }, 500);
    };
    return (m, h) => ve((f(), g("div", {
      style: vn({ opacity: r(n).isDraggingRef.value && r(n).getSelection().find((x) => m.$el === x) ? "0.5 !important" : "" }),
      class: ae(["vuefinder__item", "vf-item-" + r(n).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: h[0] || (h[0] = (x) => s(t.item)),
      onTouchstart: h[1] || (h[1] = (x) => p(x)),
      onTouchend: h[2] || (h[2] = (x) => v()),
      onContextmenu: h[3] || (h[3] = et((x) => r(e).emitter.emit("vf-contextmenu-show", { event: x, items: r(n).getSelected(), target: t.item }), ["prevent"]))
    }, [
      Lt(m.$slots, "default"),
      r(e).pinnedFolders.find((x) => x.path === t.item.path) ? (f(), K(r(Ko), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : R("", !0)
    ], 46, Zu)), [
      [i, t.item]
    ]);
  }
}, Qu = { class: "vuefinder__explorer__container" }, Ju = {
  key: 0,
  class: "vuefinder__explorer__header"
}, ev = { class: "vuefinder__explorer__drag-item" }, tv = {
  key: 0,
  class: "vuefinder__linear-loader absolute"
}, nv = { class: "vuefinder__explorer__item-list-content" }, sv = { class: "vuefinder__explorer__item-list-name" }, ov = { class: "vuefinder__explorer__item-name" }, rv = { class: "vuefinder__explorer__item-path" }, lv = { class: "vuefinder__explorer__item-list-content" }, av = { class: "vuefinder__explorer__item-list-name" }, iv = { class: "vuefinder__explorer__item-name" }, cv = { class: "vuefinder__explorer__item-size" }, dv = { class: "vuefinder__explorer__item-date" }, uv = { class: "vuefinder__explorer__item-grid-content" }, vv = ["data-src", "alt"], fv = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, _v = { class: "vuefinder__explorer__item-title break-all" }, mv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = (v) => v == null ? void 0 : v.substring(0, 3), s = A(null), i = A(""), c = e.dragSelect;
    let u;
    e.emitter.on("vf-fullscreen-toggle", () => {
      c.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: v }) => {
      i.value = v, v ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: v
        },
        onSuccess: (p) => {
          p.files.length || e.emitter.emit("vf-toast-push", { label: n("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    });
    const a = St({ active: !1, column: "", order: "" }), d = (v = !0) => {
      let p = [...e.fs.data.files], m = a.column, h = a.order === "asc" ? 1 : -1;
      if (!v)
        return p;
      const x = ($, M) => typeof $ == "string" && typeof M == "string" ? $.toLowerCase().localeCompare(M.toLowerCase()) : $ < M ? -1 : $ > M ? 1 : 0;
      return a.active && (p = p.slice().sort(($, M) => x($[m], M[m]) * h)), p;
    }, _ = (v) => {
      a.active && a.column === v ? (a.active = a.order === "asc", a.column = v, a.order = "desc") : (a.active = !0, a.column = v, a.order = "asc");
    };
    return Ce(() => {
      u = new br(c.area.value);
    }), Rs(() => {
      u.update();
    }), Ns(() => {
      u.destroy();
    }), (v, p) => (f(), g("div", Qu, [
      r(e).view === "list" || i.value.length ? (f(), g("div", Ju, [
        l("div", {
          onClick: p[0] || (p[0] = (m) => _("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          Z(b(r(n)("Name")) + " ", 1),
          ve(q(Jt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "basename"]
          ])
        ]),
        i.value.length ? R("", !0) : (f(), g("div", {
          key: 0,
          onClick: p[1] || (p[1] = (m) => _("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          Z(b(r(n)("Size")) + " ", 1),
          ve(q(Jt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "file_size"]
          ])
        ])),
        i.value.length ? R("", !0) : (f(), g("div", {
          key: 1,
          onClick: p[2] || (p[2] = (m) => _("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          Z(b(r(n)("Date")) + " ", 1),
          ve(q(Jt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "last_modified"]
          ])
        ])),
        i.value.length ? (f(), g("div", {
          key: 2,
          onClick: p[3] || (p[3] = (m) => _("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          Z(b(r(n)("Filepath")) + " ", 1),
          ve(q(Jt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "path"]
          ])
        ])) : R("", !0)
      ])) : R("", !0),
      l("div", ev, [
        q(lu, {
          ref_key: "dragImage",
          ref: s,
          count: r(c).getCount()
        }, null, 8, ["count"])
      ]),
      l("div", {
        ref: r(c).scrollBarContainer,
        class: ae(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [{ "grid-view": r(e).view === "grid" }, { "search-active": i.value.length }]])
      }, [
        l("div", {
          ref: r(c).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      l("div", {
        ref: r(c).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area min-h-32",
        onContextmenu: p[4] || (p[4] = et((m) => r(e).emitter.emit("vf-contextmenu-show", { event: m, items: r(c).getSelected() }), ["self", "prevent"]))
      }, [
        r(e).loadingIndicator === "linear" && r(e).fs.loading ? (f(), g("div", tv)) : R("", !0),
        i.value.length ? (f(!0), g(we, { key: 1 }, xe(d(), (m, h) => (f(), K(Fn, {
          item: m,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: J(() => [
            l("div", nv, [
              l("div", sv, [
                q(On, {
                  type: m.type,
                  small: r(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", ov, b(m.basename), 1)
              ]),
              l("div", rv, b(m.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : R("", !0),
        r(e).view === "list" && !i.value.length ? (f(!0), g(we, { key: 2 }, xe(d(), (m, h) => (f(), K(Fn, {
          item: m,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: m.path
        }, {
          default: J(() => [
            l("div", lv, [
              l("div", av, [
                q(On, {
                  type: m.type,
                  small: r(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", iv, b(m.basename), 1)
              ]),
              l("div", cv, b(m.file_size ? r(e).filesize(m.file_size) : ""), 1),
              l("div", dv, b(r(Go)(m.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : R("", !0),
        r(e).view === "grid" && !i.value.length ? (f(!0), g(we, { key: 3 }, xe(d(!1), (m, h) => (f(), K(Fn, {
          item: m,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: J(() => [
            l("div", null, [
              l("div", uv, [
                (m.mime_type ?? "").startsWith("image") && r(e).showThumbnails ? (f(), g("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": r(e).requester.getPreviewUrl(r(e).fs.adapter, m),
                  alt: m.basename,
                  key: m.path
                }, null, 8, vv)) : (f(), K(On, {
                  key: 1,
                  type: m.type
                }, null, 8, ["type"])),
                !((m.mime_type ?? "").startsWith("image") && r(e).showThumbnails) && m.type !== "dir" ? (f(), g("div", fv, b(o(m.extension)), 1)) : R("", !0)
              ]),
              l("span", _v, b(r(Zn)(m.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : R("", !0)
      ], 544),
      q(zd)
    ]));
  }
}, pv = ["href", "download"], hv = ["onClick"], gv = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), n = A(null), o = A([]), s = A(""), i = St({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    });
    e.emitter.on("vf-context-selected", (d) => {
      o.value = d;
    });
    const c = (d) => d.link(e, o), u = (d) => {
      e.emitter.emit("vf-contextmenu-hide"), d.action(e, o);
    };
    e.emitter.on("vf-search-query", ({ newQuery: d }) => {
      s.value = d;
    }), e.emitter.on("vf-contextmenu-show", ({ event: d, items: _, target: v = null }) => {
      if (i.items = e.contextMenuItems.filter((p) => p.show(e, {
        searchQuery: s.value,
        items: _,
        target: v
      })), s.value)
        if (v)
          e.emitter.emit("vf-context-selected", [v]);
        else
          return;
      else !v && !s.value ? e.emitter.emit("vf-context-selected", []) : _.length > 1 && _.some((p) => p.path === v.path) ? e.emitter.emit("vf-context-selected", _) : e.emitter.emit("vf-context-selected", [v]);
      a(d);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      i.active = !1;
    });
    const a = (d) => {
      const _ = e.dragSelect.area.value, v = e.root.getBoundingClientRect(), p = _.getBoundingClientRect();
      let m = d.clientX - v.left, h = d.clientY - v.top;
      i.active = !0, vt(() => {
        var I;
        const x = (I = n.value) == null ? void 0 : I.getBoundingClientRect();
        let $ = (x == null ? void 0 : x.height) ?? 0, M = (x == null ? void 0 : x.width) ?? 0;
        m = p.right - d.pageX + window.scrollX < M ? m - M : m, h = p.bottom - d.pageY + window.scrollY < $ ? h - $ : h, i.positions = {
          left: m + "px",
          top: h + "px"
        };
      });
    };
    return (d, _) => ve((f(), g("ul", {
      ref_key: "contextmenu",
      ref: n,
      style: vn(i.positions),
      class: "vuefinder__context-menu"
    }, [
      (f(!0), g(we, null, xe(i.items, (v) => (f(), g("li", {
        class: "vuefinder__context-menu__item",
        key: v.title
      }, [
        v.link ? (f(), g("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: c(v),
          download: c(v),
          onClick: _[0] || (_[0] = (p) => r(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          l("span", null, b(v.title(r(e).i18n)), 1)
        ], 8, pv)) : (f(), g("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (p) => u(v)
        }, [
          l("span", null, b(v.title(r(e).i18n)), 1)
        ], 8, hv))
      ]))), 128))
    ], 4)), [
      [ze, i.active]
    ]);
  }
}, bv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function wv(t, e) {
  return f(), g("svg", bv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const Yo = { render: wv }, yv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function kv(t, e) {
  return f(), g("svg", yv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const xv = { render: kv }, Sv = { class: "vuefinder__status-bar__wrapper" }, $v = { class: "vuefinder__status-bar__storage" }, Cv = ["title"], Ev = { class: "vuefinder__status-bar__storage-icon" }, Tv = ["value"], Mv = { class: "vuefinder__status-bar__info" }, Av = { key: 0 }, Dv = { class: "vuefinder__status-bar__selected-count" }, Vv = { class: "vuefinder__status-bar__actions" }, Lv = ["disabled"], Ov = ["title"], Fv = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: o } = e.storage, s = e.dragSelect, i = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), o("adapter", e.fs.adapter);
    }, c = A("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      c.value = a;
    });
    const u = wt(() => {
      const a = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && a;
    });
    return (a, d) => (f(), g("div", Sv, [
      l("div", $v, [
        l("div", {
          class: "vuefinder__status-bar__storage-container",
          title: r(n)("Storage")
        }, [
          l("div", Ev, [
            q(r(Yo))
          ]),
          ve(l("select", {
            "onUpdate:modelValue": d[0] || (d[0] = (_) => r(e).fs.adapter = _),
            onChange: i,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (f(!0), g(we, null, xe(r(e).fs.data.storages, (_) => (f(), g("option", { value: _ }, b(_), 9, Tv))), 256))
          ], 544), [
            [In, r(e).fs.adapter]
          ])
        ], 8, Cv),
        l("div", Mv, [
          c.value.length ? (f(), g("span", Av, b(r(e).fs.data.files.length) + " items found. ", 1)) : R("", !0),
          l("span", Dv, b(r(e).dragSelect.getCount() > 0 ? r(n)("%s item(s) selected.", r(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", Vv, [
        r(e).selectButton.active ? (f(), g("button", {
          key: 0,
          class: ae(["vf-btn py-0 vf-btn-primary", { disabled: !u.value }]),
          disabled: !u.value,
          onClick: d[1] || (d[1] = (_) => r(e).selectButton.click(r(s).getSelected(), _))
        }, b(r(n)("Select")), 11, Lv)) : R("", !0),
        l("span", {
          class: "vuefinder__status-bar__about",
          title: r(n)("About"),
          onClick: d[2] || (d[2] = (_) => r(e).modal.open(Fo))
        }, [
          q(r(xv))
        ], 8, Ov)
      ])
    ]));
  }
}, Iv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function Hv(t, e) {
  return f(), g("svg", Iv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const Xo = { render: Hv }, Bv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Rv(t, e) {
  return f(), g("svg", Bv, e[0] || (e[0] = [
    l("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const Uv = { render: Rv }, Nv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Pv(t, e) {
  return f(), g("svg", Nv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const Zo = { render: Pv }, qv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function zv(t, e) {
  return f(), g("svg", qv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const Qo = { render: zv };
function Jo(t, e) {
  const n = t.findIndex((o) => o.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const jv = { class: "vuefinder__folder-loader-indicator" }, Gv = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, er = {
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ ur({
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const e = t, n = re("ServiceContainer"), { t: o } = n.i18n, s = Ps(t, "modelValue"), i = A(!1);
    Ve(
      () => s.value,
      () => {
        var a;
        return ((a = c()) == null ? void 0 : a.folders.length) || u();
      }
    );
    function c() {
      return n.treeViewData.find((a) => a.path === e.path);
    }
    const u = () => {
      i.value = !0, n.requester.send({
        url: "",
        method: "get",
        params: {
          q: "subfolders",
          adapter: e.adapter,
          path: e.path
        }
      }).then((a) => {
        Jo(n.treeViewData, { path: e.path, ...a });
      }).catch((a) => {
      }).finally(() => {
        i.value = !1;
      });
    };
    return (a, d) => {
      var _;
      return f(), g("div", jv, [
        i.value ? (f(), K(r(ms), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (f(), g("div", Gv, [
          s.value && ((_ = c()) != null && _.folders.length) ? (f(), K(r(Qo), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : R("", !0),
          s.value ? R("", !0) : (f(), K(r(Zo), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, Wv = { class: "vuefinder__treesubfolderlist__item-content" }, Kv = ["onClick"], Yv = ["title", "onClick"], Xv = { class: "vuefinder__treesubfolderlist__item-icon" }, Zv = { class: "vuefinder__treesubfolderlist__subfolder" }, Qv = {
  __name: "TreeSubfolderList",
  props: {
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = A([]), o = t, s = A(null);
    Ce(() => {
      o.path === o.adapter + "://" && Ne(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const i = wt(() => {
      var c;
      return ((c = e.treeViewData.find((u) => u.path === o.path)) == null ? void 0 : c.folders) || [];
    });
    return (c, u) => {
      const a = vr("TreeSubfolderList", !0);
      return f(), g("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (f(!0), g(we, null, xe(i.value, (d, _) => (f(), g("li", {
          key: d.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          l("div", Wv, [
            l("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (v) => n.value[d.path] = !n.value[d.path]
            }, [
              q(er, {
                adapter: t.adapter,
                path: d.path,
                modelValue: n.value[d.path],
                "onUpdate:modelValue": (v) => n.value[d.path] = v
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, Kv),
            l("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: d.path,
              onClick: (v) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o.adapter, path: d.path } })
            }, [
              l("div", Xv, [
                r(e).fs.path === d.path ? (f(), K(r(Xo), { key: 0 })) : (f(), K(r(kn), { key: 1 }))
              ]),
              l("div", {
                class: ae(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": r(e).fs.path === d.path
                }])
              }, b(d.basename), 3)
            ], 8, Yv)
          ]),
          l("div", Zv, [
            ve(q(a, {
              adapter: o.adapter,
              path: d.path
            }, null, 8, ["adapter", "path"]), [
              [ze, n.value[d.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, Jv = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, o = A(!1);
    function s(i) {
      i === e.fs.adapter ? o.value = !o.value : (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: i } }), n("adapter", i));
    }
    return (i, c) => (f(), g(we, null, [
      l("div", {
        onClick: c[2] || (c[2] = (u) => s(t.storage)),
        class: "vuefinder__treestorageitem__header"
      }, [
        l("div", {
          class: ae(["vuefinder__treestorageitem__info", t.storage === r(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          l("div", {
            class: ae(["vuefinder__treestorageitem__icon", t.storage === r(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            q(r(Yo))
          ], 2),
          l("div", null, b(t.storage), 1)
        ], 2),
        l("div", {
          class: "vuefinder__treestorageitem__loader",
          onClick: c[1] || (c[1] = et((u) => o.value = !o.value, ["stop"]))
        }, [
          q(er, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: o.value,
            "onUpdate:modelValue": c[0] || (c[0] = (u) => o.value = u)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      ve(q(Qv, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [ze, o.value]
      ])
    ], 64));
  }
}, ef = { class: "vuefinder__folder-indicator" }, tf = { class: "vuefinder__folder-indicator--icon" }, nf = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Ps(t, "modelValue");
    return (n, o) => (f(), g("div", ef, [
      l("div", tf, [
        e.value ? (f(), K(r(Qo), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : R("", !0),
        e.value ? R("", !0) : (f(), K(r(Zo), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, sf = { class: "vuefinder__treeview__header" }, of = { class: "vuefinder__treeview__pinned-label" }, rf = { class: "vuefinder__treeview__pin-text text-nowrap" }, lf = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, af = { class: "vuefinder__treeview__pinned-item" }, cf = ["onClick"], df = ["title"], uf = ["onClick"], vf = { key: 0 }, ff = { class: "vuefinder__treeview__no-pinned" }, _f = { class: "vuefinder__treeview__storage" }, mf = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: o, setStore: s } = e.storage, i = A(190), c = A(o("pinned-folders-opened", !0));
    Ve(c, (_) => s("pinned-folders-opened", _));
    const u = (_) => {
      e.pinnedFolders = e.pinnedFolders.filter((v) => v.path !== _.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, a = (_) => {
      const v = _.clientX, p = _.target.parentElement, m = p.getBoundingClientRect().width;
      p.classList.remove("transition-[width]"), p.classList.add("transition-none");
      const h = ($) => {
        i.value = m + $.clientX - v, i.value < 50 && (i.value = 0, e.showTreeView = !1), i.value > 50 && (e.showTreeView = !0);
      }, x = () => {
        const $ = p.getBoundingClientRect();
        i.value = $.width, p.classList.add("transition-[width]"), p.classList.remove("transition-none"), window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", x);
      };
      window.addEventListener("mousemove", h), window.addEventListener("mouseup", x);
    }, d = A(null);
    return Ce(() => {
      Ne(d.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    }), Ve(e.fs.data, (_, v) => {
      const p = _.files.filter((m) => m.type === "dir");
      Jo(e.treeViewData, { path: e.fs.path, folders: p.map((m) => ({
        adapter: m.storage,
        path: m.path,
        basename: m.basename
      })) });
    }), (_, v) => (f(), g(we, null, [
      l("div", {
        onClick: v[0] || (v[0] = (p) => r(e).showTreeView = !r(e).showTreeView),
        class: ae(["vuefinder__treeview__overlay", r(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      l("div", {
        style: vn(r(e).showTreeView ? "min-width:100px;max-width:75%; width: " + i.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        l("div", {
          ref_key: "treeViewScrollElement",
          ref: d,
          class: "vuefinder__treeview__scroll"
        }, [
          l("div", sf, [
            l("div", {
              onClick: v[2] || (v[2] = (p) => c.value = !c.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              l("div", of, [
                q(r(Ko), { class: "vuefinder__treeview__pin-icon" }),
                l("div", rf, b(r(n)("Pinned Folders")), 1)
              ]),
              q(nf, {
                modelValue: c.value,
                "onUpdate:modelValue": v[1] || (v[1] = (p) => c.value = p)
              }, null, 8, ["modelValue"])
            ]),
            c.value ? (f(), g("ul", lf, [
              (f(!0), g(we, null, xe(r(e).pinnedFolders, (p) => (f(), g("li", af, [
                l("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (m) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: p.storage, path: p.path } })
                }, [
                  r(e).fs.path !== p.path ? (f(), K(r(kn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : R("", !0),
                  r(e).fs.path === p.path ? (f(), K(r(Xo), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : R("", !0),
                  l("div", {
                    title: p.path,
                    class: ae(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": r(e).fs.path === p.path
                    }])
                  }, b(p.basename), 11, df)
                ], 8, cf),
                l("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (m) => u(p)
                }, [
                  q(r(Uv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, uf)
              ]))), 256)),
              r(e).pinnedFolders.length ? R("", !0) : (f(), g("li", vf, [
                l("div", ff, b(r(n)("No folders pinned")), 1)
              ]))
            ])) : R("", !0)
          ]),
          (f(!0), g(we, null, xe(r(e).fs.data.storages, (p) => (f(), g("div", _f, [
            q(Jv, { storage: p }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        l("div", {
          onMousedown: a,
          class: ae([(r(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
};
class pf {
  /**
   * 
   * @param {Item['title']} title 
   * @param {Item['action']} action 
   * @param {Item['link']} link
   * @param {Partial<SimpleItemOptions>} options 
   */
  constructor(e, n, o, s) {
    this.title = e, this.action = n, this.link = o, this.options = Object.assign(
      {
        needsSearchQuery: !1,
        target: "one"
      },
      s
    );
  }
  /**
   * @type {Item['show']}
   */
  show(e, n) {
    var s, i;
    const o = (c) => c.items.length > 1 && c.items.some((u) => {
      var a;
      return u.path === ((a = c.target) == null ? void 0 : a.path);
    }) ? "many" : c.target ? "one" : null;
    return !(this.options.needsSearchQuery !== !!n.searchQuery || this.options.target !== void 0 && this.options.target !== o(n) || this.options.targetType !== void 0 && this.options.targetType !== ((s = n.target) == null ? void 0 : s.type) || this.options.mimeType !== void 0 && this.options.mimeType !== ((i = n.target) == null ? void 0 : i.mime_type) || this.options.feature !== void 0 && !e.features.includes(this.options.feature) || this.options.show !== void 0 && !this.options.show(e, n));
  }
}
function Be(t, e) {
  return t.map((n) => new pf(n.title, n.action, n.link, {
    ...e,
    feature: n.key
  }));
}
const Te = {
  newfolder: {
    key: ue.NEW_FOLDER,
    title: ({ t }) => t("New Folder"),
    action: (t) => t.modal.open(Ro)
  },
  selectAll: {
    title: ({ t }) => t("Select All"),
    action: (t) => t.dragSelect.selectAll()
  },
  pinFolder: {
    title: ({ t }) => t("Pin Folder"),
    action: (t, e) => {
      t.pinnedFolders = t.pinnedFolders.concat(e.value), t.storage.setStore("pinned-folders", t.pinnedFolders);
    }
  },
  unpinFolder: {
    title: ({ t }) => t("Unpin Folder"),
    action: (t, e) => {
      t.pinnedFolders = t.pinnedFolders.filter((n) => !e.value.find((o) => o.path === n.path)), t.storage.setStore("pinned-folders", t.pinnedFolders);
    }
  },
  delete: {
    key: ue.DELETE,
    title: ({ t }) => t("Delete"),
    action: (t, e) => {
      t.modal.open(fs, { items: e });
    }
  },
  refresh: {
    title: ({ t }) => t("Refresh"),
    action: (t) => {
      t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } });
    }
  },
  preview: {
    key: ue.PREVIEW,
    title: ({ t }) => t("Preview"),
    action: (t, e) => t.modal.open(Wo, { adapter: t.fs.adapter, item: e.value[0] })
  },
  open: {
    title: ({ t }) => t("Open"),
    action: (t, e) => {
      t.emitter.emit("vf-search-exit"), t.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: t.fs.adapter,
          path: e.value[0].path
        }
      });
    }
  },
  openDir: {
    title: ({ t }) => t("Open containing folder"),
    action: (t, e) => {
      t.emitter.emit("vf-search-exit"), t.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: t.fs.adapter,
          path: e.value[0].dir
        }
      });
    }
  },
  download: {
    key: ue.DOWNLOAD,
    link: (t, e) => t.requester.getDownloadUrl(t.fs.adapter, e.value[0]),
    title: ({ t }) => t("Download"),
    action: () => {
    }
  },
  archive: {
    key: ue.ARCHIVE,
    title: ({ t }) => t("Archive"),
    action: (t, e) => t.modal.open(jo, { items: e })
  },
  unarchive: {
    key: ue.UNARCHIVE,
    title: ({ t }) => t("Unarchive"),
    action: (t, e) => t.modal.open(qo, { items: e })
  },
  rename: {
    key: ue.RENAME,
    title: ({ t }) => t("Rename"),
    action: (t, e) => t.modal.open(_s, { items: e })
  }
}, hf = [
  ...Be([Te.openDir], {
    needsSearchQuery: !0
  }),
  ...Be([Te.refresh, Te.selectAll, Te.newfolder], {
    target: null
  }),
  ...Be([Te.refresh, Te.archive, Te.delete], {
    target: "many"
  }),
  ...Be([Te.open], {
    targetType: "dir"
  }),
  ...Be([Te.unpinFolder], {
    targetType: "dir",
    show: (t, e) => t.pinnedFolders.findIndex((n) => {
      var o;
      return n.path === ((o = e.target) == null ? void 0 : o.path);
    }) !== -1
  }),
  ...Be([Te.pinFolder], {
    targetType: "dir",
    show: (t, e) => t.pinnedFolders.findIndex((n) => {
      var o;
      return n.path === ((o = e.target) == null ? void 0 : o.path);
    }) === -1
  }),
  ...Be([Te.preview, Te.download], {
    show: (t, e) => {
      var n;
      return ((n = e.target) == null ? void 0 : n.type) !== "dir";
    }
  }),
  ...Be([Te.rename], { numItems: "one" }),
  ...Be([Te.unarchive], {
    mimeType: "application/zip"
  }),
  ...Be([Te.archive], {
    show: (t, e) => {
      var n;
      return ((n = e.target) == null ? void 0 : n.mime_type) !== "application/zip";
    }
  }),
  ...Be([Te.delete], {})
], gf = { class: "vuefinder__main__content" }, bf = {
  __name: "VueFinder",
  props: {
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: ""
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    showTreeView: {
      type: Boolean,
      default: !1
    },
    pinnedFolders: {
      type: Array,
      default: []
    },
    showThumbnails: {
      type: Boolean,
      default: !0
    },
    selectButton: {
      type: Object,
      default(t) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...t
        };
      }
    },
    // 文件夹 文件夹右键菜单
    /*
    * 输入示例
    * [{ label: "解压", show: (item) => true, handler: (items) => { } }]
    * */
    menu: {
      type: Array,
      default: []
    },
    onError: {
      type: Function,
      default: null
    },
    loadingIndicator: {
      type: String,
      default: "circular"
    },
    contextMenuItems: {
      type: Array,
      default: () => hf
    }
  },
  emits: ["select", "update:path"],
  setup(t, { emit: e }) {
    const n = e, o = t;
    console.log("props", o), o.menu.forEach((v) => {
      let p = Be([{
        key: v.label,
        title: ({ t: m }) => m(v.label) || v.label,
        action: v.handler
        // 按钮点击事件
      }]);
      v != null && v.show && (p[0].show = v == null ? void 0 : v.show), v != null && v.index ? o.contextMenuItems.splice(v.index + 9, 0, ...p) : o.contextMenuItems.push(
        ...p
      );
    });
    const s = Il(o, re("VueFinderOptions"));
    fr("ServiceContainer", s);
    const { setStore: i } = s.storage, c = A(null);
    s.root = c;
    const u = s.dragSelect;
    _i(s);
    const a = (v) => {
      Object.assign(s.fs.data, v), u.clearSelection(), u.refreshSelection();
    };
    let d;
    s.emitter.on("vf-fetch-abort", () => {
      d.abort(), s.fs.loading = !1;
    }), s.emitter.on("vf-fetch", ({ params: v, body: p = null, onSuccess: m = null, onError: h = null, noCloseModal: x = !1 }) => {
      ["index", "search"].includes(v.q) && (d && d.abort(), s.fs.loading = !0), d = new AbortController();
      const $ = d.signal;
      s.requester.send({
        url: "",
        method: v.m || "get",
        params: v,
        body: p,
        abortSignal: $
      }).then((M) => {
        s.fs.adapter = M.adapter, s.persist && (s.fs.path = M.dirname, i("path", s.fs.path)), x || s.modal.close(), a(M), m && m(M);
      }).catch((M) => {
        console.error(M), h && h(M);
      }).finally(() => {
        ["index", "search"].includes(v.q) && (s.fs.loading = !1);
      });
    });
    function _(v) {
      let p = {};
      v && v.includes("://") && (p = {
        adapter: v.split("://")[0],
        path: v
      }), s.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: s.fs.adapter, ...p },
        onError: o.onError ?? ((m) => {
          m.message && s.emitter.emit("vf-toast-push", { label: m.message, type: "error" });
        })
      });
    }
    return Ce(() => {
      _(s.fs.path), Ve(() => o.path, (v) => {
        _(v);
      }), u.onSelect((v) => {
        n("select", v);
      }), Ve(() => s.fs.data.dirname, (v) => {
        n("update:path", v);
      });
    }), (v, p) => (f(), g("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: c,
      tabindex: "0"
    }, [
      l("div", {
        class: ae(r(s).theme.actualValue)
      }, [
        l("div", {
          class: ae([r(s).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative", "vuefinder__main__container"]),
          style: vn(r(s).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: p[0] || (p[0] = (m) => r(s).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: p[1] || (p[1] = (m) => r(s).emitter.emit("vf-contextmenu-hide"))
        }, [
          q(Rc),
          q(Pd),
          l("div", gf, [
            q(mf),
            q(mv)
          ]),
          q(Fv)
        ], 38),
        q(_r, { name: "fade" }, {
          default: J(() => [
            r(s).modal.visible ? (f(), K(Us(r(s).modal.type), { key: 0 })) : R("", !0)
          ]),
          _: 1
        }),
        q(gv)
      ], 2)
    ], 512));
  }
}, Mf = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", bf);
  }
};
export {
  pf as SimpleContextMenuItem,
  hf as contextMenuItems,
  Mf as default
};
