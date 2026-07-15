/* ======================================================================
   ESTADO
   ====================================================================== */
let meta = {
  colecao: "COLEÇÃO DESCOMPLICANDO • VOLUME 1",
  titulo: "Descomplicando o Juridiquês",
  subtitulo: "O dicionário jurídico que todo calouro deveria ter na mochila.",
  autora: "Nicoly Ribeiro",
  apresentacao: [
    "O dicionário que eu gostaria de ter tido no meu primeiro dia de aula.",
    "Se você acabou de entrar na faculdade de Direito, provavelmente já passou por uma destas situações:",
    "•O professor falou uma palavra completamente desconhecida e seguiu a aula como se todos já soubessem o significado.",
    "•Você abriu um livro e encontrou uma explicação cheia de outras palavras difíceis.",
    "•Sentiu vergonha de perguntar o que um termo significava por achar que a dúvida era \"básica demais\".",
    "Eu também passei por isso.",
    "Foi justamente por esse motivo que comecei a criar meu próprio dicionário, traduzindo o \"juridiquês\" para uma linguagem simples, com explicações que realmente faziam sentido para mim.",
    "Este material nasceu dessas anotações.",
    "A ideia não é substituir seus livros, muito menos o Vade Mecum. O objetivo é servir como um apoio rápido para que você compreenda os principais termos usados por professores, livros, tribunais e provas.",
    "Espero que este dicionário facilite a sua caminhada na faculdade tanto quanto facilitou a minha.",
    "Seja bem-vindo ao mundo do Direito.",
    "— Nicoly Ribeiro"
  ]
};

let verbetes = [
  {
    id: 1, letra:"A", termo:"Acórdão", categoria:"Essencial", frequencia:"muito_cobrado",
    definicao:"É a decisão proferida por um órgão colegiado de um tribunal, formada pelo voto de dois ou mais desembargadores ou ministros.",
    aula:"O Tribunal manteve a sentença por meio de um acórdão.",
    traduzindo:"Quando o caso é analisado por um grupo de desembargadores ou ministros juntos e eles tomam uma decisão conjunta, o resultado é chamado de acórdão.",
    exemplo:"Maria perdeu um processo e recorreu da decisão. Três desembargadores analisaram o caso, concordaram com o juiz e decidiram manter a sentença.",
    nao_confunda:["Sentença: decisão do juiz.","Despacho: ato que apenas movimenta o processo.","Decisão interlocutória: decisão do juiz durante o processo, sem encerrar a causa."],
    lembre_se:"Acórdão = decisão do Tribunal.",
    onde_ouvir:["Tribunal","Processo Civil","Processo Penal","Recursos","OAB","Concursos"],
    curiosidade:"A palavra acórdão vem do verbo acordar, no sentido de chegar a um acordo ou decisão conjunta, e não de \"parar de dormir\"."
  },
  {
    id: 2, letra:"A", termo:"Ação", categoria:"Essencial", frequencia:"muito_cobrado",
    definicao:"É o direito de provocar o Poder Judiciário para que ele analise um conflito e aplique o Direito ao caso concreto.",
    aula:"Toda pessoa tem direito de ação.",
    traduzindo:"É o ato de pedir que a Justiça resolva um problema. Sempre que alguém entra na Justiça para defender um direito, está propondo uma ação.",
    exemplo:"Pedro comprou um celular que nunca foi entregue. Como a loja não resolveu, ele entrou com uma ação para pedir o dinheiro de volta.",
    nao_confunda:["Processo: é o conjunto de atos que acontece depois que a ação é proposta."],
    lembre_se:"Ação = pedir que a Justiça analise um conflito.",
    onde_ouvir:["Tribunal","Processo Civil","Petição Inicial","OAB","Concursos","Dir. Constitucional"],
    curiosidade:"A Constituição garante o direito de ação no art. 5º, inciso XXXV."
  },
  {
    id: 3, letra:"A", termo:"Ação Civil Pública", categoria:"Importante", frequencia:"cobrado_frequencia",
    definicao:"É a ação usada para proteger direitos coletivos e difusos, como meio ambiente, consumidor e patrimônio público.",
    aula:"O Ministério Público ajuizou uma ação civil pública contra a empresa poluidora.",
    traduzindo:"É uma ferramenta usada para defender interesses de um grupo grande de pessoas de uma só vez, e não apenas de uma pessoa.",
    exemplo:"Uma fábrica polui um rio usado por toda a cidade. Em vez de cada morador entrar com uma ação individual, o Ministério Público propõe uma única ação.",
    nao_confunda:["Ação popular: pode ser proposta por qualquer cidadão.","Ação civil ordinária: defende interesse individual."],
    lembre_se:"Ação Civil Pública = defesa de interesses coletivos.",
    onde_ouvir:["Dir. Ambiental","Dir. do Consumidor","Ministério Público","Processo Civil","Concursos"],
    curiosidade:"É regulada pela Lei nº 7.347/1985, anterior ao Código de Defesa do Consumidor."
  }
];

