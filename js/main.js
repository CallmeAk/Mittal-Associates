const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const topics=[['All','Indian law Supreme Court GST intellectual property corporate law'],['Supreme Court','Supreme Court of India legal update'],['IPR','India intellectual property law'],['Commercial Litigation','India commercial litigation law'],['GST','GST India legal update'],['Delhi High Court','Delhi High Court legal update']];
let items=[],active=0,topic=0;
function init(){
  const gate=qs('#gate');
  if(localStorage.getItem('ma-accepted')==='true') gate.classList.add('hidden');
  qs('#accept').onclick=()=>{localStorage.setItem('ma-accepted','true');gate.classList.add('hidden')};
  qs('#menu').onclick=()=>{const open=qs('#links').classList.toggle('open');qs('#menu').setAttribute('aria-expanded',String(open))};
  qsa('.links a').forEach(a=>a.onclick=()=>qs('#links').classList.remove('open'));
  renderTopics(); loadNews();
  qsa('.tab').forEach(b=>b.onclick=()=>{qsa('.tab').forEach(x=>x.classList.toggle('active',x===b));qsa('.form-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===b.dataset.target))});
  qsa('form').forEach(f=>f.onsubmit=e=>{e.preventDefault();const d=new FormData(f),sub=encodeURIComponent(f.id==='grow'?'Grow With Us':'Website Consultation'),body=encodeURIComponent([...d].filter(x=>typeof x[1]==='string').map(x=>`${x[0]}: ${x[1]}`).join('\\n'));location.href=`mailto:ayushmittal.adv@gmail.com?subject=${sub}&body=${body}`});
  qs('#prev').onclick=()=>{active=items.length?(active===0?items.length-1:active-1):0;renderNews()};
  qs('#next').onclick=()=>{active=items.length?(active+1)%items.length:0;renderNews()};
}
function renderTopics(){qs('#topics').innerHTML='';topics.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t[0];b.className=i===topic?'active':'';b.onclick=()=>{topic=i;active=0;renderTopics();loadNews()};qs('#topics').appendChild(b)})}
async function loadNews(){qs('#status').textContent='Loading legal updates...';qs('#newsCard').hidden=true;try{const r=await fetch(`/api/news?query=${encodeURIComponent(topics[topic][1])}&topic=${encodeURIComponent(topics[topic][0])}`);if(!r.ok)throw Error('News API failed');const d=await r.json();items=d.items||[]}catch(e){items=[]}if(!items.length)items=[{title:'Legal updates will appear after Vercel deployment',source:'Legal Intelligence Hub',pubDate:new Date().toISOString(),link:'https://news.google.com/',topic:topics[topic][0],summary:'The live Legal Intelligence Hub fetches Google News RSS metadata through the Vercel API route. Deploy with Vercel to enable automatic legal updates.'}];active=0;renderNews()}
function renderNews(){const item=items[active];if(!item){qs('#status').textContent='No legal updates available right now.';qs('#newsCard').hidden=true;return}qs('#status').textContent='';qs('#newsCard').hidden=false;qs('#newsMeta').innerHTML=`<span>${escapeHtml(item.topic||topics[topic][0])}</span><span>Source: ${escapeHtml(item.source||'Google News')}</span><span>${formatDate(item.pubDate)}</span>`;qs('#newsTitle').textContent=item.title||'Legal update';qs('#newsSummary').textContent=item.summary||`This update relates to ${(item.topic||topics[topic][0]).toLowerCase()}. Read the original source for the complete report.`;qs('#newsLink').href=item.link||'https://news.google.com/'}
function formatDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?'Latest':d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function escapeHtml(s=''){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
document.addEventListener('DOMContentLoaded',init);
