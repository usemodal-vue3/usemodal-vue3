(function(f,i){typeof exports=="object"&&typeof module<"u"?i(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],i):(f=typeof globalThis<"u"?globalThis:f||self,i(f["usemodal-vue3"]={},f.Vue))})(this,function(f,i){"use strict";function b(e){return typeof e=="boolean"}function T(e){return typeof e=="number"}function O(e){return typeof e=="object"&&e!==null}function L(e){const g=i.reactive({}),u={currOrder:0,triggerTotal:0,list:[],track(n){this.list.push(n)},trigger(n,l){if(this.triggerTotal++,this.list=this.list.map(p=>(p.name===n&&(p.visible=l),p)),this.triggerTotal>=this.list.length)if(this.currOrder<this.list.length){for(;this.currOrder<this.list.length&&(g[this.list[this.currOrder].name]=this.list[this.currOrder].visible,!this.list[this.currOrder].visible);)this.currOrder++;this.currOrder=0}else this.triggerTotal=0,this.trigger(n,l)}};if(e){u.list=[];for(let n in e){let l={name:n,order:Number(e[n])};u.track(l)}u.list.sort((n,l)=>n.order-l.order)}return function(n,l){return u.trigger(n,l),{currVisible:g,dep:u}}}const N=i.defineComponent({props:{visible:[Object,Boolean],name:String,mask:{type:Boolean,default:!0},maskClosable:{type:Boolean,default:!0},type:{type:String,default:""},modalClass:{type:String,default:"modal-vue3-wrap"},width:{type:[String,Number],default:500},offsetTop:{type:[String,Number],default:100},zIndex:{type:[String,Number],default:1e3},title:{type:String,default:"Title"},animation:{type:Boolean,default:!0},closable:{type:Boolean,default:!0},draggable:{type:[Boolean,Object],default:!1},cancelButton:{type:Object,default:()=>({text:"cancel",onclick:null,loading:!1})},okButton:{type:Object,default:()=>({text:"ok",onclick:null,loading:!1})}},setup(e,{slots:g,emit:u}){let n;const l=e.name,p=typeof e.width=="string"?e.width:`${e.width}px`,C=typeof e.offsetTop=="string"?e.offsetTop:`${e.offsetTop}px`,j=i.ref(null),m=i.ref(null);let M=null,x=null,a=i.reactive({init:.5,value:.5,max:1,step:.02,speed:5,linear:!1}),y=i.reactive({init:0,value:0,max:360,step:30,speed:30,linear:!0});const k=(t,d,s)=>{let $=d?t.max:t.init,h=d?t.init:t.max;if(d?t.value<=h:t.value>=h)return t.linear?t.value=$:(t.value=h,s&&s()),!1;setTimeout(()=>{d?t.value-=t.step:t.value+=t.step},t.speed)},w=t=>{t&&n.list.length>0&&O(e.visible)?n.trigger(t,!1):u("update:visible",!1)},V=t=>{!e.maskClosable||!e.mask||t.target===j.value&&w(l)};let o=i.reactive({value:!1,target:""});const S=(t,d)=>{const s=t[d];(!s.loading||s.loading&&!o.value)&&(s.onclick&&typeof s.onclick=="function"?s.onclick():w(t.name),o.value=!0,o.target=d)},r=i.ref(),c=i.reactive({left:void 0,top:void 0}),B=t=>{t.preventDefault(),t.stopPropagation()},E=t=>{let d=m.value.offsetLeft,s=m.value.offsetTop,$={width:m.value.offsetWidth,height:m.value.offsetHeight,clientWidth:document.documentElement.clientWidth,clientHeight:document.documentElement.clientHeight,x:t.pageX-d,y:t.pageY-s};r.value=$,B(t);const h=v=>{if(!r.value)return;let W=v.pageX,H=v.pageY;c.left=Math.min(Math.max(W-r.value.x,0),r.value.clientWidth-r.value.width),c.top=Math.min(Math.max(H-r.value.y,0),r.value.clientHeight-r.value.height),B(v)},z=v=>{!r.value||(r.value=void 0,B(v),document.removeEventListener("pointermove",h),document.removeEventListener("pointerup",z))};document.addEventListener("pointermove",h),document.addEventListener("pointerup",z)};return i.watch(()=>e.draggable,t=>{O(t)&&t.addEventListener("pointerdown",E)}),()=>{if(g.default){let t;return b(e.visible)?t=e.visible:(t=e.visible.currVisible[l],n=e.visible.dep),t?(o.value&&k(y),e.animation===!1?a.value=a.max:(M!=l&&(M=l,a.value=a.init),a.speed=5,k(a)),a.value>=a.max&&!r.value&&x!=l&&(x=l,u("onVisible"))):(x==l||!l)&&(t=!0,a.speed=2,k(a,!0,()=>{t=!1,x=null,o.value=!1,u("onUnVisible")})),t?i.h("div",{class:e.modalClass},[e.mask?i.h("div",{class:"modal-vue3-mask",style:`width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0, 0, 0, 0.25);z-index:${e.zIndex-1};`}):null,i.h("div",{ref:j,style:`position:fixed;left:0;right:0;top:0;bottom:0;margin: 0 auto;z-index:${e.zIndex};overflow:auto;outline:0;`,onclick:d=>{V(d)}},[i.h("div",{ref:m,class:"modal-vue3-content",style:`width:${p};position:relative;top:${T(c.top)?c.top+"px":C};left:${c.left?c.left+"px":""};margin: ${T(c.left)?"0":"0 auto"}; ${e.type!="clean"?"border:1px solid #f0f0f0;":""}overflow:auto;outline:0;box-sizing:border-box; ${e.type!="clean"?"background-color:#fff;":""}border-radius:2px;transform:scale(${a.value});`},[e.type!="clean"?i.h("div",{class:"modal-vue3-header",style:`padding:12px 22px;border-bottom:1px solid #f0f0f0;position:relative;${e.draggable&&b(e.draggable)?"cursor:move;":""}`,onpointerdown:e.draggable&&b(e.draggable)?E:null},[i.h("div",null,e.title),e.closable?i.h("div",{style:"width:20px;height:16px;cursor:pointer;position:absolute;top:15px;right:15px;font-size: 20px;",onclick:()=>{w(l)}},[i.h("div",{style:"width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(45deg);"},""),i.h("div",{style:"width:14px;height:1px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;background-color:#999;transform:rotate(-45deg);"},"")]):null]):null,i.h("div",{class:"modal-vue3-body",style:e.type!="clean"?"padding: 14px 22px":""},g.default()),e.type!="clean"?i.h("div",{class:"modal-vue3-footer",style:"padding: 12px 22px;display:flex;justify-content:flex-end;align-items:center;border-top:1px solid #f0f0f0;"},[i.h("div",{class:"modal-vue3-footer-cancel",style:`margin-right: 20px;height:30px;padding:0 8px;border-radius:2px;border: 1px solid #d9d9d9;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;${o.value&&o.target==="cancelButton"?"opacity:.6;":""}`,onclick:()=>{S(e,"cancelButton")}},[o.value&&o.target==="cancelButton"?i.h("span",{style:`width: 10px;height:10px;margin-right:5px;border:1px solid #666;border-radius:50%;border-top:1px solid transparent; transform:rotate(${y.value}deg);`}):null,i.h("div",{style:"min-width:44px;text-align:center;"},e.cancelButton.text||"cancel")]),i.h("div",{class:"modal-vue3-footer-ok",style:`height:30px;padding: 0 8px;border-radius:2px;display:flex;justify-content:center;align-items:center;background-color:#4395ff;color:#fff;cursor:pointer;position:relative;${o.value&&o.target==="okButton"?"opacity:.6;":""}`,onclick:()=>{S(e,"okButton")}},[o.value&&o.target==="okButton"?i.h("span",{style:`width: 10px;height:10px;margin-right:5px;border:1px solid #fff;border-radius:50%;border-top:1px solid transparent; transform:rotate(${y.value}deg);`}):null,i.h("div",{style:"min-width:44px;text-align:center;"},e.okButton.text||"ok")])]):null])])]):null}}}});f.Modal=N,f.useModal=L,Object.defineProperties(f,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
