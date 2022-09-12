import { defineComponent as z, ref as k, reactive as h, watch as W, h as i } from "vue";
function V(e) {
  const f = h({}), s = {
    currOrder: 0,
    triggerTotal: 0,
    list: [],
    track(n) {
      this.list.push(n);
    },
    trigger(n, l) {
      if (this.triggerTotal++, this.list = this.list.map((g) => (g.name === n && (g.visible = l), g)), this.triggerTotal >= this.list.length)
        if (this.currOrder < this.list.length) {
          for (; this.currOrder < this.list.length && (f[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
            this.currOrder++;
          this.currOrder = 0;
        } else
          this.triggerTotal = 0, this.trigger(n, l);
    }
  };
  if (e) {
    s.list = [];
    for (let n in e) {
      let l = {
        name: n,
        order: Number(e[n])
      };
      s.track(l);
    }
    s.list.sort((n, l) => n.order - l.order);
  }
  return function(n, l) {
    return s.trigger(n, l), {
      currVisible: f,
      dep: s
    };
  };
}
const X = z({
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
  setup(e, { slots: f, emit: s }) {
    let n;
    const l = e.name, g = typeof e.width == "string" ? e.width : `${e.width}px`, L = typeof e.offsetTop == "string" ? e.offsetTop : `${e.offsetTop}px`, w = k(null), v = k(null);
    let B = null, m = null, r = h({
      init: 0.6,
      value: 0.6,
      max: 1,
      step: 0.02,
      speed: 6,
      linear: !1
    }), b = h({
      init: 0,
      value: 0,
      max: 360,
      step: 40,
      speed: 40,
      linear: !0
    });
    const $ = (t) => {
      if (t.value >= t.max)
        return t.linear ? t.value = t.init : t.value = t.max, !1;
      setTimeout(() => {
        t.value += t.step;
      }, t.speed);
    }, x = (t) => {
      t && n.list.length > 0 ? n.trigger(t, !1) : s("update:visible", !1);
    }, S = (t) => {
      !e.maskClosable || !e.mask || t.target === w.value && x(l);
    };
    let o = h({
      value: !1,
      target: ""
    });
    const O = (t, c) => {
      const u = t[c];
      (!u.loading || u.loading && !o.value) && (u.onclick && typeof u.onclick == "function" ? u.onclick() : x(t.name), o.value = !0, o.target = c);
    }, a = k(), d = h({
      left: void 0,
      top: void 0
    }), y = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, T = (t) => {
      let c = v.value.offsetLeft, u = v.value.offsetTop, C = {
        width: v.value.offsetWidth,
        height: v.value.offsetHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        x: t.pageX - c,
        y: t.pageY - u
      };
      a.value = C, y(t);
      const j = (p) => {
        if (!a.value)
          return;
        let M = p.pageX, N = p.pageY;
        d.left = Math.min(Math.max(M - a.value.x, 0), a.value.clientWidth - a.value.width), d.top = Math.min(Math.max(N - a.value.y, 0), a.value.clientHeight - a.value.height), y(p);
      }, E = (p) => {
        !a.value || (a.value = void 0, y(p), document.removeEventListener("pointermove", j), document.removeEventListener("pointerup", E));
      };
      document.addEventListener("pointermove", j), document.addEventListener("pointerup", E);
    };
    return W(() => e.draggable, (t) => {
      typeof t == "object" && t !== null && t.addEventListener("pointerdown", T);
    }), () => {
      if (f.default) {
        let t;
        return typeof e.visible == "boolean" ? t = e.visible : (t = e.visible.currVisible[l], n = e.visible.dep), t ? (o.value && $(b), e.animation === !1 ? r.value = r.max : (B != l && (B = l, r.value = r.init), $(r)), r.value >= r.max && !a.value && m != l && (m = l, s("onVisible"))) : (m == l || !l) && (r.value = r.init, m = null, o.value = !1, s("onUnVisible")), t ? i("div", {
          class: e.modalClass
        }, [
          e.mask ? i("div", {
            class: "modal-vue3-mask",
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }) : null,
          i("div", {
            ref: w,
            style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${e.zIndex};overflow:auto;outline:0;`,
            onclick: (c) => {
              S(c);
            }
          }, [
            i(
              "div",
              {
                ref: v,
                class: "modal-vue3-content",
                style: `width:${g};position:relative;top:${typeof d.top == "number" ? d.top + "px" : L};left:${d.left ? d.left + "px" : ""};margin: ${typeof d.left == "number" ? "0" : "0 auto"}; ${e.type != "clean" ? "border:1px solid #f0f0f0;" : ""}overflow:auto;outline:0;box-sizing:border-box; ${e.type != "clean" ? "background-color:#fff;" : ""}border-radius:2px;transform:scale(${r.value});`
              },
              [
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-header",
                  style: `padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${e.draggable && typeof e.draggable == "boolean" ? "cursor:move;" : ""}`,
                  onpointerdown: e.draggable && typeof e.draggable == "boolean" ? T : null
                }, [
                  i("div", null, e.title),
                  e.closable ? i("div", {
                    style: "width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",
                    onclick: () => {
                      x(l);
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
                }, f.default()),
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-footer",
                  style: "padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"
                }, [
                  i("div", {
                    class: "modal-vue3-footer-cancel",
                    style: `margin-right: 20px;height:30px;padding:0 8px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;${o.value && o.target === "cancelButton" ? "opacity:.6;" : ""}`,
                    onclick: () => {
                      O(e, "cancelButton");
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
                      O(e, "okButton");
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
  X as Modal,
  V as useModal
};
