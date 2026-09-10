const langBtn=document.getElementById("langBtn");
const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
let lang=localStorage.getItem("nord-lang")||"fr";

function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-fr]").forEach(el=>{
    const value=el.getAttribute(`data-${lang}`);
    if(value!==null) el.innerHTML=value;
  });
  langBtn.textContent=lang==="fr"?"EN":"FR";
  document.querySelectorAll("input,textarea").forEach(el=>{
    const map={fr:{city:"Longueuil",name:"Jean Tremblay",phone:"514 555-1234",email:"jean@exemple.com",message:"Superficie approximative, accès, photos disponibles, résultat souhaité..."},en:{city:"Longueuil",name:"John Smith",phone:"514 555-1234",email:"john@example.com",message:"Approximate acreage, access, photos available, desired result..."}};
    if(map[lang][el.name]) el.placeholder=map[lang][el.name];
  });
  document.title=lang==="fr"?"NORD TERRAIN | Défrichage, nettoyage de terrain & services Bobcat au Québec":"NORD TERRAIN | Land clearing, property cleanup & Bobcat services in Quebec";
  localStorage.setItem("nord-lang",lang);
}
langBtn.addEventListener("click",()=>{lang=lang==="fr"?"en":"fr";applyLang()});
menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();

document.getElementById("quoteForm").addEventListener("submit",()=>{
  setTimeout(()=>alert(lang==="fr"?"Votre demande est prête à être envoyée par courriel.":"Your request is ready to be sent by email."),50);
});
applyLang();
