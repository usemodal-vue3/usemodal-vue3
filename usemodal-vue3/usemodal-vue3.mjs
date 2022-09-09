import { reactive as y, ref as g, defineComponent as v, h as n } from "vue";
const h = y({}), a = {
  currOrder: 0,
  triggerTotal: 0,
  list: [],
  track(t) {
    this.list.push(t);
  },
  trigger(t, e) {
    if (this.triggerTotal++, this.list = this.list.map((l) => (l.name === t && (l.visible = e), l)), this.triggerTotal >= this.list.length)
      if (this.currOrder < this.list.length) {
        for (; this.currOrder < this.list.length && (h[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
          this.currOrder++;
        this.currOrder = 0;
      } else
        this.triggerTotal = 0, this.trigger(t, e);
  }
};
function B(t) {
  if (t) {
    a.list = [];
    for (let e in t) {
      let l = {
        name: e,
        order: Number(t[e])
      };
      a.track(l);
    }
    a.list.sort((e, l) => e.order - l.order);
  }
  return function(e, l) {
    return a.trigger(e, l), h;
  };
}
let d = null, f = null, r = g(0.6);
function k(t) {
  let e = null;
  if (t.value >= 1)
    return !1;
  clearTimeout(e), e = setTimeout(() => {
    t.value += 0.02;
  }, 6);
}
const w = v({
  props: {
    mask: Boolean,
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
    draggable: {
      type: Boolean,
      default: !1
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
    cancelButton: {
      type: Object,
      default: () => ({
        text: "cancel",
        onclick: null
      })
    },
    okButton: {
      type: Object,
      default: () => ({
        text: "ok",
        onclick: null
      })
    }
  },
  setup(t, { slots: e, emit: l }) {
    const i = t.name, m = typeof t.width == "string" ? t.width : `${t.width}px`, x = typeof t.offsetTop == "string" ? t.offsetTop : `${t.offsetTop}px`, c = g(null);
    return () => {
      if (e.default) {
        let u = i ? t.visible[i] : t.visible;
        u ? (t.animation === !1 ? r.value = 1 : (d != i && (d = i, r.value = 0.6), k(r)), r.value >= 1 && (f = i, l("onVisible"))) : (f == i || !i) && l("onUnVisible");
        const b = (o) => {
          !t.maskClosable || o.target === c.value && s(i);
        }, s = (o) => {
          o && a.list.length > 0 ? a.trigger(o, !1) : l("update:visible", !1);
        };
        return u ? n("div", {
          class: t.modalClass
        }, [
          t.mask ? n("div", {
            class: "modal-vue3-mask",
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }) : null,
          n("div", {
            ref: c,
            style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${t.zIndex};overflow:auto;outline:0;`,
            onclick: (o) => {
              b(o);
            }
          }, [
            n(
              "div",
              {
                class: "modal-vue3-content",
                style: `width:${m};position:relative;top:${x}; ${t.type != "clean" ? "border:1px solid #f0f0f0;" : ""}margin: 0 auto;overflow:auto;outline:0;box-sizing:border-box; ${t.type != "clean" ? "background-color:#fff;" : ""}border-radius:2px;transform:scale(${r.value});`
              },
              [
                t.type != "clean" ? n("div", {
                  class: "modal-vue3-header",
                  style: "padding: 12px 22px;border-bottom:1px solid #f0f0f0;position:relative;"
                }, [
                  n("div", null, t.title),
                  t.closable ? n("div", {
                    style: "width:20px;height:16px;display:flex;justify-content:center;align-items:center;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",
                    onclick: () => {
                      s(i);
                    }
                  }, "x") : null
                ]) : null,
                n("div", {
                  class: "modal-vue3-body",
                  style: t.type != "clean" ? "padding: 14px 22px" : ""
                }, e.default()),
                t.type != "clean" ? n("div", {
                  class: "modal-vue3-footer",
                  style: "padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"
                }, [
                  n("div", {
                    class: "modal-vue3-footer-cancel",
                    style: "margin-right: 20px;width:60px;height:30px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;",
                    onclick: t.cancelButton.onclick && typeof t.cancelButton.onclick == "function" ? t.cancelButton.onclick : () => {
                      s(i);
                    }
                  }, t.cancelButton.text || "cancel"),
                  n("div", {
                    class: "modal-vue3-footer-ok",
                    style: "width:60px;height:30px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;",
                    onclick: t.okButton.onclick && typeof t.okButton.onclick == "function" ? t.okButton.onclick : () => {
                      s(i);
                    }
                  }, t.okButton.text || "ok")
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
  w as Modal,
  B as useModal
};
