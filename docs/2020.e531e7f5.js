parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"mPxn":[function(require,module,exports) {
var define;
var r;!function(){"use strict";var t=.5*(Math.sqrt(3)-1),e=(3-Math.sqrt(3))/6,a=1/6,o=(Math.sqrt(5)-1)/4,i=(5-Math.sqrt(5))/20;function n(r){var t;t="function"==typeof r?r:r?function(){var r=0,t=0,e=0,a=1,o=(i=4022871197,function(r){r=r.toString();for(var t=0;t<r.length;t++){var e=.02519603282416938*(i+=r.charCodeAt(t));e-=i=e>>>0,i=(e*=i)>>>0,i+=4294967296*(e-=i)}return 2.3283064365386963e-10*(i>>>0)});var i;r=o(" "),t=o(" "),e=o(" ");for(var n=0;n<arguments.length;n++)(r-=o(arguments[n]))<0&&(r+=1),(t-=o(arguments[n]))<0&&(t+=1),(e-=o(arguments[n]))<0&&(e+=1);return o=null,function(){var o=2091639*r+2.3283064365386963e-10*a;return r=t,t=e,e=o-(a=0|o)}}(r):Math.random,this.p=f(t),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var e=0;e<512;e++)this.perm[e]=this.p[255&e],this.permMod12[e]=this.perm[e]%12}function f(r){var t,e=new Uint8Array(256);for(t=0;t<256;t++)e[t]=t;for(t=0;t<255;t++){var a=t+~~(r()*(256-t)),o=e[t];e[t]=e[a],e[a]=o}return e}n.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(r,a){var o,i,n=this.permMod12,f=this.perm,v=this.grad3,s=0,h=0,l=0,u=(r+a)*t,d=Math.floor(r+u),p=Math.floor(a+u),M=(d+p)*e,m=r-(d-M),c=a-(p-M);m>c?(o=1,i=0):(o=0,i=1);var y=m-o+e,w=c-i+e,g=m-1+2*e,A=c-1+2*e,x=255&d,q=255&p,D=.5-m*m-c*c;if(D>=0){var S=3*n[x+f[q]];s=(D*=D)*D*(v[S]*m+v[S+1]*c)}var U=.5-y*y-w*w;if(U>=0){var b=3*n[x+o+f[q+i]];h=(U*=U)*U*(v[b]*y+v[b+1]*w)}var F=.5-g*g-A*A;if(F>=0){var N=3*n[x+1+f[q+1]];l=(F*=F)*F*(v[N]*g+v[N+1]*A)}return 70*(s+h+l)},noise3D:function(r,t,e){var o,i,n,f,v,s,h,l,u,d,p=this.permMod12,M=this.perm,m=this.grad3,c=(r+t+e)*(1/3),y=Math.floor(r+c),w=Math.floor(t+c),g=Math.floor(e+c),A=(y+w+g)*a,x=r-(y-A),q=t-(w-A),D=e-(g-A);x>=q?q>=D?(v=1,s=0,h=0,l=1,u=1,d=0):x>=D?(v=1,s=0,h=0,l=1,u=0,d=1):(v=0,s=0,h=1,l=1,u=0,d=1):q<D?(v=0,s=0,h=1,l=0,u=1,d=1):x<D?(v=0,s=1,h=0,l=0,u=1,d=1):(v=0,s=1,h=0,l=1,u=1,d=0);var S=x-v+a,U=q-s+a,b=D-h+a,F=x-l+2*a,N=q-u+2*a,C=D-d+2*a,P=x-1+.5,T=q-1+.5,_=D-1+.5,j=255&y,k=255&w,z=255&g,B=.6-x*x-q*q-D*D;if(B<0)o=0;else{var E=3*p[j+M[k+M[z]]];o=(B*=B)*B*(m[E]*x+m[E+1]*q+m[E+2]*D)}var G=.6-S*S-U*U-b*b;if(G<0)i=0;else{var H=3*p[j+v+M[k+s+M[z+h]]];i=(G*=G)*G*(m[H]*S+m[H+1]*U+m[H+2]*b)}var I=.6-F*F-N*N-C*C;if(I<0)n=0;else{var J=3*p[j+l+M[k+u+M[z+d]]];n=(I*=I)*I*(m[J]*F+m[J+1]*N+m[J+2]*C)}var K=.6-P*P-T*T-_*_;if(K<0)f=0;else{var L=3*p[j+1+M[k+1+M[z+1]]];f=(K*=K)*K*(m[L]*P+m[L+1]*T+m[L+2]*_)}return 32*(o+i+n+f)},noise4D:function(r,t,e,a){var n,f,v,s,h,l,u,d,p,M,m,c,y,w,g,A,x,q=this.perm,D=this.grad4,S=(r+t+e+a)*o,U=Math.floor(r+S),b=Math.floor(t+S),F=Math.floor(e+S),N=Math.floor(a+S),C=(U+b+F+N)*i,P=r-(U-C),T=t-(b-C),_=e-(F-C),j=a-(N-C),k=0,z=0,B=0,E=0;P>T?k++:z++,P>_?k++:B++,P>j?k++:E++,T>_?z++:B++,T>j?z++:E++,_>j?B++:E++;var G=P-(l=k>=3?1:0)+i,H=T-(u=z>=3?1:0)+i,I=_-(d=B>=3?1:0)+i,J=j-(p=E>=3?1:0)+i,K=P-(M=k>=2?1:0)+2*i,L=T-(m=z>=2?1:0)+2*i,O=_-(c=B>=2?1:0)+2*i,Q=j-(y=E>=2?1:0)+2*i,R=P-(w=k>=1?1:0)+3*i,V=T-(g=z>=1?1:0)+3*i,W=_-(A=B>=1?1:0)+3*i,X=j-(x=E>=1?1:0)+3*i,Y=P-1+4*i,Z=T-1+4*i,$=_-1+4*i,rr=j-1+4*i,tr=255&U,er=255&b,ar=255&F,or=255&N,ir=.6-P*P-T*T-_*_-j*j;if(ir<0)n=0;else{var nr=q[tr+q[er+q[ar+q[or]]]]%32*4;n=(ir*=ir)*ir*(D[nr]*P+D[nr+1]*T+D[nr+2]*_+D[nr+3]*j)}var fr=.6-G*G-H*H-I*I-J*J;if(fr<0)f=0;else{var vr=q[tr+l+q[er+u+q[ar+d+q[or+p]]]]%32*4;f=(fr*=fr)*fr*(D[vr]*G+D[vr+1]*H+D[vr+2]*I+D[vr+3]*J)}var sr=.6-K*K-L*L-O*O-Q*Q;if(sr<0)v=0;else{var hr=q[tr+M+q[er+m+q[ar+c+q[or+y]]]]%32*4;v=(sr*=sr)*sr*(D[hr]*K+D[hr+1]*L+D[hr+2]*O+D[hr+3]*Q)}var lr=.6-R*R-V*V-W*W-X*X;if(lr<0)s=0;else{var ur=q[tr+w+q[er+g+q[ar+A+q[or+x]]]]%32*4;s=(lr*=lr)*lr*(D[ur]*R+D[ur+1]*V+D[ur+2]*W+D[ur+3]*X)}var dr=.6-Y*Y-Z*Z-$*$-rr*rr;if(dr<0)h=0;else{var pr=q[tr+1+q[er+1+q[ar+1+q[or+1]]]]%32*4;h=(dr*=dr)*dr*(D[pr]*Y+D[pr+1]*Z+D[pr+2]*$+D[pr+3]*rr)}return 27*(n+f+v+s+h)}},n._buildPermutationTable=f,void 0!==r&&r.amd&&r(function(){return n}),"undefined"!=typeof exports?exports.SimplexNoise=n:"undefined"!=typeof window&&(window.SimplexNoise=n),"undefined"!=typeof module&&(module.exports=n)}();
},{}],"Ga9W":[function(require,module,exports) {

"use strict";var e=t(require("simplex-noise"));function t(e){return e&&e.__esModule?e:{default:e}}var i=document.querySelector("svg"),n=new e.default(Math.random),o=500,r=0,d=function(e){i.childNodes.length>o&&i.removeChild(i.childNodes[0]),i.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"));n.noise2D(5e-4*e,.5);var t=n.noise2D(.5,5e-4*e),r=n.noise2D(.5,.01*-e),d=.5*(n.noise2D(-.5,.01*-e+100)+1),s=Math.min(window.innerWidth,window.innerWidth)*d,h=window.innerWidth/2-s/2,w=(window.innerHeight,window.innerWidth);w=window.innerHeight/2+r*window.innerHeight/2;var l=i.childNodes[i.childNodes.length-1];l.setAttribute("transform","rotate( "+90*r+" 0, "+w+" )"),l.setAttribute("x",h),l.setAttribute("y",w),l.setAttribute("width",s),l.setAttribute("height",s),l.setAttribute("stroke","black"),l.setAttribute("fill","hsl( "+360*e/o*2+", 100%, 50% )"),l.setAttribute("stroke-width","0.5")};document.body.style.height=3*window.innerHeight+"px";var s=function(e){r+=.5,d(.1*window.scrollY),window.scrollY+window.innerHeight>=document.body.offsetHeight-.2*window.innerHeight&&(document.body.style.height=parseInt(document.body.style.height)+window.innerHeight+"px")};document.addEventListener("scroll",function(e){return s(e)});
},{"simplex-noise":"mPxn"}]},{},["Ga9W"], null)