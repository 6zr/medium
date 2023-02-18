(function(){var e={4193:function(e,n,t){"use strict";var r=t(144),o=t(3726),u=t(259),i=t(3102),a=function(){var e=this,n=e._self._c;e._self._setupProxy;return n(o.Z,[n(u.Z,{attrs:{app:"",dense:"",color:"primary",dark:""}},[n("span",[e._v("shirokuma_bot 表現ツール")])]),n(i.Z,[n("router-view")],1)],1)},l=[],c=r.ZP.extend({name:"App",data:function(){return{}}}),s=c,f=t(1001),p=(0,f.Z)(s,a,l,!1,null,null,null),d=p.exports,h=t(129),v=t.n(h),b=t(8345),m=function(){var e=this,n=e._self._c;e._self._setupProxy;return n("hello-world",{attrs:{msg:"medium"}})},y=[],g=function(){var e=this,n=e._self._c;e._self._setupProxy;return n("p",[n("span",[e._v("Hello ")]),n("span",[e._v(e._s(e.msg))])])},w=[],_=t(655),P=t(1929),Z=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return Object.defineProperty(n,"msg",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),n}return(0,_.ZT)(n,e),(0,_.gn)([(0,P.fI)()],n.prototype,"msg",void 0),n=(0,_.gn)([P.wA],n),n}(P.w3),O=Z,j=O,x=(0,f.Z)(j,g,w,!1,null,"8a7f65fa",null),k=x.exports,T=r.ZP.extend({name:"Home",components:{HelloWorld:k}}),C=T,M=(0,f.Z)(C,m,y,!1,null,null,null),A=M.exports,S=t(5565),q=t(9819),I=t(5255),H=t(4986),J=t(9088),$=t(2515),B=function(){var e=this,n=e._self._c;e._self._setupProxy;return n(H.Z,{staticClass:"melody"},[n(q.Z,{staticClass:"mt-4"},[n(I.Qq,{staticClass:"pb-1"},[e._v("譜面")]),n(I.ZB,[e._v(e._s(e.score))]),n(I.h7,[n($.Z),n(S.Z,{attrs:{color:"secondary"},on:{click:e.stop}},[e._v("停止")]),n(S.Z,{attrs:{color:"primary"},on:{click:e.play}},[n(J.Z,{attrs:{small:""}},[e._v("mdi-music")]),n("span",{staticClass:"font-weight-bold ml-1"},[e._v("演奏")])],1)],1)],1)],1)},G=[],Q=[{scale:"ド",node:48},{scale:"レ",node:50},{scale:"ミ",node:52},{scale:"ファ",node:53},{scale:"ソ",node:55},{scale:"ラ",node:57},{scale:"シ",node:59},{scale:"モ",node:64}],U=function(e,n){var t=e>=96?0:e,r=11025,o=new Uint8Array(Math.floor(r*n)+100),u="524946460000000057415645666D74201000000001000100112B0000112B0000010008006461746100000000",i=0;for(i=0;i<u.length/2;i++)o[i]=parseInt(u.substr(2*i,2),16);for(var a=[4180,4428,4708,4968,5264,5592,5884,6300,6676,6988,7476,7848],l=Math.floor(t/12),c=a[t%12]/(1<<7-l),s=6.28/(r/c),f=0;f<Math.floor(r*n);f++)o[i++]=Math.floor(127*Math.sin(s*f))+128;W(o,4,i-8),W(o,24,r),W(o,40,i-44);for(var p="",d=0;d<i;d++)p+=String.fromCharCode(o[d]);return new Audio("data:audio/wav;base64,"+btoa(p))},W=function(e,n,t){e[n]=255&t,e[n+1]=t>>8&255,e[n+2]=t>>16&255,e[n+3]=t>>24&255},D=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return Object.defineProperty(n,"audio",{enumerable:!0,configurable:!0,writable:!0,value:null}),n}return(0,_.ZT)(n,e),Object.defineProperty(n.prototype,"score",{get:function(){return"string"===typeof this.$route.query.q?decodeURI(this.$route.query.q):""},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"scoreInner",{get:function(){var e="/",n=this.score.replaceAll(/(ド|レ|ミ|ファ|ソ|ラ|シ|モ|・)/g,"".concat(e,"$1")),t=n.split(e);return t.filter((function(e){return null!=e&&""!==e})).map((function(e){return{scale:e.match(/(^ド|^レ|^ミ|^ファ|^ソ|^ラ|^シ|^モ|^・)/)[0],len:(e.match(/ー/g)||[]).length+1}}))},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"play",{enumerable:!1,configurable:!0,writable:!0,value:function(){return(0,_.mG)(this,void 0,void 0,(function(){var e,n,t,r,o;return(0,_.Jh)(this,(function(u){switch(u.label){case 0:e=function(e){var t,r;return(0,_.Jh)(this,(function(o){switch(o.label){case 0:return t=.2*e.len,"・"!==e.scale?[3,2]:[4,n.wait(t)];case 1:return o.sent(),[3,4];case 2:return r=Q.find((function(n){return n.scale===e.scale})),null==r?[3,4]:[4,n.ring(r.node,t)];case 3:o.sent(),o.label=4;case 4:return[2]}}))},n=this,t=0,r=this.scoreInner,u.label=1;case 1:return t<r.length?(o=r[t],[5,e(o)]):[3,4];case 2:u.sent(),u.label=3;case 3:return t++,[3,1];case 4:return[2]}}))}))}}),Object.defineProperty(n.prototype,"ring",{enumerable:!1,configurable:!0,writable:!0,value:function(e,n){return(0,_.mG)(this,void 0,void 0,(function(){var t=this;return(0,_.Jh)(this,(function(r){return[2,new Promise((function(r){t.stop(),t.audio=U(e,n),t.audio.onended=r,t.audio.play()}))]}))}))}}),Object.defineProperty(n.prototype,"wait",{enumerable:!1,configurable:!0,writable:!0,value:function(e){return(0,_.mG)(this,void 0,void 0,(function(){return(0,_.Jh)(this,(function(n){return[2,new Promise((function(n){setTimeout(n,1e3*e)}))]}))}))}}),Object.defineProperty(n.prototype,"stop",{enumerable:!1,configurable:!0,writable:!0,value:function(){this.audio&&!this.audio.ended&&(this.audio.pause(),this.audio.currentTime=0)}}),n=(0,_.gn)([(0,P.wA)({components:{HelloWorld:k}})],n),n}(P.w3),E=D,F=E,R=(0,f.Z)(F,B,G,!1,null,"778d20ee",null),z=R.exports;r.ZP.use(b.ZP);var K=[{path:"/",component:A},{path:"/melody",component:z}],L=new b.ZP({mode:"hash",base:"/medium/",parseQuery:v().parse,stringifyQuery:function(e){return"?".concat(v().stringify(e))},routes:K}),N=L,V=t(154);r.ZP.use(V.Z);var X=new V.Z({});r.ZP.config.productionTip=!1,new r.ZP({router:N,vuetify:X,render:function(e){return e(d)}}).$mount("#app")},4654:function(){}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var u=n[r]={exports:{}};return e[r](u,u.exports,t),u.exports}t.m=e,function(){var e=[];t.O=function(n,r,o,u){if(!r){var i=1/0;for(s=0;s<e.length;s++){r=e[s][0],o=e[s][1],u=e[s][2];for(var a=!0,l=0;l<r.length;l++)(!1&u||i>=u)&&Object.keys(t.O).every((function(e){return t.O[e](r[l])}))?r.splice(l--,1):(a=!1,u<i&&(i=u));if(a){e.splice(s--,1);var c=o();void 0!==c&&(n=c)}}return n}u=u||0;for(var s=e.length;s>0&&e[s-1][2]>u;s--)e[s]=e[s-1];e[s]=[r,o,u]}}(),function(){t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,{a:n}),n}}(),function(){t.d=function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};t.O.j=function(n){return 0===e[n]};var n=function(n,r){var o,u,i=r[0],a=r[1],l=r[2],c=0;if(i.some((function(n){return 0!==e[n]}))){for(o in a)t.o(a,o)&&(t.m[o]=a[o]);if(l)var s=l(t)}for(n&&n(r);c<i.length;c++)u=i[c],t.o(e,u)&&e[u]&&e[u][0](),e[u]=0;return t.O(s)},r=self["webpackChunkproject"]=self["webpackChunkproject"]||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))}();var r=t.O(void 0,[998],(function(){return t(4193)}));r=t.O(r)})();
//# sourceMappingURL=app.0e73a9ec.js.map