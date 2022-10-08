
import { defineComponent, h, reactive, ref , watch } from 'vue';

function isBool(target) {
    return typeof target === 'boolean';
}
function isNumber(target) {
    return typeof target === 'number';
}
function isObject(target) {
    return typeof target === 'object' && target !== null;
}

export function useModal(order) {
    const currVisible = reactive({});
    const dep = {
        currOrder: 0,
        triggerTotal: 0,
        list: [], // modals
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
    return function(name, visible) {
        dep.trigger(name, visible);
        return {
            currVisible,
            dep
        };
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
        draggable: {
            type: [Boolean,Object],
            default: false
        },
        cancelButton: {
            type: Object,
            default: () => {
                return {
                    text: 'cancel',
                    onclick: null,
                    loading: false
                }
            },
        },
        okButton: {
            type: Object,
            default: () => {
                return {
                    text: 'ok',
                    onclick: null,
                    loading: false
                }
            },
        }
    },
    setup(props, { slots, emit }) {
        let dep;
        const name = props.name;
        const width = typeof props.width === 'string' ?  props.width : `${props.width}px`;
        const offsetTop = typeof props.offsetTop === 'string' ?  props.offsetTop : `${props.offsetTop}px`;
        const wrapRef = ref(null);
        const contentRef = ref(null);

        let currName = null;
        let visibalName = null;
        let scale = reactive({
            init: -15,
            value: -15,
            max: 0,
            step: 1,
            speed: 10,
            linear: false,
        });
        let rotateVal = reactive({
            init: 0,
            value: 0,
            max: 360,
            step: 30,
            speed: 30,
            linear: true,
        })
        const animation = (target, contrary, cb) => {
            let start = contrary ? target.max : target.init;
            let end = contrary ? target.init : target.max;
            if(contrary ? target.value <= end : target.value >= end) {
                if(target.linear) {
                    target.value = start;
                } else {
                    target.value = end;
                    cb && cb();
                }
                return false;
            } else {
                setTimeout(() => {
                    if(contrary) {
                        target.value -= target.step;
                    } else {
                        target.value += target.step;
                    }
                }, target.speed)
            }
        }

        const cancel = (name) => {
            if(name && dep.list.length > 0 && isObject(props.visible)) {
                dep.trigger(name, false);
            } else {
                emit('update:visible', false)
            }
        }

        const onWrapClick = (e) => {
            if(!props.maskClosable || !props.mask) return;
            if( e.target === wrapRef.value) {
                cancel(name);
            }
        }

        let buttonLoading = reactive({
            value: false,
            target: ''
        })
        const onButton = (props, target) => {
            const btn = props[target];
            if(!btn.loading || btn.loading && !buttonLoading.value) {
                btn.onclick && typeof btn.onclick === 'function' ? btn.onclick() : cancel(props.name)
                if(btn.loading) {
                    buttonLoading.value = true;
                    buttonLoading.target = target;
                }
            }
        }

        const rectData = ref();
        const cententPosition = reactive({
            left: undefined,
            top: undefined
        });
        
        const handleEvent = (e) => {
            e.preventDefault()
            e.stopPropagation()
        }
        const start = (e) => {
            let left = contentRef.value.offsetLeft;
            let top =  contentRef.value.offsetTop;
            let pos = {
                width: contentRef.value.offsetWidth,
                height: contentRef.value.offsetHeight,
                clientWidth: document.documentElement.clientWidth,
                clientHeight: document.documentElement.clientHeight,
                x: e.pageX - left,
                y: e.pageY - top,
            }
            rectData.value = pos;
            handleEvent(e);
            const move = (e) => {
                if(!rectData.value) return
                let pageX = e.pageX;
                let pageY = e.pageY;
                cententPosition.left = Math.min(Math.max(pageX - rectData.value.x , 0), rectData.value.clientWidth - rectData.value.width);
                cententPosition.top = Math.min(Math.max(pageY - rectData.value.y , 0), rectData.value.clientHeight - rectData.value.height);
                handleEvent(e);
            }
            const end = (e) => {
                if (!rectData.value) return
                rectData.value = undefined;
                handleEvent(e);
                document.removeEventListener('pointermove', move)
                document.removeEventListener('pointerup', end)
            }
            document.addEventListener('pointermove', move)
            document.addEventListener('pointerup', end)
        }
        watch(() => props.draggable, (target) => {
            if(isObject(target)) {
                target.addEventListener('pointerdown', start);
            }
        })
        return () => {
            if(slots.default) {
                let visible;
                if(isBool(props.visible)) {
                    visible = props.visible;
                } else {
                    // useModal for madals
                    visible = props.visible.currVisible[name];
                    dep = props.visible.dep;
                }
                if(visible) {
                    if(buttonLoading.value) {
                        animation(rotateVal);
                    }
                    if(props.animation === false) {
                        scale.value = scale.max;
                    } else {
                        if(currName != name) {
                            currName = name;
                            scale.value = scale.init;
                        }
                        scale.speed = 5;
                        animation(scale);
                    }
                    if(scale.value >= scale.max && !rectData.value && visibalName != name) {
                        visibalName = name;
                        emit('onVisible')
                    }
                } else {
                    if(visibalName == name || !name) {
                        if(props.animation === false) {
                            visible = false;
                        } else {
                            visible = true;
                            scale.speed = 2;
                            animation(scale, true, () => {
                                visible = false;
                                visibalName = null;
                                buttonLoading.value = false;
                                emit('onUnVisible')
                            });
                        }
                    }
                }
                return visible ? h('div', {
                    class: props.modalClass
                }, [
                    props.mask ? h('div', {
                        class: 'modal-vue3-mask',
                        style: `width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25);z-index:${props.zIndex - 1};`,
                    }) : null,
                    h('div', {
                        ref: wrapRef,
                        style: `position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${props.zIndex};overflow:auto;outline:0;`,
                        onclick: (e) => {onWrapClick(e)},
                    }, [
                        h('div', {
                            ref: contentRef,
                            class: 'modal-vue3-content',
                            style: `width:${width};position:relative;top:${isNumber(cententPosition.top) ? cententPosition.top+'px' : offsetTop};left:${cententPosition.left ? cententPosition.left+'px' : '' };margin: ${isNumber(cententPosition.left) ? '0' : '0 auto'}; ${props.type != 'clean' ? 'border:1px solid #f0f0f0;' : ''}overflow:auto;outline:0;box-sizing:border-box; ${props.type != 'clean' ? 'background-color:#fff;' : ''}border-radius:2px;transform:translateY(${scale.value}px);`
                        },[
                            props.type != 'clean' ? h('div', {
                                class:"modal-vue3-header",
                                style: `padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${props.draggable && isBool(props.draggable) ? 'cursor:move;' : ''}`,
                                onpointerdown: props.draggable && isBool(props.draggable) ? start : null,
                            }, [
                                h('div', null, props.title),
                                props.closable ? h('div', {
                                    style: 'width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;',
                                    onclick: () => {
                                        cancel(name);
                                    },
                                }, [
                                    h('div', {
                                        style: 'width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(45deg);'
                                    }, ''),
                                    h('div', {
                                        style: 'width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(-45deg);'
                                    }, '')
                                ]) : null
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
                                    style: `margin-right: 20px;height:30px;padding:0 8px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;${buttonLoading.value && buttonLoading.target === 'cancelButton' ? 'opacity:.6;' : ''}`,
                                    onclick:() => {onButton(props, 'cancelButton')},
                                }, [
                                    buttonLoading.value && buttonLoading.target === 'cancelButton' ? h('span', {
                                        style: `width: 10px;height:10px;margin-right:5px;border:1px solid #666;border-radius:50%;border-top:1px solid transparent; transform:rotate(${rotateVal.value}deg);`
                                    }) : null,
                                    h('div',{
                                       style: 'min-width:44px;text-align:center;'
                                    }, props.cancelButton.text || 'cancel')
                                ]),
                                h('div', {
                                    class: 'modal-vue3-footer-ok',
                                    style: `height:30px;padding: 0 8px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;position:relative;${buttonLoading.value && buttonLoading.target === 'okButton' ? 'opacity:.6;' : ''}`,
                                    onclick:() => {onButton(props, 'okButton')},
                                }, [
                                    buttonLoading.value && buttonLoading.target === 'okButton' ? h('span', {
                                        style: `width: 10px;height:10px;margin-right:5px;border:1px solid #fff;border-radius:50%;border-top:1px solid transparent; transform:rotate(${rotateVal.value}deg);`
                                    }) : null,
                                    h('div',{
                                       style: 'min-width:44px;text-align:center;'
                                    }, props.okButton.text || 'ok')
                                ])
                            ]) : null,
                        ]
                        ),
                    ])
                ]) : null;
            }
        }
    }
})