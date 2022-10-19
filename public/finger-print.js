/**
 * FingerprintJS v3.3.6 - Copyright (c) FingerprintJS, Inc, 2022 (https://fingerprint.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * This software contains code from open-source projects:
 * MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).FingerprintJS={})}(this,(function(e){"use strict";var n=function(){return n=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e},n.apply(this,arguments)};function t(e,n,t,r){return new(t||(t=Promise))((function(o,i){function a(e){try{u(r.next(e))}catch(n){i(n)}}function c(e){try{u(r.throw(e))}catch(n){i(n)}}function u(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,c)}u((r=r.apply(e,n||[])).next())}))}function r(e,n){var t,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=n.call(e,a)}catch(c){i=[6,c],r=0}finally{t=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}function o(){for(var e=0,n=0,t=arguments.length;n<t;n++)e+=arguments[n].length;var r=Array(e),o=0;for(n=0;n<t;n++)for(var i=arguments[n],a=0,c=i.length;a<c;a++,o++)r[o]=i[a];return r}function i(e,n){return new Promise((function(t){return setTimeout(t,e,n)}))}function a(e){return e&&"function"==typeof e.then}function c(e,n){try{var t=e();a(t)?t.then((function(e){return n(!0,e)}),(function(e){return n(!1,e)})):n(!0,t)}catch(r){n(!1,r)}}function u(e,n,o){return void 0===o&&(o=16),t(this,void 0,void 0,(function(){var t,a,c;return r(this,(function(r){switch(r.label){case 0:t=Date.now(),a=0,r.label=1;case 1:return a<e.length?(n(e[a],a),(c=Date.now())>=t+o?(t=c,[4,i(0)]):[3,3]):[3,4];case 2:r.sent(),r.label=3;case 3:return++a,[3,1];case 4:return[2]}}))}))}function l(e){e.then(void 0,(function(){}))}function s(e,n){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],n=[n[0]>>>16,65535&n[0],n[1]>>>16,65535&n[1]];var t=[0,0,0,0];return t[3]+=e[3]+n[3],t[2]+=t[3]>>>16,t[3]&=65535,t[2]+=e[2]+n[2],t[1]+=t[2]>>>16,t[2]&=65535,t[1]+=e[1]+n[1],t[0]+=t[1]>>>16,t[1]&=65535,t[0]+=e[0]+n[0],t[0]&=65535,[t[0]<<16|t[1],t[2]<<16|t[3]]}function d(e,n){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],n=[n[0]>>>16,65535&n[0],n[1]>>>16,65535&n[1]];var t=[0,0,0,0];return t[3]+=e[3]*n[3],t[2]+=t[3]>>>16,t[3]&=65535,t[2]+=e[2]*n[3],t[1]+=t[2]>>>16,t[2]&=65535,t[2]+=e[3]*n[2],t[1]+=t[2]>>>16,t[2]&=65535,t[1]+=e[1]*n[3],t[0]+=t[1]>>>16,t[1]&=65535,t[1]+=e[2]*n[2],t[0]+=t[1]>>>16,t[1]&=65535,t[1]+=e[3]*n[1],t[0]+=t[1]>>>16,t[1]&=65535,t[0]+=e[0]*n[3]+e[1]*n[2]+e[2]*n[1]+e[3]*n[0],t[0]&=65535,[t[0]<<16|t[1],t[2]<<16|t[3]]}function m(e,n){return 32===(n%=64)?[e[1],e[0]]:n<32?[e[0]<<n|e[1]>>>32-n,e[1]<<n|e[0]>>>32-n]:(n-=32,[e[1]<<n|e[0]>>>32-n,e[0]<<n|e[1]>>>32-n])}function f(e,n){return 0===(n%=64)?e:n<32?[e[0]<<n|e[1]>>>32-n,e[1]<<n]:[e[1]<<n-32,0]}function h(e,n){return[e[0]^n[0],e[1]^n[1]]}function v(e){return e=h(e,[0,e[0]>>>1]),e=h(e=d(e,[4283543511,3981806797]),[0,e[0]>>>1]),e=h(e=d(e,[3301882366,444984403]),[0,e[0]>>>1])}function b(e,n){n=n||0;var t,r=(e=e||"").length%16,o=e.length-r,i=[0,n],a=[0,n],c=[0,0],u=[0,0],l=[2277735313,289559509],b=[1291169091,658871167];for(t=0;t<o;t+=16)c=[255&e.charCodeAt(t+4)|(255&e.charCodeAt(t+5))<<8|(255&e.charCodeAt(t+6))<<16|(255&e.charCodeAt(t+7))<<24,255&e.charCodeAt(t)|(255&e.charCodeAt(t+1))<<8|(255&e.charCodeAt(t+2))<<16|(255&e.charCodeAt(t+3))<<24],u=[255&e.charCodeAt(t+12)|(255&e.charCodeAt(t+13))<<8|(255&e.charCodeAt(t+14))<<16|(255&e.charCodeAt(t+15))<<24,255&e.charCodeAt(t+8)|(255&e.charCodeAt(t+9))<<8|(255&e.charCodeAt(t+10))<<16|(255&e.charCodeAt(t+11))<<24],c=m(c=d(c,l),31),i=s(i=m(i=h(i,c=d(c,b)),27),a),i=s(d(i,[0,5]),[0,1390208809]),u=m(u=d(u,b),33),a=s(a=m(a=h(a,u=d(u,l)),31),i),a=s(d(a,[0,5]),[0,944331445]);switch(c=[0,0],u=[0,0],r){case 15:u=h(u,f([0,e.charCodeAt(t+14)],48));case 14:u=h(u,f([0,e.charCodeAt(t+13)],40));case 13:u=h(u,f([0,e.charCodeAt(t+12)],32));case 12:u=h(u,f([0,e.charCodeAt(t+11)],24));case 11:u=h(u,f([0,e.charCodeAt(t+10)],16));case 10:u=h(u,f([0,e.charCodeAt(t+9)],8));case 9:u=d(u=h(u,[0,e.charCodeAt(t+8)]),b),a=h(a,u=d(u=m(u,33),l));case 8:c=h(c,f([0,e.charCodeAt(t+7)],56));case 7:c=h(c,f([0,e.charCodeAt(t+6)],48));case 6:c=h(c,f([0,e.charCodeAt(t+5)],40));case 5:c=h(c,f([0,e.charCodeAt(t+4)],32));case 4:c=h(c,f([0,e.charCodeAt(t+3)],24));case 3:c=h(c,f([0,e.charCodeAt(t+2)],16));case 2:c=h(c,f([0,e.charCodeAt(t+1)],8));case 1:c=d(c=h(c,[0,e.charCodeAt(t)]),l),i=h(i,c=d(c=m(c,31),b))}return i=s(i=h(i,[0,e.length]),a=h(a,[0,e.length])),a=s(a,i),i=s(i=v(i),a=v(a)),a=s(a,i),("00000000"+(i[0]>>>0).toString(16)).slice(-8)+("00000000"+(i[1]>>>0).toString(16)).slice(-8)+("00000000"+(a[0]>>>0).toString(16)).slice(-8)+("00000000"+(a[1]>>>0).toString(16)).slice(-8)}function p(e){return parseInt(e)}function y(e){return parseFloat(e)}function g(e,n){return"number"==typeof e&&isNaN(e)?n:e}function w(e){return e.reduce((function(e,n){return e+(n?1:0)}),0)}function L(e,n){if(void 0===n&&(n=1),Math.abs(n)>=1)return Math.round(e/n)*n;var t=1/n;return Math.round(e*t)/t}function k(e){return e&&"object"==typeof e&&"message"in e?e:{message:e}}function V(e){return"function"!=typeof e}function Z(e,n,o){var a=Object.keys(e).filter((function(e){return!function(e,n){for(var t=0,r=e.length;t<r;++t)if(e[t]===n)return!0;return!1}(o,e)})),s=Array(a.length);return u(a,(function(t,r){s[r]=function(e,n){var t=new Promise((function(t){var r=Date.now();c(e.bind(null,n),(function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var o=Date.now()-r;if(!e[0])return t((function(){return{error:k(e[1]),duration:o}}));var i=e[1];if(V(i))return t((function(){return{value:i,duration:o}}));t((function(){return new Promise((function(e){var n=Date.now();c(i,(function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];var i=o+Date.now()-n;if(!t[0])return e({error:k(t[1]),duration:i});e({value:t[1],duration:i})}))}))}))}))}));return l(t),function(){return t.then((function(e){return e()}))}}(e[t],n)})),function(){return t(this,void 0,void 0,(function(){var e,n,t,o,c,d;return r(this,(function(m){switch(m.label){case 0:for(e={},n=0,t=a;n<t.length;n++)o=t[n],e[o]=void 0;c=Array(a.length),d=function(){var n;return r(this,(function(t){switch(t.label){case 0:return n=!0,[4,u(a,(function(t,r){if(!c[r])if(s[r]){var o=s[r]().then((function(n){return e[t]=n}));l(o),c[r]=o}else n=!1}))];case 1:return t.sent(),n?[2,"break"]:[4,i(1)];case 2:return t.sent(),[2]}}))},m.label=1;case 1:return[5,d()];case 2:if("break"===m.sent())return[3,4];m.label=3;case 3:return[3,1];case 4:return[4,Promise.all(c)];case 5:return m.sent(),[2,e]}}))}))}}function W(){var e=window,n=navigator;return w(["MSCSSMatrix"in e,"msSetImmediate"in e,"msIndexedDB"in e,"msMaxTouchPoints"in n,"msPointerEnabled"in n])>=4}function S(){var e=window,n=navigator;return w(["msWriteProfilerMark"in e,"MSStream"in e,"msLaunchUri"in n,"msSaveBlob"in n])>=3&&!W()}function X(){var e=window,n=navigator;return w(["webkitPersistentStorage"in n,"webkitTemporaryStorage"in n,0===n.vendor.indexOf("Google"),"webkitResolveLocalFileSystemURL"in e,"BatteryManager"in e,"webkitMediaStream"in e,"webkitSpeechGrammar"in e])>=5}function F(){var e=window,n=navigator;return w(["ApplePayError"in e,"CSSPrimitiveValue"in e,"Counter"in e,0===n.vendor.indexOf("Apple"),"getStorageUpdates"in n,"WebKitMediaKeys"in e])>=4}function Y(){var e=window;return w(["safari"in e,!("DeviceMotionEvent"in e),!("ongestureend"in e),!("standalone"in navigator)])>=3}function x(){var e,n,t=window;return w(["buildID"in navigator,"MozAppearance"in(null!==(n=null===(e=document.documentElement)||void 0===e?void 0:e.style)&&void 0!==n?n:{}),"onmozfullscreenchange"in t,"mozInnerScreenX"in t,"CSSMozDocumentRule"in t,"CanvasCaptureMediaStream"in t])>=4}function C(){var e=document;return e.fullscreenElement||e.msFullscreenElement||e.mozFullScreenElement||e.webkitFullscreenElement||null}function G(){var e=X(),n=x();if(!e&&!n)return!1;var t=window;return w(["onorientationchange"in t,"orientation"in t,e&&!("SharedWorker"in t),n&&/android/i.test(navigator.appVersion)])>=2}function M(e){var n=new Error(e);return n.name=e,n}function R(e,n,o){var a,c,u;return void 0===o&&(o=50),t(this,void 0,void 0,(function(){var t,l;return r(this,(function(r){switch(r.label){case 0:t=document,r.label=1;case 1:return t.body?[3,3]:[4,i(o)];case 2:return r.sent(),[3,1];case 3:l=t.createElement("iframe"),r.label=4;case 4:return r.trys.push([4,,10,11]),[4,new Promise((function(e,r){var o=!1,i=function(){o=!0,e()};l.onload=i,l.onerror=function(e){o=!0,r(e)};var a=l.style;a.setProperty("display","block","important"),a.position="absolute",a.top="0",a.left="0",a.visibility="hidden",n&&"srcdoc"in l?l.srcdoc=n:l.src="about:blank",t.body.appendChild(l);var c=function(){var e,n;o||("complete"===(null===(n=null===(e=l.contentWindow)||void 0===e?void 0:e.document)||void 0===n?void 0:n.readyState)?i():setTimeout(c,10))};c()}))];case 5:r.sent(),r.label=6;case 6:return(null===(c=null===(a=l.contentWindow)||void 0===a?void 0:a.document)||void 0===c?void 0:c.body)?[3,8]:[4,i(o)];case 7:return r.sent(),[3,6];case 8:return[4,e(l,l.contentWindow)];case 9:return[2,r.sent()];case 10:return null===(u=l.parentNode)||void 0===u||u.removeChild(l),[7];case 11:return[2]}}))}))}function j(e){for(var n=function(e){for(var n,t,r="Unexpected syntax '"+e+"'",o=/^\s*([a-z-]*)(.*)$/i.exec(e),i=o[1]||void 0,a={},c=/([.:#][\w-]+|\[.+?\])/gi,u=function(e,n){a[e]=a[e]||[],a[e].push(n)};;){var l=c.exec(o[2]);if(!l)break;var s=l[0];switch(s[0]){case".":u("class",s.slice(1));break;case"#":u("id",s.slice(1));break;case"[":var d=/^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(s);if(!d)throw new Error(r);u(d[1],null!==(t=null!==(n=d[4])&&void 0!==n?n:d[5])&&void 0!==t?t:"");break;default:throw new Error(r)}}return[i,a]}(e),t=n[0],r=n[1],o=document.createElement(null!=t?t:"div"),i=0,a=Object.keys(r);i<a.length;i++){var c=a[i],u=r[c].join(" ");"style"===c?I(o.style,u):o.setAttribute(c,u)}return o}function I(e,n){for(var t=0,r=n.split(";");t<r.length;t++){var o=r[t],i=/^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(o);if(i){var a=i[1],c=i[2],u=i[4];e.setProperty(a,c,u||"")}}}var A=["monospace","sans-serif","serif"],J=["sans-serif-thin","ARNO PRO","Agency FB","Arabic Typesetting","Arial Unicode MS","AvantGarde Bk BT","BankGothic Md BT","Batang","Bitstream Vera Sans Mono","Calibri","Century","Century Gothic","Clarendon","EUROSTILE","Franklin Gothic","Futura Bk BT","Futura Md BT","GOTHAM","Gill Sans","HELV","Haettenschweiler","Helvetica Neue","Humanst521 BT","Leelawadee","Letter Gothic","Levenim MT","Lucida Bright","Lucida Sans","Menlo","MS Mincho","MS Outlook","MS Reference Specialty","MS UI Gothic","MT Extra","MYRIAD PRO","Marlett","Meiryo UI","Microsoft Uighur","Minion Pro","Monotype Corsiva","PMingLiU","Pristina","SCRIPTINA","Segoe UI Light","Serifa","SimHei","Small Fonts","Staccato222 BT","TRAJAN PRO","Univers CE 55 Medium","Vrinda","ZWAdobeF"];function H(e){return e.toDataURL()}var P,N;function z(){var e=this;return function(){if(void 0===N){var e=function(){var n=D();T(n)?N=setTimeout(e,2500):(P=n,N=void 0)};e()}}(),function(){return t(e,void 0,void 0,(function(){var e;return r(this,(function(n){switch(n.label){case 0:return T(e=D())?P?[2,o(P)]:C()?[4,(t=document,(t.exitFullscreen||t.msExitFullscreen||t.mozCancelFullScreen||t.webkitExitFullscreen).call(t))]:[3,2]:[3,2];case 1:n.sent(),e=D(),n.label=2;case 2:return T(e)||(P=e),[2,e]}var t}))}))}}function D(){var e=screen;return[g(y(e.availTop),null),g(y(e.width)-y(e.availWidth)-g(y(e.availLeft),0),null),g(y(e.height)-y(e.availHeight)-g(y(e.availTop),0),null),g(y(e.availLeft),null)]}function T(e){for(var n=0;n<4;++n)if(e[n])return!1;return!0}function B(e){var n;return t(this,void 0,void 0,(function(){var t,o,a,c,u,l,s;return r(this,(function(r){switch(r.label){case 0:for(t=document,o=t.createElement("div"),a=new Array(e.length),c={},E(o),s=0;s<e.length;++s)u=j(e[s]),E(l=t.createElement("div")),l.appendChild(u),o.appendChild(l),a[s]=u;r.label=1;case 1:return t.body?[3,3]:[4,i(50)];case 2:return r.sent(),[3,1];case 3:t.body.appendChild(o);try{for(s=0;s<e.length;++s)a[s].offsetParent||(c[e[s]]=!0)}finally{null===(n=o.parentNode)||void 0===n||n.removeChild(o)}return[2,c]}}))}))}function E(e){e.style.setProperty("display","block","important")}function O(e){return matchMedia("(inverted-colors: "+e+")").matches}function Q(e){return matchMedia("(forced-colors: "+e+")").matches}function _(e){return matchMedia("(prefers-contrast: "+e+")").matches}function U(e){return matchMedia("(prefers-reduced-motion: "+e+")").matches}function K(e){return matchMedia("(dynamic-range: "+e+")").matches}var q=Math,$=function(){return 0};var ee={default:[],apple:[{font:"-apple-system-body"}],serif:[{fontFamily:"serif"}],sans:[{fontFamily:"sans-serif"}],mono:[{fontFamily:"monospace"}],min:[{fontSize:"1px"}],system:[{fontFamily:"system-ui"}]};var ne={fonts:function(){return R((function(e,n){var t=n.document,r=t.body;r.style.fontSize="48px";var o=t.createElement("div"),i={},a={},c=function(e){var n=t.createElement("span"),r=n.style;return r.position="absolute",r.top="0",r.left="0",r.fontFamily=e,n.textContent="mmMwWLliI0O&1",o.appendChild(n),n},u=A.map(c),l=function(){for(var e={},n=function(n){e[n]=A.map((function(e){return function(e,n){return c("'"+e+"',"+n)}(n,e)}))},t=0,r=J;t<r.length;t++){n(r[t])}return e}();r.appendChild(o);for(var s=0;s<A.length;s++)i[A[s]]=u[s].offsetWidth,a[A[s]]=u[s].offsetHeight;return J.filter((function(e){return n=l[e],A.some((function(e,t){return n[t].offsetWidth!==i[e]||n[t].offsetHeight!==a[e]}));var n}))}))},domBlockers:function(e){var n=(void 0===e?{}:e).debug;return t(this,void 0,void 0,(function(){var e,t,o,i,a;return r(this,(function(r){switch(r.label){case 0:return F()||G()?(c=atob,e={abpIndo:["#Iklan-Melayang","#Kolom-Iklan-728","#SidebarIklan-wrapper",c("YVt0aXRsZT0iN25hZ2EgcG9rZXIiIGld"),'[title="ALIENBOLA" i]'],abpvn:["#quangcaomb",c("Lmlvc0Fkc2lvc0Fkcy1sYXlvdXQ="),".quangcao",c("W2hyZWZePSJodHRwczovL3I4OC52bi8iXQ=="),c("W2hyZWZePSJodHRwczovL3piZXQudm4vIl0=")],adBlockFinland:[".mainostila",c("LnNwb25zb3JpdA=="),".ylamainos",c("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"),c("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd")],adBlockPersian:["#navbar_notice_50",".kadr",'TABLE[width="140px"]',"#divAgahi",c("I2FkMl9pbmxpbmU=")],adBlockWarningRemoval:["#adblock-honeypot",".adblocker-root",".wp_adblock_detect",c("LmhlYWRlci1ibG9ja2VkLWFk"),c("I2FkX2Jsb2NrZXI=")],adGuardAnnoyances:['amp-embed[type="zen"]',".hs-sosyal","#cookieconsentdiv",'div[class^="app_gdpr"]',".as-oil"],adGuardBase:[".BetterJsPopOverlay",c("I2FkXzMwMFgyNTA="),c("I2Jhbm5lcmZsb2F0MjI="),c("I2FkLWJhbm5lcg=="),c("I2NhbXBhaWduLWJhbm5lcg==")],adGuardChinese:[c("LlppX2FkX2FfSA=="),c("YVtocmVmKj0iL29kMDA1LmNvbSJd"),c("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"),".qq_nr_lad","#widget-quan"],adGuardFrench:[c("I2Jsb2NrLXZpZXdzLWFkcy1zaWRlYmFyLWJsb2NrLWJsb2Nr"),"#pavePub",c("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"),".mobile_adhesion",".widgetadv"],adGuardGerman:[c("LmJhbm5lcml0ZW13ZXJidW5nX2hlYWRfMQ=="),c("LmJveHN0YXJ0d2VyYnVuZw=="),c("LndlcmJ1bmcz"),c("YVtocmVmXj0iaHR0cDovL3d3dy5laXMuZGUvaW5kZXgucGh0bWw/cmVmaWQ9Il0="),c("YVtocmVmXj0iaHR0cHM6Ly93d3cudGlwaWNvLmNvbS8/YWZmaWxpYXRlSWQ9Il0=")],adGuardJapanese:["#kauli_yad_1",c("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="),c("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="),c("LmFkZ29vZ2xl"),c("LmFkX3JlZ3VsYXIz")],adGuardMobile:[c("YW1wLWF1dG8tYWRz"),c("LmFtcF9hZA=="),'amp-embed[type="24smi"]',"#mgid_iframe1",c("I2FkX2ludmlld19hcmVh")],adGuardRussian:[c("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="),c("LnJlY2xhbWE="),'div[id^="smi2adblock"]',c("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"),c("I2FkX3NxdWFyZQ==")],adGuardSocial:[c("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="),c("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="),".etsy-tweet","#inlineShare",".popup-social"],adGuardSpanishPortuguese:["#barraPublicidade","#Publicidade","#publiEspecial","#queTooltip",c("W2hyZWZePSJodHRwOi8vYWRzLmdsaXNwYS5jb20vIl0=")],adGuardTrackingProtection:["#qoo-counter",c("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="),c("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="),c("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="),"#top100counter"],adGuardTurkish:["#backkapat",c("I3Jla2xhbWk="),c("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="),c("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"),c("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ==")],bulgarian:[c("dGQjZnJlZW5ldF90YWJsZV9hZHM="),"#ea_intext_div",".lapni-pop-over","#xenium_hot_offers",c("I25ld0Fk")],easyList:[c("I0FEX0NPTlRST0xfMjg="),c("LnNlY29uZC1wb3N0LWFkcy13cmFwcGVy"),".universalboxADVBOX03",c("LmFkdmVydGlzZW1lbnQtNzI4eDkw"),c("LnNxdWFyZV9hZHM=")],easyListChina:[c("YVtocmVmKj0iLndlbnNpeHVldGFuZy5jb20vIl0="),c("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="),c("LmZyb250cGFnZUFkdk0="),"#taotaole","#aafoot.top_box"],easyListCookie:["#AdaCompliance.app-notice",".text-center.rgpd",".panel--cookie",".js-cookies-andromeda",".elxtr-consent"],easyListCzechSlovak:["#onlajny-stickers",c("I3Jla2xhbW5pLWJveA=="),c("LnJla2xhbWEtbWVnYWJvYXJk"),".sklik",c("W2lkXj0ic2tsaWtSZWtsYW1hIl0=")],easyListDutch:[c("I2FkdmVydGVudGll"),c("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="),".adstekst",c("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="),"#semilo-lrectangle"],easyListGermany:[c("I0FkX1dpbjJkYXk="),c("I3dlcmJ1bmdzYm94MzAw"),c("YVtocmVmXj0iaHR0cDovL3d3dy5yb3RsaWNodGthcnRlaS5jb20vP3NjPSJd"),c("I3dlcmJ1bmdfd2lkZXNreXNjcmFwZXJfc2NyZWVu"),c("YVtocmVmXj0iaHR0cDovL2xhbmRpbmcucGFya3BsYXR6a2FydGVpLmNvbS8/YWc9Il0=")],easyListItaly:[c("LmJveF9hZHZfYW5udW5jaQ=="),".sb-box-pubbliredazionale",c("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"),c("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"),c("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ==")],easyListLithuania:[c("LnJla2xhbW9zX3RhcnBhcw=="),c("LnJla2xhbW9zX251b3JvZG9z"),c("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"),c("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"),c("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd")],estonian:[c("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],fanboyAnnoyances:["#feedback-tab","#taboola-below-article",".feedburnerFeedBlock",".widget-feedburner-counter",'[title="Subscribe to our blog"]'],fanboyAntiFacebook:[".util-bar-module-firefly-visible"],fanboyEnhancedTrackers:[".open.pushModal","#issuem-leaky-paywall-articles-zero-remaining-nag","#sovrn_container",'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',".BlockNag__Card"],fanboySocial:[".td-tags-and-social-wrapper-box",".twitterContainer",".youtube-social",'a[title^="Like us on Facebook"]','img[alt^="Share on Digg"]'],frellwitSwedish:[c("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="),c("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="),"article.category-samarbete",c("ZGl2LmhvbGlkQWRz"),"ul.adsmodern"],greekAdBlock:[c("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"),c("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="),c("QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd"),"DIV.agores300","TABLE.advright"],hungarian:["#cemp_doboz",".optimonk-iframe-container",c("LmFkX19tYWlu"),c("W2NsYXNzKj0iR29vZ2xlQWRzIl0="),"#hirdetesek_box"],iDontCareAboutCookies:['.alert-info[data-block-track*="CookieNotice"]',".ModuleTemplateCookieIndicator",".o--cookies--container",".cookie-msg-info-container","#cookies-policy-sticky"],icelandicAbp:[c("QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==")],latvian:[c("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0="),c("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==")],listKr:[c("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="),c("I2xpdmVyZUFkV3JhcHBlcg=="),c("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="),c("aW5zLmZhc3R2aWV3LWFk"),".revenue_unit_item.dable"],listeAr:[c("LmdlbWluaUxCMUFk"),".right-and-left-sponsers",c("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="),c("YVtocmVmKj0iYm9vcmFxLm9yZyJd"),c("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd")],listeFr:[c("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="),c("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="),c("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="),".site-pub-interstitiel",'div[id^="crt-"][data-criteo-id]'],officialPolish:["#ceneo-placeholder-ceneo-12",c("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"),c("YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=="),c("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="),c("ZGl2I3NrYXBpZWNfYWQ=")],ro:[c("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"),'a[href^="/magazin/"]',c("YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd"),c("YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0="),c("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd")],ruAd:[c("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"),c("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="),c("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="),"#pgeldiz",".yandex-rtb-block"],thaiAds:["a[href*=macau-uta-popup]",c("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="),c("LmFkczMwMHM="),".bumq",".img-kosana"],webAnnoyancesUltralist:["#mod-social-share-2","#social-tools",c("LmN0cGwtZnVsbGJhbm5lcg=="),".zergnet-recommend",".yt.btn-link.btn-md.btn"]},t=Object.keys(e),[4,B((a=[]).concat.apply(a,t.map((function(n){return e[n]}))))]):[2,void 0];case 1:return o=r.sent(),n&&function(e,n){for(var t="DOM blockers debug:\n```",r=0,o=Object.keys(e);r<o.length;r++){var i=o[r];t+="\n"+i+":";for(var a=0,c=e[i];a<c.length;a++){var u=c[a];t+="\n  "+(n[u]?"🚫":"➡️")+" "+u}}console.log(t+"\n```")}(e,o),(i=t.filter((function(n){var t=e[n];return w(t.map((function(e){return o[e]})))>.6*t.length}))).sort(),[2,i]}var c}))}))},fontPreferences:function(){return function(e,n){void 0===n&&(n=4e3);return R((function(t,r){var i=r.document,a=i.body,c=a.style;c.width=n+"px",c.webkitTextSizeAdjust=c.textSizeAdjust="none",X()?a.style.zoom=""+1/r.devicePixelRatio:F()&&(a.style.zoom="reset");var u=i.createElement("div");return u.textContent=o(Array(n/20<<0)).map((function(){return"word"})).join(" "),a.appendChild(u),e(i,a)}),'<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">')}((function(e,n){for(var t={},r={},o=0,i=Object.keys(ee);o<i.length;o++){var a=i[o],c=ee[a],u=c[0],l=void 0===u?{}:u,s=c[1],d=void 0===s?"mmMwWLliI0fiflO&1":s,m=e.createElement("span");m.textContent=d,m.style.whiteSpace="nowrap";for(var f=0,h=Object.keys(l);f<h.length;f++){var v=h[f],b=l[v];void 0!==b&&(m.style[v]=b)}t[a]=m,n.appendChild(e.createElement("br")),n.appendChild(m)}for(var p=0,y=Object.keys(ee);p<y.length;p++){r[a=y[p]]=t[a].getBoundingClientRect().width}return r}))},audio:function(){var e=window,n=e.OfflineAudioContext||e.webkitOfflineAudioContext;if(!n)return-2;if(F()&&!Y()&&!function(){var e=window;return w(["DOMRectList"in e,"RTCPeerConnectionIceEvent"in e,"SVGGeometryElement"in e,"ontransitioncancel"in e])>=3}())return-1;var t=new n(1,5e3,44100),r=t.createOscillator();r.type="triangle",r.frequency.value=1e4;var o=t.createDynamicsCompressor();o.threshold.value=-50,o.knee.value=40,o.ratio.value=12,o.attack.value=0,o.release.value=.25,r.connect(o),o.connect(t.destination),r.start(0);var i=function(e){var n=3,t=500,r=500,o=5e3,i=function(){};return[new Promise((function(a,c){var u=!1,l=0,s=0;e.oncomplete=function(e){return a(e.renderedBuffer)};var d=function(){setTimeout((function(){return c(M("timeout"))}),Math.min(r,s+o-Date.now()))},m=function(){try{switch(e.startRendering(),e.state){case"running":s=Date.now(),u&&d();break;case"suspended":document.hidden||l++,u&&l>=n?c(M("suspended")):setTimeout(m,t)}}catch(r){c(r)}};m(),i=function(){u||(u=!0,s>0&&d())}})),i]}(t),a=i[0],c=i[1],u=a.then((function(e){return function(e){for(var n=0,t=0;t<e.length;++t)n+=Math.abs(e[t]);return n}(e.getChannelData(0).subarray(4500))}),(function(e){if("timeout"===e.name||"suspended"===e.name)return-3;throw e}));return l(u),function(){return c(),u}},screenFrame:function(){var e=this,n=z();return function(){return t(e,void 0,void 0,(function(){var e,t;return r(this,(function(r){switch(r.label){case 0:return[4,n()];case 1:return e=r.sent(),[2,[(t=function(e){return null===e?null:L(e,10)})(e[0]),t(e[1]),t(e[2]),t(e[3])]]}}))}))}},osCpu:function(){return navigator.oscpu},languages:function(){var e,n=navigator,t=[],r=n.language||n.userLanguage||n.browserLanguage||n.systemLanguage;if(void 0!==r&&t.push([r]),Array.isArray(n.languages))X()&&w([!("MediaSettingsRange"in(e=window)),"RTCEncodedAudioFrame"in e,""+e.Intl=="[object Intl]",""+e.Reflect=="[object Reflect]"])>=3||t.push(n.languages);else if("string"==typeof n.languages){var o=n.languages;o&&t.push(o.split(","))}return t},colorDepth:function(){return window.screen.colorDepth},deviceMemory:function(){return g(y(navigator.deviceMemory),void 0)},screenResolution:function(){var e=screen,n=function(e){return g(p(e),null)},t=[n(e.width),n(e.height)];return t.sort().reverse(),t},hardwareConcurrency:function(){return g(p(navigator.hardwareConcurrency),void 0)},timezone:function(){var e,n=null===(e=window.Intl)||void 0===e?void 0:e.DateTimeFormat;if(n){var t=(new n).resolvedOptions().timeZone;if(t)return t}var r,o=(r=(new Date).getFullYear(),-Math.max(y(new Date(r,0,1).getTimezoneOffset()),y(new Date(r,6,1).getTimezoneOffset())));return"UTC"+(o>=0?"+":"")+Math.abs(o)},sessionStorage:function(){try{return!!window.sessionStorage}catch(e){return!0}},localStorage:function(){try{return!!window.localStorage}catch(e){return!0}},indexedDB:function(){if(!W()&&!S())try{return!!window.indexedDB}catch(e){return!0}},openDatabase:function(){return!!window.openDatabase},cpuClass:function(){return navigator.cpuClass},platform:function(){var e=navigator.platform;return"MacIntel"===e&&F()&&!Y()?function(){if("iPad"===navigator.platform)return!0;var e=screen,n=e.width/e.height;return w(["MediaSource"in window,!!Element.prototype.webkitRequestFullscreen,n>.65&&n<1.53])>=2}()?"iPad":"iPhone":e},plugins:function(){var e=navigator.plugins;if(e){for(var n=[],t=0;t<e.length;++t){var r=e[t];if(r){for(var o=[],i=0;i<r.length;++i){var a=r[i];o.push({type:a.type,suffixes:a.suffixes})}n.push({name:r.name,description:r.description,mimeTypes:o})}}return n}},canvas:function(){var e,n,t=!1,r=function(){var e=document.createElement("canvas");return e.width=1,e.height=1,[e,e.getContext("2d")]}(),o=r[0],i=r[1];if(function(e,n){return!(!n||!e.toDataURL)}(o,i)){t=function(e){return e.rect(0,0,10,10),e.rect(2,2,6,6),!e.isPointInPath(5,5,"evenodd")}(i),function(e,n){e.width=240,e.height=60,n.textBaseline="alphabetic",n.fillStyle="#f60",n.fillRect(100,1,62,20),n.fillStyle="#069",n.font='11pt "Times New Roman"';var t="Cwm fjordbank gly "+String.fromCharCode(55357,56835);n.fillText(t,2,15),n.fillStyle="rgba(102, 204, 0, 0.2)",n.font="18pt Arial",n.fillText(t,4,45)}(o,i);var a=H(o);a!==H(o)?e=n="unstable":(n=a,function(e,n){e.width=122,e.height=110,n.globalCompositeOperation="multiply";for(var t=0,r=[["#f2f",40,40],["#2ff",80,40],["#ff2",60,80]];t<r.length;t++){var o=r[t],i=o[0],a=o[1],c=o[2];n.fillStyle=i,n.beginPath(),n.arc(a,c,40,0,2*Math.PI,!0),n.closePath(),n.fill()}n.fillStyle="#f9c",n.arc(60,60,60,0,2*Math.PI,!0),n.arc(60,60,20,0,2*Math.PI,!0),n.fill("evenodd")}(o,i),e=H(o))}else e=n="";return{winding:t,geometry:e,text:n}},touchSupport:function(){var e,n=navigator,t=0;void 0!==n.maxTouchPoints?t=p(n.maxTouchPoints):void 0!==n.msMaxTouchPoints&&(t=n.msMaxTouchPoints);try{document.createEvent("TouchEvent"),e=!0}catch(r){e=!1}return{maxTouchPoints:t,touchEvent:e,touchStart:"ontouchstart"in window}},vendor:function(){return navigator.vendor||""},vendorFlavors:function(){for(var e=[],n=0,t=["chrome","safari","__crWeb","__gCrWeb","yandex","__yb","__ybro","__firefox__","__edgeTrackingPreventionStatistics","webkit","oprt","samsungAr","ucweb","UCShellJava","puffinDevice"];n<t.length;n++){var r=t[n],o=window[r];o&&"object"==typeof o&&e.push(r)}return e.sort()},cookiesEnabled:function(){var e=document;try{e.cookie="cookietest=1; SameSite=Strict;";var n=-1!==e.cookie.indexOf("cookietest=");return e.cookie="cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT",n}catch(t){return!1}},colorGamut:function(){for(var e=0,n=["rec2020","p3","srgb"];e<n.length;e++){var t=n[e];if(matchMedia("(color-gamut: "+t+")").matches)return t}},invertedColors:function(){return!!O("inverted")||!O("none")&&void 0},forcedColors:function(){return!!Q("active")||!Q("none")&&void 0},monochrome:function(){if(matchMedia("(min-monochrome: 0)").matches){for(var e=0;e<=100;++e)if(matchMedia("(max-monochrome: "+e+")").matches)return e;throw new Error("Too high value")}},contrast:function(){return _("no-preference")?0:_("high")||_("more")?1:_("low")||_("less")?-1:_("forced")?10:void 0},reducedMotion:function(){return!!U("reduce")||!U("no-preference")&&void 0},hdr:function(){return!!K("high")||!K("standard")&&void 0},math:function(){var e,n=q.acos||$,t=q.acosh||$,r=q.asin||$,o=q.asinh||$,i=q.atanh||$,a=q.atan||$,c=q.sin||$,u=q.sinh||$,l=q.cos||$,s=q.cosh||$,d=q.tan||$,m=q.tanh||$,f=q.exp||$,h=q.expm1||$,v=q.log1p||$;return{acos:n(.12312423423423424),acosh:t(1e308),acoshPf:(e=1e154,q.log(e+q.sqrt(e*e-1))),asin:r(.12312423423423424),asinh:o(1),asinhPf:function(e){return q.log(e+q.sqrt(e*e+1))}(1),atanh:i(.5),atanhPf:function(e){return q.log((1+e)/(1-e))/2}(.5),atan:a(.5),sin:c(-1e300),sinh:u(1),sinhPf:function(e){return q.exp(e)-1/q.exp(e)/2}(1),cos:l(10.000000000123),cosh:s(1),coshPf:function(e){return(q.exp(e)+1/q.exp(e))/2}(1),tan:d(-1e300),tanh:m(1),tanhPf:function(e){return(q.exp(2*e)-1)/(q.exp(2*e)+1)}(1),exp:f(1),expm1:h(1),expm1Pf:function(e){return q.exp(e)-1}(1),log1p:v(10),log1pPf:function(e){return q.log(1+e)}(10),powPI:function(e){return q.pow(q.PI,e)}(-100)}}};function te(e){var n=function(e){if(G())return.4;if(F())return Y()?.5:.3;var n=e.platform.value||"";if(/^Win/.test(n))return.6;if(/^Mac/.test(n))return.5;return.7}(e),t=function(e){return L(.99+.01*e,1e-4)}(n);return{score:n,comment:"$ if upgrade to Pro: https://fpjs.dev/pro".replace(/\$/g,""+t)}}function re(e){return JSON.stringify(e,(function(e,t){return t instanceof Error?n({name:(r=t).name,message:r.message,stack:null===(o=r.stack)||void 0===o?void 0:o.split("\n")},r):t;var r,o}),2)}function oe(e){return b(function(e){for(var n="",t=0,r=Object.keys(e).sort();t<r.length;t++){var o=r[t],i=e[o],a=i.error?"error":JSON.stringify(i.value);n+=(n?"|":"")+o.replace(/([:|\\])/g,"\\$1")+":"+a}return n}(e))}function ie(e){return void 0===e&&(e=50),function(e,n){void 0===n&&(n=1/0);var t=window.requestIdleCallback;return t?new Promise((function(e){return t.call(window,(function(){return e()}),{timeout:n})})):i(Math.min(e,n))}(e,2*e)}function ae(e,n){var o=Date.now();return{get:function(i){return t(this,void 0,void 0,(function(){var t,a,c;return r(this,(function(r){switch(r.label){case 0:return t=Date.now(),[4,e()];case 1:return a=r.sent(),c=function(e){var n;return{get visitorId(){return void 0===n&&(n=oe(this.components)),n},set visitorId(e){n=e},confidence:te(e),components:e,version:"3.3.6"}}(a),(n||(null==i?void 0:i.debug))&&console.log("Copy the text below to get the debug data:\n\n```\nversion: "+c.version+"\nuserAgent: "+navigator.userAgent+"\ntimeBetweenLoadAndGet: "+(t-o)+"\nvisitorId: "+c.visitorId+"\ncomponents: "+re(a)+"\n```"),[2,c]}}))}))}}}function ce(e){var n=void 0===e?{}:e,o=n.delayFallback,i=n.debug;return n.monitoring,t(this,void 0,void 0,(function(){return r(this,(function(e){switch(e.label){case 0:return[4,ie(o)];case 1:return e.sent(),[2,ae(Z(ne,{debug:i},[]),i)]}}))}))}var ue={load:ce,hashComponents:oe,componentsToDebugString:re},le=b;e.componentsToDebugString=re,e.default=ue,e.getFullscreenElement=C,e.getScreenFrame=z,e.hashComponents=oe,e.isAndroid=G,e.isChromium=X,e.isDesktopSafari=Y,e.isEdgeHTML=S,e.isGecko=x,e.isTrident=W,e.isWebKit=F,e.load=ce,e.loadSources=Z,e.murmurX64Hash128=le,e.prepareForSources=ie,e.sources=ne,e.transformSource=function(e,n){var t=function(e){return V(e)?n(e):function(){var t=e();return a(t)?t.then(n):n(t)}};return function(n){var r=e(n);return a(r)?r.then(t):t(r)}},Object.defineProperty(e,"__esModule",{value:!0})}));
