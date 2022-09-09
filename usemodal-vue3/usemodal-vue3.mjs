import { reactive as c, defineComponent as a, watch as u, h as t } from "vue";
const n = c({});
c({});
const s = {
  currOrder: 0,
  triggerTotal: 0,
  list: [],
  track(e) {
    this.list.push(e);
  },
  trigger(e, i) {
    if (this.triggerTotal++, this.list = this.list.map((r) => (r.name === e && (r.visible = i), r)), this.triggerTotal === this.list.length)
      if (this.currOrder < this.list.length) {
        for (; this.currOrder < this.list.length && (n[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
          this.currOrder++;
        this.currOrder = 0;
      } else
        this.triggerTotal = 0, this.trigger(e, i);
  }
};
function h() {
  console.log("ok");
}
function g() {
  console.log(n, "currVisible"), n.m1 = !1, console.log("cancel");
}
const v = a({
  props: {
    visibles: Object,
    order: Object
  },
  setup(e, { slots: i }) {
    const r = e.order, d = e.visibles;
    if (r) {
      for (let o in r) {
        let l = {
          name: o,
          order: Number(r[o])
        };
        s.track(l);
      }
      s.list.sort((o, l) => o.order - l.order);
    }
    return u(d, (o) => {
      s.triggerTotal = 0;
      for (let l in o)
        s.trigger(l, o[l]);
    }), () => {
      if (i.default)
        return t("div", null, i.default(n));
    };
  }
}), b = a({
  props: {
    mask: Boolean,
    visible: Boolean
  },
  setup(e, { slots: i }) {
    return () => {
      if (i.default)
        return e.visible ? t("div", null, [
          t("div", {
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }),
          t("div", {
            style: "position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:1000;overflow:auto;outline:0;"
          }, [
            t(
              "div",
              {
                class: "modal-vue3-content",
                style: "width:500px;position:relative;top:100px;margin: 0 auto;overflow:auto;outline:0;box-sizing:border-box;background-color:#fff;"
              },
              [
                t("div", {
                  class: "modal-vue3-header"
                }, t("div", null, "Title")),
                t("div", null, i.default()),
                t("div", {
                  class: "modal-vue3-footer"
                }, [
                  t("div", {
                    class: "modal-vue3-footer-cancel",
                    onclick: g
                  }, "cancel"),
                  t("div", {
                    class: "modal-vue3-footer-ok",
                    onclick: h
                  }, "ok")
                ])
              ]
            )
          ])
        ]) : null;
    };
  },
  mounted() {
    this.$emit("cacel", (e) => {
      console.log(21213);
    });
  }
});
export {
  b as Modal,
  v as ModalGroup
};
