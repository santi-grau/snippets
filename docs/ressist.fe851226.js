parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"gh7a":[function(require,module,exports) {
var n=document.querySelector("#main"),e=document.querySelector(".resist"),t=0;document.body.style.height=3*window.innerHeight+"px";var i,o=window.scrollY,r=!1;Math.random()>.5&&n.classList.toggle("inv");var d=function(n){var d=window.scrollY;r=!0,window.scrollY+window.innerHeight>=document.body.offsetHeight-.2*window.innerHeight&&(document.body.style.height=parseInt(document.body.style.height)+window.innerHeight+"px");var s=o-d;o=d,t-=Math.min(0,s),t=Math.min(t,window.innerHeight),i&&clearTimeout(i),i=setTimeout(function(){return r=!1},200),e.style["background-position-y"]=-d+"px"},s=function e(i){r||(t-=.3*t),n.style.transform="translate3d( 0, "+-1*t+"px, 0 )",requestAnimationFrame(function(n){return e(n)})};document.addEventListener("scroll",function(n){return d(n)}),d(),s(0);
},{}]},{},["gh7a"], null)