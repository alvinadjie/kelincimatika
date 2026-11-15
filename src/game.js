const M=DATA.meta,SPR={bunny:{},skel:{},golem:{},vamp:{}};
for(const [k,s,n,w,h] of [['bunny','idle',4,151,166],['bunny','atk',6,151,166],['bunny','hd',4,151,166],['skel','idle',4,159,166],['skel','atk',6,159,166],['skel','hd',4,159,166]])SPR[k][s]={n,w,h,ax:w/2,ay:h-4};
for(const k of ['bunny','skel'])for(const s of ['uch','uatk'])SPR[k][s]={...M[k+'_'+s]};
for(const k of ['golem','vamp'])for(const s of ['idle','atk','hd','uch','uatk'])SPR[k][s]={...M[k+'_'+s]};
for(const k in SPR)for(const s in SPR[k]){const im=new Image();im.src=DATA[k+'_'+s];SPR[k][s].img=im}
const ANIM={idle:{s:'idle',fps:6,loop:1},atk:{s:'atk',fps:9},hurt:{s:'hd',fps:5,n:3},die:{s:'hd',fps:4},uch:{s:'uch',fps:8},aura:{s:'uch',fps:8},uatk:{s:'uatk',fps:9}};
let cv=document.getElementById('c'),ctx=null;const GROUND=300,SC=1.4,TIME=20,EHP=3;
const mk=(key,x,flip)=>({key,x,flip,anim:'idle',t0:performance.now(),dx:0,alpha:1,cb:null});
const EN=[['skel','Kerangka',380,700],['golem','Golem',400,330],['vamp','Vampir',500,450]];
const bunny=mk('bunny',170,false),skel=mk('skel',550,true);
let floaters=[];
function play(ch,name,cb){ch.anim=name;ch.t0=performance.now();ch.cb=cb||null}
function drawCh(ch,now){
 const a=ANIM[ch.anim],sp=SPR[ch.key][a.s],n=ch.anim==='hurt'?(sp.hn||3):ch.anim==='die'?sp.n-(sp.ds||0):(a.n||sp.n),el=Math.max(0,(now-ch.t0)/1000*((ch.anim==='die'&&sp.dfps)||a.fps));let i=Math.floor(el);ch.dx=0;
 if(ch.anim==='aura'){const f=sp.af||sp.n>>1;i=f+i%(sp.n-f)}
 else if(a.loop)i%=n;
 else if(ch.anim==='die'){i=Math.min(i,n-1);if(el>=n+3&&ch.cb){const f=ch.cb;ch.cb=null;f()}}
 else if(i>=n){const f=ch.cb;ch.cb=null;ch.anim=ch.ult?'aura':'idle';ch.t0=now;i=0;f&&f()}
 else if(ch.anim==='atk'||ch.anim==='uatk')ch.dx=(ch.flip?-1:1)*Math.sin(Math.min(el/n,1)*Math.PI)*(ch.anim==='atk'?120:(sp.lunge||90));
 else if(ch.anim==='hurt')ch.dx=Math.sin(now/25)*5*(1-el/n);
 ch.dx+=(ch===skel?1:-1)*(ch.kb||0);
 const fi=i+(ch.anim==='die'?sp.ds||0:0);
 if(R3)R3.put(ch,sp,fi);else{ctx.save();if(ch.flash>0)ctx.filter='brightness(2.6)';ctx.globalAlpha=ch.alpha;ctx.translate(ch.x+ch.dx,GROUND);if(ch.flip)ctx.scale(-1,1);
 ctx.drawImage(sp.img,fi*sp.w,0,sp.w,sp.h,-sp.ax*SC,-sp.ay*SC,sp.w*SC,sp.h*SC);ctx.restore()}
}
function ultOn(ch){ch.ult=true;float('ULTIMATE!',ch.x,'#fbbf24');play(ch,'uch')}
function float(txt,x,col){floaters.push({txt,x,y:150,t:performance.now(),col})}
let last=performance.now();
const S={score:0,hearts:3,n:1,ehp:EHP,busy:true,tl:TIME,on:false,ans:0};
let R3=null;
(function(){try{
 if(typeof THREE==='undefined')return;
 const pr=document.createElement('canvas'),g0=pr.getContext('webgl')||pr.getContext('experimental-webgl');
 if(!g0)return;
 const need=Math.max(...Object.values(M).filter(m=>m&&m.n&&m.w).map(m=>m.n*m.w));
 if(need>g0.getParameter(g0.MAX_TEXTURE_SIZE))return;
 const W=720,H=320,scn=new THREE.Scene(),cam=new THREE.OrthographicCamera(-W/2,W/2,H/2,-H/2,.1,100);
 const mkTex=c=>{const t=new THREE.CanvasTexture(c);t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
 const cnv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
 let sd=11;const rr=()=>(sd=sd*16807%2147483647)/2147483647;
 const quad=(w,h,map,x,y,ro,o)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true,depthTest:false,depthWrite:false,...o}));m.position.set(x,y,0);m.renderOrder=ro;scn.add(m);return m};
 // ---- latar berlapis per level (hutan / gurun / kastil)
 const hills=(c,w,h,base,a1,a2,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=8)c.lineTo(x,base+Math.sin(x*.006+a1)*a2+Math.sin(x*.015+a1*2)*a2*.4);c.lineTo(w,h);c.fill()};
 const tree=(c,x,y,r)=>{c.fillStyle='#6b4a2b';c.fillRect(x-r*.12,y-r*.6,r*.24,r*.7);c.fillStyle='#3f8f55';c.beginPath();c.arc(x,y-r*.9,r,0,7);c.fill();c.fillStyle='#58ad6a';c.beginPath();c.arc(x-r*.3,y-r*1.1,r*.55,0,7);c.fill()};
 const mesa=(c,x,y,w,h,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y);c.lineTo(x+w*.12,y-h);c.lineTo(x+w*.88,y-h);c.lineTo(x+w,y);c.fill();c.fillStyle='rgba(0,0,0,.14)';c.fillRect(x+w*.58,y-h,w*.3,h)};
 const cactus=(c,x,y,s)=>{c.fillStyle='#4f8f4a';c.strokeStyle='#2f6a33';c.lineWidth=2;for(const [a,b,w,h] of [[-4,-46,8,46],[-18,-34,6,18],[-18,-34,18,6],[12,-28,6,16],[4,-28,14,6]]){c.fillRect(x+a*s,y+b*s,w*s,h*s);c.strokeRect(x+a*s,y+b*s,w*s,h*s)}};
 const dead=(c,x,y,s)=>{c.strokeStyle='#0d0818';c.lineCap='round';const br=(x0,y0,l,a,w,d)=>{if(d<0)return;const x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();br(x1,y1,l*.72,a-.5-rr()*.3,w*.65,d-1);br(x1,y1,l*.72,a+.5+rr()*.3,w*.65,d-1)};br(x,y,34*s,-Math.PI/2,6*s,4)};
 const castle=(c,x,y)=>{c.fillStyle='#140d24';c.fillRect(x,y-95,200,95);for(let i=0;i<9;i++)c.fillRect(x+i*24,y-105,14,10);for(const [tx,tw,th] of [[-18,40,125],[178,40,115],[70,60,160]]){c.fillRect(x+tx,y-th,tw,th);c.beginPath();c.moveTo(x+tx-6,y-th);c.lineTo(x+tx+tw/2,y-th-38);c.lineTo(x+tx+tw+6,y-th);c.fill()}c.fillStyle='#ffd45e';for(const [wx,wy] of [[88,-135],[96,-100],[20,-60],[150,-60],[-4,-90],[190,-80],[100,-40]])c.fillRect(x+wx,y+wy,6,10)};
 const ground=(a,b,fn)=>mkTex(cnv(900,150,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,w,h);fn(c,w,h)}));
 const blades=(col,mn,mx)=>mkTex(cnv(900,30,(c,w,h)=>{c.fillStyle=col;for(let x=0;x<w;x+=7){const t=mn+rr()*mx;c.beginPath();c.moveTo(x,h);c.lineTo(x+3,h-t);c.lineTo(x+6,h);c.fill()}}));
 const cloudT=fn=>mkTex(cnv(160,60,fn));
 const THM={
  skel:{sky:'linear-gradient(#6ec3f5,#d6f1ff)',tint:0xffffff,bats:0,
   far:()=>mkTex(cnv(1100,200,(c,w,h)=>{hills(c,w,h,70,1,24,'#a9d6e6');hills(c,w,h,95,3,18,'#8cc4d8')})),
   mid:()=>mkTex(cnv(1100,200,(c,w,h)=>{hills(c,w,h,120,2,18,'#6fb87a');for(let i=0;i<26;i++)tree(c,rr()*w,150+rr()*30,16+rr()*16)})),
   gnd:()=>ground('#7acb62','#4a9a3d',(c,w,h)=>{c.strokeStyle='#3f8a36';c.lineWidth=2;for(let i=0;i<260;i++){const x=rr()*w,y=rr()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+rr()*4-2,y-5-rr()*6);c.stroke()}}),
   fg:()=>blades('#2f7a35',6,8),
   cl:()=>cloudT(c=>{c.fillStyle='rgba(255,255,255,.9)';for(const [x,y,r] of [[50,36,22],[80,28,26],[112,36,20],[75,40,24]]){c.beginPath();c.arc(x,y,r,0,7);c.fill()}})},
  golem:{sky:'linear-gradient(#f2a64d,#fde2a8)',tint:0xfff1dc,bats:0,
   far:()=>mkTex(cnv(1100,200,(c,w,h)=>{const g=c.createRadialGradient(820,55,5,820,55,90);g.addColorStop(0,'rgba(255,250,210,1)');g.addColorStop(.25,'rgba(255,230,150,.8)');g.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g;c.fillRect(0,0,w,h);for(const [x,y,ww,hh,col] of [[60,140,150,60,'#d99a62'],[300,140,110,45,'#cf8f5a'],[520,145,190,70,'#d99a62'],[900,140,140,55,'#cf8f5a']])mesa(c,x,y,ww,hh,col);hills(c,w,h,130,2,10,'#e3b070')})),
   mid:()=>mkTex(cnv(1100,200,(c,w,h)=>{hills(c,w,h,125,2,14,'#e8b96b');hills(c,w,h,150,5,12,'#dba556');for(let i=0;i<8;i++)cactus(c,rr()*w,160+rr()*25,.7+rr()*.6)})),
   gnd:()=>ground('#efc57a','#d9a550',(c,w,h)=>{c.strokeStyle='rgba(170,120,55,.35)';c.lineWidth=2;for(let i=0;i<46;i++){c.beginPath();c.arc(rr()*w,rr()*h,10+rr()*26,.15,Math.PI-.15);c.stroke()}c.fillStyle='rgba(140,95,45,.5)';for(let i=0;i<50;i++){c.beginPath();c.ellipse(rr()*w,rr()*h,2+rr()*3,1.5+rr()*2,0,0,7);c.fill()}}),
   fg:()=>blades('#9a6a35',5,7),
   cl:()=>cloudT(c=>{c.fillStyle='rgba(255,255,255,.35)';for(const [x,y,r] of [[50,36,14],[82,32,18],[112,38,12]]){c.beginPath();c.ellipse(x,y,r*2,r*.6,0,0,7);c.fill()}})},
  vamp:{sky:'linear-gradient(#0c0720,#34204f)',tint:0xbfb2e6,bats:1,
   far:()=>mkTex(cnv(1100,200,(c,w,h)=>{for(let i=0;i<70;i++){c.fillStyle='rgba(255,255,255,'+(.3+rr()*.6)+')';c.fillRect(rr()*w,rr()*110,1.5,1.5)}const g=c.createRadialGradient(200,55,5,200,55,70);g.addColorStop(0,'rgba(255,255,240,1)');g.addColorStop(.35,'rgba(235,230,255,.9)');g.addColorStop(.4,'rgba(200,190,255,.25)');g.addColorStop(1,'rgba(150,130,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);hills(c,w,h,115,1,20,'#2c1f4a');hills(c,w,h,140,4,14,'#221840')})),
   mid:()=>mkTex(cnv(1100,200,(c,w,h)=>{hills(c,w,h,150,2,12,'#1a1230');castle(c,600,170);for(const x of [90,330,470,900,1010])dead(c,x,175,.9+rr()*.5)})),
   gnd:()=>ground('#34304a','#15131f',(c,w,h)=>{c.strokeStyle='rgba(130,120,175,.35)';c.lineWidth=1.5;for(let i=0;i<130;i++)c.strokeRect(rr()*w,rr()*h,20+rr()*22,10+rr()*7);const g=c.createLinearGradient(0,0,0,45);g.addColorStop(0,'rgba(160,120,210,.4)');g.addColorStop(1,'rgba(160,120,210,0)');c.fillStyle=g;c.fillRect(0,0,w,45)}),
   fg:()=>blades('#07050d',6,8),
   cl:()=>cloudT(c=>{c.fillStyle='#0b0714';c.beginPath();c.moveTo(80,32);c.quadraticCurveTo(60,10,28,22);c.quadraticCurveTo(44,26,48,40);c.quadraticCurveTo(62,32,80,42);c.quadraticCurveTo(98,32,112,40);c.quadraticCurveTo(116,26,132,22);c.quadraticCurveTo(100,10,80,32);c.fill()})}
 };
 const cache={},T=k=>cache[k]||(cache[k]=Object.fromEntries(['far','mid','gnd','fg','cl'].map(n=>[n,THM[k][n]()])));
 const t0=T('skel');
 const far=quad(1100,200,t0.far,360,200,0),mid=quad(1100,200,t0.mid,360,220,1),gnd=quad(900,150,t0.gnd,360,65,2),fg=quad(900,30,t0.fg,360,14,7);
 const clouds=[[100,280,1],[420,262,.8],[640,290,1.2]].map(([x,y,s])=>{const m=quad(160*s,60*s,t0.cl,x,y,.5);m.userData.s=8+s*4;m.userData.by=y;m.userData.sc=s;return m});
 const lay=[[far,.85],[mid,.6],[gnd,0],[fg,-.15]];lay.forEach(([m,f])=>{m.userData.bx=m.position.x;m.userData.f=f});
 let tint=0xffffff,bat=0,cur='skel',sw=null;
 const fadeP=quad(1200,700,null,360,160,13,{color:0x000000,opacity:0});
 const applyTheme=k=>{const t=T(k),h=THM[k];far.material.map=t.far;mid.material.map=t.mid;gnd.material.map=t.gnd;fg.material.map=t.fg;for(const m of clouds){m.material.map=t.cl;m.scale.setScalar(h.bats?.5:1);m.material.needsUpdate=true}[far,mid,gnd,fg].forEach(m=>m.material.needsUpdate=true);cv.style.background=h.sky;tint=h.tint;bat=h.bats};
 // ---- sprite karakter + bayangan
 const shT=mkTex(cnv(64,32,c=>{const g=c.createRadialGradient(32,16,0,32,16,30);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,64,32)}));
 const meshes=new Map(),texs=new Map();
 const chMesh=ch=>{let m=meshes.get(ch);if(!m){m=quad(1,1,null,0,0,ch.key==='bunny'?6:5,{side:THREE.DoubleSide});m.userData.sh=quad(1,1,shT,0,0,3);meshes.set(ch,m)}return m};
 const tex=sp=>{let t=texs.get(sp);if(!t){if(!(sp.img.complete&&sp.img.naturalWidth))return null;t=new THREE.Texture(sp.img);t.generateMipmaps=false;t.minFilter=t.magFilter=THREE.LinearFilter;t.needsUpdate=true;texs.set(sp,t)}return t};
 // ---- partikel
 const dotT=mkTex(cnv(64,64,c=>{const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,64,64)}));
 const pool=(n,size,grav)=>{const g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),col=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const p=new THREE.Points(g,new THREE.PointsMaterial({size,map:dotT,vertexColors:true,transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:false}));p.frustumCulled=false;p.renderOrder=8;scn.add(p);
  return {g,n,pos,col,i:0,grav,L:new Float32Array(n),M:new Float32Array(n),vx:new Float32Array(n),vy:new Float32Array(n),c:new Float32Array(n*3)}};
 const emit=(P,x,y,vx,vy,life,c)=>{const k=P.i++%P.n;P.pos[k*3]=x;P.pos[k*3+1]=y;P.pos[k*3+2]=1;P.vx[k]=vx;P.vy[k]=vy;P.L[k]=P.M[k]=life;P.c.set(c,k*3)};
 const step=(P,dt)=>{for(let k=0;k<P.n;k++){if(P.L[k]>0){P.L[k]-=dt;P.pos[k*3]+=P.vx[k]*dt;P.pos[k*3+1]+=P.vy[k]*dt;P.vy[k]-=P.grav*dt;const f=Math.max(0,P.L[k]/P.M[k]);for(let j=0;j<3;j++)P.col[k*3+j]=P.c[k*3+j]*f}else P.col[k*3]=P.col[k*3+1]=P.col[k*3+2]=0}P.g.attributes.position.needsUpdate=true;P.g.attributes.color.needsUpdate=true};
 const sparks=pool(300,7,260),glows=pool(60,26,-30),embers=pool(160,9,-40);
 const COL={bunny:[1,.6,.15],skel:[.7,.35,1],golem:[1,.55,.12],vamp:[.78,.25,.95]};
 const flash=quad(1200,700,null,360,160,11,{color:0xffffff,opacity:0,blending:THREE.AdditiveBlending});
 const star=quad(1,1,mkTex(cnv(128,128,c=>{c.translate(64,64);const g=c.createRadialGradient(0,0,0,0,0,40);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(-64,-64,128,128);c.fillStyle='#fff';for(let i=0;i<8;i++){c.rotate(Math.PI/4);const L=i%2?38:62;c.beginPath();c.moveTo(-4,0);c.lineTo(0,-L);c.lineTo(4,0);c.fill()}})),0,0,9,{blending:THREE.AdditiveBlending,opacity:0});star.userData.t=1;
 const hbB=quad(160,12,null,550,H-46,9,{color:0x000000,opacity:.45}),hbF=quad(1,12,null,470,H-46,10,{color:0xef4444});
 const fmk=f=>quad(256,64,mkTex(cnv(256,64,g=>{g.font='bold 40px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=6;g.strokeStyle='#000a';g.strokeText(f.txt,128,32);g.fillStyle=f.col;g.fillText(f.txt,128,32)})),f.x,H-f.y,12);
 let z=1,tz=1,fx=360,fy=160,tfx=360,tfy=160,shk=0,fl=0,acc=0;
 const rd=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
 rd.setPixelRatio(Math.min(window.devicePixelRatio||1,2));rd.setSize(W,H,false);rd.setClearColor(0x000000,0);
 cv.style.background='linear-gradient(#6ec3f5,#d6f1ff)';
 cv.addEventListener('webglcontextlost',e=>{e.preventDefault();to2D()});
 R3={
  put(ch,sp,i){const m=chMesh(ch),t=tex(sp),sh=m.userData.sh;if(!t){m.visible=sh.visible=false;return}
   m.visible=sh.visible=true;if(m.material.map!==t){m.material.map=t;m.material.needsUpdate=true}
   t.repeat.set(1/sp.n,1);t.offset.set(i/sp.n,0);const f=ch.flip?-1:1;
   if(ch.flash>0)m.material.color.setRGB(2.6,2.6,2.6);else m.material.color.setHex(tint);m.scale.set(f*sp.w*SC,sp.h*SC,1);m.position.set(ch.x+ch.dx+f*(sp.w/2-sp.ax)*SC,H-GROUND+(sp.ay-sp.h/2)*SC,0);m.material.opacity=ch.alpha;
   sh.scale.set(110,20,1);sh.position.set(ch.x+ch.dx,H-GROUND+2,0);sh.material.opacity=.7*ch.alpha},
  camTo(zz,x,y){tz=zz;tfx=x;tfy=H-y},
  theme(k,i){if(k===cur)return;cur=k;if(i){applyTheme(k);sw=null;fadeP.material.opacity=0}else sw={t:0,k,d:0}},
  hit(ch,big,col){const c=new THREE.Color(col),rgb=[c.r,c.g,c.b],n=big?70:24;
   for(let k=0;k<n;k++){const a=Math.random()*6.283,v=(big?160:90)+Math.random()*(big?380:240);emit(sparks,ch.x,H-GROUND+55,Math.cos(a)*v,Math.sin(a)*v*.8+60,.45+Math.random()*.5,rgb)}
   for(let k=0;k<(big?8:3);k++)emit(glows,ch.x+Math.random()*30-15,H-GROUND+55,0,0,.5,rgb);
   shk=Math.max(shk,big?18:7);if(big)fl=.5;z+=big?.12:.05;star.position.set(ch.x,H-GROUND+60,0);star.material.color.set(col);star.userData.t=0;star.userData.big=big},
  frame(dt,now){
   const k=Math.min(1,dt*5);z+=(tz-z)*k;fx+=(tfx-fx)*k;fy+=(tfy-fy)*k;shk*=Math.exp(-dt*7);fl=Math.max(0,fl-dt*1.6);
   const cx=fx-(fx-360)/z,cy=fy-(fy-160)/z;
   cam.zoom=z;cam.position.set(cx+(Math.random()-.5)*shk,cy+(Math.random()-.5)*shk,10);cam.updateProjectionMatrix();
   for(const [m,f] of lay)m.position.x=m.userData.bx+(cx-360)*f;
   for(let q=0;q<clouds.length;q++){const m=clouds[q];m.position.x+=dt*m.userData.s*(bat?3:1);if(m.position.x>900)m.position.x=-180;m.position.y=m.userData.by+(bat?Math.sin(now*.003+q*2)*10:0)}
   if(sw){sw.t+=dt/.55;const p=Math.min(1,sw.t);fadeP.material.opacity=p<.5?p*2:(1-p)*2;if(p>=.5&&!sw.d){sw.d=1;applyTheme(sw.k)}if(p>=1)sw=null}
   acc+=dt*45;while(acc>=1){acc--;for(const ch of [bunny,skel])if(ch.ult&&ch.alpha>.5)emit(embers,ch.x+ch.dx+(Math.random()-.5)*70,H-GROUND+Math.random()*30,(Math.random()-.5)*16,50+Math.random()*70,.9+Math.random()*.7,COL[ch.key])}
   step(sparks,dt);step(glows,dt);step(embers,dt);
   const hp=Math.max(0,S.ehp/EHP),a=skel.alpha;hbB.material.opacity=.45*a;hbF.material.opacity=a;hbF.scale.x=Math.max(.001,160*hp);hbF.position.x=470+80*hp;
   floaters=floaters.filter(f=>{const p=(now-f.t)/900;if(p>=1){if(f.m){scn.remove(f.m);f.m.material.map.dispose();f.m.material.dispose();f.m.geometry.dispose()}return false}if(!f.m)f.m=fmk(f);f.m.position.y=H-f.y+p*50;f.m.material.opacity=1-p;return true});
   if(star.userData.t<.25){star.userData.t+=dt;const p=Math.min(1,star.userData.t/.25);star.material.opacity=1-p;star.scale.setScalar((star.userData.big?280:160)*(.5+p));star.material.rotation=0}else star.material.opacity=0;
   flash.material.opacity=fl;rd.render(scn,cam)}
 };
}catch(e){console.error(e);R3=null}})();
function to2D(){R3=null;const nc=document.createElement('canvas');nc.id='c';nc.width=720;nc.height=320;cv.replaceWith(nc);cv=nc;ctx=cv.getContext('2d');cv.style.background=SKY2D[THEME]}
if(!R3)ctx=cv.getContext('2d');
function camTo(z,x,y){R3&&R3.camTo(z,x,y)}
let frz=0,slo=0;
function hitFx(ch,big,col){frz=big?.3:.14;slo=big?.35:.18;ch.flash=big?.22:.12;ch.kb=big?34:14;R3&&R3.hit(ch,big,col)}
const SKY2D={skel:'linear-gradient(#7ec8f5 0%,#c8ecff 62%,#6fbf5a 62%,#4e9a3f 100%)',golem:'linear-gradient(#f2a64d 0%,#fde2a8 62%,#efc57a 62%,#d9a550 100%)',vamp:'linear-gradient(#0c0720 0%,#34204f 62%,#34304a 62%,#15131f 100%)'};let THEME='skel';
function setTheme(k,instant){THEME=k;if(S.on)bgmPlay(k);if(R3)R3.theme(k,instant);else cv.style.background=SKY2D[k]}
function loop(now){
 const dt=Math.min((now-last)/1000,.1);last=now;
 if(frz>0){frz-=dt;bunny.t0+=dt*1000;skel.t0+=dt*1000}
 else if(slo>0){slo-=dt;bunny.t0+=dt*600;skel.t0+=dt*600}
 for(const c of [bunny,skel]){c.flash=Math.max(0,(c.flash||0)-dt);if(frz<=0)c.kb=(c.kb||0)*Math.exp(-dt*9)}
 if(!R3)ctx.clearRect(0,0,720,320);
 drawCh(bunny,now);drawCh(skel,now);
 if(skel.fade){skel.alpha=Math.min(1,skel.alpha+dt*2);if(skel.alpha>=1)skel.fade=0}
 if(R3){try{R3.frame(dt,now)}catch(e){console.error(e);to2D()}}
 else{
 ctx.fillStyle='#0007';ctx.fillRect(470,40,160,12);ctx.fillStyle='#ef4444';ctx.fillRect(470,40,160*S.ehp/EHP*skel.alpha,12);
 floaters=floaters.filter(f=>now-f.t<900);
 for(const f of floaters){const p=(now-f.t)/900;ctx.globalAlpha=1-p;ctx.fillStyle=f.col;ctx.font='bold 34px system-ui';ctx.textAlign='center';ctx.fillText(f.txt,f.x,f.y-p*50)}
 ctx.globalAlpha=1}
 if(S.on&&!S.busy){S.tl-=dt;if(S.tl<=0){S.tl=0;answer(null)}
  const b=document.getElementById('bar');b.style.width=(S.tl/TIME*100)+'%';b.style.background=S.tl<=5?'var(--bad)':S.tl<=10?'var(--acc)':'var(--ok)';
  document.getElementById('tm').textContent='⏱ '+Math.ceil(S.tl)+' detik · hasil maks '+S.mx}
 requestAnimationFrame(loop);
}
const $=id=>document.getElementById(id),rnd=n=>Math.floor(Math.random()*n);
function hud(){$('hp').textContent='❤️'.repeat(S.hearts)+'🖤'.repeat(3-S.hearts);$('sc').textContent='⭐ '+S.score;$('en').textContent='Level '+S.n+' · '+EN[(S.n-1)%3][1]}
function newQ(){
 camTo(1,360,160);
 const mx=RANGES[MODE][Math.min(S.n,3)-1],a=1+rnd(mx-1),b=1+rnd(mx-a);S.ans=a+b;S.mx=mx;
 const o=new Set([S.ans]);while(o.size<4){const d=S.ans+rnd(7)-3;if(d>=1&&d<=mx)o.add(d)}
 const arr=[...o].sort(()=>Math.random()-.5);
 $('eq').textContent=a+' + '+b+' = ?';
 $('opts').innerHTML='';
 for(const v of arr){const bt=document.createElement('button');bt.textContent=v;bt.dataset.v=v;bt.onclick=()=>answer(v);$('opts').appendChild(bt)}
 S.tl=TIME;S.busy=false;$('tm').textContent='';
}
function lock(v){
 for(const bt of $('opts').children){bt.disabled=true;if(+bt.dataset.v===S.ans)bt.classList.add('ok');else if(v!==null&&+bt.dataset.v===v)bt.classList.add('bad')}
}
function splashSfx(){
 audioInit();if(muted||!ac)return;
 try{
  const notes=[392,523.25,659.25,783.99],t0=ac.currentTime;
  notes.forEach((freq,idx)=>{
   const t=t0+idx*.075,o=ac.createOscillator(),g=ac.createGain();
   o.type='triangle';o.frequency.setValueAtTime(freq,t);
   g.gain.setValueAtTime(.2,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);
   o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.35);
   const o2=ac.createOscillator(),g2=ac.createGain();
   o2.type='sine';o2.frequency.setValueAtTime(freq*2,t);
   g2.gain.setValueAtTime(.08,t);g2.gain.exponentialRampToValueAtTime(.001,t+.22);
   o2.connect(g2);g2.connect(ac.destination);o2.start(t);o2.stop(t+.22);
  });
 }catch(e){}
}
const STAGE_THEMES={
 skel:{main:'#06b6d4',dark:'#0e7490',accent:'#a5f3fc',glow:'rgba(6,182,212,0.5)',name:'Kerangka Kuburan',desc:'Pasukan tulang bangkit! Kalahkan dengan pedangmu!',card:'card2'},
 golem:{main:'#f59e0b',dark:'#b45309',accent:'#fde047',glow:'rgba(245,158,11,0.55)',name:'Golem Batu Raksasa',desc:'Gurun berguncang! Waspadai tinju raksasanya!',card:'card3'},
 vamp:{main:'#e11d48',dark:'#881337',accent:'#f472b6',glow:'rgba(225,29,72,0.55)',name:'Vampir Kegelapan',desc:'Malam semakin dingin! Waspadai sihir apinya!',card:'card1'}
};
let splashTimer=null;
function showStageSplash(clearedStage,nextStage,nextKey,done){
 const el=$('stageSplash');
 if(!el){if(done)done();return}
 const theme=STAGE_THEMES[nextKey]||STAGE_THEMES.skel;
 el.style.setProperty('--paint-main',theme.main);
 el.style.setProperty('--paint-dark',theme.dark);
 el.style.setProperty('--paint-accent',theme.accent);
 el.style.setProperty('--paint-glow',theme.glow);
 $('splashRibbon').textContent='STAGE '+clearedStage+' SELESAI! ⭐';
 $('splashBadge').textContent='STAGE '+nextStage;
 $('splashStageTag').textContent='STAGE '+nextStage+' · MUSUH BARU';
 $('splashMonsterName').textContent=theme.name.toUpperCase();
 $('splashLoreText').textContent=theme.desc;
 if(DATA[theme.card])$('splashMonsterImg').src=DATA[theme.card];
 const dots=$('splashProgress').children;
 for(let i=0;i<dots.length;i++){
  dots[i].className='pdot'+(i<clearedStage?' done':(i===clearedStage?' active':''));
 }
 el.classList.remove('hide','fade-out');
 splashSfx();
 const closeSplash=()=>{
  $('splashContinueBtn').onclick=null;
  uiClick();
  el.classList.add('fade-out');
  setTimeout(()=>{
   el.classList.add('hide');
   el.classList.remove('fade-out');
   if(done)done();
  },250);
 };
 $('splashContinueBtn').onclick=closeSplash;
}
function answer(v){
 if(S.busy)return;S.busy=true;lock(v);
 if(v===S.ans){
  const u=bunny.ult;bunny.ult=false;S.score+=u?30:10;hud();play(bunny,u?'uatk':'atk');if(u)camTo(1.25,(bunny.x+skel.x)/2,150);sfx(u?'sword_ult':'sword',u?600:380,1,1);
  setTimeout(()=>{S.ehp--;float(u?'ULTIMATE!':'-1',skel.x,u?'#fbbf24':'#ef4444');hitFx(skel,u||S.ehp<=0,u?'#fbbf24':'#fb923c');
   if(S.ehp<=0){
    if(skel.key==='golem')sfx('golem_die');
    if(skel.key==='vamp')sfx('vamp_die');
    play(skel,'die',()=>{
     if(S.n>=3){showEnd(true);return}
     const prevN=S.n;S.n++;const nextKey=EN[(S.n-1)%3][0];
     showStageSplash(prevN,S.n,nextKey,()=>{
      skel.key=nextKey;setTheme(skel.key);bgmPlay(skel.key);S.ehp=EHP;skel.alpha=0;skel.fade=1;skel.ult=S.hearts===1;
      play(skel,skel.ult?'aura':'idle');hud();setTimeout(newQ,300);
     });
    });
   }
   else play(skel,'hurt',()=>{if(S.ehp===1)ultOn(bunny);setTimeout(newQ,400)})},u?600:380);
 }else{
  $('eq').textContent=(v===null?'Waktu habis! ':'Salah! ')+$('eq').textContent.replace('?','')+S.ans;
  const u=skel.ult;play(skel,u?'uatk':'atk');if(u)camTo(1.25,(bunny.x+skel.x)/2,150);sfx({skel:u?'sword_ult':'sword',golem:'boom',vamp:'fire'}[skel.key],EN[(S.n-1)%3][u?3:2],u?1.25:1,skel.key==='skel'&&u?1:(u?.85:1));
  setTimeout(()=>{S.hearts--;hud();float('💔',bunny.x,'#f87171');hitFx(bunny,u||S.hearts<=0,'#f87171');
   if(S.hearts<=0)play(bunny,'die',over);else play(bunny,'hurt',()=>{if(S.hearts===1)ultOn(skel);setTimeout(newQ,900)})},EN[(S.n-1)%3][u?3:2]);
 }
}
function best(){let b=0;try{b=+localStorage.getItem('tambah_best')||0;if(S.score>b){b=S.score;localStorage.setItem('tambah_best',b)}}catch(e){}return Math.max(b,S.score)}
function showEnd(win){
 bgmStop();
 const k=win?'win':skel.key;
 if(win)sfx('win');
 camTo(1,360,160);$('endImg').src=DATA['end_'+k];
 $('ebox').style.width='min(100vw,calc(100vh*'+M['end_'+k].w+'/'+M['end_'+k].h+'))';
 $('escore').textContent='Skor: '+S.score+'  ·  Terbaik: '+best();$('escore').style.bottom=win?'16.5%':'14%';
 $('eHs').classList.toggle('hide',!win);$('eBtns').classList.toggle('hide',win);$('end').classList.remove('hide');
}
function over(){showEnd(false)}
function start(){
 S.score=0;S.hearts=3;S.n=1;skel.key='skel';setTheme('skel',1);bgmPlay('skel');$('end').classList.add('hide');camTo(1,360,160);S.ehp=EHP;S.on=true;skel.alpha=1;skel.fade=0;bunny.ult=skel.ult=false;
 clearTimeout(splashTimer);if($('stageSplash')){$('stageSplash').classList.add('hide');$('stageSplash').classList.remove('fade-out')}
 play(bunny,'idle');play(skel,'idle');hud();$('ov').classList.add('hide');newQ();
}
function uiClick(){audioInit();if(muted||!ac)return;try{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type='sine';o.frequency.setValueAtTime(650,t);o.frequency.exponentialRampToValueAtTime(1250,t+.03);g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.001,t+.055);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.055)}catch(e){}}
$('go').onclick=()=>{uiClick();start()};
$('menuImg').src=DATA.menu;$('menuImgP').src=DATA.menu_p;
let tt;function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1500)}
const RANGES={mudah:[5,10,15],menantang:[10,15,20]};
let MODE='mudah';try{MODE=localStorage.getItem('tambah_mode')==='menantang'?'menantang':'mudah'}catch(e){}
$('setImg').src=DATA.set_panel;
const CHK={mudah:[48,31.25],menantang:[84.5,31.25]};
function renderMode(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('sel',b.dataset.mode===MODE));$('chk').style.left=CHK[MODE][0]+'%';$('chk').style.top=CHK[MODE][1]+'%'}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{uiClick();MODE=b.dataset.mode;try{localStorage.setItem('tambah_mode',MODE)}catch(e){};renderMode()});
$('s_back').onclick=$('s_x').onclick=()=>{uiClick();$('settings').classList.add('hide')};
function openSettings(){renderMode();$('settings').classList.remove('hide')}
for(let i=0;i<4;i++)$('hc'+i).src=DATA['card'+i];
$('heroes').style.backgroundImage='url('+DATA.hbg+')';
const hsl=$('hsl'),dots=[...$('hdots').children];
const hidx=()=>Math.round(hsl.scrollLeft/hsl.clientWidth),hgo=i=>hsl.scrollTo({left:i*hsl.clientWidth,behavior:'smooth'});
hsl.onscroll=()=>{const k=hidx();dots.forEach((d,j)=>d.classList.toggle('on',j===k))};
dots.forEach((d,j)=>d.onclick=()=>{uiClick();hgo(j)});
$('hprev').onclick=()=>{uiClick();hgo(Math.max(0,hidx()-1))};$('hnext').onclick=()=>{uiClick();hgo(Math.min(3,hidx()+1))};
$('hback').onclick=()=>{uiClick();$('heroes').classList.add('hide')};
function openHeroes(){$('heroes').classList.remove('hide');hsl.scrollLeft=0;hsl.onscroll()}
document.querySelectorAll('[data-act]').forEach(b=>{b.onclick=()=>{uiClick();(({start:()=>{$('menu').classList.add('hide');start()},hero:openHeroes,set:openSettings}[b.dataset.act])||(()=>toast('Segera hadir')))()}});
const toMenu=()=>{bgmStop();clearTimeout(splashTimer);if($('stageSplash')){$('stageSplash').classList.add('hide');$('stageSplash').classList.remove('fade-out')};$('end').classList.add('hide');$('ov').classList.add('hide');$('menu').classList.remove('hide')};
$('e_retry').onclick=()=>{uiClick();start()};$('e_menu').onclick=$('e_menu2').onclick=()=>{uiClick();toMenu()};
const AC=window.AudioContext||window.webkitAudioContext,SND={},VOL={sword:.8,sword_ult:.95,boom:.55,fire:.85,win:.9,golem_die:.95,vamp_die:.95};let ac=null,muted=false;
try{muted=localStorage.getItem('tambah_mute')==='1'}catch(e){}
$('mute').textContent=muted?'🔇':'🔊';
const getBuf=u=>u.startsWith('data:')?Promise.resolve(b64buf(u)):fetch(u).then(r=>r.arrayBuffer());
const b64buf=u=>{const s=atob(u.split(',')[1]),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a.buffer};
function audioInit(){if(!AC)return;if(!ac){try{ac=new AC()}catch(e){return}
 for(const k in DATA.snd)getBuf(DATA.snd[k]).then(ab=>ac.decodeAudioData(ab,buf=>{const d=buf.getChannelData(0),w=Math.floor(buf.sampleRate*.01);let best=0,bi=0;for(let i=0;i<d.length;i+=w){let m=0;const e=Math.min(i+w,d.length);for(let j=i;j<e;j++){const v=Math.abs(d[j]);if(v>m)m=v}if(m>best){best=m;bi=i}}SND[k]={buf,peak:bi/buf.sampleRate}},()=>{})).catch(()=>{})}
 if(ac.state==='suspended')ac.resume()}
