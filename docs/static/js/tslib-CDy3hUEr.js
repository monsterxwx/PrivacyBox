/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var y=function(c,r){return y=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])},y(c,r)};function p(c,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");y(c,r);function t(){this.constructor=c}c.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var _=function(c,r){return _=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])},_(c,r)};function w(c,r){_(c,r);function t(){this.constructor=c}c.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}var h=function(){return h=Object.assign||function(r){for(var t,e=1,o=arguments.length;e<o;e++){t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},h.apply(this,arguments)};function O(c,r){var t={};for(var e in c)Object.prototype.hasOwnProperty.call(c,e)&&r.indexOf(e)<0&&(t[e]=c[e]);if(c!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,e=Object.getOwnPropertySymbols(c);o<e.length;o++)r.indexOf(e[o])<0&&Object.prototype.propertyIsEnumerable.call(c,e[o])&&(t[e[o]]=c[e[o]]);return t}function g(c,r,t,e){function o(n){return n instanceof t?n:new t(function(u){u(n)})}return new(t||(t=Promise))(function(n,u){function i(f){try{a(e.next(f))}catch(s){u(s)}}function l(f){try{a(e.throw(f))}catch(s){u(s)}}function a(f){f.done?n(f.value):o(f.value).then(i,l)}a((e=e.apply(c,[])).next())})}function v(c,r){var t={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},e,o,n,u;return u={next:i(0),throw:i(1),return:i(2)},typeof Symbol=="function"&&(u[Symbol.iterator]=function(){return this}),u;function i(a){return function(f){return l([a,f])}}function l(a){if(e)throw new TypeError("Generator is already executing.");for(;t;)try{if(e=1,o&&(n=a[0]&2?o.return:a[0]?o.throw||((n=o.return)&&n.call(o),0):o.next)&&!(n=n.call(o,a[1])).done)return n;switch(o=0,n&&(a=[a[0]&2,n.value]),a[0]){case 0:case 1:n=a;break;case 4:return t.label++,{value:a[1],done:!1};case 5:t.label++,o=a[1],a=[0];continue;case 7:a=t.ops.pop(),t.trys.pop();continue;default:if(n=t.trys,!(n=n.length>0&&n[n.length-1])&&(a[0]===6||a[0]===2)){t=0;continue}if(a[0]===3&&(!n||a[1]>n[0]&&a[1]<n[3])){t.label=a[1];break}if(a[0]===6&&t.label<n[1]){t.label=n[1],n=a;break}if(n&&t.label<n[2]){t.label=n[2],t.ops.push(a);break}n[2]&&t.ops.pop(),t.trys.pop();continue}a=r.call(c,t)}catch(f){a=[6,f],o=0}finally{e=n=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}}function b(){for(var c=0,r=0,t=arguments.length;r<t;r++)c+=arguments[r].length;for(var e=Array(c),o=0,r=0;r<t;r++)for(var n=arguments[r],u=0,i=n.length;u<i;u++,o++)e[o]=n[u];return e}export{p as _,w as a,b,h as c,g as d,v as e,O as f};
