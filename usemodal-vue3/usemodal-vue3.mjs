import { reactive as v, defineComponent as W, ref as y, watch as H, h as l } from "vue";
const E = v({}), f = {
  currOrder: 0,
  triggerTotal: 0,
  list: [],
  track(e) {
    this.list.push(e);
  },
  trigger(e, o) {
    if (this.triggerTotal++, this.list = this.list.map((i) => (i.name === e && (i.visible = o), i)), this.triggerTotal >= this.list.length)
      if (this.currOrder < this.list.length) {
        for (; this.currOrder < this.list.length && (E[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
          this.currOrder++;
        this.currOrder = 0;
      } else
        this.triggerTotal = 0, this.trigger(e, o);
  }
};
function X(e) {
  if (e) {
    f.list = [];
    for (let o in e) {
      let i = {
        name: o,
        order: Number(e[o])
      };
      f.track(i);
    }
    f.list.sort((o, i) => o.order - i.order);
  }
  return function(o, i) {
    return f.trigger(o, i), E;
  };
}
const Y = W({
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
  setup(e, { slots: o, emit: i }) {
    const r = e.name, L = typeof e.width == "string" ? e.width : `${e.width}px`, S = typeof e.offsetTop == "string" ? e.offsetTop : `${e.offsetTop}px`, k = y(null), g = y(null);
    let w = null, h = null, s = v({
      init: 0.6,
      value: 0.6,
      max: 1,
      step: 0.02,
      speed: 6,
      linear: !1
    }), m = v({
      init: 0,
      value: 0,
      max: 360,
      step: 40,
      speed: 40,
      linear: !0
    });
    const B = (t) => {
      if (t.value >= t.max)
        return t.linear ? t.value = t.init : t.value = t.max, !1;
      setTimeout(() => {
        t.value += t.step;
      }, t.speed);
    }, x = (t) => {
      t && f.list.length > 0 ? f.trigger(t, !1) : i("update:visible", !1);
    }, C = (t) => {
      !e.maskClosable || !e.mask || t.target === k.value && x(r);
    };
    let n = v({
      value: !1,
      target: ""
    });
    const $ = (t, c) => {
      const u = t[c];
      (!u.loading || u.loading && !n.value) && (u.onclick && typeof u.onclick == "function" ? u.onclick() : x(t.name), n.value = !0, n.target = c);
    }, a = y(), d = v({
      left: void 0,
      top: void 0
    }), b = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, O = (t) => {
      let c = g.value.offsetLeft, u = g.value.offsetTop, M = {
        width: g.value.offsetWidth,
        height: g.value.offsetHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        x: t.pageX - c,
        y: t.pageY - u
      };
      a.value = M, b(t);
      const T = (p) => {
        if (!a.value)
          return;
        let N = p.pageX, z = p.pageY;
        d.left = Math.min(Math.max(N - a.value.x, 0), a.value.clientWidth - a.value.width), d.top = Math.min(Math.max(z - a.value.y, 0), a.value.clientHeight - a.value.height), b(p);
      }, j = (p) => {
        !a.value || (a.value = void 0, b(p), document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", j));
      };
      document.addEventListener("pointermove", T), document.addEventListener("pointerup", j);
    };
    return H(() => e.draggable, (t) => {
      typeof t == "object" && t !== null && t.addEventListener("pointerdown", O);
    }), () => {
      if (o.default) {
        let t = r ? e.visible[r] : e.visible;
        return t ? (n.value && B(m), e.animation === !1 ? s.value = s.max : (w != r && (w = r, s.value = s.init), B(s)), s.value >= s.max && !a.value && h != r && (h = r, i("onVisible"))) : (h == r || !r) && (s.value = s.init, h = null, n.value = !1, i("onUnVisible")), t ? l("div", {
          class: e.modalClass
        }, [
          e.mask ? l("div", {
            class: "modal-vue3-mask",
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }) : null,
          l("div", {
            ref: k,
            style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${e.zIndex};overflow:auto;outline:0;`,
            onclick: (c) => {
              C(c);
            }
          }, [
            l(
              "div",
              {
                ref: g,
                class: "modal-vue3-content",
                style: `width:${L};position:relative;top:${typeof d.top == "number" ? d.top + "px" : S};left:${d.left ? d.left + "px" : ""};margin: ${typeof d.left == "number" ? "0" : "0 auto"}; ${e.type != "clean" ? "border:1px solid #f0f0f0;" : ""}overflow:auto;outline:0;box-sizing:border-box; ${e.type != "clean" ? "background-color:#fff;" : ""}border-radius:2px;transform:scale(${s.value});`
              },
              [
                e.type != "clean" ? l("div", {
                  class: "modal-vue3-header",
                  style: `padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${e.draggable && typeof e.draggable == "boolean" ? "cursor:move;" : ""}`,
                  onpointerdown: e.draggable && typeof e.draggable == "boolean" ? O : null
                }, [
                  l("div", null, e.title),
                  e.closable ? l("div", {
                    style: "width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",
                    onclick: () => {
                      x(r);
                    }
                  }, [
                    l("div", {
                      style: "width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(45deg);"
                    }, ""),
                    l("div", {
                      style: "width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(-45deg);"
                    }, "")
                  ]) : null
                ]) : null,
                l("div", {
                  class: "modal-vue3-body",
                  style: e.type != "clean" ? "padding: 14px 22px" : ""
                }, o.default()),
                e.type != "clean" ? l("div", {
                  class: "modal-vue3-footer",
                  style: "padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"
                }, [
                  l("div", {
                    class: "modal-vue3-footer-cancel",
                    style: `margin-right: 20px;height:30px;padding:0 8px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;${n.value && n.target === "cancelButton" ? "opacity:.6;" : ""}`,
                    onclick: () => {
                      $(e, "cancelButton");
                    }
                  }, [
                    n.value && n.target === "cancelButton" ? l("span", {
                      style: `width: 10px;height:10px;margin-right:5px;border:1px solid #666;border-radius:50%;border-top:1px solid transparent; transform:rotate(${m.value}deg);`
                    }) : null,
                    l("div", {
                      style: "min-width:44px;text-align:center;"
                    }, e.cancelButton.text || "cancel")
                  ]),
                  l("div", {
                    class: "modal-vue3-footer-ok",
                    style: `height:30px;padding: 0 8px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;position:relative;${n.value && n.target === "okButton" ? "opacity:.6;" : ""}`,
                    onclick: () => {
                      $(e, "okButton");
                    }
                  }, [
                    n.value && n.target === "okButton" ? l("span", {
                      style: `width: 10px;height:10px;margin-right:5px;border:1px solid #fff;border-radius:50%;border-top:1px solid transparent; transform:rotate(${m.value}deg);`
                    }) : null,
                    l("div", {
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
  Y as Modal,
  X as useModal
};