function sfx(k,hitMs,vol,rate){if(muted||!ac||!SND[k])return;const s=SND[k],r=rate||1;
 const d=hitMs!=null?Math.max(0,hitMs-s.peak*1000/r):0;
 setTimeout(()=>{if(muted||!ac)return;
  if(bgmGain&&!muted){try{bgmGain.gain.setValueAtTime(.06,ac.currentTime);bgmGain.gain.linearRampToValueAtTime(.18,ac.currentTime+.5)}catch(e){}}
  const src=ac.createBufferSource(),g=ac.createGain();src.buffer=s.buf;src.playbackRate.value=r;g.gain.value=(VOL[k]||.8)*(vol||1);src.connect(g);g.connect(ac.destination);src.start()},d)}
let bgmGain=null,noiseBuf=null,bgmTimer=null,bgmNext=0,bgmStep=0,bgmKey=null;
function getNoiseBuf(){if(noiseBuf||!ac)return noiseBuf;noiseBuf=ac.createBuffer(1,Math.floor(ac.sampleRate*.5),ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return noiseBuf}
function playKick(t){if(!ac||!bgmGain)return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(32,t+.08);g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g);g.connect(bgmGain);o.start(t);o.stop(t+.1)}
function playSnare(t){if(!ac||!bgmGain)return;const b=getNoiseBuf();if(!b)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=1200;g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.08);s.connect(f);f.connect(g);g.connect(bgmGain);s.start(t);s.stop(t+.08)}
function playHat(t){if(!ac||!bgmGain)return;const b=getNoiseBuf();if(!b)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=b;f.type='highpass';f.frequency.value=7500;g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.04);s.connect(f);f.connect(g);g.connect(bgmGain);s.start(t);s.stop(t+.04)}
function playBass(n,t,dur,k){if(!ac||!bgmGain||!n)return;const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type=k==='skel'?'triangle':'sawtooth';o.frequency.setValueAtTime(440*2**((n-69)/12),t);f.type='lowpass';f.frequency.value=k==='golem'?320:550;g.gain.setValueAtTime(k==='golem'?.3:.22,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(f);f.connect(g);g.connect(bgmGain);o.start(t);o.stop(t+dur)}
function playLead(n,t,dur,k){if(!ac||!bgmGain||!n)return;const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type=k==='vamp'?'square':k==='golem'?'sine':'triangle';o.frequency.setValueAtTime(440*2**((n-69)/12),t);f.type='lowpass';f.frequency.value=k==='vamp'?1200:1800;g.gain.setValueAtTime(k==='vamp'?.1:.15,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(f);f.connect(g);g.connect(bgmGain);o.start(t);o.stop(t+dur)}
const BGM_PAT={
 skel:{bpm:114,b:[48,0,48,0,55,0,52,0,45,0,45,0,53,0,55,0],l:[60,0,64,67,72,0,71,67,69,0,65,0,67,0,0,0,60,0,64,67,72,0,74,76,74,0,71,0,72,0,0,0],k:8,s:4,h:2},
 golem:{bpm:102,b:[38,0,38,38,0,41,0,43,38,0,38,0,45,0,43,41],l:[62,0,65,0,69,0,67,65,62,0,60,0,62,0,0,0,65,0,69,0,72,0,70,69,67,0,69,0,62,0,0,0],k:8,s:4,h:1},
 vamp:{bpm:126,b:[40,40,0,40,40,40,0,40,36,36,0,36,35,35,0,35],l:[64,67,71,76,75,71,67,66,67,71,74,75,76,0,71,0,64,67,71,76,75,71,67,66,60,64,67,72,71,0,75,0],k:4,s:4,h:2}
};
function bgmInit(){if(bgmGain||!ac)return;bgmGain=ac.createGain();bgmGain.gain.setValueAtTime(muted?0:.18,ac.currentTime);bgmGain.connect(ac.destination)}
function bgmPlay(k){if(!BGM_PAT[k])return;bgmKey=k;audioInit();bgmInit();if(bgmTimer)return;bgmStep=0;bgmNext=ac?ac.currentTime+.05:0;bgmTick();bgmTimer=setInterval(bgmTick,35)}
function bgmStop(){if(bgmTimer){clearInterval(bgmTimer);bgmTimer=null}if(bgmGain&&ac){try{bgmGain.gain.setValueAtTime(0,ac.currentTime)}catch(e){}}}
function bgmTick(){if(!ac||!bgmKey||!BGM_PAT[bgmKey])return;const p=BGM_PAT[bgmKey],st=60/p.bpm/4;while(bgmNext<ac.currentTime+.15){const t=bgmNext,s=bgmStep;const bn=p.b[s%p.b.length];if(bn)playBass(bn,t,st*1.8,bgmKey);const ln=p.l[s%p.l.length];if(ln)playLead(ln,t,st*1.4,bgmKey);if(s%8===0)playKick(t);else if(s%p.k===0)playKick(t);if(s%8===p.s)playSnare(t);if(s%p.h===0)playHat(t);bgmNext+=st;bgmStep++}}
document.addEventListener('pointerdown',audioInit,{once:true});
$('mute').onclick=()=>{muted=!muted;try{localStorage.setItem('tambah_mute',muted?'1':'0')}catch(e){}$('mute').textContent=muted?'🔇':'🔊';if(bgmGain&&ac){try{bgmGain.gain.setValueAtTime(muted?0:.18,ac.currentTime)}catch(e){}}audioInit()};
requestAnimationFrame(loop);
