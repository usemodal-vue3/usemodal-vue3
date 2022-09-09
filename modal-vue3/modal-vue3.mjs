import { defineComponent as u, reactive as h, watch as c, h as o } from "vue";
const f = u({
  props: {
    visibles: Object,
    order: Object
  },
  setup(i, { slots: e }) {
    const l = i.order, a = i.visibles, d = h({}), s = {
      currOrder: 0,
      triggerTotal: 0,
      list: [],
      track(t) {
        this.list.push(t);
      },
      trigger(t, r) {
        if (this.triggerTotal++, this.list = this.list.map((n) => (n.name === t && (n.visible = r), n)), this.triggerTotal === this.list.length)
          if (this.currOrder < this.list.length) {
            for (; this.currOrder < this.list.length && (d[this.list[this.currOrder].name] = this.list[this.currOrder].visible, !this.list[this.currOrder].visible); )
              this.currOrder++;
            this.currOrder = 0;
          } else
            this.triggerTotal = 0, this.trigger(t, r);
      }
    };
    if (l) {
      for (let t in l) {
        let r = {
          name: t,
          order: Number(l[t])
        };
        s.track(r);
      }
      s.list.sort((t, r) => t.order - r.order);
    }
    return c(a, (t) => {
      s.triggerTotal = 0;
      for (let r in t)
        s.trigger(r, t[r]);
    }), () => {
      if (e.default)
        return o("div", null, e.default(d));
    };
  }
}), b = u({
  props: {
    mask: Boolean,
    visible: Boolean
  },
  setup(i, { slots: e }) {
    return () => {
      if (e.default)
        return i.visible ? o("div", null, [
          o("div", {
            style: "width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)"
          }),
          o("div", {
            style: "position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:1000;overflow:auto;outline:0;"
          }, [
            o(
              "div",
              {
                style: "width:500px;position:relative;top:100px;margin: 0 auto;z-index:1000;overflow:auto;outline:0;box-sizing:border-box;background-color:#fff;"
              },
              e.default()
            )
          ])
        ]) : null;
    };
  },
  mounted() {
    this.$emit("cacel", (i) => {
      console.log(21213);
    });
  }
});
export {
  b as UseModal,
  f as UseModalGroup
};
