import { defineComponent as V, ref as $, reactive as m, watch as I, h as i } from "vue";
function O(e) {
  return typeof e == "boolean";
}
function N(e) {
  return typeof e == "number";
}
function S(e) {
  return typeof e == "object" && e !== null;
}
function Y(e) {
  const v = m({}), d = {
    currOrder: 0,
    triggerTotal: 0,
    list: [],
    track(n) {
      this.list.push(n);
    },
    trigger(n, l) {
      if (this.triggerTotal++, this.list = this.list.map((g) => (g.name === n && (g.visible = l), g)), this.triggerTotal >= this.list.length)
        if (this.currOrder < this.list.length) {
          for (; this.currOrder < this.list.length && (v[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
            this.currOrder++;
          this.currOrder = 0;
        } else
          this.triggerTotal = 0, this.trigger(n, l);
    }
  };
  if (e) {
    d.list = [];
    for (let n in e) {
      let l = {
        name: n,
        order: Number(e[n])
      };
      d.track(l);
    }
    d.list.sort((n, l) => n.order - l.order);
  }
  return function(n, l) {
    return d.trigger(n, l), {
      currVisible: v,
      dep: d
    };
  };
}
const D = V({
  props: {
    visible: [Object, Boolean],
    name: String,
    mask: {
      type: Boolean,
      default: !0
    },
    maskClosable: {
      type: Boolean,
      default: !0
    },
    type: {
      type: String,
      default: ""
    },
    modalClass: {
      type: String,
      default: "modal-vue3-wrap"
    },
    width: {
      type: [String, Number],
      default: 500
    },
    offsetTop: {
      type: [String, Number],
      default: 100
    },
    zIndex: {
      type: [String, Number],
      default: 1e3
    },
    title: {
      type: String,
      default: "Title"
    },
    animation: {
      type: Boolean,
      default: !0
    },
    closable: {
      type: Boolean,
      default: !0
    },
    draggable: {
      type: [Boolean, Object],
      default: !1
    },
    cancelButton: {
      type: Object,
      default: () => ({
        text: "cancel",
        onclick: null,
        loading: !1
      })
    },
    okButton: {
      type: Object,
      default: () => ({
        text: "ok",
        onclick: null,
        loading: !1
      })
    }
  },
  setup(e, { slots: v, emit: d }) {
    let n;
    const l = e.name, g = typeof e.width == "string" ? e.width : `${e.width}px`, C = typeof e.offsetTop == "string" ? e.offsetTop : `${e.offsetTop}px`, T = $(null), p = $(null);
    let j = null, x = null, a = m({
      init: 0.5,
      value: 0.5,
      max: 1,
      step: 0.02,
      speed: 5,
      linear: !1
    }), b = m({
      init: 0,
      value: 0,
      max: 360,
      step: 30,
      speed: 30,
      linear: !0
    });
    const y = (t, s, u) => {
      let B = s ? t.max : t.init, c = s ? t.init : t.max;
      if (s ? t.value <= c : t.value >= c)
        return t.linear ? t.value = B : (t.value = c, u && u()), !1;
      setTimeout(() => {
        s ? t.value -= t.step : t.value += t.step;
      }, t.speed);
    }, k = (t) => {
      t && n.list.length > 0 && S(e.visible) ? n.trigger(t, !1) : d("update:visible", !1);
    }, M = (t) => {
      !e.maskClosable || !e.mask || t.target === T.value && k(l);
    };
    let o = m({
      value: !1,
      target: ""
    });
    const E = (t, s) => {
      const u = t[s];
      (!u.loading || u.loading && !o.value) && (u.onclick && typeof u.onclick == "function" ? u.onclick() : k(t.name), o.value = !0, o.target = s);
    }, r = $(), f = m({
      left: void 0,
      top: void 0
    }), w = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, z = (t) => {
      let s = p.value.offsetLeft, u = p.value.offsetTop, B = {
        width: p.value.offsetWidth,
        height: p.value.offsetHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        x: t.pageX - s,
        y: t.pageY - u
      };
      r.value = B, w(t);
      const c = (h) => {
        if (!r.value)
          return;
        let W = h.pageX, H = h.pageY;
        f.left = Math.min(Math.max(W - r.value.x, 0), r.value.clientWidth - r.value.width), f.top = Math.min(Math.max(H - r.value.y, 0), r.value.clientHeight - r.value.height), w(h);
      }, L = (h) => {
        !r.value || (r.value = void 0, w(h), document.removeEventListener("pointermove", c), document.removeEventListener("pointerup", L));
      };
      document.addEventListener("pointermove", c), document.addEventListener("pointerup", L);
    };
    return I(() => e.draggable, (t) => {
      S(t) && t.addEventListener("pointerdown", z);
    }), () => {
      if (v.default) {
        let t;
        return O(e.visible) ? t = e.visible : (t = e.visible.currVisible[l], n = e.visible.dep), t ? (o.value && y(b), e.animation === !1 ? a.value = a.max : (j != l && (j = l, a.value = a.init), a.speed = 5, y(a)), a.value >= a.max && !r.value && x != l && (x = l, d("onVisible"))) : (x == l || !l) && (t = !0, a.speed = 2, y(a, !0, () => {
          t = !1, x = null, o.value = !1, d("onUnVisible");
        })), t ? i("div", {
          class: e.modalClass
        }, [
          e.mask ? i("div", {
            class: "modal-vue3-mask",
            style: `width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25);z-index:${e.zIndex - 1};`
          }) : null,
          i("div", {
            ref: T,
            style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${e.zIndex};overflow:auto;outline:0;`,
            onclick: (s) => {
              M(s);
            }
          }, [
            i(
              "div",
              {
                ref: p,
                class: "modal-vue3-content",
                style: `width:${g};position:relative;top:${N(f.top) ? f.top + "px" : C};left:${f.left ? f.left + "px" : ""};margin: ${N(f.left) ? "0" : "0 auto"}; ${e.type != "clean" ? "border:1px solid #f0f0f0;" : ""}overflow:auto;outline:0;box-sizing:border-box; ${e.type != "clean" ? "background-color:#fff;" : ""}border-radius:2px;transform:scale(${a.value});`
              },
              [
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-header",
                  style: `padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${e.draggable && O(e.draggable) ? "cursor:move;" : ""}`,
                  onpointerdown: e.draggable && O(e.draggable) ? z : null
                }, [
                  i("div", null, e.title),
                  e.closable ? i("div", {
                    style: "width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",
                    onclick: () => {
                      k(l);
                    }
                  }, [
                    i("div", {
                      style: "width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(45deg);"
                    }, ""),
                    i("div", {
                      style: "width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(-45deg);"
                    }, "")
                  ]) : null
                ]) : null,
                i("div", {
                  class: "modal-vue3-body",
                  style: e.type != "clean" ? "padding: 14px 22px" : ""
                }, v.default()),
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-footer",
                  style: "padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"
                }, [
                  i("div", {
                    class: "modal-vue3-footer-cancel",
                    style: `margin-right: 20px;height:30px;padding:0 8px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;${o.value && o.target === "cancelButton" ? "opacity:.6;" : ""}`,
                    onclick: () => {
                      E(e, "cancelButton");
                    }
                  }, [
                    o.value && o.target === "cancelButton" ? i("span", {
                      style: `width: 10px;height:10px;margin-right:5px;border:1px solid #666;border-radius:50%;border-top:1px solid transparent; transform:rotate(${b.value}deg);`
                    }) : null,
                    i("div", {
                      style: "min-width:44px;text-align:center;"
                    }, e.cancelButton.text || "cancel")
                  ]),
                  i("div", {
                    class: "modal-vue3-footer-ok",
                    style: `height:30px;padding: 0 8px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;position:relative;${o.value && o.target === "okButton" ? "opacity:.6;" : ""}`,
                    onclick: () => {
                      E(e, "okButton");
                    }
                  }, [
                    o.value && o.target === "okButton" ? i("span", {
                      style: `width: 10px;height:10px;margin-right:5px;border:1px solid #fff;border-radius:50%;border-top:1px solid transparent; transform:rotate(${b.value}deg);`
                    }) : null,
                    i("div", {
                      style: "min-width:44px;text-align:center;"
                    }, e.okButton.text || "ok")
                  ])
                ]) : null
              ]
            )
          ])
        ]) : null;
      }
    };
  }
});
export {
  D as Modal,
  Y as useModal
};
