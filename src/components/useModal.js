
import { defineComponent, h, reactive, ref } from 'vue';

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
        if(this.triggerTotal >= this.list.length) {
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

export function useModal(order) {
    if(order) {
        dep.list = [];
        for(let k in order) {
            let modal = {
                name: k,
                order: Number(order[k])
            }
            dep.track(modal)
        }
        dep.list.sort((a, b) => a.order - b.order);
    }
    return function(el, visible) {
        dep.trigger(el, visible);
        return currVisible;
    }
}


let currName = null;
let visibalName = null;
let scale = ref(0.6);
function animation(scale) {
    let timer = null;
    if(scale.value >= 1) {
        return false;
    } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
            scale.value += 0.02;
        }, 6)
    }
}


export const Modal = defineComponent({
    props: {
        visible: [Object, Boolean],
        name: String,
        mask: {
            type: Boolean,
            default: true
        },
        maskClosable: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: ''
        },
        draggable: {
            type: Boolean,
            default: false
        },
        modalClass: {
            type: String,
            default: 'modal-vue3-wrap'
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
            default: 1000
        },
        title: {
            type: String,
            default: 'Title'
        },
        animation: {
            type: Boolean,
            default: true
        },
        closable: {
            type: Boolean,
            default: true
        },
        cancelButton: {
            type: Object,
            default: () => {
                return {
                    text: 'cancel',
                    onclick: null
                }
            },
        },
        okButton: {
            type: Object,
            default: () => {
                return {
                    text: 'ok',
                    onclick: null
                }
            },
        }
    },
    setup(props, { slots, emit }) {
        const name = props.name;
        const width = typeof props.width === 'string' ?  props.width : `${props.width}px`;
        const offsetTop = typeof props.offsetTop === 'string' ?  props.offsetTop : `${props.offsetTop}px`;
        const wrapRef = ref(null);
        return () => {
            if(slots.default) {
                let visible = name ? props.visible[name] : props.visible;
                if(visible) {
                    if(props.animation === false) {
                        scale.value = 1;
                    } else {
                        if(currName != name) {
                            currName = name;
                            scale.value = 0.6;
                        }
                        animation(scale);
                    }
                    if(scale.value >= 1) {
                        visibalName = name;
                        emit('onVisible')
                    }
                } else {
                    if(visibalName == name || !name) {
                        emit('onUnVisible')
                    }
                }
                const onWrapClick = (e) => {
                    if(!props.maskClosable) return;
                    if( e.target === wrapRef.value) {
                        cancel(name);
                    }
                }
                const cancel = (name) => {
                    if(name && dep.list.length > 0) {
                        dep.trigger(name, false);
                    } else {
                        emit('update:visible', false)
                    }
                }
                return visible ? h('div', {
                    class: props.modalClass
                }, [
                    props.mask ? h('div', {
                        class: 'modal-vue3-mask',
                        style: 'width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25)',
                    }) : null,
                    h('div', {
                        ref: wrapRef,
                        style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${props.zIndex};overflow:auto;outline:0;`,
                        onclick: (e) => {onWrapClick(e)},
                    }, [
                        h('div', {
                            class: 'modal-vue3-content',
                            style: `width:${width};position:relative;top:${offsetTop}; ${props.type != 'clean' ? 'border:1px solid #f0f0f0;' : ''}margin: 0 auto;overflow:auto;outline:0;box-sizing:border-box; ${props.type != 'clean' ? 'background-color:#fff;' : ''}border-radius:2px;transform:scale(${scale.value});`
                        },[
                            props.type != 'clean' ? h('div', {
                                class:"modal-vue3-header",
                                style: 'padding: 12px 22px;border-bottom:1px solid #f0f0f0;position:relative;'
                            }, [
                                h('div', null, props.title),
                                props.closable ? h('div', {
                                    style: 'width:20px;height:16px;display:flex;justify-content:center;align-items:center;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;',
                                    onclick: () => {
                                        cancel(name);
                                    },
                                }, 'x') : null
                            ]) : null,
                            h('div', {
                                class:"modal-vue3-body",
                                style: props.type != 'clean' ? 'padding: 14px 22px' : ''
                            }, slots.default()),
                            props.type != 'clean' ? h('div', {
                                class:"modal-vue3-footer",
                                style: 'padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;'
                            },[
                                h('div', {
                                    class: 'modal-vue3-footer-cancel',
                                    style: 'margin-right: 20px;width:60px;height:30px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;',
                                    onclick: props.cancelButton.onclick && typeof props.cancelButton.onclick === 'function' ? props.cancelButton.onclick : () => {cancel(name)},
                                },  props.cancelButton.text || 'cancel'),
                                h('div', {
                                    class: 'modal-vue3-footer-ok',
                                    style: 'width:60px;height:30px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;',
                                    onclick: props.okButton.onclick && typeof props.okButton.onclick === 'function' ? props.okButton.onclick : () => {cancel(name)},
                                }, props.okButton.text || 'ok')
                            ]) : null,
                        ]
                        ),
                    ])
                ]) : null;
            }
        }
    }
})