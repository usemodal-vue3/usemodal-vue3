import { reactive as B, defineComponent as N, ref as v, watch as z, h as i } from "vue";
const b = 0.6, T = B({}), c = {
  currOrder: 0,
  triggerTotal: 0,
  list: [],
  track(e) {
    this.list.push(e);
  },
  trigger(e, n) {
    if (this.triggerTotal++, this.list = this.list.map((l) => (l.name === e && (l.visible = n), l)), this.triggerTotal >= this.list.length)
      if (this.currOrder < this.list.length) {
        for (; this.currOrder < this.list.length && (T[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
          this.currOrder++;
        this.currOrder = 0;
      } else
        this.triggerTotal = 0, this.trigger(e, n);
  }
};
function H(e) {
  if (e) {
    c.list = [];
    for (let n in e) {
      let l = {
        name: n,
        order: Number(e[n])
      };
      c.track(l);
    }
    c.list.sort((n, l) => n.order - l.order);
  }
  return function(n, l) {
    return c.trigger(n, l), T;
  };
}
const X = N({
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
  setup(e, { slots: n, emit: l }) {
    const o = e.name, O = typeof e.width == "string" ? e.width : `${e.width}px`, $ = typeof e.offsetTop == "string" ? e.offsetTop : `${e.offsetTop}px`, p = v(null), s = v(null);
    let x = null, g = null, u = v(b);
    const E = (t) => {
      let d = null;
      if (t.value >= 1)
        return !1;
      clearTimeout(d), d = setTimeout(() => {
        t.value += 0.02;
      }, 6);
    }, h = (t) => {
      t && c.list.length > 0 ? c.trigger(t, !1) : l("update:visible", !1);
    }, j = (t) => {
      !e.maskClosable || t.target === p.value && h(o);
    }, a = v(), r = B({
      left: void 0,
      top: void 0
    }), m = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, y = (t) => {
      let d = s.value.offsetLeft, S = s.value.offsetTop, C = {
        width: s.value.offsetWidth,
        height: s.value.offsetHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        x: t.pageX - d,
        y: t.pageY - S
      };
      a.value = C, m(t);
      const k = (f) => {
        if (!a.value)
          return;
        let L = f.pageX, M = f.pageY;
        r.left = Math.min(Math.max(L - a.value.x, 0), a.value.clientWidth - a.value.width), r.top = Math.min(Math.max(M - a.value.y, 0), a.value.clientHeight - a.value.height), m(f);
      }, w = (f) => {
        !a.value || (a.value = void 0, m(f), document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", w));
      };
      document.addEventListener("pointermove", k), document.addEventListener("pointerup", w);
    };
    return z(() => e.draggable, (t) => {
      typeof t == "object" && t !== null && t.addEventListener("pointerdown", y);
    }), () => {
      if (n.default) {
        let t = o ? e.visible[o] : e.visible;
        return t ? (e.animation === !1 ? u.value = 1 : (x != o && (x = o, u.value = b), E(u)), u.value >= 1 && !a.value && g != o && (g = o, l("onVisible"))) : (g == o || !o) && (u.value = b, g = null, l("onUnVisible")), t ? i("div", {
          class: e.modalClass
        }, [
          e.mask ? i("div", {
            class: "modal-vue3-mask",
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }) : null,
          i("div", {
            ref: p,
            style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${e.zIndex};overflow:auto;outline:0;`,
            onclick: (d) => {
              j(d);
            }
          }, [
            i(
              "div",
              {
                ref: s,
                class: "modal-vue3-content",
                style: `width:${O};position:relative;top:${typeof r.top == "number" ? r.top + "px" : $};left:${r.left ? r.left + "px" : ""};margin: ${typeof r.left == "number" ? "0" : "0 auto"}; ${e.type != "clean" ? "border:1px solid #f0f0f0;" : ""}overflow:auto;outline:0;box-sizing:border-box; ${e.type != "clean" ? "background-color:#fff;" : ""}border-radius:2px;transform:scale(${u.value});`
              },
              [
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-header",
                  style: `padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${e.draggable && typeof e.draggable == "boolean" ? "cursor:move;" : ""}`,
                  onpointerdown: e.draggable && typeof e.draggable == "boolean" ? y : null
                }, [
                  i("div", null, e.title),
                  e.closable ? i("div", {
                    style: "width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",
                    onclick: () => {
                      h(o);
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
                }, n.default()),
                e.type != "clean" ? i("div", {
                  class: "modal-vue3-footer",
                  style: "padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"
                }, [
                  i("div", {
                    class: "modal-vue3-footer-cancel",
                    style: "margin-right: 20px;width:60px;height:30px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;",
                    onclick: e.cancelButton.onclick && typeof e.cancelButton.onclick == "function" ? e.cancelButton.onclick : () => {
                      h(o);
                    }
                  }, e.cancelButton.text || "cancel"),
                  i("div", {
                    class: "modal-vue3-footer-ok",
                    style: "width:60px;height:30px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;",
                    onclick: e.okButton.onclick && typeof e.okButton.onclick == "function" ? e.okButton.onclick : () => {
                      h(o);
                    }
                  }, e.okButton.text || "ok")
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
  H as useModal
};
