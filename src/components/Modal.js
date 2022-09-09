
import { defineComponent, h, watch, reactive } from 'vue';

export const UseModalGroup = defineComponent({
    props: {
        visibles: Object,
        order: Object
    },
    setup(props, { slots }) {
        const order = props.order;
        const visibles = props.visibles;
        const currVisible = reactive({});
        const dep = {
            currOrder: 0,
            triggerTotal: 0,
            list: [],
            track(modal) {
                this.list.push(modal);
            },
            trigger(name, isVisible) {
                this.triggerTotal++;
                this.list = this.list.map(item => {
                    if(item.name === name) {
                        item.visible = isVisible;
                    }
                    return item;
                })
                if(this.triggerTotal === this.list.length) {
                    // all modal be ready
                    if(this.currOrder < this.list.length) {
                        while(this.currOrder < this.list.length) {
                            currVisible[this.list[this.currOrder].name] = this.list[this.currOrder].visible;
                            if(this.list[this.currOrder].visible) {
                                break;
                            } else {
                                this.currOrder++;
                            }
                        }
                        this.currOrder = 0;
                    } else {
                        this.triggerTotal = 0;
                        this.trigger(name, isVisible);
                    }
                }
            }
        }
        if(order) {
            for(let k in order) {
                let modal = {
                    name: k,
                    order: Number(order[k])
                }
                dep.track(modal)
            }
            dep.list.sort((a, b) => a.order - b.order);
        }
        watch(visibles, (n) => {
            dep.triggerTotal = 0;
            for(let k in n) {
                dep.trigger(k, n[k]);
            }
        })
        return () => {
            if(slots.default) {
                return h('div',null, slots.default(currVisible))
            }
        }
    }
})

export const UseModal = defineComponent({
    props: {
        mask: Boolean,
        visible: Boolean,
    },
    setup(props, { slots }) {
        return () => {
            if(slots.default) {
                return props.visible ? h('div',null, [
                    h('div', {
                        style: 'width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)'
                    }),
                    h('div', {
                        style: 'position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:1000;overflow:auto;outline:0;'
                    }, [
                        h('div', {
                            style: 'width:500px;position:relative;top:100px;margin: 0 auto;z-index:1000;overflow:auto;outline:0;box-sizing:border-box;background-color:#fff;'
                        },
                        slots.default()
                        ),
                    ])
                ]) : null;
            }
        }
    },
    mounted() {
        this.$emit('cacel', (cb) => {
            console.log(21213)
        })
    }
})