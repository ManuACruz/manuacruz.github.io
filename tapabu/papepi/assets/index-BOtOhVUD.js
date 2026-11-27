(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,O=1029,k=1030,A=1031,ee=1033,j=33776,M=33777,te=33778,N=33779,P=35840,ne=35841,re=35842,ie=35843,ae=36196,oe=37492,se=37496,ce=37488,F=37489,le=37490,ue=37491,de=37808,fe=37809,pe=37810,me=37811,he=37812,ge=37813,_e=37814,ve=37815,ye=37816,be=37817,xe=37818,Se=37819,Ce=37820,we=37821,Te=36492,Ee=36494,De=36495,Oe=36283,ke=36284,Ae=36285,je=36286,Me=2300,I=2301,Ne=2302,L=2303,Pe=2400,R=2401,Fe=2402,z=3200,Ie=`srgb`,B=`srgb-linear`,Le=`linear`,Re=`srgb`,ze=7680,Be=35044,Ve=2e3;function He(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ue(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function We(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ge(){let e=We(`canvas`);return e.style.display=`block`,e}var Ke={};function qe(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Je(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function V(...e){e=Je(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function H(...e){e=Je(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Ye(...e){let t=e.join(` `);t in Ke||(Ke[t]=!0,V(...e))}function Xe(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Ze={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Qe=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},$e=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),et=1234567,tt=Math.PI/180,nt=180/Math.PI;function rt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return($e[e&255]+$e[e>>8&255]+$e[e>>16&255]+$e[e>>24&255]+`-`+$e[t&255]+$e[t>>8&255]+`-`+$e[t>>16&15|64]+$e[t>>24&255]+`-`+$e[n&63|128]+$e[n>>8&255]+`-`+$e[n>>16&255]+$e[n>>24&255]+$e[r&255]+$e[r>>8&255]+$e[r>>16&255]+$e[r>>24&255]).toLowerCase()}function U(e,t,n){return Math.max(t,Math.min(n,e))}function it(e,t){return(e%t+t)%t}function at(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ot(e,t,n){return e===t?0:(n-e)/(t-e)}function st(e,t,n){return(1-n)*e+n*t}function ct(e,t,n,r){return st(e,t,1-Math.exp(-n*r))}function lt(e,t=1){return t-Math.abs(it(e,t*2)-t)}function ut(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function dt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function ft(e,t){return e+Math.floor(Math.random()*(t-e+1))}function pt(e,t){return e+Math.random()*(t-e)}function mt(e){return e*(.5-Math.random())}function ht(e){e!==void 0&&(et=e);let t=et+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function gt(e){return e*tt}function _t(e){return e*nt}function vt(e){return!(e&e-1)&&e!==0}function yt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function bt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function xt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:V(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function St(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Ct(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var wt={DEG2RAD:tt,RAD2DEG:nt,generateUUID:rt,clamp:U,euclideanModulo:it,mapLinear:at,inverseLerp:ot,lerp:st,damp:ct,pingpong:lt,smoothstep:ut,smootherstep:dt,randInt:ft,randFloat:pt,randFloatSpread:mt,seededRandom:ht,degToRad:gt,radToDeg:_t,isPowerOfTwo:vt,ceilPowerOfTwo:yt,floorPowerOfTwo:bt,setQuaternionFromProperEuler:xt,normalize:Ct,denormalize:St},W=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(U(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Tt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:V(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(U(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this.z=U(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this.z=U(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Et.copy(this).projectOnVector(e),this.sub(Et)}reflect(e){return this.sub(Et.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(U(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Et=new G,Dt=new Tt,K=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Ye(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ot.makeScale(e,t)),this}rotate(e){return Ye(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ot.makeRotation(-e)),this}translate(e,t){return Ye(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ot.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ot=new K,kt=new K().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),At=new K().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jt(){let e={enabled:!0,workingColorSpace:B,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Mt(e.r),e.g=Mt(e.g),e.b=Mt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Nt(e.r),e.g=Nt(e.g),e.b=Nt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Le:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Ye(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Ye(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[B]:{primaries:t,whitePoint:r,transfer:Le,toXYZ:kt,fromXYZ:At,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ie},outputColorSpaceConfig:{drawingBufferColorSpace:Ie}},[Ie]:{primaries:t,whitePoint:r,transfer:Re,toXYZ:kt,fromXYZ:At,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ie}}}),e}var q=jt();function Mt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Nt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Pt,Ft=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Pt===void 0&&(Pt=We(`canvas`)),Pt.width=e.width,Pt.height=e.height;let t=Pt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Pt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=We(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Mt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Mt(t[e]/255)*255):t[e]=Mt(t[e]);return{data:t,width:e.width,height:e.height}}return V(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},It=0,Lt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:It++}),this.uuid=rt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Rt(r[t].image)):e.push(Rt(r[t]))}else e=Rt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Rt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ft.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(V(`Texture: Unable to serialize Texture.`),{})}var zt=0,Bt=new G,Vt=class r extends Qe{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zt++}),this.uuid=rt(),this.name=``,this.source=new Lt(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new K,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bt).x}get height(){return this.source.getSize(Bt).y}get depth(){return this.source.getSize(Bt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){V(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){V(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Vt.DEFAULT_IMAGE=null,Vt.DEFAULT_MAPPING=300,Vt.DEFAULT_ANISOTROPY=1;var Ht=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this.z=U(this.z,e.z,t.z),this.w=U(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this.z=U(this.z,e,t),this.w=U(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ut=class extends Qe{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ht(0,0,e,t),this.scissorTest=!1,this.viewport=new Ht(0,0,e,t),this.textures=[];let r=new Vt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Lt(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Wt=class extends Ut{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Gt=class extends Vt{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Kt=class extends Vt{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qt=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Jt.setFromMatrixColumn(e,0).length(),i=1/Jt.setFromMatrixColumn(e,1).length(),a=1/Jt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xt,e,Zt)}lookAt(e,t,n){let r=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),Qt.crossVectors(n,en),Qt.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),Qt.crossVectors(n,en)),Qt.normalize(),$t.crossVectors(en,Qt),r[0]=Qt.x,r[4]=$t.x,r[8]=en.x,r[1]=Qt.y,r[5]=$t.y,r[9]=en.y,r[2]=Qt.z,r[6]=$t.z,r[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],j=r[14],M=r[3],te=r[7],N=r[11],P=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*te,i[8]=a*C+o*D+s*ee+c*N,i[12]=a*w+o*O+s*j+c*P,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*te,i[9]=l*C+u*D+d*ee+f*N,i[13]=l*w+u*O+d*j+f*P,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*te,i[10]=p*C+m*D+h*ee+g*N,i[14]=p*w+m*O+h*j+g*P,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*te,i[11]=_*C+v*D+y*ee+b*N,i[15]=_*w+v*O+y*j+b*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Jt.set(r[0],r[1],r[2]).length(),o=Jt.set(r[4],r[5],r[6]).length(),s=Jt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Yt.copy(this);let c=1/a,l=1/o,u=1/s;return Yt.elements[0]*=c,Yt.elements[1]*=c,Yt.elements[2]*=c,Yt.elements[4]*=l,Yt.elements[5]*=l,Yt.elements[6]*=l,Yt.elements[8]*=u,Yt.elements[9]*=u,Yt.elements[10]*=u,t.setFromRotationMatrix(Yt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ve,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ve,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Jt=new G,Yt=new qt,Xt=new G(0,0,0),Zt=new G(1,1,1),Qt=new G,$t=new G,en=new G,tn=new qt,nn=new Tt,rn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(U(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-U(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(U(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-U(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(U(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-U(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:V(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return tn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nn.setFromEuler(this),this.setFromQuaternion(nn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};rn.DEFAULT_ORDER=`XYZ`;var an=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},on=0,sn=new G,cn=new Tt,ln=new qt,un=new G,dn=new G,fn=new G,pn=new Tt,mn=new G(1,0,0),hn=new G(0,1,0),gn=new G(0,0,1),_n={type:`added`},vn={type:`removed`},yn={type:`childadded`,child:null},bn={type:`childremoved`,child:null},xn=class e extends Qe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:on++}),this.uuid=rt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new rn,r=new Tt,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new qt},normalMatrix:{value:new K}}),this.matrix=new qt,this.matrixWorld=new qt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new an,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return cn.setFromAxisAngle(e,t),this.quaternion.multiply(cn),this}rotateOnWorldAxis(e,t){return cn.setFromAxisAngle(e,t),this.quaternion.premultiply(cn),this}rotateX(e){return this.rotateOnAxis(mn,e)}rotateY(e){return this.rotateOnAxis(hn,e)}rotateZ(e){return this.rotateOnAxis(gn,e)}translateOnAxis(e,t){return sn.copy(e).applyQuaternion(this.quaternion),this.position.add(sn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mn,e)}translateY(e){return this.translateOnAxis(hn,e)}translateZ(e){return this.translateOnAxis(gn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ln.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?un.copy(e):un.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),dn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ln.lookAt(dn,un,this.up):ln.lookAt(un,dn,this.up),this.quaternion.setFromRotationMatrix(ln),r&&(ln.extractRotation(r.matrixWorld),cn.setFromRotationMatrix(ln),this.quaternion.premultiply(cn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(H(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_n),yn.child=e,this.dispatchEvent(yn),yn.child=null):H(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(vn),bn.child=e,this.dispatchEvent(bn),bn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_n),yn.child=e,this.dispatchEvent(yn),yn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dn,e,fn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dn,pn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};xn.DEFAULT_UP=new G(0,1,0),xn.DEFAULT_MATRIX_AUTO_UPDATE=!0,xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Sn=class extends xn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Cn={type:`move`},wn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Sn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Tn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},En={h:0,s:0,l:0},Dn={h:0,s:0,l:0};function On(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var J=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ie){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,q.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=q.workingColorSpace){return this.r=e,this.g=t,this.b=n,q.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=q.workingColorSpace){if(e=it(e,1),t=U(t,0,1),n=U(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=On(i,r,e+1/3),this.g=On(i,r,e),this.b=On(i,r,e-1/3)}return q.colorSpaceToWorking(this,r),this}setStyle(e,t=Ie){function n(t){t!==void 0&&parseFloat(t)<1&&V(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:V(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);V(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ie){let n=Tn[e.toLowerCase()];return n===void 0?V(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mt(e.r),this.g=Mt(e.g),this.b=Mt(e.b),this}copyLinearToSRGB(e){return this.r=Nt(e.r),this.g=Nt(e.g),this.b=Nt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ie){return q.workingToColorSpace(kn.copy(this),e),Math.round(U(kn.r*255,0,255))*65536+Math.round(U(kn.g*255,0,255))*256+Math.round(U(kn.b*255,0,255))}getHexString(e=Ie){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=q.workingColorSpace){q.workingToColorSpace(kn.copy(this),t);let n=kn.r,r=kn.g,i=kn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=q.workingColorSpace){return q.workingToColorSpace(kn.copy(this),t),e.r=kn.r,e.g=kn.g,e.b=kn.b,e}getStyle(e=Ie){q.workingToColorSpace(kn.copy(this),e);let t=kn.r,n=kn.g,r=kn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(En),this.setHSL(En.h+e,En.s+t,En.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(En),e.getHSL(Dn);let n=st(En.h,Dn.h,t),r=st(En.s,Dn.s,t),i=st(En.l,Dn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},kn=new J;J.NAMES=Tn;var An=class extends xn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},jn=new G,Mn=new G,Nn=new G,Pn=new G,Fn=new G,In=new G,Ln=new G,Rn=new G,zn=new G,Bn=new G,Vn=new Ht,Hn=new Ht,Un=new Ht,Wn=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),jn.subVectors(e,t),r.cross(jn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){jn.subVectors(r,t),Mn.subVectors(n,t),Nn.subVectors(e,t);let a=jn.dot(jn),o=jn.dot(Mn),s=jn.dot(Nn),c=Mn.dot(Mn),l=Mn.dot(Nn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Pn)!==null&&Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Pn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Pn.x),s.addScaledVector(a,Pn.y),s.addScaledVector(o,Pn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Vn.setScalar(0),Hn.setScalar(0),Un.setScalar(0),Vn.fromBufferAttribute(e,t),Hn.fromBufferAttribute(e,n),Un.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Vn,i.x),a.addScaledVector(Hn,i.y),a.addScaledVector(Un,i.z),a}static isFrontFacing(e,t,n,r){return jn.subVectors(n,t),Mn.subVectors(e,t),jn.cross(Mn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),jn.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Fn.subVectors(r,n),In.subVectors(i,n),Rn.subVectors(e,n);let s=Fn.dot(Rn),c=In.dot(Rn);if(s<=0&&c<=0)return t.copy(n);zn.subVectors(e,r);let l=Fn.dot(zn),u=In.dot(zn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Fn,a);Bn.subVectors(e,i);let f=Fn.dot(Bn),p=In.dot(Bn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(In,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Ln.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Ln,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Fn,a).addScaledVector(In,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Gn=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,qn):qn.fromBufferAttribute(r,t),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Jn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Jn.copy(e.boundingBox)),Jn.applyMatrix4(e.matrixWorld),this.union(Jn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tr),nr.subVectors(this.max,tr),Yn.subVectors(e.a,tr),Xn.subVectors(e.b,tr),Zn.subVectors(e.c,tr),Qn.subVectors(Xn,Yn),$n.subVectors(Zn,Xn),er.subVectors(Yn,Zn);let t=[0,-Qn.z,Qn.y,0,-$n.z,$n.y,0,-er.z,er.y,Qn.z,0,-Qn.x,$n.z,0,-$n.x,er.z,0,-er.x,-Qn.y,Qn.x,0,-$n.y,$n.x,0,-er.y,er.x,0];return!ar(t,Yn,Xn,Zn,nr)||(t=[1,0,0,0,1,0,0,0,1],!ar(t,Yn,Xn,Zn,nr))?!1:(rr.crossVectors(Qn,$n),t=[rr.x,rr.y,rr.z],ar(t,Yn,Xn,Zn,nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Kn=[new G,new G,new G,new G,new G,new G,new G,new G],qn=new G,Jn=new Gn,Yn=new G,Xn=new G,Zn=new G,Qn=new G,$n=new G,er=new G,tr=new G,nr=new G,rr=new G,ir=new G;function ar(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){ir.fromArray(e,a);let o=i.x*Math.abs(ir.x)+i.y*Math.abs(ir.y)+i.z*Math.abs(ir.z),s=t.dot(ir),c=n.dot(ir),l=r.dot(ir);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var or=new G,sr=new W,cr=0,lr=class extends Qe{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Be,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)sr.fromBufferAttribute(this,t),sr.applyMatrix3(e),this.setXY(t,sr.x,sr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)or.fromBufferAttribute(this,t),or.applyMatrix3(e),this.setXYZ(t,or.x,or.y,or.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)or.fromBufferAttribute(this,t),or.applyMatrix4(e),this.setXYZ(t,or.x,or.y,or.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)or.fromBufferAttribute(this,t),or.applyNormalMatrix(e),this.setXYZ(t,or.x,or.y,or.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)or.fromBufferAttribute(this,t),or.transformDirection(e),this.setXYZ(t,or.x,or.y,or.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=St(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=St(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=St(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=St(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=St(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array),i=Ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},ur=class extends lr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},dr=class extends lr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},fr=class extends lr{constructor(e,t,n){super(new Float32Array(e),t,n)}},pr=new Gn,mr=new G,hr=new G,gr=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?pr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mr.subVectors(e,this.center);let t=mr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(mr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mr.copy(e.center).add(hr)),this.expandByPoint(mr.copy(e.center).sub(hr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},_r=0,vr=new qt,yr=new xn,br=new G,xr=new Gn,Sr=new Gn,Cr=new G,wr=class e extends Qe{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_r++}),this.uuid=rt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(He(e)?dr:ur)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new K().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return vr.makeRotationFromQuaternion(e),this.applyMatrix4(vr),this}rotateX(e){return vr.makeRotationX(e),this.applyMatrix4(vr),this}rotateY(e){return vr.makeRotationY(e),this.applyMatrix4(vr),this}rotateZ(e){return vr.makeRotationZ(e),this.applyMatrix4(vr),this}translate(e,t,n){return vr.makeTranslation(e,t,n),this.applyMatrix4(vr),this}scale(e,t,n){return vr.makeScale(e,t,n),this.applyMatrix4(vr),this}lookAt(e){return yr.lookAt(e),yr.updateMatrix(),this.applyMatrix4(yr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(br).negate(),this.translate(br.x,br.y,br.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new fr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&V(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){H(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];xr.setFromBufferAttribute(n),this.morphTargetsRelative?(Cr.addVectors(this.boundingBox.min,xr.min),this.boundingBox.expandByPoint(Cr),Cr.addVectors(this.boundingBox.max,xr.max),this.boundingBox.expandByPoint(Cr)):(this.boundingBox.expandByPoint(xr.min),this.boundingBox.expandByPoint(xr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&H(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){H(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);return}if(e){let n=this.boundingSphere.center;if(xr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Sr.setFromBufferAttribute(n),this.morphTargetsRelative?(Cr.addVectors(xr.min,Sr.min),xr.expandByPoint(Cr),Cr.addVectors(xr.max,Sr.max),xr.expandByPoint(Cr)):(xr.expandByPoint(Sr.min),xr.expandByPoint(Sr.max))}xr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Cr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Cr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Cr.fromBufferAttribute(a,t),o&&(br.fromBufferAttribute(e,t),Cr.add(br)),r=Math.max(r,n.distanceToSquared(Cr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&H(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){H(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new lr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new W,f=new W,p=new W,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new lr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Cr.fromBufferAttribute(e,t),Cr.normalize(),e.setXYZ(t,Cr.x,Cr.y,Cr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new lr(a,r,i)}if(this.index===null)return V(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Tr=0,Er=class extends Qe{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tr++}),this.uuid=rt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new J(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ze,this.stencilZFail=ze,this.stencilZPass=ze,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){V(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){V(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new J().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new W().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Dr=new G,Or=new G,kr=new G,Ar=new G,jr=new G,Mr=new G,Nr=new G,Pr=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Dr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Dr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Dr.copy(this.origin).addScaledVector(this.direction,t),Dr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Or.copy(e).add(t).multiplyScalar(.5),kr.copy(t).sub(e).normalize(),Ar.copy(this.origin).sub(Or);let i=e.distanceTo(t)*.5,a=-this.direction.dot(kr),o=Ar.dot(this.direction),s=-Ar.dot(kr),c=Ar.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Or).addScaledVector(kr,d),f}intersectSphere(e,t){Dr.subVectors(e.center,this.origin);let n=Dr.dot(this.direction),r=Dr.dot(Dr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Dr)!==null}intersectTriangle(e,t,n,r,i){jr.subVectors(t,e),Mr.subVectors(n,e),Nr.crossVectors(jr,Mr);let a=this.direction.dot(Nr),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ar.subVectors(this.origin,e);let s=o*this.direction.dot(Mr.crossVectors(Ar,Mr));if(s<0)return null;let c=o*this.direction.dot(jr.cross(Ar));if(c<0||s+c>a)return null;let l=-o*Ar.dot(Nr);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Fr=class extends Er{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ir=new qt,Lr=new Pr,Rr=new gr,zr=new G,Br=new G,Vr=new G,Hr=new G,Ur=new G,Wr=new G,Gr=new G,Kr=new G,Y=class extends xn{constructor(e=new wr,t=new Fr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Wr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Ur.fromBufferAttribute(s,e),a?Wr.addScaledVector(Ur,r):Wr.addScaledVector(Ur.sub(t),r))}t.add(Wr)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(i),Lr.copy(e.ray).recast(e.near),!(Rr.containsPoint(Lr.origin)===!1&&(Lr.intersectSphere(Rr,zr)===null||Lr.origin.distanceToSquared(zr)>(e.far-e.near)**2))&&(Ir.copy(i).invert(),Lr.copy(e.ray).applyMatrix4(Ir),(n.boundingBox===null||Lr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Lr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Jr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Jr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Jr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Jr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function qr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Kr.copy(s),Kr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Kr);return l<n.near||l>n.far?null:{distance:l,point:Kr.clone(),object:e}}function Jr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Br),e.getVertexPosition(c,Vr),e.getVertexPosition(l,Hr);let u=qr(e,t,n,r,Br,Vr,Hr,Gr);if(u){let e=new G;Wn.getBarycoord(Gr,Br,Vr,Hr,e),i&&(u.uv=Wn.getInterpolatedAttribute(i,s,c,l,e,new W)),a&&(u.uv1=Wn.getInterpolatedAttribute(a,s,c,l,e,new W)),o&&(u.normal=Wn.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};Wn.getNormal(Br,Vr,Hr,t.normal),u.face=t,u.barycoord=e}return u}var Yr=class extends Vt{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Xr=class extends lr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Zr=new qt,Qr=new qt,$r=[],ei=new Gn,ti=new qt,ni=new Y,ri=new gr,ii=class extends Y{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Xr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,ti)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Gn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),ei.copy(e.boundingBox).applyMatrix4(Zr),this.boundingBox.union(ei)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new gr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),ri.copy(e.boundingSphere).applyMatrix4(Zr),this.boundingSphere.union(ri)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ni.geometry=this.geometry,ni.material=this.material,ni.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ri.copy(this.boundingSphere),ri.applyMatrix4(n),e.ray.intersectsSphere(ri)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Zr),Qr.multiplyMatrices(n,Zr),ni.matrixWorld=Qr,ni.raycast(e,$r);for(let e=0,n=$r.length;e<n;e++){let n=$r[e];n.instanceId=i,n.object=this,t.push(n)}$r.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Xr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yr(new Float32Array(r*this.count),r,this.count,D,h));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ai=new G,oi=new G,si=new K,ci=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ai.subVectors(n,t).cross(oi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ai),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||si.getNormalMatrix(e),r=this.coplanarPoint(ai).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},li=new gr,ui=new W(.5,.5),di=new G,fi=class{constructor(e=new ci,t=new ci,n=new ci,r=new ci,i=new ci,a=new ci){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ve,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){return li.center.set(0,0,0),li.radius=.7071067811865476+ui.distanceTo(e.center),li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(di.x=r.normal.x>0?e.max.x:e.min.x,di.y=r.normal.y>0?e.max.y:e.min.y,di.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(di)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},pi=class extends Vt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},mi=class extends Vt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},hi=class extends Vt{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Lt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},gi=class extends hi{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},_i=class extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},vi=class e extends wr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new fr(c,3)),this.setAttribute(`normal`,new fr(l,3)),this.setAttribute(`uv`,new fr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},yi=class e extends wr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new G,l=new W;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new fr(a,3)),this.setAttribute(`normal`,new fr(o,3)),this.setAttribute(`uv`,new fr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},bi=class e extends wr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new fr(u,3)),this.setAttribute(`normal`,new fr(d,3)),this.setAttribute(`uv`,new fr(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new W,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},xi=class e extends bi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Si=class e extends wr{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=U(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new G,d=new W,f=new G,p=new G,m=new G,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new fr(a,3)),this.setAttribute(`uv`,new fr(o,2)),this.setAttribute(`normal`,new fr(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Ci=class e extends wr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new fr(p,3)),this.setAttribute(`normal`,new fr(m,3)),this.setAttribute(`uv`,new fr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},wi=class e extends wr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new fr(p,3)),this.setAttribute(`normal`,new fr(m,3)),this.setAttribute(`uv`,new fr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ti(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Di(i))i.isRenderTargetTexture?(V(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Di(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ei(e){let t={};for(let n=0;n<e.length;n++){let r=Ti(e[n]);for(let e in r)t[e]=r[e]}return t}function Di(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Oi(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ki(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:q.workingColorSpace}var Ai={clone:Ti,merge:Ei},ji=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Mi=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ni=class extends Er{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ji,this.fragmentShader=Mi,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ti(e.uniforms),this.uniformsGroups=Oi(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new J().setHex(r.value);break;case`v2`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Ht().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new qt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Pi=class extends Ni{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Fi=class extends Er{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:``},this.type=`MeshToonMaterial`,this.color=new J(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new J(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ii=class extends Er{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=z,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Li=class extends Er{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ri(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var zi=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Bi=class extends zi{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Pe,endingEnd:Pe}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case R:i=e,o=2*t-n;break;case Fe:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case R:a=e,s=2*n-t;break;case Fe:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Vi=class extends zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Hi=class extends zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ui=class extends zi{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},Wi=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ri(t,this.TimeBufferType),this.values=Ri(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ri(e.times,Array),values:Ri(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Hi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Bi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ui(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Me:t=this.InterpolantFactoryMethodDiscrete;break;case I:t=this.InterpolantFactoryMethodLinear;break;case Ne:t=this.InterpolantFactoryMethodSmooth;break;case L:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return V(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Me;case this.InterpolantFactoryMethodLinear:return I;case this.InterpolantFactoryMethodSmooth:return Ne;case this.InterpolantFactoryMethodBezier:return L}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(H(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(H(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){H(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){H(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ue(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){H(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ne,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Wi.prototype.ValueTypeName=``,Wi.prototype.TimeBufferType=Float32Array,Wi.prototype.ValueBufferType=Float32Array,Wi.prototype.DefaultInterpolation=I;var Gi=class extends Wi{constructor(e,t,n){super(e,t,n)}};Gi.prototype.ValueTypeName=`bool`,Gi.prototype.ValueBufferType=Array,Gi.prototype.DefaultInterpolation=Me,Gi.prototype.InterpolantFactoryMethodLinear=void 0,Gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ki=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}};Ki.prototype.ValueTypeName=`color`;var qi=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}};qi.prototype.ValueTypeName=`number`;var Ji=class extends zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Tt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Yi=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ji(this.times,this.values,this.getValueSize(),e)}};Yi.prototype.ValueTypeName=`quaternion`,Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Xi=class extends Wi{constructor(e,t,n){super(e,t,n)}};Xi.prototype.ValueTypeName=`string`,Xi.prototype.ValueBufferType=Array,Xi.prototype.DefaultInterpolation=Me,Xi.prototype.InterpolantFactoryMethodLinear=void 0,Xi.prototype.InterpolantFactoryMethodSmooth=void 0;var Zi=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}};Zi.prototype.ValueTypeName=`vector`;var Qi=class extends xn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new J(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},$i=class extends Qi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(xn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new J(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ea=new qt,ta=new G,na=new G,ra=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fi,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new Ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;ta.setFromMatrixPosition(e.matrixWorld),t.position.copy(ta),na.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(na),t.updateMatrixWorld(),ea.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ea,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ea)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ia=new G,aa=new Tt,oa=new G,sa=class extends xn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new qt,this.projectionMatrix=new qt,this.projectionMatrixInverse=new qt,this.coordinateSystem=Ve,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ia,aa,oa),oa.x===1&&oa.y===1&&oa.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,aa,oa.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ia,aa,oa),oa.x===1&&oa.y===1&&oa.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,aa,oa.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ca=new G,la=new W,ua=new W,da=class extends sa{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=nt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(tt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return nt*2*Math.atan(Math.tan(tt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ca.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ca.x,ca.y).multiplyScalar(-e/ca.z),ca.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ca.x,ca.y).multiplyScalar(-e/ca.z)}getViewSize(e,t){return this.getViewBounds(e,la,ua),t.subVectors(ua,la)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(tt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},fa=class extends sa{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},pa=class extends ra{constructor(){super(new fa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ma=class extends Qi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(xn.DEFAULT_UP),this.updateMatrix(),this.target=new xn,this.shadow=new pa}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ha=-90,ga=1,_a=class extends xn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new da(ha,ga,e,t);r.layers=this.layers,this.add(r);let i=new da(ha,ga,e,t);i.layers=this.layers,this.add(i);let a=new da(ha,ga,e,t);a.layers=this.layers,this.add(a);let o=new da(ha,ga,e,t);o.layers=this.layers,this.add(o);let s=new da(ha,ga,e,t);s.layers=this.layers,this.add(s);let c=new da(ha,ga,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},va=class extends da{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ya=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=ba.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function ba(){this._document.hidden===!1&&this.reset()}var xa=`\\[\\]\\.:\\/`,Sa=RegExp(`[\\[\\]\\.:\\/]`,`g`),Ca=`[^\\[\\]\\.:\\/]`,wa=`[^`+xa.replace(`\\.`,``)+`]`,Ta=`((?:WC+[\\/:])*)`.replace(`WC`,Ca),Ea=`(WCOD+)?`.replace(`WCOD`,wa),Da=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Ca),Oa=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Ca),ka=RegExp(`^`+Ta+Ea+Da+Oa+`$`),Aa=[`material`,`materials`,`bones`,`map`],ja=class{constructor(e,t,n){let r=n||Ma.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ma=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Sa,``)}static parseTrackName(e){let t=ka.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Aa.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){V(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){H(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){H(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){H(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){H(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){H(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){H(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){H(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;H(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){H(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){H(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ma.Composite=ja,Ma.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ma.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ma.prototype.GetterByBindingType=[Ma.prototype._getValue_direct,Ma.prototype._getValue_array,Ma.prototype._getValue_arrayElement,Ma.prototype._getValue_toArray],Ma.prototype.SetterByBindingTypeAndVersioning=[[Ma.prototype._setValue_direct,Ma.prototype._setValue_direct_setNeedsUpdate,Ma.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ma.prototype._setValue_array,Ma.prototype._setValue_array_setNeedsUpdate,Ma.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ma.prototype._setValue_arrayElement,Ma.prototype._setValue_arrayElement_setNeedsUpdate,Ma.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ma.prototype._setValue_fromArray,Ma.prototype._setValue_fromArray_setNeedsUpdate,Ma.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Na=new qt,Pa=class{constructor(e,t,n=0,r=1/0){this.ray=new Pr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new an,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):H(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Na.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Na),this}intersectObject(e,t=!0,n=[]){return Ia(e,this,n,t),n.sort(Fa),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Ia(e[r],this,n,t);return n.sort(Fa),n}};function Fa(e,t){return e.distance-t.distance}function Ia(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Ia(r[e],t,n,!0)}}(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function La(e,t,n,r){let i=Ra(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case O:return e*t/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case ee:return e*t*4/i.components*i.byteLength;case j:case M:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case te:case N:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ne:case ie:return Math.max(e,16)*Math.max(t,8)/4;case P:case re:return Math.max(e,8)*Math.max(t,8)/2;case ae:case oe:case ce:case F:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case se:case le:case ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case me:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ge:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ye:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ce:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Te:case Ee:case De:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Oe:case ke:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ae:case je:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ra(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?V(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function za(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ba(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new J(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new K}},envmap:{envMap:{value:null},envMapRotation:{value:new K},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new K}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new K}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new K},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new K},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new K},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new K}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new K}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new K}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new J(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new J(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0},uvTransform:{value:new K}},sprite:{diffuse:{value:new J(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}}},Va={basic:{uniforms:Ei([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:Ei([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new J(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:Ei([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new J(0)},specular:{value:new J(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:Ei([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new J(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:Ei([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new J(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:Ei([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:Ei([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:Ei([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:Ei([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:Ei([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:Ei([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new K},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new K}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:Ei([Z.common,Z.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:Ei([Z.lights,Z.fog,{color:{value:new J(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};Va.physical={uniforms:Ei([Va.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new K},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new K},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new K},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new K},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new K},sheen:{value:0},sheenColor:{value:new J(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new K},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new K},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new K},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new K},attenuationDistance:{value:0},attenuationColor:{value:new J(0)},specularColor:{value:new J(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new K},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new K},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new K}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var Ha={r:0,b:0,g:0},Ua=new qt,Wa=new K;Wa.set(-1,0,0,0,1,0,0,0,1);function Ga(e,t,n,r,i,a){let o=new J(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Y(new vi(1,1,1),new Ni({name:`BackgroundCubeMaterial`,uniforms:Ti(Va.backgroundCube.uniforms),vertexShader:Va.backgroundCube.vertexShader,fragmentShader:Va.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ua.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Wa),l.material.toneMapped=q.getTransfer(i.colorSpace)!==Re,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Y(new Ci(2,2),new Ni({name:`BackgroundMaterial`,uniforms:Ti(Va.background.uniforms),vertexShader:Va.background.vertexShader,fragmentShader:Va.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=q.getTransfer(i.colorSpace)!==Re,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ha,ki(e)),n.buffers.color.setClear(Ha.r,Ha.g,Ha.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ka(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function qa(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ja(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(V(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&V(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Ya(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ci,s=new K,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Xa=4,Za=[.125,.215,.35,.446,.526,.582],Qa=20,$a=256,eo=new fa,to=new J,no=null,ro=0,io=0,ao=!1,oo=new G,so=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=oo}=i;no=this._renderer.getRenderTarget(),ro=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ho(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=mo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(no,ro,io),this._renderer.xr.enabled=ao,e.scissorTest=!1,uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),no=this._renderer.getRenderTarget(),ro=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:B,depthBuffer:!1},r=lo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lo(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=co(r)),this._blurMaterial=po(r,e,t),this._ggxMaterial=fo(r,e,t)}return r}_compileMaterial(e){let t=new Y(new wr,e);this._renderer.compile(t,eo)}_sceneToCubeUV(e,t,n,r,i){let a=new da(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(to),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Y(new vi,new Fr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(to),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;uo(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ho()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=mo());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;uo(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,eo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Xa?n-d+Xa:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,uo(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,eo),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,uo(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,eo)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&H(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Qa;m>Qa&&V(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Qa}`);let h=[],g=0;for(let e=0;e<Qa;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];uo(t,3*v*(r>_-Xa?r-_+Xa:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,eo)}};function co(e){let t=[],n=[],r=[],i=e,a=e-Xa+1+Za.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Xa?s=Za[o-e+Xa-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new wr;h.setAttribute(`position`,new lr(f,3)),h.setAttribute(`uv`,new lr(p,2)),h.setAttribute(`faceIndex`,new lr(m,1)),r.push(new Y(h,null)),i>Xa&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function lo(e,t,n){let r=new Wt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function uo(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function fo(e,t,n){return new Ni({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:$a,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function po(e,t,n){let r=new Float32Array(Qa),i=new G(0,1,0);return new Ni({name:`SphericalGaussianBlur`,defines:{n:Qa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mo(){return new Ni({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ho(){return new Ni({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function go(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var _o=class extends Wt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new pi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new vi(5,5,5),i=new Ni({name:`CubemapFromEquirect`,uniforms:Ti(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Y(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new _a(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function vo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new _o(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new so(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new so(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function yo(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ye(`WebGLRenderer: `+e+` extension not supported.`),t}}}function bo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?dr:ur)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function xo(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function So(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:H(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Co(e,t,n){let r=new WeakMap,i=new Ht;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new Gt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new W(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function wo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var To={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Eo(e,t,n,r,i,a){let o=new Wt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new hi(t,n):void 0}),s=new Wt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new wr;c.setAttribute(`position`,new fr([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new fr([0,2,0,0,2,0],2));let l=new Pi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Y(c,l),d=new fa(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},q.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=To[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(u,d),_=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Do=new Vt,Oo=new hi(1,1),ko=new Gt,Ao=new Kt,jo=new pi,Mo=[],No=[],Po=new Float32Array(16),Fo=new Float32Array(9),Io=new Float32Array(4);function Lo(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Mo[i];if(a===void 0&&(a=new Float32Array(i),Mo[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ro(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function zo(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Bo(e,t){let n=No[t];n===void 0&&(n=new Int32Array(t),No[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Vo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ho(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ro(n,t))return;e.uniform2fv(this.addr,t),zo(n,t)}}function Uo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ro(n,t))return;e.uniform3fv(this.addr,t),zo(n,t)}}function Wo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ro(n,t))return;e.uniform4fv(this.addr,t),zo(n,t)}}function Go(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ro(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),zo(n,t)}else{if(Ro(n,r))return;Io.set(r),e.uniformMatrix2fv(this.addr,!1,Io),zo(n,r)}}function Ko(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ro(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),zo(n,t)}else{if(Ro(n,r))return;Fo.set(r),e.uniformMatrix3fv(this.addr,!1,Fo),zo(n,r)}}function qo(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ro(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),zo(n,t)}else{if(Ro(n,r))return;Po.set(r),e.uniformMatrix4fv(this.addr,!1,Po),zo(n,r)}}function Jo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Yo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ro(n,t))return;e.uniform2iv(this.addr,t),zo(n,t)}}function Xo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ro(n,t))return;e.uniform3iv(this.addr,t),zo(n,t)}}function Zo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ro(n,t))return;e.uniform4iv(this.addr,t),zo(n,t)}}function Qo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function $o(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ro(n,t))return;e.uniform2uiv(this.addr,t),zo(n,t)}}function es(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ro(n,t))return;e.uniform3uiv(this.addr,t),zo(n,t)}}function ts(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ro(n,t))return;e.uniform4uiv(this.addr,t),zo(n,t)}}function ns(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Oo.compareFunction=n.isReversedDepthBuffer()?518:515,a=Oo):a=Do,n.setTexture2D(t||a,i)}function rs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ao,i)}function is(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||jo,i)}function as(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||ko,i)}function os(e){switch(e){case 5126:return Vo;case 35664:return Ho;case 35665:return Uo;case 35666:return Wo;case 35674:return Go;case 35675:return Ko;case 35676:return qo;case 5124:case 35670:return Jo;case 35667:case 35671:return Yo;case 35668:case 35672:return Xo;case 35669:case 35673:return Zo;case 5125:return Qo;case 36294:return $o;case 36295:return es;case 36296:return ts;case 35678:case 36198:case 36298:case 36306:case 35682:return ns;case 35679:case 36299:case 36307:return rs;case 35680:case 36300:case 36308:case 36293:return is;case 36289:case 36303:case 36311:case 36292:return as}}function ss(e,t){e.uniform1fv(this.addr,t)}function cs(e,t){let n=Lo(t,this.size,2);e.uniform2fv(this.addr,n)}function ls(e,t){let n=Lo(t,this.size,3);e.uniform3fv(this.addr,n)}function us(e,t){let n=Lo(t,this.size,4);e.uniform4fv(this.addr,n)}function ds(e,t){let n=Lo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function fs(e,t){let n=Lo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ps(e,t){let n=Lo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function ms(e,t){e.uniform1iv(this.addr,t)}function hs(e,t){e.uniform2iv(this.addr,t)}function gs(e,t){e.uniform3iv(this.addr,t)}function _s(e,t){e.uniform4iv(this.addr,t)}function vs(e,t){e.uniform1uiv(this.addr,t)}function ys(e,t){e.uniform2uiv(this.addr,t)}function bs(e,t){e.uniform3uiv(this.addr,t)}function xs(e,t){e.uniform4uiv(this.addr,t)}function Ss(e,t,n){let r=this.cache,i=t.length,a=Bo(n,i);Ro(r,a)||(e.uniform1iv(this.addr,a),zo(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Oo:Do;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Cs(e,t,n){let r=this.cache,i=t.length,a=Bo(n,i);Ro(r,a)||(e.uniform1iv(this.addr,a),zo(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ao,a[e])}function ws(e,t,n){let r=this.cache,i=t.length,a=Bo(n,i);Ro(r,a)||(e.uniform1iv(this.addr,a),zo(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||jo,a[e])}function Ts(e,t,n){let r=this.cache,i=t.length,a=Bo(n,i);Ro(r,a)||(e.uniform1iv(this.addr,a),zo(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||ko,a[e])}function Es(e){switch(e){case 5126:return ss;case 35664:return cs;case 35665:return ls;case 35666:return us;case 35674:return ds;case 35675:return fs;case 35676:return ps;case 5124:case 35670:return ms;case 35667:case 35671:return hs;case 35668:case 35672:return gs;case 35669:case 35673:return _s;case 5125:return vs;case 36294:return ys;case 36295:return bs;case 36296:return xs;case 35678:case 36198:case 36298:case 36306:case 35682:return Ss;case 35679:case 36299:case 36307:return Cs;case 35680:case 36300:case 36308:case 36293:return ws;case 36289:case 36303:case 36311:case 36292:return Ts}}var Ds=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=os(t.type)}},Os=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Es(t.type)}},ks=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},As=/(\w+)(\])?(\[|\.)?/g;function js(e,t){e.seq.push(t),e.map[t.id]=t}function Ms(e,t,n){let r=e.name,i=r.length;for(As.lastIndex=0;;){let a=As.exec(r),o=As.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){js(n,l===void 0?new Ds(s,e,t):new Os(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new ks(s),js(n,e)),n=e}}}var Ns=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Ms(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ps(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Fs=37297,Is=0;function Ls(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Rs=new K;function zs(e){q._getMatrix(Rs,q.workingColorSpace,e);let t=`mat3( ${Rs.elements.map(e=>e.toFixed(4))} )`;switch(q.getTransfer(e)){case Le:return[t,`LinearTransferOETF`];case Re:return[t,`sRGBTransferOETF`];default:return V(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Bs(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Ls(e.getShaderSource(t),r)}return i}function Vs(e,t){let n=zs(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Hs={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Us(e,t){let n=Hs[t];return n===void 0?(V(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ws=new G;function Gs(){return q.getLuminanceCoefficients(Ws),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ws.x.toFixed(4)}, ${Ws.y.toFixed(4)}, ${Ws.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ks(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ys).join(`
`)}function qs(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Js(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ys(e){return e!==``}function Xs(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zs(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Qs=/^[ \t]*#include +<([\w\d./]+)>/gm;function $s(e){return e.replace(Qs,tc)}var ec=new Map;function tc(e,t){let n=X[t];if(n===void 0){let e=ec.get(t);if(e!==void 0)n=X[e],V(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return $s(n)}var nc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rc(e){return e.replace(nc,ic)}function ic(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ac(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var oc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function sc(e){return oc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var cc={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function lc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:cc[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var uc={302:`ENVMAP_MODE_REFRACTION`};function dc(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:uc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var fc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function pc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:fc[e.combine]||`ENVMAP_BLENDING_NONE`}function mc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function hc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=sc(n),l=lc(n),u=dc(n),d=pc(n),f=mc(n),p=Ks(n),m=qs(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ys).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ys).join(`
`),_.length>0&&(_+=`
`)):(g=[ac(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ys).join(`
`),_=[ac(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:Us(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,Vs(`linearToOutputTexel`,n.outputColorSpace),Gs(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ys).join(`
`)),o=$s(o),o=Xs(o,n),o=Zs(o,n),s=$s(s),s=Xs(s,n),s=Zs(s,n),o=rc(o),s=rc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Ps(i,i.VERTEX_SHADER,y),S=Ps(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Bs(i,x,`vertex`),n=Bs(i,S,`fragment`);H(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):V(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Ns(i,h),T=Js(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Fs)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Is++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var gc=0,_c=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new vc(e),t.set(e,n)),n}},vc=class{constructor(e){this.id=gc++,this.code=e,this.usedTimes=0}};function yc(e){return e===1030||e===37490||e===36285}function bc(e,t,n,r,i,a){let o=new an,s=new _c,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&V(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Va[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let ee=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,te=h.isBatchedMesh===!0,N=!!i.map,P=!!i.matcap,ne=!!x,re=!!i.aoMap,ie=!!i.lightMap,ae=!!i.bumpMap&&i.wireframe===!1,oe=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,F=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=ue&&!!i.anisotropyMap,_e=de&&!!i.clearcoatMap,ve=de&&!!i.clearcoatNormalMap,ye=de&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,xe=pe&&!!i.iridescenceThicknessMap,Se=me&&!!i.sheenColorMap,Ce=me&&!!i.sheenRoughnessMap,we=!!i.specularMap,Te=!!i.specularColorMap,Ee=!!i.specularIntensityMap,De=he&&!!i.transmissionMap,Oe=he&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,I=!!i.extensions,Ne=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ne=e.toneMapping);let L={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:te,batchingColor:te&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:q.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:P,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:oe,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:oe&&i.normalMapType===1,normalMapTangentSpace:oe&&i.normalMapType===0,packedNormalMap:oe&&i.normalMapType===0&&yc(i.normalMap.format),metalnessMap:F,roughnessMap:le,anisotropy:ue,anisotropyMap:ge,clearcoat:de,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:xe,sheen:me,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:he,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:N&&m(i.map.channel),aoMapUv:re&&m(i.aoMap.channel),lightMapUv:ie&&m(i.lightMap.channel),bumpMapUv:ae&&m(i.bumpMap.channel),normalMapUv:oe&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:F&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&m(i.sheenRoughnessMap.channel),specularMapUv:we&&m(i.specularMap.channel),specularColorMapUv:Te&&m(i.specularColorMap.channel),specularIntensityMapUv:Ee&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:Ae&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(oe||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(N||Ae),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&oe===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&q.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&q.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:I&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(I&&i.extensions.multiDraw===!0||te)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return L.vertexUv1s=c.has(1),L.vertexUv2s=c.has(2),L.vertexUv3s=c.has(3),c.clear(),L}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Va[t];n=Ai.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new hc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function xc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Sc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Cc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function wc(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Sc),r.length>1&&r.sort(t||Cc),i.length>1&&i.sort(t||Cc),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Tc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new wc,e.set(t,[i])):n>=r.length?(i=new wc,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ec(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new G,color:new J};break;case`SpotLight`:n={position:new G,direction:new G,color:new J,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new J,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new J,groundColor:new J};break;case`RectAreaLight`:n={color:new J,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function Dc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Oc=0;function kc(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ac(e){let t=new Ec,n=Dc(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new qt,o=new qt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(kc);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Oc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function jc(e){let t=new Ac(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Mc(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new jc(e),t.set(n,[a])):r>=i.length?(a=new jc(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Nc=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pc=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Fc=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Ic=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Lc=new qt,Rc=new G,zc=new G;function Bc(e,t,n){let i=new fi,a=new W,s=new W,c=new Ht,l=new Ii,u=new Li,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new Ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:Nc,fragmentShader:Pc}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new wr;y.setAttribute(`position`,new lr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new Y(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(V(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){V(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){V(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Wt(a.x,a.y,{format:k,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new hi(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new _o(a.x),p.map.depthTexture=new gi(a.x,m)):(p.map=new Wt(a.x,a.y),p.map.depthTexture=new hi(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}let x=p.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<x;t++){if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Rc.setFromMatrixPosition(d.matrixWorld),e.position.copy(Rc),zc.copy(e.position),zc.add(Fc[t]),e.up.copy(Ic[t]),e.lookAt(zc),e.updateMatrixWorld(),n.makeTranslation(-Rc.x,-Rc.y,-Rc.z),Lc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Lc,e.coordinateSystem,e.reversedDepth)}else p.updateMatrices(d);i=p.getFrustum(),E(n,l,p.camera,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Wt(a.x,a.y,{format:k,type:g})),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value=n.mapSize,_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value=n.mapSize,v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||i.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Vc(e,t){function n(){let t=!1,n=new Ht,r=null,i=new Ht(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Ze[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,N=e.getParameter(e.VERSION);N.indexOf(`WebGL`)===-1?N.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(N)[1]),M=te>=1);let P=null,ne={},re=e.getParameter(e.SCISSOR_BOX),ie=e.getParameter(e.VIEWPORT),ae=new Ht().fromArray(re),oe=new Ht().fromArray(ie);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),F(e.CULL_FACE),he(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(le(e.BLEND),g=!1);return}if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:H(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:H(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:H(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:H(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?le(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?le(e.CULL_FACE):(F(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ye(t){t!==k&&(M&&e.lineWidth(t),k=t)}function be(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function xe(t){t?F(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function Se(t){t===void 0&&(t=e.TEXTURE0+j-1),P!==t&&(e.activeTexture(t),P=t)}function Ce(t,n,r){r===void 0&&(r=P===null?e.TEXTURE0+j-1:P);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(P!==r&&(e.activeTexture(r),P=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function we(){let t=ne[P];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Oe(){try{e.texSubImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function je(){try{e.texStorage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Me(){try{e.texStorage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function I(){try{e.texImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function L(t){return d[t]===void 0?e.getParameter(t):d[t]}function Pe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function R(t){ae.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ae.copy(t))}function Fe(t){oe.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),oe.copy(t))}function z(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function B(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},P=null,ne={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,ae.set(0,0,e.canvas.width,e.canvas.height),oe.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:Se,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:I,texImage3D:Ne,pixelStorei:Pe,getParameter:L,updateUBOMapping:z,uniformBlockBinding:Ie,texStorage2D:je,texStorage3D:Me,texSubImage2D:De,texSubImage3D:Oe,compressedTexSubImage2D:ke,compressedTexSubImage3D:Ae,scissor:R,viewport:Fe,reset:B}}function Hc(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new W,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):We(`canvas`)}function T(e,t,n){let r=1,i=L(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),V(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&V(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function D(e){return e.generateMipmaps}function O(e){l.generateMipmap(e)}function k(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function A(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];V(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||V(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?Le:q.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function ee(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,V(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function j(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),N(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t)}function N(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&P(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function P(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function ne(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let re=0;function ie(){re=0}function ae(){return re}function oe(e){re=e}function se(){let e=re;return e>=p.maxTextures&&V(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),re+=1,e}function ce(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function F(e,t){let n=f.get(e);if(e.isVideoTexture&&I(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)V(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)V(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ye(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function le(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){ye(n,e,t);return}e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t)}function ue(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){ye(n,e,t);return}d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function de(e,t){let n=f.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version){be(n,e,t);return}d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let fe={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},pe={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},me={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function he(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&V(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,fe[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,fe[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,fe[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,pe[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,pe[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,me[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function ge(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,M));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=ce(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&P(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function _e(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ve(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=_e(r.start,t.width,4),c=_e(n.start,t.width,4);r.start<=o+1&&s===c&&_e(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function ye(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=ge(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=q.getPrimaries(q.workingColorSpace),n=t.colorSpace===``?null:q.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=Ne(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=A(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);he(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=j(t,e);if(t.isDepthTexture)u=ee(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&ve(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=La(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}t.clearLayerUpdates()}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data)}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=La(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=L(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=L(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&O(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function be(e,t,n){if(t.image.length!==6)return;let r=ge(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=q.getPrimaries(q.workingColorSpace),o=t.colorSpace===``?null:q.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Ne(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=A(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=j(t,h);he(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=L(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&O(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function xe(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=A(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),Me(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,je(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Se(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=ee(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;Me(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,je(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,je(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=A(i.internalFormat,a,o,i.normalized,i.colorSpace);Me(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,je(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,je(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function Ce(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,M)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),he(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else F(t.depthTexture,0);let a=i.__webglTexture,o=je(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)Me(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)Me(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function we(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)Ce(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?Ce(t.__webglFramebuffer[0],e,0):Ce(t.__webglFramebuffer,e,0)}}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Se(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Se(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Te(e,t,n){let r=f.get(e);t!==void 0&&xe(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&we(e)}function Ee(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,te);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&Me(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=A(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=je(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Se(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),he(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)xe(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else xe(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&O(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),he(o,r),xe(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&O(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),he(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)xe(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else xe(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&O(i),d.unbindTexture()}e.depthBuffer&&we(e)}function De(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=k(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),O(t),d.unbindTexture()}}}let Oe=[],ke=[];function Ae(e){if(e.samples>0){if(Me(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(Oe.length=0,ke.length=0,Oe.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.resolveDepthBuffer===!1&&(Oe.push(a),ke.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,ke)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,Oe))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.resolveDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function je(e){return Math.min(p.maxSamples,e.samples)}function Me(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function I(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Ne(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(q.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&V(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):H(`WebGLTextures: Unsupported texture color space:`,n)),t}function L(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=se,this.resetTextureUnits=ie,this.getTextureUnits=ae,this.setTextureUnits=oe,this.setTexture2D=F,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Te,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=Me,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function Uc(e,t){function n(n,r=``){let i,a=q.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Wc=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gc=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new _i(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ni({vertexShader:Wc,fragmentShader:Gc,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Y(new Ci(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},qc=class extends Qe{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Kc,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],O=new W,k=null,A=new da;A.viewport=new Ht;let ee=new da;ee.viewport=new Ht;let j=[A,ee],M=new va,te=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new wn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new wn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new wn,C[e]=t),t.getHandSpace()};function P(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,P),r.removeEventListener(`selectstart`,P),r.removeEventListener(`selectend`,P),r.removeEventListener(`squeeze`,P),r.removeEventListener(`squeezestart`,P),r.removeEventListener(`squeezeend`,P),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,re);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}te=null,N=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&V(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&V(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,P),r.addEventListener(`selectstart`,P),r.addEventListener(`selectend`,P),r.addEventListener(`squeeze`,P),r.addEventListener(`squeezestart`,P),r.addEventListener(`squeezeend`,P),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,re),b.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Wt(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new hi(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Wt(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function re(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let ie=new G,ae=new G;function oe(e,t,n){ie.setFromMatrixPosition(t.matrixWorld),ae.setFromMatrixPosition(n.matrixWorld);let r=ie.distanceTo(ae),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),M.near=ee.near=A.near=t,M.far=ee.far=A.far=n,(te!==M.near||N!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),te=M.near,N=M.far),M.layers.mask=e.layers.mask|6,A.layers.mask=M.layers.mask&-5,ee.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;se(M,i);for(let e=0;e<a.length;e++)se(a[e],i);a.length===2?oe(M,A,ee):M.projectionMatrix.copy(A.projectionMatrix),ce(e,M,i)};function ce(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=nt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let F=null;function le(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=j[n];o===void 0&&(o=new da,o.layers.enable(n),o.viewport=new Ht,j[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new _i,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let ue=new za;ue.setAnimationLoop(le),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},Jc=new qt,Yc=new K;Yc.set(-1,0,0,0,1,0,0,0,1);function Xc(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ki(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Jc.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Yc),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Zc(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return H(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?V(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):V(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Qc=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),$c=null;function el(){return $c===null&&($c=new Yr(Qc,16,16,k,g),$c.name=`DFG_LUT`,$c.minFilter=o,$c.magFilter=o,$c.wrapS=t,$c.wrapT=t,$c.generateMipmaps=!1,$c.needsUpdate=!0),$c}var tl=class{constructor(e={}){let{canvas:t=Ge(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([ee,A,O]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new G,k=null,j=null,M=[],te=[],N=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,ne=!1,re=null,ie=null,ae=null,oe=null;this._outputColorSpace=Ie;let se=0,ce=0,F=null,le=-1,ue=null,de=new Ht,fe=new Ht,pe=null,me=new J(0),he=0,ge=t.width,_e=t.height,ve=1,ye=null,be=null,xe=new Ht(0,0,ge,_e),Se=new Ht(0,0,ge,_e),Ce=!1,we=new fi,Te=!1,Ee=!1,De=new qt,Oe=new G,ke=new Ht,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},je=!1;function Me(){return F===null?ve:1}let I=n;function Ne(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,at,!1),t.addEventListener(`webglcontextrestored`,ot,!1),t.addEventListener(`webglcontextcreationerror`,st,!1),I===null){let t=`webgl2`;if(I=Ne(t,e),I===null)throw Ne(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw H(`WebGLRenderer: `+e.message),e}let L,Pe,R,Fe,z,B,Le,Re,ze,Be,He,Ue,We,Ke,Je,Ye,Ze,Qe,$e,et,tt,nt,rt;function U(){L=new yo(I),L.init(),tt=new Uc(I,L),Pe=new Ja(I,L,e,tt),R=new Vc(I,L),Pe.reversedDepthBuffer&&h&&R.buffers.depth.setReversed(!0),ie=I.createFramebuffer(),ae=I.createFramebuffer(),oe=I.createFramebuffer(),Fe=new So(I),z=new xc,B=new Hc(I,L,R,z,Pe,tt,Fe),Le=new vo(P),Re=new Ba(I),nt=new Ka(I,Re),ze=new bo(I,Re,Fe,nt),Be=new wo(I,ze,Re,nt,Fe),Qe=new Co(I,Pe,B),Je=new Ya(z),He=new bc(P,Le,L,Pe,nt,Je),Ue=new Xc(P,z),We=new Tc,Ke=new Mc(L),Ze=new Ga(P,Le,R,Be,x,s),Ye=new Bc(P,Be,Pe),rt=new Zc(I,Fe,Pe,R),$e=new qa(I,L,Fe),et=new xo(I,L,Fe),Fe.programs=He.programs,P.capabilities=Pe,P.extensions=L,P.properties=z,P.renderLists=We,P.shadowMap=Ye,P.state=R,P.info=Fe}U(),S!==1009&&(N=new Eo(S,t.width,t.height,o,r,i));let it=new qc(P,I);this.xr=it,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let e=L.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=L.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(e){e!==void 0&&(ve=e,this.setSize(ge,_e,!1))},this.getSize=function(e){return e.set(ge,_e)},this.setSize=function(e,n,r=!0){if(it.isPresenting){V(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ge=e,_e=n,t.width=Math.floor(e*ve),t.height=Math.floor(n*ve),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),N!==null&&N.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ge*ve,_e*ve).floor()},this.setDrawingBufferSize=function(e,n,r){ge=e,_e=n,ve=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){H(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){V(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}N.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(de)},this.getViewport=function(e){return e.copy(xe)},this.setViewport=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),R.viewport(de.copy(xe).multiplyScalar(ve).round())},this.getScissor=function(e){return e.copy(Se)},this.setScissor=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),R.scissor(fe.copy(Se).multiplyScalar(ve).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(e){R.setScissorTest(Ce=e)},this.setOpaqueSort=function(e){ye=e},this.setTransparentSort=function(e){be=e},this.getClearColor=function(e){return e.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(F!==null){let t=F.texture.format;e=C.has(t)}if(e){let e=F.texture.type,t=w.has(e),n=Ze.getClearColor(),r=Ze.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,I.clearBufferuiv(I.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,I.clearBufferiv(I.COLOR,0,E))}else r|=I.COLOR_BUFFER_BIT}t&&(r|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&I.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),re=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,at,!1),t.removeEventListener(`webglcontextrestored`,ot,!1),t.removeEventListener(`webglcontextcreationerror`,st,!1),Ze.dispose(),We.dispose(),Ke.dispose(),z.dispose(),Le.dispose(),Be.dispose(),nt.dispose(),rt.dispose(),He.dispose(),it.dispose(),it.removeEventListener(`sessionstart`,mt),it.removeEventListener(`sessionend`,ht),gt.stop()};function at(e){e.preventDefault(),qe(`WebGLRenderer: Context Lost.`),ne=!0}function ot(){qe(`WebGLRenderer: Context Restored.`),ne=!1;let e=Fe.autoReset,t=Ye.enabled,n=Ye.autoUpdate,r=Ye.needsUpdate,i=Ye.type;U(),Fe.autoReset=e,Ye.enabled=t,Ye.autoUpdate=n,Ye.needsUpdate=r,Ye.type=i}function st(e){H(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ct(e){let t=e.target;t.removeEventListener(`dispose`,ct),lt(t)}function lt(e){ut(e),z.remove(e)}function ut(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){He.releaseProgram(e)}),e.isShaderMaterial&&He.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ae);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Tt(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;nt.setup(i,r,s,n,c);let h,g=$e;if(c!==null&&(h=Re.get(c),g=et,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*Me()),g.setMode(I.LINES)):g.setMode(I.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*Me()),i.isLineSegments?g.setMode(I.LINES):i.isLineLoop?g.setMode(I.LINE_LOOP):g.setMode(I.LINE_STRIP)}else i.isPoints?g.setMode(I.POINTS):i.isSprite&&g.setMode(I.TRIANGLES);if(i.isBatchedMesh){if(L.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Re.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(I,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function dt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,St(e,t,n),e.side=0,e.needsUpdate=!0,St(e,t,n),e.side=2):St(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),j=Ke.get(n),j.init(t),te.push(j),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),j.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];dt(a,n,e),r.add(a)}else dt(t,n,e),r.add(t)}}),j=te.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){z.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}L.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ft=null;function pt(e){ft&&ft(e)}function mt(){gt.stop()}function ht(){gt.start()}let gt=new za;gt.setAnimationLoop(pt),typeof self<`u`&&gt.setContext(self),this.setAnimationLoop=function(e){ft=e,it.setAnimationLoop(e),e===null?gt.stop():gt.start()},it.addEventListener(`sessionstart`,mt),it.addEventListener(`sessionend`,ht),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){H(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ne===!0)return;re!==null&&re.renderStart(e,t);let n=it.enabled===!0&&it.isPresenting===!0,r=N!==null&&(F===null||n)&&N.begin(P,F);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(it.cameraAutoUpdate===!0&&it.updateCamera(t),t=it.getCamera()),e.isScene===!0&&e.onBeforeRender(P,e,t,F),j=Ke.get(e,te.length),j.init(t),j.state.textureUnits=B.getTextureUnits(),te.push(j),De.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),we.setFromProjectionMatrix(De,Ve,t.reversedDepth),Ee=this.localClippingEnabled,Te=Je.init(this.clippingPlanes,Ee),k=We.get(e,M.length),k.init(),M.push(k),it.enabled===!0&&it.isPresenting===!0){let e=P.xr.getDepthSensingMesh();e!==null&&_t(e,t,-1/0,P.sortObjects)}_t(e,t,0,P.sortObjects),k.finish(),P.sortObjects===!0&&k.sort(ye,be,t.reversedDepth),je=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,je&&Ze.addToRenderList(k,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Te===!0&&Je.beginShadows();let i=j.state.shadowsArray;if(Ye.render(i,e,t),Te===!0&&Je.endShadows(),(r&&N.hasRenderPass())===!1){let n=k.opaque,r=k.transmissive;if(j.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];yt(n,r,e,a)}je&&Ze.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];vt(k,e,n,n.viewport)}}else r.length>0&&yt(n,r,e,t),je&&Ze.render(e),vt(k,e,t)}F!==null&&ce===0&&(B.updateMultisampleRenderTarget(F),B.updateRenderTargetMipmap(F)),r&&N.end(P),e.isScene===!0&&e.onAfterRender(P,e,t),nt.resetDefaultState(),le=-1,ue=null,te.pop(),te.length>0?(j=te[te.length-1],B.setTextureUnits(j.state.textureUnits),Te===!0&&Je.setGlobalState(P.clippingPlanes,j.state.camera)):j=null,M.pop(),k=M.length>0?M[M.length-1]:null,re!==null&&re.renderEnd()};function _t(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)j.pushLightProbeGrid(e);else if(e.isLight)j.pushLight(e),e.castShadow&&j.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||we.intersectsSprite(e)){r&&ke.setFromMatrixPosition(e.matrixWorld).applyMatrix4(De);let t=Be.update(e),i=e.material;i.visible&&k.push(e,t,i,n,ke.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||we.intersectsObject(e))){let t=Be.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),ke.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ke.copy(e.boundingSphere.center)),ke.applyMatrix4(e.matrixWorld).applyMatrix4(De)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&k.push(e,t,s,n,ke.z,o)}}else i.visible&&k.push(e,t,i,n,ke.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)_t(i[e],t,n,r)}function vt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;j.setupLightsView(n),Te===!0&&Je.setGlobalState(P.clippingPlanes,n),r&&R.viewport(de.copy(r)),i.length>0&&bt(i,t,n),a.length>0&&bt(a,t,n),o.length>0&&bt(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function yt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(j.state.transmissionRenderTarget[r.id]===void 0){let e=L.has(`EXT_color_buffer_half_float`)||L.has(`EXT_color_buffer_float`);j.state.transmissionRenderTarget[r.id]=new Wt(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Pe.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:q.workingColorSpace})}let a=j.state.transmissionRenderTarget[r.id],o=r.viewport||de;a.setSize(o.z*P.transmissionResolutionScale,o.w*P.transmissionResolutionScale);let s=P.getRenderTarget(),u=P.getActiveCubeFace(),d=P.getActiveMipmapLevel();P.setRenderTarget(a),P.getClearColor(me),he=P.getClearAlpha(),he<1&&P.setClearColor(16777215,.5),P.clear(),je&&Ze.render(n);let f=P.toneMapping;P.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),j.setupLightsView(r),Te===!0&&Je.setGlobalState(P.clippingPlanes,r),bt(e,n,r),B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a),L.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,xt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a))}P.setRenderTarget(s,u,d),P.setClearColor(me,he),p!==void 0&&(r.viewport=p),P.toneMapping=f}function bt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&xt(o,t,n,s,l,c)}}function xt(e,t,n,r,i,a){e.onBeforeRender(P,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(P,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=2):P.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(P,t,n,r,i,a)}function St(e,t,n){t.isScene!==!0&&(t=Ae);let r=z.get(e),i=j.state.lights,a=j.state.shadowsArray,o=i.state.version,s=He.getParameters(e,i.state,a,t,n,j.state.lightProbeGridArray),c=He.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ct),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return wt(e,s),d}else s.uniforms=He.getUniforms(e),re!==null&&e.isNodeMaterial&&re.build(e,n,s),e.onBeforeCompile(s,P),d=He.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Je.uniform),wt(e,s),r.needsLights=Dt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=j.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Ct(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Ns.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function wt(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function W(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Tt(e,t,n,r,i){t.isScene!==!0&&(t=Ae),B.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=F===null?P.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:q.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Le.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(h=P.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),y=j.state.lights;if(Te===!0&&(Ee===!0||e!==ue)){let t=e===ue&&r.id===le;Je.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Je.numPlanes||v.numIntersection!==Je.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=j.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=St(r,t,i),re&&r.isNodeMaterial&&re.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(R.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==le&&(le=r.id,C=!0),v.needsLights){let e=W(j.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||ue!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(I,`projectionMatrix`,e.projectionMatrix),T.setValue(I,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(I,Oe.setFromMatrixPosition(e.matrixWorld)),Pe.logarithmicDepthBuffer&&T.setValue(I,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(I,`isOrthographic`,e.isOrthographicCamera===!0),ue!==e&&(ue=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(I,`directionalShadowMap`,y.state.directionalShadowMap,B),y.state.spotShadowMap.length>0&&T.setValue(I,`spotShadowMap`,y.state.spotShadowMap,B),y.state.pointShadowMap.length>0&&T.setValue(I,`pointShadowMap`,y.state.pointShadowMap,B)),i.isSkinnedMesh){T.setOptional(I,i,`bindMatrix`),T.setOptional(I,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(I,`boneTexture`,e.boneTexture,B))}i.isBatchedMesh&&(T.setOptional(I,i,`batchingTexture`),T.setValue(I,`batchingTexture`,i._matricesTexture,B),T.setOptional(I,i,`batchingIdTexture`),T.setValue(I,`batchingIdTexture`,i._indirectTexture,B),T.setOptional(I,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(I,`batchingColorTexture`,i._colorsTexture,B));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Qe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(I,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=el()),C){if(T.setValue(I,`toneMappingExposure`,P.toneMappingExposure),v.needsLights&&Et(E,w),a&&r.fog===!0&&Ue.refreshFogUniforms(E,a),Ue.refreshMaterialUniforms(E,r,ve,_e,j.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Ns.upload(I,Ct(v),E,B)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Ns.upload(I,Ct(v),E,B),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(I,`center`,i.center),T.setValue(I,`modelViewMatrix`,i.modelViewMatrix),T.setValue(I,`normalMatrix`,i.normalMatrix),T.setValue(I,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function Et(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Dt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return se},this.getActiveMipmapLevel=function(){return ce},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){F=e,se=t,ce=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(I.FRAMEBUFFER,o.__webglFramebuffer),de.copy(e.viewport),fe.copy(e.scissor),pe=e.scissorTest,R.viewport(de),R.scissor(fe),R.setScissorTest(pe),le=-1;return}if(o.__webglFramebuffer===void 0)B.setupRenderTarget(e);else if(o.__hasExternalTextures)B.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);B.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&B.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,de.copy(e.viewport),fe.copy(e.scissor),pe=e.scissorTest}else de.copy(xe).multiplyScalar(ve).floor(),fe.copy(Se).multiplyScalar(ve).floor(),pe=Ce;if(n!==0&&(r=ie),R.bindFramebuffer(I.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(de),R.scissor(fe),R.setScissorTest(pe),i){let r=z.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,t.__webglTexture,n)}le=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(I.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(c)){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Pe.textureTypeReadable(l)){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&I.readPixels(t,n,r,i,tt.convert(c),tt.convert(l),a)}finally{let e=F===null?null:z.get(F).__webglFramebuffer;R.bindFramebuffer(I.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(I.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Pe.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.bufferData(I.PIXEL_PACK_BUFFER,a.byteLength,I.STREAM_READ),I.readPixels(t,n,r,i,tt.convert(l),tt.convert(u),0);let f=F===null?null:z.get(F).__webglFramebuffer;R.bindFramebuffer(I.FRAMEBUFFER,f);let p=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Xe(I,p,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,a),I.deleteBuffer(d),I.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;B.setTexture2D(e,0),I.copyTexSubImage2D(I.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=tt.convert(t.format),_=tt.convert(t.type),v;t.isData3DTexture?(B.setTexture3D(t,0),v=I.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(B.setTexture2DArray(t,0),v=I.TEXTURE_2D_ARRAY):(B.setTexture2D(t,0),v=I.TEXTURE_2D),R.activeTexture(I.TEXTURE0),R.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(I.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(I.UNPACK_ROW_LENGTH),b=R.getParameter(I.UNPACK_IMAGE_HEIGHT),x=R.getParameter(I.UNPACK_SKIP_PIXELS),S=R.getParameter(I.UNPACK_SKIP_ROWS),C=R.getParameter(I.UNPACK_SKIP_IMAGES);R.pixelStorei(I.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(I.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(I.UNPACK_SKIP_PIXELS,l),R.pixelStorei(I.UNPACK_SKIP_ROWS,u),R.pixelStorei(I.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(I.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(I.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),I.blitFramebuffer(l,u,o,s,f,p,o,s,I.DEPTH_BUFFER_BIT,I.NEAREST);R.bindFramebuffer(I.READ_FRAMEBUFFER,null),R.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(I.READ_FRAMEBUFFER,ae),R.bindFramebuffer(I.DRAW_FRAMEBUFFER,oe);for(let e=0;e<c;e++)w?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,n.__webglTexture,i),T?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,r.__webglTexture,a),i===0?T?I.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):I.copyTexSubImage2D(v,a,f,p,l,u,o,s):I.blitFramebuffer(l,u,o,s,f,p,o,s,I.COLOR_BUFFER_BIT,I.NEAREST);R.bindFramebuffer(I.READ_FRAMEBUFFER,null),R.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?I.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(I.UNPACK_ROW_LENGTH,y),R.pixelStorei(I.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(I.UNPACK_SKIP_PIXELS,x),R.pixelStorei(I.UNPACK_SKIP_ROWS,S),R.pixelStorei(I.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&I.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&B.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?B.setTextureCube(e,0):e.isData3DTexture?B.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?B.setTexture2DArray(e,0):B.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){se=0,ce=0,F=null,R.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ve}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=q._getDrawingBufferColorSpace(e),t.unpackColorSpace=q._getUnpackColorSpace()}};function nl(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function rl(e){let t=nl(e);return{next:t,range:(e,n)=>e+(n-e)*t(),int:(e,n)=>Math.floor(e+(n-e+1)*t()),chance:e=>t()<e,sign:()=>t()<.5?-1:1,pick:e=>e[Math.floor(t()*e.length)]}}var il=4013373,al={value:new J(il)},ol=.034,sl={value:new Ht(ol,.22,.13,.18)},cl={value:new Ht(.009,.03,.55,0)},ll=`
uniform vec3 uLineView;
uniform vec4 uLine;
uniform float uLineW; // this material's pen, as a share of the creatures' line
uniform vec2 uLineSeed;
varying vec2 vLineQ; // where this point lands on the view plane, body axes, world units
varying vec3 vLineN; // view-space normal
float lineHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float lineNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = mix(lineHash(i), lineHash(i + vec2(1.0, 0.0)), u.x);
  float b = mix(lineHash(i + vec2(0.0, 1.0)), lineHash(i + vec2(1.0, 1.0)), u.x);
  return mix(a, b, u.y) * 2.0 - 1.0;
}
float lineFbm(vec2 p) { return 0.62 * lineNoise(p) + 0.38 * lineNoise(p * 2.37 + 17.0); }
vec3 lineShake(vec3 pos, vec3 nrm, float hull) {
#ifdef LINE_AUTO
  // Stage props: no per-mesh uniform. The view direction comes from the
  // model-view matrix (the cameras are orthographic), and the mesh's own
  // scale is taken out, so the line is uLineW pens wide whatever size the
  // shape was scaled to.
  vec3 S = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
  vec3 v = normalize((transpose(mat3(modelViewMatrix)) * vec3(0.0, 0.0, 1.0)) / S);
  float nl = length(nrm);
  pos *= S;
  nrm = normalize(nrm / S) * nl;
#else
  vec3 S = vec3(1.0);
  vec3 v = normalize(uLineView);
#endif
  float lw = uLine.x * uLineW;
  vec3 e1 = cross(vec3(0.0, 1.0, 0.0), v);
  float l = length(e1);
  e1 = l > 1e-4 ? e1 / l : vec3(1.0, 0.0, 0.0);
  vec3 e2 = cross(v, e1);
  vec2 flat2 = vec2(dot(pos, e1), dot(pos, e2));
  vec2 q = flat2 / uLine.z + uLineSeed;
  vLineQ = flat2 + uLineSeed;
  vLineN = normalMatrix * normal;
  vec3 nv = nrm - dot(nrm, v) * v; // the normal, flattened onto the view plane
  float rim = length(nv); // 1 on the silhouette, 0 facing the camera
  vec3 dir = rim > 1e-4 ? nv / rim : vec3(0.0);
  vec3 o = pos + dir * (lw * uLine.y * lineFbm(q) * min(rim, 1.0));
  if (hull > 0.5) o += nrm * (lw * (1.0 + uLine.w * lineFbm(q * 0.6 + 41.3)));
  return o / S;
}
`,ul=`
uniform vec4 uLine;
uniform float uLineW;
uniform vec4 uGrain;
uniform vec3 uLineInk;
varying vec2 vLineQ;
varying vec3 vLineN;
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float grainVal(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = mix(grainHash(i), grainHash(i + vec2(1.0, 0.0)), u.x);
  float b = mix(grainHash(i + vec2(0.0, 1.0)), grainHash(i + vec2(1.0, 1.0)), u.x);
  return mix(a, b, u.y);
}
float lineUnitsPerPixel() { return max(length(dFdx(vLineQ)), length(dFdy(vLineQ))); }
float lineDepth() {
  float f = abs(normalize(vLineN).z);
  float g = length(vec2(dFdx(f), dFdy(f)));
  return 0.5 * f / max(g, 1e-5) * lineUnitsPerPixel();
}
// How deep the frayed edge goes, in world units. A stroke only a few pixels
// wide (the stage view) keeps just a hint of it, or it breaks into dashes.
float lineFray() {
  float lw = uLine.x * uLineW;
  float px = lw / lineUnitsPerPixel();
  return max(uGrain.z * lw * clamp((px - 2.0) / 7.0, 0.2, 1.0), 1e-5);
}
// s: 0 at a frayed edge of the stroke .. 1 in its core. Returns ink coverage.
// With uGrain.w = 0 the core is solid; only the edges are eaten.
float lineInk(float s) {
  float upp = lineUnitsPerPixel();
  float fine = clamp(uGrain.x / upp - 0.6, 0.0, 1.0); // grain finer than a pixel fades out (no shimmer far away)
  float n = mix(grainVal(vLineQ / max(uGrain.y, 2.0 * upp)), grainVal(vLineQ / uGrain.x + 7.3), 0.6 * fine);
  float t = 1.1 * (1.0 - uGrain.w) * smoothstep(0.0, 1.0, s) - n - 0.05;
  return clamp(t / clamp(fwidth(t), 1e-4, 0.08) + 0.5, 0.0, 1.0);
}
`;function dl(e,t,n,{auto:r=!1,weight:i=1}={}){let a=r?`#define LINE_AUTO
`:``,o={uLineW:{value:i}};return e.onBeforeCompile=e=>{Object.assign(e.uniforms,t,o),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${a}${ll}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>\ntransformed = lineShake(transformed, normal, ${n?`1.0`:`0.0`});`);let r=`lineDepth() / lineFray()`;e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${a}${ul}`).replace(`#include <opaque_fragment>`,n?`float lineCov = lineInk(${r});\nif (lineCov < 0.3) discard;\ndiffuseColor.a *= lineCov;\n#include <opaque_fragment>`:`outgoingLight = mix(outgoingLight, uLineInk, lineInk(1.0 - ${r}));\n#include <opaque_fragment>`)},e.customProgramCacheKey=()=>`line-${n?`hull`:`body`}-${r?`auto`:`own`}`,n&&(e.alphaToCoverage=!0),e}var fl=new qt,pl=new G;function ml(e,t,n){t.getWorldDirection(pl).negate(),n.value.copy(pl).transformDirection(fl.copy(e.matrixWorld).invert())}var hl={uLine:sl,uGrain:cl,uLineInk:al,uLineView:{value:new G(0,0,1)},uLineSeed:{value:new W(7.3,19.1)}},gl=.8,_l=new Yr(new Uint8Array([238,250,255,255]),3,1,D);_l.minFilter=r,_l.magFilter=r,_l.needsUpdate=!0;var vl=new Map;function yl(e){let t=vl.get(e);return t||(t=dl(new Fi({color:e,gradientMap:_l}),hl,!1,{auto:!0,weight:gl}),vl.set(e,t)),t}function bl(){return dl(new Fi({vertexColors:!0,gradientMap:_l}),hl,!1,{auto:!0,weight:gl})}var xl=new Fr({color:il}),Sl=new Map;function Cl(e=gl){let t=e.toFixed(3),n=Sl.get(t);return n||(n=dl(new Fr({color:il,side:1}),hl,!0,{auto:!0,weight:e}),Sl.set(t,n)),n}var wl=new wi(1,16,12),Tl=new bi(1,1,1,14),El=new xi(1,1,14);new vi(1,1,1);var Dl=new Map;function Ol(e){let t=Dl.get(e);if(t)return t;let n=e.attributes.position,r=e.attributes.normal,i=new Map,a=e=>`${n.getX(e).toFixed(4)},${n.getY(e).toFixed(4)},${n.getZ(e).toFixed(4)}`;for(let e=0;e<n.count;e++){let t=a(e),n=i.get(t)||[],o=[r.getX(e),r.getY(e),r.getZ(e)];n.some(e=>e[0]*o[0]+e[1]*o[1]+e[2]*o[2]>.995)||n.push(o),i.set(t,n)}let o=!1;for(let e of i.values())e.length>1&&(o=!0);if(!o)return Dl.set(e,e),e;t=e.clone();let s=t.attributes.normal,c=new K,l=new G;for(let e=0;e<n.count;e++){let t=i.get(a(e));if(t.length===1)continue;let n=[.02,0,0,0,.02,0,0,0,.02];l.set(0,0,0);for(let e of t){for(let t=0;t<3;t++)for(let r=0;r<3;r++)n[t*3+r]+=e[t]*e[r];l.x+=e[0],l.y+=e[1],l.z+=e[2]}c.set(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8]).invert(),l.applyMatrix3(c),l.length()>2.2&&l.setLength(2.2),s.setXYZ(e,l.x,l.y,l.z)}return Dl.set(e,t),t}function kl(e,t,n=1,r=1,i=1,a=.02){let o=new Sn,s=new Y(e,typeof t==`number`?yl(t):t);s.scale.set(n,r,i);let c=new Y(Ol(e),Cl(gl*Math.max(.55,Math.min(1.25,a/.02))));return c.scale.set(n,r,i),c.userData.ink=!0,o.add(s,c),o.userData.body=s,o}var Al=(e,t,n=t,r=t,i)=>kl(wl,e,t,n,r,i);function jl(e,t,n=.014){let r=new Y(Tl,xl);return Pl(r,e,t,n),r}var Ml=new G,Nl=new G(0,1,0);function Pl(e,t,n,r=.014){Ml.subVectors(n,t);let i=Ml.length()||1e-4;e.position.copy(t).addScaledVector(Ml,.5),e.scale.set(r,i,r),e.quaternion.setFromUnitVectors(Nl,Ml.multiplyScalar(1/i))}function Fl(e,t=.14,n=28){let r=new yi(1,n),i=r.attributes.position,a=2+Math.floor(e()*2),o=4+Math.floor(e()*3),s=e()*Math.PI*2,c=e()*Math.PI*2;for(let e=1;e<i.count;e++){let n=Math.atan2(i.getY(e),i.getX(e)),r=1+t*(.6*Math.sin(a*n+s)+.4*Math.sin(o*n+c));i.setXY(e,Math.cos(n)*r,Math.sin(n)*r)}return r.rotateX(-Math.PI/2),r}var Il=e=>1+2.7*(e-1)**3+1.7*(e-1)**2;function Ll(e,t,n=1){let r=e.userData;r.pop===void 0&&(r.pop=1),r.pop<1&&(r.pop=Math.min(1,r.pop+t/.5)),r.boing=Math.max(0,(r.boing||0)-t*1.8);let i=n*Math.max(.001,Il(r.pop)),a=Math.sin(r.boing*Math.PI*5)*.16*r.boing;e.scale.set(i*(1+a),i*(1-a),i*(1+a))}var Rl=[16743094,16765503,16739179,9426687,12819455,16753978],zl=.62,Bl=[{stem:.001,leaf:0,bud:0,head:0,top:0},{stem:.12,leaf:.55,bud:0,head:0,top:.05},{stem:.2,leaf:.9,bud:0,head:0,top:.06},{stem:.28,leaf:1,bud:1,head:0,top:.12},{stem:.34,leaf:1,bud:0,head:1.3,top:.3}],Vl=new wi(1,14,10),Hl=new wi(1,8,6),Ul=new bi(.022,.03,1,8).translate(0,.5,0);function Wl(e,t,n,r,i=Vl){let a=new Sn,o=new Y(i,yl(e));o.scale.set(t,n,r);let s=new Y(i,Cl(zl));return s.scale.set(t,n,r),s.userData.ink=!0,a.add(o,s),a}function Gl(e,t=Vl){let n=new Sn;for(let r=0;r<6;r++){let i=r*Math.PI*2/6,a=Wl(e,.085,.085,.035,t);a.position.set(Math.cos(i)*.11,Math.sin(i)*.11,0),n.add(a)}let r=Wl(16765503,.075,.075,.05,t);return r.position.z=.03,n.add(r),n}function Kl(){return{toon:bl(),ink:Cl(zl),stem:xl}}function ql(e,t=Math.random){let n=new Sn,r=new Y(Ul,xl);r.userData.ink=`stem`;let i=.26+t()*.12;r.scale.y=i,r.rotation.z=(t()-.5)*.3,n.add(r);let a=Wl(8311663,.07,.03,.045,Hl);a.position.set(.05,i*.45,0),a.rotation.z=-.5,n.add(a);let o=Gl(e,Hl);return o.position.set(r.rotation.z*-i*.5,i+.02,0),o.rotation.x=Jl,n.add(o),n}var Jl=-.65,Yl=e=>1+2.7*(e-1)**3+1.7*(e-1)**2,Xl=class{constructor(e){this.creature=e;let t=rl((e.seed^24301)>>>0);this.color=Rl[Math.floor(t.next()*Rl.length)],this.lean=t.range(-.15,.15),this.stage=0,this.from=Bl[0],this.to=Bl[0],this.tween=1,this.t=t.range(0,10),this.excite=0,this.group=new Sn,this.group.position.set(0,e.H/2-.02,.05),this.group.rotation.z=this.lean,this.stem=new Y(Ul,xl),this.leaves=[Wl(8311663,.09,.035,.05),Wl(8311663,.08,.03,.045)],this.leaves[0].rotation.z=-.6,this.leaves[1].rotation.z=.7,this.bud=Wl(this.color,.06,.075,.06),this.head=Gl(this.color),this.head.rotation.x=Math.PI+.58,this.group.add(this.stem,...this.leaves,this.bud,this.head),e.torso.add(this.group),this.apply(Bl[0])}get height(){let e=Bl[this.stage];return e.stem+e.top}setStage(e,t=!0){e=Math.max(0,Math.min(4,e|0)),this.from=t?this.current():Bl[e],this.to=Bl[e],this.stage=e,this.tween=+!t,t||this.apply(this.to)}current(){let e=Yl(Math.min(1,this.tween)),t=t=>this.from[t]+(this.to[t]-this.from[t])*e;return{stem:t(`stem`),leaf:t(`leaf`),bud:t(`bud`),head:t(`head`),top:t(`top`)}}apply(e){let t=Math.max(.001,e.stem);this.stem.scale.y=t,this.stem.visible=e.stem>.01;let n=Math.max(0,e.leaf);for(let[e,r]of this.leaves.entries())r.visible=n>.01,r.scale.setScalar(Math.max(.001,n)),r.position.set(e===0?-.04:.04,t*(e===0?.55:.75),0);let r=Math.max(0,e.bud);this.bud.visible=r>.01,this.bud.scale.setScalar(Math.max(.001,r)),this.bud.position.y=t+.05;let i=Math.max(0,e.head);this.head.visible=i>.01,this.head.scale.setScalar(Math.max(.001,i)),this.head.position.y=t+.1}update(e){this.tween<1&&(this.tween=Math.min(1,this.tween+e/.55),this.apply(this.current())),this.t+=e,this.excite=Math.max(0,this.excite-e);let t=Math.sin(this.t*1.7)*.05+Math.sin(this.t*9)*.08*this.excite;this.group.rotation.z=this.lean+t}flowerWorld(e){return this.head.getWorldPosition(e)}detach(){this.group.removeFromParent()}},Zl=[`m`,`p`,`n`,`t`,`b`,`k`].flatMap(e=>[`a`,`e`,`i`,`o`,`u`].map(t=>e+t)),Ql=`step`,$l={a:[[800,100,1],[1200,120,.5],[2600,180,.18]],e:[[500,90,1],[1900,130,.35],[2600,180,.15]],i:[[300,90,1],[2300,220,.32],[3e3,320,.14]],o:[[500,90,1],[900,100,.5],[2500,200,.1]],u:[[320,80,1],[800,100,.4],[2400,200,.08]]},eu={m:{kind:`nasal`,locus:900},n:{kind:`nasal`,locus:1700},l:{kind:`liquid`,locus:1500},p:{kind:`plosive`,voiced:!1,burst:1100,locus:800},b:{kind:`plosive`,voiced:!0,burst:900,locus:800},t:{kind:`plosive`,voiced:!1,burst:3800,locus:1800},d:{kind:`plosive`,voiced:!0,burst:3200,locus:1800},k:{kind:`plosive`,voiced:!1,burst:2e3,locus:2300}},tu=[[250,140,1],[1e3,350,.06]],nu=[[350,120,1],[1500,300,.15],[2600,300,.05]],ru={flat:{dur:.32,f0:()=>1,gain:1},rise:{dur:.34,f0:e=>.88+.32*e,gain:1},fall:{dur:.36,f0:e=>1.18-.36*e,gain:1},bump:{dur:.36,f0:e=>1+.25*Math.sin(Math.PI*e),gain:1},high:{dur:.22,f0:()=>1.3,gain:.9},low:{dur:.44,f0:e=>.8-.06*e,gain:1},ask:{dur:.38,f0:e=>e<.6?.95:.95+(e-.6)/.4*.45,gain:1},step:{dur:.09,f0:()=>.9,gain:.55},lo:{dur:.24,f0:e=>.96-.05*e,gain:.95},hi:{dur:.22,f0:e=>1.22+.06*Math.sin(Math.PI*e),gain:1}},iu=285,au=22050,ou=4500,su=e=>Math.max(0,Math.min(1,e)),cu=4096,lu=new Float32Array(cu);for(let e=0;e<cu;e++)lu[e]=Math.sin(e/cu*2*Math.PI);var uu=e=>lu[(e*cu|0)&4095],du=e=>e*e*(3-2*e);function fu(e,t){let n=0;for(let[r,i,a]of t){let t=(e-r)/(i/2);n+=a/(1+t*t)}return n}function pu(e,t,n,r){let i=2*Math.PI*n/t,a=Math.sin(i)/(2*r),o=a,s=-a,c=1+a,l=-2*Math.cos(i),u=1-a,d=0,f=0,p=0,m=0;for(let t=0;t<e.length;t++){let n=e[t],r=(o*n+s*f-l*p-u*m)/c;f=d,d=n,m=p,p=r,e[t]=r}}function mu(e,t,n){let r=eu[t[0]]||eu.m,i=$l[t[1]]||$l.a,a=ru[n]||ru.flat,o=au,s=r.kind===`plosive`,c=s?r.voiced?.008:.02:0,l=s?.014:0,u=s&&!r.voiced?.045:0,d=c+l+u,f=s?.05:.08,p=n===Ql,m=d+a.dur,h=Math.floor(o*(m+.05)),g=new Float32Array(h),_=r.kind===`nasal`?tu:r.kind===`liquid`?nu:i.map((e,t)=>t===1?[r.locus,e[1],e[2]]:e),v=Math.floor(ou/(iu*.75)),y=new Float32Array(22),b=new Float32Array(22);for(let e=1;e<=v;e++)b[e]=1/e**.85;let x=0,S=0,C=0;for(let e=0;e<h;e++){let t=e/o;if(t<d)continue;let n=t-d,s=su(n/a.dur),c=iu*a.f0(s)*(1+.008*uu(5.5*t));if(x+=c/o,x>=1&&--x,S--<=0){S=63,C=du(su(n/f));for(let e=1;e<=v;e++){let t=e*c;y[e]=t>ou?0:((1-C)*fu(t,_)+C*fu(t,i))*b[e]}}let l=0;for(let e=1;e<=v;e++){let t=y[e];if(t===0)break;l+=t*uu(e*x)}let u=du(su(n/(r.kind===`nasal`?.03:.008))),m=du(su((a.dur-n)/(p?.04:.11))),h=r.kind===`nasal`||r.kind===`liquid`?.45+.55*C:1;g[e]=l*u*m*h}if(s){let e=new Float32Array(h),t=Math.floor(c*o),n=Math.floor((c+l+u)*o);for(let r=t;r<Math.min(h,n);r++){let n=(r-t)/o,i=n<l?1:.35*(1-(n-l)/Math.max(u,.001));e[r]=(Math.random()*2-1)*i}pu(e,o,r.burst,1.6);let i=r.voiced?.35:.5;for(let r=t;r<Math.min(h,n+Math.floor(.01*o));r++)g[r]+=e[r]*i}let w=1e-6;for(let e=0;e<h;e++)w=Math.max(w,Math.abs(g[e]));let T=.8*a.gain/w;for(let e=0;e<h;e++)g[e]*=T;let E=e.createBuffer(1,h,o);return E.getChannelData(0).set(g),E}var hu=[{name:`dash-vee`,eyeL:[[-1.144,-.032,-1.144,-.016,-1.137,-.002,-1.088,.029,-1.026,.017,-.883,.033,-.863,.025,-.851,.006,-.851,-.01,-.858,-.024,-.871,-.034,-.893,-.039,-1.112,-.059,-1.132,-.051]],eyeR:[[1.149,-.006,1.137,-.025,1.118,-.033,.985,-.026,.876,-.008,.859,.008,.856,.032,.868,.051,.888,.059,1.017,.042,1.046,.042,1.068,.052,1.088,.053,1.137,.029,1.147,.016]],mouth:[[-.782,.04,-.782,.049,-.773,.059,-.705,.081,-.695,.092,-.694,.11,-.685,.116,-.649,.124,-.633,.133,-.606,.125,-.589,.145,-.573,.145,-.532,.161,-.506,.162,-.468,.186,-.448,.189,-.43,.201,-.366,.219,-.338,.232,-.314,.235,-.296,.243,-.276,.244,-.241,.259,-.151,.282,-.112,.299,-.085,.298,-.067,.308,-.038,.313,.012,.336,.024,.349,.045,.361,.067,.363,.077,.37,.205,.361,.229,.352,.246,.339,.263,.34,.286,.333,.293,.316,.309,.316,.339,.305,.363,.303,.397,.275,.42,.27,.477,.245,.531,.243,.641,.219,.693,.213,.711,.206,.744,.2,.774,.186,.774,.174,.78,.162,.78,.153,.774,.146,.749,.138,.71,.149,.703,.148,.69,.137,.615,.146,.552,.166,.531,.182,.498,.189,.475,.2,.415,.21,.389,.232,.351,.242,.333,.252,.278,.265,.245,.285,.181,.29,.134,.307,.103,.307,.053,.298,.019,.285,-.001,.282,-.03,.252,-.059,.245,-.079,.245,-.142,.229,-.192,.212,-.283,.168,-.442,.121,-.502,.089,-.564,.068,-.608,.044,-.651,.029,-.721,.038,-.766,.028]]},{name:`dot-line`,eyeL:[[-1.01,-.116,-1.052,-.099,-1.084,-.068,-1.088,-.057,-1.086,-.03,-1.071,-.001,-1.064,.024,-1.055,.035,-1.03,.044,-1.009,.057,-.97,.054,-.953,.039,-.933,.033,-.922,.021,-.911,-.009,-.916,-.022,-.913,-.042,-.926,-.058,-.932,-.081,-.949,-.097,-.998,-.116]],eyeR:[[.998,-.063,.978,-.06,.944,-.037,.933,-.023,.922,.009,.933,.092,.945,.109,.966,.121,.98,.119,.991,.123,1.022,.119,1.039,.105,1.047,.079,1.055,.079,1.066,.088,1.077,.07,1.075,.004,1.056,-.031,1.044,-.043,1.033,-.047,1.02,-.044,1.009,-.034,1.004,-.035]],mouth:[[-.729,.341,-.725,.357,-.716,.365,-.696,.364,-.64,.374,-.553,.374,-.515,.382,-.458,.382,-.409,.391,-.379,.386,-.337,.387,-.322,.391,-.283,.387,-.242,.396,-.176,.391,-.041,.401,-.017,.397,-.007,.401,.061,.4,.106,.396,.144,.4,.222,.396,.297,.405,.328,.401,.376,.408,.402,.403,.426,.41,.463,.402,.502,.406,.529,.398,.577,.401,.679,.397,.716,.39,.78,.392,.793,.381,.795,.374,.791,.358,.778,.344,.739,.346,.7,.338,.655,.34,.642,.345,.587,.345,.57,.352,.541,.351,.486,.366,.44,.369,.398,.368,.375,.357,.357,.358,.334,.37,.32,.372,.269,.356,.24,.361,.224,.353,.199,.355,.186,.351,.172,.353,.154,.362,.132,.357,.113,.361,.078,.362,.053,.353,.033,.36,.01,.362,-.023,.357,-.078,.367,-.104,.359,-.143,.362,-.161,.354,-.224,.358,-.251,.349,-.348,.353,-.367,.345,-.411,.348,-.47,.342,-.498,.349,-.538,.343,-.553,.336,-.612,.341,-.71,.329,-.726,.334]]},{name:`ring-bowl`,eyeL:[[-1.001,-.159,-1.041,-.145,-1.053,-.133,-1.071,-.125,-1.086,-.096,-1.114,-.065,-1.126,-.04,-1.121,-.007,-1.095,.047,-1.081,.066,-1.041,.088,-1.02,.084,-1.002,.101,-.984,.099,-.966,.085,-.949,.082,-.904,.047,-.882,.011,-.873,-.019,-.878,-.078,-.902,-.116,-.931,-.136,-.975,-.154],[-.935,-.084,-.921,-.033,-.926,-.013,-.942,.009,-.957,.02,-.979,.025,-.993,.036,-1.012,.044,-1.035,.046,-1.06,.042,-1.068,.035,-1.073,.016,-1.073,-.038,-1.044,-.076,-1.002,-.094,-.999,-.107,-.992,-.115,-.984,-.111,-.981,-.096,-.962,-.097]],eyeR:[[.976,-.085,.967,-.074,.942,-.072,.924,-.054,.911,-.054,.905,-.05,.893,-.005,.893,.048,.91,.089,.939,.117,.963,.122,.979,.134,.995,.135,1.019,.143,1.035,.127,1.048,.133,1.055,.13,1.066,.115,1.088,.101,1.087,.082,1.105,.05,1.106,-.005,1.09,-.019,1.08,-.038,1.066,-.04,1.055,-.056,1.032,-.061,1.032,-.052,1.041,-.018,1.059,.002,1.059,.011,1.053,.022,1.056,.052,1.047,.062,1.014,.08,.988,.066,.957,.068,.93,.044,.926,.036,.935,.011,.955,-.008,.952,-.024,.961,-.029,.977,-.023,.991,-.002,1.016,-.019,1.011,-.027,1.011,-.035,1.018,-.045,1.012,-.058,1.014,-.076,1.008,-.078,.995,-.074]],mouth:[[-.74,.235,-.737,.252,-.717,.267,-.707,.288,-.68,.293,-.631,.313,-.604,.318,-.585,.333,-.544,.34,-.52,.349,-.503,.364,-.472,.364,-.441,.38,-.409,.386,-.387,.385,-.339,.409,-.29,.414,-.243,.426,-.227,.425,-.199,.44,-.171,.447,-.13,.447,-.087,.46,-.065,.459,-.029,.47,.007,.472,.066,.487,.092,.48,.118,.462,.183,.456,.211,.444,.238,.443,.293,.427,.364,.416,.392,.404,.426,.407,.443,.395,.461,.389,.485,.389,.501,.382,.539,.375,.556,.365,.587,.355,.621,.354,.647,.32,.682,.301,.701,.299,.736,.261,.739,.253,.733,.226,.722,.217,.686,.223,.658,.218,.608,.221,.545,.216,.437,.226,.406,.218,.346,.227,.301,.223,.289,.227,.258,.226,.192,.235,.158,.231,.131,.239,.072,.239,.036,.249,.023,.25,-.009,.242,-.034,.246,-.069,.244,-.097,.253,-.114,.249,-.139,.251,-.158,.246,-.188,.251,-.213,.246,-.256,.248,-.276,.243,-.326,.25,-.365,.244,-.411,.244,-.446,.237,-.471,.241,-.495,.232,-.537,.237,-.561,.233,-.62,.237,-.678,.233,-.724,.226,-.734,.227],[-.577,.292,-.573,.281,-.56,.272,-.514,.269,-.374,.278,-.346,.285,-.295,.279,-.276,.284,-.251,.28,-.235,.282,-.188,.28,-.17,.284,-.14,.281,-.12,.287,-.081,.284,-.053,.289,-.036,.288,-.018,.28,.011,.284,.056,.28,.091,.273,.11,.276,.189,.272,.21,.266,.324,.265,.343,.259,.37,.263,.382,.257,.399,.256,.413,.259,.533,.256,.583,.262,.603,.26,.617,.268,.622,.283,.618,.294,.593,.322,.576,.331,.547,.331,.516,.342,.467,.348,.408,.361,.388,.37,.323,.382,.285,.398,.261,.404,.241,.404,.185,.42,.156,.419,.127,.426,.103,.426,.083,.433,.036,.432,.007,.438,-.047,.427,-.092,.43,-.13,.415,-.163,.418,-.232,.407,-.297,.386,-.324,.388,-.352,.374,-.385,.374,-.406,.365,-.432,.368,-.459,.35,-.488,.341,-.515,.345,-.537,.33,-.552,.326,-.572,.307]]},{name:`plus-frown`,eyeL:[[-1.053,-.14,-1.06,-.138,-1.066,-.127,-1.063,-.099,-1.066,-.068,-1.06,-.055,-1.059,-.026,-1.069,-.015,-1.105,-.009,-1.112,-.004,-1.113,.003,-1.1,.021,-1.069,.026,-1.044,.039,-1.047,.07,-1.027,.084,-1.017,.108,-1.011,.11,-.98,.086,-.975,.073,-.977,.051,-.974,.041,-.954,.023,-.95,.013,-.942,.008,-.929,.014,-.924,.007,-.926,-.012,-.892,-.02,-.886,-.026,-.886,-.034,-.925,-.047,-.94,-.044,-.958,-.034,-.972,-.038,-.981,-.049,-.984,-.071,-1,-.094,-1.004,-.121,-1.02,-.126,-1.036,-.138]],eyeR:[[.992,-.095,.983,-.081,.984,-.001,.981,.013,.973,.019,.92,.016,.912,.025,.912,.036,.918,.049,.932,.06,.963,.062,.979,.068,.986,.079,.987,.097,.993,.115,1.007,.126,1.013,.126,1.023,.112,1.026,.078,1.032,.068,1.083,.074,1.087,.07,1.089,.059,1.086,.046,1.074,.031,1.024,.01,1.023,-.033,1.017,-.051,1.02,-.077,1.006,-.093]],mouth:[[-.706,.251,-.697,.272,-.682,.285,-.656,.283,-.638,.287,-.62,.281,-.6,.263,-.558,.265,-.536,.249,-.506,.255,-.479,.24,-.427,.235,-.407,.219,-.367,.222,-.337,.213,-.327,.221,-.321,.221,-.308,.207,-.295,.208,-.262,.191,-.239,.201,-.211,.197,-.198,.206,-.144,.19,-.108,.189,-.092,.179,-.053,.185,-.009,.175,.006,.167,.026,.179,.039,.18,.061,.171,.101,.174,.135,.164,.176,.173,.226,.175,.237,.17,.257,.178,.281,.176,.34,.194,.388,.188,.416,.203,.445,.201,.483,.21,.51,.209,.542,.225,.587,.221,.618,.239,.64,.241,.654,.249,.677,.254,.746,.3,.756,.293,.755,.267,.735,.247,.701,.225,.628,.193,.488,.17,.463,.161,.405,.16,.369,.149,.318,.152,.301,.146,.276,.145,.255,.135,.213,.128,.089,.13,.059,.134,.045,.131,-.023,.133,-.053,.14,-.134,.141,-.201,.156,-.245,.155,-.264,.163,-.299,.162,-.37,.181,-.415,.182,-.434,.194,-.462,.19,-.491,.193,-.545,.208,-.581,.21,-.625,.221,-.649,.233,-.682,.245,-.7,.246]]},{name:`comma-tri`,eyeL:[[-1.176,-.121,-1.18,-.106,-1.174,-.097,-1.101,-.054,-1.05,-.001,-1.045,.01,-1.043,.066,-1.031,.089,-1.014,.106,-.984,.12,-.951,.121,-.922,.11,-.899,.089,-.885,.059,-.884,.026,-.895,-.003,-.916,-.026,-.965,-.047,-1.012,-.08,-1.059,-.102,-1.164,-.126]],eyeR:[[1.176,-.131,1.164,-.136,1.059,-.112,1.012,-.09,.965,-.057,.916,-.036,.895,-.013,.884,.016,.885,.049,.899,.079,.922,.1,.951,.111,.984,.11,1.014,.096,1.031,.079,1.043,.056,1.045,0,1.05,-.011,1.101,-.064,1.174,-.107,1.18,-.116]],mouth:[[.138,.297,.128,.276,.082,.233,.058,.198,.043,.188,.029,.168,.011,.16,-.005,.143,-.016,.139,-.038,.143,-.042,.17,-.099,.212,-.122,.235,-.13,.254,-.138,.262,-.154,.267,-.175,.284,-.18,.315,-.16,.331,-.136,.323,-.107,.326,-.094,.322,-.047,.333,.026,.334,.036,.33,.103,.333,.122,.327,.133,.318],[.06,.265,.058,.272,.047,.279,.025,.286,.005,.287,-.006,.301,-.017,.288,-.043,.297,-.054,.28,-.07,.275,-.067,.268,-.043,.262,-.021,.241,.004,.228,.022,.233,.054,.256]]},{name:`star-roof`,eyeL:[[-1,-.174,-1.014,-.166,-1.02,-.152,-1.02,-.041,-1.026,-.033,-1.125,-.081,-1.143,-.077,-1.152,-.055,-1.14,-.038,-1.076,-.003,-1.067,.008,-1.075,.019,-1.138,.061,-1.144,.073,-1.14,.09,-1.126,.099,-1.111,.097,-1.026,.047,-1.019,.057,-1.017,.144,-1.009,.157,-.99,.162,-.979,.157,-.971,.144,-.97,.073,-.965,.064,-.95,.066,-.88,.103,-.865,.101,-.855,.091,-.853,.077,-.865,.06,-.944,.017,-.956,.001,-.854,-.069,-.846,-.091,-.855,-.105,-.873,-.109,-.949,-.062,-.966,-.058,-.971,-.067,-.973,-.156,-.981,-.169]],eyeR:[[1.008,-.172,.992,-.169,.981,-.154,.977,-.062,.971,-.05,.956,-.053,.875,-.103,.86,-.101,.848,-.085,.856,-.063,.952,.003,.941,.018,.868,.058,.856,.075,.858,.089,.868,.099,.883,.101,.955,.063,.968,.063,.972,.072,.971,.146,.979,.159,.99,.164,1.006,.161,1.016,.149,1.021,.063,1.028,.053,1.12,.105,1.135,.103,1.147,.087,1.139,.065,1.07,.02,1.063,.009,1.076,-.004,1.142,-.04,1.154,-.057,1.152,-.071,1.142,-.081,1.123,-.082,1.04,-.037,1.03,-.037,1.025,-.046,1.028,-.149,1.022,-.164]],mouth:[[.88,.29,.869,.27,.858,.263,.838,.26,.813,.245,.776,.229,.75,.227,.734,.218,.719,.205,.676,.2,.661,.187,.648,.181,.632,.167,.6,.146,.578,.144,.539,.123,.518,.116,.493,.1,.48,.098,.467,.088,.452,.084,.435,.071,.394,.065,.342,.034,.318,.036,.302,.024,.263,.005,.217,-.006,.209,-.011,.199,-.032,.176,-.034,.159,-.056,.135,-.056,.119,-.063,.096,-.057,.083,-.038,.053,-.027,.033,-.032,.016,-.054,.008,-.057,-.003,-.055,-.021,-.041,-.044,-.03,-.06,-.026,-.076,-.014,-.1,-.009,-.133,.014,-.225,.063,-.278,.086,-.303,.102,-.325,.111,-.344,.114,-.366,.126,-.39,.131,-.426,.155,-.467,.165,-.514,.189,-.552,.197,-.586,.221,-.596,.223,-.617,.22,-.647,.246,-.657,.251,-.678,.251,-.685,.262,-.682,.285,-.686,.296,-.694,.301,-.713,.307,-.749,.337,-.733,.346,-.726,.346,-.704,.33,-.68,.329,-.624,.308,-.603,.294,-.578,.293,-.549,.276,-.531,.277,-.519,.267,-.466,.24,-.445,.242,-.43,.231,-.407,.228,-.377,.214,-.37,.197,-.36,.188,-.349,.187,-.333,.192,-.322,.184,-.304,.182,-.292,.168,-.285,.164,-.253,.162,-.24,.155,-.22,.155,-.21,.137,-.202,.131,-.182,.124,-.134,.119,-.116,.103,-.085,.095,-.068,.082,-.034,.077,-.017,.059,.009,.057,.018,.049,.032,.045,.062,.028,.073,.008,.084,.001,.103,.003,.121,.011,.147,.009,.184,.02,.214,.04,.238,.039,.254,.053,.272,.056,.289,.071,.311,.074,.336,.086,.351,.09,.363,.1,.388,.103,.405,.115,.432,.118,.441,.125,.449,.137,.47,.147,.495,.146,.514,.165,.538,.17,.554,.182,.668,.236,.683,.237,.705,.25,.727,.256,.744,.271,.771,.286,.797,.289,.813,.299,.849,.309,.859,.316,.869,.312,.879,.299]]},{name:`lash-bird`,eyeL:[[-.961,.001,-1.001,.01,-1.022,.034,-1.033,.04,-1.04,.073,-1.029,.094,-1.018,.103,-.997,.104,-.983,.117,-.976,.117,-.965,.106,-.942,.107,-.932,.097,-.92,.092,-.911,.084,-.9,.059,-.907,.033,-.921,.026,-.931,.012],[-1.119,-.104,-1.129,-.097,-1.13,-.091,-1.121,-.072,-1.101,-.053,-1.097,-.058,-1.101,-.084,-1.108,-.101,-1.111,-.104],[-.896,-.15,-.908,-.14,-.91,-.128,-.903,-.112,-.887,-.099,-.883,-.105,-.884,-.117,-.875,-.136,-.881,-.145],[-1.004,-.153,-1.019,-.138,-1.015,-.106,-1,-.083,-.994,-.078,-.988,-.078,-.983,-.082,-.982,-.09,-.986,-.094,-.997,-.094,-.999,-.101,-.984,-.115,-.981,-.127,-.993,-.132,-.996,-.148]],eyeR:[[.953,.052,.93,.104,.965,.145,.983,.154,.999,.149,1.03,.167,1.034,.166,1.041,.157,1.054,.154,1.062,.147,1.071,.129,1.073,.098,1.05,.068,1.044,.066,1.037,.068,1.019,.062,1.01,.074,1.006,.074,1,.068,.999,.057,.994,.054,.973,.056,.96,.051],[1.143,-.105,1.126,-.115,1.104,-.116,1.095,-.113,1.083,-.102,1.071,-.1,1.068,-.089,1.058,-.081,1.065,-.059,1.064,-.034,1.071,-.032,1.082,-.038,1.097,-.038,1.114,-.065,1.117,-.084,1.122,-.089,1.139,-.086,1.142,-.092],[.855,-.124,.85,-.117,.85,-.099,.859,-.085,.873,-.087,.877,-.082,.88,-.062,.885,-.055,.906,-.053,.907,-.061,.898,-.076,.898,-.102,.894,-.109,.882,-.116],[.977,-.131,.965,-.124,.962,-.109,.967,-.095,.964,-.072,.973,-.058,.992,-.056,1.002,-.065,1.011,-.083,1.015,-.102,1.007,-.119,.987,-.13]],mouth:[[-.24,.224,-.24,.23,-.236,.233,-.211,.238,-.192,.268,-.15,.269,-.083,.249,-.067,.236,-.053,.232,-.018,.212,.005,.193,.022,.189,.043,.198,.065,.214,.081,.216,.095,.227,.115,.237,.133,.24,.148,.248,.171,.253,.182,.258,.217,.259,.254,.268,.265,.263,.272,.25,.268,.239,.253,.223,.225,.202,.167,.2,.135,.192,.113,.193,.056,.169,.043,.152,.026,.116,.008,.1,-.002,.104,-.012,.123,-.056,.178,-.063,.181,-.071,.193,-.088,.195,-.1,.209,-.114,.207,-.125,.21,-.139,.204,-.145,.204,-.155,.212,-.165,.208,-.201,.209,-.228,.222]]},{name:`tear-caret`,eyeL:[[-.993,.061,-.998,.063,-1.003,.07,-1.009,.087,-1.01,.104,-1.004,.115,-.987,.122,-.982,.117,-.976,.088,-.98,.067,-.985,.062],[-.905,.033,-.869,.077,-.852,.09,-.847,.091,-.842,.088,-.841,.08,-.845,.07,-.86,.064,-.877,.04],[-1.091,.052,-1.102,.044,-1.109,.031,-1.118,.031,-1.158,.066,-1.158,.071,-1.15,.081,-1.127,.082,-1.103,.071,-1.091,.057],[-1.02,-.119,-1.032,-.099,-1.038,-.08,-1.037,-.063,-1.025,-.038,-1.01,-.025,-.985,-.011,-.966,-.017,-.941,-.021,-.937,-.034,-.928,-.05,-.915,-.059,-.915,-.075,-.928,-.098,-.934,-.104,-.948,-.101,-.963,-.118,-.988,-.126]],eyeR:[[1.004,.067,1,.072,.992,.109,1,.131,1.009,.136,1.024,.127,1.024,.101,1.012,.071],[.921,.06,.916,.057,.901,.059,.87,.081,.854,.101,.857,.112,.864,.117,.872,.117,.889,.111,.912,.078,.92,.07],[1.09,.024,1.089,.031,1.114,.067,1.129,.074,1.139,.086,1.144,.086,1.147,.079,1.138,.07,1.133,.057,1.116,.042,1.106,.027],[1.02,-.131,1.01,-.132,.969,-.121,.944,-.098,.937,-.084,.937,-.057,.944,-.039,.982,-.001,.989,-.002,1.001,-.013,1.013,-.008,1.02,-.009,1.049,-.028,1.055,-.045,1.065,-.085,1.064,-.091,1.058,-.097,1.046,-.097,1.028,-.127]],mouth:[[.075,.238,.065,.227,.059,.213,.024,.163,.013,.136,-.002,.116,-.015,.085,-.041,.069,-.051,.067,-.072,.079,-.073,.097,-.083,.116,-.104,.141,-.115,.162,-.131,.184,-.136,.2,-.172,.248,-.175,.26,-.161,.267,-.135,.264,-.125,.26,-.069,.16,-.05,.144,-.043,.145,-.036,.151,-.007,.198,0,.224,.01,.238,.026,.239,.04,.246,.07,.247]]},{name:`droop-wave`,eyeL:[[-.904,-.05,-.914,-.056,-.929,-.061,-.944,-.077,-.992,-.094,-1.008,-.094,-1.033,-.082,-1.045,-.065,-1.049,-.051,-1.045,-.02,-1.028,.004,-1.01,.017,-.991,.022,-.988,.03,-.995,.04,-1.014,.057,-1.043,.075,-1.055,.077,-1.092,.071,-1.101,.076,-1.1,.083,-1.087,.093,-1.054,.099,-1.005,.092,-.975,.074,-.945,.036,-.922,.022,-.917,.005,-.907,-.003,-.899,-.03]],eyeR:[[.891,-.059,.893,-.031,.906,-.005,.932,.039,.955,.059,1.035,.091,1.083,.09,1.109,.08,1.109,.072,1.1,.065,1.079,.063,1.04,.066,1.015,.055,1.017,.049,1.03,.045,1.041,.032,1.045,.002,1.037,-.028,1.025,-.047,1.023,-.058,1.013,-.075,1.001,-.086,.97,-.096,.943,-.09,.929,-.09]],mouth:[[.228,.159,.222,.127,.208,.11,.179,.091,.166,.071,.153,.06,.118,.045,.096,.05,.085,.06,.071,.066,.054,.091,.032,.096,-.026,.129,-.043,.126,-.07,.112,-.089,.098,-.108,.092,-.144,.064,-.172,.056,-.186,.063,-.253,.136,-.253,.141,-.245,.146,-.219,.147,-.199,.126,-.18,.116,-.166,.1,-.154,.097,-.047,.152,-.021,.158,0,.146,.03,.143,.047,.132,.068,.123,.08,.108,.093,.1,.098,.085,.107,.078,.113,.078,.15,.108,.193,.153,.202,.174,.212,.179,.221,.179]]},{name:`leaf-tick`,eyeL:[[-1.073,-.053,-1.077,-.043,-1.088,-.028,-1.085,-.019,-1.072,-.011,-1.063,-.01,-1.042,-.028,-1.028,-.025,-1.021,-.017,-1.01,.008,-.998,.025,-.978,.038,-.954,.043,-.941,.041,-.933,.032,-.913,-0,-.912,-.027,-.915,-.035,-.928,-.048,-.934,-.06,-.959,-.071,-.993,-.076,-1.013,-.075,-1.031,-.069,-1.039,-.07,-1.048,-.062,-1.06,-.061]],eyeR:[[.91,.017,.92,.039,.945,.064,.968,.075,.99,.073,.997,.07,1.017,.047,1.018,.027,1.008,.012,1.008,.006,1.012,.002,1.029,.003,1.047,.014,1.073,.02,1.077,.014,1.078,.003,1.089,-.004,1.089,-.009,1.071,-.023,1.033,-.037,1.023,-.036,.988,-.043,.96,-.042,.939,-.033,.931,-.026,.914,-0]],mouth:[[.115,.099,.093,.098,.077,.11,.068,.134,.049,.154,.033,.206,.028,.206,.023,.201,-.006,.148,-.029,.123,-.037,.12,-.051,.12,-.057,.124,-.058,.129,-.047,.156,-.034,.169,-.023,.195,-.011,.212,.012,.23,.025,.244,.039,.248,.055,.239,.085,.193,.092,.172,.106,.154,.121,.115,.12,.104]]},{name:`cross-oval`,eyeL:[[-.94,-.071,-.956,-.073,-.973,-.066,-.988,-.052,-1.003,-.029,-1.01,-.025,-1.029,-.027,-1.045,-.04,-1.055,-.043,-1.065,-.042,-1.077,-.034,-1.075,-.023,-1.058,-.012,-1.048,.004,-1.049,.015,-1.062,.025,-1.067,.035,-1.066,.048,-1.059,.057,-1.051,.058,-1.044,.056,-1.025,.033,-1.011,.024,-.993,.029,-.975,.046,-.955,.056,-.927,.056,-.923,.053,-.923,.046,-.927,.041,-.942,.037,-.978,.002,-.956,-.034,-.939,-.049,-.935,-.066]],eyeR:[[.924,-.046,.923,-.038,.927,-.031,.961,-.005,.967,.004,.965,.016,.949,.031,.939,.047,.94,.052,.96,.054,.969,.061,.975,.061,.989,.046,1.003,.039,1.01,.039,1.059,.067,1.063,.068,1.069,.064,1.071,.058,1.069,.05,1.035,.015,1.034,.008,1.074,-.03,1.076,-.044,1.07,-.051,1.057,-.054,1.002,-.02,.992,-.021,.954,-.052,.94,-.054]],mouth:[[-.782,.156,-.775,.179,-.775,.191,-.767,.203,-.758,.207,-.741,.224,-.728,.224,-.693,.238,-.659,.237,-.637,.242,-.629,.24,-.621,.228,-.609,.226,-.594,.237,-.561,.228,-.545,.226,-.521,.238,-.508,.236,-.492,.237,-.484,.234,-.466,.234,-.443,.222,-.46,.209,-.475,.213,-.486,.213,-.496,.201,-.51,.205,-.523,.202,-.539,.204,-.561,.202,-.578,.204,-.588,.209,-.611,.208,-.622,.203,-.661,.206,-.679,.202,-.703,.204,-.723,.191,-.729,.181,-.724,.167,-.708,.156,-.684,.159,-.658,.15,-.636,.149,-.611,.142,-.577,.147,-.537,.13,-.51,.133,-.469,.126,-.405,.125,-.36,.111,-.342,.113,-.333,.108,-.315,.11,-.282,.099,-.255,.101,-.238,.092,-.227,.091,-.207,.098,-.199,.096,-.18,.098,-.156,.094,-.126,.097,-.113,.088,-.093,.091,-.061,.089,-.049,.081,-.021,.086,.053,.08,.063,.076,.096,.078,.122,.071,.138,.073,.156,.066,.176,.07,.214,.068,.231,.072,.24,.072,.248,.067,.256,.066,.267,.074,.286,.071,.324,.083,.367,.082,.385,.088,.414,.085,.443,.087,.456,.092,.482,.093,.492,.097,.508,.096,.534,.101,.559,.098,.615,.112,.641,.11,.658,.124,.673,.124,.684,.133,.684,.145,.677,.152,.668,.155,.648,.157,.617,.166,.594,.163,.559,.178,.542,.177,.528,.171,.515,.179,.481,.183,.429,.174,.417,.182,.389,.189,.351,.181,.339,.181,.333,.184,.308,.184,.29,.19,.263,.184,.249,.19,.215,.185,.198,.19,.169,.185,.158,.193,.15,.194,.13,.183,.08,.184,.069,.188,.058,.188,.045,.192,.007,.192,-.013,.187,-.064,.185,-.079,.19,-.105,.186,-.146,.189,-.172,.182,-.204,.186,-.219,.191,-.246,.188,-.268,.196,-.275,.195,-.287,.189,-.32,.193,-.34,.191,-.35,.196,-.378,.19,-.391,.198,-.419,.192,-.422,.194,-.427,.213,-.436,.221,-.421,.237,-.391,.219,-.383,.219,-.373,.227,-.355,.223,-.344,.23,-.326,.227,-.315,.233,-.3,.23,-.282,.22,-.273,.22,-.255,.23,-.25,.23,-.243,.224,-.229,.22,-.214,.211,-.206,.211,-.186,.224,-.165,.218,-.14,.22,-.128,.226,-.104,.225,-.081,.219,-.058,.23,-.05,.23,-.041,.225,.001,.228,.021,.224,.03,.227,.048,.224,.086,.232,.098,.221,.128,.221,.153,.226,.166,.223,.191,.224,.205,.231,.226,.23,.235,.224,.246,.224,.262,.231,.271,.231,.288,.219,.305,.222,.337,.215,.362,.218,.373,.223,.385,.223,.404,.217,.421,.219,.431,.214,.456,.219,.468,.213,.512,.215,.521,.211,.546,.213,.56,.208,.589,.206,.604,.209,.614,.203,.637,.206,.666,.195,.687,.2,.703,.199,.737,.189,.756,.162,.754,.138,.749,.121,.736,.106,.715,.094,.689,.094,.67,.084,.63,.077,.602,.078,.56,.065,.535,.068,.502,.06,.486,.051,.459,.056,.446,.054,.437,.058,.422,.057,.41,.053,.385,.057,.359,.041,.353,.031,-.008,.035,-.01,.042,-.015,.046,-.036,.046,-.042,.049,-.053,.047,-.059,.041,-.06,.035,-.119,.036,-.121,.043,-.13,.049,-.156,.049,-.172,.058,-.188,.055,-.212,.058,-.247,.056,-.256,.059,-.279,.057,-.302,.066,-.326,.067,-.359,.064,-.371,.069,-.387,.068,-.4,.077,-.418,.074,-.436,.078,-.45,.089,-.471,.084,-.481,.087,-.494,.085,-.507,.087,-.528,.087,-.594,.11,-.601,.11,-.619,.103,-.631,.109,-.669,.107,-.68,.113,-.732,.114,-.763,.128]]}],gu=hu.map(e=>({name:e.name.split(`-`)[0],eyeL:e.eyeL,eyeR:e.eyeR})),_u=hu.map(e=>({name:e.name.split(`-`)[1],loops:e.mouth})),vu=1.75,yu=1.6,bu=.3,xu=.045,Su=.14,Cu=.17,wu=.1,Tu=.29;function Eu(e,t){let n=t.length/2,r=e=>(t[e%n*2]+t[(e+1)%n*2])/2,i=e=>(t[e%n*2+1]+t[(e+1)%n*2+1])/2;e.moveTo(r(0),i(0));for(let a=1;a<=n;a++)e.quadraticCurveTo(t[a%n*2],t[a%n*2+1],r(a),i(a));e.closePath()}function Du(e){let t=1/0,n=1/0,r=-1/0,i=-1/0;for(let a of e)for(let e=0;e<a.length;e+=2)t=Math.min(t,a[e]),r=Math.max(r,a[e]),n=Math.min(n,a[e+1]),i=Math.max(i,a[e+1]);return{loops:e,cx:(t+r)/2,cy:(n+i)/2,w:(r-t)/2,h:(i-n)/2}}var Ou=new Map;function ku(e){let t=Ou.get(e);return t||(t=Du(e),Ou.set(e,t)),t}var Au=e=>gu.find(t=>t.name===e)||gu[0],ju=()=>ku(Au(`dot`).eyeL),Mu=()=>ku(Au(`dash`).eyeL);function Nu(e,t,n,r,i,a,o){let s=new Path2D;for(let e of t.loops){let c=Array(e.length);for(let s=0;s<e.length;s+=2){let l=(n+(e[s]-t.cx)*i)*o.unit,u=(r+(e[s+1]-t.cy)*a)*o.unit,d=Math.max(-1.4,Math.min(1.4,l/o.radius));c[s]=o.cx+l,c[s+1]=o.eyeY+u+o.radius*(1-Math.cos(d))*Tu}Eu(s,c)}e.fill(s,`evenodd`),e.lineWidth=xu*o.unit,e.stroke(s)}function Pu(e,t,n){e.save(),e.lineJoin=`round`,e.lineCap=`round`;for(let r of[ku(t.eyes.eyeL),ku(t.eyes.eyeR)])if(n.blink){let t=Mu(),i=Math.max(Su,r.w*vu)/t.w;Nu(e,t,r.cx,r.cy,i,i*.8,n)}else Nu(e,r,r.cx,r.cy,vu,vu,n);let r=ku(t.mouth.loops);if(n.talk>0){let t=ju(),i=Math.min(.36,Math.max(.13,r.w*.5));Nu(e,t,r.cx,r.cy+wu+.04,i/t.w,i*(.55+.35*n.talk)/t.h,n)}else{let i=r.w<bu?yu:1;if(r.w>=bu){let e=Math.max(ku(t.eyes.eyeL).w,ku(t.eyes.eyeR).w)*vu;i=Math.min(1,(1-e-Cu-Math.abs(r.cx))/r.w)}Nu(e,r,r.cx,r.cy+wu,i,i,n)}e.restore()}var Fu=typeof location>`u`||!/[?&]faces=old(&|$)/.test(location.search),Iu=[.74,.84],Lu=[[`lo`,`hi`],[`hi`,`lo`],[`lo`,`lo`,`hi`],[`lo`,`hi`,`lo`],[`hi`,`lo`,`lo`],[`hi`,`lo`,`hi`]],Ru=1.1,zu=.14,Bu=.2,Vu=96,Hu=1024,Uu=`#${il.toString(16).padStart(6,`0`)}`,Wu=null,Gu=[.45,.66],Ku=[.3,1],qu=1.85,Ju=[.28,.5],Yu=[[.9,.3],[1,.4],[1.1,.3]],Xu=1.1,Zu={width:2*(Gu[1]*Xu*1.3+ol),height:(Ju[1]+Ku[1]+2*Gu[1])*Xu-.06+ol+.56,faceY:1.7},Qu=[.4,1.4,2.6,3.8],$u=1.5,ed=[`dot`,`oval`,`ring`,`sleepy`,`wide`,`happy`,`cyclops`,`uneven`],td=[`smile`,`o`,`flat`,`grin`,`cat`,`teeth`,`tongue`,`wavy`],nd=[`flat`,`up`,`sad`,`uni`,`thick`],rd=[[`none`,.65],[`blush`,.35]];function id(e,t){let n=e.length,r=new Float32Array(n),i=new Float32Array(n),a=0;for(let o=0;o<n;o++)o>0&&(a+=Math.hypot(e[o].x-e[o-1].x,e[o].y-e[o-1].y)),r[o]=(e[o].y+t/2)/t,i[o]=a;for(let e=0;e<n;e++)i[e]/=a;return{L:a,h:r,a:i}}function ad(e,t,n){let r=e.length;if(n<=e[0])return t[0];if(n>=e[r-1])return t[r-1];let i=0,a=r-1;for(;a-i>1;){let t=i+a>>1;e[t]<=n?i=t:a=t}let o=(n-e[i])/Math.max(1e-9,e[a]-e[i]);return t[i]+(t[a]-t[i])*o}function od(e,t){let n=e.attributes.uv,r=t.a.length;for(let e=0;e<n.count;e++)n.setY(e,t.a[e%r]);n.needsUpdate=!0}function sd(e,t){let n=0;for(let[,e]of t)n+=e;let r=e.next()*n;for(let[e,n]of t)if((r-=n)<=0)return e;return t[t.length-1][0]}function cd(e,t,n){let r=sd(e,[[`pill`,.4],[`pear`,.3],[`egg`,.3]]),i=0,a=1,o=1;switch(r){case`pear`:i=e.range(.12,.30000000000000004),a=e.range(.88,1);break;case`egg`:a=e.range(.74,.88),o=e.range(1.05,1.25);break;default:i=e.range(0,.06),a=e.range(.95,1)}n=Math.max(.05,Math.min(n,qu*2*t*a*1-2*t));let s=n+2*t,c=t*(1+i)*1,l=t*a*1,u=Math.min(c,s*.45),d=Math.min(l*o,s*.55),f=Math.max(.02,s-u-d),p=e=>{let t=e*s,n;if(t<u){let e=1-t/u;n=c*Math.sqrt(Math.max(0,1-e*e))}else if(t>s-d){let e=1-(s-t)/d;n=l*Math.sqrt(Math.max(0,1-e*e))}else n=c+(l-c)*dd((t-u)/f);return n},m=[],h=0;for(let e=0;e<=96;e++){let t=(1-Math.cos(Math.PI*e/96))/2,n=e===0||e===96?0:Math.max(.012,p(t));h=Math.max(h,n),m.push(new W(n,t*s-s/2))}return{family:r,points:m,LEN:n,H:s,rBottom:c,rTop:l,rMax:h,lean:0,radiusAt:p}}function ld(e,t,n){let r=e.attributes.position;if(t){for(let e=0;e<r.count;e++){let i=(r.getY(e)+n/2)/n;r.setX(e,r.getX(e)+t*dd(i))}r.needsUpdate=!0,e.computeVertexNormals()}let i=e.attributes.normal,a=e.attributes.uv,o=r.count/97;for(let e=0;e<o;e++){let t=e,n=Vu*o+e,r=i.getX(t)+i.getX(n),a=i.getY(t)+i.getY(n),s=i.getZ(t)+i.getZ(n),c=Math.hypot(r,a,s)||1;i.setXYZ(t,r/c,a/c,s/c),i.setXYZ(n,r/c,a/c,s/c)}for(let e=0;e<i.count;e++){let t=a.getY(e);t<.001?i.setXYZ(e,0,-1,0):t>.999&&i.setXYZ(e,0,1,0)}i.needsUpdate=!0}function ud(e){let t=e.attributes.position,n=e.attributes.uv,r=0,i=0;for(let e=0;e<t.count;e++)Math.abs(n.getX(e)-.5)<.03&&(r+=t.getX(e),i+=t.getZ(e));return Math.atan2(r,i)}var dd=e=>e*e*(3-2*e),fd=e=>Math.atan2(Math.sin(e),Math.cos(e)),pd=.5,md=.55,hd=Math.PI*2,gd=(e,t,n=.25)=>dd(Math.min(1,e/n,(t-e)/n)),_d={drowsy:0},vd=[{name:`sit`,dur:()=>2.6+Math.random()*1.6,pose:(e,t,n)=>{let r=dd(Math.min(1,e/.35,(t-e)/.35));return{dy:-n.LEG*.75*r,legL:1.4*r,legR:1.4*r,pitch:.12*r}}},{name:`bounce`,dur:()=>2.4,pose:(e,t)=>{let n=gd(e,t),r=Math.sin(e*hd*2.2);return{dy:Math.abs(r)*.22*n,legL:r*.5*n,legR:-r*.5*n,spin:Math.sin(e*hd*1.1)*.25*n,tilt:r*.08*n}}},{name:`look`,dur:()=>2.6,pose:(e,t)=>{let n=gd(e,t),r=0,i=0;return r=e<.9?.7*dd(Math.min(1,e/.4)):e<1.8?.7-1.4*dd(Math.min(1,(e-.9)/.4)):-.7+.7*dd(Math.min(1,(e-1.8)/.4)),e>1.8&&(i=.35*dd(Math.min(1,(e-1.8)/.4))),{spin:r*n,pitch:i*n,dy:i*.15}}},{name:`twist`,dur:()=>2.6,pose:(e,t)=>{let n=gd(e,t),r=e*hd*1.6;return{spin:Math.sin(r)*.8*n,tilt:Math.cos(r)*.12*n,dy:Math.abs(Math.sin(r*2))*.06*n,legL:Math.sin(r)*.3*n,legR:Math.sin(r)*.3*n}}},{name:`spin`,dur:()=>2,pose:e=>{if(e<1.2)return{spin:hd*dd(e/1.2),dy:Math.sin(e/1.2*Math.PI)*.5,legL:-.4*Math.sin(e/1.2*Math.PI),legR:-.4*Math.sin(e/1.2*Math.PI)};let t=(e-1.2)/.8;return{tilt:Math.sin(t*hd*2)*.12*(1-t)}}}],yd=.2,bd={name:`poop`,dur:()=>1.5,release:1.25,pose:(e,t,n)=>{let r=dd(Math.min(1,e/.3))*dd(Math.min(1,(t-e)/.15)),i=e>.35&&e<1.25?Math.sin((e-.35)*62)*.045:0,a=e>1.25?Math.sin(Math.PI*Math.min(1,(e-1.25)/.25)):0;return{dy:-n.LEG*.6*r+a*.2,legL:1.3*r,legR:1.3*r,pitch:-.14*r,tilt:i*r}}},xd={name:`hop`,dur:()=>.55,land:.45,pose:e=>{let t=Math.sin(Math.PI*Math.min(1,e/.45));return{dy:t*.35,legL:-.5*t,legR:-.5*t}}},Sd=new Set([`idle`,`wander`,`enter`,`leave`]),Cd={...vd.find(e=>e.name===`spin`),land:1.2},wd={name:`stumble`,dur:()=>1.6,land:.25,pose:(e,t,n)=>{let r=n.stumbleSide||1,i=e<.25?Math.sin(e/.25*Math.PI):0,a=Math.max(0,e-.25),o=Math.cos(a*hd*1.4)*Math.exp(-a*2.2)*+(a>0),s=dd(Math.min(1,(t-e)/.3));return{dy:i*.3,dx:r*.2*o*s,tilt:r*.42*o*s,pitch:.1*o*s,legL:(-.5*i+Math.sin(a*hd*2.8)*.7*Math.exp(-a*2))*s,legR:(-.5*i-Math.sin(a*hd*2.8)*.7*Math.exp(-a*2))*s}}},Td=class{constructor({seed:e,stage:t,audio:n}){this.seed=e,this.stage=t,this.audio=n,this.rng=rl(e);let r=this.rng;if(this.size=sd(r,Yu),this.R=r.range(Gu[0],Gu[1])*this.size,this.LEN=Math.min(r.range(Ku[0],Ku[1])*this.size,.7999999999999998*this.R),this.profile=cd(r,this.R,this.LEN),this.LEN=this.profile.LEN,this.H=this.profile.H,this.LEG=r.range(Ju[0],Ju[1])*this.size,this.footScale=r.range(.85,1.2),this.baseY=this.LEG+this.H/2-.06,this.eyeV=r.range(.55,.68),this.rFace=Math.max(.2,this.profile.radiusAt(this.eyeV)),this.arc=id(this.profile.points,this.H),this.L=this.arc.L,this.faceW=Hu,this.faceH=Math.max(256,Math.min(1280,Math.round(Hu*this.L/(2*Math.PI*this.rFace)))),this.pxPerUnit=Hu/(2*Math.PI*this.rFace),this.eyeType=r.pick(ed),this.eyeR=r.range(.065,.095)*this.pxPerUnit,this.eyeSep=Math.min(r.range(.26,.36),this.rFace*.72)*this.pxPerUnit,this.mouthType=r.pick(td),this.mouthW=r.range(.12,.21)*this.pxPerUnit,this.mouthDrop=r.range(.2,.27)*this.pxPerUnit,this.eyeType===`cyclops`&&(this.mouthDrop+=.07*this.pxPerUnit),this.brows=r.chance(.45)?r.pick(nd):null,this.blush=sd(r,rd)===`blush`,this.hand=null,Fu){let t=rl((e^1027301)>>>0),n=gu[Math.floor(t.next()*gu.length)];this.handUnit=t.range(Iu[0],Iu[1])*this.rFace*this.pxPerUnit,this.hand={eyes:n,mouth:_u[Math.floor(t.next()*_u.length)]},this.brows=null,this.blush=!1}this.syllable=r.pick(Zl),this.lastWord=-1,this.speech=null,this.speechT=0,this.stepHi=!1,this.voice=r.range(.85,1.25)*(.62/this.profile.rMax)**.35,this.speed=r.range(1.5,2.3),this.stepLength=r.range(.5,.7),this.bobHeight=r.range(.11,.18),this.chattiness=r.range(.15,.4),this.dims=null,this.growth=0,this.visitWork=0,this.state=`sleep`,this.timer=0,this.phase=0,this.lastStepSign=0,this.gait=0,this.heading=0,this.targetHeading=0,this.lookOffset=0,this.wiggle=0,this.squash=0,this.talk=0,this.breath=0,this.blink=1,this.blinkTimer=0,this.mouth=0,this.mouthTimer=0,this.faceDirty=!0,this.featDirty=!0,this.idleAnim=null,this.stepCount=0,this.target=new G,this.stagePose=null,this.painted=!1,this.age=0,this.storing=!1,this.avoid={x:0,z:0},this.hopT=0,this.sayAgain=0,this.sayAgainPitch=1,this.attention=0,this.gaze={x:0,z:0},this.gazeTimer=0,this.pose=null,this.idleName=null,this.reaction=null,this.reactionName=null,this.stumbleSide=1,this.root=new Sn,this.buildBody(),this.refreshDims();let i=t.bounds;this.root.position.set(r.range(i.minX,i.maxX)*.5,0,r.range(i.minZ,i.maxZ)*.5),this.heading=this.targetHeading=Math.PI+r.range(-.6,.6),this.root.rotation.y=this.heading}buildBody(){let e=new Fr({color:il});this.paintCanvas=document.createElement(`canvas`),this.paintCanvas.width=this.faceW,this.paintCanvas.height=this.faceH,this.faceCanvas=document.createElement(`canvas`),this.faceCanvas.width=this.faceW,this.faceCanvas.height=this.faceH,this.faceCtx=this.faceCanvas.getContext(`2d`),this.faceTex=new mi(this.faceCanvas),this.faceTex.colorSpace=Ie,this.faceTex.anisotropy=Math.min(16,this.stage.renderer.capabilities.getMaxAnisotropy()||4);let t=new Si(this.profile.points,Vu);od(t,this.arc);let n=ud(t);ld(t,this.profile.lean*this.R,this.H);let i=rl((this.seed^4581)>>>0),a={uLine:sl,uGrain:cl,uLineInk:al,uLineView:{value:new G(0,0,1)},uLineSeed:{value:new W(i.range(0,50),i.range(0,50))}},o=new Yr(new Uint8Array([238,250,255,255]),3,1,D);o.minFilter=r,o.magFilter=r,o.needsUpdate=!0;let s=new Fi({color:16777215,map:this.faceTex,gradientMap:o});dl(s,a,!1),this.featRect=this.measureFeatures(),this.featCanvas=document.createElement(`canvas`),this.featCanvas.width=this.featRect.w,this.featCanvas.height=this.featRect.h,this.featCtx=this.featCanvas.getContext(`2d`),this.featTex=new mi(this.featCanvas),this.featTex.colorSpace=Ie,this.featTex.premultiplyAlpha=!0,this.featTex.anisotropy=this.faceTex.anisotropy;let c=this.featRect,l={uFeat:{value:this.featTex},uFeatRect:{value:new Ht(c.x/this.faceW,1-(c.y+c.h)/this.faceH,c.w/this.faceW,c.h/this.faceH)}},u=s.onBeforeCompile;s.onBeforeCompile=(e,t)=>{u(e,t),Object.assign(e.uniforms,l),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform sampler2D uFeat;
uniform vec4 uFeatRect;`).replace(`#include <map_fragment>`,`#include <map_fragment>
{
  vec2 fuv = (vMapUv - uFeatRect.xy) / uFeatRect.zw;
  if (fuv.x >= 0.0 && fuv.x <= 1.0 && fuv.y >= 0.0 && fuv.y <= 1.0) {
    vec4 f = texture2D(uFeat, fuv); // premultiplied
    diffuseColor.rgb = diffuseColor.rgb * (1.0 - f.a) + f.rgb;
  }
}`)},s.customProgramCacheKey=()=>`line-body-own-features`,this.body=new Y(t,s),this.body.onBeforeRender=(e,t,n)=>ml(this.body,n,a.uLineView);let d=new Y(t,dl(new Fr({color:il,side:1}),a,!0));d.onBeforeRender=(e,t,n)=>ml(d,n,a.uLineView);let f=new Sn;f.rotation.y=Math.PI-n,f.add(this.body,d),this.torso=new Sn,this.torso.position.y=this.baseY,this.torso.add(f);let p=this.LEG+.04,m=new bi(.04,.046,p,10),h=new wi(.11*this.footScale,14,10);h.scale(1.05,.5,1.5),this.legs=[];for(let t of[-1,1]){let n=new Sn;n.position.set(t*this.profile.rBottom*.38,this.LEG+.06,0);let r=new Y(m,e);r.position.y=-p/2;let i=new Y(h,e);i.position.set(0,-this.LEG,-.06),n.add(r,i),this.root.add(n),this.legs.push(n)}this.shadow=new Y(new yi(this.profile.rBottom*1.2,32),new Fr({color:0,transparent:!0,opacity:.095,depthWrite:!1})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.y=.002,this.root.add(this.torso,this.shadow),this.sprout=new Xl(this),this.drawFace()}arcOf(e){return ad(this.arc.h,this.arc.a,e)}heightOf(e){return ad(this.arc.a,this.arc.h,e)}widthScaleAt(e){let t=1-e/this.faceH,n=Math.max(.05,this.profile.radiusAt(this.heightOf(t)));return Math.min(2.2,Math.max(.7,this.rFace/n))}drawLegacyFace(e){let t=this.paintCanvas.getContext(`2d`),n=this.paintCanvas.width,r=this.paintCanvas.height,i=e.width,a=e.height;t.clearRect(0,0,n,r);for(let o=0;o<r;o++){let s=1-(o+.5)/r,c=Math.min(a-1,Math.max(0,Math.floor((1-this.heightOf(s))*a)));t.drawImage(e,0,c,i,1,0,o,n,1)}this.faceDirty=!0}refreshDims(){this.bodyDims={width:2*(this.profile.rMax+ol),height:this.baseY+this.H/2+ol,faceY:this.baseY+(this.eyeV-.5)*this.H-.1},this.dims={...this.bodyDims,height:this.bodyDims.height+(this.sprout?this.sprout.height:0)}}setPaintLayer(e,t){this.root.traverse(n=>t?n.layers.enable(e):n.layers.disable(e)),this.sprout.group.traverse(t=>t.layers.disable(e))}addWork(e){this.visitWork+=e}get savedGrowth(){return this.growth+Math.min($u,this.visitWork)}applyVisit(){this.growth+=Math.min($u,this.visitWork),this.visitWork=0}growthStage(){let e=0;for(;e<4&&this.growth>=Qu[e];)e++;return e}bloomIfGrown(){let e=this.growthStage();return e!==this.sprout.stage&&(this.sprout.setStage(e,!0),this.refreshDims(),!0)}resetGrowth(e=!0){this.growth=0,this.visitWork=0,this.sprout.setStage(0,e),this.refreshDims()}hop(){this.react(xd,Math.random()*.15)}walkTo(e,t){let n=this.stage.bounds;this.target.set(Math.min(n.maxX,Math.max(n.minX,e)),0,Math.min(n.maxZ,Math.max(n.minZ,t))),this.state=`wander`,this.clearIdleAnim()}drawFace(){this.drawBase(),this.drawFeatures()}drawBase(){let e=this.faceCtx,t=this.faceW,n=this.faceH,r=this.pxPerUnit;e.fillStyle=`#ffffff`,e.fillRect(0,0,t,n),e.drawImage(this.paintCanvas,0,0);let i=Uu;e.globalAlpha=.2,e.strokeStyle=i,e.lineWidth=.03*r,e.lineCap=`round`,e.lineJoin=`round`;let a=n*(1-this.arcOf(.27)),o=.056*r,s=.064*r;for(let i of[0,t])e.beginPath(),e.moveTo(i-o,a-s),e.quadraticCurveTo(i-o*.35,a-s*.6,i,a),e.quadraticCurveTo(i+o*.35,a-s*.6,i+o,a-s),e.moveTo(i,a),e.lineTo(i,n+.02*r),e.stroke();e.globalAlpha=1,this.faceTex.needsUpdate=!0,this.faceDirty=!1}drawFeatures(e=this.featCtx,t=this.featRect.x,n=this.featRect.y){let r=this.faceW,i=this.faceH,a=this.pxPerUnit;e.save(),e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,e.canvas.width,e.canvas.height),e.translate(-t,-n);let o=r*.5,s=i*(1-this.arcOf(this.eyeV)),c=this.eyeR,l=Uu;e.fillStyle=l,e.strokeStyle=l,e.lineCap=`round`,e.lineJoin=`round`;let u=this.hand;u&&Pu(e,u,{cx:o,eyeY:s,unit:this.handUnit,radius:this.rFace*a,blink:this.blink>.5,talk:this.mouth});let d=this.eyeType===`cyclops`;for(let t of u?[]:d?[0]:[-1,1]){let n=o+t*this.eyeSep,r=c*1.15,i=c*1.15,u=c*.75,d=!1;switch(this.eyeType){case`cyclops`:r=i=c*2,u=c*.9;break;case`uneven`:r=i=t<0?c*1.5:c*.95,u=t<0?c*.72:c*.5;break;case`oval`:r=c*.95,i=c*1.45,u=c*.6;break;case`ring`:r=i=c*1.2,u=c*.42;break;case`sleepy`:r=c*1.25,i=c*1.05,u=c*.6,d=!0;break;case`wide`:r=i=c*1.45,u=c*.55}if(e.beginPath(),this.eyeType===`happy`){e.lineWidth=.045*a,e.arc(n,s+c*.45,c*1.1,Math.PI*1.12,Math.PI*1.88),e.stroke();continue}if(this.blink>.5){e.lineWidth=.045*a,e.moveTo(n-r*.95,s+c*.15),e.lineTo(n+r*.95,s+c*.15),e.stroke();continue}let f=n-t*r*.1,p=s+i*.12;e.fillStyle=`#ffffff`,e.lineWidth=.03*a,e.ellipse(n,s,r,i,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=l,e.beginPath(),e.arc(f,p,u,0,Math.PI*2),e.fill(),e.fillStyle=`#ffffff`,e.beginPath(),e.arc(f-u*.35,p-u*.35,u*.28,0,Math.PI*2),e.fill(),e.fillStyle=l,d&&(e.save(),e.beginPath(),e.ellipse(n,s,r+1,i+1,0,0,Math.PI*2),e.clip(),e.fillStyle=`#ffffff`,e.fillRect(n-r-2,s-i-2,r*2+4,i*.95),e.restore(),e.fillStyle=l,e.lineWidth=.04*a,e.beginPath(),e.moveTo(n-r,s-i*.05),e.lineTo(n+r,s-i*.05),e.stroke())}if(this.brows){e.lineWidth=(this.brows===`thick`?.075:.04)*a;let t=s-c*(d?2.7:1.9),n=c*1.3,r=this.brows===`up`?-.35:this.brows===`sad`?.35:0;if(this.brows===`uni`||d){let n=d?c*2.3:this.eyeSep+c*.9;e.beginPath(),e.moveTo(o-n,t+c*.25),e.quadraticCurveTo(o,t-c*.5,o+n,t+c*.25),e.stroke()}else for(let i of[-1,1]){let a=o+i*this.eyeSep;e.beginPath(),e.moveTo(a-i*n*.5,t+r*c),e.lineTo(a+i*n*.5,t-r*c),e.stroke()}}let f=s+c*(d?2.7:1.8);if(this.blush){e.lineWidth=.028*a;for(let t of[-1,1]){let n=o+t*(this.eyeSep+c*.3);for(let t of[-1,0,1])e.beginPath(),e.moveTo(n+t*c*.45-c*.18,f+c*.35),e.lineTo(n+t*c*.45+c*.18,f-c*.35),e.stroke()}}let p=s+this.mouthDrop,m=this.mouthW;if(e.lineWidth=.05*a,e.beginPath(),!u){if(this.mouth>0)e.ellipse(o,p+.06*a,m*.8,(.075+.09*this.mouth)*a,0,0,Math.PI*2),e.fill();else switch(this.mouthType){case`o`:e.arc(o,p+.03*a,.07*a,0,Math.PI*2),e.stroke();break;case`flat`:e.moveTo(o-m,p),e.lineTo(o+m,p),e.stroke();break;case`grin`:e.ellipse(o,p,m*1.25,.11*a,0,0,Math.PI),e.closePath(),e.fill();break;case`cat`:e.moveTo(o-m,p),e.quadraticCurveTo(o-m*.5,p+.1*a,o,p),e.quadraticCurveTo(o+m*.5,p+.1*a,o+m,p),e.stroke();break;case`wavy`:e.moveTo(o-m,p),e.quadraticCurveTo(o-m*.5,p+.12*a,o,p),e.quadraticCurveTo(o+m*.5,p-.12*a,o+m,p),e.stroke();break;case`teeth`:{e.moveTo(o-m,p),e.quadraticCurveTo(o,p+.13*a,o+m,p),e.stroke(),e.lineWidth=.028*a;let t=.055*a,n=.09*a;for(let r of[o-t-.006*a,o+.006*a])e.fillStyle=`#ffffff`,e.fillRect(r,p+.045*a,t,n),e.strokeRect(r,p+.045*a,t,n);e.fillStyle=l;break}case`tongue`:e.moveTo(o-m,p),e.quadraticCurveTo(o,p+.13*a,o+m,p),e.stroke(),e.lineWidth=.035*a,e.beginPath(),e.arc(o+m*.3,p+.055*a,.06*a,0,Math.PI),e.closePath(),e.fillStyle=`#ffffff`,e.fill(),e.stroke(),e.fillStyle=l;break;default:e.moveTo(o-m,p),e.quadraticCurveTo(o,p+.13*a,o+m,p),e.stroke()}}e.restore(),e===this.featCtx&&(this.featTex.needsUpdate=!0),this.featDirty=!1}measureFeatures(){let e=this.faceW,t=this.faceH;Wu||=document.createElement(`canvas`),(Wu.width<e||Wu.height<t)&&(Wu.width=Math.max(Wu.width,e),Wu.height=Math.max(Wu.height,t));let n=Wu.getContext(`2d`,{willReadFrequently:!0});n.clearRect(0,0,Wu.width,Wu.height);let r=[this.blink,this.mouth];for(let[e,t]of[[0,0],[1,0],[0,1],[1,1]])this.blink=e,this.mouth=t,this.drawFeatures(n,0,0);[this.blink,this.mouth]=r;let i=n.getImageData(0,0,e,t).data,a=e,o=t,s=-1,c=-1;for(let n=0;n<t;n++){let t=n*e*4;for(let r=0;r<e;r++)i[t+r*4+3]!==0&&(r<a&&(a=r),r>s&&(s=r),n<o&&(o=n),n>c&&(c=n))}return s<0?{x:Math.floor(e/2)-8,y:Math.floor(t/2)-8,w:16,h:16}:(a=Math.max(0,a-10),o=Math.max(0,o-10),s=Math.min(e,s+10+1),c=Math.min(t,c+10+1),{x:a,y:o,w:s-a,h:c-o})}sleep(){this.state=`sleep`,this.blink=1,this.featDirty=!0}wake(){this.blink=0,this.blinkTimer=this.rng.range(1.5,4),this.featDirty=!0,this.say(!0),this.startWiggle(),this.hopT=pd,this.state=`idle`,this.timer=.9}savePose(){this.stagePose={x:this.root.position.x,z:this.root.position.z,heading:this.heading}}restorePose(){let e=this.stagePose;e&&(this.root.position.set(e.x,0,e.z),this.heading=this.targetHeading=e.heading,this.root.rotation.y=e.heading),this.stagePose=null}beginTransit(){this.state=`transit`,this.clearIdleAnim(),this.wiggle=0,this.gait=0,this.torso.rotation.set(0,0,0),this.torso.position.set(0,this.baseY,0),this.reaction=null,this.reactionName=null;for(let e of this.legs)e.rotation.x=0}setLift(e){this.root.position.y=e,this.shadow.position.y=.002-e;let t=Math.max(.25,1-.35*e);this.shadow.scale.set(t,t,1)}land(){this.setLift(0),this.squash=1}posePaint(){this.beginTransit(),this.state=`paint`,this.root.position.set(0,0,0),this.heading=this.targetHeading=Math.PI,this.root.rotation.y=this.heading,this.setLift(0)}enterPaint(){this.savePose(),this.posePaint()}exitPaint(){this.restorePose(),this.enterIdle()}enterTo(e,t){this.state=`enter`,this.target.set(e,0,t),this.clearIdleAnim()}leaveTo(e){this.state=`leave`,this.target.set(e,0,this.root.position.z+this.rng.range(-.8,.8)),this.clearIdleAnim(),this.rng.chance(.5)&&this.say()}dispose(){this.sprout.detach(),this.root.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(e.material.map&&e.material.map.dispose(),e.material===this.body?.material&&this.featTex?.dispose(),e.material.gradientMap&&e.material.gradientMap.dispose(),e.material.dispose())})}enterWander(){let e=this.stage.bounds,t=this.root.position;for(let n=0;n<12;n++){let n=this.rng.range(e.minX,e.maxX),r=this.rng.range(e.minZ,e.maxZ),i=Math.hypot(n-t.x,r-t.z);if(this.target.set(n,0,r),i>2.5&&i<7)break}this.state=`wander`,this.clearIdleAnim(),this.rng.chance(.65)&&this.say()}enterIdle(){if(this.state=`idle`,this.clearIdleAnim(),this.rng.chance(yd)){this.timer=this.rng.range(1.2,3);return}let e=_d.drowsy>0&&this.rng.chance(_d.drowsy*.5),t=e?vd[0]:this.rng.pick(vd),n=t.dur()*(e?1.8:1);this.timer=n+this.rng.range(.4,1.4)*(1+_d.drowsy),this.idleName=t.name;let r=0;this.idleAnim=e=>{if(r+=e,r>=n){this.clearIdleAnim();return}this.pose=t.pose(r,n,this)}}clearIdleAnim(){this.idleAnim=null,this.idleName=null,this.pose=null,this.lookOffset=0}startWiggle(){let e=0;this.idleAnim=t=>{e+=t;let n=Math.min(1,e/.6);this.wiggle=Math.sin(e*28)*.13*Math.sin(Math.PI*n),n>=1&&(this.idleAnim=null,this.wiggle=0)}}celebrate(){this.say(!0,1.12,3),this.hopT=pd,this.clearIdleAnim(),this.gazeAt(this.root.position.x,this.root.position.z+10,1.6)}react(e,t=0){if(!Sd.has(this.state)||this.reaction)return!1;let n=e.dur(),r=-t;return this.clearIdleAnim(),this.reactionName=e.name,this.reaction=t=>{let i=r;if(r+=t,!(r<0)){if(r>=n){this.reaction=null,this.reactionName=null,this.pose=null;return}e.land!=null&&i<e.land&&r>=e.land&&(this.squash=1,this.stepSound()),this.pose=e.pose(r,n,this)}},!0}stumble(e=0){this.stumbleSide=this.rng.sign(),this.react(wd,e)&&this.sayAgain<=0&&(this.sayAgain=e+.28,this.sayAgainPitch=1.2)}spin(){this.react(Cd)&&this.say()}noticePointer(){this.attention=.6,this.sprout.excite=1}gazeAt(e,t,n){this.gazeTimer<=0&&(this.squash=1),this.gaze.x=e,this.gaze.z=t,this.gazeTimer=n,this.clearIdleAnim()}say(e=!1,t=1,n=0){if(!this.audio.ready||this.stage.mode===`paint`&&this.state!==`paint`||!e&&!this.audio.voiceGate(Ru))return;let r=Lu.map((e,t)=>t).filter(e=>e!==this.lastWord&&(!n||Lu[e].length===n));this.lastWord=r[Math.floor(Math.random()*r.length)];let i=Lu[this.lastWord].map(e=>this.audio.tone(this.syllable,this.seed,e)),a=(i[0].recorded?Math.min(1.12,Math.max(.92,this.voice)):this.voice)*t,o=this.audio.speak(i.map(e=>({buffer:e.buffer,rate:e.rate*a*(.98+Math.random()*.04)})),{pan:this.stage.panFor(this.root.position),gain:.9});o.length&&(this.speech=o,this.speechT=0)}stepSound(){if(!this.audio.ready||this.stage.mode===`paint`||!this.audio.stepGate(zu))return;this.stepHi=!this.stepHi;let e=this.audio.tone(this.syllable,this.seed,this.stepHi?`hi`:`lo`),t=e.recorded?Math.min(1.12,Math.max(.92,this.voice)):this.voice;this.audio.playBuffer(e.buffer,{pan:this.stage.panFor(this.root.position),rate:e.rate*t*(.97+Math.random()*.06),gain:Bu})}updateFace(e){if(this.blinkTimer-=e,this.blinkTimer<=0&&(this.blink>0?(this.blink=0,this.blinkTimer=this.rng.range(1.5,4.5)):(this.blink=1,this.blinkTimer=.12),this.featDirty=!0),this.speech){for(this.speechT+=e;this.speech.length&&this.speech[0].at<=this.speechT;){let e=this.speech.shift();this.mouth=1,this.mouthTimer=Math.max(.07,e.dur*.6),this.talk=1,this.featDirty=!0}this.speech.length||(this.speech=null)}this.mouth>0&&(this.mouthTimer-=e,this.mouthTimer<=0&&(this.mouth=0,this.featDirty=!0))}applyTalk(e){return this.talk=Math.max(0,this.talk-e*4),Math.sin(Math.PI*this.talk)*.09}update(e){let t=this.rng;if(this.state===`gone`)return;if(this.sprout.update(e),this.state===`sleep`){this.breath+=e;let t=1+.02*Math.sin(this.breath*2.2);this.torso.scale.set(1/Math.sqrt(t),t,1/Math.sqrt(t)),this.faceDirty&&this.drawBase(),this.featDirty&&this.drawFeatures();return}if(this.state===`paint`||this.state===`transit`){this.updateFace(e),this.breath+=e,this.squash=Math.max(0,this.squash-e*7);let n=Math.sin(Math.PI*this.squash)*.08,r=this.applyTalk(e),i=this.state===`paint`?.012*Math.sin(this.breath*2.2):0,a=1+n*.7-r*.4;this.torso.scale.set(a,1-n+r+i,a),this.state===`paint`&&t.chance(.08*e)&&this.say(),this.faceDirty&&this.drawBase(),this.featDirty&&this.drawFeatures();return}if(this.updateFace(e),this.sayAgain>0&&(this.sayAgain-=e,this.sayAgain<=0&&this.say(!0,this.sayAgainPitch)),this.hopT>0){this.hopT-=e;let t=Math.min(1,1-this.hopT/pd);this.setLift(Math.sin(Math.PI*t)*md),this.hopT<=0&&this.land()}this.attention>0&&(this.attention-=e),this.gazeTimer>0&&(this.gazeTimer-=e);let n=!1,r=this.root.position,i=this.state===`wander`||this.state===`enter`||this.state===`leave`;if(!(i&&(this.attention>0||this.gazeTimer>0||this.reaction))){if(i){let t=this.target.x-r.x,i=this.target.z-r.z,a=Math.hypot(t,i);if(a<.12){if(this.state===`leave`){this.state=`gone`;return}this.enterIdle()}else{n=!0;let o=t/a+this.avoid.x,s=i/a+this.avoid.z,c=Math.hypot(o,s)||1;o/=c,s/=c,this.targetHeading=Math.atan2(-o,-s);let l=Math.hypot(this.avoid.x,this.avoid.z),u=Math.min(1,a/1.2),d=this.speed*(.35+.65*u)*(1-.25*_d.drowsy)/(1+.6*l),f=Math.min(a,d*e);r.x+=o*f,r.z+=s*f,this.phase+=f/this.stepLength*Math.PI}}else this.state===`idle`&&(this.timer-=e,t.chance(this.chattiness*e)&&this.say(),this.timer<=0&&this.enterWander())}if(this.idleAnim&&this.idleAnim(e),this.reaction&&this.reaction(e),this.state===`wander`||this.state===`idle`){let e=this.stage.bounds;r.x=Math.min(e.maxX,Math.max(e.minX,r.x)),r.z=Math.min(e.maxZ,Math.max(e.minZ,r.z))}if(this.gazeTimer>0){let e=this.gaze.x-r.x,t=this.gaze.z-r.z;Math.hypot(e,t)>.3&&(this.targetHeading=Math.atan2(-e,-t))}let a=fd(this.targetHeading-this.heading);this.heading+=a*Math.min(1,e*4),this.root.rotation.y=this.heading+this.lookOffset,this.gait+=(+!!n-this.gait)*Math.min(1,e*9);let o=Math.sin(this.phase),s=Math.abs(o)*this.gait,c=Math.sign(o);n&&c!==0&&this.lastStepSign!==0&&c!==this.lastStepSign&&(this.squash=1,this.stepCount++,this.stepSound(),this.onStep?.(this)),this.lastStepSign=c,this.squash=Math.max(0,this.squash-e*7);let l=Math.sin(Math.PI*this.squash)*.06,u=this.applyTalk(e),d=1-l+u,f=1+l*.7-u*.4;this.torso.scale.set(f,d,f);let p=this.pose||{};this.torso.position.x=p.dx||0,this.torso.position.y=this.baseY+s*this.bobHeight+(p.dy||0),this.torso.rotation.z=o*.07*this.gait+this.wiggle+(p.tilt||0),this.torso.rotation.x=-.05*this.gait+(p.pitch||0),p.spin&&(this.root.rotation.y+=p.spin);let m=o*.6*this.gait;this.legs[0].rotation.x=m+(p.legL||0),this.legs[1].rotation.x=-m+(p.legR||0);let h=1-.3*(s*this.bobHeight)/.18;this.shadow.scale.set(h,h,1),this.faceDirty&&this.drawBase(),this.featDirty&&this.drawFeatures()}},Ed=35,Dd=8,Od=40,kd=8.5,Ad=class{constructor(e){this.renderer=new tl({canvas:e,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(15790320,1),this.scene=new An,this.mode=`stage`,this.stageCamera=new fa(-1,1,1,-1,.1,200);let t=wt.degToRad(Ed);this.stageCamera.position.set(0,Math.sin(t)*Od,Math.cos(t)*Od),this.stageCamera.lookAt(0,0,0),this.paintCamera=new fa(-1,1,1,-1,.1,200),this.paintCamera.layers.set(1),this.subject=Zu,this.paintInset=0,this.aimPaintCamera();let n=new $i(16777215,14211288,1.6),r=new ma(16777215,1.1);r.position.set(-6,10,8),n.layers.enable(1),r.layers.enable(1),this.scene.add(n,r),this.hemi=n,this.key=r,this.bounds={minX:-4,maxX:4,minZ:-4,maxZ:4},this._groundPlane=new ci(new G(0,1,0),0),this._ray=new Pa,this._v2=new W,this._v3=new G,this._w=0,this._h=0,this.resize(),window.addEventListener(`resize`,()=>this.resize())}setPaintSubject(e){this.subject=e,this.aimPaintCamera(),this.resize()}setPaintInset(e){Math.abs(e-this.paintInset)<1||(this.paintInset=e,this.resize())}aimPaintCamera(){let e=wt.degToRad(Dd);this.paintFocusY=this.subject.faceY,this.paintCamera.position.set(0,this.paintFocusY+Math.sin(e)*Od,Math.cos(e)*Od),this.paintCamera.lookAt(0,this.paintFocusY,0),this.paintCamera.updateMatrixWorld(!0)}get camera(){return this.mode===`paint`?this.paintCamera:this.stageCamera}setMode(e){this.mode=e,this.renderer.setClearAlpha(e===`paint`?0:1)}resize(){let e=window.innerWidth,t=window.innerHeight;if(e===0||t===0)return;(e!==this._w||t!==this._h)&&this.renderer.setSize(e,t,!1),this._w=e,this._h=t;let n=e/t;this.setFrustum(this.stageCamera,kd,n);let r=this.subject.faceY*t/Math.max(t*.12,t/2-this.paintInset-6),i=Math.max(this.subject.height/.78,this.subject.width/.62/n,r);this.setFrustum(this.paintCamera,i,n),this.computeBounds()}setFrustum(e,t,n){let r=t/2,i=r*n;e.left=-i,e.right=i,e.top=r,e.bottom=-r,e.updateProjectionMatrix()}computeBounds(){this.stageCamera.updateMatrixWorld(!0);let e=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([e,t])=>{this._ray.setFromCamera(this._v2.set(e,t),this.stageCamera);let n=new G;return this._ray.ray.intersectPlane(this._groundPlane,n),n}),t=e.map(e=>e.x),n=e.map(e=>e.z),r=1.1,i=Math.min(...t)+r,a=Math.max(...t)-r,o=Math.min(...n)+3,s=Math.max(...n)-1;if(a-i<1){let e=(i+a)/2;i=e-.5,a=e+.5}if(s-o<1){let e=(o+s)/2;o=e-.5,s=e+.5}let c=this.bounds,l=(e,t)=>Math.abs(e-t)<1e-6;c&&l(c.minX,i)&&l(c.maxX,a)&&l(c.minZ,o)&&l(c.maxZ,s)||(this.bounds={minX:i,maxX:a,minZ:o,maxZ:s})}groundPoint(e,t){this._v2.set(e/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),this._ray.setFromCamera(this._v2,this.stageCamera);let n=new G;return this._ray.ray.intersectPlane(this._groundPlane,n)?n:null}toScreen(e){return this._v3.copy(e).project(this.camera),{x:(this._v3.x+1)/2*window.innerWidth,y:(1-this._v3.y)/2*window.innerHeight}}panFor(e){return this._v3.copy(e).project(this.camera),Math.max(-1,Math.min(1,this._v3.x))*.85}render(){(window.innerWidth!==this._w||window.innerHeight!==this._h)&&this.resize(),this.renderer.render(this.scene,this.camera)}},jd=1500,Md=2**(3/12),Nd=.06,Pd=class{constructor(){this.ctx=null,this.master=null,this.pending=new Map,this.buffers=new Map,this.syllables=new Map,this.voices=new Map,this.recorded=[],this.voiceIndex=null,this.voiceIndexPromise=null,this.lastVoice=-1/0,this.lastStep=-1/0,document.addEventListener(`visibilitychange`,()=>{!document.hidden&&this.ctx&&this.ctx.state!==`running`&&this.ctx.resume().catch(()=>{})})}get ready(){return!!this.ctx&&this.ctx.state===`running`}voiceGate(e){let t=performance.now()/1e3;return t-this.lastVoice<e?!1:(this.lastVoice=t,!0)}stepGate(e){let t=performance.now()/1e3;return t-this.lastStep<e?!1:(this.lastStep=t,!0)}syllable(e,t){if(!this.ctx)return null;let n=`${e}|${t}`,r=this.syllables.get(n);return r||(r=mu(this.ctx,e,t),this.syllables.set(n,r)),r}loadVoiceIndex(e){return this.voiceIndexPromise=fetch(e).then(e=>e.ok?e.json():null).catch(()=>null).then(t=>{if(this.voiceIndex=t&&typeof t==`object`?t:null,!this.voiceIndex)return;let n=e.slice(0,e.lastIndexOf(`/`)+1);for(let e of Object.values(this.voiceIndex))for(let t of[...e.lo||[],...e.hi||[]])this.preload(`voice:${t}`,n+t).catch(()=>{})}),this.voiceIndexPromise}buildVoiceBank(){if(this.voiceIndex){for(let[e,t]of Object.entries(this.voiceIndex)){let n=(t.lo||[]).map(e=>this.buffers.get(`voice:${e}`)).filter(Boolean),r=(t.hi||[]).map(e=>this.buffers.get(`voice:${e}`)).filter(Boolean);(n.length||r.length)&&this.voices.set(e,{lo:n,hi:r})}this.recorded=[...this.voices.keys()].sort()}}tone(e,t,n){let r=this.voices.get(e);if(!r&&this.recorded.length&&(r=this.voices.get(this.recorded[(t>>>0)%this.recorded.length])),r){let e=r[n];if(e.length)return{buffer:e[Math.floor(Math.random()*e.length)],rate:1,recorded:!0};let t=r[n===`hi`?`lo`:`hi`];return{buffer:t[Math.floor(Math.random()*t.length)],rate:n===`hi`?Md:1/Md,recorded:!0}}return{buffer:this.syllable(e,n),rate:1,recorded:!1}}speak(e,{pan:t=0,gain:n=1}={}){let r=[];if(!this.ready)return r;let i=0;for(let a of e){if(!a.buffer)continue;let e=a.buffer.duration/a.rate;this.playBuffer(a.buffer,{pan:t,rate:a.rate,gain:n,when:i}),r.push({at:i,dur:e}),i+=Math.max(.09,e-Nd)}return r}preload(e,t){let n=fetch(t).then(e=>{if(!e.ok)throw Error(`audio: ${t} -> ${e.status}`);return e.arrayBuffer()});return this.pending.set(e,n),n}async unlock(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.8,this.master.connect(this.ctx.destination)}this.ctx.state!==`running`&&await this.ctx.resume();let e=(async()=>{this.voiceIndexPromise&&await this.voiceIndexPromise,await Promise.all([...this.pending].map(async([e,t])=>{if(!this.buffers.has(e))try{let n=await t;this.buffers.set(e,await this.ctx.decodeAudioData(n.slice(0))),e.startsWith(`voice:`)&&this.buildVoiceBank()}catch{}})),this.buildVoiceBank()})();return await Promise.race([e,new Promise(e=>setTimeout(e,jd))]),this.ready}play(e,t){let n=this.buffers.get(e);return n?this.playBuffer(n,t):null}playBuffer(e,{pan:t=0,rate:n=1,gain:r=1,when:i=0}={}){if(!this.ready||!e)return null;let a=this.ctx,o=a.createBufferSource();o.buffer=e,o.playbackRate.value=n;let s=a.createGain();s.gain.value=r;let c,l=Math.max(-1,Math.min(1,t));return a.createStereoPanner?(c=a.createStereoPanner(),c.pan.value=l):(c=a.createPanner(),c.panningModel=`equalpower`,c.setPosition(l,0,1-Math.abs(l))),o.connect(s),s.connect(c),c.connect(this.master),o.start(a.currentTime+i),o}};function Fd(e){return e.getContext(`2d`,{willReadFrequently:!0})}var Id=[{name:`peach`,base:`#f6c48a`,under:`#dba05f`,light:`#fbe2c3`},{name:`pink`,base:`#ffb3c1`,under:`#e48a9b`,light:`#ffdbe2`},{name:`mint`,base:`#a8e6cf`,under:`#7cc7ab`,light:`#d6f4e8`},{name:`sky`,base:`#a9d8f0`,under:`#7fb6d3`,light:`#d6ecf8`},{name:`lilac`,base:`#c9b8f0`,under:`#a391d6`,light:`#e6defa`},{name:`butter`,base:`#ffe08a`,under:`#e3bd55`,light:`#fff1c6`},{name:`coral`,base:`#ffab91`,under:`#e08568`,light:`#ffd7ca`}],Ld={name:`card`,base:`#efe6d8`,under:`#cdc0ab`,light:`#f8f3ea`},Rd=.2,zd=.055,Bd=-1;function Vd(){let e;do e=Math.floor(Math.random()*Id.length);while(e===Bd);return Bd=e,Id[e]}var Hd=.86;function Ud(e,{radius:t,teeth:n,tint:r,sockets:i=0,socketOffset:a=0,socketR:o=0,ringR:s=0,dpr:c=1,grain:l=!0,style:u=Wd,seed:d=1}){let f=Math.ceil(t*2+8);e.width=Math.round(f*c),e.height=Math.round(f*c),e.style.width=`${f}px`,e.style.height=`${f}px`;let p=Fd(e);p.setTransform(c,0,0,c,0,0);let m=f/2,h=f/2,g=t*Hd,_=Math.min((t-g)*.66,Math.PI*t*.93/n/2);p.fillStyle=r.base,p.beginPath(),p.arc(m,h,g+.5,0,Kd),p.fill();for(let e=0;e<n;e++){let r=e*Kd/n,i=m+Math.cos(r)*(t-_),a=h+Math.sin(r)*(t-_);p.beginPath(),p.moveTo(m+Math.cos(r)*g*.96-Math.sin(r)*_,h+Math.sin(r)*g*.96+Math.cos(r)*_),p.lineTo(i-Math.sin(r)*_,a+Math.cos(r)*_),p.lineTo(i+Math.sin(r)*_,a-Math.cos(r)*_),p.lineTo(m+Math.cos(r)*g*.96+Math.sin(r)*_,h+Math.sin(r)*g*.96-Math.cos(r)*_),p.closePath(),p.fill(),p.beginPath(),p.arc(i,a,_,0,Kd),p.fill()}l&&(p.save(),p.beginPath(),p.arc(m,h,g-1,0,Kd),p.clip(),Jd(p,r,t*.012),Xd(p,u,qd(d),m-g,h-g,g*2,g*2),p.restore()),p.fillStyle=r.light;for(let e=0;e<i;e++){let t=a+e*Kd/i;p.beginPath(),p.arc(m+Math.cos(t)*s,h+Math.sin(t)*s,o,0,Kd),p.fill()}p.fillStyle=r.under,p.beginPath(),p.arc(m,h,Math.max(3,t*(i?.05:.11)),0,Kd),p.fill()}var Wd=`plank`,Gd=.5,Kd=Math.PI*2;function qd(e){let t=e>>>0||1;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Jd(e,t,n){e.strokeStyle=t.under,e.globalAlpha=Gd,e.lineWidth=Math.max(1.4,n),e.lineCap=`round`,e.lineJoin=`round`}function Yd(e,t,n,r,i=0){for(let[a,o]of[[1,.5],[.5,3.3]])e.beginPath(),e.ellipse(t,n,r*1.45*a,r*a,i,o,o+Math.PI*1.7),e.stroke()}function Xd(e,t,n,r,i,a,o){(t===`plank`?Qd:t===`flecks`?$d:Zd)(e,n,r,i,a,o)}function Zd(e,t,n,r,i,a){let o=Math.min(i,a),s=i>a*1.5,c=s?n+i*(t()<.5?-.1-t()*.25:1.1+t()*.25):n+i*(.25+t()*.5),l=r+a*(.25+t()*.5),u=Math.hypot(Math.max(c-n,n+i-c),Math.max(l-r,r+a-l)),d=o*.17;for(let n=d*(.45+t()*.4);n<u;n+=d*(.8+t()*.55)){let r=t()*Kd,i=t()*Kd,a=t()*Kd,o=s?Kd:Kd*(.5+t()*.4);e.beginPath();for(let t=0;t<=48;t++){let s=a+t/48*o,u=n*(1+.04*Math.sin(3*s+r)+.02*Math.sin(7*s+i));e.lineTo(c+Math.cos(s)*u,l+Math.sin(s)*u)}e.stroke()}let f=t()<.5?.22:.78;Yd(e,n+i*(s?f:.2+t()*.6),r+a*(.3+t()*.4),o*.075,t()*Kd)}function Qd(e,t,n,r,i,a){let o=Math.min(i,a),s=i>a*1.5,c=Math.hypot(i,a)/2,l=o*.15;e.save(),e.translate(n+i/2,r+a/2),e.rotate(s?(t()-.5)*.14:t()*Math.PI);let u=[];for(let e=0;e<(s||t()<.5?2:1);e++)u.push({x:(t()-.5)*c*(s?1.3:.9),y:(t()-.5)*o*.4,wide:o*(.3+t()*.25),up:e?1:-1});for(let n=-c;n<=c;n+=l*(.85+t()*.3)){let r=-c*(.82+t()*.18),i=c*(.82+t()*.18),a=t()*6;e.beginPath();for(let t=0;t<=44;t++){let s=r+(i-r)*t/44,c=n+Math.sin(a+s/o*2.2)*o*.012;for(let e of u){let t=Math.exp(-(((n-e.y)/(o*.3))**2));c+=e.up*l*2.4*t*Math.exp(-(((s-e.x)/e.wide)**2))}e.lineTo(s,c)}e.stroke()}e.restore()}function $d(e,t,n,r,i,a){let o=Math.min(i,a),s=i>a*1.5,c=s?(t()-.5)*.3:t()*Math.PI,l=Math.round(i*a/(o*o)*10);for(let s=0;s<l;s++){let s=n+i*(.06+t()*.88),l=r+a*(.08+t()*.84),u=o*(.09+t()*.13),d=c+(t()-.5)*.3,f=(t()-.5)*u*.3,p=Math.cos(d)*u/2,m=Math.sin(d)*u/2;e.beginPath(),e.moveTo(s-p,l-m),e.quadraticCurveTo(s-Math.sin(d)*f,l+Math.cos(d)*f,s+p,l+m),e.stroke()}Yd(e,n+i*(s?t()<.5?.2:.8:.25+t()*.5),r+a*(.3+t()*.4),o*.07,t()*Kd)}function ef(e,t,n,r,{dpr:i=2,style:a=Wd,seed:o=1}={}){let s=Math.max(3,t*zd*1.6),c=document.createElement(`canvas`);c.width=Math.round(e*i),c.height=Math.round((t+s)*i),c.style.width=`${e}px`,c.style.height=`${t+s}px`;let l=Fd(c);return l.setTransform(i,0,0,i,0,0),l.fillStyle=n.under,l.beginPath(),r(l,s),l.fill(),l.fillStyle=n.base,l.beginPath(),r(l,0),l.fill(),l.save(),l.clip(),Jd(l,n,t*.033),Xd(l,a,qd(o),0,0,e,t),l.restore(),c}function tf(e,t,n){return ef(e,e,t,(t,n)=>t.arc(e/2,e/2+n,e/2-1,0,Kd),n)}function nf(e,t,n,r){return ef(e,t,n,(n,r)=>n.roundRect(1,1+r,e-2,t-2,t/2),r)}function rf(e,t){let n=document.createElement(`canvas`);n.width=n.height=e;let r=Fd(n),i=e*zd,a=e/2-i*.5-1,o=t(r),s=t=>{r.beginPath(),r.arc(e/2,t,a,0,Math.PI*2)};return s(e/2+i*.5),r.fillStyle=o,r.fill(),r.fillStyle=`rgba(0, 0, 0, ${Rd})`,r.fill(),s(e/2-i*.5),r.fillStyle=o,r.fill(),n}var af=`var(--c, #ff6b6b)`,of=`#fffdf8`,sf=64*zd;function cf(e,t=``){let n=t=>e.map(([e,n])=>`${e} style="fill:${t?`#000`:n}${e.includes(`stroke-width`)?`;stroke:${t?`#000`:n}`:``}" />`).join(``),r=e=>t?`<g transform="${t}">${n(e)}</g>`:n(e);return`<svg class="art" viewBox="0 0 64 64" aria-hidden="true"><g transform="translate(0 ${sf})">${r(!1)}<g opacity="${Rd}">${r(!0)}</g></g>${r(!1)}</svg>`}var lf=`translate(32 30) scale(1.06) translate(-32 -32) rotate(45 32 32)`,uf={soft:{tip:{x:.16,y:.15},particle:`drop`,art:cf([[`<rect x="35" y="28" width="26" height="8" rx="4"`,`#8fd0ea`],[`<rect x="27" y="26" width="10" height="12" rx="2"`,of],[`<path d="M28 23 C17 19 5 25 3 32 C5 39 17 45 28 41 Z"`,af]],lf)},brush:{tip:{x:.18,y:.17},particle:`drop`,art:cf([[`<rect x="37" y="27" width="24" height="10" rx="5"`,`#ffc078`],[`<rect x="27" y="23" width="11" height="18" rx="2"`,of],[`<path d="M27 23 H12 Q7 23 7 28 V36 Q7 41 12 41 H27 Z"`,af]],lf)},crayon:{tip:{x:.17,y:.16},particle:`drop`,art:cf([[`<rect x="17" y="25" width="43" height="14" rx="4"`,af],[`<rect x="29" y="25" width="20" height="14"`,of],[`<path d="M17 27 L6 32 L17 37 Z" stroke-width="3" stroke-linejoin="round"`,af]],lf)},marker:{tip:{x:.17,y:.16},particle:`drop`,art:cf([[`<rect x="20" y="24" width="40" height="16" rx="7"`,of],[`<path d="M50 24 H53 Q60 24 60 32 Q60 40 53 40 H50 Z"`,af],[`<rect x="13" y="27" width="9" height="10" rx="2"`,af],[`<path d="M13 29 L6 31 V33 L13 35 Z" stroke-width="2" stroke-linejoin="round"`,af]],lf)},cloth:{tip:{x:.5,y:.55},particle:`spark`,art:cf([[`<rect x="7" y="22" width="48" height="30" rx="9"`,`#ffd95e`],[`<ellipse cx="19" cy="32" rx="4" ry="3.4"`,`#e9b93c`],[`<ellipse cx="32" cy="29" rx="2.8" ry="2.4"`,`#e9b93c`],[`<ellipse cx="44" cy="35" rx="4.4" ry="3.8"`,`#e9b93c`],[`<ellipse cx="25" cy="43" rx="3.2" ry="2.8"`,`#e9b93c`],[`<ellipse cx="37" cy="45" rx="2.4" ry="2"`,`#e9b93c`],[`<circle cx="50" cy="15" r="5.5"`,`#bfe6f7`],[`<circle cx="59" cy="24" r="3.2"`,`#bfe6f7`]],`rotate(-8 32 32)`)}},df=cf([[`<path d="M9 32 L29 13 V24 H53 Q56 24 56 27 V37 Q56 40 53 40 H29 V51 Z" stroke-width="5" stroke-linejoin="round"`,`#ff8a73`]]),ff={cord:`#d9bfa0`,bead:Id[1],plate:Id[5]},pf=[`dots`,`stripes`,`checks`,`zigzag`,`rings`,`hearts`,`stars`],mf=137.508,hf=(e,t)=>(e%t+t)%t;function gf(e,t){let n=(e^Math.imul(t|0,2654435761))>>>0;return n=Math.imul(n^n>>>16,2246822507)>>>0,n=Math.imul(n^n>>>13,3266489909)>>>0,((n^n>>>16)>>>0)/4294967296}var _f=(e,t,n)=>`hsl(${hf(e,360).toFixed(0)} ${t.toFixed(0)}% ${n.toFixed(0)}%)`,vf=(e,t=0)=>Math.min(1,hf(e+30,360)/360*.85+t);function yf(e,t,n,r){let i=_f(e,t,n);return{id:`s:${i}`,kind:`solid`,color:i,ink:i,register:vf(e,r)}}function bf(e){let t=Math.random()*4294967295>>>0,n=Math.random()*360,r=pf.slice().sort(()=>Math.random()-.5),i=new Map,a=i=>{let a=n+i*mf+(gf(t,i)-.5)*16;if(e===`saturated`)return yf(a,78+14*gf(t,i+7),48+8*gf(t,i+13),0);if(e===`pastel`)return yf(a,62+18*gf(t,i+7),76+6*gf(t,i+13),.15);let o=r[hf(i,r.length)],s=_f(a,80,50),c=_f(a+150+60*gf(t,i+3),70,89),l=Math.round(52+26*gf(t,i+21));return{id:`p:${o}|${s}|${c}|${l}`,kind:`pattern`,pattern:o,fg:s,bg:c,size:l,ink:s,register:vf(a,.05)}};return{kind:e,at(e){return i.has(e)||i.set(e,a(e)),i.get(e)}}}function xf(e,t,n,r){let i=document.createElement(`canvas`);i.width=i.height=Math.max(4,Math.round(r));let a=Fd(i);return a.fillStyle=n,a.fillRect(0,0,i.width,i.height),a.drawImage(Df(e,t,i.width),0,0),i}var Sf=new Map;function Cf(e,t,n=1){if(t.kind!==`pattern`)return t.color;let r=`${t.id}@${n.toFixed(3)}`,i=Sf.get(r);return i||(i=e.createPattern(xf(t.pattern,t.fg,t.bg,t.size*n),`repeat`),Sf.set(r,i),Sf.size>200&&Sf.delete(Sf.keys().next().value)),i}function wf(e,t=128){return rf(t,t=>Cf(t,e,.55))}function Tf(e,t,n,r,i){e.beginPath();for(let a=0;a<10;a++){let o=a%2==0?r:i,s=-Math.PI/2+a*Math.PI/5;e.lineTo(t+Math.cos(s)*o,n+Math.sin(s)*o)}e.closePath(),e.fill()}function Ef(e,t,n,r){e.beginPath(),e.moveTo(t,n+r*.9),e.bezierCurveTo(t-r*1.5,n-r*.1,t-r*.7,n-r*1.1,t,n-r*.35),e.bezierCurveTo(t+r*.7,n-r*1.1,t+r*1.5,n-r*.1,t,n+r*.9),e.fill()}function Df(e,t,n=32){let r=document.createElement(`canvas`);r.width=n,r.height=n;let i=Fd(r);i.fillStyle=t,i.strokeStyle=t;let a=n/2;switch(e){case`dots`:{let e=n*.19;for(let[t,r]of[[a,a],[0,0],[n,0],[0,n],[n,n]])i.beginPath(),i.arc(t,r,e,0,Math.PI*2),i.fill();break}case`stripes`:i.lineWidth=n*.3,i.lineCap=`butt`;for(let e of[-n,0,n])i.beginPath(),i.moveTo(e-a,n+a),i.lineTo(e+n+a,-a),i.stroke();break;case`zigzag`:i.lineWidth=n*.16,i.lineJoin=`round`,i.lineCap=`round`,i.beginPath(),i.moveTo(-n*.25,a+n*.22);for(let e=0;e<=n+n*.25;e+=n*.25){let t=Math.round(e/(n*.25))%2==0;i.lineTo(e,a+(t?-1:1)*n*.22)}i.stroke();break;case`rings`:i.lineWidth=n*.11;for(let[e,t]of[[a,a],[0,0],[n,0],[0,n],[n,n]])i.beginPath(),i.arc(e,t,n*.3,0,Math.PI*2),i.stroke();break;case`hearts`:Ef(i,a,a,n*.28);for(let[e,t]of[[0,0],[n,0],[0,n],[n,n]])Ef(i,e,t,n*.17);break;case`stars`:Tf(i,a,a,n*.36,n*.15);for(let[e,t]of[[0,0],[n,0],[0,n],[n,n]])Tf(i,e,t,n*.18,n*.075);break;default:i.fillRect(0,0,a,a),i.fillRect(a,a,a,a)}return r}var Of=.3,kf=4.2,Af=.2,jf=.07,Mf=18;function Nf(e,t,n){let r=e*374761393+t*668265263+n*1442695041|0;return r=(r^r>>>13)*1274126177,r^=r>>>16,(r>>>0)/4294967295*2-1}function Pf(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=e-r,o=t-i,s=a*a*(3-2*a),c=o*o*(3-2*o),l=Nf(r,i,n),u=Nf(r+1,i,n),d=Nf(r,i+1,n),f=Nf(r+1,i+1,n);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c}var Ff=(e,t,n)=>.62*Pf(e,t,n)+.38*Pf(e*2.37+17,t*2.37+5,n);function If(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return(t>>>0)%9973}function Lf(e,t,n,r){let i=[],a=null,o=r*kf,s=r*Of,c=(e,t)=>{a={pts:[e,t],closed:!1},i.push(a)},l=(e,t)=>{a?a.pts.push(e,t):c(e,t)},u=()=>a?[a.pts[a.pts.length-2],a.pts[a.pts.length-1]]:[0,0],d=(e,t)=>[e+s*Ff(e/o,t/o,n),t+s*Ff(e/o+31.7,t/o+11.3,n)],f=(e,t)=>{let n=e.pts,r=[],i=n.length/2,a=e.closed?i:i-1;for(let e=0;e<a;e++){let a=n[e*2],o=n[e*2+1],s=n[(e+1)%i*2],c=n[(e+1)%i*2+1],l=Math.max(1,Math.ceil(Math.hypot(s-a,c-o)/t));for(let e=0;e<l;e++)r.push(d(a+(s-a)*e/l,o+(c-o)*e/l))}return(!e.closed||i===1)&&r.push(d(n[(i-1)*2],n[(i-1)*2+1])),r},p=(e,t,n,r,i,a,o,s)=>{let c=o-a,u=Math.PI*2;s?c<=-u?c=-u:(c%=u,c>0&&(c-=u)):c>=u?c=u:(c%=u,c<0&&(c+=u));let d=Math.max(8,Math.ceil(Math.abs(c)/u*56)),f=Math.cos(i),p=Math.sin(i);for(let i=0;i<=d;i++){let o=a+c*i/d,s=Math.cos(o)*n,u=Math.sin(o)*r;l(e+s*f-u*p,t+s*p+u*f)}},m={beginPath(){i=[],a=null},moveTo:c,lineTo:l,closePath(){if(!a)return;a.closed=!0;let[e,t]=[a.pts[0],a.pts[1]];a=null,c(e,t)},arc(e,t,n,r,i,a=!1){p(e,t,n,n,0,r,i,a)},ellipse(e,t,n,r,i,a,o,s=!1){p(e,t,n,r,i,a,o,s)},quadraticCurveTo(e,t,n,r){let[i,a]=u();for(let o=1;o<=Mf;o++){let s=o/Mf,c=1-s;l(c*c*i+2*c*s*e+s*s*n,c*c*a+2*c*s*t+s*s*r)}},bezierCurveTo(e,t,n,r,i,a){let[o,s]=u();for(let c=1;c<=Mf;c++){let u=c/Mf,d=1-u;l(d*d*d*o+3*d*d*u*e+3*d*u*u*n+u*u*u*i,d*d*d*s+3*d*d*u*t+3*d*u*u*r+u*u*u*a)}},roundRect(e,t,n,r,i=0){let o=Math.min(Array.isArray(i)?i[0]:i,n/2,r/2);a=null,c(e+o,t),l(e+n-o,t),p(e+n-o,t+o,o,o,0,-Math.PI/2,0,!1),l(e+n,t+r-o),p(e+n-o,t+r-o,o,o,0,0,Math.PI/2,!1),l(e+o,t+r),p(e+o,t+r-o,o,o,0,Math.PI/2,Math.PI,!1),l(e,t+o),p(e+o,t+o,o,o,0,Math.PI,Math.PI*1.5,!1),m.closePath()},fill(){e.beginPath();for(let t of i){if(t.pts.length<6)continue;let n=f({...t,closed:!0},r*.8);e.moveTo(n[0][0],n[0][1]);for(let t=1;t<n.length;t++)e.lineTo(n[t][0],n[t][1]);e.closePath()}e.fill()},stroke(){let t=e.lineWidth;if(e.lineCap===`butt`){e.beginPath();for(let t of i){if(t.pts.length<4)continue;let n=f(t,r*.8);e.moveTo(n[0][0],n[0][1]);for(let t=1;t<n.length;t++)e.lineTo(n[t][0],n[t][1]);t.closed&&e.closePath()}e.stroke();return}let a=e.fillStyle;e.fillStyle=e.strokeStyle,e.beginPath();let s=0;for(let r of i){if(r.pts.length<4)continue;let i=f(r,t*.2);for(let[r,a]of i){let i=1+Af*Ff(r/(o*1.7)+41.3,a/(o*1.7)+7.7,n),c=1+jf*Nf(s++,77,n),l=Math.max(.2,t/2*i*c);e.moveTo(r+l,a),e.arc(r,a,l,0,Math.PI*2)}}e.fill(),e.fillStyle=a}};return new Proxy(e,{get(e,t){if(t in m)return m[t];let n=e[t];return typeof n==`function`?n.bind(e):n},set(e,t,n){return e[t]=n,!0}})}var Rf=`#3d3d3d`,zf=.062;function Q(e,t,n){e.fillStyle=t,e.beginPath(),n(),e.closePath(),e.fill(),e.stroke()}function Bf(e,t,n,r,i,a=5){for(let o=0;o<a*2;o++){let s=o%2==0?r:i,c=-Math.PI/2+o*Math.PI/a;e.lineTo(t+Math.cos(c)*s,n+Math.sin(c)*s)}}function Vf(e,t,n,r){e.moveTo(t,n+r*.9),e.bezierCurveTo(t-r*1.5,n-r*.1,t-r*.7,n-r*1.1,t,n-r*.35),e.bezierCurveTo(t+r*.7,n-r*1.1,t+r*1.5,n-r*.1,t,n+r*.9)}function Hf(e,t,n,r,i){e.fillStyle=i,e.beginPath(),e.arc(t,n,r,0,Math.PI*2),e.fill()}var Uf=[{id:`star`,colors:[`#ffd23f`],draw:(e,t)=>Q(e,`#ffd23f`,()=>Bf(e,0,0,t*.5,t*.22))},{id:`heart`,colors:[`#ff5c7a`],draw:(e,t)=>Q(e,`#ff5c7a`,()=>Vf(e,0,t*.02,t*.42))},{id:`flower`,colors:[`#ff8fc8`,`#ffd23f`],draw:(e,t)=>{for(let n=0;n<6;n++){let r=n*Math.PI*2/6;Q(e,`#ff8fc8`,()=>e.arc(Math.cos(r)*t*.28,Math.sin(r)*t*.28,t*.17,0,Math.PI*2))}Q(e,`#ffd23f`,()=>e.arc(0,0,t*.16,0,Math.PI*2))}},{id:`sun`,colors:[`#ffb830`],draw:(e,t)=>{for(let n=0;n<8;n++){let r=n*Math.PI*2/8;e.beginPath(),e.moveTo(Math.cos(r)*t*.32,Math.sin(r)*t*.32),e.lineTo(Math.cos(r)*t*.48,Math.sin(r)*t*.48),e.stroke()}Q(e,`#ffb830`,()=>e.arc(0,0,t*.26,0,Math.PI*2))}},{id:`cloud`,colors:[`#eef6ff`],draw:(e,t)=>Q(e,`#eef6ff`,()=>{e.moveTo(-t*.42,t*.18),e.arc(-t*.22,t*.05,t*.2,Math.PI*.9,Math.PI*1.5),e.arc(t*.02,-t*.1,t*.24,Math.PI*1.15,Math.PI*1.9),e.arc(t*.27,t*.03,t*.19,Math.PI*1.35,Math.PI*.45),e.lineTo(-t*.42,t*.18)})},{id:`lightning`,colors:[`#ffe14d`],draw:(e,t)=>Q(e,`#ffe14d`,()=>{e.moveTo(t*.12,-t*.5),e.lineTo(-t*.22,t*.05),e.lineTo(t*.02,t*.05),e.lineTo(-t*.12,t*.5),e.lineTo(t*.24,-t*.08),e.lineTo(0,-t*.08)})},{id:`rainbow`,colors:[`#ff6b6b`,`#ffd23f`,`#4fc3f7`],draw:(e,t)=>{let n=[`#ff6b6b`,`#ffd23f`,`#4fc3f7`],r=t*.11,i=t*.22;e.lineCap=`butt`;for(let a=0;a<n.length;a++){let n=t*.44-a*r;e.beginPath(),e.arc(0,i,n,Math.PI,0),e.strokeStyle=Rf,e.lineWidth=r+t*.05,e.stroke()}for(let a=0;a<n.length;a++){let o=t*.44-a*r;e.beginPath(),e.arc(0,i,o,Math.PI,0),e.strokeStyle=n[a],e.lineWidth=r-t*.01,e.stroke()}e.lineCap=`round`}},{id:`moustache`,colors:[Rf],draw:(e,t)=>Q(e,Rf,()=>{e.moveTo(0,t*.02),e.bezierCurveTo(t*.12,-t*.22,t*.38,-t*.2,t*.48,-t*.02),e.bezierCurveTo(t*.36,t*.14,t*.14,t*.14,0,t*.02),e.bezierCurveTo(-t*.14,t*.14,-t*.36,t*.14,-t*.48,-t*.02),e.bezierCurveTo(-t*.38,-t*.2,-t*.12,-t*.22,0,t*.02)})},{id:`bow`,colors:[`#ff7ab6`],draw:(e,t)=>{Q(e,`#ff7ab6`,()=>{e.moveTo(0,0),e.lineTo(-t*.48,-t*.28),e.lineTo(-t*.48,t*.28)}),Q(e,`#ff7ab6`,()=>{e.moveTo(0,0),e.lineTo(t*.48,-t*.28),e.lineTo(t*.48,t*.28)}),Q(e,`#ff4d9d`,()=>e.arc(0,0,t*.12,0,Math.PI*2))}},{id:`crown`,colors:[`#ffd23f`,`#ff5c7a`],draw:(e,t)=>{Q(e,`#ffd23f`,()=>{e.moveTo(-t*.45,t*.35),e.lineTo(-t*.45,-t*.3),e.lineTo(-t*.2,-t*.02),e.lineTo(0,-t*.45),e.lineTo(t*.2,-t*.02),e.lineTo(t*.45,-t*.3),e.lineTo(t*.45,t*.35)}),Hf(e,-t*.24,t*.18,t*.06,`#ff5c7a`),Hf(e,0,t*.18,t*.06,`#4fc3f7`),Hf(e,t*.24,t*.18,t*.06,`#ff5c7a`)}},{id:`note`,colors:[Rf],draw:(e,t)=>{Q(e,Rf,()=>e.ellipse(-t*.18,t*.28,t*.2,t*.14,-.4,0,Math.PI*2)),e.lineWidth*=1.6,e.beginPath(),e.moveTo(-t*.02,t*.26),e.lineTo(-t*.02,-t*.42),e.quadraticCurveTo(t*.2,-t*.4,t*.3,-t*.15),e.stroke(),e.lineWidth/=1.6}},{id:`strawberry`,colors:[`#ff4d4d`,`#5cc96b`],draw:(e,t)=>{Q(e,`#ff4d4d`,()=>{e.moveTo(0,t*.48),e.bezierCurveTo(-t*.5,t*.1,-t*.42,-t*.28,0,-t*.28),e.bezierCurveTo(t*.42,-t*.28,t*.5,t*.1,0,t*.48)});for(let[n,r]of[[-.16,0],[.12,-.06],[-.04,.2],[.2,.18]])Hf(e,n*t,r*t,t*.035,`#ffe680`);Q(e,`#5cc96b`,()=>{e.moveTo(-t*.3,-t*.3),e.lineTo(-t*.1,-t*.22),e.lineTo(0,-t*.44),e.lineTo(t*.1,-t*.22),e.lineTo(t*.3,-t*.3),e.lineTo(0,-t*.16)})}},{id:`ladybird`,colors:[`#ff3b3b`],draw:(e,t)=>{Q(e,Rf,()=>e.arc(0,-t*.28,t*.18,0,Math.PI*2)),Q(e,`#ff3b3b`,()=>e.ellipse(0,t*.06,t*.4,t*.36,0,0,Math.PI*2)),e.beginPath(),e.moveTo(0,-t*.3),e.lineTo(0,t*.42),e.stroke(),Hf(e,-t*.18,-t*.04,t*.07,Rf),Hf(e,t*.2,t*.02,t*.07,Rf),Hf(e,-t*.14,t*.22,t*.06,Rf),Hf(e,t*.14,t*.26,t*.06,Rf)}},{id:`fish`,colors:[`#ffa53a`],draw:(e,t)=>{Q(e,`#ffa53a`,()=>{e.moveTo(t*.3,0),e.lineTo(t*.5,-t*.24),e.lineTo(t*.5,t*.24)}),Q(e,`#ffa53a`,()=>e.ellipse(-t*.05,0,t*.38,t*.26,0,0,Math.PI*2)),Hf(e,-t*.26,-t*.06,t*.05,Rf),e.beginPath(),e.arc(-t*.02,0,t*.16,-.9,.9),e.stroke()}},{id:`bandaid`,colors:[`#f6d2b0`],draw:(e,t)=>{e.save(),e.rotate(-.6),Q(e,`#f6d2b0`,()=>e.roundRect(-t*.46,-t*.16,t*.92,t*.32,t*.16)),Q(e,`#e9bd94`,()=>e.roundRect(-t*.14,-t*.16,t*.28,t*.32,t*.04));for(let[n,r]of[[-.06,-.07],[.06,-.07],[-.06,.07],[.06,.07]])Hf(e,n*t,r*t,t*.025,Rf);e.restore()}},{id:`leaf`,colors:[`#5cc96b`],draw:(e,t)=>{Q(e,`#5cc96b`,()=>{e.moveTo(0,t*.48),e.quadraticCurveTo(-t*.55,t*.05,0,-t*.48),e.quadraticCurveTo(t*.55,t*.05,0,t*.48)}),e.beginPath(),e.moveTo(0,t*.4),e.lineTo(0,-t*.36),e.stroke()}},{id:`moon`,colors:[`#ffe27a`],draw:(e,t)=>Q(e,`#ffe27a`,()=>{e.arc(0,0,t*.44,.938,Math.PI*2-.938,!1),e.arc(t*.2,0,t*.36,Math.PI*2-1.403,1.403,!0)})},{id:`apple`,colors:[`#ff5a4d`,`#5cc96b`],draw:(e,t)=>{Q(e,`#ff5a4d`,()=>{e.moveTo(0,-t*.22),e.bezierCurveTo(t*.5,-t*.5,t*.6,t*.3,0,t*.45),e.bezierCurveTo(-t*.6,t*.3,-t*.5,-t*.5,0,-t*.22)}),e.beginPath(),e.moveTo(0,-t*.2),e.quadraticCurveTo(t*.02,-t*.36,t*.1,-t*.44),e.stroke(),Q(e,`#5cc96b`,()=>e.ellipse(t*.2,-t*.36,t*.14,t*.07,-.5,0,Math.PI*2))}},{id:`carrot`,colors:[`#ff9a3d`,`#5cc96b`],draw:(e,t)=>{for(let n of[-.14,0,.14])Q(e,`#5cc96b`,()=>e.ellipse(n*t,-t*.36,t*.07,t*.15,n*2.5,0,Math.PI*2));Q(e,`#ff9a3d`,()=>{e.moveTo(-t*.2,-t*.22),e.quadraticCurveTo(0,-t*.32,t*.2,-t*.22),e.lineTo(t*.02,t*.48),e.lineTo(-t*.02,t*.48)})}},{id:`mushroom`,colors:[`#ff5a4d`],draw:(e,t)=>{Q(e,`#fff3dc`,()=>e.roundRect(-t*.13,-t*.02,t*.26,t*.46,t*.1)),Q(e,`#ff5a4d`,()=>{e.moveTo(-t*.46,t*.04),e.bezierCurveTo(-t*.46,-t*.6,t*.46,-t*.6,t*.46,t*.04)}),Hf(e,-t*.2,-t*.16,t*.07,`#ffffff`),Hf(e,t*.12,-t*.28,t*.06,`#ffffff`),Hf(e,t*.26,-t*.08,t*.045,`#ffffff`)}},{id:`balloon`,colors:[`#5db7ff`],draw:(e,t)=>{e.beginPath(),e.moveTo(0,t*.16),e.quadraticCurveTo(t*.12,t*.3,-t*.04,t*.48),e.stroke(),Q(e,`#5db7ff`,()=>e.ellipse(0,-t*.14,t*.3,t*.34,0,0,Math.PI*2)),Q(e,`#5db7ff`,()=>{e.moveTo(0,t*.18),e.lineTo(-t*.06,t*.27),e.lineTo(t*.06,t*.27)}),Hf(e,-t*.1,-t*.26,t*.05,`#ffffff`)}},{id:`icecream`,colors:[`#ff9ccb`,`#e9b872`],draw:(e,t)=>{Q(e,`#e9b872`,()=>{e.moveTo(-t*.22,-t*.02),e.lineTo(t*.22,-t*.02),e.lineTo(0,t*.5)}),Q(e,`#ff9ccb`,()=>e.arc(0,-t*.16,t*.28,0,Math.PI*2)),Hf(e,-t*.1,-t*.26,t*.045,`#ffffff`)}},{id:`butterfly`,colors:[`#c39bff`,`#ffd23f`],draw:(e,t)=>{for(let n of[-1,1])Q(e,`#ff9ccb`,()=>{e.moveTo(n*t*.03,t*0),e.bezierCurveTo(n*t*.3,-t*.04,n*t*.46,t*.2,n*t*.3,t*.36),e.bezierCurveTo(n*t*.2,t*.46,n*t*.05,t*.32,n*t*.03,t*.12)}),Q(e,`#c39bff`,()=>{e.moveTo(n*t*.03,-t*.04),e.bezierCurveTo(n*t*.08,-t*.44,n*t*.52,-t*.5,n*t*.48,-t*.16),e.bezierCurveTo(n*t*.46,t*.02,n*t*.2,t*.08,n*t*.03,t*.04)}),Hf(e,n*t*.28,-t*.2,t*.075,`#ffe680`),Hf(e,n*t*.22,t*.21,t*.045,`#fff3b0`),e.lineWidth*=.7,e.beginPath(),e.moveTo(n*t*.02,-t*.28),e.quadraticCurveTo(n*t*.04,-t*.44,n*t*.15,-t*.46),e.stroke(),e.lineWidth/=.7;Q(e,Rf,()=>e.ellipse(0,t*.04,t*.05,t*.23,0,0,Math.PI*2)),Hf(e,0,-t*.24,t*.075,Rf)}},{id:`snail`,colors:[`#ffb24d`,`#a6dd8b`],draw:(e,t)=>{for(let[n,r]of[[.3,.25],[.39,.45]])e.beginPath(),e.moveTo(t*n,-t*.06),e.lineTo(t*r,-t*.3),e.stroke(),Hf(e,t*r,-t*.32,t*.05,Rf);Q(e,`#a6dd8b`,()=>{e.moveTo(-t*.47,t*.38),e.quadraticCurveTo(-t*.1,t*.41,t*.3,t*.38),e.bezierCurveTo(t*.5,t*.37,t*.52,t*.12,t*.45,-t*.02),e.bezierCurveTo(t*.4,-t*.14,t*.22,-t*.13,t*.21,t*.02),e.quadraticCurveTo(t*.21,t*.2,t*.06,t*.22),e.lineTo(-t*.3,t*.23),e.quadraticCurveTo(-t*.42,t*.27,-t*.47,t*.38)});let n=-t*.1,r=-t*.03;Q(e,`#ffb24d`,()=>e.arc(n,r,t*.29,0,Math.PI*2)),e.lineWidth*=.8,e.beginPath();for(let i=0;i<=44;i++){let a=i/44,o=2.4+a*Math.PI*2*1.55,s=t*(.025+.185*a);e.lineTo(n+Math.cos(o)*s,r+Math.sin(o)*s)}e.stroke(),e.lineWidth/=.8}},{id:`tree`,colors:[`#5cc96b`,`#b07a45`],draw:(e,t)=>{Q(e,`#b07a45`,()=>e.roundRect(-t*.08,t*.08,t*.16,t*.4,t*.04)),Q(e,`#5cc96b`,()=>{e.arc(-t*.2,-t*.05,t*.2,Math.PI*.6,Math.PI*1.5),e.arc(0,-t*.24,t*.24,Math.PI*1.1,Math.PI*1.9),e.arc(t*.2,-t*.05,t*.2,Math.PI*1.5,Math.PI*.4)})}},{id:`rocket`,colors:[`#f2f4f8`,`#ff5a4d`],draw:(e,t)=>{for(let n of[-1,1])Q(e,`#ff5a4d`,()=>{e.moveTo(n*t*.16,t*.1),e.lineTo(n*t*.36,t*.38),e.lineTo(n*t*.14,t*.3)});Q(e,`#ffb24d`,()=>{e.moveTo(-t*.09,t*.3),e.lineTo(0,t*.5),e.lineTo(t*.09,t*.3)}),Q(e,`#f2f4f8`,()=>{e.moveTo(0,-t*.5),e.bezierCurveTo(t*.3,-t*.2,t*.22,t*.2,t*.14,t*.32),e.lineTo(-t*.14,t*.32),e.bezierCurveTo(-t*.22,t*.2,-t*.3,-t*.2,0,-t*.5)}),Q(e,`#5db7ff`,()=>e.arc(0,-t*.1,t*.09,0,Math.PI*2))}},{id:`cherry`,colors:[`#e83a4e`,`#5cc96b`],draw:(e,t)=>{e.beginPath(),e.moveTo(-t*.2,t*.18),e.quadraticCurveTo(-t*.1,-t*.3,t*.12,-t*.42),e.quadraticCurveTo(t*.22,-t*.1,t*.22,t*.14),e.stroke(),Q(e,`#5cc96b`,()=>e.ellipse(t*.26,-t*.38,t*.15,t*.07,.3,0,Math.PI*2)),Q(e,`#e83a4e`,()=>e.arc(-t*.2,t*.26,t*.19,0,Math.PI*2)),Q(e,`#e83a4e`,()=>e.arc(t*.22,t*.24,t*.19,0,Math.PI*2))}},{id:`umbrella`,colors:[`#b58cff`],draw:(e,t)=>{e.beginPath(),e.moveTo(0,-t*.1),e.lineTo(0,t*.34),e.quadraticCurveTo(0,t*.48,-t*.13,t*.42),e.stroke(),Q(e,`#b58cff`,()=>{e.moveTo(-t*.46,t*0),e.bezierCurveTo(-t*.46,-t*.6,t*.46,-t*.6,t*.46,t*0),e.quadraticCurveTo(t*.34,-t*.1,t*.23,t*0),e.quadraticCurveTo(t*.12,-t*.1,0,t*0),e.quadraticCurveTo(-t*.12,-t*.1,-t*.23,t*0),e.quadraticCurveTo(-t*.34,-t*.1,-t*.46,t*0)})}},{id:`drop`,colors:[`#5db7ff`],draw:(e,t)=>{Q(e,`#5db7ff`,()=>{e.moveTo(0,-t*.46),e.bezierCurveTo(t*.5,t*.1,t*.3,t*.46,0,t*.46),e.bezierCurveTo(-t*.3,t*.46,-t*.5,t*.1,0,-t*.46)}),Hf(e,-t*.1,t*.16,t*.055,`#ffffff`)}},{id:`boat`,colors:[`#ff8a5c`,`#f2f4f8`],draw:(e,t)=>{e.beginPath(),e.moveTo(0,-t*.44),e.lineTo(0,t*.14),e.stroke(),Q(e,`#f2f4f8`,()=>{e.moveTo(t*.04,-t*.42),e.lineTo(t*.36,t*.06),e.lineTo(t*.04,t*.06)}),Q(e,`#ff8a5c`,()=>{e.moveTo(-t*.46,t*.14),e.lineTo(t*.46,t*.14),e.lineTo(t*.3,t*.4),e.lineTo(-t*.3,t*.4)})}}];function Wf(e,t){e.strokeStyle=Rf,e.lineWidth=t*zf,e.lineJoin=`round`,e.lineCap=`round`}function Gf(e,t,n,r,i,a=0,o=1){e.save(),e.translate(n,r),e.rotate(a),e.scale(o,1),Wf(e,i),t.draw(Lf(e,i,If(t.id),i*zf),i),e.restore()}var Kf=new Map;function qf(e,t=128){let n=`${e.id}|${t}`,r=Kf.get(n);r||(r=document.createElement(`canvas`),r.width=t,r.height=t,Gf(Fd(r),e,t/2,t/2,t*.8),Kf.set(n,r));let i=document.createElement(`canvas`);return i.width=t,i.height=t,Fd(i).drawImage(r,0,0),i}var Jf=[`star`,`heart`,`flower`,`sun`,`cloud`,`bow`],Yf=new Map(Uf.map(e=>[e.id,e])),Xf=class{constructor(){this.have=new Set(Jf),this.fresh=[]}serialize(){return{have:[...this.have],fresh:this.fresh.slice()}}restore(e,t=0){if(this.have=new Set(Jf),this.fresh=[],e&&Array.isArray(e.have)){for(let t of e.have)Yf.has(t)&&this.have.add(t);Array.isArray(e.fresh)&&(this.fresh=e.fresh.filter(e=>this.have.has(e)))}else for(let e=0;e<t;e++)this.unlockNext(!1)}get complete(){return this.have.size>=Uf.length}unlockNext(e=!0){let t=Uf.filter(e=>!this.have.has(e.id));if(!t.length)return null;let n=t[Math.floor(Math.random()*t.length)];return this.have.add(n.id),e&&this.fresh.push(n.id),n}deck(){let e=this.fresh.map(e=>Yf.get(e)).reverse(),t=Uf.filter(e=>this.have.has(e.id)&&!this.fresh.includes(e.id)).sort(()=>Math.random()-.5);return{defs:[...e,...t],fresh:new Set(this.fresh)}}markSeen(){this.fresh=[]}},Zf={soft:{size:104,alpha:.42,mask:`soft`},brush:{size:52,alpha:1,mask:`round`},crayon:{size:42,alpha:.96,mask:`crayon`},marker:{size:46,alpha:.62,mask:`chisel`,rim:.5},cloth:{size:128}};Object.keys(Zf);var Qf=110,$f=150,ep=6,tp=.05,np=.04,rp=140,ip=[.1,.9],ap=Math.min(window.devicePixelRatio||1,1.5),op=(e=1,t=1)=>{let n=document.createElement(`canvas`);return n.width=e,n.height=t,n},sp=128;function cp(e,t){let n=op(sp,sp),r=Fd(n),i=r.createImageData(sp,sp),a=e.map(([e,t])=>{let n=sp/e;return{cell:e,n,weight:t,v:Float32Array.from({length:n*n},Math.random)}}),o=e.reduce((e,t)=>e+t[1],0);for(let e=0;e<sp;e++)for(let n=0;n<sp;n++){let r=0;for(let t of a){let i=n/t.cell,a=e/t.cell,o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s;c=c*c*(3-2*c),l=l*l*(3-2*l);let u=(e,n)=>t.v[n%t.n*t.n+e%t.n],d=u(o,s)+(u(o+1,s)-u(o,s))*c,f=u(o,s+1)+(u(o+1,s+1)-u(o,s+1))*c;r+=(d+(f-d)*l)*t.weight}i.data[(e*sp+n)*4+3]=Math.round(255*Math.max(0,Math.min(1,t(r/o))))}return r.putImageData(i,0,0),n}function lp(){return cp([[2,.42],[4,.33],[16,.25]],e=>(e-.385)/.1)}function up(){return cp([[8,.45],[32,.55]],e=>.7+.56*e)}var dp=class{constructor(e){this.name=e,this.canvas=null,this.ctx=null,this.scale=1,this.snap=op(),this.mask=op(),this.tmp=op(),this.edge=op(),this.inStroke=!1,this.strokeSX=1,this.dirty=null,this.grain=null,this.felt=null,this.grainOff={x:0,y:0}}bind(e,t){this.inStroke&&(this.snap.width!==e.width||this.snap.height!==e.height)&&(this.inStroke=!1),this.canvas=e,this.ctx=e.getContext(`2d`),this.scale=t;for(let t of[this.snap,this.mask,this.tmp,this.edge])(t.width!==e.width||t.height!==e.height)&&(t.width=e.width,t.height=e.height);this.grain=null,this.felt=null}get W(){return this.canvas.width}get H(){return this.canvas.height}begin(){if(this.inStroke)return;this.inStroke=!0;let e=this.snap.getContext(`2d`);e.clearRect(0,0,this.W,this.H),e.drawImage(this.canvas,0,0),this.mask.getContext(`2d`).clearRect(0,0,this.W,this.H),this.dirty=null,this.grainOff={x:Math.random()*sp,y:Math.random()*sp}}end(){if(this.inStroke){if(this.inStroke=!1,this.dirty){let e=this.dirty;this.mask.getContext(`2d`).clearRect(e.x,e.y,e.w,e.h)}this.dirty=null}}},fp=class{constructor({canvas:e,stage:t,backdrop:n}){this.canvas=e,this.stage=t,this.backdrop=n,this.creature=null,this.body=new dp(`body`),this.back=new dp(`back`),this.tool=`brush`,this.fill={id:`s:#e0457b`,kind:`solid`,color:`#e0457b`,ink:`#e0457b`,register:.5},this._grainTile=lp(),this._feltTile=up(),this._dabs=new Map,this._rag=op(),this._ragCtx=this._rag.getContext(`2d`),this.ray=new Pa,this.ndc=new W,this.prev=null,this.prevSurf=null,this.started=!1,this.lastClient=null,this.noteDist=0,this.lastNoteAt=0,this.enabled=!1,this.active=!1,this.onStrokeStart=null,this.onStrokeNote=null,this.onStrokeEnd=null}attach(){this.enabled=!0}detach(){this.enabled=!1,this.strokeEnd()}setCreature(e){this.creature=e,this.body.bind(e.paintCanvas,1)}setTool(e){Zf[e]&&(this.tool=e)}setFill(e){this.fill=e}sizeBackdrop(e=!0){let t=Math.max(1,Math.round(window.innerWidth*ap)),n=Math.max(1,Math.round(window.innerHeight*ap)),r=this.backdrop;if(r.width!==t||r.height!==n){let i=null;e&&r.width>1&&(i=op(r.width,r.height),i.getContext(`2d`).drawImage(r,0,0)),r.width=t,r.height=n,i&&r.getContext(`2d`).drawImage(i,0,0,t,n)}this.back.bind(r,this.backdropScale())}clearBackdrop(){this.sizeBackdrop(!1),this.backdrop.getContext(`2d`).clearRect(0,0,this.backdrop.width,this.backdrop.height)}backdropScale(){let e=this.stage.paintCamera,t=window.innerHeight/Math.max(1e-6,e.top-e.bottom),n=this.creature?this.creature.pxPerUnit:160;return t*ap/n}hit(e,t){if(!this.creature)return null;let n=performance.now(),r=this._hitMemo;if(r&&r.x===e&&r.y===t&&r.c===this.creature&&n-r.t<30)return r.r;this.ndc.set(e/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),this.ray.setFromCamera(this.ndc,this.stage.camera);let i=this.ray.intersectObject(this.creature.body,!1),a=null;if(i.length&&i[0].uv){let{x:e,y:t}=i[0].uv;a={x:e*this.body.W,y:(1-t)*this.body.H,u:e,v:t}}return this._hitMemo={x:e,y:t,c:this.creature,t:n,r:a},a}locate(e,t){let n=this.hit(e,t);return n?{surf:this.body,pt:{x:n.x,y:n.y}}:{surf:this.back,pt:{x:e*ap,y:t*ap}}}strokeStart(e,t){this.enabled&&this.creature&&(this.active=!0,this.started=!1,this.lastClient={x:e,y:t},this.noteDist=0,this.lastNoteAt=performance.now(),this.prev=null,this.prevSurf=null,this.touch(e,t))}strokeMove(e,t){this.active&&(this.touch(e,t),this.paceNotes(e,t))}strokeEnd(){this.active&&(this.active=!1,this.prev=null,this.prevSurf=null,this.body.end(),this.back.end(),this.onStrokeEnd&&this.onStrokeEnd())}touch(e,t){let{surf:n,pt:r}=this.locate(e,t);n!==this.prevSurf&&(this.prev=null),this.prevSurf=n;let i=this.prev||r;n===this.body&&Math.abs(i.x-r.x)>n.W/2&&(i=r),this.segment(n,i,r),this.started||(this.started=!0,this.onStrokeStart&&this.onStrokeStart(this.tool,(e/window.innerWidth*2-1)*.6)),this.prev=r}paceNotes(e,t){if(!this.lastClient)return;this.noteDist+=Math.hypot(e-this.lastClient.x,t-this.lastClient.y),this.lastClient={x:e,y:t};let n=performance.now();this.noteDist>=Qf&&n-this.lastNoteAt>=$f&&(this.noteDist=0,this.lastNoteAt=n,this.onStrokeNote&&this.onStrokeNote(this.tool,(e/window.innerWidth*2-1)*.6))}segment(e,t,n){let r=Zf[this.tool];if(this.tool===`cloth`)this.smear(e,t,n);else{e===this.body&&!e.inStroke&&(e.strokeSX=this.creature.widthScaleAt(n.y)),e.begin();let i=this.drawMask(e,r,t,n);if(i&&this.composite(e,r,i),e===this.body){let i=e.W,a=r.size*e.scale*1.4+6,o=Math.min(t.x,n.x),s=Math.max(t.x,n.x);for(let c of[i,-i]){if(s+c<-a||o+c>i+a)continue;let l=this.drawMask(e,r,{x:t.x+c,y:t.y},{x:n.x+c,y:n.y});l&&this.composite(e,r,l)}}}if(e===this.body){let r=this.creature;r.faceDirty=!0,this.tool!==`cloth`&&(r.painted=!0,r.addWork(Math.hypot(n.x-t.x,n.y-t.y)/e.W))}}dab(e){let t=Math.round(e),n=this._dabs.get(t);if(!n){n=op(t*2+2,t*2+2);let e=n.getContext(`2d`),r=e.createRadialGradient(t+1,t+1,0,t+1,t+1,t);r.addColorStop(0,`rgba(0,0,0,1)`),r.addColorStop(.45,`rgba(0,0,0,0.9)`),r.addColorStop(1,`rgba(0,0,0,0)`),e.fillStyle=r,e.fillRect(0,0,n.width,n.height),this._dabs.set(t,n)}return n}drawMask(e,t,n,r){let i=e.mask.getContext(`2d`),a=t.size*e.scale;i.save();let o=e===this.body?this.creature.widthScaleAt(r.y):1;o!==1&&(n={x:r.x+(n.x-r.x)/o,y:n.y},i.translate(r.x,0),i.scale(o,1),i.translate(-r.x,0));let s=Math.hypot(r.x-n.x,r.y-n.y);switch(i.fillStyle=i.strokeStyle=`#000`,t.mask){case`soft`:{let e=a/2,t=this.dab(e),o=Math.max(1,e*.18),c=Math.max(1,Math.ceil(s/o));for(let e=0;e<=c;e++){let a=e/c;i.drawImage(t,n.x+(r.x-n.x)*a-t.width/2,n.y+(r.y-n.y)*a-t.height/2)}break}case`chisel`:{let e=a/2*Math.SQRT1_2,t=-Math.SQRT1_2*(a/2),o=a*.16,c=n=>[[n.x-e-o,n.y-t],[n.x+e-o,n.y+t],[n.x+e+o,n.y+t],[n.x-e+o,n.y-t]],l=e=>{i.beginPath(),e.forEach(([e,t],n)=>n?i.lineTo(e,t):i.moveTo(e,t)),i.closePath(),i.fill()},u=c(n),d=c(r);if(l(u),l(d),s>0)for(let e=0;e<4;e++)l([u[e],u[(e+1)%4],d[(e+1)%4],d[e]]);break}default:{let e=t.mask===`crayon`,o=e?a*(.74+Math.random()*.1):a;if(i.lineCap=`round`,i.lineJoin=`round`,i.lineWidth=o,i.beginPath(),i.arc(r.x,r.y,o/2,0,Math.PI*2),i.fill(),s>0&&(i.beginPath(),i.moveTo(n.x,n.y),i.lineTo(r.x,r.y),i.stroke()),e){let e=s>0?(r.x-n.x)/s:1,t=s>0?(r.y-n.y)/s:0,o=Math.max(1,Math.ceil(s/Math.max(2,a*.13)));for(let s=0;s<=o;s++){let c=n.x+(r.x-n.x)*s/o,l=n.y+(r.y-n.y)*s/o;for(let n of[-1,1]){if(Math.random()<.25)continue;let r=n*a*(.33+Math.random()*.15),o=(Math.random()-.5)*a*.14;i.beginPath(),i.arc(c-t*r+e*o,l+e*r+t*o,a*(.045+Math.random()*.085),0,Math.PI*2),i.fill()}}}}}i.restore();let c=r.x+(n.x-r.x)*o,l=a*.6*Math.max(1,o)+4,u=a*.6+4,d=Math.max(0,Math.floor(Math.min(c,r.x)-l)),f=Math.max(0,Math.floor(Math.min(n.y,r.y)-u)),p=Math.min(e.W,Math.ceil(Math.max(c,r.x)+l)),m=Math.min(e.H,Math.ceil(Math.max(n.y,r.y)+u));if(p<=d||m<=f)return null;let h={x:d,y:f,w:p-d,h:m-f},g=e.dirty;if(!g)e.dirty={...h};else{let t=Math.min(g.x,h.x),n=Math.min(g.y,h.y);e.dirty={x:t,y:n,w:Math.max(g.x+g.w,h.x+h.w)-t,h:Math.max(g.y+g.h,h.y+h.h)-n}}return h}composite(e,t,n){let r=e.tmp.getContext(`2d`);if(r.save(),r.clearRect(n.x,n.y,n.w,n.h),r.drawImage(e.mask,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),t.mask===`crayon`?(e.grain||(e.grain=r.createPattern(this._grainTile,`repeat`),e.grain.setTransform?.(new DOMMatrix().scale(Math.max(1,e.scale)))),r.globalCompositeOperation=`destination-in`,r.translate(e.grainOff.x,e.grainOff.y),r.fillStyle=e.grain,r.fillRect(n.x-e.grainOff.x,n.y-e.grainOff.y,n.w,n.h),r.setTransform(1,0,0,1,0,0)):t.mask===`chisel`&&(e.felt||(e.felt=r.createPattern(this._feltTile,`repeat`),e.felt.setTransform?.(new DOMMatrix().scale(Math.max(1,e.scale)))),r.globalCompositeOperation=`destination-in`,r.fillStyle=e.felt,r.fillRect(n.x,n.y,n.w,n.h)),r.globalCompositeOperation=`source-in`,r.fillStyle=Cf(r,this.fill,e.scale),e===this.body&&this.fill.kind===`pattern`&&e.strokeSX!==1){let t=e.strokeSX;r.setTransform(t,0,0,1,0,0),r.fillRect(n.x/t,n.y,n.w/t,n.h),r.setTransform(1,0,0,1,0,0)}else r.fillRect(n.x,n.y,n.w,n.h);r.restore();let i=e.ctx;i.save(),i.clearRect(n.x,n.y,n.w,n.h),i.drawImage(e.snap,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),i.globalAlpha=t.alpha,i.drawImage(e.tmp,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),t.rim&&(this.rim(e,t,n),i.globalAlpha=t.rim,i.drawImage(e.tmp,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h)),i.restore()}rim(e,t,n){let r=Math.max(2,Math.round(t.size*e.scale*.085)),i=e.edge.getContext(`2d`);i.save(),i.beginPath(),i.rect(n.x,n.y,n.w,n.h),i.clip(),i.clearRect(n.x,n.y,n.w,n.h),i.drawImage(e.mask,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),i.globalCompositeOperation=`destination-in`;let a=Math.max(0,n.x-r),o=Math.max(0,n.y-r),s=Math.min(e.W,n.x+n.w+r)-a,c=Math.min(e.H,n.y+n.h+r)-o;for(let[t,n]of[[r,0],[-r,0],[0,r],[0,-r]])i.drawImage(e.mask,a,o,s,c,a+t,o+n,s,c);i.restore();let l=e.tmp.getContext(`2d`);l.save(),l.clearRect(n.x,n.y,n.w,n.h),l.drawImage(e.mask,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),l.globalCompositeOperation=`destination-out`,l.drawImage(e.edge,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),l.globalCompositeOperation=`source-in`,l.fillStyle=Cf(l,this.fill,e.scale),l.fillRect(n.x,n.y,n.w,n.h),l.globalCompositeOperation=`source-atop`,l.fillStyle=`rgba(0, 0, 0, 0.14)`,l.fillRect(n.x,n.y,n.w,n.h),l.restore()}smear(e,t,n){let r=Math.max(8,Math.round(Zf.cloth.size*e.scale));this._rag.width!==r&&(this._rag.width=this._rag.height=r,this._feather=this._ragCtx.createRadialGradient(r/2,r/2,r*.1,r/2,r/2,r/2),this._feather.addColorStop(0,`rgba(0,0,0,1)`),this._feather.addColorStop(1,`rgba(0,0,0,0)`));let i=e.ctx,a=this._ragCtx,o=r/2,s=ep*e.scale,c=Math.hypot(n.x-t.x,n.y-t.y),l=Math.max(1,Math.ceil(c/s));for(let s=1;s<=l;s++){let c=(s-1)/l,u=s/l,d=t.x+(n.x-t.x)*c,f=t.y+(n.y-t.y)*c,p=t.x+(n.x-t.x)*u,m=t.y+(n.y-t.y)*u;a.globalCompositeOperation=`source-over`,a.clearRect(0,0,r,r),a.drawImage(e.canvas,d-o,f-o,r,r,0,0,r,r),a.globalCompositeOperation=`destination-in`,a.fillStyle=this._feather,a.fillRect(0,0,r,r),i.save(),i.globalCompositeOperation=`destination-out`,i.globalAlpha=tp,i.beginPath(),i.arc(p,m,o,0,Math.PI*2),i.fill(),i.restore(),i.save(),i.globalAlpha=np,i.drawImage(this._rag,p-o,m-o),i.restore()}}fillAll(e){if(!this.enabled||!this.creature)return!1;let t=this.body.ctx;return t.save(),t.fillStyle=Cf(t,e,1),t.fillRect(0,0,this.body.W,this.body.H),t.restore(),this.creature.painted=!0,this.creature.faceDirty=!0,this.creature.addWork(.35),this.onStrokeEnd&&this.onStrokeEnd(),!0}fillBackdrop(e){if(!this.enabled)return!1;let t=this.back.ctx;return t.save(),t.fillStyle=Cf(t,e,this.back.scale),t.fillRect(0,0,this.back.W,this.back.H),t.restore(),!0}stamp(e,t,n,r=0){if(!this.enabled||!this.creature)return!1;let i=this.creature,a=this.body.H,o=this.body.W,s=(1-Math.min(ip[1],Math.max(ip[0],1-t/a)))*a,c=i.widthScaleAt(s),l=rp*c*.6;return Gf(this.body.ctx,n,e,s,rp,r,c),e>o-l&&Gf(this.body.ctx,n,e-o,s,rp,r,c),e<l&&Gf(this.body.ctx,n,e+o,s,rp,r,c),i.painted=!0,i.faceDirty=!0,i.addWork(.25),this.onStrokeEnd&&this.onStrokeEnd(),!0}stampBackdrop(e,t,n,r=0){return this.enabled?(Gf(this.back.ctx,n,e*ap,t*ap,rp*this.back.scale,r),!0):!1}},pp=Math.PI*2,mp=8,hp=pp/mp,gp=Math.min(window.devicePixelRatio||1,2),_p=.32,vp=.5,yp=.045,bp=1.1,xp=14,Sp=e=>Math.atan2(Math.sin(e),Math.cos(e)),Cp=e=>1+2.4*(e-1)**3+1.4*(e-1)**2,wp=e=>e*e,Tp=0,Ep=(e,t)=>{let n=document.createElement(`div`);return n.className=e,t?.appendChild(n),n},Dp=class{constructor(){this.angle=0,this.vel=0,this.tween=null,this.dragging=!1}turnTo(e,t=.38){this.vel=0,this.tween={from:this.angle,to:e,t:0,dur:t}}update(e){if(!this.dragging){if(this.tween){let t=this.tween;t.t+=e;let n=Math.min(1,t.t/t.dur);this.angle=t.from+(t.to-t.from)*Cp(n),n>=1&&(this.tween=null);return}this.vel&&(this.angle+=this.vel*e,this.vel*=Math.exp(-2.6*e),Math.abs(this.vel)<bp&&this.snap())}}snap(e=hp){this.turnTo(Math.round(this.angle/e)*e,.3)}},Op=class{constructor(e,{name:t,teeth:n,sockets:r=0,interactive:i=!1}){this.name=t,this.teeth=n,this.sockets=r,this.el=Ep(`gear gear-${t}`,e),this.card=Ep(`gear-card`,this.el),this.wood=document.createElement(`canvas`),this.wood.className=`gear-wood`,this.card.appendChild(this.wood),i&&(this.hitEl=Ep(`gear-hit`,this.el)),this.itemsEl=Ep(`gear-items`,this.el),this.R=0,this.cx=0,this.cy=0,this.k=1,this.c=0,this.driver=null,this.woodSeed=Tp++*7919+17|0,this.tint=Ld,this.centerDir=0,this.socketOffset=0,this.spin=0,this.sink=0,this.swap=null,this.items=new Map,this.source=null,this.makeItem=null,this.lastTooth=null,this.onTick=null,this.lead=!1,this.hidden=!1}get angle(){return this.driver?this.k*this.driver.angle+this.c:this.c}get tint(){return this._tint}set tint(e){this._tint=e,this.woodSeed=this.woodSeed+1013|0}get ringR(){return this.R*.64}get itemD(){return this.R*.37}setHidden(e){this.hidden=e,this.el.hidden=e}place(e,t,n){let r=Math.abs(n-this.R)>.5||!this.wood.width;this.cx=e,this.cy=t,this.R=n;let i=Math.ceil(n*2+8);return Object.assign(this.el.style,{left:`${(e-i/2).toFixed(1)}px`,top:`${(t-i/2).toFixed(1)}px`,width:`${i}px`,height:`${i}px`}),this.hitEl&&Object.assign(this.hitEl.style,{left:`4px`,top:`4px`,width:`${n*2}px`,height:`${n*2}px`}),r}redraw(){Ud(this.wood,{radius:this.R,teeth:this.teeth,tint:this.tint,sockets:this.sockets,socketOffset:this.socketOffset,socketR:this.itemD*.6,ringR:this.ringR,dpr:gp,seed:this.woodSeed}),this.card.style.filter=`drop-shadow(0 ${Math.max(4,this.R*zd).toFixed(1)}px 0 ${this.tint.under})`}setTint(e){this.tint=e,this.redraw()}setSource(e){this.source=e,this.clearItems()}clearItems(){for(let e of this.items.values())e.held||e.el.remove();this.items.clear()}forEachItem(e){for(let t of this.items.values())e(t)}centerIndex(){let e=0,t=1/0;for(let n=0;n<this.sockets;n++){let r=this.angle+this.socketOffset+n*hp,i=Math.abs(Sp(r-this.centerDir));i<t&&(t=i,e=n)}return this.items.get(e)?.j??this.indexFor(e)}indexFor(e){let t=this.angle+this.socketOffset+e*hp;return e-mp*Math.round((t-this.centerDir)/pp)}swapTo(e,t,n){return!this.swap&&(this.swap={t:0,source:e,tint:t,swapped:!1,shown:!1,onDone:n},this.itemsEl.classList.add(`out`),!0)}update(e,t,n){if(this.swap){let t=this.swap;t.t+=e;let n=this.R*1.3,r=Math.min(1,t.t/.8200000000000001);if(this.spin=pp*(1-(1-r)**2),t.t<_p)this.sink=n*wp(t.t/_p);else{t.swapped||(t.swapped=!0,this.tint=t.tint,this.redraw(),this.setSource(t.source),this.holdItems=!0,this.itemsEl.classList.remove(`out`));let e=Math.min(1,(t.t-_p)/vp);this.sink=n*(1-Cp(e)),e>=1&&(this.sink=0,this.spin=0,t.shown||(t.shown=!0,this.holdItems=!1,this.stagger=0,t.notify=!0),t.t>=1.37&&(this.swap=null))}this.el.style.transform=this.sink?`translateY(${this.sink.toFixed(1)}px)`:``}else this.spin&&(this.spin=0,this.el.style.transform=``);let r=this.angle;this.wood.style.transform=`rotate(${(r+this.spin).toFixed(4)}rad)`;let i=Math.floor(r*this.teeth/pp);this.lastTooth!==null&&i!==this.lastTooth&&!this.hidden&&this.onTick?.(this,this.lead),this.lastTooth=i,this.sockets&&this.source&&!this.holdItems&&this.updateItems(r+this.spin,t,n),this.swap?.notify&&(this.swap.notify=!1,this.stagger=null,this.swap.onDone?.())}updateItems(e,t,n){let r=Math.ceil(this.R*2+8),i=this.itemD,a=i/2;for(let o=0;o<this.sockets;o++){let s=e+this.socketOffset+o*hp,c=r/2+Math.cos(s)*this.ringR,l=r/2+Math.sin(s)*this.ringR,u=this.cx+Math.cos(s)*this.ringR,d=this.cy+Math.sin(s)*this.ringR+this.sink,f=u>-a*.9&&u<t+a*.9&&d>-a*.9&&d<n+a*.9,p=u<-a-4||u>t+a+4||d<-a-4||d>n+a+4,m=this.items.get(o);if(m&&p&&(m.held||m.el.remove(),this.items.delete(o),m=null),!m&&f&&!p&&this.makeItem){let e=this.items.get((o+mp-1)%mp),t=this.items.get((o+1)%mp),n=e?e.j+1:t?t.j-1:this.indexFor(o),r=this.source.at(n),i=this.makeItem(r,this);m={j:n,value:r,key:i.key,el:i.el,held:!1},m.el.dataset.socket=o,m.el.classList.add(`pop-in`),this.stagger!=null&&m.el.style.setProperty(`--pop-delay`,`${this.stagger++*yp}s`),this.itemsEl.appendChild(m.el),this.items.set(o,m)}m&&(m.el.style.width=m.el.style.height=`${i.toFixed(1)}px`,m.el.style.left=`${(c-a).toFixed(1)}px`,m.el.style.top=`${(l-a).toFixed(1)}px`)}}},kp=class{constructor(e,{linked:t=!0}={}){this.parent=e,this.linked=t,this.idlerLayer=Ep(`idlers`,e),this.left=new Op(e,{name:`colors`,teeth:16,sockets:mp,interactive:!0}),this.right=new Op(e,{name:`tools`,teeth:16,sockets:mp,interactive:!0}),this.idlers=[],this.driverL=new Dp,this.driverR=new Dp,this.isLinked=!1,this.w=0,this.h=0}get big(){return[this.left,this.right]}get all(){return[this.left,...this.idlers,this.right]}reset(){for(let e of[this.driverL,this.driverR])e.angle=0,e.vel=0,e.tween=null,e.dragging=!1;for(let e of this.big)e.swap=null,e.holdItems=!1,e.stagger=null,e.sink=0,e.spin=0,e.el.style.transform=``,e.itemsEl.classList.remove(`out`)}layout(e,t){this.w=e,this.h=t;let n=Math.max(105,Math.min(210,Math.min(e,t)*.37)),r=n*.32,i=this.left,a=this.right,o=i.place(r,t-r,n);o=a.place(e-r,t-r,n)||o,i.centerDir=-Math.PI/4,a.centerDir=-3*Math.PI/4;let s=n*.93,c=pp*s/16,l=null;if(this.linked){let n=null;for(let r=7;r<=13;r++){let a=r*c/pp;for(let o=1;o<=24;o++){let c=e/2-(o-1)*a,l=c-i.cx;if(l<=0||l>s+a)continue;let u=i.cy+Math.sqrt((s+a)**2-l*l);if(u<t-.25*a||u>t+.95*a)continue;let d=Math.abs(u-(t+.3*a))/a+(r-7)*.04;(!n||d<n.score)&&(n={teeth:r,rp:a,n:o,x1:c,y:u,score:d})}}l=n}let u=!1;if(this.linked&&!l){let r=e/2.5;if(r>=95&&r<=n*1.25){u=!0;let n=r*.32;i.place(n,t-n,r),a.place(e-n,t-n,r),o=!0}}this.isLinked=!!l||u;for(let e of this.idlers)e.el.remove();if(this.idlers=[],l)for(let e=0;e<l.n;e++){let t=new Op(this.idlerLayer,{name:`idler`,teeth:l.teeth});t.place(l.x1+e*2*l.rp,l.y,l.rp/.93),t.tint=Ld,this.idlers.push(t)}if(i.driver=this.driverL,i.k=1,i.c=0,this.isLinked){let e=i;for(let t of[...this.idlers,a]){let n=Math.atan2(t.cy-e.cy,t.cx-e.cx),r=e.teeth/t.teeth;t.driver=this.driverL,t.k=-e.k*r,t.c=n+Math.PI+(n-e.c)*r-Math.PI/t.teeth,e=t}}else a.driver=this.driverR,a.k=1,a.c=0;for(let e of this.big){let t=e.centerDir-e.c;Math.abs(t-e.socketOffset)>1e-6&&(o=!0),e.socketOffset=t,e.redraw(),e.clearItems()}for(let e of this.idlers)e.redraw();return o}bottomInset(){let e=Math.min(this.w*.15,90),t=0;for(let n of this.all){if(n.hidden||!n.R)continue;let r=Math.max(0,Math.abs(this.w/2-n.cx)-e);r>=n.R||(t=Math.max(t,this.h-(n.cy-Math.sqrt(n.R*n.R-r*r))))}return t}tap(e,t){let n=e.driver,r=n.tween?n.tween.to:Math.round(n.angle/hp)*hp;this.lead(e),n.turnTo(r+t*hp/e.k)}lead(e){for(let t of this.all)t.lead=t===e}update(e){this.driverL.update(e),this.isLinked||this.driverR.update(e);for(let t of this.all)t.update(e,this.w,this.h)}setOnTick(e){for(let t of this.big)t.onTick=e}};function Ap(e,t,{onItemTap:n,onItemLift:r,onWoodTap:i}){let a=null,o=()=>({x:t.cx,y:t.cy+t.sink}),s=e=>{let n=e.closest?.(`.item`);if(!n)return null;for(let e of t.items.values())if(e.el===n)return e;return null};t.el.addEventListener(`pointerdown`,e=>{if(a||!e.isPrimary||t.swap)return;let n=o(),r=s(e.target);if(!(!r&&Math.hypot(e.clientX-n.x,e.clientY-n.y)>t.R)){e.preventDefault(),e.stopPropagation(),a={id:e.pointerId,x0:e.clientX,y0:e.clientY,rec:r,mode:null,lastA:0,lastT:0,v:0,lift:null};try{e.target.setPointerCapture(e.pointerId)}catch{}}}),t.el.addEventListener(`pointermove`,n=>{if(!a||n.pointerId!==a.id)return;let i=o();if(!a.mode){let o=n.clientX-a.x0,s=n.clientY-a.y0;if(Math.hypot(o,s)<8)return;let c=a.rec?`lift`:`turn`;a.mode=c,c===`lift`?a.lift=r(t,a.rec,n.clientX,n.clientY):(t.driver.dragging=!0,t.driver.tween=null,t.driver.vel=0,e.lead(t),a.lastA=Math.atan2(n.clientY-i.y,n.clientX-i.x),a.lastT=performance.now())}if(a.mode===`lift`)a.lift?.move(n.clientX,n.clientY);else{let e=Math.atan2(n.clientY-i.y,n.clientX-i.x),r=Sp(e-a.lastA);a.lastA=e;let o=performance.now(),s=Math.max(1,o-a.lastT)/1e3;a.lastT=o,t.driver.angle+=r/t.k,a.v=a.v*.6+r/t.k/s*.4}});let c=e=>{if(!a||e.pointerId!==a.id)return;let r=t.driver,o=e.type!==`pointerup`;a.mode?a.mode===`lift`?a.lift?.end(e.clientX,e.clientY,o):(r.dragging=!1,r.vel=performance.now()-a.lastT<80?Math.max(-14,Math.min(xp,a.v)):0,Math.abs(r.vel)<bp&&r.snap()):o||(a.rec?n(t,a.rec):i(t)),a=null};t.el.addEventListener(`pointerup`,c),t.el.addEventListener(`pointercancel`,c),t.el.addEventListener(`lostpointercapture`,e=>{a&&e.pointerId===a.id&&c(e)});for(let e of[`pointerup`,`pointercancel`])document.addEventListener(e,e=>{a&&e.pointerId===a.id&&c(e)})}var jp=`http://www.w3.org/2000/svg`,Mp=10,Np=2600,Pp=.99,Fp=46,Ip=class{constructor(e,t,n){this.side=t,this.onPull=n,this.el=Ep(`rope rope-${t}`,e),this.svg=document.createElementNS(jp,`svg`),this.svg.setAttribute(`class`,`rope-svg`),this.line=document.createElementNS(jp,`path`),this.line.setAttribute(`class`,`rope-line`),this.grip=document.createElementNS(jp,`path`),this.grip.setAttribute(`class`,`rope-grip`),this.svg.append(this.line,this.grip),this.el.appendChild(this.svg),this.bead=Ep(`rope-bead`,this.el),this.bead.appendChild(tf(Fp,ff.bead,{seed:t===`left`?11:4242})),this.len=200,this.max=90,this.stretch=0,this.stretchVel=0,this.held=null,this.pin=null,this.fired=!1,this.t=Math.random()*10,this.resetPoints();let r=e=>{let t=this.el.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}};this.el.addEventListener(`pointerdown`,e=>{if(this.held!==null||!e.isPrimary)return;e.preventDefault(),e.stopPropagation(),this.held=e.pointerId;let t=r(e),n=this.pts[Mp];this.start=t,this.offset={x:n.x-t.x,y:n.y-t.y},this.moved=!1,this.fired=!1,this.holdAt(n);try{e.target.setPointerCapture(e.pointerId)}catch{}}),this.el.addEventListener(`pointermove`,e=>{if(e.pointerId!==this.held)return;let t=r(e);Math.hypot(t.x-this.start.x,t.y-this.start.y)>6&&(this.moved=!0),this.holdAt({x:t.x+this.offset.x,y:t.y+this.offset.y})});let i=e=>{e.pointerId===this.held&&(this.held=null,this.pin=null,e.type===`pointerup`&&!this.moved&&!this.fired&&(this.stretchVel=this.max*7,this.pts[Mp].px+=this.side===`left`?-5:5,this.onPull()))};this.el.addEventListener(`pointerup`,i),this.el.addEventListener(`pointercancel`,i),this.el.addEventListener(`lostpointercapture`,i)}resetPoints(){this.pts=Array.from({length:11},(e,t)=>{let n=t*this.len/Mp;return{x:0,y:n,px:0,py:n}})}holdAt(e){let t=Math.hypot(e.x,e.y)||1,n=Math.max(0,t-this.len);this.stretch=this.max*(1-Math.exp(-n/this.max)),this.stretchVel=0;let r=Math.min(t,this.len+this.stretch);this.pin={x:e.x/t*r,y:e.y/t*r},!this.fired&&this.stretch>this.max*.6&&(this.fired=!0,this.onPull())}layout(e,t){let n=Math.max(90,t*.3);Math.abs(n-this.len)>1&&(this.len=n,this.resetPoints()),this.max=Math.max(50,t*.14);let r=Math.max(30,Math.min(e*.08,90));this.el.style.left=this.side===`left`?`${r}px`:``,this.el.style.right=this.side===`right`?`${r}px`:``}update(e){if(this.t+=e,this.held===null){let t=-260*this.stretch-12*this.stretchVel;this.stretchVel+=t*e,this.stretch+=this.stretchVel*e,this.stretch<0&&this.stretchVel<0&&(this.stretchVel*=-.3),Math.abs(this.stretch)<.2&&Math.abs(this.stretchVel)<2&&(this.stretch=this.stretchVel=0)}let t=Mp,n=this.pts,r=(this.len+Math.max(0,this.stretch))/t,i=Math.min(e,1/30)/2,a=Math.sin(this.t*.9)*55;for(let e=0;e<2;e++){for(let e=1;e<=t;e++){let r=n[e];if(e===t&&this.pin){r.px=r.x,r.py=r.y,r.x=this.pin.x,r.y=this.pin.y;continue}let o=(r.x-r.px)*Pp,s=(r.y-r.py)*Pp;r.px=r.x,r.py=r.y,r.x+=o+a*i*i,r.y+=s+Np*i*i}for(let e=0;e<12;e++)for(let e=0;e<t;e++){let i=n[e],a=n[e+1],o=a.x-i.x,s=a.y-i.y,c=Math.hypot(o,s)||1e-6,l=(c-r)/c,u=e===0?0:1,d=e+1===t?this.pin?0:.3:1,f=u+d||1;i.x+=o*l*(u/f),i.y+=s*l*(u/f),a.x-=o*l*(d/f),a.y-=s*l*(d/f)}}let o=`M0 0`;for(let e=1;e<t;e++){let t=(n[e].x+n[e+1].x)/2,r=(n[e].y+n[e+1].y)/2;o+=` Q${n[e].x.toFixed(1)} ${n[e].y.toFixed(1)} ${t.toFixed(1)} ${r.toFixed(1)}`}let s=n[t];o+=` L${s.x.toFixed(1)} ${s.y.toFixed(1)}`,this.line.setAttribute(`d`,o),this.grip.setAttribute(`d`,o);let c=n[9],l=Math.atan2(-(s.x-c.x),s.y-c.y);this.bead.style.transform=`translate(${(s.x-Fp/2).toFixed(1)}px, ${(s.y-4).toFixed(1)}px) rotate(${l.toFixed(3)}rad)`}},Lp=6,Rp=8,zp=[`#ff7a6b`,`#f5a623`,`#5fd3b0`,`#4aa8f0`,`#b79cff`,`#ff6fae`],Bp=44,Vp=6,Hp=class{constructor(){this.root=document.createElement(`div`),this.root.id=`particles`,this.root.setAttribute(`aria-hidden`,`true`),document.body.appendChild(this.root),this.taps=document.createElement(`div`),this.taps.id=`taps`,this.taps.setAttribute(`aria-hidden`,`true`),document.body.appendChild(this.taps);let e=e=>{let t=document.createElement(`div`);return t.className=e,this.taps.appendChild(t),t};this.tapPool=[];for(let t=0;t<Lp;t++)this.tapPool.push({ring:e(`ring`),dots:[e(`dot`),e(`dot`),e(`dot`)]});this.trailPool=[];for(let t=0;t<Rp;t++)this.trailPool.push(e(`dot`));this.tapI=0,this.trailI=0}emit(e,t,n,r,i=1){for(let a=0;a<i;a++){let a=document.createElement(`div`);a.className=`p ${n}`;let o=n===`confetti`,s=n===`smoke`?18+Math.random()*16:n===`spark`?8+Math.random()*10:o?7+Math.random()*5:5+Math.random()*8,c=o?320:n===`smoke`?90:i>1?70:26,l=(Math.random()-.5)*c,u=o?90+Math.random()*120:n===`smoke`?-(10+Math.random()*40):n===`spark`?-(20+Math.random()*40):25+Math.random()*45;a.style.width=`${s}px`,a.style.height=`${o?s*1.6:s}px`,a.style.setProperty(`--c`,r),a.style.setProperty(`--x`,`${(e-s/2+(Math.random()-.5)*10).toFixed(1)}px`),a.style.setProperty(`--y`,`${(t-s/2+(Math.random()-.5)*10).toFixed(1)}px`),a.style.setProperty(`--dx`,`${l.toFixed(1)}px`),a.style.setProperty(`--dy`,`${u.toFixed(1)}px`),o&&(a.style.setProperty(`--up`,`${(-(60+Math.random()*130)).toFixed(1)}px`),a.style.setProperty(`--r`,`${((Math.random()-.5)*900).toFixed(0)}deg`));let d=o?1.1+Math.random()*.7:.5+Math.random()*.5;a.style.setProperty(`--t`,`${d.toFixed(2)}s`),a.style.transform=`translate(var(--x), var(--y))`,a.addEventListener(`animationend`,()=>a.remove()),setTimeout(()=>a.remove(),d*1e3+200),this.root.appendChild(a)}}tap(e,t){let n=this.tapPool[this.tapI++%Lp],r=(e,t,n)=>`translate(${e.toFixed(1)}px, ${t.toFixed(1)}px) scale(${n})`;n.ring.animate([{transform:r(e-Bp/2,t-Bp/2,.35),opacity:.9},{transform:r(e-Bp/2,t-Bp/2,1.15),opacity:0}],{duration:360,easing:`ease-out`});let i=Math.random()*Math.PI*2,a=zp[Math.floor(Math.random()*zp.length)];n.dots.forEach((n,o)=>{let s=i+o*Math.PI*2/3,c=20+Math.random()*8;n.style.setProperty(`--c`,a),n.animate([{transform:r(e-Vp/2+Math.cos(s)*8,t-Vp/2+Math.sin(s)*8,1),opacity:.95},{transform:r(e-Vp/2+Math.cos(s)*c,t-Vp/2+Math.sin(s)*c,.4),opacity:0}],{duration:320,easing:`ease-out`})})}trail(e,t){let n=this.trailPool[this.trailI++%Rp];n.style.setProperty(`--c`,`rgba(61, 61, 61, 0.55)`),n.animate([{transform:`translate(${(e-Vp/2).toFixed(1)}px, ${(t-Vp/2).toFixed(1)}px) scale(1.3)`,opacity:.7},{transform:`translate(${(e-Vp/2).toFixed(1)}px, ${(t-Vp/2).toFixed(1)}px) scale(0.3)`,opacity:0}],{duration:420,easing:`ease-out`})}},Up=!0,Wp=e=>`<div class="sprite"><div class="tilt">${e}</div></div>`,Gp=8,Kp=1.3,qp=14,Jp=`#8fd6ff`,Yp=`#ff8a73`,Xp=class{constructor(e,t,{listen:n=!0}={}){if(this.slot=e,this.sprite=e.querySelector(`.sprite`),this.tiltEl=e.querySelector(`.tilt`),this.o=t,this.pointerId=null,this.origin=null,this.home=null,this.dragging=!1,this.last=null,this.travel=0,this.trickle=0,!n)return;e.addEventListener(`pointerdown`,t=>{if(this.pointerId===null&&t.isPrimary){t.preventDefault(),this.pointerId=t.pointerId,this.origin={x:t.clientX,y:t.clientY};try{e.setPointerCapture(t.pointerId)}catch{}}}),e.addEventListener(`pointermove`,e=>{if(e.pointerId===this.pointerId){if(!this.dragging){if(Math.hypot(e.clientX-this.origin.x,e.clientY-this.origin.y)<Gp)return;this.begin(e.clientX,e.clientY)}this.move(e.clientX,e.clientY)}});let r=e=>{e.pointerId===this.pointerId&&(this.pointerId=null,this.dragging?this.end(e.clientX,e.clientY):this.o.onTap?.())};e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r)}tipAt(e,t){return{x:e,y:t}}tiltFor(e){let t=window.innerWidth/2;return-Math.max(-1,Math.min(1,(e-t)/t))*qp*Math.PI/180}place(e,t){let n=this.tipAt(e,t),r=this.tiltFor(n.x),{tip:i}=this.o,a=this.home,o=a.left+a.width/2,s=a.top+a.height/2,c=(i.x-.5)*a.width*Kp,l=(i.y-.5)*a.height*Kp,u=c*Math.cos(r)-l*Math.sin(r),d=c*Math.sin(r)+l*Math.cos(r);this.sprite.style.transform=`translate(${(n.x-u-o).toFixed(1)}px, ${(n.y-d-s).toFixed(1)}px)`,this.tiltEl.style.transform=`rotate(${(r*180/Math.PI).toFixed(1)}deg)`}begin(e,t){if(this.dragging)return;this.dragging=!0,this.slot.classList.add(`dragging`),this.sprite.classList.add(`dragging`,`lifted`),this.slot.offsetWidth,this.home=this.sprite.getBoundingClientRect(),this.place(e,t);let n=this.tipAt(e,t);this.o.particles.emit(n.x,n.y,this.o.particle,this.o.color(),4),this.travel=0,this.last={x:e,y:t},this.o.onStart?.(n.x,n.y)}move(e,t){if(!this.dragging)return;this.place(e,t);let n=this.tipAt(e,t);this.o.onMove?.(n.x,n.y),this.travel+=Math.hypot(e-this.last.x,t-this.last.y),this.last={x:e,y:t},this.travel>=28&&(this.travel=0,this.o.particles.emit(n.x,n.y,this.o.particle,this.o.color(),1));let r=!!this.o.isOver?.(n.x,n.y);this.sprite.classList.toggle(`over`,r),r&&!this.trickle?this.trickle=setInterval(()=>{if(!this.last)return;let e=this.tipAt(this.last.x,this.last.y);this.o.particles.emit(e.x,e.y,this.o.particle,this.o.color(),1)},140):!r&&this.trickle&&this.stopTrickle()}stopTrickle(){clearInterval(this.trickle),this.trickle=0}end(e,t,n=!1){if(!this.dragging)return;this.dragging=!1,this.stopTrickle();let r=this.tipAt(e,t);!n&&this.o.onDrop&&this.o.onDrop(r.x,r.y)&&(this.slot.classList.add(`splash`),this.o.particles.emit(r.x,r.y,this.o.particle,this.o.color(),14),setTimeout(()=>this.slot.classList.remove(`splash`),400)),this.o.onEnd?.(),this.slot.classList.remove(`dragging`),this.sprite.classList.remove(`dragging`,`lifted`,`over`),this.sprite.style.transform=``,this.tiltEl.style.transform=``}},Zp=[`soft`,`brush`,`crayon`,`marker`,`cloth`],Qp=(e,t)=>(e%t+t)%t,$p=[`saturated`,`patterns`,`pastel`,`patterns`],em=[`tools`,`stickers`],tm=()=>({kind:`tools`,at:e=>({type:`tool`,name:Zp[Qp(e,Zp.length)]})});function nm(e){let t=e?.defs?.length?e.defs:Uf.slice().sort(()=>Math.random()-.5),n=e?.fresh||new Set;return{kind:`stickers`,at:e=>{let r=t[Qp(e,t.length)];return{type:`sticker`,def:r,fresh:n.has(r.id)}}}}var rm=class{constructor(e,t){this.el=document.createElement(`div`),this.el.className=`slot hand`,this.el.innerHTML=Wp(``),this.el.hidden=!0,e.appendChild(this.el),this.tilt=this.el.querySelector(`.tilt`),this.drag=new Xp(this.el,{particles:t},{listen:!1}),this.particles=t,this.source=null,this.timer=0}get busy(){return this.drag.dragging}lift(e,t,n,r,i,a=null){clearTimeout(this.timer),this.restore(),this.tilt.innerHTML=``,t.classList.add(`art`),this.tilt.appendChild(t),Object.assign(this.el.style,{left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`}),this.el.hidden=!1,this.el.classList.toggle(`ghost`,!a),this.source=a,a&&(a.style.visibility=`hidden`),this.drag.o={...n,particles:this.particles},this.drag.begin(r,i)}move(e,t){this.drag.move(e,t)}end(e,t,n=!1){this.drag.dragging&&(this.drag.end(e,t,n),this.timer=setTimeout(()=>{this.el.hidden=!0,this.restore()},this.source?300:180))}restore(){this.source&&(this.source.style.visibility=``),this.source=null}},im=class{constructor(e){this.h=e,this.root=e.root,this.particles=new Hp,this.root.innerHTML=`
      <div class="rig"></div>
      <div class="back"><button class="back-arrow" type="button" aria-label="back to stage">${df}</button></div>
    `,this.rig=this.root.querySelector(`.rig`),this.root.querySelector(`.back`).prepend(nf(150,64,ff.plate));let t=this.root.querySelector(`.back`),n=this.root.querySelector(`.back-arrow`);n.addEventListener(`pointerdown`,e=>{if(e.preventDefault(),this.leaving)return;this.leaving=!0,t.classList.add(`go`);let r=n.getBoundingClientRect();this.particles.emit(r.left+r.width/2,r.top+r.height/2,`spark`,Yp,12),this.h.onBackPress?.(),setTimeout(()=>this.h.onBack(),190),setTimeout(()=>{this.leaving=!1,t.classList.remove(`go`)},900)}),this.train=new kp(this.rig,{linked:Up}),this.train.setOnTick((e,t)=>this.h.onTick?.(e.name,t)),this.colors=this.train.left,this.tools=this.train.right,this.colors.makeItem=e=>this.makeColorItem(e),this.tools.makeItem=e=>this.makeToolItem(e);for(let e of this.train.big)Ap(this.train,e,{onItemTap:(e,t)=>this.tapItem(e,t),onItemLift:(e,t,n,r)=>this.liftItem(e,t,n,r),onWoodTap:e=>this.train.tap(e,e===this.colors?-1:1)});this.ropeL=new Ip(this.rig,`left`,()=>this.pull(`colors`)),this.ropeR=new Ip(this.rig,`right`,()=>this.pull(`tools`)),this.hand=new rm(this.root,this.particles),this.colorStep=0,this.toolStep=0,this.selectedFill=null,this.selectedTool=`brush`,this.selectedSticker=null,this.paintTool=`brush`,this._w=0,this._h=0}makeColorItem(e){let t=document.createElement(`div`);t.className=`slot item color`,t.innerHTML=Wp(``);let n=wf(e,128);return n.classList.add(`art`),t.querySelector(`.tilt`).appendChild(n),t.classList.toggle(`selected`,this.selectedFill?.id===e.id),{el:t,key:e.id}}makeToolItem(e){let t=document.createElement(`div`);if(e.type===`tool`)return t.className=`slot item tool`,t.innerHTML=Wp(uf[e.name].art),t.classList.toggle(`selected`,!this.selectedSticker&&this.selectedTool===e.name),{el:t,key:e.name};t.className=e.fresh?`slot item sticker fresh`:`slot item sticker`,t.classList.toggle(`selected`,this.selectedSticker?.id===e.def.id),t.innerHTML=Wp(``);let n=qf(e.def,128);return n.classList.add(`art`),t.querySelector(`.tilt`).appendChild(n),{el:t,key:`sticker:${e.def.id}`}}refreshSelection(){this.colors.forEachItem(e=>e.el.classList.toggle(`selected`,e.key===this.selectedFill?.id));let e=this.selectedSticker?`sticker:${this.selectedSticker.id}`:this.selectedTool;this.tools.forEachItem(t=>t.el.classList.toggle(`selected`,t.key===e)),this.selectedFill&&this.root.style.setProperty(`--c`,this.selectedFill.ink)}selectFill(e){this.selectedFill=e,this.refreshSelection(),this.h.onFill(e)}pickFill(e){this.selectFill(e),(this.selectedSticker||this.selectedTool===`cloth`)&&this.selectTool(this.paintTool)}selectTool(e){this.selectedTool=e,e!==`cloth`&&(this.paintTool=e),this.selectedSticker=null,this.refreshSelection(),this.h.onToolSelect?.(e)}selectSticker(e){this.selectedSticker=e,this.refreshSelection()}tapItem(e,t){let n=t.value;e===this.colors?this.pickFill(n):n.type===`tool`?this.selectTool(n.name):(this.selectSticker(n.def),t.el.classList.remove(`wobble`),t.el.offsetWidth,t.el.classList.add(`wobble`),this.h.onStickerTap?.())}overRig(e,t){for(let n of this.train.big)if(Math.hypot(e-n.cx,t-(n.cy+n.sink))<n.R)return!0;return!1}liftItem(e,t,n,r){let i=t.value,a=t.el.getBoundingClientRect(),o=t.el.querySelector(`.art`).cloneNode(!0);o.tagName===`CANVAS`&&Fd(o).drawImage(t.el.querySelector(`.art`),0,0);let s;if(e===this.colors)s={tip:{x:.5,y:.5},particle:`drop`,color:()=>i.ink,isOver:(e,t)=>this.h.isOver?.(e,t),onStart:()=>this.pickFill(i),onDrop:(e,t)=>!this.overRig(e,t)&&this.h.onPour(i,e,t)};else if(i.type===`tool`){let e=uf[i.name];s={tip:e.tip,particle:e.particle,color:()=>e.particle===`spark`?Jp:this.selectedFill?.ink||`#888`,isOver:(e,t)=>this.h.isOver?.(e,t),onStart:(e,t)=>{this.selectTool(i.name),this.h.onToolStart(i.name,e,t)},onMove:(e,t)=>this.h.onToolMove(e,t),onEnd:()=>this.h.onToolEnd()}}else s={tip:{x:.5,y:.5},particle:`spark`,color:()=>i.def.colors[0],isOver:(e,t)=>this.h.isOver?.(e,t),onDrop:(e,t)=>!this.overRig(e,t)&&this.h.onSticker(i.def,e,t)};return t.held=!0,e.driver.vel=0,this.hand.lift(a,o,s,n,r,t.el),{move:(e,t)=>this.hand.move(e,t),end:(n,r,i=!1)=>{t.held=!1,e.items.get(Number(t.el.dataset.socket))!==t&&(this.hand.source=null,t.el.remove()),this.hand.end(n,r,i)}}}toolRect(e){let t=null;if(this.tools.forEachItem(n=>{n.key===e&&n.el.style.visibility!==`hidden`&&(t=n.el.getBoundingClientRect())}),t)return t;let n=this.tools.itemD,r=this.tools.centerDir,i=this.tools.cx+Math.cos(r)*this.tools.ringR,a=this.tools.cy+Math.sin(r)*this.tools.ringR;return{left:i-n/2,top:a-n/2,width:n,height:n}}summonSticker(e,t){let n=this.selectedSticker;this.hand.lift(this.toolRect(`sticker:${n.id}`),qf(n,128),{tip:{x:.5,y:.5},particle:`spark`,color:()=>n.colors[0],isOver:(e,t)=>this.h.isOver?.(e,t),onDrop:(e,t)=>!this.overRig(e,t)&&this.h.onSticker(n,e,t)},e,t)}summon(e,t){if(this.hand.busy)return;if(this.selectedSticker){this.summonSticker(e,t);return}let n=this.selectedTool,r=null;this.tools.forEachItem(e=>{e.key===n&&e.el.style.visibility!==`hidden`&&(r=e.el.getBoundingClientRect())});let i=this.tools.itemD;if(!r){let e=this.tools.centerDir,t=this.tools.cx+Math.cos(e)*this.tools.ringR,n=this.tools.cy+Math.sin(e)*this.tools.ringR;r={left:t-i/2,top:n-i/2,width:i,height:i}}let a=document.createElement(`div`);a.innerHTML=uf[n].art;let o=uf[n];this.hand.lift(r,a.firstElementChild,{tip:o.tip,particle:o.particle,color:()=>o.particle===`spark`?Jp:this.selectedFill?.ink||`#888`,isOver:(e,t)=>this.h.isOver?.(e,t),onStart:(e,t)=>this.h.onToolStart(n,e,t),onMove:(e,t)=>this.h.onToolMove(e,t),onEnd:()=>this.h.onToolEnd()},e,t)}follow(e,t){this.hand.move(e,t)}release(e,t,n=!1){this.hand.end(e,t,n)}colorSource(){return bf($p[Qp(this.colorStep,$p.length)])}toolSource(){return em[Qp(this.toolStep,em.length)]===`tools`?tm():nm(this.h.stickers?.())}pull(e){let t=e===`colors`?this.colors:this.tools;if(t.swap)return;e===`colors`?this.colorStep++:this.toolStep++;let n=e===`colors`?this.colorSource():this.toolSource();t.swapTo(n,Vd(),()=>{e===`colors`&&this.selectFill(n.at(t.centerIndex()))}),this.h.onRope?.(e)}reroll(){let e=this.colorSource();this.colors.swapTo(e,Vd(),()=>this.selectFill(e.at(this.colors.centerIndex()))),this.tools.swapTo(this.toolSource(),Vd())}layout(e=!1){let t=window.innerWidth,n=window.innerHeight;(e||t!==this._w||n!==this._h)&&t!==0&&n!==0&&(this._w=t,this._h=n,this.train.layout(t,n),this.ropeL.layout(t,n),this.ropeR.layout(t,n),this.h.onLayout?.(this.train.bottomInset()))}show(){this.colorStep=0,this.toolStep=this.h.stickers?.().fresh.size?em.indexOf(`stickers`):0,this.train.reset(),this.colors.tint=Vd(),this.tools.tint=Vd();let e=this.colorSource();this.colors.setSource(e),this.tools.setSource(this.toolSource()),this.root.hidden=!1,this.layout(!0),this.selectedSticker=null,this.selectedTool=`brush`,this.paintTool=`brush`,this.h.onToolSelect?.(`brush`),this.selectFill(e.at(this.colors.centerIndex())),requestAnimationFrame(()=>this.root.classList.add(`show`))}hide(){this.root.classList.remove(`show`),this.root.hidden=!0}get visible(){return!this.root.hidden}update(e){this.root.hidden||(this.layout(),this.train.update(e),this.ropeL.update(e),this.ropeR.update(e))}},am=Math.PI*2,om=e=>e*e,sm=e=>e*e*e,cm=e=>1-(1-e)**3,lm=e=>1+2.70158*(e-1)**3+1.70158*(e-1)**2,um=2.5,dm=1.2,fm=1.5,pm=1,mm=class{constructor({stage:e}){this.stage=e,this.creature=null,this.phases=[],this.index=0,this.t=0,this.active=!1,this.onDone=null,this.side=1}run(e,t){this.phases=e,this.index=0,this.t=0,this.active=!0,this.onDone=t||null,e[0].start?.(),e[0].tick(0)}update(e){if(!this.active)return;let t=this.phases[this.index];this.t+=e;let n=Math.min(1,this.t/t.duration);t.tick(n),!(n<1)&&(t.end?.(),this.index++,this.t=0,this.index<this.phases.length?(this.phases[this.index].start?.(),this.phases[this.index].tick(0)):(this.active=!1,this.onDone?.()))}toPaint(e,{onCut:t,onDone:n}={}){let r=e,i=this.stage;this.creature=r;let a={x:r.root.position.x,z:r.root.position.z,heading:r.heading},o=i.toScreen(r.root.position).x<window.innerWidth/2?-1:1;this.side=o;let s=o*(i.stageCamera.right+um),c=o*(i.paintCamera.right+dm);r.savePose(),r.beginTransit(),this.run([{duration:.7,tick:e=>{let t=lm(Math.min(1,e/.45)),n=sm(Math.max(0,(e-.3)/.7));r.root.position.x=a.x+(s-a.x)*n,r.root.position.z=a.z,r.setLift(1.2*t+.8*n),r.root.rotation.y=a.heading+o*am*fm*om(e)}},{duration:.55,start:()=>{i.setMode(`paint`),r.posePaint(),r.beginTransit(),t?.()},tick:e=>{let t=cm(e);r.root.position.x=c*(1-t),r.setLift(.5*(1-om(e))),r.root.rotation.y=Math.PI+o*am*pm*(1-t)},end:()=>{r.root.position.x=0,r.root.rotation.y=Math.PI,r.land(),r.state=`paint`}}],n)}toStage({onCut:e,onDone:t}={}){let n=this.creature,r=this.stage,i=this.side,a=i*(r.stageCamera.right+um),o=i*(r.paintCamera.right+dm),s=null;n.beginTransit(),this.run([{duration:.45,tick:e=>{let t=sm(e);n.root.position.x=o*t,n.setLift(.5*lm(Math.min(1,e/.6))),n.root.rotation.y=Math.PI+i*am*pm*t}},{duration:.7,start:()=>{r.setMode(`stage`),n.restorePose(),n.heading=n.targetHeading=Math.PI,s={x:n.root.position.x,z:n.root.position.z,heading:Math.PI},n.beginTransit(),e?.()},tick:e=>{let t=cm(e);n.root.position.x=a+(s.x-a)*t,n.root.position.z=s.z,n.setLift(1.6*(1-om(e))),n.root.rotation.y=s.heading+i*am*fm*(1-t)},end:()=>{n.root.position.x=s.x,n.root.rotation.y=s.heading,n.land(),n.enterIdle()}}],t)}},hm={plop:{main:[[390,520,1],[600,800,.7]],drops:[4,2],body:.3,fizz:.09},drops:{main:[[620,820,.85]],drops:[6,3],body:0,fizz:.05},soft:{main:[[330,430,.8]],drops:[2,1],body:.6,fizz:.16}},gm=`drops`;function _m(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function vm(e,t,n,r,i){let a=2*Math.PI*r/t,o=Math.cos(a),s=Math.sin(a)/(2*i),c,l,u;n===`lowpass`?(c=(1-o)/2,l=1-o,u=(1-o)/2):n===`highpass`?(c=(1+o)/2,l=-(1+o),u=(1+o)/2):(c=s,l=0,u=-s);let d=1+s,f=-2*o,p=1-s,m=new Float32Array(e.length),h=0,g=0,_=0,v=0;for(let t=0;t<e.length;t++){let n=(c*e[t]+l*h+u*g-f*_-p*v)/d;g=h,h=e[t],v=_,_=n,m[t]=n}return m}function ym(e,t){let n=new Float32Array(e);for(let r=0;r<e;r++)n[r]=t()*2-1;return n}function bm(e,t,n,r,i,a,o,s){let c=Math.floor(n*t),l=Math.min(e.length-c,Math.floor(a*4*t)),u=Math.min(.006,a*.2);for(let n=0;n<l;n++){let l=n/t,d=r*(1+i*(1-Math.exp(-l/(a*.7))));s+=2*Math.PI*d/t,e[c+n]+=Math.sin(s)*o*(1-Math.exp(-l/u))**2*Math.exp(-l/a)}}function xm(e,t=1,n=!0,r=gm){let i=hm[r]||hm.drops,a=_m(t*7919+(n?1:2)),o=Math.floor(e*(n?.6:.4)),s=new Float32Array(o),c=.012;i.main.forEach(([t,r,i],o)=>{let l=(t+a()*(r-t))*(n?1:1.25),u=(n?.05:.036)*(o===0?1:.8);bm(s,e,c,l,.55+a()*.35,u,i,a()*6.28),c+=.05+a()*.035});let l=i.drops[+!n];for(let t=0;t<l;t++){let r=c+.01+(t+a()*.8)*(n?.06:.045),i=1100*2**(a()*1.2);bm(s,e,r,i,.3+a()*.4,.008+12/i,.2+a()*.14,a()*6.28)}if(i.body>0||i.fizz>0){let t=vm(ym(o,a),e,`bandpass`,380+a()*80,.5),n=vm(vm(ym(o,a),e,`highpass`,2400,.7),e,`lowpass`,5500,.7);for(let r=0;r<o;r++){let a=r/e,o=(1-Math.exp(-a/.03))**2*Math.exp(-a/.07),c=(1-Math.exp(-a/.06))**2*Math.exp(-a/.11);s[r]+=t[r]*o*i.body*4+n[r]*c*i.fizz*4}}let u=1e-6;for(let e=0;e<o;e++)u=Math.max(u,Math.abs(s[e]));let d=Math.floor(e*.04);for(let e=0;e<o;e++){let t=e>o-d?(o-e)/d:1;s[e]=s[e]/u*.85*t}return s}var Sm={spring:{f0:[165,235],vib:[11,.16,.32],wah:[1100,.55,11],bright:.7,dur:.8},harp:{f0:[128,136],vib:[6.5,.03,.6],wah:[950,.75,6.5],bright:1,dur:.95},cartoon:{f0:[210,420],vib:[14,.1,.28],wah:[1500,.4,14],bright:.55,dur:.7}},Cm=`spring`,wm={rec4:{file:`sleigh-4.wav`},rec2:{file:`sleigh-2.wav`},synth:{shakes:[[0,1,46],[.31,.8,40],[.67,.95,46],[1,.85,44]],spread:.045,dur:1.4}},Tm=`rec4`;function Em(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Dm(e,t=.85,n=.03,r=44100){let i=0;for(let t=0;t<e.length;t++)i=Math.max(i,Math.abs(e[t]));let a=i>0?t/i:1,o=Math.floor(n*r);for(let t=0;t<e.length;t++){let n=e.length-t<o?(e.length-t)/o:1;e[t]*=a*n}return e}function Om(e,t=Cm){let n=Sm[t]||Sm.spring,r=Math.floor(e*n.dur),i=new Float32Array(r),[a,o]=n.f0,[s,c,l]=n.vib,[u,d,f]=n.wah,p=Array.from({length:25},(e,t)=>t?1/t**(1.15-.45*n.bright):0),m=0;for(let t=0;t<r;t++){let r=t/e,h=r/n.dur,g=1-Math.exp(-h*4),_=Math.sin(2*Math.PI*s*r)*Math.exp(-r/l),v=(a+(o-a)*g)*(1+c*_);m+=2*Math.PI*v/e;let y=u*(1+d*(Math.sin(2*Math.PI*f*r+.6)*Math.exp(-r/(l*1.6)))),b=y*.32,x=0;for(let t=1;t<=24;t++){let n=t*v;if(n>e*.45)break;let r=Math.exp(-(((n-y)/b)**2));x+=Math.sin(t*m)*p[t]*(.18+1.6*r)}let S=Math.min(1,r/.008)*Math.exp(-r/(n.dur*.42))*(1-.25*h);i[t]=x*S}return Dm(i,.85,.04,e)}function km(e,t=`synth`,n=3){let r=wm[t]?.shakes?wm[t]:wm.synth,i=Em(n*104729+7),a=Math.floor(e*r.dur),o=new Float32Array(a),s=[[1,.4,.22],[2.38,.62,.16],[3.78,.85,.15],[4.3,.45,.12],[5.5,.95,.13],[5.85,.85,.12],[6.2,.55,.1]],c=Array.from({length:16},()=>{let e=2200+i()*520;return s.map(([t,n,r])=>({f:e*t*(.985+i()*.03),a:n*(.75+i()*.5),d:r*(.8+i()*.4)}))});for(let[t,n,s]of r.shakes)for(let l=0;l<s;l++){let s=t+r.spread*i()**2.2,l=c[Math.floor(i()*c.length)],u=n*(.3+.7*i()),d=Math.floor(s*e);for(let t of l){if(t.f>e*.45)continue;let n=2*Math.PI*t.f/e,r=Math.exp(-1/(t.d*e)),s=Math.max(1,Math.floor(8e-4*e)),c=u*t.a,l=i()*6.283,f=Math.min(a-d,Math.floor(t.d*e*6));for(let e=0;e<f;e++)o[d+e]+=Math.sin(l)*c*Math.min(1,e/s),l+=n,c*=r}}return Dm(o,.85,.06,e)}var Am=e=>440*2**((e-69)/12),jm=24,Mm=e=>[e,e+4,e+7],Nm=e=>[e,e+3,e+7],Pm=[0,0,7,7,9,9,7,5,5,4,4,2,2,0,7,7,5,5,4,4,2,7,7,5,5,4,4,2,0,0,7,7,9,9,7,5,5,4,4,2,2,0],Fm=[0,2,4,0,0,2,4,0,4,5,7,4,5,7,7,9,7,5,4,0,7,9,7,5,4,0,0,-5,0,0,-5,0],Im={kind:`chords`,root:57,chords:[Nm(0),Mm(-2),Mm(-4),Mm(-5)],pattern:[3,2,1,0]},Lm={brush:{kind:`chords`,root:62,chords:[Mm(0),Mm(7),Nm(9),Nm(4),Mm(5),Mm(0),Mm(5),Mm(7)],pattern:[0,1,2,3]},marker:{kind:`melody`,root:60,notes:Pm},crayon:{kind:`melody`,root:67,notes:Fm},soft:Im,cloth:Im},Rm={brush:`pluck`,marker:`bell`,crayon:`knock`,soft:`breath`,cloth:`breath`},zm={colors:1180,tools:760},Bm=.045,Vm=class{constructor(e){this.audio=e,this.shift=0,this.current=`brush`,this.pos={},this._noise=null,this.newScale()}newScale(){this.shift=0;for(let e of Object.keys(Lm))this.pos[e]={chord:0,tone:0}}setRegisterValue(e){this.shift=Math.round((Math.max(0,Math.min(1,e))-.5)*jm)}song(e){return Lm[e]||Lm.brush}get notes(){let e=this.song(this.current),t=e.kind===`chords`?e.chords[this.pos[this.current].chord]:Mm(0);return[t[0],t[1],t[2],t[0]+12].map(t=>Am(e.root+this.shift+t))}nextNote(e){let t=this.song(e),n=this.pos[e]||(this.pos[e]={chord:0,tone:0}),r;if(t.kind===`melody`)r=t.notes[n.tone%t.notes.length],n.tone=(n.tone+1)%t.notes.length;else{let e=t.chords[n.chord],i=t.pattern[n.tone];r=i===3?e[0]+12:e[i],n.tone++,n.tone>=t.pattern.length&&(n.tone=0,n.chord=(n.chord+1)%t.chords.length)}return Am(t.root+this.shift+r)}randomNote(){let e=this.song(this.current),t=e.kind===`chords`?e.chords[this.pos[this.current].chord]:Mm(0);return Am(e.root+this.shift+t[Math.floor(Math.random()*3)])}strokeNote(e,t=0){if(!this.audio.ready)return;this.current=Lm[e]?e:`brush`;let n=this.nextNote(this.current),r=.8+Math.random()*.2;this[Rm[this.current]||`pluck`](n,t,r)}tick(e,t=!0,n=0){if(!this.audio.ready)return;let r=this.audio.ctx.currentTime;if(this._lastTick=this._lastTick||{},r-(this._lastTick[e]||0)<Bm)return;this._lastTick[e]=r;let i=(zm[e]||900)*(.98+Math.random()*.04);this.click(i,e===`colors`?-.5:.5,t?.2:.09,r)}ratchet(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime;[1,.9,.8].forEach((n,r)=>this.click(1e3*n,e,.24,t+r*.055))}click(e,t,n,r){let i=this.audio.ctx,a=this.out(t,n);this.partial(e,1,.001,.05,a,r),this.partial(e*2.3,.35,.001,.025,a,r);let o=i.createBufferSource();o.buffer=this.noiseBuffer();let s=i.createBiquadFilter();s.type=`bandpass`,s.frequency.value=e*3,s.Q.value=3;let c=i.createGain();c.gain.setValueAtTime(.5,r),c.gain.exponentialRampToValueAtTime(.001,r+.02),o.connect(s),s.connect(c),c.connect(a),o.start(r),o.stop(r+.03)}tug(e=0){if(!this.audio.ready)return;let t=this.audio.ctx,n=t.currentTime,r=this.out(e,.8),i=t.createOscillator();i.type=`triangle`,i.frequency.setValueAtTime(380,n),i.frequency.exponentialRampToValueAtTime(190,n+.16);let a=t.createGain();a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.5,n+.01),a.gain.exponentialRampToValueAtTime(.001,n+.2),i.connect(a),a.connect(r),i.start(n),i.stop(n+.22);let o=t.createOscillator();o.type=`sine`,o.frequency.setValueAtTime(190,n),o.frequency.exponentialRampToValueAtTime(95,n+.18);let s=t.createGain();s.gain.setValueAtTime(1e-4,n),s.gain.exponentialRampToValueAtTime(.9,n+.01),s.gain.exponentialRampToValueAtTime(.001,n+.22),o.connect(s),s.connect(r),o.start(n),o.stop(n+.25);let c=t.createBufferSource();c.buffer=this.noiseBuffer();let l=t.createBiquadFilter();l.type=`bandpass`,l.frequency.value=650,l.Q.value=6;let u=t.createGain();u.gain.setValueAtTime(1e-4,n),u.gain.setValueAtTime(1e-4,n+.04),u.gain.exponentialRampToValueAtTime(.5,n+.08),u.gain.exponentialRampToValueAtTime(.001,n+.3),c.connect(l),l.connect(u),u.connect(r),c.start(n),c.stop(n+.32)}knock(e,t,n=1){let r=this.audio.ctx.currentTime,i=this.out(t,.4*n);this.partial(e,1,.002,.45,i,r),this.partial(e*3,.22,.001,.09,i,r),this.partial(e*6.2,.08,.001,.04,i,r)}out(e,t){let n=this.audio.ctx,r=n.createGain();r.gain.value=t;let i=n.createStereoPanner?n.createStereoPanner():null;return i?(i.pan.value=Math.max(-1,Math.min(1,e)),r.connect(i),i.connect(this.audio.master)):r.connect(this.audio.master),r}partial(e,t,n,r,i,a,o=0){let s=this.audio.ctx,c=s.createOscillator();c.type=`sine`,c.frequency.value=e;let l=s.createGain();return l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(t,a+n),l.gain.setValueAtTime(t,a+n+o),l.gain.exponentialRampToValueAtTime(t*.001,a+n+o+r),c.connect(l),l.connect(i),c.start(a),c.stop(a+n+o+r+.05),c}arpeggio(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime,n=this.notes;for(let r=0;r<3;r++)this.pluck(n[r],e,.9,t+r*.09)}pluck(e,t,n=1,r=this.audio.ctx.currentTime){let i=this.out(t,.45*n);this.partial(e,1,.004,.9,i,r),this.partial(e*4,.18,.002,.15,i,r)}stamp(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime,n=this.notes;this.bell(n[0]*2,e,.8,t),this.bell(n[2]*2,e,.8,t+.11)}bloom(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime,n=this.notes;for(let r=0;r<3;r++)this.bell(n[r]*2,e,.7,t+r*.13)}rise(e=0){this.audio.ready&&this.slide(e,.1,330,880,.5)}fanfare(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime,n=[392,523.25,659.25,783.99,1046.5];n.forEach((r,i)=>{let a=i===n.length-1,o=this.out(e,.2+.03*i),s=t+i*.085;this.partial(r,1,.018,a?1.3:.55,o,s),this.partial(r*2,.16,.018,a?.6:.25,o,s),a&&this.partial(r*1.5,.12,.03,.9,o,s)})}collect(e=0){if(!this.audio.ready)return;let t=this.audio.ctx.currentTime;[[1318.5,0],[1568,.09],[2093,.38]].forEach(([n,r])=>{let i=this.out(e,.16);this.partial(n,1,.012,.5,i,t+r)})}slide(e,t,n,r,i,a=this.audio.ctx.currentTime,o=`sine`){let s=this.audio.ctx,c=s.createOscillator();c.type=o,c.frequency.setValueAtTime(n,a),c.frequency.exponentialRampToValueAtTime(r,a+i);let l=s.createGain();l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(1,a+.01),l.gain.exponentialRampToValueAtTime(.001,a+i);let u=this.out(e,t);c.connect(l),l.connect(u),c.start(a),c.stop(a+i+.05)}splash(e=0,t=!0){if(!this.audio.ready)return;let n=this.splashSet(t),r=n[Math.floor(Math.random()*n.length)],i=t?.88+Math.random()*.2:1.05+Math.random()*.3;this.audio.playBuffer(r,{pan:e,rate:i,gain:t?.42:.24})}splashSet(e){this._splashes||={};let t=e?`big`:`small`;if(!this._splashes[t]){let n=this.audio.ctx;this._splashes[t]=[1,2,3].map(t=>{let r=xm(n.sampleRate,t,e),i=n.createBuffer(1,r.length,n.sampleRate);return i.getChannelData(0).set(r),i})}return this._splashes[t]}buzz(e=0){if(!this.audio.ready)return;let t=this.audio.ctx,n=t.currentTime,r=t.createOscillator();r.type=`sawtooth`,r.frequency.setValueAtTime(190,n),r.frequency.linearRampToValueAtTime(230,n+.4);let i=t.createOscillator();i.frequency.value=31;let a=t.createGain();a.gain.value=.5;let o=t.createGain();o.gain.value=.5;let s=t.createBiquadFilter();s.type=`lowpass`,s.frequency.value=1100;let c=t.createGain();c.gain.setValueAtTime(1e-4,n),c.gain.exponentialRampToValueAtTime(1,n+.05),c.gain.exponentialRampToValueAtTime(.001,n+.45);let l=this.out(e,.11);i.connect(a),a.connect(o.gain),r.connect(s),s.connect(o),o.connect(c),c.connect(l),r.start(n),i.start(n),r.stop(n+.5),i.stop(n+.5)}boing(e=0,t=1,n=1){if(!this.audio.ready)return;let r=this.audio.ctx.currentTime;this.slide(e,.4*t,200*n,420*n,.12,r),this.slide(e,.3*t,420*n,300*n,.2,r+.1)}boingBig(e=0,t=Cm){if(!this.audio.ready)return;let n=this.rendered(`boing:${t}`,e=>Om(e,t));this.audio.playBuffer(n,{pan:e,rate:.97+Math.random()*.06,gain:.6})}sleigh(e=0,t=Tm){if(!this.audio.ready)return;let n=wm[t]?.file,r=n&&this.audio.buffers.get(`sfx:${n}`),i=r||this.rendered(`sleigh:synth`,e=>km(e,`synth`));this.audio.playBuffer(i,{pan:e,rate:.98+Math.random()*.04,gain:r?.5:.4})}warmUp(){if(!this.audio.ctx)return;let e=window.requestIdleCallback||(e=>setTimeout(e,200));e(()=>this.rendered(`boing:${Cm}`,e=>Om(e,Cm))),e(()=>{let e=wm[Tm]?.file;e&&!this.audio.buffers.get(`sfx:${e}`)&&this.rendered(`sleigh:synth`,e=>km(e,`synth`))})}rendered(e,t){this._rendered||=new Map;let n=this._rendered.get(e);if(!n){let r=this.audio.ctx,i=t(r.sampleRate);n=r.createBuffer(1,i.length,r.sampleRate),n.getChannelData(0).set(i),this._rendered.set(e,n)}return n}pop(e=0){this.audio.ready&&this.pluck(this.randomNote()*2,e,.5)}bell(e,t,n=1,r=this.audio.ctx.currentTime){let i=this.out(t,.32*n);this.partial(e,1,.003,1.4,i,r),this.partial(e*2.76*1.002,.3,.003,.8,i,r),this.partial(e*5.4,.12,.002,.35,i,r)}breath(e,t,n=1){let r=this.audio.ctx,i=r.currentTime,a=this.out(t,.32*n);this.partial(e,1,.07,1.1,a,i,.18),this.partial(e*2,.15,.09,.6,a,i,.12);let o=r.createBufferSource();o.buffer=this.noiseBuffer();let s=r.createBiquadFilter();s.type=`bandpass`,s.frequency.value=e*2,s.Q.value=9;let c=r.createGain();c.gain.setValueAtTime(1e-4,i),c.gain.exponentialRampToValueAtTime(.5,i+.03),c.gain.exponentialRampToValueAtTime(1e-4,i+.4),o.connect(s),s.connect(c),c.connect(a),o.start(i),o.stop(i+.45)}noiseBuffer(){if(this._noise)return this._noise;let e=this.audio.ctx,t=e.createBuffer(1,e.sampleRate,e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;return this._noise=t,t}},Hm=5,Um=2,Wm=60,Gm=80,Km=3,qm=3.5,Jm=24,Ym=.5,Xm=1.1,Zm=3,Qm=.4,$m=1728e5,eh=24,th=.35,nh=(e,t)=>e+Math.random()*(t-e),rh=class e{constructor({stage:e,audio:t,loadFace:n=null,saveFace:r=null}){this.stage=e,this.audio=t,this.loadFace=n,this.saveFace=r,this.legacyFaces=new Set,this.onForget=null,this.away=[],this.creatures=[],this.spawnTimer=nh(2,4),this.leaveTimer=Gm,this.running=!1,this.onChange=null,this.obstacles=()=>[],this.onStep=null,this.wakeQueue=[],this.wakeTimer=0,this.stored=[],this.lastRefresh=Date.now(),this.forceNew=!1,this.refreshCheck=0}changed(){this.onChange?.()}serialize(){let e=[];for(let t of this.creatures){if(t.state===`gone`)continue;let n=t.stagePose||{x:t.root.position.x,z:t.root.position.z,heading:t.heading},r=this.stage.bounds;e.push({seed:t.seed,painted:t.painted,x:+Math.min(r.maxX,Math.max(r.minX,n.x)).toFixed(2),z:+Math.min(r.maxZ,Math.max(r.minZ,n.z)).toFixed(2),heading:+n.heading.toFixed(2),growth:+t.savedGrowth.toFixed(2)})}return{creatures:e,away:this.away.map(e=>({seed:e.seed,growth:+e.growth.toFixed(2)})),stored:this.stored.slice(),lastRefresh:this.lastRefresh,faceMap:Um,legacyFaces:[...this.legacyFaces]}}static awayEntry(e){return typeof e==`number`?Number.isFinite(e)?{seed:e>>>0,growth:0}:null:!e||!Number.isFinite(e.seed)?null:{seed:e.seed>>>0,growth:Number(e.growth)||0}}restore(t){if(t&&t.faceMap!==Um){for(let e of Array.isArray(t.creatures)?t.creatures:[])e?.painted&&Number.isFinite(e.seed)&&this.legacyFaces.add(e.seed>>>0);for(let n of Array.isArray(t.away)?t.away:[]){let t=e.awayEntry(n);t&&this.legacyFaces.add(t.seed)}}else if(Array.isArray(t?.legacyFaces))for(let e of t.legacyFaces)Number.isFinite(e)&&this.legacyFaces.add(e>>>0);let n=Array.isArray(t?.creatures)?t.creatures.slice(0,Hm):[];for(let e of n){if(!Number.isFinite(e.seed))continue;let t=this.add(e.seed>>>0);t.root.position.set(Number(e.x)||0,0,Number(e.z)||0),t.heading=t.targetHeading=Number.isFinite(e.heading)?e.heading:Math.PI,t.root.rotation.y=t.heading,t.painted=!!e.painted,t.painted&&this.applyFace(t),t.growth=Number(e.growth)||0,t.sprout.setStage(t.growthStage(),!1),t.refreshDims()}return this.away=Array.isArray(t?.away)?t.away.map(e.awayEntry).filter(Boolean).slice(0,Jm):[],this.stored=Array.isArray(t?.stored)?t.stored.filter(Number.isFinite).map(e=>e>>>0).slice(0,eh):[],this.lastRefresh=Number.isFinite(Number(t?.lastRefresh))?Number(t.lastRefresh):Date.now(),this.creatures.length}wakeAll(){this.wakeQueue=[...this.creatures],this.wakeTimer=0,this.running=!0}get count(){return this.creatures.length}unpaintedCount(){return this.creatures.filter(e=>!e.painted).length}target(){return Hm}applyFace(e,t=!1){return this.loadFace?this.loadFace(e.seed).then(n=>{if(n&&e.state!==`gone`){if(this.legacyFaces.has(e.seed))e.drawLegacyFace(n),this.legacyFaces.delete(e.seed),this.saveFace?.(e.seed,e.paintCanvas),this.changed();else{let r=e.paintCanvas.getContext(`2d`);t&&r.clearRect(0,0,e.paintCanvas.width,e.paintCanvas.height),r.drawImage(n,0,0,e.paintCanvas.width,e.paintCanvas.height)}e.faceDirty=!0}}):Promise.resolve()}reloadFace(e){e.state!==`gone`&&(e.faceDirty=!0,e.painted&&this.applyFace(e,!0))}reloadFaces(){for(let e of this.creatures)this.reloadFace(e)}add(e=Math.random()*4294967295>>>0){let t=new Td({seed:e,stage:this.stage,audio:this.audio});return t.age=0,t.onStep=e=>this.onStep?.(e),t.paintCanvas.addEventListener(`contextrestored`,()=>this.reloadFace(t)),t.faceCanvas.addEventListener(`contextrestored`,()=>{t.faceDirty=!0}),t.featCanvas.addEventListener(`contextrestored`,()=>{t.featDirty=!0}),this.creatures.push(t),this.stage.scene.add(t.root),t}spawn(){let e=this.stage.bounds,t,n=null;this.forceNew?this.forceNew=!1:this.away.length&&Math.random()<Ym?(n=this.away.splice(Math.floor(Math.random()*this.away.length),1)[0],t=n.seed):this.stored.length&&Math.random()<th&&(t=this.stored.splice(Math.floor(Math.random()*this.stored.length),1)[0]);let r=this.add(t),i=this.obstacles(),a=nh(e.minX+.5,e.maxX-.5);for(let t=0;t<10&&i.some(e=>Math.abs(e.x-a)<e.r+.5);t++)a=nh(e.minX+.5,e.maxX-.5);r.root.position.set(a,0,e.minZ-qm),r.blink=0,r.blinkTimer=nh(1,3),r.featDirty=!0,n&&(r.painted=!0,this.applyFace(r),r.growth=n.growth,r.sprout.setStage(r.growthStage(),!1),r.refreshDims());let o=Math.min(e.maxX-.5,Math.max(e.minX+.5,a+nh(-1.5,1.5)));return r.enterTo(o,nh(e.minZ+1.5,e.minZ+4)),this.changed(),r}remove(e){let t=this.creatures.indexOf(e);if(t>=0&&this.creatures.splice(t,1),this.stage.scene.remove(e.root),e.dispose(),e.storing){for(this.stored.unshift(e.seed);this.stored.length>eh;)this.stored.pop();this.onForget?.(e.seed)}else if(e.painted)for(this.away.unshift({seed:e.seed,growth:e.growth});this.away.length>Jm;)this.onForget?.(this.away.pop().seed);this.changed()}refresh(e=!1){if(!e&&Date.now()-this.lastRefresh<$m)return!1;let t=this.creatures.filter(e=>!e.storing&&(e.state===`idle`||e.state===`wander`)).sort((e,t)=>t.age-e.age)[0];if(!t)return!1;this.lastRefresh=Date.now(),t.storing=!0;let n=this.stage.bounds;return t.leaveTo(t.root.position.x<0?n.minX-Km:n.maxX+Km),this.forceNew=!0,this.spawnTimer=0,this.changed(),!0}stumbleAll(){for(let e of this.creatures)e.stumble(Math.random()*.3)}cheer(e=null){for(let t of this.creatures)(t.state===`idle`||t.state===`wander`||t.state===`enter`)&&(t===e?t.celebrate():(t.gazeAt(t.root.position.x,t.root.position.z+10,2.2),t.hop()))}hopAll(e=null){for(let t of this.creatures)t!==e&&t.hop()}watch(e,t){for(let n of this.creatures)n!==e&&n.reactionName!==`poop`&&(n.state===`idle`||n.state===`wander`||n.state===`enter`)&&n.gazeAt(e.root.position.x,e.root.position.z,t)}spinAll(){for(let e of this.creatures)e.spin()}gazeAt(e,t,n){for(let r of this.creatures)(r.state===`idle`||r.state===`wander`||r.state===`enter`)&&r.gazeAt(e,t,n)}start(){this.running=!0}update(e,t=null,n=!1){if(n){t?.update(e);return}this.steer();for(let t of this.creatures)t.update(e);if(this.wakeQueue.length&&(this.wakeTimer-=e,this.wakeTimer<=0)){let e=this.wakeQueue.shift();e.state===`sleep`&&e.wake(),this.wakeTimer=.18}if(this.running){this.refreshCheck-=e,this.refreshCheck<=0&&(this.refreshCheck=30,this.refresh()),this.spawnTimer>0&&(this.spawnTimer-=e),this.spawnTimer<=0&&this.count<this.target()&&(this.spawn(),this.spawnTimer=Wm);for(let t of this.creatures)t.age+=e;if(this.count>=this.target()&&(this.leaveTimer-=e,this.leaveTimer<=0&&!this.creatures.some(e=>e.state===`leave`))){let e=this.creatures.filter(e=>e!==t&&(e.state===`idle`||e.state===`wander`)).sort((e,t)=>t.age-e.age)[0];if(e){let t=this.stage.bounds,n=e.root.position.x<0?-1:1;e.leaveTo(n<0?t.minX-Km:t.maxX+Km),this.leaveTimer=Gm}}for(let e of[...this.creatures])e.state===`gone`&&this.remove(e);this.separate(e)}}steer(){let e=this.creatures,t=this.obstacles();for(let t of e)t.avoid.x=0,t.avoid.z=0;for(let n of e)if(n.state===`wander`||n.state===`enter`||n.state===`leave`){for(let t of e){if(t===n||t.state===`gone`||t.state===`transit`||t.state===`paint`)continue;let e=n.root.position.x-t.root.position.x,r=(n.root.position.z-t.root.position.z)*Qm,i=Math.hypot(e,r);if(i>=Zm||i<.001)continue;let a=(1-i/Zm)**2,o=e/i,s=r/i;n.avoid.x+=(o-.8*s)*a*1.6,n.avoid.z+=(s+.8*o)*a*1.6}for(let e of t){let t=n.root.position.x-e.x,r=n.root.position.z-e.z,i=Math.hypot(t,r),a=e.r+.9;if(i>=a||i<.001)continue;let o=(1-i/a)**2;n.avoid.x+=(t/i-r/i*.6)*o*2.2,n.avoid.z+=(r/i+t/i*.6)*o*2.2}}}separate(e){let t=Math.min(1,e*2.5),n=this.creatures.filter(e=>e.state===`idle`||e.state===`wander`||e.state===`enter`||e.state===`leave`);for(let e=0;e<n.length;e++)for(let r=e+1;r<n.length;r++){let i=n[e].root.position,a=n[r].root.position,o=a.x-i.x,s=(a.z-i.z)*Qm,c=Math.hypot(o,s);if(c>=Xm)continue;c<.001&&(o=1,s=0,c=1);let l=(Xm-c)/2*t;i.x-=o/c*l,i.z-=s/c*l/Qm,a.x+=o/c*l,a.z+=s/c*l/Qm}}};function ih(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new wr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=ah(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=ah(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function ah(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new lr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var oh=240,sh=e=>1+2.7*(e-1)**3+1.7*(e-1)**2;function ch(e,t,n,r){e.updateMatrixWorld(!0),e.traverse(e=>{if(!e.isMesh)return;let i=e.geometry.clone().applyMatrix4(e.matrixWorld);if(i.deleteAttribute(`uv`),e.userData.ink){(e.userData.ink===`stem`?r:n).push(i);return}let a=i.attributes.position.count,o=e.material.color,s=new Float32Array(a*3);for(let e=0;e<a;e++)s[e*3]=o.r,s[e*3+1]=o.g,s[e*3+2]=o.b;i.setAttribute(`color`,new lr(s,3)),t.push(i)})}var lh=class{constructor(e){this.stage=e,this.plants=[],this.root=new Sn,e.scene.add(this.root);let t=Kl();this.colored=new Y(new wr,t.toon),this.ink=new Y(new wr,t.ink),this.stems=new Y(new wr,t.stem),this.colored.visible=this.ink.visible=this.stems.visible=!1,this.root.add(this.colored,this.ink,this.stems),this._bounds=null,this._dirty=!1}serialize(){return this.plants.map(e=>({fx:+e.fx.toFixed(3),fz:+e.fz.toFixed(3),color:e.color,s:e.seed}))}restore(e){for(let e of this.plants)e.group&&this.root.remove(e.group);if(this.plants=[],Array.isArray(e))for(let t of e.slice(-240)){let e=Number(t?.fx),n=Number.isFinite(Number(t?.fz))?Number(t.fz):1.08,r=Number(t?.color),i=Number.isFinite(Number(t?.s))?Number(t.s)>>>0:Math.random()*4294967295>>>0;Number.isFinite(e)&&Number.isFinite(r)&&this.plants.push({fx:e,fz:n,color:r,seed:i,group:null,pop:1})}this.layout(!0)}plantAt(e,t,n){let r=this.stage.bounds,i=(e-r.minX)/Math.max(1e-6,r.maxX-r.minX),a=(t-r.minZ)/Math.max(1e-6,r.maxZ-r.minZ);for(;this.plants.length>=oh;){let e=this.plants.shift();e.group&&this.root.remove(e.group),this._dirty=!0}let o=Math.random()*4294967295>>>0,s={fx:i,fz:a,color:n,seed:o,group:this.live(o,n),pop:0};return s.group.scale.setScalar(.001),this.plants.push(s),this.place(s),s.group}live(e,t){let n=rl(e),r=ql(t,n.next);return r.rotation.y=n.range(-.2,.2),this.root.add(r),r}get count(){return this.plants.length}randomSpot(e){if(!this.plants.length)return null;let t=this.plants[Math.floor(Math.random()*this.plants.length)],n=this.stage.bounds;return e.set(n.minX+(n.maxX-n.minX)*t.fx,0,n.minZ+(n.maxZ-n.minZ)*t.fz)}place(e,t=e.group){let n=this.stage.bounds;t.position.set(n.minX+(n.maxX-n.minX)*e.fx,0,n.minZ+(n.maxZ-n.minZ)*e.fz)}layout(e=!1){let t=this.stage.bounds;if(e||t!==this._bounds){this._bounds=t;for(let e of this.plants)e.group&&this.place(e);this._dirty=!0}}rebuild(){this._dirty=!1;let e=[],t=[],n=[],r=new Sn;this.root.add(r);for(let i of this.plants){if(i.group)continue;let a=this.live(i.seed,i.color);this.place(i,a),this.root.remove(a),r.add(a),ch(a,e,t,n),r.remove(a)}this.root.remove(r),this.colored.geometry.dispose(),this.ink.geometry.dispose(),this.stems.geometry.dispose(),this.colored.geometry=e.length?ih(e,!1):new wr,this.ink.geometry=t.length?ih(t,!1):new wr,this.stems.geometry=n.length?ih(n,!1):new wr;for(let r of[...e,...t,...n])r.dispose();this.colored.visible=this.ink.visible=this.stems.visible=e.length>0}append(e){let t=[],n=[],r=[],i=this.live(e.seed,e.color);this.place(e,i),ch(i,t,n,r),this.root.remove(i);for(let[e,i]of[[this.colored,t],[this.ink,n],[this.stems,r]]){if(!i.length)continue;let t=e.geometry;e.geometry=t.attributes.position?ih([t,...i],!1):ih(i,!1),t.dispose();for(let e of i)e.dispose();e.visible=!0}}update(e){this.layout();for(let t of this.plants)t.group&&(t.pop=Math.min(1,t.pop+e/.4),t.group.scale.setScalar(Math.max(.001,sh(t.pop))),t.pop>=1&&(this.root.remove(t.group),t.group=null,this._dirty||this.append(t)));this._dirty&&this.rebuild()}},uh=15790320,dh=3884395,fh=16177342,ph={clear:null,rain:{fall:{n:70,kind:`streak`,colors:[9417433],speed:[8,11],sway:0},patch:{n:5,fill:12377333,rim:8825289},tint:[14542058,.7]},snow:{fall:{n:60,kind:`flake`,colors:[16777215],speed:[.9,1.5],sway:.4},patch:null,tint:[14082284,.85]},leaves:{fall:{n:24,kind:`leaf`,colors:[15769658,14835770,15910987,13208124],speed:[1,1.7],sway:.7},patch:null,tint:[15985110,.6]},petals:{fall:{n:22,kind:`leaf`,colors:[16757713,16748480,16766694],speed:[.8,1.3],sway:.6},patch:null,tint:[16183025,.5]}},mh={winter:[[`snow`,.25],[`rain`,.2]],spring:[[`rain`,.2],[`petals`,.22]],summer:[[`rain`,.1]],autumn:[[`rain`,.2],[`leaves`,.28]]},hh=6.5;function gh(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t^=t>>>13,t=Math.imul(t,1540483477),t^=t>>>15,(t>>>0)/4294967296}function _h(e){let t=0;return()=>gh(`${e}#${t++}`)}var vh=e=>e===12||e<=2?`winter`:e<=5?`spring`:e<=8?`summer`:`autumn`;function yh(e){return e>=20||e<6?1:e>=18?(e-18)/2:e<7.5?1-(e-6)/1.5:0}var bh=e=>String(e).padStart(2,`0`),xh=`facepaint:birthday`;function Sh(){try{let e=/[?&]birthday=([^&]+)/.exec(location.search);if(e){if(/^\d{1,2}-\d{1,2}$/.test(e[1])){let[t,n]=e[1].split(`-`).map(Number);localStorage.setItem(xh,`${bh(t)}-${bh(n)}`)}else localStorage.removeItem(xh)}return localStorage.getItem(xh)}catch{return null}}var Ch=class{constructor({stage:e,creatures:t,fx:n,cheer:r}){this.stage=e,this.creatures=t,this.fx=n,this.cheer=r,this.root=new Sn,e.scene.add(this.root);let i=e=>(RegExp(`[?&]${e}=([^&]+)`).exec(location.search)||[])[1];this.force={hour:i(`time`)!==void 0&&Number.isFinite(Number(i(`time`)))?Number(i(`time`)):null,date:i(`date`)||null,weather:i(`weather`)in ph?i(`weather`):null,special:i(`special`)||null},this.birthday=Sh(),this.night=0,this.warm=0,this.weather=`clear`,this.special=null,this.tintAmount=0,this.checkT=0,this._bounds=null,this._key=``,this.fall=null,this.patches=[],this.props=[],this.errands=[],this.errandT=6,this.splashGate=0,this.fireflies=[];let a=new Fr({color:16774048,transparent:!0,opacity:0}),o=new Fr({color:16774048,transparent:!0,opacity:0,depthWrite:!1});for(let e=0;e<10;e++){let e=new Sn,t=new Y(wl,a.clone());t.scale.setScalar(.04);let n=new Y(wl,o.clone());n.scale.setScalar(.13),e.add(t,n),e.visible=!1,this.root.add(e),this.fireflies.push({g:e,core:t,halo:n,a:Math.random()*6.28,b:Math.random()*6.28,fx:Math.random(),fz:Math.random(),h:.5+Math.random()*.9,sp:.4+Math.random()*.5})}this._c=new J,this._c2=new J,this._m=new qt,this._q=new Tt,this._e=new rn,this._v=new G,this._s=new G,this.read(),this.tintAmount=this.weather===`clear`?0:1}now(){let e=new Date;if(this.force.date){let[t,n,r]=String(this.force.date).split(`-`).map(Number);t&&n&&r&&e.setFullYear(t,n-1,r)}return{hour:this.force.hour==null?e.getHours()+e.getMinutes()/60:this.force.hour,month:e.getMonth()+1,day:e.getDate(),year:e.getFullYear()}}read(){let e=this.now();this.night=yh(e.hour),this.warm=4*this.night*(1-this.night);let t=`${e.year}-${bh(e.month)}-${bh(e.day)}`,n=Math.floor(e.hour/6),r=`clear`,i=gh(`weather:${t}:${n}`);for(let[t,n]of mh[vh(e.month)]){if(i<n){r=t;break}i-=n}this.force.weather&&(r=this.force.weather);let a=`${bh(e.month)}-${bh(e.day)}`,o=null;(e.month===10&&e.day>=24||e.month===11&&e.day<=1)&&(o=`pumpkins`),(e.month===12&&e.day>=12||e.month===1&&e.day<=6)&&(o=`fir`),this.birthday&&this.birthday===a&&(o=`balloons`),this.force.special&&(o=this.force.special===`none`?null:this.force.special);let s=`${r}|${o}`;s!==this._key&&(r!==this.weather&&(this.tintAmount=0),this._key=s,this.weather=r,this.special=o,this.build(`${t}:${n}`))}build(e){this.fall&&=(this.root.remove(this.fall.mesh),this.fall.mesh.geometry.dispose(),this.fall.mesh.material.dispose(),this.fall.mesh.dispose(),null);for(let e of this.patches)this.root.remove(e.group),e.group.traverse(e=>{e.geometry?.dispose(),e.material?.dispose()});for(let e of this.props)this.root.remove(e.group);this.patches=[],this.props=[],this.errands=[];let t=ph[this.weather],n=_h(`${e}:${this.weather}`);if(t?.fall){let e=t.fall,n=new ii(e.kind===`streak`?new vi(.018,.42,.018):e.kind===`flake`?new wi(.042,6,5):new Ci(.15,.1),new Fr({color:16777215,side:2,transparent:!0,opacity:e.kind===`streak`?.75:.95}),e.n);n.frustumCulled=!1;let r=[];for(let t=0;t<e.n;t++)n.setColorAt(t,this._c.set(e.colors[t%e.colors.length])),r.push({x:0,y:Math.random()*hh,z:0,v:e.speed[0]+Math.random()*(e.speed[1]-e.speed[0]),ph:Math.random()*6.28,spin:(Math.random()-.5)*4,fresh:!0});this.fall={mesh:n,data:r,cfg:e},this.root.add(n)}if(t?.patch){let e=t.patch;for(let t=0;t<e.n;t++){let t=.5,r=.5;for(let e=0;e<12&&(t=.08+n()*.84,r=.12+n()*.8,!this.patches.every(e=>Math.hypot(e.fx-t,(e.fz-r)*1.3)>.24));e++);let i=.48+n()*.34,a=i*(.62+n()*.2),o=Fl(n),s=new Sn,c=new Y(o,new Fr({color:e.rim}));c.scale.set(1.06,1,1.08),c.position.y=.004;let l=new Y(o,new Fr({color:e.fill}));l.position.y=.007,s.add(c,l),s.scale.set(i,1,a),this.root.add(s),this.patches.push({group:s,fill:l,rim:c,fx:t,fz:r,rx:i,rz:a,x:0,z:0,cfg:e,wob:0})}}this.special===`pumpkins`?[[.4,.34,.1],[.5,.25,-.25],[.58,.3,.15]].forEach(([e,t,n])=>{this.props.push({group:wh(t),fx:e,dz:n,r:t+.2,kind:`pumpkin`})}):this.special===`fir`?this.props.push({group:Th(),fx:.5,dz:0,r:.65,kind:`fir`}):this.special===`balloons`&&[16739179,16765503,9426687,12819455,8311663].forEach((e,t)=>{let n=.36+t*.07;this.props.push({group:Eh(e,.85+t%3*.22),fx:n,dz:t%2*.3-.1,r:.3,kind:`balloon`,color:e,bob:t*1.3,gone:0})});for(let e of this.props)e.group.userData.pop=0,this.root.add(e.group);this._bounds=null}layout(){let e=this.stage.bounds;if(e===this._bounds)return;this._bounds=e;let t=e.maxX-e.minX,n=e.maxZ-e.minZ;for(let r of this.patches)r.x=e.minX+t*r.fx,r.z=e.minZ+n*r.fz,r.group.position.set(r.x,0,r.z);this.propScale=Math.max(.6,Math.min(1,t/6));for(let n of this.props)n.x=e.minX+t*.5+(n.fx-.5)*6*this.propScale,n.z=e.minZ-.15+n.dz*this.propScale,n.group.position.set(n.x,0,n.z);if(this.fall)for(let e of this.fall.data)e.fresh=!0}obstacles(){return this.props.filter(e=>e.kind!==`balloon`).map(e=>({x:e.x,z:e.z,r:e.r+.35}))}apply(){let e=this.stage,t=e.mode===`paint`,n=t?0:this.night,r=t?0:this.warm,i=t?null:ph[this.weather],a=i?this.tintAmount:0,o=this._c.set(uh);i&&o.lerp(this._c2.set(i.tint[0]),i.tint[1]*a),o.lerp(this._c2.set(dh),n),o.lerp(this._c2.set(fh),r*.55),e.renderer.setClearColor(o,+!t),this.floorColor=o.getHex()}update(e){this.checkT-=e,this.checkT<=0&&(this.checkT=2,this.read(),document.body.classList.toggle(`night`,this.night>.6),_d.drowsy=this.night),this.layout(),this.tintAmount=Math.min(1,this.tintAmount+e*.5),this.splashGate-=e;let t=this.stage.bounds,n=this.night;if(this.fall){let{mesh:n,data:r,cfg:i}=this.fall,a=t.minX-1.6,o=t.maxX-t.minX+3.2,s=t.minZ-3.4,c=t.maxZ-t.minZ+4.8;for(let t=0;t<r.length;t++){let l=r[t];(l.fresh||l.y<0)&&(l.x=a+Math.random()*o,l.z=s+Math.random()*c,l.y=l.fresh?Math.random()*hh:hh+Math.random(),l.fresh=!1),l.y-=l.v*e,l.ph+=e*1.6;let u=i.sway?Math.sin(l.ph)*i.sway:0;this._v.set(l.x+u,l.y,l.z),i.kind===`leaf`?this._q.setFromEuler(this._e.set(l.ph*l.spin*.6,l.ph*.9,Math.sin(l.ph)*1.1)):this._q.identity(),n.setMatrixAt(t,this._m.compose(this._v,this._q,this._s.set(1,1,1)))}n.instanceMatrix.needsUpdate=!0}for(let t of this.patches){t.wob=Math.max(0,t.wob-e*2.2);let r=1+Math.sin(t.wob*Math.PI*4)*.07*t.wob;t.group.scale.set(t.rx*r,1,t.rz*r),t.fill.material.color.set(t.cfg.fill).lerp(this._c2.set(dh),n*.55),t.rim.material.color.set(t.cfg.rim).lerp(this._c2.set(dh),n*.45)}for(let t of this.props)t.kind===`balloon`&&(t.bob+=e,t.gone>0&&(t.gone-=e,t.gone<=0&&(t.group.visible=!0,t.group.userData.pop=0)),t.group.rotation.z=Math.sin(t.bob*1.3)*.07),Ll(t.group,e,this.propScale||1);let r=n>.55&&this.weather!==`rain`&&this.weather!==`snow`?(n-.55)/.45:0;for(let n of this.fireflies){if(n.g.visible=r>0,!r)continue;n.a+=e*n.sp,n.b+=e*n.sp*.7;let i=t.minX+(t.maxX-t.minX)*n.fx+Math.sin(n.a)*.9,a=t.minZ-1+(t.maxZ-t.minZ+1.5)*n.fz+Math.cos(n.b)*.7;n.g.position.set(i,n.h+Math.sin(n.a*1.7)*.25,a);let o=(.5+.5*Math.sin(n.a*3.1+n.b))**2;n.core.material.opacity=r*(.35+.65*o),n.halo.material.opacity=r*.28*o}this.runErrands(e)}runErrands(e){if(!this.patches.length)return;for(let t=this.errands.length-1;t>=0;t--){let n=this.errands[t];n.t-=e;let r=n.c,i=r.state===`gone`||r.state===`transit`||r.state===`paint`||r.state===`leave`;n.t<=0||i?this.errands.splice(t,1):r.state===`idle`&&Math.hypot(r.root.position.x-n.x,r.root.position.z-n.z)<.35&&(r.hop(),this.errands.splice(t,1))}if(this.errandT-=e,this.errandT>0)return;this.errandT=6+Math.random()*7;let t=this.creatures().filter(e=>e.state===`idle`&&!e.reaction&&!this.errands.some(t=>t.c===e));if(!t.length)return;let n=t[Math.floor(Math.random()*t.length)],r=this.patches[Math.floor(Math.random()*this.patches.length)];n.walkTo(r.x,r.z),this.errands.push({c:n,x:n.target.x,z:n.target.z,t:14})}patchAt(e,t){return this.patches.find(n=>((e-n.x)/n.rx)**2+((t-n.z)/n.rz)**2<1)||null}splash(e,t,n,r){e.wob=1;let i=this.splashGate>0;i||(this.splashGate=.12),this.fx(r?`puddleTap`:`puddleStep`,this._v.set(t,.05,n),{silent:i})}stepAt(e){let t=e.root.position,n=this.patchAt(t.x,t.z);n&&this.splash(n,t.x,t.z,!1)}tap(e,t){let n=this.stage;for(let r of this.props){if(r.kind===`balloon`&&r.gone>0)continue;let i=r.kind===`balloon`?r.group.userData.h:r.kind===`fir`?.9:.25,a=n.toScreen(this._v.set(r.x,i*(this.propScale||1),r.z)),o=n.toScreen(this._v.set(r.x+r.r,i*(this.propScale||1),r.z));if(Math.hypot(e-a.x,t-a.y)>Math.max(40,Math.abs(o.x-a.x)*1.2))continue;let s=this._v.set(r.x,i,r.z);return r.kind===`balloon`?(r.gone=5+Math.random()*4,r.group.visible=!1,this.fx(`balloon`,s,{color:`#${r.color.toString(16).padStart(6,`0`)}`})):(r.group.userData.boing=1,this.fx(r.kind===`fir`?`fir`:`pumpkin`,s),this.cheer?.()),!0}let r=n.groundPoint(e,t);if(r){let e=this.patchAt(r.x,r.z);e&&this.splash(e,r.x,r.z,!0)}return!1}};function wh(e){let t=new Sn,n=Al(16747039,e,e*.8,e);n.position.y=e*.78;let r=kl(Tl,7319119,.045,.14,.045);r.position.y=e*1.62,r.rotation.z=.25,t.add(n,r);for(let n of[-1,1]){let r=new Y(El,xl);r.scale.set(e*.16,e*.2,e*.05),r.position.set(n*e*.32,e*.95,e*.9),t.add(r)}let i=new Y(wl,xl);return i.scale.set(e*.36,e*.1,e*.05),i.position.set(0,e*.52,e*.93),t.add(i),t}function Th(){let e=new Sn,t=kl(Tl,11039551,.09,.3,.09);t.position.y=.15,e.add(t),[[.55,.62,.52],[.43,.55,.92],[.3,.5,1.28]].forEach(([t,n,r])=>{let i=kl(El,4169564,t,n,t);i.position.y=r,e.add(i)});let n=Al(16765503,.1,.1,.06);return n.position.y=1.62,e.add(n),[[.3,.42,.38,16739179],[-.28,.5,.36,9426687],[.05,.86,.36,16765503],[-.16,1.15,.22,12819455],[.2,1.1,.2,16748488]].forEach(([t,n,r,i])=>{let a=Al(i,.06,.06,.06,.012);a.position.set(t,n,r),e.add(a)}),e}function Eh(e,t){let n=new Sn,r=Al(e,.21,.26,.21);return r.position.y=t,n.add(r,jl(new G(0,0,0),new G(0,t-.26,0),.01)),n.userData.h=t,n}var Dh=[{key:`butterflies`,at:3},{key:`bee`,at:8},{key:`trampoline`,at:14}],Oh=new yi(1,12).rotateX(-Math.PI/2),kh=new wi(1,40,14),Ah=new yi(1,40).rotateX(-Math.PI/2),jh=.74,Mh=.38,Nh=.33,Ph=.4,Fh=9,Ih=[.35,.65,1,1,.7,.4,.18],Lh=3,Rh=1.5,zh=2.3,Bh=6,Vh=.45,Hh=.09,Uh=(e,t)=>e+Math.random()*(t-e),Wh=e=>e*e*(3-2*e),Gh=e=>`#${e.toString(16).padStart(6,`0`)}`;function Kh(e,t,n=null){let r=new Sn,i=new Fr({color:e,side:2}),a=new Fr({color:xl.color,side:2}),o=[];for(let e of[-1,1]){let n=new Sn,s=new Y(Oh,a);s.scale.set(t*1.16,1,t*.98),s.position.set(e*t*.95,-.004,0);let c=new Y(Oh,i);c.scale.set(t,1,t*.82),c.position.set(e*t*.95,0,0),n.add(s,c),r.add(n),o.push(n)}if(n===null){let e=new Y(wl,xl);e.scale.set(t*.22,t*.22,t*.75),r.add(e)}else{let e=Al(n,t*.62,t*.55,t*.8,.012);r.add(e);for(let e of[-.22,.2]){let n=new Y(wl,xl);n.scale.set(t*.66,t*.59,t*.13),n.position.z=e*t,r.add(n)}for(let e of o)e.position.y=t*.45}return{g:r,wings:o,wingMat:i}}var qh=class{constructor({stage:e,garden:t,creatures:n,fx:r,cheer:i,onChange:a}){this.stage=e,this.garden=t,this.creatures=n,this.fx=r,this.cheer=i,this.onChange=a,this.root=new Sn,e.scene.add(this.root),this.seen=new Set,this.queue=[],this.queueT=0,this.built=new Set,this.butterflies=[],this.bee=null,this.tramp=null,this.errands=[],this.chaseT=Uh(6,10),this.buzzGate=0,this.hide=0,this._bounds=null,this._v=new G,this._v2=new G}serialize(){return{seen:[...this.seen]}}restore(e){let t=new Set(Dh.map(e=>e.key));this.seen=new Set((Array.isArray(e?.seen)?e.seen:[]).filter(e=>t.has(e)))}has(e){return this.built.has(e)}sync(){let e=this.garden.count;for(let t of Dh)e<t.at||this.built.has(t.key)||this.queue.includes(t.key)||(this.seen.has(t.key)?this.build(t.key,!1):this.queue.push(t.key));if(this.built.has(`butterflies`)){let t=Math.min(7,2+Math.floor((e-Dh[0].at)/5));for(;this.butterflies.length<t;)this.addButterfly(!0)}}build(e,t){if(this.built.add(e),e===`butterflies`)this.addButterfly(t),this.addButterfly(t);else if(e===`bee`)this.addBee(t);else if(e===`trampoline`)this.buildTrampoline();else return;this._bounds=null,this.layout();let n=e===`trampoline`?this.tramp:null;n&&(n.group.userData.pop=+!t),t&&(this.seen.add(e),this.onChange?.(),n?(this.fx(`arrival`,this._v.set(n.x,.5,n.z)),n.rideT=2.5):this.fx(`arrivalFlyers`,this._v.set(0,0,0)),this.cheer())}edgePoint(e){let t=this.stage.bounds,n=Math.random()<.5;return e.set(n?t.minX-2.5:t.maxX+2.5,0,Uh(t.minZ,t.maxZ))}flowerPoint(e){if(this.garden.randomSpot(e))return e;let t=this.stage.bounds;return e.set(Uh(t.minX,t.maxX),0,Uh(t.minZ,t.maxZ))}addButterfly(e){let t=Rl[this.butterflies.length%Rl.length],n=Kh(t,.12);this.root.add(n.g);let r=e?this.edgePoint(this._v):this.flowerPoint(this._v),i={...n,kind:`butterfly`,color:t,x:r.x,y:.7,z:r.z,tx:0,tz:0,perch:0,ph:Uh(0,6),speed:Uh(1.1,1.5),hurry:0};this.retarget(i),this.butterflies.push(i)}addBee(e){let t=Kh(16777215,.085,16765503);this.root.add(t.g);let n=e?this.edgePoint(this._v):this.flowerPoint(this._v);this.bee={...t,kind:`bee`,color:16765503,x:n.x,y:.8,z:n.z,tx:0,tz:0,perch:0,ph:0,speed:2.3,hurry:0},this.retarget(this.bee)}retarget(e,t=!1){let n=null,r=-1;for(let i=0;i<(t?6:1);i++){let t=this.flowerPoint(this._v2),i=Math.hypot(t.x-e.x,t.z-e.z);i>r&&(r=i,n={x:t.x,z:t.z})}e.tx=n.x,e.tz=n.z,e.perch=0}scare(e){this.retarget(e,!0),e.hurry=1.4}moveFlyer(e,t){e.ph+=t,e.hurry=Math.max(0,e.hurry-t);let n=e.tx-e.x,r=e.tz-e.z,i=Math.hypot(n,r),a=e.kind===`bee`,o;if(e.perch>0)e.perch-=t,e.y+=((a?.5:.36)-e.y)*Math.min(1,t*5),o=a?Math.abs(Math.sin(e.ph*40)):.25+.55*Math.abs(Math.sin(e.ph*2.2)),e.perch<=0&&(this.retarget(e),a&&this.buzz(e));else if(i<.12)e.perch=a?Uh(1,2.2):Uh(2,5),o=.5;else{let s=e.speed*(e.hurry>0?2.4:1),c=Math.min(i,s*t),l=Math.sin(e.ph*(a?9:4.5))*(a?.5:.8)*Math.min(1,i);e.x+=n/i*c+-r/i*l*t,e.z+=r/i*c+n/i*l*t,e.y+=((a?.75:.7)+Math.sin(e.ph*3)*.14-e.y)*Math.min(1,t*4),e.g.rotation.y=Math.atan2(n,r),o=Math.abs(Math.sin(e.ph*(a?40:13)))}e.g.position.set(e.x,e.y,e.z);let s=.15+o*(a?.9:1.1);e.wings[0].rotation.z=-s,e.wings[1].rotation.z=s;let c=Math.max(.001,1-this.hide);e.g.scale.setScalar(c),e.g.visible=this.hide<.99}buzz(e){this.buzzGate>0||this.hide>.5||(this.buzzGate=2.5,this.fx(`beeLeave`,this._v.set(e.x,e.y,e.z)))}buildTrampoline(){let e=new Sn;for(let[t,n]of[[-.5,-.34],[.5,-.34],[-.5,.34],[.5,.34]]){let r=kl(kh,15922424,.075,.15,.075);r.position.set(t,.14,n),e.add(r)}let t=kl(kh,9426687,jh,.075,jh,.025);t.position.y=.27;let n=kl(kh,7041936,.56,.05,.56);n.position.y=Nh;let r=new Y(Ah,new Fr({color:5528437}));r.position.y=.388,r.visible=!1,e.add(t,n,r),this.root.add(e),this.tramp={group:e,mat:n,dent:r,x:0,z:0,k:1,room:5,waitX:0,waitZ:0,rider:null,phase:null,i:0,u:0,peak:.5,spin:!1,superNext:!1,supers:0,from:null,rideT:Uh(8,14),dentV:0,squash:0,gate:0}}layout(){let e=this.stage.bounds;if(e===this._bounds)return;this._bounds=e;let t=e.maxX-e.minX,n=e.maxZ-e.minZ;if(this.tramp){let r=this.tramp;r.k=Math.max(.75,Math.min(1,t/6)),r.x=e.minX-.15,r.z=e.minZ+n*.45,r.group.position.set(r.x,0,r.z),r.waitX=Math.min(e.maxX,r.x+jh*r.k+.75),r.waitZ=r.z+.1,this.measureRoom()}}measureRoom(){let e=this.tramp,t=this.stage.toScreen(this._v.set(e.x,0,e.z)),n=this.stage.toScreen(this._v.set(e.x,1,e.z)),r=t.y-n.y;e.room=r>1?t.y/r:5}headroom(e){let t=this.tramp;return Math.max(.25,t.room-.15-Mh*t.k-e.dims.height)}obstacles(){let e=[];return this.tramp&&e.push({x:this.tramp.x,z:this.tramp.z,r:jh*this.tramp.k}),e}callRider(e){let t=this.tramp;!e||t.rider||this.errands.some(e=>e.kind===`tramp`)||(e.walkTo(t.waitX,t.waitZ),this.errands.push({c:e,kind:`tramp`,x:e.target.x,z:e.target.z,t:18}))}mount(e){let t=this.tramp;t.rider||e.state!==`idle`||Math.hypot(e.root.position.x-t.x,e.root.position.z-t.z)>2.4||(this.measureRoom(),e.hopT=0,e.beginTransit(),e.heading=e.targetHeading=Math.PI,e.root.rotation.y=Math.PI,e.shadow.visible=!1,t.from={x:e.root.position.x,z:e.root.position.z},e.stagePose={x:t.from.x,z:t.from.z,heading:Math.PI},t.rider=e,t.phase=`on`,t.u=0,t.i=0,t.supers=0,t.superNext=!1,e.say(!0,1.2))}release(){let e=this.tramp,t=e.rider;if(e.rider=null,e.phase=null,e.superNext=!1,e.dent.visible=!1,t){t.shadow.visible=!0,t.stagePose=null,t.root.rotation.set(0,t.heading,0);for(let e of t.legs)e.rotation.x=0}}dismount(){let e=this.tramp,t=e.rider,n=t&&t.state===`transit`;if(this.release(),e.rideT=Uh(14,24),!n)return;let r=this.stage.bounds;t.root.position.set(Math.min(r.maxX,Math.max(r.minX,e.from.x)),0,Math.min(r.maxZ,Math.max(r.minZ,e.from.z))),t.setLift(0),t.land(),t.enterIdle(),t.say(!0,1.15)}contact(e){let t=this.tramp;t.dentV=1,t.squash=1,t.group.userData.boing=.35+.4*e,!(t.superNext&&t.supers<Bh)&&t.gate<=0&&(t.gate=.22,this.fx(`trampContact`,this._v.set(t.x,Mh*t.k,t.z),{gain:.45+.25*e,pitch:.9+.3*e}))}nextBounce(){let e=this.tramp,t=e.rider,n=this.headroom(t);e.superNext&&e.supers<Bh?(e.superNext=!1,e.supers++,e.i=Lh,e.peak=Math.min(zh,n),e.spin=!0,t.say(!0,1.25),this.fx(`trampSuper`,this._v.set(e.x,Mh*e.k,e.z))):(e.superNext=!1,e.peak=Math.max(.12,Ih[e.i]*Math.min(Rh,n)),e.spin=e.i===Lh),e.phase=`bounce`,e.u=0}updateTrampoline(e,t){let n=this.tramp;n.gate-=e,n.dentV=Math.max(0,n.dentV-e*5),n.squash=Math.max(0,n.squash-e*6),Ll(n.group,e,n.k),n.rider&&n.rider.state!==`transit`&&this.release();let r=n.rider;if(!r){n.dent.visible=n.dentV>.02;let r=Ph*(.6+.4*n.dentV);n.dent.scale.set(r,1,r),n.mat.position.y=Nh-.03*n.dentV,n.rideT-=e,n.rideT<=0&&t.night<.6&&(n.rideT=Uh(14,24),this.callRider(this.freeCreature()));return}let i=Mh*n.k,a=0,o=0,s=n.x,c=n.z;if(n.phase===`on`||n.phase===`off`){n.u=Math.min(1,n.u+e/Vh);let t=Wh(n.phase===`on`?n.u:1-n.u);s=n.from.x+(n.x-n.from.x)*t,c=n.from.z+(n.z-n.from.z)*t;let a=Math.sin(Math.PI*n.u)*.45;r.root.position.set(s,0,c),r.setLift(i*t+a),o=Math.sin(Math.PI*n.u)*.6;for(let e of r.legs)e.rotation.x=o;n.dent.visible=!1,n.u>=1&&(n.phase===`off`?this.dismount():(this.contact(.3),n.phase=`dwell`,n.u=0));return}if(n.phase===`dwell`)n.u+=e/Hh,n.u>=1&&(n.i>=Ih.length&&!n.superNext?(n.phase=`off`,n.u=0):this.nextBounce());else{let t=2*Math.sqrt(2*n.peak/Fh);if(n.u+=e/t,n.u>=1){let e=Math.min(1,n.peak/Rh);n.i++,n.phase=`dwell`,n.u=0,r.root.rotation.y=Math.PI,this.contact(e)}else a=4*n.peak*n.u*(1-n.u),o=Math.sin(Math.PI*n.u),n.spin&&(r.root.rotation.y=Math.PI+Math.PI*2*Wh(n.u))}r.root.position.set(s,0,c),r.setLift(i+a-.03*n.dentV*n.k);for(let e of r.legs)e.rotation.x=o;let l=Math.sin(Math.PI*n.squash);r.torso.scale.set(1+.18*l,1-.22*l,1+.18*l),n.mat.position.y=Nh-.03*n.dentV;let u=Ph*Math.max(.45,1-a/zh*.5)*(1+.15*n.dentV);n.dent.visible=!0,n.dent.scale.set(u,1,u)}update(e,t){this.sync(),this.layout(),this.buzzGate-=e,this.queue.length&&t.awake&&(this.queueT-=e,this.queueT<=0&&(this.build(this.queue.shift(),!0),this.queueT=1.6));let n=t.night>.6||t.weather===`rain`||t.weather===`snow`;this.hide+=(+!!n-this.hide)*Math.min(1,e*1.5);for(let t of this.butterflies)this.moveFlyer(t,e);this.bee&&this.moveFlyer(this.bee,e);let r=this.hide<.5;if(this.bee&&r){let t=this.bee;for(let e of this.creatures())(e.state===`idle`||e.state===`wander`)&&t.hurry<=0&&Math.hypot(e.root.position.x-t.x,e.root.position.z-t.z)<.85&&(this.scare(t),this.buzz(t));if(this.chaseT-=e,this.chaseT<=0){this.chaseT=Uh(9,15);let e=this.nearestFree(t.x,t.z,5);e&&(e.gazeAt(t.x,t.z,.8),e.walkTo(t.x,t.z+.2))}}this.tramp&&this.updateTrampoline(e,t);for(let t=this.errands.length-1;t>=0;t--){let n=this.errands[t],r=n.c;n.t-=e,n.t<=0||r.state!==`idle`&&r.state!==`wander`?this.errands.splice(t,1):r.state===`idle`&&Math.hypot(r.root.position.x-n.x,r.root.position.z-n.z)<.35&&(this.errands.splice(t,1),n.kind===`tramp`&&this.mount(r))}}freeCreature(){let e=this.creatures().filter(e=>e.state===`idle`&&!e.reaction&&!this.errands.some(t=>t.c===e));return e.length?e[Math.floor(Math.random()*e.length)]:null}nearestFree(e,t,n){let r=null,i=n;for(let n of this.creatures()){if(n.state!==`idle`&&n.state!==`wander`||n.reaction||this.errands.some(e=>e.c===n))continue;let a=Math.hypot(n.root.position.x-e,n.root.position.z-t);a<i&&(i=a,r=n)}return r}tap(e,t){let n=this.stage,r=(r,i,a)=>{let o=n.toScreen(this._v.set(r,i,a));return Math.hypot(e-o.x,t-o.y)};if(this.hide<.5){for(let e of this.bee?[...this.butterflies,this.bee]:this.butterflies)if(!(r(e.x,e.y,e.z)>=34))return this.scare(e),this.fx(e.kind===`bee`?`bee`:`butterfly`,this._v.set(e.x,e.y,e.z),{color:Gh(e.color)}),!0}if(this.tramp){let i=this.tramp,a=Mh*i.k,o=i.rider,s=n.toScreen(this._v.set(i.x+jh*i.k,a,i.z)),c=n.toScreen(this._v.set(i.x,a,i.z)),l=Math.hypot(e-c.x,t-c.y)<Math.max(56,Math.abs(s.x-c.x)*1.15),u=o&&r(i.x,o.root.position.y+o.dims.height/2,i.z)<64;if(l||u)return o&&(i.phase===`bounce`||i.phase===`dwell`)?i.supers<Bh&&(i.superNext=!0):o||(i.dentV=1,i.group.userData.boing=.6,this.fx(`trampTap`,this._v.set(i.x,a,i.z),{gain:.7}),this.callRider(this.nearestFree(i.waitX,i.waitZ,99))),!0}return!1}},Jh={puddleTap:{label:`Puddle, tapped`,when:`Tap a rain puddle`,sound:`splash`,big:!0,bursts:[[`drop`,`#8ec3ee`,9]]},puddleStep:{label:`Puddle, stepped in`,when:`A creature walks or hops in a puddle`,sound:`splash`,big:!1,bursts:[[`drop`,`#8ec3ee`,5]]},butterfly:{label:`Butterfly`,when:`Tap a butterfly: it darts away`,sound:`pop`,bursts:[[`spark`,null,8]]},bee:{label:`Bee, tapped`,when:`Tap the bee`,sound:`buzz`,bursts:[[`spark`,`#ffd23f`,8]]},beeLeave:{label:`Bee, setting off`,when:`The bee leaves a flower, or a creature gets close`,sound:`buzz`,bursts:[]},balloon:{label:`Balloon`,when:`Birthday: tap a balloon, it pops and comes back`,sound:`pop`,bursts:[[`spark`,null,14],[`smoke`,`#ffffff`,5]]},pumpkin:{label:`Pumpkin`,when:`Halloween week: tap a pumpkin, everyone hops`,sound:`boing`,bursts:[[`spark`,`#ff8a1f`,12]]},fir:{label:`Fir tree`,when:`Christmas: tap the fir, everyone hops`,sound:`sleigh`,bursts:[[`spark`,`#ffd23f`,12]]},arrival:{label:`Something new arrives`,when:`The garden earns the trampoline`,sound:`jingle`,bursts:[[`smoke`,`#ffffff`,12],[`spark`,`#ffd23f`,10]]},arrivalFlyers:{label:`Flyers arrive`,when:`The garden earns butterflies or the bee`,sound:`jingle`,bursts:[]},trampContact:{label:`Trampoline, a bounce`,when:`A creature lands on the mat (quieter for small bounces)`,sound:`boing`,bursts:[]},trampTap:{label:`Trampoline, tapped`,when:`Tap the empty trampoline: a creature comes over`,sound:`boing`,bursts:[[`spark`,`#8fd6ff`,4]]},trampSuper:{label:`Trampoline, big bounce`,when:`Tap it while a creature rides: an extra-high jump`,sound:`boingBig`,bursts:[[`spark`,`#ffd23f`,6]]},pluckPoof:{label:`Flower leaves the head`,when:`Tap a flower on a creature`,sound:null,bursts:[[`smoke`,`#c9c9c9`,12]]},plant:{label:`Flower planted`,when:`The flower pops up behind the creature`,sound:`arpeggio`,bursts:[[`smoke`,`#c9c9c9`,8],[`spark`,null,16]]},consolation:{label:`Flower, all stickers owned`,when:`A flower planted once every sticker is collected`,sound:`pop`,bursts:[[`spark`,`#ffd23f`,10]]}},Yh=.55,Xh=.35,Zh=5,Qh=2.5,$h=.45,eg=.46,tg=`#ffd23f`,ng=[`#ff7ab6`,`#ffd23f`,`#ff6b6b`,`#8fd6ff`,`#c39bff`,`#ffa53a`],rg=[[0,1.1,1.1],[.25,1.28,.74],[.55,.92,1.1],[.8,1.04,.97],[1,1,1]],ig=(e,t,n)=>Math.max(t,Math.min(n,e)),ag=e=>1-(1-e)**3,og=e=>e*e*e,sg=class{constructor({particles:e,stage:t,music:n,onLand:r,onCollect:i}){this.particles=e,this.stage=t,this.music=n,this.onLand=r,this.onCollect=i,this.queue=[],this.cur=null,this.phase=null,this.t=0,this.wobble=0,this.sparkT=0,this.trailT=0;let a=this.root=document.createElement(`div`);a.id=`showcase`,a.hidden=!0,a.innerHTML=`<div class="sc-veil"></div><div class="sc-rays"><div class="sc-rays-spin"></div></div><div class="sc-pos"><div class="sc-bob"></div></div>`,document.body.appendChild(a),this.pos=a.querySelector(`.sc-pos`),this.bob=a.querySelector(`.sc-bob`),a.addEventListener(`pointerdown`,e=>{if(e.preventDefault(),e.stopPropagation(),this.phase!==`wait`)return;let t=this.centre();Math.hypot(e.clientX-t.x,e.clientY-t.y)<=Math.max(95,this.size*.7)?this.collect():this.wobble=1})}get active(){return this.phase!==null&&this.phase!==`delay`}centre(){return{x:window.innerWidth/2,y:window.innerHeight*eg}}show(e,t,n=null,r=.5){this.queue.push({def:e,world:{x:t.x,y:t.y,z:t.z},star:n,delay:r})}cancel(){this.queue.length=0,this.end(!0)}begin(e){this.cur=e,this.phase=`delay`,this.t=0}startFly(){let e=this.cur,t=window.innerWidth,n=window.innerHeight;this.size=ig(.42*Math.min(t,n),150,300);let r=this.stage.toScreen(e.world),i=this.centre();this.from={x:r.x-i.x,y:r.y-i.y},this.root.style.setProperty(`--size`,`${this.size.toFixed(0)}px`),this.root.style.setProperty(`--rays`,`${(this.size*2.6).toFixed(0)}px`),this.bob.replaceChildren(qf(e.def,384)),this.root.hidden=!1,this.root.classList.remove(`rays`,`wait`),this.root.offsetWidth,this.root.classList.add(`on`),this.phase=`fly`,this.t=0,this.place(this.from.x,this.from.y,.12,.12,-30),this.music.rise(this.stage.panFor(e.world))}place(e,t,n,r,i){this.pos.style.transform=`translate(${e.toFixed(1)}px, ${t.toFixed(1)}px) rotate(${i.toFixed(1)}deg) scale(${n.toFixed(3)}, ${r.toFixed(3)})`}collect(){if(this.phase!==`wait`)return;let e=this.centre();this.root.classList.remove(`rays`,`wait`),this.particles.emit(e.x,e.y,`spark`,tg,16),this.particles.emit(e.x,e.y,`spark`,this.cur.def.colors?.[0]||tg,8),this.music.collect(.5),this.phase=`zip`,this.t=0,this.trailT=0,this.queue.length||this.root.classList.remove(`on`),this.onCollect?.()}end(e=!1){if(this.cur&&!e){let e=window.innerWidth,t=window.innerHeight;this.particles.emit(e-this.size*.3,t-this.size*.3,`spark`,tg,8)}this.cur=null,this.phase=null,this.bob.replaceChildren(),(!this.queue.length||e)&&(this.root.classList.remove(`on`,`rays`,`wait`),this.root.hidden=!0)}update(e){if(!this.cur){if(!this.queue.length)return;this.begin(this.queue.shift())}this.t+=e;let t=this.centre();if(this.phase===`delay`){this.t>=this.cur.delay&&this.startFly();return}if(this.phase===`fly`){let e=Math.min(1,this.t/Yh),n=ag(e),r=.12+(1.1-.12)*n,i=Math.sin(Math.PI*e)*this.size*.35;if(this.place(this.from.x*(1-n),this.from.y*(1-n)-i,r,r,-30*(1-n)),e>=1){this.phase=`land`,this.t=0,this.root.classList.add(`rays`);for(let e=0;e<28;e++)this.particles.emit(t.x,t.y,`confetti`,ng[e%ng.length],1);this.music.fanfare(0),this.onLand?.(this.cur.star)}return}if(this.phase===`land`){let e=Math.min(1,this.t/Xh),t=1;for(;t<rg.length-1&&rg[t][0]<e;)t++;let n=rg[t-1],r=rg[t],i=(e-n[0])/(r[0]-n[0]);this.place(0,0,n[1]+(r[1]-n[1])*i,n[2]+(r[2]-n[2])*i,0),e>=1&&(this.phase=`wait`,this.t=0,this.sparkT=.6,this.root.classList.add(`wait`));return}if(this.phase===`wait`){this.wobble=Math.max(0,this.wobble-e*2.2);let n=Math.sin(this.wobble*Math.PI*4)*this.wobble;if(this.place(0,0,1+.06*Math.abs(n),1-.04*Math.abs(n),n*11),this.sparkT-=e,this.sparkT<=0){this.sparkT=1.2;for(let e=0;e<2;e++){let e=Math.random()*Math.PI*2;this.particles.emit(t.x+Math.cos(e)*this.size*.5,t.y+Math.sin(e)*this.size*.5,`spark`,tg,1)}}this.t>=(this.queue.length?Qh:Zh)&&this.collect();return}if(this.phase===`zip`){let n=Math.min(1,this.t/$h),r=window.innerWidth-this.size*.3-t.x,i=window.innerHeight-this.size*.3-t.y,a=Math.min(1,n/.22),o=og(Math.max(0,(n-.22)/.78)),s=(1+.25*Math.sin(Math.PI*a/2))*(1-o)+.22*o;this.place(r*o,i*o,s,s,200*o),this.trailT-=e,o>0&&this.trailT<=0&&(this.trailT=.04,this.particles.emit(t.x+r*o,t.y+i*o,`spark`,tg,1)),n>=1&&this.end()}}},cg={threshold:14,jolts:3,window:800,cooldown:1500},lg=class{constructor(e,t={}){this.onShake=e,this.opts={...cg,...t},this.last=null,this.times=[],this.lastShake=-1/0,this.listening=!1,this.onMotion=this.onMotion.bind(this)}async requestPermission(){if(typeof DeviceMotionEvent>`u`)return!1;if(typeof DeviceMotionEvent.requestPermission!=`function`)return!0;try{return await DeviceMotionEvent.requestPermission()===`granted`}catch{return!1}}start(){this.listening||typeof window>`u`||(this.listening=!0,this.last=null,this.times=[],window.addEventListener(`devicemotion`,this.onMotion))}stop(){this.listening&&(this.listening=!1,window.removeEventListener(`devicemotion`,this.onMotion))}onMotion(e){let t=e.accelerationIncludingGravity;if(!t||t.x==null)return;let n=performance.now();this.last&&Math.hypot(t.x-this.last.x,t.y-this.last.y,t.z-this.last.z)>this.opts.threshold&&(this.times.push(n),this.times=this.times.filter(e=>n-e<this.opts.window),this.times.length>=this.opts.jolts&&n-this.lastShake>this.opts.cooldown&&(this.lastShake=n,this.times=[],this.onShake())),this.last={x:t.x,y:t.y,z:t.z}}},ug=`facepaint:v1`,dg=`facepaint`,fg=1,pg=`faces`;function mg(){try{let e=localStorage.getItem(ug);return e?JSON.parse(e):null}catch{return null}}function hg(e){try{localStorage.setItem(ug,JSON.stringify(e))}catch{}}var gg=null;function _g(){return gg||(gg=new Promise((e,t)=>{if(typeof indexedDB>`u`){t(Error(`IndexedDB unavailable`));return}let n=indexedDB.open(dg,fg);n.onupgradeneeded=()=>{n.result.objectStoreNames.contains(pg)||n.result.createObjectStore(pg)},n.onsuccess=()=>{let t=n.result;t.onclose=()=>{gg=null},e(t)},n.onerror=()=>t(n.error),n.onblocked=()=>t(Error(`IndexedDB blocked`))}),gg)}function vg(e,t){return yg(e,t).catch(()=>(gg=null,yg(e,t)))}function yg(e,t){return _g().then(n=>new Promise((r,i)=>{let a=n.transaction(pg,e),o=t(a.objectStore(pg));a.oncomplete=()=>r(o?o.result:void 0),a.onerror=()=>i(a.error),a.onabort=()=>i(a.error)}))}var bg=e=>String(e>>>0);function xg(){_g().catch(()=>{})}async function Sg(e,t){try{if(t.getContext(`2d`).isContextLost?.())return;let n=await new Promise(e=>t.toBlob(e,`image/png`));n&&await vg(`readwrite`,t=>t.put(n,bg(e)))}catch{}}async function Cg(e){try{let t=await vg(`readonly`,t=>t.get(bg(e)));return t?typeof createImageBitmap==`function`?await createImageBitmap(t):await Eg(t):null}catch{return null}}async function wg(e){try{await vg(`readwrite`,t=>t.delete(bg(e)))}catch{}}async function Tg(){try{localStorage.removeItem(ug)}catch{}try{await vg(`readwrite`,e=>e.clear())}catch{}}function Eg(e){return new Promise((t,n)=>{let r=URL.createObjectURL(e),i=new Image;i.onload=()=>{URL.revokeObjectURL(r),t(i)},i.onerror=()=>{URL.revokeObjectURL(r),n(Error(`face image failed to load`))},i.src=r})}var Dg=40;function Og(){let e=document.createElement(`pre`);e.id=`debug`,Object.assign(e.style,{position:`fixed`,left:`0`,right:`0`,bottom:`0`,maxHeight:`45vh`,overflow:`auto`,margin:`0`,padding:`10px 12px`,background:`rgba(190, 30, 30, 0.93)`,color:`#fff`,font:`12px/1.4 ui-monospace, Menlo, Consolas, monospace`,whiteSpace:`pre-wrap`,wordBreak:`break-word`,zIndex:`9999`,display:`none`}),e.addEventListener(`click`,()=>{e.style.display=`none`}),document.body.appendChild(e);let t=0,n=n=>{t===0&&(e.textContent=`${navigator.userAgent}\n\n`),!(t++>Dg)&&(e.textContent+=`${n}\n\n`,e.style.display=`block`)};window.addEventListener(`error`,e=>{let t=e.filename?`\n  at ${e.filename.replace(location.origin,``)}:${e.lineno}:${e.colno}`:``,r=e.error&&e.error.stack?`\n${e.error.stack.split(`
`).slice(0,5).join(`
`)}`:``;n(`[error] ${e.message}${t}${r}`)}),window.addEventListener(`unhandledrejection`,e=>{let t=e.reason;n(`[promise] ${t&&(t.stack||t.message)||String(t)}`)});let r=console.error;return console.error=(...e)=>{r.apply(console,e),n(`[console] ${e.map(e=>e&&e.stack||String(e)).join(` `)}`)},n}function kg(){return document.fullscreenElement||document.webkitFullscreenElement?!0:window.matchMedia(`(display-mode: fullscreen), (display-mode: standalone)`).matches}function Ag(){if(kg())return;let e=document.documentElement,t=e.requestFullscreen||e.webkitRequestFullscreen;if(typeof t==`function`)try{let n=t.call(e,{navigationUI:`hide`});n&&typeof n.catch==`function`&&n.catch(()=>{})}catch{}}var jg=1200,Mg=2400;function Ng(e){let t=document.getElementById(`splash`);return t?/[?&]nosplash\b/.test(location.search)?(t.remove(),Promise.resolve()):(e!=null&&t.style.setProperty(`--splash-bg`,`#${e.toString(16).padStart(6,`0`)}`),new Promise(e=>{let n=!1,r=0,i=()=>{n||(n=!0,clearTimeout(r),t.classList.add(`out`),setTimeout(()=>{t.remove(),e()},760))},a=()=>{t.classList.add(`in`),r=setTimeout(i,Mg),t.addEventListener(`pointerdown`,e=>{e.preventDefault(),i()})},o=document.fonts?.load?Promise.all([document.fonts.load(`800 1em 'Grandstander'`),document.fonts.load(`700 1em 'Nunito'`)]):Promise.resolve();Promise.race([o,new Promise(e=>setTimeout(e,jg))]).catch(()=>{}).then(a)})):Promise.resolve()}var Pg=`modulepreload`,Fg=function(e,t){return new URL(e,t).href},Ig={},Lg=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Fg(t,n),t=s(t),t in Ig)return;Ig[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Pg,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};/debug/.test(location.search)&&Og();{let e=/[?&]line=([^&]+)/.exec(location.search);if(e){let[t,n,r,i]=e[1].split(`,`).map(Number);Number.isFinite(t)&&(sl.value.y=t),n>0&&(sl.value.z=n),Number.isFinite(r)&&(sl.value.w=r),i>0&&(sl.value.x=i)}let t=/[?&]grain=([^&]+)/.exec(location.search);if(t){let[e,n,r,i]=t[1].split(`,`).map(Number);Number.isFinite(e)&&(cl.value.z=e),Number.isFinite(n)&&(cl.value.w=n),r>0&&(cl.value.x=r),i>0&&(cl.value.y=i)}}var Rg=document.getElementById(`stage`),zg=document.getElementById(`backdrop`),Bg=document.getElementById(`wake`),Vg=document.getElementById(`zzz`),Hg=document.getElementById(`paint-ui`),Ug=new Ad(Rg),Wg=/(^|[?&])reset(=|&|$)/.test(location.search);Wg&&Tg().finally(()=>location.replace(location.pathname));var Gg=/[?&]garden=(\d+)/.exec(location.search),Kg=/[?&]fx(=|&|$)/.test(location.search),qg=Wg||!!Gg||Kg,Jg=new Pd;Jg.loadVoiceIndex(`./voices/index.json`);for(let e of Object.values(wm))e.file&&Jg.preload(`sfx:${e.file}`,`./sfx/${e.file}`).catch(()=>{});var $=new rh({stage:Ug,audio:Jg,loadFace:Cg,saveFace:qg?null:Sg});$.onForget=e=>{qg||wg(e)},xg();var Yg=mg();$.restore(Yg)||$.add();var Xg=new lh(Ug);Xg.restore(Yg?.garden);var Zg=new Xf;Zg.restore(Yg?.stickers,Xg.count);var Qg=Gg?Math.min(240,Number(Gg[1])):-1;if(Qg>=0){let e=[16743094,16765503,16739179,9426687,12819455,16753978],t=e=>e-Math.floor(e);Xg.restore(Array.from({length:Qg},(n,r)=>({fx:.06+.88*t(.5+(r+1)*.7548776662),fz:.08+.84*t(.5+(r+1)*.569840291),color:e[r%e.length],s:(r+1)*2654435761})))}var $g=!0;$.onChange=()=>{$g=!0};function e_(){qg||($g=!1,hg({...$.serialize(),garden:Xg.serialize(),stickers:Zg.serialize(),life:__.serialize()}))}var t_=[];function n_(e,t){t_.push({t:e,fn:t})}setInterval(()=>{$g&&e_()},3e3),window.addEventListener(`pagehide`,e_);var r_=0,i_=Promise.resolve();function a_(){clearTimeout(r_),r_=0,!qg&&E_&&E_.painted&&(i_=Sg(E_.seed,E_.paintCanvas))}var o_=4e3,s_=0;function c_(){qg||(clearTimeout(r_),r_=0,i_.finally(()=>{$.reloadFaces(),g_.apply()}))}Rg.addEventListener(`webglcontextrestored`,c_),document.addEventListener(`visibilitychange`,()=>{document.hidden?(e_(),a_(),s_=performance.now()):s_&&performance.now()-s_>o_&&c_()});var l_=new fp({canvas:Rg,stage:Ug,backdrop:zg}),u_=new Vm(Jg);l_.onStrokeStart=(e,t)=>u_.strokeNote(e,t),l_.onStrokeNote=(e,t)=>u_.strokeNote(e,t),l_.onStrokeEnd=()=>{clearTimeout(r_),r_=setTimeout(a_,1200)};var d_=e=>(e/window.innerWidth*2-1)*.6,f_=new im({root:Hg,onFill:e=>{l_.setFill(e),u_.setRegisterValue(e.register)},onPour:(e,t,n)=>T_===`paint`&&(l_.hit(t,n)?(l_.fillAll(e),E_&&(E_.squash=1)):l_.fillBackdrop(e),u_.arpeggio(d_(t)),!0),onToolSelect:e=>l_.setTool(e),onToolStart:(e,t,n)=>{l_.setTool(e),l_.strokeStart(t,n)},onToolMove:(e,t)=>l_.strokeMove(e,t),onToolEnd:()=>l_.strokeEnd(),isOver:(e,t)=>!!l_.hit(e,t),onSticker:(e,t,n)=>{if(T_!==`paint`)return!1;let r=(Math.random()-.5)*.35,i=l_.hit(t,n);return i?(l_.stamp(i.x,i.y,e,r),E_&&(E_.squash=1,E_.say())):l_.stampBackdrop(t,n,e,r),u_.stamp(d_(t)),!0},onStickerTap:()=>u_.pop(.5),stickers:()=>Zg.deck(),onTick:(e,t)=>u_.tick(e,t),onLayout:e=>{Ug.setPaintInset(e),zg.hidden||l_.sizeBackdrop(!0)},onRope:e=>u_.tug(e===`colors`?-.6:.6),onBackPress:()=>u_.ratchet(0),onBack:()=>k_()}),p_=new mm({stage:Ug});function m_(e,t,n={}){let r=Jh[e];if(!r)return;let i=Ug.toScreen(t);for(let[e,t,a]of r.bursts)f_.particles.emit(i.x,i.y,e,t||n.color||`#ffd23f`,a);if(n.silent||!r.sound)return;let a=Ug.panFor(t);r.sound===`splash`?u_.splash(a,!!r.big):r.sound===`buzz`?u_.buzz(a):r.sound===`boing`?u_.boing(a,n.gain,n.pitch):r.sound===`boingBig`?u_.boingBig(a):r.sound===`sleigh`?u_.sleigh(a):r.sound===`pop`?u_.pop(a):r.sound===`arpeggio`?u_.arpeggio(a):u_.bloom(a)}var h_=()=>$.creatures,g_=new Ch({stage:Ug,creatures:h_,fx:m_,cheer:()=>$.hopAll()});g_.apply(),document.body.classList.toggle(`night`,g_.night>.6),Kg&&document.getElementById(`splash`)?.remove(),Ng(g_.floorColor);var __=new qh({stage:Ug,garden:Xg,creatures:h_,fx:m_,cheer:()=>$.hopAll(),onChange:()=>{$g=!0}});if(Qg>=0){let e=Dh.filter(e=>Qg>=e.at).map(e=>e.key);__.restore({seen:e.slice(0,-1)})}else __.restore(Yg?.life);$.obstacles=()=>[...g_.obstacles(),...__.obstacles()],$.onStep=e=>{T_===`stage`&&g_.stepAt(e)};var v_=new sg({particles:f_.particles,stage:Ug,music:u_,onLand:e=>$.cheer(e),onCollect:()=>$.hopAll()}),y_=56,b_=new Map;document.addEventListener(`pointerdown`,e=>{Jg.ctx&&Jg.ctx.state!==`running`&&Jg.ctx.resume().catch(()=>{}),f_.particles.tap(e.clientX,e.clientY),b_.set(e.pointerId,{x:e.clientX,y:e.clientY,travel:0})},{capture:!0,passive:!0}),document.addEventListener(`pointermove`,e=>{let t=b_.get(e.pointerId);t&&(t.travel+=Math.hypot(e.clientX-t.x,e.clientY-t.y),t.x=e.clientX,t.y=e.clientY,t.travel>=y_&&(t.travel=0,T_===`stage`&&f_.particles.trail(t.x,t.y)))},{capture:!0,passive:!0});for(let e of[`pointerup`,`pointercancel`])document.addEventListener(e,e=>b_.delete(e.pointerId),{capture:!0,passive:!0});var x_=new lg(()=>S_());function S_(){T_===`paint`?C_():T_===`stage`&&$.stumbleAll()}function C_(){T_===`paint`&&(f_.reroll(),u_.arpeggio())}function w_(e){zg.hidden=!e,e&&l_.clearBackdrop()}window.addEventListener(`resize`,()=>{zg.hidden||l_.sizeBackdrop(!0)});var T_=`stage`,E_=null;function D_(e){for(let t of $.creatures)t!==E_&&(t.root.visible=e);Xg.root.visible=e}function O_(e){T_===`stage`&&(e.storing&&(e.storing=!1,e.age=0,$.lastRefresh=0,$.forceNew=!1),R_(),v_.cancel(),T_=`toPaint`,E_=e,e.say(!0),l_.setCreature(e),e.setPaintLayer(1,!0),Ug.setPaintSubject(e.bodyDims),p_.toPaint(e,{onCut:()=>{D_(!1),w_(!0),u_.newScale(),f_.show(),l_.attach()},onDone:()=>{T_=`paint`}}))}function k_(){if(T_!==`paint`)return;T_=`toStage`;let e=E_;l_.detach(),f_.hide(),a_(),$g=!0,Zg.markSeen(),p_.toStage({onCut:()=>{D_(!0),w_(!1)},onDone:()=>{T_=`stage`,E_=null,e.setPaintLayer(1,!1),e.celebrate(),e.applyVisit(),$g=!0,n_(.7,()=>{(e.state===`idle`||e.state===`wander`)&&e.bloomIfGrown()&&u_.bloom(Ug.panFor(e.root.position))})}})}var A_=new G;function j_(e,t){for(let n of $.creatures){if(!H_.has(n.state)||n.sprout.stage<4)continue;let r=Ug.toScreen(n.sprout.flowerWorld(A_)),i=Ug.toScreen(A_.set(A_.x,A_.y+.28,A_.z)),a=Math.max(44,Math.hypot(i.x-r.x,i.y-r.y));if(Math.hypot(e-r.x,t-r.y)<=a)return n}return null}var M_=new G(0,1,0);function N_(e,t){return new G(0,0,-t).applyAxisAngle(M_,e.heading).add(e.root.position).setY(0)}var P_=[];function F_(e){if(P_.some(t=>t.c===e))return;e.reaction=null,e.pose=null,e.gazeAt(e.root.position.x,e.root.position.z+10,1.4),e.react(bd),e.say(!0),$.watch(e,bd.dur()+.2),m_(`pluckPoof`,e.sprout.flowerWorld(new G));let t=e.sprout.color;e.resetGrowth(!1),$g=!0,P_.push({c:e,color:t,t:0,eyes:!1,grunt:!1,planted:!1})}function I_(e,t){e.planted=!0;let n=N_(e.c,-.35),r=Ug.bounds;n.x=Math.min(r.maxX,Math.max(r.minX,n.x)),n.z=Math.min(r.maxZ,Math.max(r.minZ,n.z)),Xg.plantAt(n.x,n.z,e.color);let i=Zg.unlockNext();if(t){let t=new G(n.x,.35,n.z);i?v_.show(i,t,e.c):n_(.5,()=>m_(`consolation`,t))}t&&(m_(`plant`,new G(n.x,.25,n.z),{color:`#${e.color.toString(16).padStart(6,`0`)}`}),e.c.say(!0,1.3)),$g=!0}function L_(e){for(let t=P_.length-1;t>=0;t--){let n=P_[t],r=n.c;if(n.t+=e,!n.eyes&&n.t>=.35&&(n.eyes=!0,r.blink=1,r.blinkTimer=.9,r.featDirty=!0,r.say(!0,.85,2)),!n.planted&&n.t>=bd.release&&I_(n,!0),n.t>=bd.dur()&&(P_.splice(t,1),$.hopAll(r),r.state===`idle`||r.state===`wander`)){let e=N_(r,1.3);r.walkTo(e.x,e.z)}}}function R_(){for(let e of P_)e.planted||I_(e,!1),e.c.reaction=null,e.c.reactionName=null,e.c.pose=null;P_.length=0}var z_=null;Rg.addEventListener(`pointerdown`,e=>{if(T_===`paint`&&e.isPrimary&&z_===null){z_=e.pointerId;try{Rg.setPointerCapture(e.pointerId)}catch{}f_.summon(e.clientX,e.clientY)}}),Rg.addEventListener(`pointermove`,e=>{e.pointerId===z_&&f_.follow(e.clientX,e.clientY)});for(let e of[`pointerup`,`pointercancel`])Rg.addEventListener(e,e=>{e.pointerId===z_&&(z_=null,f_.release(e.clientX,e.clientY,e.type===`pointercancel`))});var B_=new G;function V_(e,t,n,r=1){let i=e.root.position,a=e.dims.height,o=Ug.toScreen(B_.set(i.x,a*.55,i.z)),s=Ug.toScreen(B_.set(i.x,a*1.2,i.z)),c=Math.max(48,Math.hypot(s.x-o.x,s.y-o.y))*r,l=Math.hypot(t-o.x,n-o.y);return l<=c?l:1/0}var H_=new Set([`idle`,`wander`,`enter`,`leave`]),U_=350,W_=60,G_=null,K_=null;function q_(e,t){let n=Ug.groundPoint(e.clientX,e.clientY);n&&$.gazeAt(n.x,n.z,t)}Rg.addEventListener(`pointerdown`,e=>{if(T_!==`stage`||!e.isPrimary)return;let t=j_(e.clientX,e.clientY);if(t){K_=null,F_(t);return}let n=null,r=1/0;for(let t of $.creatures){if(!H_.has(t.state))continue;let i=V_(t,e.clientX,e.clientY);i<r&&(r=i,n=t)}if(n){K_=null,O_(n);return}if(__.tap(e.clientX,e.clientY)||g_.tap(e.clientX,e.clientY)){K_=null;return}G_=e.pointerId;let i=performance.now();K_&&i-K_.t<U_&&Math.hypot(e.clientX-K_.x,e.clientY-K_.y)<W_?(K_=null,$.spinAll()):(K_={t:i,x:e.clientX,y:e.clientY},q_(e,1.6));try{Rg.setPointerCapture(e.pointerId)}catch{}}),Rg.addEventListener(`pointermove`,e=>{if(T_===`stage`&&e.isPrimary){if(e.pointerId===G_){q_(e,1);return}for(let t of $.creatures)H_.has(t.state)&&V_(t,e.clientX,e.clientY,1.8)<1/0&&t.noticePointer()}});for(let e of[`pointerup`,`pointercancel`])Rg.addEventListener(e,e=>{e.pointerId===G_&&(G_=null)});var J_=!1,Y_=new G;function X_(){let e=$.creatures[0];if(!e)return;let t=e.root.position,n=Ug.toScreen(Y_.set(t.x+e.R*.6,e.dims.height+.05,t.z));Vg.style.transform=`translate(${n.x.toFixed(1)}px, ${n.y.toFixed(1)}px)`}async function Z_(){if(J_)return;J_=!0,Bg.classList.add(`hidden`),Ag(),x_.requestPermission().then(()=>x_.start());let e=Jg.unlock().catch(e=>console.error(`audio unlock failed`,e));await Promise.race([e,new Promise(e=>setTimeout(e,1800))]);try{$.wakeAll()}catch(e){console.error(`wake failed`,e)}e.then(()=>u_.warmUp())}Bg.addEventListener(`click`,Z_),Kg&&(Bg.classList.add(`hidden`),Lg(()=>import(`./fx-yB9NYXyJ.js`).then(e=>e.mount({playFx:m_,music:u_,audio:Jg,particles:f_.particles,population:$,stage:Ug,showcase:v_,onWake:Z_})),[],import.meta.url)),document.addEventListener(`pointerup`,e=>{J_&&e.pointerType===`touch`&&Ag()});var Q_=new ya,$_=0;function ev(e){if(p_.update(e),$.update(e,E_,Ug.mode===`paint`),f_.update(e),g_.apply(),Ug.mode!==`paint`){L_(e),v_.update(e),Xg.update(e),g_.update(e),__.update(e,{night:g_.night,weather:g_.weather,awake:J_});for(let t=t_.length-1;t>=0;t--)t_[t].t-=e,t_[t].t<=0&&t_.splice(t,1)[0].fn()}Ug.render(),J_||X_()}function tv(){requestAnimationFrame(tv);try{Q_.update(),ev(Math.min(Q_.getDelta(),.05))}catch(e){$_++<5&&console.error(`frame error:`,e)}}tv(),`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`./sw.js`).catch(()=>{})});export{wm as a,Tm as i,Cm as n,Uf as o,Sm as r,Jh as t};