let nextId = 4;
let editingId = null;

/* ======================================================================
   PERSISTENCIA LOCAL (localStorage — sem banco de dados, sem servidor)
   ====================================================================== */
const STORAGE_KEY = "descomplicando_juridiques_v1";

function loadFromStorage(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const saved = JSON.parse(raw);
    if(saved.meta) meta = saved.meta;
    if(Array.isArray(saved.verbetes)) verbetes = saved.verbetes;
    nextId = Math.max(0, ...verbetes.map(v=>v.id||0)) + 1;
    return true;
  }catch(err){
    console.warn("Não foi possível carregar os dados salvos:", err);
    return false;
  }
}

let saveTimeout = null;
function saveToStorage(){
  const statusEl = document.getElementById("saveStatus");
  const statusText = document.getElementById("saveStatusText");
  if(statusEl){ statusEl.classList.add("saving"); statusText.textContent = "Salvando..."; }
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({meta, verbetes}));
      if(statusEl){ statusEl.classList.remove("saving"); statusText.textContent = "Salvo automaticamente neste navegador"; }
    }catch(err){
      if(statusEl){ statusEl.classList.remove("saving"); statusText.textContent = "⚠ Não foi possível salvar (armazenamento cheio)"; }
    }
  }, 250);
}

function clearStorage(){
  if(!confirm("Isso vai apagar todos os verbetes e textos salvos neste navegador. Essa ação não pode ser desfeita.\n\nDica: clique em \"Exportar dados (JSON)\" antes, se quiser guardar uma cópia.\n\nContinuar mesmo assim?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

const FREQ_LABEL = {
  muito_cobrado: "🟢 MUITO COBRADO",
  cobrado_frequencia: "🟡 COBRADO COM FREQUÊNCIA",
  importante: "🔵 IMPORTANTE"
};

const LEGEND_ITEMS = [
  ["📖 DEFINIÇÃO JURÍDICA","A explicação técnica, de forma objetiva.","var(--navy)"],
  ["🎓 VOCÊ PODE OUVIR ISSO NA AULA","Um exemplo de como o professor pode usar o termo.","var(--blue)"],
  ["💡 TRADUZINDO","A ideia principal em palavras simples.","var(--gold)"],
  ["📝 EXEMPLO PRÁTICO","Uma situação do dia a dia para facilitar a compreensão.","var(--navy)"],
  ["⚠️ NÃO CONFUNDA COM...","Termos parecidos que costumam gerar dúvidas.","var(--red)"],
  ["🔖 LEMBRE-SE","Um resumo rápido para memorizar o conceito.","var(--gold)"],
  ["🎯 ONDE VOCÊ VAI OUVIR ISSO?","Os contextos (matérias, provas, tribunais) em que o termo aparece.","var(--blue)"],
  ["🟢🟡🔵 NÍVEL DE INCIDÊNCIA","Selo colorido no topo da página indicando o quanto o termo é cobrado.","var(--green)"],
];

/* ======================================================================
   HELPERS
   ====================================================================== */
function esc(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function nl2br(s){ return esc(s).replace(/\n/g,"<br>"); }

function groupByLetter(list){
  const sorted = [...list].sort((a,b)=> (a.letra+a.termo).localeCompare(b.letra+b.termo,'pt'));
  const map = {};
  sorted.forEach(e=>{ (map[e.letra] = map[e.letra]||[]).push(e); });
  return map;
}

/* ======================================================================
   RENDER DO LIVRO
   ====================================================================== */
function render(){
  saveToStorage();
  renderSidebarList();

  const grouped = groupByLetter(verbetes);
  const letters = Object.keys(grouped).sort((a,b)=>a.localeCompare(b,'pt'));

  // --- monta itens do indice (para paginar) ---
  const indexItems = [];
  letters.forEach(l=>{
    indexItems.push({type:"letter", letra:l});
    grouped[l].forEach(e=> indexItems.push({type:"entry", termo:e.termo, id:e.id}));
  });
  const ITEMS_PER_INDEX_PAGE = 68; // 2 colunas ~34 linhas cada, estimativa segura
  const indexPageCount = Math.max(1, Math.ceil(indexItems.length / ITEMS_PER_INDEX_PAGE));

  const FRONT_PAGES = 4; // capa, direitos, apresentacao, como usar
  let cursor = FRONT_PAGES + indexPageCount;

  // --- monta sequencia de paginas de conteudo (divisorias + verbetes) e atribui numero ---
  const contentPages = [];
  letters.forEach(l=>{
    cursor += 1;
    contentPages.push({type:"divider", letra:l, page:cursor, terms:grouped[l].map(e=>e.termo)});
    grouped[l].forEach(e=>{
      cursor += 1;
      contentPages.push({type:"term", entry:e, page:cursor});
      e._page = cursor;
    });
  });

  let html = "";
  html += pageCover();
  html += pageCopyright(2);
  html += pagePresentation(3);
  html += pageHowToUse(4);
  html += pageIndex(indexItems, letters, ITEMS_PER_INDEX_PAGE, FRONT_PAGES+1);
  contentPages.forEach(p=>{
    if(p.type === "divider") html += pageDivider(p.letra, p.terms, p.page);
    else html += pageTerm(p.entry, p.page);
  });

  document.getElementById("book").innerHTML = html;
  const totalPages = FRONT_PAGES + indexPageCount + contentPages.length;
  document.getElementById("pageCount").textContent = totalPages;
  if(typeof scalePagesForMobile === "function") scalePagesForMobile();
}

function footerHtml(pageNum, navy){
  return `<div class="pfooter">
    <p>© 2026 ${esc(meta.autora === "Nicoly Ribeiro" ? "Nicoly Alves Ribeiro" : meta.autora)}. Todos os direitos reservados. É proibida a reprodução, distribuição, compartilhamento ou comercialização, total ou parcial, deste material, sem autorização prévia e expressa da autora.</p>
    <div class="pnum">${pageNum}</div>
  </div>`;
}

function pageCover(){
  return `<div class="page">
    <div class="cover-band"><span>${esc(meta.colecao)}</span></div>
    <div class="cover-body">
      <svg class="scale-icon" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="5" x2="50" y2="55" stroke="#B78B3C" stroke-width="2.4"/>
        <line x1="12" y1="18" x2="88" y2="18" stroke="#B78B3C" stroke-width="2.4"/>
        <circle cx="12" cy="30" r="10" stroke="#B78B3C" stroke-width="2"/>
        <circle cx="88" cy="30" r="10" stroke="#B78B3C" stroke-width="2"/>
        <line x1="28" y1="55" x2="72" y2="55" stroke="#B78B3C" stroke-width="4.5"/>
      </svg>
      <h2>DESCOMPLICANDO</h2>
      <h1>O JURIDIQUÊS</h1>
      <hr class="hr-gold">
      <div class="cover-sub">${esc(meta.subtitulo)}</div>
      <div class="cover-cta">PARE DE DECORAR PALAVRAS DIFÍCEIS.<br>COMECE A ENTENDER O DIREITO.</div>
      <hr class="hr-gold">
      <div class="cover-author">Por ${esc(meta.autora)}</div>
    </div>
    <div class="cover-footer-icon">📖</div>
    <div class="cover-strip"></div>
  </div>`;
}

function pageCopyright(pnum){
  return `<div class="page">
    <div class="copyright-page">
      <div class="seal">C</div>
      <h2>DIREITOS AUTORAIS</h2>
      <div class="italic-intro">${esc(meta.titulo)} é uma obra intelectual protegida pela Lei nº 9.610, de 19 de fevereiro de 1998 (Lei de Direitos Autorais).</div>
      <div class="owner">© 2026 ${esc(meta.autora === "Nicoly Ribeiro" ? "Nicoly Alves Ribeiro" : meta.autora)}.</div>
      <div class="rights">Todos os direitos reservados.</div>
      <p class="legal">É proibida a reprodução, distribuição, compartilhamento, comercialização ou qualquer outra forma de utilização, total ou parcial, deste material, por qualquer meio, sem a autorização prévia e expressa da autora.</p>
      <p class="legal">Este material é destinado exclusivamente ao uso pessoal do comprador. O compartilhamento, a revenda ou a disponibilização em grupos e plataformas digitais constitui violação dos direitos autorais e poderá sujeitar o infrator às medidas legais cabíveis.</p>
      <p class="legal">A aquisição deste material não transfere ao comprador quaisquer direitos de propriedade intelectual sobre seu conteúdo.</p>
      <div class="bye">Boa leitura e bons estudos! ♡</div>
    </div>
    ${footerHtml(pnum)}
  </div>`;
}

function pagePresentation(pnum){
  const paras = meta.apresentacao.map(p=>{
    if(p.startsWith("•")) return `<li>${esc(p.slice(1))}</li>`;
    return `</ul><p>${esc(p)}</p><ul>`;
  }).join("");
  return `<div class="page">
    <div class="inst-header"><div class="inst-icon">i</div><h2>APRESENTAÇÃO</h2></div>
    <div class="inst-body"><ul style="list-style:none;padding-left:0;margin:0">${paras}</ul></div>
    ${footerHtml(pnum)}
  </div>`;
}

function pageHowToUse(pnum){
  const items = LEGEND_ITEMS.map(([label,desc,color])=>`
    <div class="legend-box"><div class="bar" style="background:${color}"></div><b>${label}</b><span>${esc(desc)}</span></div>
  `).join("");
  return `<div class="page">
    <div class="inst-header"><div class="inst-icon" style="background:var(--gold);color:var(--navy)">♡</div><h2>COMO USAR ESTE DICIONÁRIO</h2></div>
    <p style="font-size:9.6pt;line-height:1.55;margin-bottom:16px">Este material foi organizado em ordem alfabética para facilitar a consulta durante as aulas e os estudos. Cada verbete segue a mesma estrutura:</p>
    ${items}
    ${footerHtml(pnum)}
  </div>`;
}

function pageIndex(items, letters, perPage, startPageNum){
  const pages = [];
  for(let i=0;i<items.length;i+=perPage) pages.push(items.slice(i,i+perPage));
  if(pages.length===0) pages.push([]);

  return pages.map((chunk,pi)=>{
    const half = Math.ceil(chunk.length/2);
    const col1 = chunk.slice(0,half), col2 = chunk.slice(half);
    const renderCol = (col)=> col.map(it=>{
      if(it.type==="letter") return `<div class="index-letter">${esc(it.letra)}</div>`;
      const entry = verbetes.find(e=>e.id===it.id);
      const pg = entry ? entry._page : "-";
      return `<div class="index-item"><span>${esc(it.termo)}</span><span class="dots"></span><span class="pg">${pg}</span></div>`;
    }).join("");
    return `<div class="page">
      ${pi===0 ? `<div class="inst-header"><div class="inst-icon">≡</div><h2>ÍNDICE ALFABÉTICO</h2></div>` : `<div style="height:8mm"></div>`}
      <div class="index-cols"><div>${renderCol(col1)}</div><div>${renderCol(col2)}</div></div>
      ${footerHtml(startPageNum+pi)}
    </div>`;
  }).join("");
}

function pageDivider(letra, terms, pnum){
  const shown = terms.slice(0,10);
  const more = terms.length>shown.length ? `<div class="more">... e muito mais!</div>` : "";
  const desc = letra==="A" ? "A primeira letra do seu vocabulário jurídico." : `Mais um passo no seu vocabulário jurídico: a letra ${letra}.`;
  return `<div class="page navy">
    <div class="divider-frame">
      <div class="big-letter">${esc(letra)}</div>
      <hr class="hr-gold-sm">
      <div class="desc">${esc(desc)}</div>
      <div class="subtitle">Nesta seção você encontrará<br>termos como:</div>
      <div class="term-list">${shown.map(t=>esc(t)).join("<br>")}</div>
      ${more}
    </div>
    ${footerHtml(pnum,true)}
  </div>`;
}

function box(icon,title,color,bodyHtml,cls){
  return `<div class="tbox">
    <div class="thead"><span class="sq" style="background:${color}"></span>${icon} ${esc(title)}</div>
    <div class="tbody ${cls||''}">${bodyHtml}</div>
  </div>`;
}

function pageTerm(e,pnum){
  const freqKey = e.frequencia || "importante";
  const naoConfunda = (e.nao_confunda||[]).map(i=>`<li>${esc(i)}</li>`).join("");
  const ondeItems = (e.onde_ouvir||[]).map(c=>`<div>${esc(c)}</div>`).join("");

  const boxes = [
    e.definicao ? box("📖","Definição Jurídica","var(--navy)", esc(e.definicao)) : "",
    e.aula ? box("🎓","Você Pode Ouvir Isso na Aula","var(--blue)", `"${esc(e.aula)}"`, "italic") : "",
    e.traduzindo ? box("💡","Traduzindo","var(--gold)", esc(e.traduzindo)) : "",
    e.exemplo ? box("📝","Exemplo Prático","var(--navy)", esc(e.exemplo)) : "",
    (e.nao_confunda && e.nao_confunda.length) ? box("⚠️","Não Confunda Com...","var(--red)", `<ul>${naoConfunda}</ul>`) : "",
    e.lembre_se ? box("🔖","Lembre-se","var(--gold)", esc(e.lembre_se), "bold") : "",
  ].join("");

  const ondeBox = (e.onde_ouvir && e.onde_ouvir.length) ? `
    <div class="onde-box">
      <div class="thead">🎯 ONDE VOCÊ VAI OUVIR ISSO?</div>
      <div class="onde-grid">${ondeItems}</div>
    </div>` : "";

  return `<div class="page">
    <div class="term-header">
      <div class="term-letter">${esc(e.letra)}</div>
      <div class="term-title">${esc(e.termo).toUpperCase()}</div>
      <div class="freq-badge ${freqKey}">${FREQ_LABEL[freqKey]}</div>
    </div>
    ${e.categoria ? `<div class="cat-chip">${esc(e.categoria).toUpperCase()}</div>` : `<div style="margin-bottom:14px"></div>`}

    <div class="term-grid">
      ${boxes}
    </div>

    ${ondeBox}

    ${e.curiosidade ? `<div class="curio-box"><div class="thead">💬 CURIOSIDADE</div><div class="tbody">${esc(e.curiosidade)}</div></div>` : ""}
    ${footerHtml(pnum)}
  </div>`;
}

/* ======================================================================
   SIDEBAR: lista de verbetes
   ====================================================================== */
function renderSidebarList(){
  const el = document.getElementById("entryList");
  document.getElementById("countBadge").textContent = verbetes.length + (verbetes.length===1 ? " verbete" : " verbetes");
  if(verbetes.length===0){
    el.innerHTML = `<div class="empty-hint">Nenhum verbete ainda.<br>Clique em "+ Novo verbete" para começar.</div>`;
    return;
  }
  const sorted = [...verbetes].sort((a,b)=> (a.letra+a.termo).localeCompare(b.letra+b.termo,'pt'));
  el.innerHTML = sorted.map(e=>`
    <div class="entry-row">
      <span class="et"><span class="letra-chip">${esc(e.letra)}</span><span class="freq-dot ${e.frequencia}"></span>${esc(e.termo)}</span>
      <span class="actions">
        <button class="secondary" onclick="openEntryModal(${e.id})">Editar</button>
        <button class="danger" onclick="deleteEntry(${e.id})">✕</button>
      </span>
    </div>
  `).join("");
}

/* ======================================================================
   MODAL: VERBETE
   ====================================================================== */
function openEntryModal(id){
  editingId = id || null;
  document.getElementById("entryModalTitle").textContent = id ? "Editar verbete" : "Novo verbete";
  const e = id ? verbetes.find(v=>v.id===id) : null;
  document.getElementById("f_termo").value = e ? e.termo : "";
  document.getElementById("f_letra").value = e ? e.letra : "";
  document.getElementById("f_categoria").value = e ? (e.categoria||"") : "";
  document.getElementById("f_frequencia").value = e ? e.frequencia : "muito_cobrado";
  document.getElementById("f_definicao").value = e ? e.definicao : "";
  document.getElementById("f_aula").value = e ? e.aula : "";
  document.getElementById("f_traduzindo").value = e ? e.traduzindo : "";
  document.getElementById("f_exemplo").value = e ? e.exemplo : "";
  document.getElementById("f_nao_confunda").value = e ? (e.nao_confunda||[]).join("\n") : "";
  document.getElementById("f_lembre_se").value = e ? e.lembre_se : "";
  document.getElementById("f_onde_ouvir").value = e ? (e.onde_ouvir||[]).join(", ") : "";
  document.getElementById("f_curiosidade").value = e ? e.curiosidade : "";
  document.getElementById("entryModalOverlay").classList.add("open");
}
function closeEntryModal(){ document.getElementById("entryModalOverlay").classList.remove("open"); }

function saveEntry(){
  const termo = document.getElementById("f_termo").value.trim();
  if(!termo){ alert("Por favor, preencha o campo Termo."); return; }
  let letra = document.getElementById("f_letra").value.trim().toUpperCase();
  if(!letra) letra = termo.trim()[0].toUpperCase();

  const data = {
    letra, termo,
    categoria: document.getElementById("f_categoria").value.trim(),
    frequencia: document.getElementById("f_frequencia").value,
    definicao: document.getElementById("f_definicao").value.trim(),
    aula: document.getElementById("f_aula").value.trim(),
    traduzindo: document.getElementById("f_traduzindo").value.trim(),
    exemplo: document.getElementById("f_exemplo").value.trim(),
    nao_confunda: document.getElementById("f_nao_confunda").value.split("\n").map(s=>s.trim()).filter(Boolean),
    lembre_se: document.getElementById("f_lembre_se").value.trim(),
    onde_ouvir: document.getElementById("f_onde_ouvir").value.split(",").map(s=>s.trim()).filter(Boolean),
    curiosidade: document.getElementById("f_curiosidade").value.trim(),
  };

  if(editingId){
    const idx = verbetes.findIndex(v=>v.id===editingId);
    verbetes[idx] = {...verbetes[idx], ...data};
  } else {
    verbetes.push({id: nextId++, ...data});
  }
  closeEntryModal();
  render();
  if(window.innerWidth <= 900) toggleSidebar(false);
}

function deleteEntry(id){
  if(!confirm("Remover este verbete?")) return;
  verbetes = verbetes.filter(v=>v.id!==id);
  render();
}

/* ======================================================================
   MODAL: META (CAPA / APRESENTACAO)
   ====================================================================== */
function openMetaModal(){
  document.getElementById("m_colecao").value = meta.colecao;
  document.getElementById("m_titulo").value = meta.titulo;
  document.getElementById("m_subtitulo").value = meta.subtitulo;
  document.getElementById("m_autora").value = meta.autora;
  document.getElementById("m_apresentacao").value = meta.apresentacao.join("\n");
  document.getElementById("metaModalOverlay").classList.add("open");
}
function closeMetaModal(){ document.getElementById("metaModalOverlay").classList.remove("open"); }
function saveMeta(){
  meta.colecao = document.getElementById("m_colecao").value.trim();
  meta.titulo = document.getElementById("m_titulo").value.trim();
  meta.subtitulo = document.getElementById("m_subtitulo").value.trim();
  meta.autora = document.getElementById("m_autora").value.trim();
  meta.apresentacao = document.getElementById("m_apresentacao").value.split("\n").filter(l=>l.trim()!=="");
  closeMetaModal();
  render();
}

/* ======================================================================
   IMPORTAR / EXPORTAR JSON
   ====================================================================== */
function exportJSON(){
  const payload = {meta, verbetes};
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "dicionario_juridico_dados.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importJSON(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(){
    try{
      const payload = JSON.parse(reader.result);
      if(payload.meta) meta = payload.meta;
      if(payload.verbetes){
        verbetes = payload.verbetes;
        nextId = Math.max(0,...verbetes.map(v=>v.id||0)) + 1;
      }
      render();
    }catch(err){
      alert("Não foi possível ler este arquivo JSON. Verifique se ele foi exportado por este gerador.");
    }
  };
  reader.readAsText(file);
  evt.target.value = "";
}

/* ======================================================================
   GERAR PDF DE VERDADE (baixa direto, sem passar pela caixa de impressão)
   Captura cada página separadamente e monta o PDF juntando as imagens.
   (Tirar uma única "foto" do livro inteiro estoura o limite de tamanho
   de imagem do navegador em dicionários grandes, causando páginas em
   branco e itens sumindo — por isso a captura é feita página por página.)
   ====================================================================== */
async function generatePDF(){
  const btns = document.querySelectorAll(".pdf-trigger");
  btns.forEach(b=>{ b.dataset.orig = b.textContent; b.disabled = true; });

  // gera sempre a partir do tamanho real da página (sem a escala usada no celular).
  // IMPORTANTE: no celular, cada página fica dentro de uma "moldura" com
  // overflow:hidden (pra caber na tela). Só limpar o tamanho dela não bastava —
  // a moldura continuava cortando a página na hora da captura. Por isso agora
  // ela é removida por completo (a página volta a ser filha direta de #book).
  const wasMobile = window.innerWidth <= 900;
  document.querySelectorAll("#book .page").forEach(p=>{ p.style.transform = ""; p.style.height = "297mm"; });
  document.querySelectorAll("#book .page-scale-wrap").forEach(wrap=>{
    const page = wrap.querySelector(".page");
    if(page && wrap.parentNode){
      wrap.parentNode.insertBefore(page, wrap);
      wrap.remove();
    }
  });

  const pages = Array.from(document.querySelectorAll("#book .page"));
  if(pages.length === 0){
    btns.forEach(b=>{ b.textContent = b.dataset.orig; b.disabled = false; });
    return;
  }
  const scrollContainer = document.querySelector(".main");
  const originalScrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;

  try{
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    // espera as fontes carregarem de verdade antes de tirar qualquer "foto"
    if(document.fonts && document.fonts.ready){
      try{ await document.fonts.ready; }catch(e){}
    }

    for(let i=0;i<pages.length;i++){
      btns.forEach(b=>{ b.textContent = `Gerando PDF... (${i+1}/${pages.length})`; });

      // no celular (e às vezes no computador), o navegador só termina de "pintar"
      // um trecho da página quando ele passa a ficar visível na tela — por isso
      // rolamos até a página antes de fotografar, e esperamos 2 frames de desenho
      pages[i].scrollIntoView({ block: "start", behavior: "instant" });
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

      const canvas = await html2canvas(pages[i], {
        scale: 2, useCORS: true, allowTaint: true, logging: false,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      if(i > 0) pdf.addPage("a4","portrait");
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    }

    const filename = (meta.titulo || "dicionario-juridico")
      .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"") + ".pdf";
    pdf.save(filename);
  }catch(err){
    console.error(err);
    alert("Não foi possível gerar o PDF automaticamente. Tente novamente em alguns segundos.");
  }finally{
    document.querySelectorAll("#book .page").forEach(p=>{ p.style.height = ""; });
    btns.forEach(b=>{ b.textContent = b.dataset.orig; b.disabled = false; });
    if(scrollContainer) scrollContainer.scrollTop = originalScrollTop; else window.scrollTo(0, originalScrollTop);
    if(wasMobile) scalePagesForMobile();
  }
}

/* ======================================================================
   MOBILE: abrir/fechar editor + encolher páginas A4 para caber na tela
   ====================================================================== */
function toggleSidebar(force){
  const panel = document.getElementById("sidebarPanel");
  const backdrop = document.getElementById("sidebarBackdrop");
  const open = typeof force === "boolean" ? force : !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
}

const MM_TO_PX = 96/25.4; // 1mm em pixels (96dpi, padrão CSS)
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

function scalePagesForMobile(){
  const isMobile = window.innerWidth <= 900;
  const pages = document.querySelectorAll("#book .page");
  if(!isMobile){
    pages.forEach(p=>{
      p.style.transform = "";
      const wrap = p.parentElement;
      if(wrap && wrap.classList.contains("page-scale-wrap")){
        wrap.style.height = "";
        wrap.style.width = "";
      }
    });
    return;
  }
  const pageWidthPx = PAGE_WIDTH_MM * MM_TO_PX;
  const pageHeightPx = PAGE_HEIGHT_MM * MM_TO_PX;
  const available = document.querySelector(".main").clientWidth - 16; // pequena margem
  const scale = Math.min(1, available / pageWidthPx);
  pages.forEach(p=>{
    p.style.transform = `scale(${scale})`;
    let wrap = p.parentElement;
    if(!wrap || !wrap.classList.contains("page-scale-wrap")){
      wrap = document.createElement("div");
      wrap.className = "page-scale-wrap";
      p.parentNode.insertBefore(wrap, p);
      wrap.appendChild(p);
    }
    // a wrapper fica exatamente do tamanho final (já escalado) e centraliza sozinha,
    // já que a página em si continua com o tamanho A4 original antes da transformação
    wrap.style.width = (pageWidthPx * scale) + "px";
    wrap.style.height = (pageHeightPx * scale) + "px";
  });
}
window.addEventListener("resize", scalePagesForMobile);
window.addEventListener("orientationchange", scalePagesForMobile);

/* init */
const hadSavedData = loadFromStorage();
render();
if(!hadSavedData) saveToStorage(); // primeira visita: já grava os exemplos iniciais
scalePagesForMobile();
