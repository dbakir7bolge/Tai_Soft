(()=>{"use strict";
const DEFAULTS={name:"Ad Soyad",title:"Ünvan",unit:"Birim / Açıklama",phone1:"",phone2:"",whatsapp:"",email:"",address:"",maps:"",website:"",instagram:"",facebook:"",youtube:"",whatsappChannel:""};
const STORAGE_KEY="taisoft-card-v1";
const PROFILE_KEY="taisoft-card-profile-v1";
const REQUIRED_FIELDS=["name","title","unit","phone1","email"];
let deferredPrompt=null;
let current={...DEFAULTS};
let profileImage="";
let qr=null;

const $=s=>document.querySelector(s);
const esc=s=>String(s??"").trim();

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove("show"),2400)}
function digits(s){return esc(s).replace(/[^0-9]/g,"")}
function telHref(s){let d=digits(s);if(!d)return "";if(d.startsWith("90")&&d.length>=12)d="0"+d.slice(2);return "tel:"+d}
function waHref(s){let d=digits(s);if(!d)return "";if(d.startsWith("0"))d="90"+d.slice(1);if(!d.startsWith("90")&&d.length===10)d="90"+d;return "https://wa.me/"+d}
function safeUrl(s){s=esc(s);if(!s)return "";try{const u=new URL(s);return ["http:","https:"].includes(u.protocol)?u.href:""}catch{return ""}}
function mapHref(){const direct=safeUrl(current.maps);if(direct)return direct;return current.address?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(current.address):""}
function setLink(id,href,textId,text){const a=$(id);a.href=href||"#";a.classList.toggle("disabled",!href);if(textId)$(textId).textContent=text||"—"}
function initials(name){const p=esc(name).split(/\s+/).filter(Boolean);return ((p[0]?.[0]||"T")+(p.length>1?p[p.length-1][0]:"K")).toLocaleUpperCase("tr-TR")}
function fieldCompleted(key,obj=current){const val=esc(obj[key]);return !!val && val!==esc(DEFAULTS[key])}
function hasRequiredInfo(obj=current){return REQUIRED_FIELDS.every(k=>fieldCompleted(k,obj))}
function isSharedView(){return location.hash.startsWith("#card=")}
function updateEditState(){const btn=$("#editBtn");const locked=isSharedView()||hasRequiredInfo(current);btn.disabled=locked;btn.classList.toggle("is-passive",locked);btn.setAttribute("aria-disabled",locked?"true":"false");btn.title=locked?"Düzenleme pasif":"Kartı düzenle";btn.setAttribute("aria-label",locked?"Düzenleme pasif":"Kartı düzenle")}
function renderProfile(){const wrap=$(".profile-wrap"),mono=$("#monogram"),img=$("#profilePhoto"),identity=$(".identity");mono.textContent=initials(current.name);if(profileImage){img.src=profileImage;img.hidden=false;mono.hidden=true;wrap.hidden=false;wrap.classList.remove("is-empty");identity.classList.remove("no-profile")}else{img.removeAttribute("src");img.hidden=true;mono.hidden=true;wrap.hidden=true;wrap.classList.add("is-empty");identity.classList.add("no-profile")}}
function render(){
 $("#nameText").textContent=current.name||DEFAULTS.name;
 $("#titleText").textContent=current.title||DEFAULTS.title;
 $("#unitText").textContent=current.unit||DEFAULTS.unit;
 renderProfile();
 const p1=telHref(current.phone1),p2=telHref(current.phone2),wa=waHref(current.whatsapp||current.phone1),mail=current.email?"mailto:"+encodeURIComponent(current.email):"",map=mapHref(),web=safeUrl(current.website);
 setLink("#call1Action",p1);setLink("#waAction",wa);setLink("#mailAction",mail);setLink("#mapAction",map);
 setLink("#phone1Row",p1,"#phone1Text",current.phone1);setLink("#phone2Row",p2,"#phone2Text",current.phone2);setLink("#emailRow",mail,"#emailText",current.email);setLink("#websiteRow",web,"#websiteText",current.website);setLink("#addressRow",map,"#addressText",current.address);
 const items=[["Instagram",current.instagram],["Facebook",current.facebook],["YouTube",current.youtube],["WhatsApp Kanalı",current.whatsappChannel]].filter(x=>safeUrl(x[1]));
 const box=$("#socials");box.innerHTML="";items.forEach(([n,u])=>{const a=document.createElement("a");a.className="social-chip";a.href=safeUrl(u);a.target="_blank";a.rel="noopener";a.textContent=n;box.appendChild(a)});box.hidden=!items.length;
 updateEditState();
}
function load(){let fromHash=null;if(location.hash.startsWith("#card=")){try{fromHash=decodeCard(location.hash.slice(6))}catch(e){console.warn(e)}}if(fromHash){current={...DEFAULTS,...fromHash};profileImage="";return}try{current={...DEFAULTS,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{current={...DEFAULTS}}try{profileImage=localStorage.getItem(PROFILE_KEY)||""}catch{profileImage=""}}
function fillProfilePreview(){const img=$("#profilePreview"),fallback=$("#profilePreviewFallback");fallback.textContent=initials(current.name);if(profileImage){img.src=profileImage;img.hidden=false;fallback.hidden=true}else{img.removeAttribute("src");img.hidden=true;fallback.hidden=false}}
function fillForm(){const f=$("#editForm");Object.keys(DEFAULTS).forEach(k=>{if(f.elements[k])f.elements[k].value=current[k]||""});$("#profileInput").value="";fillProfilePreview()}
function saveFromForm(){const f=$("#editForm"),next={};Object.keys(DEFAULTS).forEach(k=>next[k]=esc(f.elements[k]?.value||""));current={...DEFAULTS,...next};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(current));if(profileImage)localStorage.setItem(PROFILE_KEY,profileImage);else localStorage.removeItem(PROFILE_KEY)}catch(e){console.warn(e);toast("Profil resmi çok büyük olabilir. Daha küçük bir görsel deneyin.")}render();hideQr();toast(hasRequiredInfo(current)?"Kart tamamlandı. Düzenleme pasif hale getirildi":"Kart bilgileri kaydedildi")}
function resizeProfile(file){return new Promise((resolve,reject)=>{if(!file||!file.type.startsWith("image/"))return reject(new Error("type"));if(file.size>12*1024*1024)return reject(new Error("size"));const reader=new FileReader();reader.onerror=()=>reject(new Error("read"));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error("image"));img.onload=()=>{const size=420;const side=Math.min(img.naturalWidth,img.naturalHeight);const sx=(img.naturalWidth-side)/2,sy=(img.naturalHeight-side)/2;const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#ffffff";ctx.fillRect(0,0,size,size);ctx.drawImage(img,sx,sy,side,side,0,0,size,size);resolve(canvas.toDataURL("image/jpeg",.86))};img.src=reader.result};reader.readAsDataURL(file)})}
async function onProfileSelected(e){const file=e.target.files?.[0];if(!file)return;try{profileImage=await resizeProfile(file);fillProfilePreview();toast("Profil resmi hazır. Kaydet'e basın.")}catch(err){console.warn(err);toast(err.message==="size"?"Görsel 12 MB'den küçük olmalı":"Geçerli bir JPG, PNG veya WEBP seçin")}}
function b64urlEncode(str){const bytes=new TextEncoder().encode(str);let bin="";for(const b of bytes)bin+=String.fromCharCode(b);return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}
function b64urlDecode(str){str=str.replace(/-/g,"+").replace(/_/g,"/");while(str.length%4)str+="=";const bin=atob(str),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function encodeCard(obj){const compact={};Object.keys(DEFAULTS).forEach(k=>{if(esc(obj[k]))compact[k]=esc(obj[k])});return b64urlEncode(JSON.stringify(compact))}
function decodeCard(s){const o=JSON.parse(b64urlDecode(s));const clean={};Object.keys(DEFAULTS).forEach(k=>clean[k]=typeof o[k]==="string"?o[k].slice(0,320):"");return clean}
function baseUrl(){return location.href.split("#")[0]}
function shareUrl(){if(location.protocol==="file:"||!/^https?:$/.test(location.protocol))throw new Error("host");const url=baseUrl()+"#card="+encodeCard(current);if(url.length>2500)throw new Error("long");return url}
function makeQr(){let url;try{url=shareUrl()}catch(e){if(e.message==="host")return info("QR için yayınlama gerekli","QR kodun başka telefonlarda çalışması için bu klasörü HTTPS destekli bir sunucuda yayınlayın. Ücretsiz GitHub Pages kurulumu README_TR.md dosyasında anlatılmıştır.");return info("Bağlantı çok uzun","Bazı alanlardaki çok uzun bağlantıları kısaltıp tekrar deneyin.")}
 const box=$("#qrBox");box.hidden=false;box.innerHTML="";qr=new QRCode(box,{text:url,width:300,height:300,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.L});$("#shareLink").value=url;$("#shareLink").hidden=false;$("#qrActions").hidden=false;setTimeout(()=>box.scrollIntoView({behavior:"smooth",block:"nearest"}),60)}
function hideQr(){$("#qrBox").hidden=true;$("#qrBox").innerHTML="";$("#shareLink").hidden=true;$("#qrActions").hidden=true}
function info(title,html){$("#infoTitle").textContent=title;$("#infoBody").innerHTML=html;$("#infoDialog").showModal()}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast("Bağlantı kopyalandı")}catch{const i=$("#shareLink");i.hidden=false;i.value=t;i.select();document.execCommand("copy");toast("Bağlantı kopyalandı")}}
function vesc(s){return esc(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}
function vcard(){const lines=["BEGIN:VCARD","VERSION:3.0",`FN:${vesc(current.name)}`,`ORG:${vesc("TaiSoft")}`,`TITLE:${vesc(current.title)}`];if(current.phone1)lines.push(`TEL;TYPE=CELL:${vesc(digits(current.phone1))}`);if(current.phone2)lines.push(`TEL;TYPE=WORK:${vesc(digits(current.phone2))}`);if(current.email)lines.push(`EMAIL;TYPE=WORK:${vesc(current.email)}`);if(current.address)lines.push(`ADR;TYPE=WORK:;;${vesc(current.address)};;;;`);if(current.website)lines.push(`URL:${vesc(current.website)}`);lines.push(`NOTE:${vesc(current.unit)}`,"END:VCARD");return lines.join("\r\n")}
function saveVcf(){const blob=new Blob([vcard()],{type:"text/vcard;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(current.name||"TaiSoft-Kartvizit").replace(/[\\/:*?\"<>|]/g,"-")+".vcf";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function share(){let url;try{url=shareUrl()}catch(e){return makeQr()}const data={title:"Dijital Kartvizit",text:`${current.name} - ${current.title}`,url};if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==="AbortError")return}}await copyText(url)}
function downloadQr(){const box=$("#qrBox"),canvas=box.querySelector("canvas"),img=box.querySelector("img");let href="";if(canvas)href=canvas.toDataURL("image/png");else if(img?.src)href=img.src;if(!href)return toast("Önce QR kod oluşturun");const a=document.createElement("a");a.href=href;a.download="TaiSoft-QR.png";document.body.appendChild(a);a.click();a.remove()}
function install(){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.finally(()=>deferredPrompt=null);return}const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);if(ios)info("iPhone / iPad'e yükleme","<ol><li>Sayfayı Safari'de açın.</li><li><b>Paylaş</b> düğmesine dokunun.</li><li><b>Ana Ekrana Ekle</b> seçeneğini kullanın.</li></ol>");else info("Uygulamayı yükleme","Tarayıcı menüsündeki <b>Uygulamayı yükle</b> veya <b>Ana ekrana ekle</b> seçeneğini kullanın. Bu seçenek için uygulamanın HTTPS üzerinden açılması gerekir.")}

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
window.addEventListener("appinstalled",()=>toast("Uygulama yüklendi"));
window.addEventListener("hashchange",()=>{load();render();hideQr()});

$("#editBtn").addEventListener("click",()=>{if($("#editBtn").disabled)return;fillForm();$("#editDialog").showModal()});
$("#editForm").addEventListener("submit",e=>{e.preventDefault();saveFromForm();$("#editDialog").close()});
$("#profileInput").addEventListener("change",onProfileSelected);
$("#removeProfileBtn").addEventListener("click",()=>{profileImage="";$("#profileInput").value="";fillProfilePreview();toast("Profil resmi kaldırıldı. Kaydet'e basın.")});
$("#editForm").elements.name.addEventListener("input",()=>{$("#profilePreviewFallback").textContent=initials($("#editForm").elements.name.value)});
$("#resetBtn").addEventListener("click",()=>{current={...DEFAULTS};profileImage="";try{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(PROFILE_KEY)}catch{}fillForm();render();hideQr();toast("Varsayılan bilgiler yüklendi")});
$("#makeQrBtn").addEventListener("click",makeQr);
$("#copyLinkBtn").addEventListener("click",()=>copyText($("#shareLink").value));
$("#downloadQrBtn").addEventListener("click",downloadQr);
$("#saveContactBtn").addEventListener("click",saveVcf);
$("#shareBtn").addEventListener("click",share);
$("#installBtn").addEventListener("click",install);

load();render();
if("serviceWorker" in navigator&&location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.warn));
})();
